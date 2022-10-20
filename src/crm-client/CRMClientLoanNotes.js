import {
  Paper,
  ButtonBase,
  Typography,
  Icon,
  IconButton,
  Button,
} from "@mui/material";
import DynamicTable from "common/DynamicTable";

import { format } from "date-fns";
import useTable from "hooks/useTable";
import { useParams } from "react-router-dom";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import React, { useMemo, useState } from "react";
import CRMClientLoanNotesAddEdit from "./CRMClientLoanNotesAddEdit";

function CRMClientLoanNotes(props) {
  const { loanId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [noteId, setNoteId] = useState(null);

  const { data, isLoading, isError, refetch } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanNotesQuery(loanId);

  const columns = useMemo(
    () => [
      {
        Header: "Note",
        accessor: "note",
      },
      {
        Header: "Creation By",
        accessor: "createdByUsername",
      },
      {
        Header: "Created Date",
        accessor: (row) =>
          row?.createdOn && format(new Date(row?.createdOn), "dd MMMM yyyy"),
      },
      {
        Header: "Modified By",
        accessor: "updatedByUsername",
      },
      {
        Header: "Modified Date",
        accessor: (row) =>
          row?.updatedOn && format(new Date(row?.updatedOn), "dd MMMM yyyy"),
      },
      {
        Header: "Actions",
        accessor: (row) => (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                setNoteId(row?.id);
                setOpenModal(true);
              }}
            >
              <Icon>edit</Icon>
            </IconButton>{" "}
          </>
        ),
        width: 150,
      },
    ],
    // eslint-disable-next-line
    []
  );

  const tableInstance = useTable({
    columns,
    data: data,
    manualPagination: false,
    totalPages: data?.totalFilteredRecords,
  });

  return (
    <div className="pb-10">
      {openModal && (
        <CRMClientLoanNotesAddEdit
          open={openModal}
          noteId={noteId}
          onClose={() => setOpenModal(false)}
        />
      )}

      <Paper className="p-4 ">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Typography variant="h6" className="font-bold">
              Notes
            </Typography>
            <Button
              endIcon={<Icon>add</Icon>}
              variant="outlined"
              onClick={() => {
                setOpenModal(true);
                setNoteId(null);
              }}
            >
              Add Note
            </Button>
          </div>
          <DynamicTable
            instance={tableInstance}
            loading={isLoading}
            error={isError}
            onReload={refetch}
            renderPagination={() => null}
            RowComponent={ButtonBase}
          />
        </div>
      </Paper>
    </div>
  );
}

export default CRMClientLoanNotes;
