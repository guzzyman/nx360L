import DynamicTable from "common/DynamicTable";
import useTable from "hooks/useTable";

function EDRErrorTable(props) {
  const { data } = props;
  const tableInstance = useTable({ data, columns });

  return <DynamicTable instance={tableInstance} />;
}

export default EDRErrorTable;

const columns = [{ Header: "Message", accessor: "message" }];
