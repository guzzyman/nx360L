import { useState } from "react";
import { Paper, Tabs, Divider, Tab } from "@mui/material";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
// import { nx360TeleSalesApi } from "./TeleSalesStoreQuerySlice";
import TelesalesMyTelesales from "./TelesalesMyTelesales";
import TelesalesMyTeamSales from "./TelesalesMyTeamSales";
import TeleSalesAllTeleSales from "./TeleSalesAllTeleSales";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";

function TelesalesList(props) {
  const [activeTab, setActiveTab] = useState(0);

  const authUserUIPermissionRestrictor = useAuthUserUIPermissionRestrictor();

  const tabs = authUserUIPermissionRestrictor.filter([
    {
      name: "MY TELESALES",
      content: <TelesalesMyTelesales />,
      permissions: [UIPermissionEnum.UPDATE_TELESALES],
    },
    {
      name: "MY TEAM TELESALES",
      content: <TelesalesMyTeamSales />,
      permissions: [UIPermissionEnum.ASSIGNOFFICER_TELESALES],
    },
    {
      name: "ALL TELESALES",
      content: <TeleSalesAllTeleSales />,
      permissions: [UIPermissionEnum.READ_Active_Loans_Summary],
    },
  ]);

  return (
    <>
      <PageHeader
        title="Telesales"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Telesales", to: RouteEnum.TELESALES },
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

export default TelesalesList;
