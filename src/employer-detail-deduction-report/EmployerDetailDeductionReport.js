import { DatePicker, LoadingButton } from "@mui/lab";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import DynamicTable from "common/DynamicTable";
import {
  getCheckFieldFormikProps,
  getTextFieldFormikProps,
} from "common/Utils";
import { useFormik } from "formik";
import useTable from "hooks/useTable";
import { nxEmployerDetailDeductionReportApi } from "./EmployerDetailDeductionReportStoreSlice";
import * as dfns from "date-fns";
import { DateConfig } from "common/Constants";
import { useSnackbar } from "notistack";
import CurrencyTypography from "common/CurrencyTypography";

function EmployerDetailDeductionReport(props) {
  const { employerId, subEmployerId = "", loanProductId = "" } = props;

  const { enqueueSnackbar } = useSnackbar();

  const loanProductsQueryResult =
    nxEmployerDetailDeductionReportApi.useGetEmployerEDRLoanProductsQuery({
      // offset,
      // limit,
      // ...(debouncedQ
      //   ? {
      //       name: debouncedQ,
      //     }
      //   : {}),
    });

  const formik = useFormik({
    initialValues: {
      dateFormat: DateConfig.SPACE_dd_MM_yyyy,
      locale: DateConfig.LOCALE,
      startPeriod: null,
      endPeriod: null,
      employerId,
      subEmployerId,
      loanProductId,
      includeUnpaidAmount: false,
    },
  });

  const isFormFilled =
    formik.values.startPeriod &&
    formik.values.endPeriod &&
    formik.values.employerId &&
    formik.values.loanProductId;

  const params = isFormFilled
    ? {
        ...formik.values,
        fileName: "employer-deduction-report",
        startPeriod: dfns.format(
          formik.values.startPeriod,
          DateConfig.SPACE_dd_MM_yyyy
        ),
        endPeriod: dfns.format(
          formik.values.endPeriod,
          DateConfig.SPACE_dd_MM_yyyy
        ),
      }
    : {};

  const { isLoading, isError, data, refetch } =
    nxEmployerDetailDeductionReportApi.useGenerateEmployerDeductionQuery(
      params,
      {
        skip: !isFormFilled,
      }
    );

  const [
    downloadEmployerDeductionMutation,
    downloadEmployerDeductionMutationResult,
  ] = nxEmployerDetailDeductionReportApi.useDownloadEmployerDeductionMutation();

  const tableInstance = useTable({ columns, data });

  async function handleDownload() {
    try {
      const data = await downloadEmployerDeductionMutation(params).unwrap();
      enqueueSnackbar("Template Downloaded", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Template Downloaded", { variant: "error" });
    }
  }

  return (
    <Paper>
      <div className="flex items-center gap-2 p-2">
        <div className="flex-1" />
        <FormControlLabel
          label="Include Unpaid Amount"
          control={
            <Checkbox
              {...getCheckFieldFormikProps(formik, "includeUnpaidAmount")}
            />
          }
        />
        <TextField
          label="Loan Product"
          select
          size="small"
          {...getTextFieldFormikProps(formik, "loanProductId")}
          style={{ minWidth: 200 }}
        >
          {loanProductsQueryResult.data?.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>
        <DatePicker
          disableFuture
          label="Start Date"
          value={formik.values.startPeriod}
          onChange={(newValue) => {
            formik.setFieldValue("startPeriod", newValue);
          }}
          renderInput={(params) => (
            <TextField
              size="small"
              {...getTextFieldFormikProps(formik, "startPeriod")}
              {...params}
            />
          )}
        />
        <DatePicker
          disableFuture
          minDate={formik.values.startPeriod}
          label="Close Date"
          value={formik.values.endPeriod}
          onChange={(newValue) => {
            formik.setFieldValue("endPeriod", newValue);
          }}
          renderInput={(params) => (
            <TextField
              size="small"
              {...getTextFieldFormikProps(formik, "endPeriod")}
              {...params}
            />
          )}
        />
        <LoadingButton
          disabled={
            isLoading ||
            !isFormFilled ||
            downloadEmployerDeductionMutationResult.isLoading
          }
          onClick={handleDownload}
          loading={downloadEmployerDeductionMutationResult.isLoading}
          loadingPosition="end"
          endIcon={<></>}
        >
          Download
        </LoadingButton>
      </div>
      <DynamicTable
        instance={tableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
      />
    </Paper>
  );
}

export default EmployerDetailDeductionReport;

const columns = [
  {
    Header: "Employee Name",
    accessor: (row) => `${row.clientInformation?.firstname || ""} ${row.clientInformation?.lastname || ""}`,
  },
  {
    Header: "Deduction Amount",
    accessor: "deductionAmount",
    Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
  },
];
