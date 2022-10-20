import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import * as dfn from "date-fns";

// import { sequestRequestApi } from "client-x-lead-x-request/ClientXLeadXRequestStoreQuerySlice";
// import { format } from "date-fns";

function RequestDetailsHistory(props) {
  const { requestQueryResult } = props;
  const historyTableInstance = useTable({
    columns,
    data: requestQueryResult?.data?.data?.history,
    manualPagination: false,
  });

  return (
    <>
      <DynamicTable instance={historyTableInstance} />
    </>
  );
}

export default RequestDetailsHistory;

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
