import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import {
  CurrencyEnum,
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
} from "common/Constants";
import { formatNumberToCurrency, parseDateToString, urlSearchParamsExtractor } from "common/Utils";
import TelesalesStatusChip from "./DropOffStatusChip";
import { nx360DropOffApi } from "./DropOffsStoreQuerySlice";
import useDebouncedState from "hooks/useDebouncedState";
import { useMemo } from "react";
import SearchTextField from "common/SearchTextField";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";

function DropOffMyTeamDropOff(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  //   const [statusFilter, setStatusFilter] = useState("");

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  //   const statusFilterString = statusFilter;

  const { q, offset, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const { data, isLoading, isError, refetch } =
    nx360DropOffApi.useGetMyTeamDropOffsQuery({
      offset,
      limit,
      ...(debouncedQ
        ? {
            search: debouncedQ,
          }
        : {}),
    });
    console.log(`My team drop off limit: ${limit} offset: ${offset} & Q: ${q}`, data);
  const myDropOffTableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.pageItems,
    manualPagination: true,
    dataCount: data?.totalFilteredRecords,
    hideRowCounter: true,
  });

  
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center mb-3">
        <div className="flex-1" />
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
        instance={myDropOffTableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        // RowComponent={ButtonBase}
        rowProps={(row) => ({
          onClick: () =>
            navigate(
              generatePath(RouteEnum.TELESALES_DROPOFF_LOANS_DETAILS, {
                id: row?.original?.id,
              })
            ),
        })}
      />
    </>
  );
}

export default DropOffMyTeamDropOff;

const columns = [
  {
    Header: "ID",
    accessor: (row) => `${row?.ticketNumber?.toUpperCase()}`,
    width: 200,
  },
  {
    Header: "Client Name",
    accessor: (row) => `${row?.clientData?.displayName?.toUpperCase()}`,
  },
  {
    Header: "Loan Product Name",
    accessor: (row) => `${row?.loanAccountData?.loanProductName}`,
  },
  {
    Header: "Ticket Status",
    accessor: (row) => `${row?.isTicketClosed}`,
    Cell: ({ value }) => <TelesalesStatusChip status={value} />,
    width: 100,
  },
  {
    Header: "Loan Amount",
    accessor: (row) =>
      `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(
        row?.loanAccountData?.approvedPrincipal
      )}`,
  },
  {
    Header: "Loan Product State",
    accessor: (row) => `${row?.loanAccountData?.loanProductDescription}`,
  },
  {
    Header: "Loan Officer",
    accessor: (row) => `${row?.officer?.staff?.displayName}`,
  },
  {
    Header: "Created Date",
    accessor: (row) => `${parseDateToString(row?.createdDate)}`,
  },
];
