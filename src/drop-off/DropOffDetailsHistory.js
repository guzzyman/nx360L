import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import * as dfn from "date-fns";

function DropOffDetailsHistory(props) {
  const { recoveryQueryResult } = props;
  const historyTableInstance = useTable({
    columns,
    data: recoveryQueryResult?.data?.data?.history,
    manualPagination: false,
  });
  
  return (
    <>
      <DynamicTable instance={historyTableInstance} />
    </>
  );
}

export default DropOffDetailsHistory;

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
