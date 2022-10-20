import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import {
  formatNumberToCurrency,
  getUserErrorMessage,
  parseDateToString,
} from "common/Utils";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Typography } from "@mui/material";
import { useConfirmDialog } from "react-mui-confirm";
import { format } from "date-fns/esm";
import { DateConfig } from "common/Constants";

export default function CRMClientLoanTransactionsDetails(props) {
  const { onClose, transactionId, ...rest } = props;
  const confirm = useConfirmDialog();
  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.usePostClientLoanTransactionDetailsMutation();

  const { data: templateOptionData, isLoading: templateOptionDataIsLoading } =
    nimbleX360CRMClientApi.useGetClientLoanTransactionDetailsQuery({
      loanId,
      transactionId,
    });

  const { enqueueSnackbar } = useSnackbar();

  const handleUndoTransactions = (loanId, transactionId) =>
    confirm({
      title: "Are you sure you want to Undo transactions?",
      onConfirm: async () => {
        try {
          const payLoad = {
            dateFormat: DateConfig.HYPHEN_dd_MM_yyyy,
            locale: DateConfig.LOCALE,
            transactionAmount: 0,
            transactionDate: format(new Date(), DateConfig.HYPHEN_dd_MM_yyyy),
          };
          await addMutation({
            loanId,
            transactionId,
            params: { command: "undo" },
            ...payLoad,
          }).unwrap();
          enqueueSnackbar(`Undo Loan  Successfully`, {
            variant: "success",
          });
          onClose();
        } catch (error) {
          enqueueSnackbar(
            getUserErrorMessage(error?.data?.errors) ||
              `Undo Loan  Failed`,
            { variant: "error" }
          );
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  const transactionDetails = [
    { name: "ID", value: templateOptionData?.id  || "____"},
    { name: "Type", value: templateOptionData?.type?.value   || "____" },
    { name: "Date", value: parseDateToString(templateOptionData?.date)   || "____" },
    { name: "Currency", value: templateOptionData?.currency?.name   || "____"},
    {
      name: "Amount",
      value: formatNumberToCurrency(templateOptionData?.amount)   || "____",
    },
  ];

  const transactionPaymentDetails = [
    {
      name: "Payment Type",
      value: templateOptionData?.paymentDetailData?.paymentType?.name,
    },
    {
      name: "Account Number",
      value: templateOptionData?.paymentDetailData?.accountNumber,
    },
    {
      name: "Cheque#",
      value: templateOptionData?.paymentDetailData?.checkNumber,
    },
    {
      name: "Routing Code",
      value: templateOptionData?.paymentDetailData?.routingCode,
    },
    {
      name: "Receipt#",
      value: templateOptionData?.paymentDetailData?.bankNumber,
    },
    {
      name: "Bank#",
      value: templateOptionData?.paymentDetailData?.routingCode,
    },
  ];
  return (
    <Modal onClose={onClose} size="md" title="Transaction Details" {...rest}>
      <div className="mt-4">
        {transactionDetails.map((item, i) => (
          <div key={i} className="grid grid-cols-2 mb-2">
            <Typography className="font-bold">{item.name}</Typography>
            <Typography>{item.value}</Typography>
          </div>
        ))}
      </div>

      {templateOptionData?.paymentDetailData && (
        <div className="mt-5">
          <Typography fontWeight={800} fontSize="20" className="mb-2 uppercase">
            Payment Details
          </Typography>
          {transactionPaymentDetails.map((item, i) => (
            <div key={i} className="grid grid-cols-2 mb-2">
              <Typography className="font-bold">{item.name}</Typography>
              <Typography>{item.value}</Typography>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="outlined" color="warning" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          size="large"
          loading={isLoading}
          disabled={templateOptionDataIsLoading}
          fullWidth
          //   variant="outline"
          color="error"
          onClick={() => handleUndoTransactions(loanId, transactionId)}
        >
          Undo Transaction
        </LoadingButton>
      </div>
    </Modal>
  );
}
