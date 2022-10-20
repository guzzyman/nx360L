import { Paper, ButtonBase, Typography } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import { format } from "date-fns";
import useTable from "hooks/useTable";
import { useState } from "react";

import CRMClientWalletTransactionsDetailsModal from "./CRMClientWalletTransactionsDetailsModal";

function CRMClientWalletTransactions(props) {
  const { queryResult } = props;
  const [openTransactionDetails, setOpenTransactionDetails] = useState(false);
  const [transactionId, setTransactionId] = useState();
  const { data, isLoading, isError, refetch } = queryResult;

  const tableInstance = useTable({
    columns,
    data: data?.transactions,
    manualPagination: true,
    totalPages: data?.totalFilteredRecords,
  });

  return (
    <div className="pb-10">
      <Paper className="p-4">
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () => {
              setTransactionId(row?.original?.id);
              setOpenTransactionDetails(true);
            },
          })}
        />

        {openTransactionDetails && (
          <CRMClientWalletTransactionsDetailsModal
            open={openTransactionDetails}
            transactionId={transactionId}
            onClose={() => setOpenTransactionDetails(false)}
          />
        )}
      </Paper>
    </div>
  );
}

export default CRMClientWalletTransactions;

function isDebit(transactionType) {
  return (
    transactionType.withdrawal === true ||
    transactionType.feeDeduction === true ||
    transactionType.overdraftInterest === true ||
    transactionType.withholdTax === true
  );
}

const columns = [
  {
    Header: "Transaction Date",
    accessor: (row) => (
      <Typography className={`${row?.reversed && "line-through text-red-500"}`}>
        {parseDateToString(row?.date)}
      </Typography>
    ),
    width: 150,
  },
  {
    Header: "Transaction Type",
    accessor: (row) => (
      <Typography className={`${row?.reversed && "line-through text-red-500"}`}>
        {row?.transactionType?.value}
      </Typography>
    ),
  },

  {
    Header: "Debit",
    accessor: (row) => (
      <Typography className={`${row?.reversed && "line-through text-red-500"}`}>
        {isDebit(row?.transactionType)
          ? `${row?.currency?.displaySymbol}${formatNumberToCurrency(
              row?.amount
            )}`
          : "--"}
      </Typography>
    ),
  },

  {
    Header: "Credit",
    accessor: (row) => (
      <Typography className={`${row?.reversed && "line-through text-red-500"}`}>
        {!isDebit(row?.transactionType)
          ? `${row?.currency?.displaySymbol}${formatNumberToCurrency(
              row?.amount
            )}`
          : "--"}
      </Typography>
    ),
  },
  {
    Header: "Submitted Date",
    accessor: (row) => (
      <Typography className={`${row?.reversed && "line-through text-red-500"}`}>
        {format(new Date(row?.timestampCreatedDate), "PPpp")}
      </Typography>
    ),
  },
  {
    Header: "Balance",
    accessor: (row) => (
      <Typography className={`${row?.reversed && "line-through text-red-500"}`}>
        {`${row?.currency?.displaySymbol}${formatNumberToCurrency(
          row?.runningBalance
        )}`}
      </Typography>
    ),
  },
];
