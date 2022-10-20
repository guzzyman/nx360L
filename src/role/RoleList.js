import { useMemo } from "react";
import { Button, Icon, Paper, ButtonBase } from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import { useNavigate, useSearchParams, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { nimbleX360RoleApi } from "./RoleStoreQuerySlice";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
// import { format } from "date-fns";
import RoleStatusChip from "./RoleStatusChip";
import { OfficerTypeEnum } from "./RoleConstants";

function RoleList(props) {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

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

  const { data, isLoading, isError, refetch } =
    nimbleX360RoleApi.useGetRolesQuery({
      offset,
      limit,
      ...(debouncedQ
        ? {
            name: debouncedQ,
          }
        : {}),
    });

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data,
    manualPagination: true,
    dataCount: data?.totalFilteredRecords,
  });

  return (
    <>
      <PageHeader
        title="Role"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "System", to: RouteEnum.SYSTEM },
          {
            name: "Roles",
            to: RouteEnum.ROLES,
          },
        ]}
      >
        <Button
          endIcon={<Icon>add</Icon>}
          onClick={() => navigate(RouteEnum.ROLES_ADD)}
        >
          Add Role
        </Button>
      </PageHeader>
      <Paper className="grid gap-4 p-4">
        <div className="flex items-center mb-3">
          <div className="flex-1" />
          <SearchTextField
            size="small"
            value={tableInstance.state.globalFilter}
            onChange={(e) => {
              tableInstance.setGlobalFilter(e.target.value);
            }}
          />
        </div>
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () =>
              navigate(
                generatePath(RouteEnum.ROLES_EDIT, {
                  id: row.original.id,
                })
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default RoleList;

const columns = [
  { Header: "Name", accessor: "name" },
  {
    Header: "Category",
    accessor: (row) =>
      ({
        "": "-",
        [OfficerTypeEnum.LOAN]: "Loan Officer",
        [OfficerTypeEnum.COLLECTION]: "Collection Officer",
        [OfficerTypeEnum.TELESALES]: "Telesales Officer",
        [OfficerTypeEnum.UNDERWRITER]: "Underwriter Officer",
      }[
        row?.loanOfficer
          ? OfficerTypeEnum.LOAN
          : row?.collectionOfficer
          ? OfficerTypeEnum.COLLECTION
          : row?.telesalesOfficer
          ? OfficerTypeEnum.TELESALES
          : row?.underwriterType?.id > 0
          ? OfficerTypeEnum.UNDERWRITER
          : ""
      ]),
  },
  { Header: "Description", accessor: "description" },
  {
    Header: "Is Active",
    accessor: "disabled",
    Cell: ({ value }) => <RoleStatusChip status={value} />,
    width: 100,
  },
];
