import { useMemo, useState } from "react";
import {
  Button,
  Icon,
  Paper,
  ButtonBase,
  Tabs,
  Divider,
  Tab,
} from "@mui/material";
import {
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
  UIPermissionEnum,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import { nimbleX360UserManagementApi } from "./UserManagementStoreQuerySlice";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import useAuthUser from "hooks/useAuthUser";
import DynamicTable from "common/DynamicTable";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import UserManagementStatusChip from "./UserManagementStatusChip";
import SearchTextField from "common/SearchTextField";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function UserManagementList(props) {
  const navigate = useNavigate();
  const authUserUIPermissionRestrictor = useAuthUserUIPermissionRestrictor();

  const [activeTab, setActiveTab] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const authUser = useAuthUser();
  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { q, offset, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const usersQueryResult = nimbleX360UserManagementApi.useGetUsersQuery({
    offset,
    limit,
    ...(debouncedQ
      ? {
          name: debouncedQ,
        }
      : {}),
  });

  const teamsQueryResult = nimbleX360UserManagementApi.useGetStaffsQuery({
    organisationalRoleParentStaffId: authUser?.staff?.id,
  });

  const tabConfigs = authUserUIPermissionRestrictor.filter([
    {
      tab: "MY TEAM",
      queryResult: teamsQueryResult,
      columns: TEAMS_COLUMNS,
      permissions: [UIPermissionEnum.READ_USER],
    },
    {
      tab: "ALL USERS",
      queryResult: usersQueryResult,
      columns: USERS_COLUMNS,
      permissions: [UIPermissionEnum.CREATE_USER_CHECKER],
    },
  ]);

  const { columns, queryResult } = tabConfigs[activeTab];

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: queryResult?.data,
    manualPagination: true,
    dataCount: usersQueryResult?.totalFilteredRecords,
  });

  return (
    <>
      <PageHeader
        title="User Management"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Administration", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          { name: "Users" },
        ]}
      >
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.CREATE_USER]}
        >
          <Button
            endIcon={<Icon>add</Icon>}
            onClick={() => navigate(RouteEnum.USER_ADD)}
          >
            Add User
          </Button>
        </AuthUserUIPermissionRestrictor>
      </PageHeader>
      <Paper className="p-4 md:p-8 mb-4">
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          {tabConfigs?.map((config, index) => (
            <Tab key={config.tab} value={index} label={config.tab} />
          ))}
        </Tabs>
        <Divider className="mb-4" style={{ marginTop: -1 }} />
        <div className="flex items-center mb-4">
          <div className="flex-1" />
          <SearchTextField
            size="small"
            // value={q}
            value={tableInstance.state.globalFilter}
            onChange={(e) => {
              tableInstance.setGlobalFilter(e.target.value);
              // setSearchParams(
              //   { ...extractedSearchParams, q: e.target.value },
              //   { replace: true }
              // );
            }}
          />
        </div>
        <DynamicTable
          instance={tableInstance}
          loading={queryResult?.isLoading}
          error={queryResult?.isError}
          onReload={queryResult?.refetch}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () =>
              navigate(
                generatePath(
                  [RouteEnum.STAFF_DETAILS, RouteEnum.USER_DETAILS][activeTab],
                  {
                    id: row.original.id,
                  }
                )
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default UserManagementList;

const TEAMS_COLUMNS = [
  { Header: "First Name", accessor: "firstname" },
  { Header: "Last Name", accessor: "lastname" },
  {
    Header: "Team Lead",
    accessor: (row) => `${row?.organisationalRoleParentStaff?.displayName}`,
  },
  { Header: "Mobile No", accessor: "mobileNo" },
  {
    Header: "Available",
    accessor: (row) => <UserManagementStatusChip status={row?.isHoliday} />,
    width: 100,
  },
  {
    Header: "Loan Officer?",
    accessor: (row) => <UserManagementStatusChip status={row?.isLoanOfficer} />,
    width: 100,
  },
];

const USERS_COLUMNS = [
  { Header: "First Name", accessor: "firstname" },
  { Header: "Last Name", accessor: "lastname" },
  { Header: "User Name", accessor: "username", width: 300 },
  { Header: "Email Address", accessor: "email", width: 300 },
  {
    Header: "Role",
    accessor: (row) =>
      `${row?.selectedRoles?.map((item, index) => {
        return item.name.toUpperCase();
      })}`,
  },
];
