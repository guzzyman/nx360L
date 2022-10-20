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
import { format } from "date-fns";
import CurrencyField from "common/CurrencyField";
import { dateLocaleFormat } from "common/Constants";

export default function CRMClientLoanFundTransfer(props) {
  const { onClose, ...rest } = props;
  const { id, loanId } = useParams();

  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientSavingsAccountAccountTransferMutation();

  const { enqueueSnackbar } = useSnackbar();

  const { data: templateOptionData, isLoading: templateOptionIsLoading } =
    nimbleX360CRMClientApi.useGetCRMClientsSavingAccountAccountTransferTemplateQuery(
      {
        fromAccountId: loanId,
        toOfficeId: 1,
        toAccountType: 2,
        fromAccountType: 1,
        toClientId: id,
      }
    );

  console.log(
    "filtwer",
    templateOptionData?.toAccountOptions?.filter((e) => e.productId === 1)
  );

  const formik = useFormik({
    initialValues: {
      fromAccountId: loanId,
      fromAccountType: 1,
      toOfficeId: 1,
      toClientId: templateOptionData?.fromAccount?.clientId || "",
      toAccountType: 2,
      toAccountId:
        templateOptionData?.fromClient?.savingsAccountId ||
        templateOptionData?.toAccountOptions?.filter(
          (e) => e.productId === 1
        )?.[0]?.id ||
        "",
      transferAmount: templateOptionData?.transferAmount || "",
      transferDate: format(new Date(), dateLocaleFormat.DATE_FORMAT),
      transferDescription: "",
      dateFormat: dateLocaleFormat.DATE_FORMAT,
      locale: dateLocaleFormat.LOCALE,
      fromClientId: id || templateOptionData?.fromAccount?.clientId || "",
      fromOfficeId: 1,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      transferAmount: Yup.string().required(),
      transferDescription: Yup.string().required(),
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

  const formClientData = [
    { label: "Applicant", value: templateOptionData?.fromClient?.displayName },
    { label: "Office", value: templateOptionData?.fromOffice?.name },
    {
      label: "From Account",
      value: `${templateOptionData?.fromAccount?.productName || "____"}-${
        templateOptionData?.fromAccount?.accountNo || "____"
      }`,
    },
    {
      label: "From Account Type",
      value: templateOptionData?.fromAccountType?.value,
    },
    {
      label: "Currency",
      value: templateOptionData?.currency?.name,
    },
  ];

  return (
    <Modal onClose={onClose} size="md" title="Funds Transfer" {...rest}>
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
        {/* <Typography gutterBottom fontWeight={900}>
          Transferring To
        </Typography> */}
        <div>
          <CurrencyField
            {...getTextFieldFormikProps(formik, "transferAmount")}
            label="Amount"
            focused
            InputProps={{ readOnly: true }}
            fullWidth
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
          loading={isLoading || templateOptionIsLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Submit
        </LoadingButton>
      </div>
    </Modal>
  );
}
