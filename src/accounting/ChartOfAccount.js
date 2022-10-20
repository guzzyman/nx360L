import { useMemo } from "react";
import { Button, Icon, Paper, ButtonBase } from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import { useNavigate, generatePath, useSearchParams } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { nimbleX360ChartOfAccountApi } from "./ChartOfAccountStoreQuerySlice";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";

function ChartOfAccount(props) {
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
    nimbleX360ChartOfAccountApi.useGetGLAccountsQuery({
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
    pageCount: data?.totalFilteredRecords,
  });

  return (
    <>
      <PageHeader
        title="Chart of Account"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Accounting", to: RouteEnum.ACCOUNTING },
          { name: "Chart of account" },
        ]}
      >
        <Button
          endIcon={<Icon>add</Icon>}
          onClick={() => navigate(RouteEnum.CHARTOFACCOUNTS_ADD)}
        >
          Add Account
        </Button>
      </PageHeader>
      <Paper className="grid gap-4 p-4">
        <div className="flex">
          <div className="flex-1" />
          <SearchTextField
            size="small"
            value={q}
            onChange={(e) =>
              setSearchParams(
                { ...extractedSearchParams, q: e.target.value },
                { replace: true }
              )
            }
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
                generatePath(RouteEnum.CHARTOFACCOUNTS_DETAILS, {
                  id: row.original.id,
                })
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default ChartOfAccount;

const columns = [
  { Header: "Account Name", accessor: "name" },
  { Header: "GL Code", accessor: "glCode" },
  { Header: "Account Type", accessor: "type.value", width: 100 },
  {
    Header: "Editable",
    accessor: (row) => (row.manualEntriesAllowed ? "Allowed" : "Not Allow"),
    width: 100,
  },
  { Header: "Used as", accessor: "usage.value" },
  // {
  //   Header: "Status",
  //   accessor: "disabled",
  //   Cell: ({ value }) => <AccountStatusChip status={value} />,
  //   width: 100,
  // },
];
