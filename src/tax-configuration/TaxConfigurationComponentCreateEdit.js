import { useEffect } from "react";
import { TextField, Button, Paper, MenuItem, Typography } from "@mui/material";
import { LoadingButton, DatePicker } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360TaxComponentApi } from "./TaxConfigurationComponentStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { RouteEnum, DateConfig } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";
import {
  getTextFieldFormikProps,
} from "common/Utils";
import dfnFormat from "date-fns/format";

function TaxConfigurationComponentCreateEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = !!id;

  const [addTaxComponentMutation, addTaxComponentMutationResult] =
    nimbleX360TaxComponentApi.useAddTaxComponentMutation();

  const [updateTaxComponentMutation, updateTaxComponentMutationResult] =
    nimbleX360TaxComponentApi.useUpdateTaxComponentMutation();

  const taxComponentTemplatesQueryResult =
    nimbleX360TaxComponentApi.useGetTaxComponentTemplateQuery();

  const taxComponentQueryResult =
    nimbleX360TaxComponentApi.useGetTaxComponentByIdQuery(id, {
      skip: !isEdit,
    });

  const taxComponent = taxComponentQueryResult.data;

  const options = taxComponentTemplatesQueryResult.data;

  const creditAccountTypeOptions = options?.glAccountTypeOptions;

  const formik = useFormik({
    initialValues: {
      name: "",
      percentage: "",
      creditAccountType: "",
      creditAcountId: "",
      locale: DateConfig.LOCALE,
      dateFormat: DateConfig.FORMAT,
      startDate: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      name: yup.string().trim().required(),
      percentage: yup.string().trim().required(),
    }),
    onSubmit: async (values) => {
      try {
        const func = isEdit
          ? updateTaxComponentMutation
          : addTaxComponentMutation;
        await func({
          id,
          ...values,
          startDate: dfnFormat(
            dataRef.current.formik.values?.startDate,
            DateConfig.FORMAT
          ),
        }).unwrap();
        enqueueSnackbar(
          isEdit ? "Tax Component Updated!" : "Tax Component Created",
          { variant: "success" }
        );
        navigate(-1);
      } catch (error) {
        enqueueSnackbar(
          (
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
        name: taxComponent?.name || "",
        percentage: taxComponent?.percentage || "",
        startDate: new Date(taxComponent?.startDate) || "",
        locale: taxComponent?.locale || DateConfig.LOCALE,
        dateFormat: taxComponent?.dateFormat || DateConfig.FORMAT,
      });
    }
  }, [
    dataRef,
    taxComponent?.name,
    taxComponent?.percentage,
    taxComponent?.startDate,
    taxComponent?.locale,
    taxComponent?.dateFormat,
    isEdit,
  ]);

  const CreditAccountIdOptions =
    options?.glAccountOptions?.[
    glAccountType_glAccountOptionsMapping[formik.values.creditAccountType]
      ?.glAccountOptions
    ] || [];

  return (
    <>
      <PageHeader
        title={isEdit ? "Edit Tax Component" : "Create Tax Component"}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Products", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          {
            name: "Tax Components",
            to: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_COMPONENTS,
          },
          {
            name: isEdit ? "Edit Tax Component" : "Create Tax Component",
          },
        ]}
      />

      <LoadingContent
        loading={taxComponentQueryResult.isLoading}
        error={taxComponentQueryResult.isError}
        onReload={taxComponentQueryResult.refetch}
      >
        {() => (
          <form
            className="w-full flex justify-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="max-w-full w-full">
              <Paper className="p-4 md:p-8 mb-4">
                <Typography variant="h6" className="font-bold">
                  {isEdit ? "Edit Tax Component" : "Create Tax Component"}
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
                  <TextField
                    fullWidth
                    label="Percentage"
                    {...formik.getFieldProps("percentage")}
                    error={
                      !!formik.touched.percentage && formik.errors.percentage
                    }
                    helperText={
                      !!formik.touched.percentage && formik.errors.percentage
                    }
                  />
                  {isEdit ? (
                    <>
                      <TextField
                        fullWidth
                        label="Credit Account Type"
                        disabled
                        value={taxComponent?.creditAccountType?.value}
                      />
                      <TextField
                        fullWidth
                        label="Credit Account"
                        disabled
                        value={taxComponent?.creditAccount.name}
                      />
                    </>
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        label="Credit Account Type"
                        select
                        {...formik.getFieldProps("creditAccountType")}
                      >
                        {creditAccountTypeOptions?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.value}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth
                        label="Credit Account"
                        select
                        {...formik.getFieldProps("creditAcountId")}
                      >
                        {CreditAccountIdOptions?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </>
                  )}

                  <DatePicker
                    disablePast
                    label="Start Date"
                    value={dataRef.current.formik.values?.startDate}
                    onChange={(newValue) => {
                      dataRef.current.formik.setFieldValue(
                        `startDate`,
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
                          `startDate`
                        )}
                        {...params}
                      />
                    )}
                  />
                </div>
              </Paper>
              <div className="flex items-center justify-end gap-4">
                <Button color="error" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  disabled={
                    addTaxComponentMutationResult.isLoading ||
                    updateTaxComponentMutationResult.isLoading
                  }
                  loading={
                    addTaxComponentMutationResult.isLoading ||
                    updateTaxComponentMutationResult.isLoading
                  }
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

export default TaxConfigurationComponentCreateEdit;

const glAccountType_glAccountOptionsMapping = {
  1: {
    glAccountOptions: "assetAccountOptions",
  },
  2: {
    glAccountOptions: "liabilityAccountOptions",
  },
  3: {
    glAccountOptions: "equityAccountOptions",
  },
  4: {
    glAccountOptions: "incomeAccountOptions",
  },
  5: {
    glAccountOptions: "expenseAccountOptions",
  },
};
