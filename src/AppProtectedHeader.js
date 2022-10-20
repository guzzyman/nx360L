import {
  AppBar,
  Divider,
  Icon,
  IconButton,
  Toolbar,
  useMediaQuery,
  Badge,
  Typography,
  Avatar,
  Container,
  ButtonBase,
  Menu,
  MenuItem,
  Popover,
  ListItemButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  APP_SIDE_MENU_WIDTH,
  DOCUMENT_PREVIEW_SIDE_MENU_WIDTH,
  MediaQueryBreakpointEnum,
  RouteEnum,
  UIPermissionEnum,
} from "common/Constants";
import usePopover from "hooks/usePopover";
import useSideMenu from "hooks/useSideMenu";
import {
  generatePath,
  matchPath,
  useLocation,
  useNavigate,
} from "react-router-dom";
import clsx from "clsx";
import useAuthUser from "hooks/useAuthUser";
import useLogout from "hooks/useLogout";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import useSideMenuTemporary from "hooks/useSideMenuTemporary";
import useDocumentPreviewSideMenu from "hooks/useDocumentPreviewSideMenu";

function AppProtectedHeader(props) {
  const islg = useMediaQuery(MediaQueryBreakpointEnum.lg);
  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);

  const { logoutMutation } = useLogout();

  const authUser = useAuthUser();

  const { toggleSideMenu } = useSideMenu();
  const { isSideMenuTemporary } = useSideMenuTemporary();
  const { isDocumentPreviewSideMenu } = useDocumentPreviewSideMenu();

  const menuPopover = usePopover();
  const infoPopover = usePopover();

  const fullname = `${authUser?.firstname} ${authUser?.lastname}`;

  async function logout() {
    infoPopover.togglePopover();
    try {
      await logoutMutation().unwrap();
    } catch (error) {}
  }

  const info = (
    <>
      <Typography className="text-center font-bold">{fullname}</Typography>
      <Typography variant="body2" className="text-center">
        {authUser?.staff?.organizationUnit?.name || authUser?.email}
      </Typography>
    </>
  );

  const infoAvatar = (
    <Avatar alt={fullname} className="w-8 h-8 ml-4">
      {fullname?.charAt(0)}
    </Avatar>
  );

  return (
    <AppBar
      color="secondary"
      style={{
        left: islg && !isDocumentPreviewSideMenu ? APP_SIDE_MENU_WIDTH : 0,
        right:
          islg && isDocumentPreviewSideMenu
            ? DOCUMENT_PREVIEW_SIDE_MENU_WIDTH
            : 0,
        width: islg
          ? `calc(100% - ${
              isDocumentPreviewSideMenu
                ? DOCUMENT_PREVIEW_SIDE_MENU_WIDTH
                : APP_SIDE_MENU_WIDTH
            }px)`
          : "100%",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {!isSideMenuTemporary && !islg && (
            <IconButton color="inherit" onClick={toggleSideMenu}>
              <Icon>menu</Icon>
            </IconButton>
          )}
          <div className="flex-1 self-stretch flex justify-center">
            {ismd ? (
              <div className="flex">
                {LINKS.map((link, key) => (
                  <AuthUserUIPermissionRestrictor
                    permissions={link.permissions}
                    validateAll={link.validateAllPermissions}
                    negateValidation={link.negatePermissionsValidation}
                  >
                    <HeaderMenuItem key={key} item={link} ismd={ismd} />
                  </AuthUserUIPermissionRestrictor>
                ))}
              </div>
            ) : (
              <>
                <ButtonBase onClick={menuPopover.togglePopover}>
                  Links <Icon color="primary">arrow_drop_down</Icon>
                </ButtonBase>
                <Menu
                  open={menuPopover.isOpen}
                  anchorEl={menuPopover.anchorEl}
                  onClose={menuPopover.togglePopover}
                  // anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  // transformOrigin={{ horizontal: "center" }}
                >
                  {LINKS.map((link, key) => (
                    <AuthUserUIPermissionRestrictor
                      permissions={link.permissions}
                      validateAll={link.validateAllPermissions}
                      negateValidation={link.negatePermissionsValidation}
                    >
                      <HeaderMenuItem
                        key={key}
                        item={link}
                        ismd={ismd}
                        onClick={menuPopover.togglePopover}
                      />
                    </AuthUserUIPermissionRestrictor>
                  ))}
                </Menu>
              </>
            )}
          </div>
          <Divider
            flexItem
            orientation="vertical"
            variant="middle"
            className="border-gray-50"
          />
          <IconButton color="inherit" className="mx-2">
            <Badge badgeContent={0} color="error">
              <Icon>notifications</Icon>
            </Badge>
          </IconButton>
          <Divider
            flexItem
            orientation="vertical"
            variant="middle"
            className="border-gray-50"
          />
          {islg ? (
            <ButtonBase
              className="flex items-center px-4 -mr-4"
              onClick={infoPopover.togglePopover}
            >
              <div>{info}</div>
              {infoAvatar}
            </ButtonBase>
          ) : (
            <>
              <IconButton onClick={infoPopover.togglePopover}>
                {infoAvatar}
              </IconButton>
            </>
          )}
          <Popover
            open={infoPopover.isOpen}
            anchorEl={infoPopover.anchorEl}
            onClose={infoPopover.togglePopover}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {!islg && (
              <>
                <div className="p-4">{info}</div> <Divider />
              </>
            )}
            <ListItem divider>
              <ListItemText variant="body2" className="text-center font-bold">
                <Typography
                  variant="caption"
                  className="text-center text-text-secondary block"
                >
                  SUPERVISOR
                </Typography>
                {authUser?.staff?.organisationalRoleParentStaff?.displayName ||
                  "--"}
              </ListItemText>
            </ListItem>
            <ListItemButton className="justify-center" onClick={logout}>
              <Icon>logout</Icon>
              <Typography className="ml-4">Logout</Typography>
            </ListItemButton>
          </Popover>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppProtectedHeader;

function HeaderMenuItem({ item, ismd, onClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const popOver = usePopover();

  function activeIndicator(selected) {
    return (
      ismd &&
      selected && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-primary-main"
          style={{ height: 4 }}
        />
      )
    );
  }

  if (item.children) {
    const selected = item.children.some(
      (child) => !!matchPath(child.path + "/*", location.pathname)
    );
    return (
      <>
        <MenuItem
          selected={selected}
          onClick={popOver.togglePopover}
          className={clsx("p-4 relative", !ismd && "flex")}
        >
          <Typography className="flex-1">{item.name}</Typography>
          <Icon color="primary">arrow_drop_down</Icon>
          {activeIndicator(selected)}
        </MenuItem>
        <Menu
          open={popOver.isOpen}
          anchorEl={popOver.anchorEl}
          onClose={popOver.togglePopover}
        >
          {item.children.map((child, key) => {
            const selected = !!matchPath(child.path + "/*", location.pathname);
            return (
              <AuthUserUIPermissionRestrictor
                permissions={child.permissions}
                validateAll={child.validateAllPermissions}
                negateValidation={child.negatePermissionsValidation}
              >
                <MenuItem
                  key={key}
                  selected={selected}
                  onClick={() => {
                    onClick?.();
                    popOver.togglePopover();
                    navigate(child.path);
                  }}
                >
                  <Typography color={selected ? "primary" : "textPrimary"}>
                    {child.name}
                  </Typography>
                </MenuItem>
              </AuthUserUIPermissionRestrictor>
            );
          })}
        </Menu>
      </>
    );
  }

  const selected = item.path
    ? !!matchPath(item.path + "/*", location.pathname)
    : false;

  return (
    <MenuItem
      selected={selected}
      className="p-4 relative"
      onClick={() => {
        onClick?.();
        navigate(item.path);
      }}
    >
      <Typography>{item.name}</Typography>
      {activeIndicator(selected)}
    </MenuItem>
  );
}

const LINKS = [
  {
    name: "CRM",
    permissions: [
      UIPermissionEnum.READ_CLIENT,
      UIPermissionEnum.READ_LEAD,
      UIPermissionEnum.READ_EMPLOYER,
    ],
    children: [
      {
        name: "Clients",
        path: RouteEnum.CRM_CLIENTS,
        permissions: [UIPermissionEnum.READ_CLIENT],
      },
      {
        name: "Leads",
        path: RouteEnum.CRM_LEADS,
        permissions: [UIPermissionEnum.READ_LEAD],
      },
      {
        name: "Employers",
        path: RouteEnum.CRM_EMPLOYER,
        permissions: [UIPermissionEnum.READ_EMPLOYER],
      },
      {
        name: "Vendors",
        path: RouteEnum.CRM_VENDOR,
        permissions: [
          UIPermissionEnum.READ_Vendor,
          UIPermissionEnum.READ_VENDOR,
        ],
      },
    ],
  },
  // {
  //   name: "Accounting",
  //   path: RouteEnum.ACCOUNTING,
  // },
  {
    name: "Administration",
    permissions: [
      UIPermissionEnum.READ_CDL_CONFIGURATION,
      UIPermissionEnum.CREATE_BANKACCOUNTTYPE,
      UIPermissionEnum.CREATE_BANKCLASSIFICATION,
      UIPermissionEnum.CREATE_CENTER,
      UIPermissionEnum.CREATE_CHARTSLAB,
      UIPermissionEnum.CREATE_CHARTSLAB_CHECKER,
      UIPermissionEnum.CREATE_TEMPLATE,
      UIPermissionEnum.CREATE_CENTER_CHECKER,

      UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT,
      UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT_CHECKER,
      UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT,
      UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT_CHECKER,
      UIPermissionEnum.UPDATE_PRODUCTMIX,
      UIPermissionEnum.CREATE_SAVINGSPRODUCT_CHECKER,
      UIPermissionEnum.UPDATE_LOANPRODUCT,
      UIPermissionEnum.UPDATE_LOANPRODUCT_CHECKER,
      UIPermissionEnum.CREATE_SAVINGSPRODUCT,
      UIPermissionEnum.UPDATE_SAVINGSPRODUCT,
      UIPermissionEnum.CREATE_DIVIDEND_SHAREPRODUCT_CHECKER,
    ],
    children: [
      {
        name: "Accounting",
        path: RouteEnum.ACCOUNTING,
        permissions: [UIPermissionEnum.CREATE_BANKACCOUNTTYPE],
      },
      {
        name: "Users",
        path: RouteEnum.USER,
        permissions: [UIPermissionEnum.CREATE_BANKCLASSIFICATION],
      },
      {
        name: "Organizations",
        path: RouteEnum.ADMINISTRATION_ORGANISATION,
        permissions: [UIPermissionEnum.CREATE_CENTER],
      },
      {
        name: "System",
        path: RouteEnum.SYSTEM,
        permissions: [UIPermissionEnum.CREATE_CHARTSLAB],
      },
      {
        name: "Products",
        path: RouteEnum.ADMINISTRATION_PRODUCTS,
        permissions: [
          UIPermissionEnum.CREATE_CHARTSLAB_CHECKER,
          UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT,
          UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT_CHECKER,
          UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT,
          UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT_CHECKER,
          UIPermissionEnum.UPDATE_PRODUCTMIX,
          UIPermissionEnum.CREATE_SAVINGSPRODUCT_CHECKER,
          UIPermissionEnum.UPDATE_LOANPRODUCT,
          UIPermissionEnum.UPDATE_LOANPRODUCT_CHECKER,
          UIPermissionEnum.CREATE_SAVINGSPRODUCT,
          UIPermissionEnum.UPDATE_SAVINGSPRODUCT,
          UIPermissionEnum.CREATE_DIVIDEND_SHAREPRODUCT_CHECKER,
        ],
      },
      {
        name: "Templates",
        path: "/Templates",
        permissions: [UIPermissionEnum.CREATE_TEMPLATE],
      },
      {
        name: "Bank Schedule",
        path: RouteEnum.BANK_SCHEDULE,
        permissions: [UIPermissionEnum.CREATE_CENTER_CHECKER],
      },
    ],
  },
  {
    name: "Report",
    permissions: [
      UIPermissionEnum.READ_COLLECTION_REPORT,
      UIPermissionEnum.READ_REPORT,
      UIPermissionEnum.READ_REPORTMAILINGJOB,
      UIPermissionEnum.REPORTING_SUPER_USER,
      UIPermissionEnum.CREATE_CREDITREPORT,
      UIPermissionEnum.UPDATE_CREDITREPORT,
      UIPermissionEnum.READ_Disbursal_Report,
    ],
    children: [
      {
        name: "All",
        path: generatePath(RouteEnum.REPORT, { R_reportCategory: "All" }),
        permissions: [UIPermissionEnum.READ_REPORT],
      },
      {
        name: "Clients",
        path: generatePath(RouteEnum.REPORT, { R_reportCategory: "Client" }),
        permissions: [UIPermissionEnum.READ_REPORTMAILINGJOB],
      },
      {
        name: "Loans",
        path: generatePath(RouteEnum.REPORT, { R_reportCategory: "Loan" }),
        permissions: [UIPermissionEnum.REPORTING_SUPER_USER],
      },
      {
        name: "Savings",
        path: generatePath(RouteEnum.REPORT, { R_reportCategory: "Savings" }),
        permissions: [UIPermissionEnum.CREATE_CREDITREPORT],
      },
      {
        name: "Funds",
        path: generatePath(RouteEnum.REPORT, { R_reportCategory: "Fund" }),
        permissions: [UIPermissionEnum.UPDATE_CREDITREPORT],
      },
      {
        name: "Accounting",
        path: generatePath(RouteEnum.REPORT, {
          R_reportCategory: "Accounting",
        }),
        permissions: [UIPermissionEnum.READ_Disbursal_Report],
      },
      // {
      //   name: "XBRL",
      //   path: generatePath(RouteEnum.REPORT, { R_reportCategory: "All" }),
      // },
    ],
  },
];
