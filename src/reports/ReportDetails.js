import { Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import PageHeader from "common/PageHeader";
import { useParams } from "react-router-dom";
import { nimbleX360ReportApi } from "./ReportStoreQuerySlice";
import { DateConfig, RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import { useFormik } from "formik";
import * as yup from "yup";
import { getTextFieldFormikProps } from "common/Utils";
import { useEffect, useMemo, useState } from "react";
import useDataRef from "hooks/useDataRef";
import { DatePicker } from "@mui/lab";
import dfnFormat from "date-fns/format";
import DynamicTable from "common/DynamicTable";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import { useSnackbar } from "notistack";

function ReportDetails(props) {
  const { R_reportListing, R_reportCategory, id } = useParams();
  const [isExportCSV, SetIsExportCSV] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [runReportMutation, runReportMutationResult] =
    nimbleX360ReportApi.useRunReportMutation();
  const [exportReportMutation, exportReportMutationResult] =
    nimbleX360ReportApi.useExportReportMutation();

  const reportQueryResult = nimbleX360ReportApi.useGetReportsQuery(
    {
      R_reportCategory,
    },
    {
      selectFromResult: (state) => ({
        ...state,
        data: state?.data?.find((report) => report.report_id == id),
      }),
    }
  );

  const report = reportQueryResult?.data;

  const { data, isLoading, isError, refetch } =
    nimbleX360ReportApi.useGetReportsByIdQuery({
      R_reportListing: `'${R_reportListing}'`,
    });

  const formConfig = data?.data;

  const { initialValues, validationSchema, normalizedFormConfigRow } = useMemo(
    () =>
      formConfig?.reduce(
        (acc, curr) => {
          let schema = {
            number: yup.mixed(),
            string: yup.string(),
            boolean: yup.boolean(),
          }[curr.row[4]];

          if (curr.row[6] === "Y") {
            schema = schema?.required();
          }

          acc.validationSchema[curr.row[1]] = schema;
          acc.initialValues[curr.row[1]] =
            { "n/a": "", undefined: curr.row[5] }[curr.row[5]] || "";
          acc.normalizedFormConfigRow[curr.row[0]] = curr;
          return acc;
        },
        { initialValues: {}, validationSchema: {}, normalizedFormConfigRow: {} }
      ) || {},
    [formConfig]
  );

  const formik = useFormik({
    initialValues: {},
    validationSchema: yup.object(validationSchema || {}),
    onSubmit: async ({
      "output-type": outputType,
      officeId,
      loanOfficerId,
      ...values
    }) => {
      try {
        const run = isExportCSV ? exportReportMutation : runReportMutation;
        console.log(`isExportCSV`, isExportCSV);
        const data = await run({
          R_reportListing,
          ...Object.keys(values).reduce((acc, key) => {
            acc[`R_${key}`] =
              values[key] instanceof Date
                ? dfnFormat(values[key], DateConfig.FORMAT_REPORTS)
                : values[key];
            return acc;
          }, {}),
          "output-type": outputType,
          dateFormat: DateConfig.FORMAT_REPORTS,
          locale: "en",
          exportCSV: isExportCSV,
          ...(report.report_type === `Pentaho`
            ? {
                R_branch: officeId,
                tenantIdentifier: `default`,
                R_loanOfficer: loanOfficerId,
              }
            : { R_officeId: officeId, R_loanOfficerId: loanOfficerId }),
        }).unwrap();
        console.log("Date from run >>> ", data);
        enqueueSnackbar(
          isExportCSV
            ? "Success exporting report!"
            : "Success generating report!",
          { variant: "success" }
        );
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.[0]?.defaultUserMessage || isExportCSV
            ? ""
            : "Failure generating report!",
          { variant: "error" }
        );
      }
    },
  });

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    dataRef.current.formik.setValues(initialValues);
  }, [dataRef, initialValues]);

  const formFieldProps = {
    formik,
    formConfig,
    normalizedFormConfigRow,
  };

  const columns = useMemo(() => {
    return (
      runReportMutationResult?.data?.columnHeaders.map((item, index) => ({
        Header: item.columnName,
        accessor: `row.${index}`,
      })) || []
    );
  }, [runReportMutationResult?.data?.columnHeaders]);

  const reportResult = runReportMutationResult?.data?.data;

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: reportResult,
    manualPagination: true,
    dataCount: data?.totalFilteredRecords,
  });

  return (
    <>
      <PageHeader
        title="Reports"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Reports", to: RouteEnum.REPORT },
          {
            name: "Run Report",
          },
        ]}
      ></PageHeader>
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <Paper className="p-4 md:p-8 mb-4">
            <Typography variant="h6" className="font-bold">
              {R_reportListing}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="max-w-sm mb-4"
            >
              Use the form below to run report for{" "}
              <strong>{R_reportListing}</strong>
            </Typography>
            <div className="max-w-3xl grid gap-4 sm:grid-cols-2 mb-4">
              {formConfig?.map((item) => {
                return <ReportFormField item={item} {...formFieldProps} />;
              })}
              {report?.report_type === "Pentaho" ? (
                <>
                  <TextField
                    select
                    label="Output Type"
                    {...getTextFieldFormikProps(formik, "output-type")}
                  >
                    {outputType.map((options) => (
                      <MenuItem key={options?.id} value={options?.value}>
                        {options?.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Decimal Places"
                    // {...getTextFieldFormikProps(formik, 'decimalplaces')}
                  >
                    {decimalPlaces.map((options) => (
                      <MenuItem key={options?.id} value={options?.value}>
                        {options?.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              ) : (
                <>
                  <TextField
                    select
                    label="Decimal Places"
                    // {...getTextFieldFormikProps(formik, 'decimalplaces')}
                  >
                    {decimalPlaces.map((options) => (
                      <MenuItem key={options?.id} value={options?.value}>
                        {options?.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
            </div>
            <div className="flex justify-center items-center">
              <Button
                color="error"
                onClick={() => {
                  SetIsExportCSV(false);
                  formik.handleSubmit();
                }}
              >
                Run Report
              </Button>
            </div>
          </Paper>
        )}
      </LoadingContent>

      {reportResult && (
        <Paper className="p-4">
          <div className="flex flex-row">
            <div className=""></div>
            <div className="flex-1" />
            <Button
              className="mt-0 mb-4"
              color="primary"
              onClick={() => {
                SetIsExportCSV(true);
                formik.handleSubmit();
              }}
            >
              Export Report
            </Button>
          </div>
          <DynamicTable
            instance={tableInstance}
            loading={isLoading}
            error={isError}
            onReload={refetch}
          />
        </Paper>
      )}
    </>
  );
}
export default ReportDetails;

function ReportFormField({
  item,
  formik,
  formConfig,
  normalizedFormConfigRow,
}) {
  const parent = normalizedFormConfigRow?.[item.row[8]];

  const selectOptionsQueryResult =
    nimbleX360ReportApi.useGetReportSelectOptionsQuery(
      {
        pathVarable: item.row[0],
        ...(!!parent
          ? { [`R_${parent?.row?.[1]}`]: formik.values?.[parent?.row?.[1]] }
          : {}),
      },
      {
        skip: !(
          (item.row[3] === "select" || item.row[3] === "none") &&
          (parent ? !!formik.values?.[parent?.row?.[1]] : true)
        ),
      }
    );

  const selectOptions = useMemo(() => {
    if (selectOptionsQueryResult?.data?.data?.length) {
      const options = [
        ...(!item.row[1] === "officerId" ? [] : [{ row: [-1, "All"] }]),
        ...selectOptionsQueryResult?.data?.data,
      ];
      return options;
    }

    return [];
  }, [item.row, selectOptionsQueryResult?.data?.data]);

  switch (item.row[3]) {
    case "select":
    case "none":
      return (
        <TextField
          select
          label={item.row[2]}
          {...getTextFieldFormikProps(formik, item.row[1])}
        >
          {selectOptions?.map(({ row }) => (
            <MenuItem key={row[0]} value={row[0]}>
              {row[1]}
            </MenuItem>
          ))}
        </TextField>
      );
    case "date":
      return (
        <DatePicker
          label={item.row[2]}
          value={formik.values?.[item.row[1]]}
          onChange={(newValue) => {
            formik.setFieldValue(item.row[1], newValue);
          }}
          renderInput={(params) => (
            <TextField
              fullWidth
              required
              {...getTextFieldFormikProps(formik, item.row[1])}
              {...params}
            />
          )}
        />
      );
    default:
      return (
        <>
          <TextField
            label={item.row[2]}
            {...getTextFieldFormikProps(formik, item.row[1])}
          />
        </>
      );
  }
}

const outputType = [
  {
    id: 1,
    name: "Normal Format",
    value: "HTML",
  },
  {
    id: 2,
    name: "Excel Format",
    value: "XLS",
  },
  {
    id: 3,
    name: "Excel 2007 Format",
    value: "XLSX",
  },
  {
    id: 4,
    name: "CSV Format",
    value: "CSV",
  },
  {
    id: 5,
    name: "PDF Format",
    value: "PDF",
  },
];

const decimalPlaces = [
  {
    id: 1,
    value: "4",
  },
  {
    id: 2,
    value: "3",
  },
  {
    id: 3,
    value: "2",
  },
  {
    id: 4,
    value: "1",
  },
  {
    id: 5,
    value: "0",
  },
];
