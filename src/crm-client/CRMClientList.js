import { useMemo, useState } from "react";
import {
  Button,
  Icon,
  Paper,
  ButtonBase,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
  UIPermissionEnum,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import { useNavigate, useSearchParams, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import {
  formatTableDate,
  parseDateToString,
  urlSearchParamsExtractor,
} from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import CRMClientStatusChip from "./CRMClientStatusChip";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function CRMClientList(props) {
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(false);

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

  const [searchClient, clientSearchQuery] =
    nimbleX360CRMClientApi.useLazyGetCRMClientSearchQuery({
      ...(debouncedQ
        ? {
            exactMatch: false,
            query: debouncedQ,
            resource: "clients",
          }
        : {}),
    });

  // console.log("clientSearchQuery", clientSearchQuery);

  const dataQuery = nimbleX360CRMClientApi.useGetCRMClientsQuery({
    offset,
    limit,
    showOnlyNx360DataView: true,
    fields:
      "id,displayName,emailAddress,employmentSector,timeline,status,accountNo",
  });

  const tableInstance = usePaginationSearchParamsTable({
    columns: isSearch ? searchColumns : columns,
    data: isSearch ? clientSearchQuery?.data : dataQuery?.data?.pageItems,
    manualPagination: isSearch ? false : true,
    dataCount: isSearch
      ? clientSearchQuery?.length
      : dataQuery?.data?.totalFilteredRecords,
  });

  return (
    <>
      <PageHeader
        title="Clients"
        breadcrumbs={[
          { name: "CRM", to: RouteEnum.CRM_CLIENTS },
          { name: "Clients" },
        ]}
      >
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.CREATE_CLIENT]}
        >
          <Button
            endIcon={<Icon>add</Icon>}
            onClick={() => navigate(RouteEnum.CRM_CLIENTS_ADD)}
          >
            Add Client
          </Button>
        </AuthUserUIPermissionRestrictor>
      </PageHeader>
      <AuthUserUIPermissionRestrictor
        permissions={[UIPermissionEnum.READ_CLIENT]}
      >
        <Paper className="grid gap-4 p-4">
          <div className="flex">
            <div className="flex-1" />
            <div>
              <SearchTextField
                placeholder="Client (Name, ID, BVN, Email)"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        title="Search"
                        onClick={(e) => {
                          searchClient({
                            ...(debouncedQ
                              ? {
                                  exactMatch: false,
                                  query: debouncedQ,
                                  resource: "clients",
                                }
                              : {}),
                          });
                          setIsSearch(true);
                        }}
                        size="small"
                      >
                        <Icon>search</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchClient({
                      ...(debouncedQ
                        ? {
                            exactMatch: false,
                            query: debouncedQ,
                            resource: "clients",
                          }
                        : {}),
                    });
                    setIsSearch(true);
                  }
                }}
                size="small"
                value={q}
                onChange={(e) =>
                  setSearchParams(
                    { ...extractedSearchParams, q: e.target.value },
                    { replace: true }
                  )
                }
              />
              {isSearch && (
                <IconButton
                  title="Clear"
                  onClick={() => {
                    setIsSearch(false);
                    setSearchParams(
                      { ...extractedSearchParams, q: "" },
                      { replace: true }
                    );
                  }}
                >
                  <Icon>clear</Icon>
                </IconButton>
              )}
            </div>
          </div>
          <DynamicTable
            instance={tableInstance}
            loading={
              isSearch ? clientSearchQuery?.isFetching : dataQuery?.isFetching
            }
            error={isSearch ? clientSearchQuery?.isError : dataQuery?.isError}
            onReload={
              isSearch ? clientSearchQuery?.refetch : dataQuery?.refetch
            }
            RowComponent={ButtonBase}
            pageSize={30}
            rowProps={(row) => ({
              onClick: () =>
                navigate(
                  generatePath(RouteEnum.CRM_CLIENTS_DETAILS, {
                    id: isSearch ? row.original.entityId : row.original.id,
                  })
                ),
            })}
          />
        </Paper>
      </AuthUserUIPermissionRestrictor>
    </>
  );
}

export default CRMClientList;

const columns = [
  { Header: "Client ID", accessor: "id", width: 100 },
  { Header: "External ID", accessor: "accountNo", width: 100 },
  {
    Header: "Customer Segment",
    accessor: (row) => row?.employmentSector?.name,
  },
  {
    Header: "Name",
    accessor: (row) => row?.displayName?.toLocaleUpperCase(),
    width: 200,
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <CRMClientStatusChip status={value} />,
    width: 100,
  },
  {
    Header: "Date Created",
    width: 100,
    accessor: (row) =>
      row?.timeline?.submittedOnDate
        ? parseDateToString(row?.timeline?.submittedOnDate)
        : null,
  },
];

const searchColumns = [
  { Header: "Client ID", accessor: "entityId", width: 100 },
  { Header: "External ID", accessor: "entityAccountNo", width: 100 },
  {
    Header: "Customer Segment",
    accessor: (row) => row?.employmentSector?.name,
  },
  { Header: "Name", accessor: "entityName", width: 200 },
  { Header: "Mobile Number", accessor: "entityMobileNo", width: 200 },
  {
    Header: "Status",
    accessor: "entityStatus",
    Cell: ({ value }) => <CRMClientStatusChip status={value} />,
    width: 100,
  },
  {
    Header: "Date Created",
    width: 100,
    accessor: (row) =>
      row?.timeline?.submittedOnDate
        ? parseDateToString(row?.timeline?.submittedOnDate)
        : null,
  },
];
