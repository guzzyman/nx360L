import { useMemo, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Checkbox,
  Icon,
  IconButton,
} from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { LoadingButton, DatePicker } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360FloatingRateApi } from "./FloatingRateProductStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";
import useTable from "hooks/useTable";
import {
  getTextFieldFormikProps,
  getCheckFieldFormikProps,
} from "common/Utils";
import dfnFormat from "date-fns/format";
import { DateConfig } from "common/Constants";

function FloatingRateCreateEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = !!id;

  const [addFloatingRateMutation] =
    nimbleX360FloatingRateApi.useAddFloatingRatesMutation();

  const [updateFloatingRateMutation] =
    nimbleX360FloatingRateApi.useUpdateFloatingRatesMutation();

  const floatingRateQueryResult =
    nimbleX360FloatingRateApi.useGetFloatingRatesByIdQuery(id, {
      skip: !isEdit,
    });

  const floatingRate = floatingRateQueryResult?.data;

  const formik = useFormik({
    initialValues: {
      name: "",
      isBaseLendingRate: false,
      isActive: false,
      ratePeriods: [],
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      name: yup.string().trim().required(),
      isBaseLendingRate: yup.boolean().required(),
      isActive: yup.boolean().required(),
    }),
    onSubmit: async (values) => {
      try {
        const func = isEdit
          ? updateFloatingRateMutation
          : addFloatingRateMutation;
        await func({
          id,
          ...values,
          ratePeriods: values.ratePeriods.map((period) => ({
            ...period,
            fromDate: dfnFormat(period.fromDate, DateConfig.FORMAT),
          })),
        }).unwrap();
        enqueueSnackbar(
          isEdit ? "Floating Rate Updated" : "Floating Rate Created",
          { variant: "success" }
        );
        navigate(-1);
      } catch (error) {
        enqueueSnackbar(
          isEdit
            ? (
              <div>
                {error?.data?.errors?.map((error, key) => (
                  <Typography key={key}>{error?.defaultUserMessage}</Typography>
                ))}
              </div>
            )
            : (
              <div>
                {error?.data?.errors?.map((error, key) => (
                  <Typography key={key}>{error?.defaultUserMessage}</Typography>
                ))}
              </div>
            ),
          { variant: "error" }
        );
      }
    },
  });

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (isEdit) {
      dataRef.current.formik.setValues({
        name: floatingRate?.name || "",
        isBaseLendingRate: floatingRate?.isBaseLendingRate || false,
        isActive: floatingRate?.isActive || false,
        ratePeriods:
          floatingRate?.ratePeriods?.map((rate) => ({
            ...defaultRatePeriod,
            fromDate: new Date(rate.fromDate),
            interestRate: rate.interestRate || "",
            isDifferentialToBaseLendingRate:
              rate.isDifferentialToBaseLendingRate || false,
            locale: DateConfig.LOCALE,
            dateFormat: DateConfig.FORMAT,
          })) || [],
      });
    }
  }, [dataRef, floatingRate, isEdit]);

  const columns = useMemo(
    () => [
      {
        Header: "From Date",
        accessor: "fromDate",
        Cell: ({ row }) => (
          <DatePicker
            disablePast
            label="From Date"
            value={
              dataRef.current.formik.values?.ratePeriods[row.index]?.fromDate
            }
            onChange={(newValue) => {
              dataRef.current.formik.setFieldValue(
                `ratePeriods[${row.index}].fromDate`,
                newValue
              );
            }}
            renderInput={(params) => (
              <TextField
                fullWidth
                margin="normal"
                required
                {...getTextFieldFormikProps(
                  dataRef.current.formik,
                  `ratePeriods[${row.index}].fromDate`
                )}
                {...params}
              />
            )}
          />
        ),
      },
      {
        Header: "Interest Rate",
        accessor: "interestRate",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            className="mt-2"
            label="Interest Rate"
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `ratePeriods[${row.index}].interestRate`
            )}
            type="number"
          />
        ),
      },
      {
        Header: "Is Differential?",
        accessor: "isDifferentialToBaseLendingRate",
        Cell: ({ row }) => (
          <Switch
            {...getCheckFieldFormikProps(
              dataRef.current.formik,
              `ratePeriods[${row.index}].isDifferentialToBaseLendingRate`
            )}
          />
        ),
        Width: "200px",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              const newRatePeriods = [
                ...dataRef.current.formik.values["ratePeriods"],
              ];
              newRatePeriods.splice(row.index, 1);
              dataRef.current.formik.setFieldValue(
                "ratePeriods",
                newRatePeriods
              );
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef]
  );

  const tableInstance = useTable({
    columns,
    data: formik.values.ratePeriods,
  });

  return (
    <>
      <PageHeader
        title={"Create Floating Rates"}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Products", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          {
            name: "Floating Rates",
            to: RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES,
          },
          {
            name: isEdit ? "Update Floating Rate" : "Create Floating Rate",
          },
        ]}
      />

      <LoadingContent
        loading={floatingRateQueryResult.isLoading}
        error={floatingRateQueryResult.isError}
        onReload={floatingRateQueryResult.refetch}
      >
        {() => (
          <form
            className="w-full flex justify-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="max-w-full w-full">
              <Paper className="p-4 md:p-8 mb-4">
                <Typography variant="h6" className="font-bold">
                  Create Floating Rates
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Ensure you enter correct information.
                </Typography>
                <div className="max-w-3xl grid gap-4 sm:grid-cols-2 md:grid-cols-2 mb-4">
                  <TextField
                    fullWidth
                    label="Floating Rate Name"
                    className="col-span-2"
                    {...formik.getFieldProps("name")}
                    error={!!formik.touched.name && formik.errors.name}
                    helperText={!!formik.touched.name && formik.errors.name}
                  />
                  <FormControlLabel
                    label="Is this a base lending rate?"
                    control={
                      <Checkbox
                        checked={formik.values?.isBaseLendingRate}
                        onChange={(event) => {
                          formik.setFieldValue(
                            "isBaseLendingRate",
                            event.target.checked
                          );
                        }}
                        value={formik.values?.isBaseLendingRate}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Active"
                    control={
                      <Checkbox
                        checked={formik.values?.isActive}
                        onChange={(event) => {
                          formik.setFieldValue(
                            "isActive",
                            event.target.checked
                          );
                        }}
                        value={formik.values?.isActive}
                      />
                    }
                  />
                </div>
              </Paper>
              <Paper className="p-4 md:p-8 mb-4">
                <div className="flex flex-row gap-3 mb-4">
                  <Typography variant="h6" className="font-bold">
                    Floating Rates Periods
                  </Typography>
                  <Button
                    startIcon={<Icon>add</Icon>}
                    onClick={() =>
                      formik.setFieldValue("ratePeriods", [
                        ...dataRef.current.formik.values.ratePeriods,
                        { ...defaultRatePeriod },
                      ])
                    }
                  >
                    Add
                  </Button>
                </div>
                <DynamicTable instance={tableInstance} />
              </Paper>
              <div className="flex items-center justify-end gap-4">
                <Button color="error" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  loadingPosition="end"
                  endIcon={<></>}
                >
                  {isEdit ? "Update" : "Submit"}
                </LoadingButton>
              </div>
            </div>
          </form>
        )}
      </LoadingContent>
    </>
  );
}

export default FloatingRateCreateEdit;

const defaultRatePeriod = {
  fromDate: new Date(),
  interestRate: "",
  isDifferentialToBaseLendingRate: false,
  locale: DateConfig.LOCALE,
  dateFormat: DateConfig.FORMAT,
};
