import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { DatePicker, LoadingButton } from "@mui/lab";
import { DateConfig } from "common/Constants";
import { useFormik } from "formik";
import * as yup from "yup";
import * as dfn from "date-fns";
import { getTextFieldFormikProps } from "common/Utils";
import CurrencyTextField from "common/CurrencyTextField";
import { useEffect, useMemo } from "react";
import { nxClientDetailsLoanEdrApi } from "./CRMClientDetailsLoanEDRStoreQuerySlice";
import useDataRef from "hooks/useDataRef";
import { useSnackbar } from "notistack";

function CRMClientDetailsLoanEDRPrepayLoan({ data, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const [submitMutation, submitMutationResult] =
    nxClientDetailsLoanEdrApi.useSubmitClientsDetailsLoanRepaymentMutation();

  const templateQueryResult =
    nxClientDetailsLoanEdrApi.useGetClientsDetailsLoanTransactionTemplateQuery({
      loanId: data?.transaction,
      command: "prepayLoan",
    });

  const template = templateQueryResult.data;

  const TRANSACTION_MINIMUM_DATE = useMemo(() => {
    return dfn.subDays(new Date(), 6);
  }, []);

  const formik = useFormik({
    initialValues: {
      dateFormat: DateConfig.FORMAT,
      locale: DateConfig.LOCALE,
      transactionDate: null,
      transactionAmount: "",
      paymentTypeId: "",
      bankNumber: "FCMB",
      accountNumber: "",
      checkNumber: "",
      receiptNumber: "",
      note: "",
      command: "repayment",
    },
    validateOnChange: false,
    validationSchema: yup.object({
      transactionDate: null,
      transactionAmount: yup.string().label("Transaction Amount").required(),
      paymentTypeId: yup.string().label("Payment Type").required(),
      accountNumber: yup.string().label("Account Number").required().min(10),
      checkNumber: yup.string().label("Check Number").optional(),
      receiptNumber: yup.string().label("Reciept Number").required(),
      note: yup.string().label("Narration").required(),
    }),
    onSubmit: async (values) => {
      try {
        const resData = await submitMutation({
          ...values,
          transactionDate: dfn.format(
            values.transactionDate,
            DateConfig.FORMAT
          ),
          uniqueId: data?.uniqueId,
          edrId: data?.id,
          loanClientId: data?.transaction,
        }).unwrap();
        enqueueSnackbar(
          resData?.defaultUserMessage || "Prepay Loan Successful",
          { variant: "success" }
        );
      } catch (error) {
        enqueueSnackbar(
          error?.data?.defaultUserMessage || "Failed to Prepay Loan",
          { variant: "error" }
        );
      }
    },
  });

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    // template?.date?.length
    //     ? new Date(template?.date[0], template?.date[1] - 1, template?.date[2])
    //     : new Date()
    dataRef.current.formik.setValues({
      ...dataRef.current.formik.values,
      transactionDate: new Date(),
      transactionAmount: data?.deductionAmount || "",
    });
  }, [data?.deductionAmount, dataRef]);

  return (
    <Dialog open fullWidth>
      <DialogTitle>Prepay Loan</DialogTitle>
      <DialogContent>
        <div className="grid sm:grid-cols-2 gap-4 py-2">
          <DatePicker
            minDate={TRANSACTION_MINIMUM_DATE}
            disableFuture
            label="Transaction Date"
            value={formik.values.transactionDate}
            onChange={(value) => {
              formik.setFieldValue("transactionDate", value);
            }}
            renderInput={(params) => (
              <TextField fullWidth required {...params} />
            )}
          />
          <CurrencyTextField
            required
            fullWidth
            label="Transaction Amount"
            value={formik.values.transactionAmount}
            // {...getTextFieldFormikProps(formik, "transactionAmount")}
            helperText={`Next repayment N${template?.amount}`}
          />
          <TextField
            select
            required
            fullWidth
            label="Payment Type"
            {...getTextFieldFormikProps(formik, "paymentTypeId")}
          >
            {templateQueryResult.data?.paymentTypeOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <CurrencyTextField
            required
            fullWidth
            label="Principal"
            value={template?.principalPortion}
          />
          <CurrencyTextField
            required
            fullWidth
            label="Interest Amount"
            value={template?.interestPortion}
          />
          <TextField
            required
            fullWidth
            label="Account Number"
            {...getTextFieldFormikProps(formik, "accountNumber")}
          />
          <TextField
            fullWidth
            label="Cheque Number"
            {...getTextFieldFormikProps(formik, "checkNumber")}
          />
          <TextField
            required
            fullWidth
            label="Reference Number"
            {...getTextFieldFormikProps(formik, "receiptNumber")}
          />
          <TextField
            required
            fullWidth
            label="Bank"
            value={formik.values.bankNumber}
            // {...getTextFieldFormikProps(formik, "bankNumber")}
          />
          <TextField
            multiline
            rows={5}
            required
            fullWidth
            label="Narration"
            {...getTextFieldFormikProps(formik, "note")}
            className="sm:col-span-2"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          disabled={submitMutationResult.isLoading}
          loading={submitMutationResult.isLoading}
          loadingPosition="end"
          endIcon={<></>}
          onClick={formik.handleSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default CRMClientDetailsLoanEDRPrepayLoan;
