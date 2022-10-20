import { ButtonBase, TextField } from "@mui/material";
import { useNavigate, generatePath, useSearchParams } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import {
  parseDateToString,
  urlSearchParamsExtractor,
  formatNumberToCurrency,
} from "common/Utils";
import {
  DateConfig,
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
} from "common/Constants";
import { useMemo } from "react";
import useDebouncedState from "hooks/useDebouncedState";
import SearchTextField from "common/SearchTextField";
import useAuthUser from "hooks/useAuthUser";
import * as dfn from "date-fns";
import { DatePicker } from "@mui/lab";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";

function LoanUnderwritingPendingListScaffold({
  manualPagination,
  columns,
  queryParams,
  useQuery,
  getClientIdXLoanId,
}) {
  const authUser = useAuthUser();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        startPeriod: dfn.format(minStartPeriod, DateConfig.FORMAT),
        endPeriod: dfn.format(new Date(), DateConfig.FORMAT),
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );
  console.log("queryParams", useQuery);

  const { q, offset, limit, startPeriod, endPeriod } = extractedSearchParams;

  const fromDateInstance = new Date(startPeriod);
  const toDateInstance = new Date(endPeriod);

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    // offset,
    // limit,
    // locale: DateConfig.LOCALE,
    // dateFormat: DateConfig.FORMAT,
    // startPeriod,
    // endPeriod,
    ...(debouncedQ
      ? {
          accountNo: debouncedQ,
          // firstName: debouncedQ,
          // lastName: debouncedQ,
        }
      : {}),
    ...queryParams,
  });

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.pageItems,
    manualPagination,
    dataCount: data?.totalFilteredRecords,
  });

  function handleSetSearchParams(params) {
    setSearchParams({ ...extractedSearchParams, ...params }, { replace: true });
  }

  const callbackProps = { data };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {/* <DatePicker
          label="Start Date"
          value={fromDateInstance}
          minDate={minStartPeriod}
          disableFuture
          onChange={(newValue) => {
            handleSetSearchParams({
              startPeriod: dfn.format(newValue, DateConfig.FORMAT),
            });
          }}
          renderInput={(params) => <TextField size="small" {...params} />}
        />
        <DatePicker
          label="End Date"
          minDate={fromDateInstance}
          disableFuture
          value={toDateInstance}
          onChange={(newValue) => {
            handleSetSearchParams({
              endPeriod: dfn.format(newValue, DateConfig.FORMAT),
            });
          }}
          renderInput={(params) => <TextField size="small" {...params} />}
        /> */}
        <div className="flex-1" />
        <SearchTextField
          // onChange={(e) =>
          //   setSearchParams(
          //     { ...extractedSearchParams, q: e.target.value },
          //     { replace: true }
          //   )
          // }
          value={tableInstance.state.globalFilter}
          onChange={(e) => {
            tableInstance.setGlobalFilter(e.target.value);
          }}
        />
      </div>
      <DynamicTable
        instance={tableInstance}
        loading={isLoading || isFetching}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
        rowProps={(row) => ({
          onClick: () =>
            navigate(
              generatePath(
                RouteEnum.CRM_CLIENTS_LOAN_DETAILS,
                getClientIdXLoanId(row.original)
              )
            ),
        })}
      />
    </div>
  );
}

LoanUnderwritingPendingListScaffold.defaultProps = {
  manualPagination: false,
  getClientIdXLoanId: (data) => ({
    id: data.clientId,
    loanId: data.id,
  }),
};

export default LoanUnderwritingPendingListScaffold;

const minStartPeriod = new Date(2022, 4, 4);
