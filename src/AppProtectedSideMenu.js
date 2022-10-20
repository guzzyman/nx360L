import {
  Drawer,
  useMediaQuery,
  Toolbar,
  List,
  ListItemButton,
  Icon,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  MediaQueryBreakpointEnum,
  APP_SIDE_MENU_WIDTH,
  RouteEnum,
  UIPermissionEnum,
} from "common/Constants";
import Logo from "common/Logo";
import useSideMenu from "hooks/useSideMenu";
import useSideMenuTemporary from "hooks/useSideMenuTemporary";
import { useEffect, useMemo, useState } from "react";
import {
  matchPath,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import clsx from "clsx";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function AppProtectedSideMenu(props) {
  const islg = useMediaQuery(MediaQueryBreakpointEnum.lg);

  const { isSideMenu, toggleSideMenu } = useSideMenu();
  const { isSideMenuTemporary } = useSideMenuTemporary();

  const [activeSection, setActiveSection] = useState(null);

  return (
    <Drawer
      open={isSideMenu}
      variant={!isSideMenuTemporary && islg ? "permanent" : "temporary"}
      PaperProps={{ style: { width: APP_SIDE_MENU_WIDTH } }}
      onClose={toggleSideMenu}
    >
      <Toolbar className="p-4 flex items-center justify-center">
        <Logo className="h-14" />
      </Toolbar>
      <List>
        {LINKS.map((link) => (
          <AuthUserUIPermissionRestrictor
            permissions={link.permissions}
            validateAll={link.validateAllPermissions}
            negateValidation={link.negatePermissionsValidation}
          >
            {link.children ? (
              <AppProtectedSideMenuSection
                key={link.name}
                section={link}
                toggleSideMenu={toggleSideMenu}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            ) : (
              <AppProtectedSideMenuItem
                key={link.name}
                item={link}
                toggleSideMenu={toggleSideMenu}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            )}
          </AuthUserUIPermissionRestrictor>
        ))}
      </List>
    </Drawer>
  );
}

export default AppProtectedSideMenu;

function AppProtectedSideMenuSection({
  activeSection,
  setActiveSection,
  section,
  toggleSideMenu,
}) {
  const location = useLocation();
  const isActiveSection = activeSection === section.name;
  const isOneChildActive = useMemo(
    () =>
      section.children.some((child) =>
        matchPath(child.path, location.pathname)
      ),
    [location.pathname, section.children]
  );

  return (
    <>
      <ListItemButton
        onClick={() => setActiveSection(isActiveSection ? null : section.name)}
        selected={isOneChildActive}
      >
        <ListItemIcon>
          <Icon>{section.icon}</Icon>
        </ListItemIcon>
        <ListItemText primary={section.name} />
        <ListItemSecondaryAction>
          <Icon>{isActiveSection ? "expand_less" : "expand_more"}</Icon>
        </ListItemSecondaryAction>
        {isOneChildActive && <AppProtectedSideMenuItemIndicator />}
      </ListItemButton>
      <Collapse in={isActiveSection}>
        <List>
          {section.children.map((item) => {
            return (
              <AuthUserUIPermissionRestrictor
                permissions={item.permissions}
                validateAll={item.validateAllPermissions}
                negateValidation={item.negatePermissionsValidation}
              >
                <AppProtectedSideMenuItem
                  key={item.name}
                  item={item}
                  toggleSideMenu={toggleSideMenu}
                  section={section}
                  setActiveSection={setActiveSection}
                />
              </AuthUserUIPermissionRestrictor>
            );
          })}
        </List>
      </Collapse>
    </>
  );
}

function AppProtectedSideMenuItem({
  item,
  toggleSideMenu,
  section,
  activeSection,
  setActiveSection,
}) {
  const navigate = useNavigate();

  const match = useMatch({ path: item.path, end: item.end });
  const isMatch = !!match;

  const isRoot = !section;

  useEffect(() => {
    if (isMatch && !isRoot) {
      setActiveSection(section?.name);
    }
  }, [isRoot, isMatch, section?.name, setActiveSection]);

  return (
    <ListItemButton
      className={clsx("relative")}
      selected={isMatch}
      onClick={() => {
        toggleSideMenu();
        navigate(item.path);
        if (isRoot) {
          setActiveSection(null);
        }
      }}
    >
      <ListItemIcon>{isRoot && <Icon>{item.icon}</Icon>}</ListItemIcon>
      <ListItemText primary={item.name} />
      {isMatch && isRoot && <AppProtectedSideMenuItemIndicator />}
    </ListItemButton>
  );
}

function AppProtectedSideMenuItemIndicator() {
  return <div className="absolute left-0 h-full w-1 bg-primary-main" />;
}

const LINKS = [
  {
    name: "Dashboard",
    path: RouteEnum.DASHBOARD,
    icon: "dashboard",
    end: true,
  },
  {
    name: "Sequest",
    path: RouteEnum.SEQUEST_REQUEST,
    icon: "filter_alt",
    permissions: [UIPermissionEnum.READ_JOURNALENTRY],
    children: [
      {
        name: "Request",
        path: RouteEnum.SEQUEST_REQUEST,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.READ_JOURNALENTRY],
      },
      {
        name: "Exception",
        path: RouteEnum.SEQUEST_EXCEPTION,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.READ_JOURNALENTRY],
      },
      // {
      //   name: "Work Flow",
      //   path: RouteEnum.SEQUEST_WORKFLOW,
      //   icon: "filter_alt",
      // },
    ],
  },
  {
    name: "EDR Transactions",
    path: RouteEnum.EDR,
    icon: "receipt_long",
    permissions: [
      UIPermissionEnum.READ_OFFICETRANSACTION,
      UIPermissionEnum.CREATE_FCMB,
      UIPermissionEnum.READ_EDRNOTE,
      UIPermissionEnum.CREATE_EDR,
      UIPermissionEnum.CREATE_EDRNOTE,
      UIPermissionEnum.SETTLECASHFROMCASHIER_TELLER,
      UIPermissionEnum.ALLOCATECASHTOCASHIER_TELLER,
    ],
    children: [
      {
        name: "FCMB Inflow",
        path: RouteEnum.EDR,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.CREATE_FCMB],
      },
      // {
      //   name: "Unprocessed EDR",
      //   path: RouteEnum.EDR_UNPROCESSED,
      //   icon: "filter_alt",
      //   permissions: [UIPermissionEnum.READ_EDRNOTE],
      // },
      {
        name: "Partially Processed EDR",
        path: RouteEnum.EDR_PARTIALLY_PROCESSED,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.CREATE_EDR],
      },
      {
        name: "Fully Processed EDR",
        path: RouteEnum.EDR_FULLY_PROCESSED,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.CREATE_EDRNOTE],
      },
      {
        name: "Single Payment Approval",
        path: RouteEnum.EDR_APPROVAL,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.SETTLECASHFROMCASHIER_TELLER],
      },
      {
        name: "Overpaid Loans",
        path: RouteEnum.EDR_OVERDUE_LOAN,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.ALLOCATECASHTOCASHIER_TELLER],
      },
      {
        name: "Fund Vendors",
        path: RouteEnum.EDR_FUND_VENDORS,
        icon: "filter_alt",
      },
    ],
  },
  // { name: "Insight", path: RouteEnum.INSIGHT, icon: "insights" },
  {
    name: "Telesales Management",
    path: RouteEnum.TELESALES,
    icon: "phone",
    permissions: [
      UIPermissionEnum.READ_TELESALES,
      UIPermissionEnum.CREATE_PRODUCTMIX,
      UIPermissionEnum.UPDATE_LOANNOTE,
      UIPermissionEnum.UPDATE_LOANNOTE_CHECKER,
      UIPermissionEnum.READ_SCHEDULER,
      UIPermissionEnum.READ_SMS,
      UIPermissionEnum.READ_SMSCAMPAIGN,
    ],
    children: [
      {
        name: "Product Recommendation",
        path: RouteEnum.TELESALES,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.CREATE_PRODUCTMIX],
      },
      {
        name: "Drop off Loans",
        path: RouteEnum.TELESALES_DROPOFF_LOANS,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.UPDATE_LOANNOTE],
      },
      {
        name: "Hot Leads",
        path: RouteEnum.TELESALES_HOT_LEADS,
        icon: "check_circle",
        permissions: [
          UIPermissionEnum.UPDATE_LOANNOTE_CHECKER,
          UIPermissionEnum.READ_SCHEDULER,
          UIPermissionEnum.READ_SMS,
          UIPermissionEnum.READ_SMSCAMPAIGN,
        ],
      },
    ],
  },
  {
    name: "Recovery Management",
    path: RouteEnum.RECOVERY,
    icon: "category",
    permissions: [
      UIPermissionEnum.RECOVERYPAYMENT_LOAN,
      UIPermissionEnum.READ_RESCHEDULELOAN,
      UIPermissionEnum.APPROVE_RESCHEDULELOAN,
    ],
    children: [
      {
        name: "Recovery",
        path: RouteEnum.RECOVERY,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.RECOVERYPAYMENT_LOAN],
      },
      {
        name: "Reschedule Loan",
        path: RouteEnum.RESCHEDULE_LOAN,
        icon: "check_circle",
        permissions: [UIPermissionEnum.APPROVE_RESCHEDULELOAN],
      },
    ],
  },
  {
    name: "Loan Approvals",
    path: RouteEnum.LOAN_UNDER_WRITING,
    icon: "list_alt",
    permissions: [UIPermissionEnum.APPROVE_LOAN_CHECKER],
    children: [
      {
        name: "Pending Loans",
        path: RouteEnum.LOAN_UNDER_WRITING_PENDING,
        icon: "filter_alt",
        permissions: [UIPermissionEnum.APPROVALUNDO_LOAN_CHECKER],
      },
      // {
      //   name: "Team Management",
      //   path: RouteEnum.LOAN_UNDER_WRITING_TEAM_MANAGEMENT,
      //   icon: "filter_alt",
      // },
      {
        name: "Client Approval",
        path: RouteEnum.CLIENT_APPROVAL,
        icon: "check_circle",
        permissions: [UIPermissionEnum.APPROVE_SAVINGSACCOUNT_CHECKER],
      },
    ],
  },
  {
    name: "Reconciliation",
    icon: "list_alt",
    // permissions: [UIPermissionEnum.APPROVALUNDO_LOAN_CHECKER],
    children: [
      {
        name: "Disbursements",
        path: RouteEnum.DISBURSEMENTS,
        icon: "filter_alt",
        // permissions: [UIPermissionEnum.APPROVALUNDO_LOAN_CHECKER],
      },
      {
        name: "Repayments",
        path: RouteEnum.REPAYMENTS,
        icon: "filter_alt",
      },
      {
        name: "Merchants",
        path: RouteEnum.MERCHANTS,
        icon: "check_circle",
        // permissions: [UIPermissionEnum.APPROVE_SAVINGSACCOUNT_CHECKER],
      },
      {
        name: "Exceptions",
        path: RouteEnum.EXCEPTIONS,
        icon: "check_circle",
        // permissions: [UIPermissionEnum.APPROVE_SAVINGSACCOUNT_CHECKER],
      },
    ],
  },
];
