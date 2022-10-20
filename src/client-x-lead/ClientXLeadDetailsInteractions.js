import { useState, useMemo } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { Button, Icon, Paper, Typography, ButtonBase } from "@mui/material";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { sequestRequestApi } from "client-x-lead-x-request/ClientXLeadXRequestStoreQuerySlice";
import ClientXLeadXRequestCreate from "client-x-lead-x-request/ClientXLeadXRequestCreate";
import ClientXLeadXRequestStatusChip from "client-x-lead-x-request/ClientXLeadXRequestStatusChip";
import { format } from "date-fns";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function ClientXLeadDetailsInteractions(props) {
  const { title = "Interactions", userType, customerId, maxDataCount } = props;
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } =
    sequestRequestApi.useGetRequestByClientIDQuery(customerId);

  const interactions = useMemo(
    () => data?.data?.slice(0, maxDataCount),
    [data?.data, maxDataCount]
  );

  const [openModal, setOpenModal] = useState(false);

  const interactionTableInstance = useTable({
    columns,
    data: interactions,
    manualPagination: false,
  });

  return (
    <>
      {openModal && (
        <ClientXLeadXRequestCreate
          title="Add Interaction"
          submitText="Submit Interation"
          open={openModal}
          onClose={() => setOpenModal(false)}
          userType={userType}
          customerId={customerId}
        />
      )}
      <Paper className="p-4 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <Typography variant="h6" className="font-bold">
            {title}
          </Typography>
          <AuthUserUIPermissionRestrictor
            permissions={[UIPermissionEnum.CREATE_INTERREQUEST]}
          >
            <Button
              endIcon={<Icon>add</Icon>}
              variant="outlined"
              onClick={() => setOpenModal(true)}
            >
              Add Interation
            </Button>
          </AuthUserUIPermissionRestrictor>
        </div>
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.READ_INTERREQUEST]}
        >
          <DynamicTable
            instance={interactionTableInstance}
            loading={isLoading}
            error={isError}
            onReload={refetch}
            RowComponent={ButtonBase}
            rowProps={(row) => ({
              onClick: () =>
                navigate(
                  generatePath(RouteEnum.SEQUEST_REQUEST_DETAILS, {
                    id: row.original.ticketId || null,
                  })
                ),
            })}
          />
        </AuthUserUIPermissionRestrictor>
      </Paper>
    </>
  );
}

export default ClientXLeadDetailsInteractions;

const columns = [
  { Header: "Ticket Id", accessor: "ticketId" },
  { Header: "Customer Type", accessor: "customerType", width: 100 },
  { Header: "Customer Name", accessor: "customerName" },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <ClientXLeadXRequestStatusChip status={value} />,
    width: 150,
  },
  { Header: "Channel", accessor: "channel", width: 150 },
  {
    Header: "Date Created",
    accessor: (row) => format(new Date(row?.dateCreated), "dd MMMM yyyy"),
  },
];
