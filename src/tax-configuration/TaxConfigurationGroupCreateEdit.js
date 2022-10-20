import { useMemo, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Icon,
  IconButton,
  MenuItem,
} from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { LoadingButton, DatePicker } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360TaxGroupApi } from "./TaxConfigurationGroupStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";
import useTable from "hooks/useTable";
import {
  getTextFieldFormikProps,
} from "common/Utils";
import dfnFormat from "date-fns/format";
import dfnSubDays from "date-fns/subDays";
import { DateConfig } from "common/Constants";

function TaxConfigurationGroupCreateEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = !!id;

  const [addTaxGroupMutation, addTaxGroupMutationResult] =
    nimbleX360TaxGroupApi.useAddTaxGroupMutation();

  const [updateTaxGroupMutation, updateTaxGroupMutationResult] =
    nimbleX360TaxGroupApi.useUpdateTaxGroupMutation();

  const taxGroupTemplate = nimbleX360TaxGroupApi.useGetTaxGroupTemplateQuery();

  const accountTypeQueryOptions = taxGroupTemplate?.data?.taxComponents;

  const taxGroupQueryResult = nimbleX360TaxGroupApi.useGetTaxGroupByIdQuery(
    id,
    {
      skip: !isEdit,
    }
  );

  const taxGroup = taxGroupQueryResult?.data;
  const taxAssociations = taxGroup?.taxAssociations;

  const formik = useFormik({
    initialValues: {
      name: "",
      locale: DateConfig.LOCALE,
      dateFormat: DateConfig.FORMAT,
      taxComponents: [],
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      name: yup.string().trim().required(),
      taxComponents: yup.array().of(
        yup.object({
          index: yup.mixed().label("Index").optional(),
          taxComponentId: yup.number().label("Tax Component").required(),
          startDate: yup
            .date()
            .label("Start Date")
            .when("index", (index, schema) => {
              return !!taxAssociations?.[index]
                ? schema
                : schema.min(dfnSubDays(new Date(), 1));
            }),
          endDate: yup
            .date()
            .label("End Date")
            .when("startDate", (startDate, schema) =>
              isEdit ? schema : schema.min(startDate)
            ),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        const func = isEdit ? updateTaxGroupMutation : addTaxGroupMutation;
        await func({
          id,
          ...values,
          taxComponents: values.taxComponents.map(({ index, ...period }) => ({
            ...period,
            endDate: period.id
              ? dfnFormat(period.endDate, DateConfig.FORMAT)
              : undefined,
            startDate: period.id
              ? undefined
              : dfnFormat(period.startDate, DateConfig.FORMAT),
          })),
        }).unwrap();
        enqueueSnackbar(isEdit ? "Tax Group Updated" : "Tax Group Created", {
          variant: "success",
        });
        navigate(-1);
      } catch (error) {
        enqueueSnackbar(
          isEdit
            ? `Error Updating Tax Group ${error.data?.defaultUserMessage || ""}`
            : `Error Creating Tax Group ${
                error.data?.errors[0].defaultUserMessage || ""
              }`,
          { variant: "error" }
        );
      }
    },
  });

  console.log(formik.errors);

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (isEdit) {
      dataRef.current.formik.setValues({
        name: taxGroup?.name || "",
        locale: DateConfig.LOCALE,
        dateFormat: DateConfig.FORMAT,
        taxComponents:
          taxGroup?.taxAssociations?.map((taxComponent, index) => ({
            ...defaultTaxComponent,
            index,
            id: taxComponent.id,
            taxComponentId: taxComponent?.taxComponent?.id || "",
            startDate: new Date(taxComponent.startDate?.join("-")),
            endDate: new Date(taxComponent.endDate?.join("-")),
          })) || [],
      });
    }
  }, [dataRef, taxGroup, isEdit]);

  const columns = useMemo(
    () => [
      {
        Header: "Tax Component",
        accessor: "interestRate",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            label="Tax Component"
            className="mt-2"
            select
            disabled={isEdit && !!taxAssociations?.[row.index]}
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `taxComponents[${row.index}].taxComponentId`
            )}
          >
            {accountTypeQueryOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        ),
      },
      {
        Header: "Start Date",
        accessor: "startDate",
        Cell: ({ row, i }) => (
          <DatePicker
            disablePast={!taxAssociations?.[row.index]}
            label="Start Date"
            disabled={isEdit && !!taxAssociations?.[row.index]}
            value={
              dataRef.current.formik.values?.taxComponents[row.index]?.startDate
            }
            onChange={(newValue) => {
              dataRef.current.formik.setFieldValue(
                `taxComponents[${row.index}].startDate`,
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
                  `taxComponents[${row.index}].startDate`
                )}
                {...params}
              />
            )}
          />
        ),
      },
      {
        Header: "End Date",
        accessor: "endDate",
        Cell: ({ row }) =>
          !!taxAssociations?.[row.index] ? (
            <DatePicker
              disablePast
              label="End Date"
              disabled={!!taxAssociations?.[row.index]?.endDate?.length}
              value={
                dataRef.current.formik.values?.taxComponents[row.index]?.endDate
              }
              onChange={(newValue) => {
                dataRef.current.formik.setFieldValue(
                  `taxComponents[${row.index}].endDate`,
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
                    `taxComponents[${row.index}].endDate`
                  )}
                  {...params}
                />
              )}
            />
          ) : null,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) =>
          !!taxAssociations?.[row.index] ? null : (
            <IconButton
              onClick={() => {
                const newTaxComponents = [
                  ...dataRef.current.formik.values.taxComponents,
                ];
                newTaxComponents.splice(row.index, 1);
                dataRef.current.formik.setFieldValue(
                  "taxComponents",
                  newTaxComponents
                );
              }}
            >
              <Icon>delete</Icon>
            </IconButton>
          ),
      },
    ],
    [accountTypeQueryOptions, dataRef, isEdit, taxAssociations]
  );

  const tableInstance = useTable({
    columns,
    data: formik.values.taxComponents,
  });

  return (
    <>
      <PageHeader
        title={isEdit ? "Edit Tax Group" : "Create Tax Group"}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Products", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          {
            name: "Tax Groups",
            to: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_GROUPS,
          },
          {
            name: isEdit ? "Edit Tax Group" : "Create Tax Group",
          },
        ]}
      />

      <LoadingContent
        loading={taxGroupQueryResult.isLoading}
        error={taxGroupQueryResult.isError}
        onReload={taxGroupQueryResult.refetch}
      >
        {() => (
          <form
            className="w-full flex justify-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="max-w-full w-full">
              <Paper className="p-4 md:p-8 mb-4">
                <Typography variant="h6" className="font-bold">
                  Create Tax Group
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
                    label="Name"
                    {...formik.getFieldProps("name")}
                    error={!!formik.touched.name && formik.errors.name}
                    helperText={!!formik.touched.name && formik.errors.name}
                  />
                </div>
              </Paper>
              <Paper className="p-4 md:p-8 mb-4">
                <div className="flex flex-row gap-3 mb-4">
                  <Typography variant="h6" className="font-bold">
                    Tax Components
                  </Typography>
                  <Button
                    startIcon={<Icon>add</Icon>}
                    onClick={() =>
                      formik.setFieldValue("taxComponents", [
                        ...dataRef.current.formik.values.taxComponents,
                        { ...defaultTaxComponent },
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
                  loading={
                    addTaxGroupMutationResult.isLoading ||
                    updateTaxGroupMutationResult.isLoading
                  }
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

export default TaxConfigurationGroupCreateEdit;

const defaultTaxComponent = {
  startDate: new Date(),
  taxComponentId: "",
};
