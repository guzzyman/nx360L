import {
  Paper,
  Typography,
  ButtonBase,
  Button,
  Icon,
  IconButton,
} from "@mui/material";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { nimbleX360CRMEmployerApi } from "./CRMEmployerStoreQuerySlice";
import CEMEmployerDSRConfigAddEdit from "./CEMEmployerDSRConfigAddEdit";
import { useConfirmDialog } from "react-mui-confirm";
import { useSnackbar } from "notistack";

function CRMEmployerDSRConfigList(props) {
  const { businessId } = props;
  const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();

  const [dsrConfigDelete] =
    nimbleX360CRMEmployerApi.useDeleteEmployerDSRConfigMutation();
  const [openDSRConfigAddEditModal, setOpenDSRConfigAddEditModal] =
    useState(false);
  const [oDSRConfigDetails, setODSRConfigDetails] = useState(null);

  const getDSRConfigQuery =
    nimbleX360CRMEmployerApi.useGetEmployerDSRConfigsQuery({
      businessId,
      apptable: "m_client",
    });

  const handleDeleteDSRConfigOnConfirm = (businessId, id) =>
    confirm({
      title: "Are you sure you want to Delete DSR Config?",
      onConfirm: async () => {
        try {
          await dsrConfigDelete({
            businessId,
            id,
            params: { genericResultSet: "true" },
          }).unwrap();
          enqueueSnackbar(`DSR Config Deletion Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`DSR Config Deletion Failed`, { variant: "error" });
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  const columns = useMemo(
    () => [
      {
        Header: "Minimum Tenure",
        accessor: "minTenure",
      },
      {
        Header: "Miximum Tenure",
        accessor: "maxTenure",
      },
      {
        Header: "DSR New",
        accessor: "dsrNew",
      },
      {
        Header: "DSR Returning",
        accessor: "dsrReturning",
      },
      {
        Header: "isEnabled",
        accessor: "isEnabled",
      },
      {
        Header: "Actions",
        accessor: (row) => (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                setOpenDSRConfigAddEditModal(true);
                setODSRConfigDetails(row);
              }}
            >
              <Icon>edit</Icon>
            </IconButton>
            <IconButton
              color="error"
              onClick={() =>
                handleDeleteDSRConfigOnConfirm(businessId, row?.id)
              }
            >
              <Icon>delete</Icon>
            </IconButton>
          </>
        ),
      },
    ],
    [getDSRConfigQuery?.data]
  );

  const dsrConfigResult = getDSRConfigQuery?.data;

  const tableInstance = usePaginationSearchParamsTable({
    columns: columns,
    data: dsrConfigResult,
    manualPagination: false,
    totalPages: dsrConfigResult?.length,
  });

  return (
    <Paper className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Typography variant="h6" className="font-bold">
          DSR Config
        </Typography>
        <Button
          endIcon={<Icon>add</Icon>}
          onClick={() => {
            setOpenDSRConfigAddEditModal(true);
            setODSRConfigDetails(false);
          }}
          variant="outlined"
        >
          Add DSR Config Config
        </Button>
      </div>

      <DynamicTable
        instance={tableInstance}
        loading={getDSRConfigQuery.isLoading}
        error={getDSRConfigQuery.isError}
        onReload={getDSRConfigQuery.refetch}
        RowComponent={ButtonBase}
      />

      {openDSRConfigAddEditModal && (
        <CEMEmployerDSRConfigAddEdit
          dsrConfigDetail={oDSRConfigDetails}
          open={openDSRConfigAddEditModal}
          onClose={() => setOpenDSRConfigAddEditModal(false)}
          businessId={businessId}
        />
      )}
    </Paper>
  );
}

export default CRMEmployerDSRConfigList;
