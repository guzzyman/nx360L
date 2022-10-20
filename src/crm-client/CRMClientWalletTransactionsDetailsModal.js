import { Typography } from "@mui/material";
import Modal from "common/Modal";
import { isObjectEmpty } from "common/Utils";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";

export default function CRMClientWalletTransactionsDetailsModal(props) {
  const { onClose, transactionId, ...rest } = props;
  const { walletId } = useParams();

  const { data: transactionData } =
    nimbleX360CRMClientApi.useGetClientSavingsAccountTransactionDetailsQuery({
      walletId,
      transactionId,
    });
  const transactionDetail = useMemo(
    () => [
      { label: "Transaction ID", value: transactionData?.id },
      {
        label: "Transaction Type",
        value: transactionData?.transactionType?.value,
      },
      { label: "Currency", value: transactionData?.currency?.name },
      { label: "Amount", value: transactionData?.amount },
    ],
    [transactionData]
  );

  const transactionPaymentDetail = useMemo(
    () => [
      { label: "Type", value: transactionData?.paymentType?.name },
      {
        label: "Account Number",
        value: transactionData?.accountNumber,
      },
      { label: "Cheque#", value: transactionData?.checkNumber },
      { label: "Routing Code", value: transactionData?.routingCode },
      { label: "Receipt#", value: transactionData?.receiptNumber },
      { label: "Bank#", value: transactionData?.bankNumber },
    ],
    [transactionData]
  );
  return (
    <Modal onClose={onClose} size="md" title="Transaction Details" {...rest}>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
        {transactionDetail?.map(({ label, value }) => (
          <div key={label} className="inline-grid gap-1 grid-cols-2 mb-4">
            <Typography color="textSecondary">{label}</Typography>

            <Typography fontWeight={600}>{value}</Typography>
          </div>
        ))}
      </div>

      {!isObjectEmpty(transactionPaymentDetail) && (
        <div className="mt-3">
          <Typography fontWeight={900}>Payment Details</Typography>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mt-2">
            {transactionPaymentDetail?.map(({ label, value }) => (
              <div key={label} className="inline-grid gap-1 grid-cols-2 mb-4">
                <Typography color="textSecondary">{label}</Typography>

                <Typography fontWeight={600}>{value}</Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
