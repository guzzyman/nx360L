import { useState } from "react";
import { Button, Icon, Paper, Tabs, Divider, Tab } from "@mui/material";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import ClientXLeadXRequestCreate from "client-x-lead-x-request/ClientXLeadXRequestCreate";
import RequestMyRequestList from "./RequestMyRequestList";
import RequestMyTeamRequest from "./RequestMyTeamRequest";
import RequestAllRequestList from "./RequestAllRequestList";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";

function RequestList(props) {
  const [openModal, setOpenModal] = useState(false);

  const authUserUIPermissionRestrictor = useAuthUserUIPermissionRestrictor();

  const [activeTab, setActiveTab] = useState(0);

  const tabs = authUserUIPermissionRestrictor.filter([
    {
      name: "MY REQUEST",
      content: <RequestMyRequestList />,
      permissions: [UIPermissionEnum.CREATE_SAVINGSACCOUNTCHARGE],
    },
    {
      name: "MY TEAM REQUEST",
      content: <RequestMyTeamRequest />,
      permissions: [UIPermissionEnum.CREATE_SHAREACCOUNT],
    },
    {
      name: "RECENT REQUEST",
      content: <RequestAllRequestList />,
      permissions: [UIPermissionEnum.CREATE_SHAREPRODUCT],
    },
  ]);

  return (
    <>
      {openModal && (
        <ClientXLeadXRequestCreate
          title="New Request"
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
      <PageHeader
        title="Requests"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Sequest", to: RouteEnum.SEQUEST_REQUEST },
          { name: "Requests" },
        ]}
      >
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.CREATE_SAVINGSACCOUNT]}
        >
          <Button endIcon={<Icon>add</Icon>} onClick={() => setOpenModal(true)}>
            Initiate Request Ticket
          </Button>
        </AuthUserUIPermissionRestrictor>
      </PageHeader>
      <Paper className="p-4 md:p-8 mb-4">
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          {tabs?.map((tab, index) => (
            <Tab key={tab.name} value={index} label={tab.name} />
          ))}
        </Tabs>
        <Divider className="mb-3" style={{ marginTop: -1 }} />
        {tabs?.[activeTab]?.content}
      </Paper>
    </>
  );
}

export default RequestList;
