import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import {
  Autocomplete,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import { daysFromNow } from "./CRMClientUtils";
import CurrencyField from "common/CurrencyField";
import { useMemo } from "react";
import { useEffect } from "react";

export default function CRMClientWalletAccountTransferAction(props) {
  const { onClose, ...rest } = props;
  const { walletId } = useParams();

  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientSavingsAccountAccountTransferMutation();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      transferDate: format(new Date(), "dd MMMM yyyy"),
      fromAccountId: walletId,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      transferDate: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({
          ...values,
        }).unwrap();
        enqueueSnackbar(`Transfer Account Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Transfer Account Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  const { data } =
    nimbleX360CRMClientApi.useGetCRMClientsSavingAccountAccountTransferTemplateQuery(
      useMemo(
        () => ({
          fromAccountId: walletId,
          fromAccountType: formik?.values?.fromAccountType || 2,
          ...(formik?.values?.toOfficeId && {
            toOfficeId: formik?.values?.toOfficeId,
          }),
          ...(formik?.values?.toClientId && {
            toClientId: formik?.values?.toClientId,
          }),
          ...(formik?.values?.toAccountType && {
            toAccountType: formik?.values?.toAccountType,
          }),
          ...(formik?.values?.toAccountId && {
            toAccountId: formik?.values?.toAccountId,
          }),
        }),
        [
          formik?.values?.fromAccountType,
          formik?.values?.toOfficeId,
          formik?.values?.toClientId,
          formik?.values?.toAccountType,
          formik?.values?.toAccountId,
          walletId,
        ]
      )
    );

  useEffect(() => {
    if (data) {
      formik.setFieldValue("fromAccountType", data?.fromAccountType?.id);
      formik.setFieldValue("fromClientId", data?.fromClient?.id);
      formik.setFieldValue("fromOfficeId", data?.fromOffice?.id);
    }
    // eslint-disable-next-line
  }, [data]);

  const formClientData = [
    { label: "Applicant", value: data?.fromClient?.displayName },
    { label: "Office", value: data?.fromOffice?.name },
    {
      label: "From Account",
      value: `${data?.fromAccount?.productName}-${data?.fromAccount?.accountNo}`,
    },
    {
      label: "From Account Type",
      value: data?.fromAccountType?.value,
    },
    {
      label: "Currency",
      value: data?.currency?.name,
    },
  ];

  console.log(formik.values);
  return (
    <Modal onClose={onClose} size="md" title="Account Funds Transfer" {...rest}>
      <div className="mb-10">
        <Typography gutterBottom fontWeight={900}>
          Transferring From Details
        </Typography>
        <div className="grid sm:grid-cols-2 gap-2">
          {formClientData?.map((data) => (
            <div className="flex flex-wrap gap-1">
              <Typography>{data?.label}:</Typography>
              <Typography fontWeight={700}>{data?.value}</Typography>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Typography gutterBottom fontWeight={900}>
          Transferring To
        </Typography>
        <div className="grid sm:grid-cols-2 gap-4 mt-2">
          <TextField
            {...getTextFieldFormikProps(formik, "toOfficeId")}
            label="Office"
            select
            fullWidth
          >
            {data?.toOfficeOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option?.name}
              </MenuItem>
            ))}
          </TextField>

          <Autocomplete
            freeSolo
            onChange={(event, newValue) => {
              const regex = /\((.*)\)/;
              const newCleanedValue = newValue.match(regex)?.[1];

              formik.setFieldValue("toClientId", newCleanedValue);
            }}
            options={data?.fromClientOptions?.map(
              (option) => `(${option?.id}) - ${option?.displayName}`
            )}
            renderInput={(params) => <TextField {...params} label="Client" />}
          />

          <TextField
            {...getTextFieldFormikProps(formik, "toAccountType")}
            label="Account Type"
            select
            fullWidth
          >
            {data?.toAccountTypeOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option?.value}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            {...getTextFieldFormikProps(formik, "toAccountId")}
            label="Account"
            select
            fullWidth
          >
            {data?.toAccountOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option?.accountNo}
              </MenuItem>
            ))}
          </TextField>

          <CurrencyField
            {...getTextFieldFormikProps(formik, "transferAmount")}
            label="Amount"
            fullWidth
          />

          <DesktopDatePicker
            label="Transaction Date*"
            inputFormat="dd/MM/yyyy"
            minDate={daysFromNow(7, "past")}
            maxDate={new Date()}
            error={
              !!formik.touched.transferDate && !!formik.errors.transferDate
            }
            helperText={
              !!formik.touched.transferDate && formik.errors.transferDate
            }
            onChange={(newValue) => {
              if (isValid(new Date(newValue))) {
                formik.setFieldValue(
                  "transferDate",
                  format(new Date(newValue), "dd MMMM yyyy")
                );
              }
            }}
            value={formik.values?.transferDate || new Date()}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </div>
      </div>

      <TextField
        {...getTextFieldFormikProps(formik, "transferDescription")}
        label="Description"
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
          Submit
        </LoadingButton>
      </div>
    </Modal>
  );
}
