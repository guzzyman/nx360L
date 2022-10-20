import {
  Paper,
  ButtonBase,
  Typography,
  Icon,
  IconButton,
  Button,
  Alert,
} from "@mui/material";
import DynamicTable from "common/DynamicTable";
import useTable from "hooks/useTable";
import { useParams } from "react-router-dom";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import React, { useMemo, useState } from "react";

import CRMClientLoanDocumentsAddEdit from "./CRMClientLoanDocumentsAddEdit";

import PdfPreviewerModal from "common/PdfPreviewerModal";
import { Lightbox } from "react-modal-image";
import { useConfirmDialog } from "react-mui-confirm";
import { useSnackbar } from "notistack";

function CRMClientLoanDocuments({ clientLoanQueryResult }) {
  const { loanId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();
  const documentSize = clientLoanQueryResult.data?.documentSize;

  const { data, isLoading, isError, refetch } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanDocumentsQuery(loanId);

  const [previewOpen, setPreviewOpen] = useState({});

  const closePreview = (id) => {
    setPreviewOpen({ [id]: false });
  };

  const [documentDelete] =
    nimbleX360CRMClientApi.useDeleteCRMClientLoanDocumentMutation();

  const handleDeleteNoteOnConfirm = (id) =>
    confirm({
      title: "Are you sure you want to Delete Document?",
      onConfirm: async () => {
        try {
          await documentDelete({ loanId, noteId: id }).unwrap();
          enqueueSnackbar(`Document Deletion Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Document Deletion Failed`, { variant: "error" });
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  const columns = useMemo(
    () => [
      {
        Header: "name",
        accessor: "name",
      },
      {
        Header: "description",
        accessor: "description",
      },
      {
        Header: "Actions",
        accessor: (row, i) => (
          <>
            {previewOpen[i] &&
              (row?.type.includes("pdf") ? (
                <PdfPreviewerModal
                  open={previewOpen[i]}
                  title={row?.name}
                  fileUrl={row?.location}
                  size="md"
                  onClose={() => closePreview(i)}
                />
              ) : (
                <Lightbox
                  alt={row?.name}
                  medium={row?.location}
                  large={row?.location}
                  onClose={() => closePreview(i)}
                />
              ))}
            <IconButton
              onClick={() => {
                setPreviewOpen({ [i]: true });
              }}
              color="primary"
            >
              <Icon>preview</Icon>
            </IconButton>

            <a href={row?.location} download>
              <IconButton>
                <Icon>download</Icon>
              </IconButton>
            </a>

            <IconButton
              color="warning"
              onClick={() => handleDeleteNoteOnConfirm(row?.id)}
            >
              <Icon>delete</Icon>
            </IconButton>
          </>
        ),
        width: 150,
      },
    ],
    // eslint-disable-next-line
    [previewOpen]
  );

  const tableInstance = useTable({
    columns,
    data: data,
    manualPagination: false,
    totalPages: data?.totalFilteredRecords,
  });

  return (
    <div className="pb-10">
      <Paper className="p-4 ">
        <div>
          <div className="flex items-center flex-wrap gap-4 mb-4">
            <Typography variant="h6" className="font-bold">
              Documents
            </Typography>
            <Button
              endIcon={<Icon>add</Icon>}
              variant="outlined"
              onClick={() => setOpenModal(true)}
            >
              Add Document
            </Button>
            {documentSize && (
              <Alert severity="info">
                Add atleast {documentSize} documents before you can send loan
                for approval
              </Alert>
            )}
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

      {openModal && (
        <CRMClientLoanDocumentsAddEdit
          clientLoanQueryResult={clientLoanQueryResult}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}

export default CRMClientLoanDocuments;
