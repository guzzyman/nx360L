import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import * as dfn from "date-fns";

function RecoveryDetailsHistory(props) {
  const { recoveryExceptionQueryResult } = props;
  const historyTableInstance = useTable({
    columns,
    data: recoveryExceptionQueryResult?.data?.data?.history,
    manualPagination: false,
  });
  
  return (
    <>
      <DynamicTable instance={historyTableInstance} />
    </>
  );
}

export default RecoveryDetailsHistory;

const columns = [
  { Header: "Action Performed By", accessor: "action" },
  { Header: "Action", accessor: "performedBy" },
  {
    Header: "Date",
    accessor: (row) => dfn.format(
      new Date(row?.datePerformed),
      "dd MMM yyyy, h:mm aaa"
    ),
  },
];
