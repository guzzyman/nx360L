import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import {
  getTextFieldFormikProps,
  getUserErrorMessage,
  parseDateToString,
} from "common/Utils";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import FormatToNumber from "common/FormatToNumber";
import { daysFromNow } from "./CRMClientUtils";

export default function CRMClientDisburseLoanToWalletAction(props) {
  const { submitCommand, title, onClose, ...rest } = props;

  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientLoanAssignLoanMutation();

  const { data: templateOptionData } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanTransactionTemplateQuery({
      loanId,
      command: "disburseToSavings",
    });

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      actualDisbursementDate: parseDateToString(
        templateOptionData?.possibleNextRepaymentDate
      ),
      transactionAmount: templateOptionData?.amount,
      note: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      actualDisbursementDate: yup
        .string()
        .label("Disbursement Date")
        .required(),
      transactionAmount: yup.string().label("Transaction Amount").required(),
      note: yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        const data = await addMutation({
          loanId,
          params: { command: submitCommand },
          ...values,
        }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage || `Loan Disbursed Successful!`,
          {
            variant: "success",
          }
        );
        onClose();
      } catch (error) {
        enqueueSnackbar(`Loan Disbursal Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Dialog fullWidth {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className="grid gap-4 md:grid-cols-2 pt-4">
          <DesktopDatePicker
            required
            label="Disbursed on*"
            inputFormat="dd/MM/yyyy"
            minDate={daysFromNow(20, "past")}
            maxDate={new Date()}
            error={
              !!formik.touched.actualDisbursementDate &&
              !!formik.errors.actualDisbursementDate
            }
            helperText={
              !!formik.touched.actualDisbursementDate &&
              formik.errors.actualDisbursementDate
            }
            onChange={(newValue) => {
              if (isValid(new Date(newValue))) {
                formik.setFieldValue(
                  "actualDisbursementDate",
                  format(new Date(newValue), "dd MMMM yyyy")
                );
              }
            }}
            value={formik.values?.actualDisbursementDate || new Date()}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />

          <TextField
            required
            label="Transaction amount"
            InputProps={{
              readOnly: true,
              inputComponent: FormatToNumber,
            }}
            {...getTextFieldFormikProps(formik, "transactionAmount")}
            fullWidth
          />
          <TextField
            className="md:col-span-2"
            {...getTextFieldFormikProps(formik, "note")}
            label="Note"
            fullWidth
            multiline
            rows={5}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => onClose()}>
          Cancel
        </Button>
        <LoadingButton
          disabled={isLoading}
          loading={isLoading}
          loadingPosition="end"
          endIcon={<></>}
          onClick={formik.handleSubmit}
        >
          Disburse
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
