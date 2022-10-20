import React, { useState } from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import { Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import FormatToNumber from "common/FormatToNumber";
import { daysFromNow } from "./CRMClientUtils";

export default function CRMClientLoanRepaymentAdd(props) {
  const { onClose, ...rest } = props;
  const [openPaymentDetails, setOpenPaymentDetails] = useState(false);

  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientLoanPrepayLoanMutation();

  const { data: templateOptionData } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanTransactionTemplateQuery({
      loanId,
      command: "repayment",
    });

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      transactionDate: format(new Date(), "dd MMMM yyyy"),
      transactionAmount: templateOptionData?.amount || "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      accountNumber: Yup.string(),
      paymentTypeId: Yup.string(),
      transactionAmount: Yup.string(),
      transactionDate: Yup.string(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({
          loanId,
          params: { command: "repayment" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Make Repayment Creation Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Make Repayment Creation Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Add Make Repayment" {...rest}>
      <div className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
          <DesktopDatePicker
            label="Transaction date*"
            minDate={daysFromNow(7, "past")}
            maxDate={new Date()}
            inputFormat="dd/MM/yyyy"
            error={
              !!formik.touched.transactionDate &&
              !!formik.errors.transactionDate
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

          <TextField
            {...getTextFieldFormikProps(formik, "transactionAmount")}
            label="Transaction amount"
            InputProps={{
              inputComponent: FormatToNumber,
            }}
            fullWidth
          />

          <TextField
            {...getTextFieldFormikProps(formik, "paymentTypeId")}
            label="Payment type"
            fullWidth
            select
          >
            {templateOptionData &&
              templateOptionData?.paymentTypeOptions?.map(
                (paymentType, index) => (
                  <MenuItem key={index} value={paymentType?.id}>
                    {paymentType?.name}
                  </MenuItem>
                )
              )}
          </TextField>
        </div>
      </div>

      <div className="mt-4">
        <FormControlLabel
          label="Show Payment Details"
          control={
            <Checkbox
              checked={openPaymentDetails}
              onChange={(event) => {
                setOpenPaymentDetails(event.target.checked);
              }}
              value={openPaymentDetails}
            />
          }
        />
        {openPaymentDetails && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
            <TextField
              {...getTextFieldFormikProps(formik, "accountNumber")}
              label="Account"
              fullWidth
            />

            <TextField
              {...getTextFieldFormikProps(formik, "checkNumber")}
              label="Cheque"
              fullWidth
            />

            <TextField
              {...getTextFieldFormikProps(formik, "routingCode")}
              label="Routing code"
              fullWidth
            />

            <TextField
              {...getTextFieldFormikProps(formik, "receiptNumber")}
              label="Receipt"
              fullWidth
            />

            <TextField
              {...getTextFieldFormikProps(formik, "bankNumber")}
              label="Bank"
              fullWidth
            />
          </div>
        )}
      </div>

      <TextField
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
          Add Make Repayment
        </LoadingButton>
      </div>
    </Modal>
  );
}
