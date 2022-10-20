import { Paper, Typography } from "@mui/material";
import CurrencyTypography from "common/CurrencyTypography";
import useTable from "hooks/useTable";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import DynamicTable from "common/DynamicTable";

function EDRTransactionUploadBreakdownList(props) {
  const { columns, queryArgs } = props;

  const { data, isLoading, isError, refetch } =
    nxEDRTransactionApi.useGetEDRTransactionJournalEntriesQuery(
      {
        ...queryArgs,
      },
      { skip: !queryArgs?.uniqueId }
    );

  const tableInstance = useTable({
    columns,
    data: data?.pageItems,
    manualPagination: true,
    dataCount: data?.totalFilteredRecords,
  });

  return (
    <Paper className="p-4 mb-4">
      <Typography className="font-bold mb-4">Breakdowns</Typography>
      <DynamicTable
        instance={tableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
      />
    </Paper>
  );
}

EDRTransactionUploadBreakdownList.defaultProps = {
  columns: [
    {
      Header: "Transaction ID",
      accessor: "transactionId",
    },
    {
      Header: "Amount Remitted",
      accessor: "amount",
      Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
    },
    { Header: "FCMB Reference No", accessor: "referenceNumber" },
    {
      Header: "Transaction Date",
      accessor: (row) => row.transactionDate?.join("-"),
    },
  ],
};

export default EDRTransactionUploadBreakdownList;
