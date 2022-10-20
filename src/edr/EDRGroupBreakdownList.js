import { Paper, Typography } from "@mui/material";
import CurrencyTypography from "common/CurrencyTypography";
import useTable from "hooks/useTable";
import { nxEDRApi } from "./EDRStoreQuerySlice";
import DynamicTable from "common/DynamicTable";

function EDRGroupBreakdownList(props) {
  const { columns, queryArgs, useGetGroupBreakdownQuery } = props;

  const { data, isLoading, isError, refetch } = useGetGroupBreakdownQuery(
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
      <Typography className="font-bold mb-4">Group Breakdowns</Typography>
      <DynamicTable
        instance={tableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
      />
    </Paper>
  );
}

EDRGroupBreakdownList.defaultProps = {
  columns: [
    {
      Header: "Transaction ID",
      accessor: "tranId",
    },
    {
      Header: "Amount",
      accessor: "tranAmount",
      Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
    },
    { Header: "Reference No", accessor: "reference" },
    {
      Header: "Transaction Date",
      accessor: (row) => row?.tranDate?.join("-"),
    },
    {
      Header: "Value Date",
      accessor: (row) => row?.valueDate?.join("-"),
    },
    {
      Header: "Entry Date",
      accessor: (row) => row?.createdDate?.join("-"),
    },
    {
      Header: "Entry",
      accessor: (row) => (row?.isManualEntry ? "MANUAL" : "SYSTEM"),
    },
  ],
  useGetGroupBreakdownQuery: nxEDRApi.useGetEDRInflowsQuery,
};

export default EDRGroupBreakdownList;
