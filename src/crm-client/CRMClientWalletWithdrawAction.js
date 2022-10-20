import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import { daysFromNow } from "./CRMClientUtils";
import CurrencyField from "common/CurrencyField";

export default function CRMClientWalletWithdrawAction(props) {
  const { onClose, clientWalletQueryResult, ...rest } = props;
  const { id, walletId } = useParams();
  const availableBalance =
    clientWalletQueryResult?.data?.summary?.accountBalance || 0;
  const insufficientBalance = availableBalance === 0;
  const clientBankAccount = nimbleX360CRMClientApi.useGetCRMClientBankQuery(id);

  const clientAccount = clientBankAccount?.data?.filter((e) => e.active)?.[0];

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
      transactionAmount: "",
      note: "",
      paymentTypeId: 1,
      bankNumber: clientAccount?.bank?.name,
      accountNumber: clientAccount?.accountnumber,
      receiptNumber: clientAccount?.accountname,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      transactionDate: Yup.string().label("Transaction Date").required(),
      transactionAmount: Yup.number()
        .max(availableBalance, "Insufficient Balance 😞")
        .label("Transaction Amount")
        .required(),
      note: Yup.string().required(),
      accountNumber: Yup.string().label("Account Number").required(),
      receiptNumber: Yup.string().label("Account Name").required(),
      bankNumber: Yup.string().label("Bank Name").required(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({
          walletId,
          params: { command: "withdrawalToBank" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Withdraw Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Withdraw Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Transfer To Bank" {...rest}>
      <div className="grid sm:grid-cols-2 gap-2">
        <div>
          <DesktopDatePicker
            label="Transaction Date*"
            inputFormat="dd/MM/yyyy"
            disabled
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
            value={formik.values?.transactionDate || ""}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </div>
        <CurrencyField
          {...getTextFieldFormikProps(formik, "transactionAmount")}
          label="Transaction Amount"
          error={
            (!!formik.touched.transactionAmount &&
              !!formik.errors.transactionAmount) ||
            insufficientBalance
          }
          helperText={
            (!!formik.touched.transactionAmount &&
              formik.errors.transactionAmount) ||
            (insufficientBalance && "Insufficient Balance 😞")
          }
          fullWidth
        />

        <TextField
          {...getTextFieldFormikProps(formik, "paymentTypeId")}
          label="Payment Type"
          select
          disabled
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
      </div>

      <div className="grid mb-4 sm:grid-cols-2 gap-4 ">
        <TextField
          {...getTextFieldFormikProps(formik, "accountNumber")}
          label="Account Number"
          focused
          inputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        {/* <TextField
          {...getTextFieldFormikProps(formik, "checkNumber")}
          label="Cheque#"
          fullWidth
        /> */}
        {/* <TextField
          {...getTextFieldFormikProps(formik, "routingCode")}
          label="Routing code"
          fullWidth
        /> */}
        <TextField
          {...getTextFieldFormikProps(formik, "receiptNumber")}
          inputProps={{
            readOnly: true,
          }}
          label="Account Name"
          focused
          fullWidth
        />
        <TextField
          {...getTextFieldFormikProps(formik, "bankNumber")}
          inputProps={{
            readOnly: true,
          }}
          label="Bank Name"
          fullWidth
        />
      </div>

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
          disabled={insufficientBalance}
        >
          Withdraw
        </LoadingButton>
      </div>
    </Modal>
  );
}
