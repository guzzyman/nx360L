import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import * as dfn from "date-fns";
import RequestStatusChip from "./RequestStatusChip";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import SearchTextField from "common/SearchTextField";
import { sequestRequestApi } from "./RequestStoreQuerySlice";
import useDebouncedState from "hooks/useDebouncedState";
import { useMemo, useState } from "react";
import { urlSearchParamsExtractor } from "common/Utils";
import { ButtonBase, MenuItem, TextField, Tooltip } from "@mui/material";
import { renderRow } from "common/StandardTable";
import useAuthUser from "hooks/useAuthUser";
import { filterStatus } from "./RequestConstants";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";

function RequestAllRequestList(props) {
  const authUser = useAuthUser();
  const organizationUnitId = authUser?.staff?.organizationUnit?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState('');

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const statusFilterString = statusFilter;

  const { q, offset, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const { data, isLoading, isError, refetch } =
    sequestRequestApi.useGetRecentRequestPendingOnUnitQuery({
      organizationUnitId: organizationUnitId,
      offset: parseInt(offset) ? parseInt(offset) / parseInt(limit) + 1 : 1,
      status: statusFilterString,
      limit,
      ...(debouncedQ
        ? {
            search: debouncedQ,
          }
        : {}),
    });

  const navigate = useNavigate();
  const requestTableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.data,
    manualPagination: true,
    totalPages: 20, //data?.totalFilteredRecords,
    hideRowCounter: true,
  });

  return (
    <>
      <div className="flex items-center mb-3">
        <div className="flex-1" />
        <TextField
          style={{ minWidth: "150px" }}
          className="mr-4"
          size="small"
          label="Filter Status"
          onChange={(e) => {
            setStatusFilter(e.target.value)
          }}
          select
        >
          {filterStatus.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.statusDescription}
            </MenuItem>
          ))}
        </TextField>
        <SearchTextField
          size="small"
          // value={requestTableInstance.state.globalFilter}
          value={q}
          onChange={(e) => {
            setSearchParams({ ...extractedSearchParams, q: e.target.value });
            // requestTableInstance.setGlobalFilter(e.target.value);
          }}
        />
      </div>
      <DynamicTable
        instance={requestTableInstance}
        q={q}
        offset={offset}
        limit={limit}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
        rowProps={(row) => ({
          onClick: () =>
            navigate(
              generatePath(RouteEnum.SEQUEST_REQUEST_DETAILS, {
                id: row?.original?.ticketId,
              })
            ),
        })}
        renderRow={function (row) {
          return (
            <Tooltip followCursor title={row?.original?.subCategory}>
              {renderRow(...arguments)}
            </Tooltip>
          );
        }}
      />
    </>
  );
}

export default RequestAllRequestList;

const columns = [
  {
    Header: "Ticket ID",
    accessor: "ticketId",
  },
  {
    Header: "Ticket Type",
    accessor: "ticketType",
  },
  {
    Header: "Ticket Category",
    accessor: "category",
  },
  {
    Header: "Customer Type",
    accessor: "customerType",
  },
  {
    Header: "Customer Name",
    accessor: "customerName",
  },
  {
    Header: "Created Date",
    accessor: (row) =>
      dfn.format(new Date(row?.dateCreated), "dd MMMM yyyy hh:mm:ss"),
  },
  { Header: "Channel", accessor: "channel", width: 150 },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <RequestStatusChip status={value} />,
    width: 100,
  },
];
