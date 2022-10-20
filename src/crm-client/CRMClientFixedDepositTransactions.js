import { Paper, ButtonBase } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import useTable from "hooks/useTable";

function CRMClientFixedDepositTransactions(props) {
  const { queryResult } = props;
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
        />
      </Paper>
    </div>
  );
}

export default CRMClientFixedDepositTransactions;


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
    accessor: (row) => parseDateToString(row?.date),
    width: 150,
  },
  {
    Header: "Transaction Type",
    accessor: (row) => row?.transactionType?.value,
  },

  {
    Header: "Debit",
    accessor: (row) =>
      isDebit(row?.transactionType)
        ? `${row?.currency?.displaySymbol}${formatNumberToCurrency(
            row?.amount
          )}`
        : "--",
  },

  {
    Header: "Credit",
    accessor: (row) =>
      !isDebit(row?.transactionType)
        ? `${row?.currency?.displaySymbol}${formatNumberToCurrency(
            row?.amount
          )}`
        : "--",
  },
  {
    Header: "Balance",
    accessor: (row) =>
      `${row?.currency?.displaySymbol}${formatNumberToCurrency(
        row?.runningBalance
      )}`,
  },
];
