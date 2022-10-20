import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  MenuItem,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360ChargeProductApi } from "./ChargeProductStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";
import { getTruthyValue } from "common/Utils";

function ChargeProductCreateEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const [IsSavingsClient, setIsSavingsClient] = useState(false);

  const isEdit = !!id;

  const [addChargeProductMutation, addChargeProductMutationResult] =
    nimbleX360ChargeProductApi.useAddChargeProductMutation();

  const [updateChargeProductMutation, updateChargeProductMutationResult] =
    nimbleX360ChargeProductApi.useUpdateChargeProductMutation();

  const chargeProductTemplatesQueryResult =
    nimbleX360ChargeProductApi.useGetChargeProductTemplateQuery();

  const chargeProductQueryResult =
    nimbleX360ChargeProductApi.useGetChargeProductByIdQuery(id, {
      skip: !isEdit,
    });

  const chargeProduct = chargeProductQueryResult.data;
  const options = chargeProductTemplatesQueryResult.data;
  const chargeAppliesToOptions = options?.chargeAppliesToOptions || [];
  const chargeTimeTypeOptions = options?.chargeTimeTypeOptions || [];
  const chargeCalculationTypeOptions =
    options?.chargeCalculationTypeOptions || [];
  const chargePaymentModeOptions = options?.chargePaymetModeOptions || [];
  const chargeCurrencyOptions = options?.currencyOptions || [];
  const taxGroupOptions = options?.taxGroupOptions || [];
  const incomeAccountOptions =
    options?.incomeOrLiabilityAccountOptions?.incomeAccountOptions || [];

  const loanChargeTimeTypeOptions = options?.loanChargeTimeTypeOptions || [];
  const loanChargeCalculationTypeOptions =
    options?.loanChargeCalculationTypeOptions || [];

  const savingsChargeTimeTypeOptions =
    options?.savingsChargeTimeTypeOptions || [];
  const savingsChargeCalculationTypeOptions =
    options?.savingsChargeCalculationTypeOptions || [];

  const clientChargeTimeTypeOptions =
    options?.clientChargeTimeTypeOptions || [];
  const clientChargeCalculationTypeOptions =
    options?.clientChargeCalculationTypeOptions || [];

  const shareChargeTimeTypeOptions = options?.shareChargeTimeTypeOptions || [];
  const shareChargeCalculationTypeOptions =
    options?.shareChargeCalculationTypeOptions || [];

  const chargeTimeOptionsMapping = [
    loanChargeTimeTypeOptions,
    savingsChargeTimeTypeOptions,
    clientChargeTimeTypeOptions,
    shareChargeTimeTypeOptions,
  ];

  // const chargeCalculationOptionsMapping = [
  //   loanChargeCalculationTypeOptions,
  //   savingsChargeCalculationTypeOptions,
  //   clientChargeCalculationTypeOptions,
  //   shareChargeCalculationTypeOptions,
  // ];

  const formik = useFormik({
    initialValues: {
      name: "",
      chargeAppliesTo: "",
      currencyCode: "",
      locale: "en",
      amount: "",
      chargeTimeType: "",
      chargeCalculationType: "",
      chargePaymentMode: "",
      active: false,
      incomeAccountId: "",
      penalty: false,
      taxGroupId: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      name: yup.string().trim().required(),
      currencyCode: yup.string().trim().required(),
      chargeAppliesTo: yup.string().trim().required(),
      amount: yup.string().trim().required(),
      chargeTimeType: yup.string().trim().required(),
      chargeCalculationType: yup.string().trim().required(),
      active: yup.boolean().required(),
    }),
    onSubmit: async (values) => {
      const _values = values;
      const isTaxGroupIdExist = formik.values.taxGroupId;
      if (!!isTaxGroupIdExist === false) {
        delete _values.taxGroupId;
      }
      try {
        const func = isEdit
          ? updateChargeProductMutation
          : addChargeProductMutation;
        await func({ id, ..._values }).unwrap();
        enqueueSnackbar(isEdit ? "Charge Updated" : "Charge Created", {
          variant: "success",
        });
        navigate(-1);
      } catch (error) {
        enqueueSnackbar("Error Creating Charge", { variant: "error" });
      }
    },
  });

  const chargeAppliesToIndex = formik.values.chargeAppliesTo;

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (isEdit) {
      dataRef.current.formik.setValues({
        name: chargeProduct?.name || "",
        chargeAppliesTo: chargeProduct?.chargeAppliesTo?.id || "",
        currencyCode: chargeProduct?.currency?.code || "",
        locale: chargeProduct?.locale || "en",
        amount: chargeProduct?.amount || "",
        chargeTimeType: chargeProduct?.chargeTimeType?.id || "",
        chargeCalculationType: chargeProduct?.chargeCalculationType?.id || "",
        chargePaymentMode: getTruthyValue(
          [chargeProduct?.chargePaymentMode?.id, ""],
          { truthyValues: [0, ""] }
        ),
        active: chargeProduct?.active || false,
      });
    }
  }, [
    dataRef,
    chargeProduct?.name,
    chargeProduct?.chargeAppliesTo,
    chargeProduct?.currencyCode,
    chargeProduct?.locale,
    chargeProduct?.amount,
    chargeProduct?.chargeTimeType,
    chargeProduct?.chargeCalculationType,
    chargeProduct?.chargePaymentMode,
    chargeProduct?.active,
    isEdit,
    chargeProduct?.currency?.code,
  ]);

  // console.log(formik.values, chargeProduct?.chargePaymentMode?.id,  getTruthyValue([chargeProduct?.chargePaymentMode?.id], {truthyValues: [0]}));

  return (
    <>
      <PageHeader
        title={isEdit ? "Update Charge Product" : "Create Charge Product"}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Products", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          { name: "Charges", to: RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES },
          {
            name: isEdit ? "Update Charge" : "Create Charge",
          },
        ]}
      />

      <LoadingContent
        loading={chargeProductQueryResult.isLoading}
        error={chargeProductQueryResult.isError}
        onReload={chargeProductQueryResult.refetch}
      >
        {() => (
          <form
            className="w-full flex justify-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="max-w-full w-full">
              <Paper className="p-4 md:p-8 mb-4">
                <Typography variant="h6" className="font-bold">
                  Create Charges
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Ensure you enter correct information.
                </Typography>
                <div className="max-w-3xl grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <TextField
                    fullWidth
                    label="Charges Applies To"
                    className="col-span-3"
                    disabled={isEdit ? true : false}
                    select
                    {...formik.getFieldProps("chargeAppliesTo")}
                    error={
                      !!formik.touched.chargeAppliesTo &&
                      formik.errors.chargeAppliesTo
                    }
                    helperText={
                      !!formik.touched.chargeAppliesTo &&
                      formik.errors.chargeAppliesTo
                    }
                  >
                    {chargeAppliesToOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Charges Name"
                    className="col-span-3"
                    {...formik.getFieldProps("name")}
                    error={!!formik.touched.name && formik.errors.name}
                    helperText={!!formik.touched.name && formik.errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Currency"
                    select
                    {...formik.getFieldProps("currencyCode")}
                    error={
                      !!formik.touched.currencyCode &&
                      formik.errors.currencyCode
                    }
                    helperText={
                      !!formik.touched.currencyCode &&
                      formik.errors.currencyCode
                    }
                  >
                    {chargeCurrencyOptions.map((option) => (
                      <MenuItem key={option.code} value={option.code}>
                        {option.displayLabel}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Charge Time"
                    select
                    {...formik.getFieldProps("chargeTimeType")}
                    error={
                      !!formik.touched.chargeTimeType &&
                      formik.errors.chargeTimeType
                    }
                    helperText={
                      !!formik.touched.chargeTimeType &&
                      formik.errors.chargeTimeType
                    }
                  >
                    {chargeTimeOptionsMapping[chargeAppliesToIndex - 1]?.map(
                      (option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.value}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Charge Calculation"
                    select
                    {...formik.getFieldProps("chargeCalculationType")}
                    error={
                      !!formik.touched.chargeCalculationType &&
                      formik.errors.chargeCalculationType
                    }
                    helperText={
                      !!formik.touched.chargeCalculationType &&
                      formik.errors.chargeCalculationType
                    }
                  >
                    {chargeCalculationTypeOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                  {IsSavingsClient ? (
                    <>
                      <TextField
                        fullWidth
                        label="Income From Charge"
                        select
                        {...formik.getFieldProps("incomeAccountId")}
                        error={
                          !!formik.touched.incomeAccountId &&
                          formik.errors.incomeAccountId
                        }
                        helperText={
                          !!formik.touched.incomeAccountId &&
                          formik.errors.incomeAccountId
                        }
                      >
                        {incomeAccountOptions?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </>
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        label="Charge Payment Mode"
                        select
                        {...formik.getFieldProps("chargePaymentMode")}
                        error={
                          !!formik.touched.chargePaymentMode &&
                          formik.errors.chargePaymentMode
                        }
                        helperText={
                          !!formik.touched.chargePaymentMode &&
                          formik.errors.chargePaymentMode
                        }
                      >
                        {chargePaymentModeOptions?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </>
                  )}

                  <TextField
                    fullWidth
                    label="Amount"
                    {...formik.getFieldProps("amount")}
                    error={!!formik.touched.amount && formik.errors.amount}
                    helperText={!!formik.touched.amount && formik.errors.amount}
                  />
                  <TextField
                    fullWidth
                    label="Tax Group"
                    select
                    {...formik.getFieldProps("taxGroupId")}
                    error={
                      !!formik.touched.taxGroupId && formik.errors.taxGroupId
                    }
                    helperText={
                      !!formik.touched.taxGroupId && formik.errors.taxGroupId
                    }
                  >
                    {taxGroupOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <FormControlLabel
                    label="Is Penalty?"
                    control={
                      <Checkbox
                        checked={formik.values?.penalty}
                        onChange={(event) => {
                          formik.setFieldValue("penalty", event.target.checked);
                        }}
                        value={formik.values?.penalty}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Active"
                    control={
                      <Checkbox
                        checked={formik.values?.active}
                        onChange={(event) => {
                          formik.setFieldValue("active", event.target.checked);
                        }}
                        value={formik.values?.active}
                      />
                    }
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
                    addChargeProductMutationResult.isLoading ||
                    updateChargeProductMutationResult.isLoading
                  }
                  loading={
                    addChargeProductMutationResult.isLoading ||
                    updateChargeProductMutationResult.isLoading
                  }
                  loadingPosition="end"
                  endIcon={<></>}
                >
                  {isEdit ? "Update" : "Submit"}
                </LoadingButton>
              </div>
              {/* {taxGroupOptions} */}
            </div>
          </form>
        )}
      </LoadingContent>
    </>
  );
}

export default ChargeProductCreateEdit;
