import { Paper, ButtonBase } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import useTable from "hooks/useTable";

function CRMClientLoanCollateral(props) {
  const { queryResult } = props;

  const { data, isLoading, isError, refetch } = queryResult;
  
  const tableInstance = useTable({
    columns,
    data: data?.collateral,
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

export default CRMClientLoanCollateral;

const columns = [
  {
    Header: "Type",
    accessor: (row) =>  row?.type?.name,
  },
  {
    Header: "Value",
    accessor: (row) => row?.currency?.displaySymbol + row?.value,
  },
  {
    Header: "Description",
    accessor: "description",
  },

];
