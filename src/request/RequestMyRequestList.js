import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import * as dfn from "date-fns";
import RequestStatusChip from "./RequestStatusChip";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import useAuthUser from "hooks/useAuthUser";
import { sequestRequestApi } from "./RequestStoreQuerySlice";
import { useMemo, useState } from "react";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import { filterStatus } from "./RequestConstants";
import { MenuItem, TextField, Tooltip } from "@mui/material";
import SearchTextField from "common/SearchTextField";
import { renderRow } from "common/StandardTable";

function RequestMyRequestList(props) {
  const authUser = useAuthUser();
  const authUserStaffId = authUser?.staff?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState("");

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

  const { data, isLoading, isError, refetch, ButtonBase } =
    sequestRequestApi.useGetOutgoingRequestQuery({
      staffId: authUserStaffId,
      offset: parseInt(offset) ? parseInt(offset) / parseInt(limit) + 1 : 1,
      status: statusFilterString,
      limit,
      ...(debouncedQ
        ? {
            search: debouncedQ,
          }
        : {}),
    });

  const myRequestTableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.data,
    manualPagination: true,
    dataCount: data?.pageDetail?.recordCount,
    hideRowCounter: true,
  });
  const navigate = useNavigate();

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
            setStatusFilter(e.target.value);
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
        instance={myRequestTableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        pageSize={10}
        RowComponent={ButtonBase}
        rowProps={(row) => ({
          onClick: () =>
            navigate(
              generatePath(RouteEnum.SEQUEST_REQUEST_DETAILS, {
                id: row.original.ticketId,
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

export default RequestMyRequestList;

const columns = [
  {
    Header: "Ticket ID",
    accessor: "ticketId",
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
    accessor: (row) => dfn.format(new Date(row?.dateCreated), "dd MMMM yyyy"),
  },
  { Header: "Channel", accessor: "channel", width: 150 },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <RequestStatusChip status={value} />,
    width: 100,
  },
];
