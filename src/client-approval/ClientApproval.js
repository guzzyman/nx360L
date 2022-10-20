import { Paper, Tabs, Tab } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import PageHeader from "common/PageHeader";
import ClientApprovalList from "./ClientApprovalList";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";
import { UIPermissionEnum } from "common/Constants";

function ClientApproval(props) {
  const authUserUIPermissionRestrictor = useAuthUserUIPermissionRestrictor();

  const [value, setValue] = useState(0);
  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      "aria-controls": `tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = authUserUIPermissionRestrictor.filter([
    {
      label: "My Pending Clients",
      content: <ClientApprovalList isTeamLead />,
      permissions: [UIPermissionEnum.TRANSFERCLIENTS_GROUP],
    },
    {
      label: "All Pending Clients",
      content: <ClientApprovalList allPendingSalesLoan />,
      permissions: [UIPermissionEnum.TRANSFERCLIENTS_GROUP_CHECKER],
    },
  ]);

  return (
    <Box>
      <PageHeader
        title="Pending Clients"
        breadcrumbs={
          [
            //   { name: "CRM", to: RouteEnum.CRM_CLIENTS },
            //   { name: "Clients" },
          ]
        }
      />
      <Paper className="p-4">
        <Box>
          <Tabs
            value={value}
            className="w-full"
            onChange={handleChange}
            aria-label="pending clients tab"
          >
            {tabs.map((tab, index) => (
              <Tab label={tab.label} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>

        <Box mt={3}>{tabs?.[value]?.content}</Box>
      </Paper>
    </Box>
  );
}

export default ClientApproval;
