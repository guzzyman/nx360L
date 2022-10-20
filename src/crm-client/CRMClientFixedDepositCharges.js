import { Paper, ButtonBase } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import useTable from "hooks/useTable";

function CRMClientFixedDepositCharges(props) {
  const { queryResult } = props;
  const { data, isLoading, isError, refetch } = queryResult;

  const tableInstance = useTable({
    columns,
    data: data?.charges,
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

export default CRMClientFixedDepositCharges;

const columns = [
  {
    Header: "Name",
    accessor: (row) => row?.name,
    width: 150,
  },
  {
    Header: "Fee/Penalty",
    accessor: (row) => (row?.penalty === true ? "Penalty" : "Fee"),
  },

  {
    Header: "Payment Due At",
    accessor: (row) => row?.chargeTimeType?.value,
  },

  {
    Header: "Due As Of ",
    accessor: (row) => parseDateToString(row?.dueDate),
  },
  {
    Header: "Repeats On",
    accessor: (row) =>
      row?.feeOnMonthDay
        ? parseDateToString([2000]?.concat(row?.feeOnMonthDay))
        : "Unassigned",
  },
  {
    Header: "Calculation Type",
    accessor: (row) => row?.chargeCalculationType?.value,
  },

  {
    Header: "Due",
    accessor: (row) =>
      row?.currency?.displaySymbol + formatNumberToCurrency(row?.amount),
  },
  {
    Header: "Paid",
    accessor: (row) =>
      row?.currency?.displaySymbol + formatNumberToCurrency(row?.amountPaid),
  },
  {
    Header: "Waived",
    accessor: (row) =>
      row?.currency?.displaySymbol + formatNumberToCurrency(row?.amountWaived),
  },
  {
    Header: "Outstanding",
    accessor: (row) =>
      row?.currency?.displaySymbol +
      formatNumberToCurrency(row?.amountOutstanding),
  },
];
