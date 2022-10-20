import { Paper, ButtonBase, IconButton, Icon } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import useTable from "hooks/useTable";

function CRMClientLoanCharges(props) {
  const { queryResult } = props;

  const { data, isLoading, isError, refetch } = queryResult;
  
  const tableInstance = useTable({
    columns,
    data: data?.charges,
    manualPagination: false,
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
          renderPagination={() => null}
          RowComponent={ButtonBase}
        />      
      </Paper>
    </div>
  );
}

export default CRMClientLoanCharges;

const columns = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Fee/Penalty",
    accessor: (row) => row?.penalty ? "Penalty": "Fee",
   
  },
  {
    Header: "Payment due at",
    accessor: (row) => row?.chargeTimeType?.value,
  
  },
  {
    Header: "Due as of",
    accessor: (row) => parseDateToString(row?.dueDate),

  },
  {
    Header: "Calculation Type",
    accessor: (row) =>
      row?.chargeCalculationType?.value,

  },
  {
    Header: "Due",
    accessor: (row) => `${row?.currency?.displaySymbol}${formatNumberToCurrency(row?.amount)}`,
    width: 150,
 
  },
  {
    Header: "Paid",
    accessor: (row) => `${row?.currency?.displaySymbol}${formatNumberToCurrency(row?.amountPaid)}`,
    width: 150,
  
  },
  {
    Header: "Waived",
    accessor: (row) => `${row?.currency?.displaySymbol}${formatNumberToCurrency(row?.amountWaived)}`,
    width: 150,

  },

  {
    Header: "Outstanding",
    accessor: (row) =>
      `${row?.currency?.displaySymbol}${formatNumberToCurrency(row?.amountOutstanding)}`,
    width: 150,
  
  },
  {
    Header: "Actions",
    accessor: (row) =><><IconButton><Icon>edit</Icon></IconButton> <IconButton><Icon>article</Icon></IconButton></>,
    width: 150,
  },
];
