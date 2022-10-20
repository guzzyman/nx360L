import { useMemo } from "react";
import { Paper, ButtonBase } from "@mui/material";
import { RouteEnum } from "common/Constants";
import { useNavigate, useSearchParams, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { nimbleX360CRMLeadApi } from "./CRMLeadStoreQuerySlice";
import { formatTableDate, urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import { LEAD_TABLE_PAGINATION_DEFAULT } from "./CRMLeadConstant";

function CRMLeadAllLeadList(props) {
  const { isMyLead, isMyTeamLead, leadOfficerId } = props;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        ...LEAD_TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { q, offset, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const { data, isLoading, isError, refetch } =
    nimbleX360CRMLeadApi.useGetCRMLeadsQuery({
      offset,
      limit,
      ...(isMyLead
        ? {
            leadOfficerId,
            orderBy: "id",
            sortOrder: "desc",
          }
        : {}),
      ...(debouncedQ
        ? {
            displayName: debouncedQ,
            // firstName: debouncedQ,
            // lastName: debouncedQ,
          }
        : {}),
      ...(isMyTeamLead ? { isTeamLead: true } : {}),
    });

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.pageItems,
    manualPagination: true,
    dataCount: data?.totalFilteredRecords,
  });

  return (
    <>
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
                generatePath(RouteEnum.CRM_LEADS_DETAILS, {
                  id: row.original.id,
                })
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default CRMLeadAllLeadList;

const columns = [
  {
    Header: "Name",
    accessor: (row) => row?.moreInfo?.clients?.displayName,
  },
  {
    Header: "Email",
    accessor: (row) => row?.moreInfo?.clients?.emailAddress,
  },
  {
    Header: "Lead Category",
    accessor: (row) => row?.leadCategory?.name,
  },
  {
    Header: "Lead Source",
    accessor: (row) => row?.leadSource?.name,
  },
  {
    Header: "Lead Rating",
    accessor: (row) => row?.leadRating?.name,
  },
  {
    Header: "Date Created",
    width: 100,
    accessor: (row) =>
      row?.moreInfo?.clients?.timeline?.submittedOnDate
        ? formatTableDate(
            new Date(...row?.moreInfo?.clients?.timeline?.submittedOnDate)
          )
        : null,
  },
];
