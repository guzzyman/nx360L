import {
    Paper,
    ButtonBase,
    Typography,
    Icon,
    IconButton,
  } from "@mui/material";
  import DynamicTable from "common/DynamicTable";
  import useTable from "hooks/useTable";
  import { useParams } from "react-router-dom";
  import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
  import React, { useMemo, useState } from "react";
  
  import CRMClientLoanDocumentsAddEdit from "./CRMClientLoanDocumentsAddEdit";
  // import useAsyncUI from "hooks/useAsyncUI";
  
  import PdfPreviewerModal from "common/PdfPreviewerModal";
  import { Lightbox } from "react-modal-image";
  
  function CRMClientLoanOtherDocuments(props) {
    const { id } = useParams();
    const [openModal, setOpenModal] = useState(false);
   
    const { data, isLoading, isError, refetch } =
      nimbleX360CRMClientApi.useGetCRMClientAttachmentQuery(id);
    
    const [previewOpen, setPreviewOpen] = useState({});
    const closePreview = (id) => {
      setPreviewOpen({ [id]: false });
    };
  
    const columns = useMemo(
      () => [
        {
          Header: "name",
          accessor: (row) => row?.documentType?.name,
        },
        {
          Header: "Actions",
          accessor: (row, i) => (
            <>
              {previewOpen[i] &&
                (row?.attachment?.type.includes("pdf") ? (
                  <PdfPreviewerModal
                    open={previewOpen[i]}
                    title={row?.documentKey?.name}
                    fileUrl={row?.attachment?.location}
                    size="md"
                    onClose={() => closePreview(i)}
                  />
                ) : (
                  <Lightbox
                    alt={row?.documentKey?.name}
                    medium={row?.attachment?.location}
                    large={row?.attachment?.location}
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

            </>
          ),
          width: 150,
        },
      ],
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
        {openModal && (
          <CRMClientLoanDocumentsAddEdit
            open={openModal}
            onClose={() => setOpenModal(false)}
          />
        )}
  
        <Paper className="p-4 ">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Typography variant="h6" className="font-bold">
                Other Documents
              </Typography>
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
  
  export default CRMClientLoanOtherDocuments;
  