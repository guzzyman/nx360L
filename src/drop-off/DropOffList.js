import { useState } from "react";
import { Paper, Tabs, Divider, Tab } from "@mui/material";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
// import { nx360TeleSalesApi } from "./TeleSalesStoreQuerySlice";
import DropOffMyDropOffs from "./DropOffMyDropOffs";
import DropOffMyTeamDropOff from "./DropOffMyTeamDropOff";
import DropOffAllDropOffs from "./DropOffAllDropOffs";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";

function DropOffList(props) {
  const authUserUIPermissionRestrictor = useAuthUserUIPermissionRestrictor();

  const [activeTab, setActiveTab] = useState(0);

  const tabs = authUserUIPermissionRestrictor.filter([
    {
      name: "MY DROP-OFFS",
      content: <DropOffMyDropOffs />,
      permissions: [UIPermissionEnum.READ_Active_Loans_Details],
    },
    {
      name: "MY TEAM DROP-OFFS",
      content: <DropOffMyTeamDropOff />,
      permissions: [UIPermissionEnum.READ_Active_Loan_Clients_Email],
    },
    {
      name: "ALL DROP-OFFS",
      content: <DropOffAllDropOffs />,
      permissions: [UIPermissionEnum.READ_Active_Loan_Summary_per_Branch],
    },
  ]);

  return (
    <>
      <PageHeader
        title="Drop-Offs"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Drop-Offs", to: RouteEnum.TELESALES_DROPOFF_LOANS },
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

export default DropOffList;
