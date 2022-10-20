import { useEffect, useMemo } from "react";
import {
  Button,
  MenuItem,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  getCheckFieldFormikProps,
  getTextFieldFormikProps,
} from "common/Utils";
import { useParams } from "react-router-dom";
import { nimbleX360CRMVendorApi } from "./CRMVendorStoreQuerySlice";
import FormatToNumber from "common/FormatToNumber";
import { dateLocaleFormat } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";
import { removeEmptyProperties } from "common/Utils";

function CRMVendorLoanProductConfigOverrideAddEdit(props) {
  const { onClose, configId, ...rest } = props;
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const isEdit = !!configId;

  const [addLoanProductConfigMutation, addLoanProductConfigMutationResult] =
    nimbleX360CRMVendorApi.useAddVendorLoanProductOverrideMutation();
  const [
    updateLoanProductConfigMutation,
    updateLoanProductConfigMutationResult,
  ] = nimbleX360CRMVendorApi.useUpdateVendorLoanProductOverrideMutation();

  const configQueryResult =
    nimbleX360CRMVendorApi.useGetVendorLoanProductOverrideDetailsQuery(
      { id, loanProductId: configId },
      { skip: !configId }
    );

  const config = configQueryResult.data;

  const vendorLoanProductOverrideTemplateQueryResult =
    nimbleX360CRMVendorApi.useGetVendorLoanProductOverrideTemplateQuery(id);

  const loanProductOptions =
    vendorLoanProductOverrideTemplateQueryResult.data?.loanProductOptions;

  const normalizedLoanProductOptions = useMemo(
    () =>
      loanProductOptions?.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {}),
    [loanProductOptions]
  );

  const formik = useFormik({
    initialValues: {
      interestRate: 0,
      minNominalInterestRatePerPeriod: 0,
      maxNominalInterestRatePerPeriod: 0,
      principal: 0,
      minPrincipal: 0,
      maxPrincipal: 0,
      termFrequency: 0,
      minNumberOfRepayments: 0,
      maxNumberOfRepayments: 0,
      loanProductId: "",
      dsr: 0,
      downPaymentLimit: "",
      downPaymentPaidFull: false,
      acceptDisbursementServiceFeeFromExternal: false,
      locale: dateLocaleFormat.LOCALE,
    },
    validationSchema: yup.lazy((values) => {
      const loanProduct = normalizedLoanProductOptions?.[values.loanProductId];
      return yup.object({
        loanProductId: yup.string().label("Loan Product").required(),
        minNominalInterestRatePerPeriod: yup
          .number()
          .label("Minimum Interest Rate")
          .min(loanProduct?.minInterestRatePerPeriod || 0)
          .max(loanProduct?.maxInterestRatePerPeriod || 0)
          .required(),
        interestRate: yup
          .number()
          .label("Default Interest Rate")
          .min(values?.minNominalInterestRatePerPeriod || 0)
          .max(values?.maxNominalInterestRatePerPeriod || 0)
          .required(),
        maxNominalInterestRatePerPeriod: yup
          .number()
          .label("Maximum Interest Rate")
          .min(loanProduct?.minInterestRatePerPeriod || 0)
          .max(loanProduct?.maxInterestRatePerPeriod || 0)
          .required(),
        minPrincipal: yup
          .number()
          .label("Minimum Principal")
          .min(loanProduct?.minPrincipal || 0)
          .max(loanProduct?.maxPrincipal || 0)
          .required(),
        principal: yup
          .number()
          .label("Default Principal")
          .min(values?.minPrincipal || 0)
          .max(values?.maxPrincipal || 0)
          .required(),
        maxPrincipal: yup
          .number()
          .label("Maximum Principal")
          .min(loanProduct?.minPrincipal || 0)
          .max(loanProduct?.maxPrincipal || 0)
          .required(),
        minNumberOfRepayments: yup
          .number()
          .label("Minimum Tenure")
          .min(loanProduct?.minNumberOfRepayments || 0)
          .max(loanProduct?.maxNumberOfRepayments || 0)
          .required(),
        termFrequency: yup
          .number()
          .label("Default Tenure")
          .min(values?.minNumberOfRepayments || 0)
          .max(values?.maxNumberOfRepayments || 0)
          .required(),
        maxNumberOfRepayments: yup
          .number()
          .label("Maximum Tenure")
          .min(loanProduct?.minNumberOfRepayments || 0)
          .max(loanProduct?.maxNumberOfRepayments || 0)
          .required(),
        downPaymentLimit: yup.number().label("Down Payment Limit").optional(),
        downPaymentPaidFull: yup
          .boolean()
          .label("AutoDisburse full asset service amount")
          .optional(),
      });
    }),
    onSubmit: async (values) => {
      try {
        const func = isEdit
          ? updateLoanProductConfigMutation
          : addLoanProductConfigMutation;

        const data = await func(
          removeEmptyProperties({
            id,
            productId: isEdit ? configId : undefined,
            ...values,
            dsr:
              values?.dsr ||
              normalizedLoanProductOptions?.[values.loanProductId].dsr,
          })
        ).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage ||
            `${isEdit ? "Edit" : "Set"} Loan Product Config Successful!`,
          {
            variant: "success",
          }
        );
        onClose();
      } catch (error) {
        enqueueSnackbar(
          error.data.errors?.[0]?.defaultUserMessage ||
            `${isEdit ? "Edit" : "Set"} Loan Product Config Failed!`,
          {
            variant: "error",
          }
        );
      }
    },
  });

  const loanProduct =
    normalizedLoanProductOptions?.[formik.values.loanProductId];

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    const values = dataRef.current.formik.values;
    dataRef.current.formik.setValues({
      ...values,
      interestRate:
        config?.interestRate ||
        loanProduct?.interestRatePerPeriod ||
        values.interestRate,
      minNominalInterestRatePerPeriod:
        config?.minNominalInterestRatePerPeriod ||
        loanProduct?.minInterestRatePerPeriod ||
        values.minNominalInterestRatePerPeriod,
      maxNominalInterestRatePerPeriod:
        config?.maxNominalInterestRatePerPeriod ||
        loanProduct?.maxInterestRatePerPeriod ||
        values.maxNominalInterestRatePerPeriod,
      principal:
        config?.principal || loanProduct?.principal || values.principal,
      minPrincipal:
        config?.minPrincipal ||
        loanProduct?.minPrincipal ||
        values.minPrincipal,
      maxPrincipal:
        config?.maxPrincipal ||
        loanProduct?.maxPrincipal ||
        values.maxPrincipal,
      termFrequency:
        config?.termFrequency ||
        loanProduct?.numberOfRepayments ||
        values.termFrequency,
      minNumberOfRepayments:
        config?.minNumberOfRepayments ||
        loanProduct?.minNumberOfRepayments ||
        values.minNumberOfRepayments,
      maxNumberOfRepayments:
        config?.maxNumberOfRepayments ||
        loanProduct?.maxNumberOfRepayments ||
        values.maxNumberOfRepayments,
      loanProductId: config?.loanProductId || values.loanProductId,
      dsr: config?.dsr || loanProduct?.dsr || values.dsr,
      downPaymentLimit:
        config?.downPaymentLimit ||
        loanProduct?.downPaymentLimit ||
        values.downPaymentLimit,
      downPaymentPaidFull:
        config?.downPaymentPaidFull ||
        loanProduct?.downPaymentPaidFull ||
        values.downPaymentPaidFull,
      acceptDisbursementServiceFeeFromExternal:
        config?.acceptDisbursementServiceFeeFromExternal ||
        loanProduct?.acceptDisbursementServiceFeeFromExternal ||
        values.acceptDisbursementServiceFeeFromExternal,
    });
  }, [
    config?.acceptDisbursementServiceFeeFromExternal,
    config?.downPaymentLimit,
    config?.downPaymentPaidFull,
    config?.dsr,
    config?.interestRate,
    config?.loanProductId,
    config?.maxNominalInterestRatePerPeriod,
    config?.maxNumberOfRepayments,
    config?.maxPrincipal,
    config?.minNominalInterestRatePerPeriod,
    config?.minNumberOfRepayments,
    config?.minPrincipal,
    config?.principal,
    config?.termFrequency,
    dataRef,
    isEdit,
    loanProduct?.acceptDisbursementServiceFeeFromExternal,
    loanProduct?.downPaymentLimit,
    loanProduct?.downPaymentPaidFull,
    loanProduct?.dsr,
    loanProduct?.interestRatePerPeriod,
    loanProduct?.maxInterestRatePerPeriod,
    loanProduct?.maxNumberOfRepayments,
    loanProduct?.maxPrincipal,
    loanProduct?.minInterestRatePerPeriod,
    loanProduct?.minNumberOfRepayments,
    loanProduct?.minPrincipal,
    loanProduct?.numberOfRepayments,
    loanProduct?.principal,
  ]);

  return (
    <Dialog fullWidth {...rest}>
      <DialogTitle>{isEdit ? "Edit" : "Set"} Loan Product Config</DialogTitle>
      <LoadingContent
        loading={vendorLoanProductOverrideTemplateQueryResult.isLoading}
        error={vendorLoanProductOverrideTemplateQueryResult.isError}
        onReload={vendorLoanProductOverrideTemplateQueryResult.refetch}
      >
        {() => (
          <>
            <DialogContent>
              <>
                <TextField
                  label="Loan Product"
                  {...getTextFieldFormikProps(formik, "loanProductId")}
                  select
                  margin="normal"
                  fullWidth
                  disabled={isEdit}
                >
                  {loanProductOptions?.map((option, i) => (
                    <MenuItem key={i} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>

                <div className="flex gap-4">
                  <div className="flex gap-2">
                    <Typography>Min Interest:</Typography>
                    <Typography>
                      {loanProduct?.minInterestRatePerPeriod || 0}
                    </Typography>
                  </div>
                  <div className="flex gap-2">
                    <Typography>Default Interest:</Typography>
                    <Typography>
                      {loanProduct?.interestRatePerPeriod || 0}
                    </Typography>
                  </div>
                  <div className="flex gap-2 ">
                    <Typography>Max Interest:</Typography>
                    <Typography>
                      {loanProduct?.maxInterestRatePerPeriod || 0}
                    </Typography>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-x-4">
                  <TextField
                    label="Minimum Interest Rate"
                    InputProps={{
                      inputComponent: FormatToNumber,
                    }}
                    margin="normal"
                    fullWidth
                    {...getTextFieldFormikProps(
                      formik,
                      "minNominalInterestRatePerPeriod"
                    )}
                  />
                  <TextField
                    label="Default Interest Rate"
                    InputProps={{
                      inputComponent: FormatToNumber,
                    }}
                    margin="normal"
                    fullWidth
                    {...getTextFieldFormikProps(formik, "interestRate")}
                  />
                  <TextField
                    label="Maximum Interest Rate"
                    InputProps={{
                      inputComponent: FormatToNumber,
                    }}
                    margin="normal"
                    fullWidth
                    {...getTextFieldFormikProps(
                      formik,
                      "maxNominalInterestRatePerPeriod"
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex gap-2">
                    <Typography>Min Principal:</Typography>
                    <Typography>{loanProduct?.minPrincipal || 0}</Typography>
                  </div>
                  <div className="flex gap-2">
                    <Typography>Default Principal:</Typography>
                    <Typography>{loanProduct?.principal || 0}</Typography>
                  </div>
                  <div className="flex gap-2 ">
                    <Typography>Max Principal:</Typography>
                    <Typography>{loanProduct?.maxPrincipal || 0}</Typography>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-x-4">
                  <TextField
                    label="Minimum Principal"
                    InputProps={{
                      inputComponent: FormatToNumber,
                    }}
                    margin="normal"
                    fullWidth
                    {...getTextFieldFormikProps(formik, "minPrincipal")}
                  />
                  <TextField
                    label="Default Principal"
                    InputProps={{
                      inputComponent: FormatToNumber,
                    }}
                    margin="normal"
                    fullWidth
                    {...getTextFieldFormikProps(formik, "principal")}
                  />
                  <TextField
                    label="Maximum Principal"
                    InputProps={{
                      inputComponent: FormatToNumber,
                    }}
                    margin="normal"
                    fullWidth
                    {...getTextFieldFormikProps(formik, "maxPrincipal")}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex gap-2">
                    <Typography>Min Tenure:</Typography>
                    <Typography>
                      {loanProduct?.minNumberOfRepayments || 0}
                    </Typography>
                  </div>
                  <div className="flex gap-2">
                    <Typography>Default Tenure:</Typography>
                    <Typography>
                      {loanProduct?.numberOfRepayments || 0}
                    </Typography>
                  </div>
                  <div className="flex gap-2 ">
                    <Typography>Max Tenure:</Typography>
                    <Typography>
                      {loanProduct?.maxNumberOfRepayments || 0}
                    </Typography>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-x-4">
                  <TextField
                    label="Minimum Tenure"
                    InputProps={{
                      inputComponent: FormatToNumber,
                    }}
                    margin="normal"
                    fullWidth
                    {...getTextFieldFormikProps(
                      formik,
                      "minNumberOfRepayments"
                    )}
                  />
                  <TextField
                    label="Default Tenure"
                    InputProps={{
                      inputComponent: FormatToNumber,
                    }}
                    margin="normal"
                    fullWidth
                    {...getTextFieldFormikProps(formik, "termFrequency")}
                  />
                  <TextField
                    label="Maximum Tenure"
                    InputProps={{
                      inputComponent: FormatToNumber,
                    }}
                    margin="normal"
                    fullWidth
                    {...getTextFieldFormikProps(
                      formik,
                      "maxNumberOfRepayments"
                    )}
                  />
                </div>
                <TextField
                  label="Down Payment Limit (%)"
                  InputProps={{
                    inputComponent: FormatToNumber,
                  }}
                  margin="normal"
                  fullWidth
                  {...getTextFieldFormikProps(formik, "downPaymentLimit")}
                />
                <FormControlLabel
                  label="AutoDisburse full asset service amount"
                  control={
                    <Checkbox
                      {...getCheckFieldFormikProps(
                        formik,
                        "downPaymentPaidFull"
                      )}
                    />
                  }
                />
                <FormControlLabel
                  label="Accept Disbursement Service Fee From External"
                  control={
                    <Checkbox
                      {...getCheckFieldFormikProps(
                        formik,
                        "acceptDisbursementServiceFeeFromExternal"
                      )}
                    />
                  }
                />
              </>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => onClose()}>
                Cancel
              </Button>
              <LoadingButton
                loading={
                  addLoanProductConfigMutationResult.isLoading ||
                  updateLoanProductConfigMutationResult.isLoading
                }
                onClick={formik.handleSubmit}
              >
                Submit
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </LoadingContent>
    </Dialog>
  );
}

export default CRMVendorLoanProductConfigOverrideAddEdit;
