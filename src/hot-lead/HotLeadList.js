import { useState } from "react";
import { Paper, Tabs, Divider, Tab } from "@mui/material";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
// import { nx360HotleadsApi } from "./TeleSalesStoreQuerySlice";
import HotLeadMyHotLeads from "./HotLeadMyHotLeads";
import HotLeadMyTeamHotLead from "./HotLeadMyTeamHotLead";
import HotLeadAllHotLeads from "./HotLeadAllHotLeads";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";

function HotLeadList(props) {
  const authUserUIPermissionRestrictor = useAuthUserUIPermissionRestrictor();

  const [activeTab, setActiveTab] = useState(0);
  const tabs = authUserUIPermissionRestrictor.filter([
    {
      name: "MY HOT-LEADS",
      content: <HotLeadMyHotLeads />,
      permissions: [UIPermissionEnum.READ_SCHEDULER],
    },
    {
      name: "MY TEAM HOT-LEADS",
      content: <HotLeadMyTeamHotLead />,
      permissions: [UIPermissionEnum.READ_SMS],
    },
    {
      name: "ALL HOT-LEADS",
      content: <HotLeadAllHotLeads />,
      permissions: [UIPermissionEnum.READ_SMSCAMPAIGN],
    },
  ]);

  return (
    <>
      <PageHeader
        title="Hot-Leads"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Hot-Leads", to: RouteEnum.TELESALES_HOT_LEADS },
        ]}
      ></PageHeader>
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

export default HotLeadList;
