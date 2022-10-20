import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import { daysFromNow } from "./CRMClientUtils";

export default function CRMClientLoanCloseAdd(props) {
  const { onClose, ...rest } = props;

  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientLoanPrepayLoanMutation();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      transactionDate: format(new Date(), "dd MMMM yyyy"),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      transactionDate: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({
          loanId,
          params: { command: "close" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Close Loan Account Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Close Loan Account Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Close Loan Account" {...rest}>
      <div className="mt-4">
        <DesktopDatePicker
          label="Closed on*"
          inputFormat="dd/MM/yyyy"
          minDate={daysFromNow(7, "past")}
          maxDate={new Date()}
          error={
            !!formik.touched.transactionDate && !!formik.errors.transactionDate
          }
          helperText={
            !!formik.touched.transactionDate && formik.errors.transactionDate
          }
          onChange={(newValue) => {
            if (isValid(new Date(newValue))) {
              formik.setFieldValue(
                "transactionDate",
                format(new Date(newValue), "dd MMMM yyyy")
              );
            }
          }}
          value={formik.values?.transactionDate || new Date()}
          renderInput={(params) => <TextField fullWidth {...params} />}
        />
      </div>

      <TextField
        className="mt-4"
        {...getTextFieldFormikProps(formik, "note")}
        label="Note"
        fullWidth
        multiline
        rows={5}
      />

      <div className="mt-5">
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Close Loan Account
        </LoadingButton>
      </div>
    </Modal>
  );
}
