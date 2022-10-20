import React, { useState } from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import { Button, Icon, MenuItem, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import { daysFromNow } from "./CRMClientUtils";
import CurrencyField from "common/CurrencyField";

export default function CRMClientWalletDepositAction(props) {
  const { onClose, ...rest } = props;
  const { walletId } = useParams();
  const [addPaymentType, setAddPaymentType] = useState();
  const { data } =
    nimbleX360CRMClientApi.useGetCRMClientsSavingAccountTransactionTemplateQuery(
      { walletId }
    );
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientSavingsAccountTransactionActionMutation();

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
          walletId,
          params: { command: "deposit" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Deposit Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Deposit Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal
      onClose={onClose}
      size="md"
      title="Deposit Money To Saving Account"
      {...rest}
    >
      <div className="grid sm:grid-cols-2 gap-2">
        <div>
          <DesktopDatePicker
            label="Closed on*"
            inputFormat="dd/MM/yyyy"
            minDate={daysFromNow(7, "past")}
            maxDate={new Date()}
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
        </div>
        <CurrencyField
          {...getTextFieldFormikProps(formik, "transactionAmount")}
          label="Transaction Amount"
          fullWidth
        />

        <TextField
          {...getTextFieldFormikProps(formik, "paymentTypeId")}
          label="Payment Type"
          select
          fullWidth
        >
          {data?.paymentTypeOptions?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option?.name}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="mt-5 flex gap-2 my-3 items-center">
        <Typography fontWeight={900}>Show payment details</Typography>
        <div>
          {addPaymentType ? (
            <Button
              onClick={() => setAddPaymentType(false)}
              endIcon={<Icon>remove</Icon>}
            />
          ) : (
            <Button
              onClick={() => setAddPaymentType(true)}
              endIcon={<Icon>add</Icon>}
            />
          )}
        </div>
      </div>

      {addPaymentType && (
        <div className="grid sm:grid-cols-2 gap-4 ">
          <TextField
            {...getTextFieldFormikProps(formik, "accountNumber")}
            label="Account#"
            fullWidth
          />
          <TextField
            {...getTextFieldFormikProps(formik, "checkNumber")}
            label="Cheque#"
            fullWidth
          />
          <TextField
            {...getTextFieldFormikProps(formik, "routingCode")}
            label="Routing code"
            fullWidth
          />
          <TextField
            {...getTextFieldFormikProps(formik, "receiptNumber")}
            label="Receipt#"
            fullWidth
          />
          <TextField
            {...getTextFieldFormikProps(formik, "bankNumber")}
            label="Bank#"
            fullWidth
          />
        </div>
      )}

      <TextField
        {...getTextFieldFormikProps(formik, "note")}
        label="Note"
        className="mt-2"
        fullWidth
        multiline
        rows={5}
      />

      <div className="mt-5 flex gap-3 justify-between">
        <Button
          variant="outlined"
          color="warning"
          fullWidth
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Deposit
        </LoadingButton>
      </div>
    </Modal>
  );
}
