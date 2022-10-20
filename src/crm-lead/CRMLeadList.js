import { useState } from "react";
import { Button, Icon, Paper, Tabs, Tab } from "@mui/material";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import { useNavigate } from "react-router-dom";
import CRMLeadAllLeadList from "./CRMLeadAllLeadList";
import { Box } from "@mui/system";
import useAuthUser from "hooks/useAuthUser";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";

function CRMLeadList(props) {
  const user = useAuthUser();
  const navigate = useNavigate();

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
      label: "MY LEADS",
      content: <CRMLeadAllLeadList isMyLead leadOfficerId={user?.staffId} />,
      permissions: [UIPermissionEnum.READ_LEAD],
    },
    {
      label: "MY TEAM LEADS",
      content: <CRMLeadAllLeadList isMyTeamLead />,
      permissions: [UIPermissionEnum.UPDATE_LEAD],
    },
    {
      label: "ALL LEADS",
      content: <CRMLeadAllLeadList />,
      permissions: [UIPermissionEnum.UPDATE_LOAN_CHECKER],
    },
  ]);

  return (
    <>
      <PageHeader
        title="Leads"
        breadcrumbs={[
          { name: "CRM", to: RouteEnum.CRM_LEADS },
          { name: "Leads" },
        ]}
      >
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.CREATE_LEAD]}
        >
          <Button
            endIcon={<Icon>add</Icon>}
            onClick={() => navigate(RouteEnum.CRM_LEADS_ADD)}
          >
            Add Lead
          </Button>
        </AuthUserUIPermissionRestrictor>
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.ADJUST_LOAN_CHECKER]}
        >
          <Button
            variant="outlined"
            endIcon={<Icon>file_upload</Icon>}
            onClick={() => navigate(RouteEnum.CRM_LEADS_UPLOAD)}
          >
            Upload Lead
          </Button>
        </AuthUserUIPermissionRestrictor>
      </PageHeader>
      <Paper className=" p-4">
        <Box>
          <Tabs value={value} onChange={handleChange}>
            {tabs.map((tab, index) => (
              <Tab label={tab.label} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>

        <Box mt={3}>{tabs?.[value]?.content}</Box>
      </Paper>
    </>
  );
}

export default CRMLeadList;
