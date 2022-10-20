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
import { nxClientXLeadXEDRLoanApi } from "./ClientXLeadXEDRLoanStoreQuerySlice";
import useDataRef from "hooks/useDataRef";
import { useSnackbar } from "notistack";
import useAsyncUI from "hooks/useAsyncUI";

function ClientXLeadXEDRLoanPrepayLoan({ data, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const confirmAsyncUI = useAsyncUI();

  const [submitMutation, submitMutationResult] =
    nxClientXLeadXEDRLoanApi.useSubmitClientXLeadXEDRLoanRepaymentMutation();

  const [rejectMutation, rejectMutationResult] =
    nxClientXLeadXEDRLoanApi.useRejectClientXLeadXEDRLoanRepaymentMutation();

  const templateQueryResult =
    nxClientXLeadXEDRLoanApi.useGetClientXLeadXEDRLoanTransactionTemplateQuery({
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

  async function handleReject() {
    try {
      if (
        !(await confirmAsyncUI.open({
          context: { title: "Confirm Reject" },
        }))
      ) {
        return;
      }
      const resData = await rejectMutation({
        uniqueId: data?.uniqueId,
      }).unwrap();
      enqueueSnackbar(resData?.defaultUserMessage || "Rejected Successful", {
        variant: "success",
      });
      onClose();
    } catch (error) {
      enqueueSnackbar(error?.data?.defaultUserMessage || "Failed to Reject", {
        variant: "error",
      });
    }
  }

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    // template?.date?.length
    //     ? new Date(template?.date[0], template?.date[1] - 1, template?.date[2])
    //     : new Date()
    dataRef.current.formik.setValues({
      ...dataRef.current.formik.values,
      transactionDate: new Date(),
      transactionAmount: data?.deductionAmount || "",
      receiptNumber: data?.fcmbData?.tranId || "",
      note: data?.fcmbData?.tranParticular || "",
      accountNumber: data?.fcmbData?.accountName || "",
      paymentTypeId: template?.paymentTypeOptions?.[0]?.id || "",
    });
  }, [
    data?.deductionAmount,
    data?.fcmbData?.accountName,
    data?.fcmbData?.tranId,
    data?.fcmbData?.tranParticular,
    dataRef,
    template?.paymentTypeOptions,
  ]);

  return (
    <>
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
              disabled
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
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex-1" />
          <LoadingButton
            color="error"
            disabled={rejectMutationResult.isLoading}
            loading={rejectMutationResult.isLoading}
            loadingPosition="end"
            endIcon={<></>}
            onClick={handleReject}
          >
            Reject
          </LoadingButton>
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
      {confirmAsyncUI.render(({ context }) => (
        <Dialog open fullWidth maxWidth="xs">
          <DialogTitle className="font-bold">{context?.title}</DialogTitle>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => confirmAsyncUI.resolve(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => confirmAsyncUI.resolve(true)}>Accept</Button>
          </DialogActions>
        </Dialog>
      ))}
    </>
  );
}

export default ClientXLeadXEDRLoanPrepayLoan;