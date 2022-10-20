import { Paper, Typography } from "@mui/material";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { nxEDRApi } from "./EDRStoreQuerySlice";
import dfnFormat from "date-fns/format";
import { DateConfig } from "common/Constants";

function EDRNoteList(props) {
  const { useGetNotesQuery, queryArgs } = props;

  const { data, isLoading, isError, refetch } = useGetNotesQuery(queryArgs);

  const tableInstance = useTable({ columns, data });

  return (
    <Paper className="p-4 mb-4">
      <div className="flex items-center gap-4 mb-4">
        <Typography className="font-bold">Notes</Typography>
        <div className="flex-1" />
      </div>
      <DynamicTable
        instance={tableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
      />
    </Paper>
  );
}

EDRNoteList.defaultProps = {
  useGetNotesQuery: nxEDRApi.useGetEDRNotesQuery,
};

export default EDRNoteList;

const columns = [
  { Header: "Note", accessor: "note", width: 200 },
  { Header: "Created By", accessor: "createdByUsername" },
  { Header: "Updated By", accessor: "updatedByUsername" },
  {
    Header: "Created On",
    accessor: (row) => dfnFormat(row?.createdOn, DateConfig.FORMAT),
  },
  {
    Header: "Updated On",
    accessor: (row) => dfnFormat(row?.updatedOn, DateConfig.FORMAT),
  },
];
