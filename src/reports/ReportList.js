import { useMemo } from "react";
import { Paper, ButtonBase } from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import {
  useNavigate,
  useSearchParams,
  generatePath,
  useParams,
} from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { nimbleX360ReportApi } from "./ReportStoreQuerySlice";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";

function ReportList(props) {
  const navigate = useNavigate();

  const { R_reportCategory } = useParams();

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
    nimbleX360ReportApi.useGetReportsQuery({
      R_reportCategory,
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
    data,
    manualPagination: false,
    dataCount: data?.totalFilteredRecords,
  });

  return (
    <>
      <PageHeader
        title="Reports"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          {
            name: "Reports",
            to: generatePath(RouteEnum.REPORT, { R_reportCategory: "All" }),
          }, // path: generatePath(RouteEnum.REPORT, { R_reportCategory: "All" })
          {
            name: "Report List",
            to: RouteEnum.REPORT,
          },
        ]}
      ></PageHeader>
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
                generatePath(RouteEnum.REPORT_DETAILS, {
                  R_reportListing: row.original.report_name,
                  R_reportCategory,
                  id: row.original.report_id,
                })
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default ReportList;

const columns = [
  { Header: "Name", accessor: "report_name" },
  { Header: "Type", accessor: "report_type" },
  { Header: "Category", accessor: "report_category" },
];
