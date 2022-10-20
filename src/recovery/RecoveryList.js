import { useState } from "react";
import { Paper, Tabs, Divider, Tab } from "@mui/material";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import RecoveryMyRecovery from "./RecoveryMyRecovery";
import RecoveryMyTeamRecovery from "./RecoveryMyTeamRecovery";
import RecoveryAllRecovery from "./RecoveryAllRecovery";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function RecoveryList(props) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: "MY RECOVERY",
      permissions: [UIPermissionEnum.READ_RESCHEDULELOAN],
      content: <RecoveryMyRecovery />,
    },
    {
      name: "MY TEAM RECOVERY",
      permissions: [UIPermissionEnum.READ_COLLECTION_REPORT],
      content: <RecoveryMyTeamRecovery />,
    },
    {
      name: "ALL RECOVERY",
      permissions: [UIPermissionEnum.READ_COLLECTIONSHEET],
      content: <RecoveryAllRecovery />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Recovery"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Recovery", to: RouteEnum.RECOVERY },
        ]}
      ></PageHeader>
      <Paper className="p-4 md:p-8 mb-4">
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          {tabs?.map((tab, index) => (
            <AuthUserUIPermissionRestrictor
              key={tab.name}
              value={index}
              label={tab.name}
              permissions={tab.permissions}
            >
              {(params) => <Tab {...params} />}
            </AuthUserUIPermissionRestrictor>
          ))}
        </Tabs>
        <Divider className="mb-3" style={{ marginTop: -1 }} />
        {tabs?.[activeTab]?.content}
      </Paper>
    </>
  );
}

export default RecoveryList;
