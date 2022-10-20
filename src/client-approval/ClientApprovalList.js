import { useMemo } from "react";
import { Paper, ButtonBase } from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import { useNavigate, useSearchParams, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";

import { formatTableDate, urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";

function ClientApprovalList(props) {
  const { isTeamLead } = props;
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
    nimbleX360CRMClientApi.useGetCRMClientsQuery({
      offset,
      limit,
      status: "pending",
      ...(isTeamLead
        ? {
            isTeamLead: true,
          }
        : {}),
      ...(debouncedQ
        ? {
            displayName: debouncedQ,
            // firstName: debouncedQ,
            // lastName: debouncedQ,
          }
        : {}),
    });

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.pageItems,
    manualPagination: true,
    dataCount: data?.totalFilteredRecords,
  });

  return (
    <>
      <div className="grid gap-4 p-4">
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
                generatePath(RouteEnum.CRM_CLIENTS_DETAILS, {
                  id: row.original.id,
                })
              ),
          })}
        />
      </div>
    </>
  );
}

export default ClientApprovalList;

const columns = [
  { Header: "ID", accessor: "accountNo", width: 100 },
  {
    Header: "Customer Type",
    accessor: (row) => row?.employmentSector?.name,
  },
  { Header: "Name", accessor: "displayName", width: 200 },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <ClientXLeadStatusChip status={value} />,
    width: 100,
  },
  {
    Header: "Date Created",
    width: 100,
    accessor: (row) =>
      row?.timeline?.submittedOnDate
        ? formatTableDate(new Date(...row?.timeline?.submittedOnDate))
        : null,
  },
];
