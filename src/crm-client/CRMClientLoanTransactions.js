import { Paper, ButtonBase, IconButton, Icon, Typography } from "@mui/material";
import CurrencyTypography from "common/CurrencyTypography";
import DynamicTable from "common/DynamicTable";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import useTable from "hooks/useTable";
import { useMemo, useState } from "react";
import CRMClientLoanTransactionsDetails from "./CRMClientLoanTransactionsDetails";

function CRMClientLoanTransactions(props) {
  const { queryResult } = props;
  const [openTransactionDetails, setOpenTransactionDetails] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const { data, isLoading, isError, refetch } = queryResult;
  const transactions = data?.transactions || [];
  const dataReverse = useMemo(() => [...transactions]?.reverse(), [data]);

  const tableInstance = useTable({
    columns,
    data: dataReverse,
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
              if (
                !row.original?.type?.disbursement &&
                !row.original?.type?.accrual
              )
                setOpenTransactionDetails(true);
              setTransactionId(row.original?.id);
            },
          })}
        />
      </Paper>

      {openTransactionDetails && (
        <CRMClientLoanTransactionsDetails
          open={openTransactionDetails}
          transactionId={transactionId}
          onClose={() => setOpenTransactionDetails(false)}
        />
      )}
    </div>
  );
}

export default CRMClientLoanTransactions;

const columns = [
  {
    Header: "Office",
    accessor: (row) => (
      <Typography
        className={`${row?.manuallyReversed && "line-through text-red-500"}`}
      >
        {row?.officeName}
      </Typography>
    ),
  },
  {
    Header: "Transaction Date",
    accessor: (row) => (
      <Typography
        className={`${row?.manuallyReversed && "line-through text-red-500"}`}
      >
        {parseDateToString(row?.date)}
      </Typography>
    ),
    width: 150,
  },
  {
    Header: "Transaction Type",
    accessor: (row) => (
      <Typography
        className={`${row?.manuallyReversed && "line-through text-red-500"}`}
      >
        {row?.type?.value}
      </Typography>
    ),
  },
  {
    Header: "Amount",
    accessor: (row) => (
      <CurrencyTypography
        className={`${row?.manuallyReversed && "line-through text-red-500"}`}
      >
        {row?.amount}
      </CurrencyTypography>
    ),
  },
  // {
  //   Header: "Break Down",
  //   columns:
  // },

  {
    Header: "Principal",
    accessor: (row) => (
      <CurrencyTypography
        className={`${row?.manuallyReversed && "line-through text-red-500"}`}
      >
        {row?.principalPortion}
      </CurrencyTypography>
    ),
    width: 150,
  },
  {
    Header: "Interest",
    accessor: (row) => (
      <CurrencyTypography
        className={`${row?.manuallyReversed && "line-through text-red-500"}`}
      >
        {row?.interestPortion}
      </CurrencyTypography>
    ),
    width: 150,
  },
  {
    Header: "Fees",
    accessor: (row) => (
      <CurrencyTypography
        className={`${row?.manuallyReversed && "line-through text-red-500"}`}
      >
        {row?.feeChargesPortion}
      </CurrencyTypography>
    ),
    width: 150,
  },
  {
    Header: "Penalties",
    accessor: (row) => (
      <CurrencyTypography
        className={`${row?.manuallyReversed && "line-through text-red-500"}`}
      >
        {row?.penaltyChargesPortion}
      </CurrencyTypography>
    ),
    width: 150,
  },

  {
    Header: "Loan Balance",
    accessor: (row) => (
      <CurrencyTypography
        className={`${row?.manuallyReversed && "line-through text-red-500"}`}
      >
        {row?.outstandingLoanBalance}
      </CurrencyTypography>
    ),
    width: 150,
  },
  {
    Header: "Actions",
    accessor: (row) => (
      <>
        <IconButton color={`${row?.manuallyReversed ? "warning" : "primary"}`}>
          <Icon>description</Icon>
        </IconButton>{" "}
        <IconButton color={`${row?.manuallyReversed ? "warning" : "primary"}`}>
          <Icon>article</Icon>
        </IconButton>
      </>
    ),
    width: 150,
  },
];
