import DynamicTable from "common/DynamicTable";
import useTable from "hooks/useTable";

function EDRTransactionUploadErrorTable(props) {
  const { data } = props;
  const tableInstance = useTable({ data, columns });

  return <DynamicTable instance={tableInstance} />;
}

export default EDRTransactionUploadErrorTable;

const columns = [{ Header: "Message", accessor: "message" }];
