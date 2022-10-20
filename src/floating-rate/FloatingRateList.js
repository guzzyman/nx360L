import { useMemo } from "react";
import { Button, Icon, Paper, ButtonBase } from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import { useNavigate, useSearchParams, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { nimbleX360FloatingRateApi } from "./FloatingRateProductStoreQuerySlice";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import FloatingRateStatusChip from "./FloatingRateStatusChip";
import { format } from "date-fns";

function FloatingRatesList(props) {
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
    nimbleX360FloatingRateApi.useGetFloatingRatessQuery({
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
        title="Charges"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Product", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          {
            name: "Floating Rates",
            to: RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES,
          },
        ]}
      >
        <Button
          endIcon={<Icon>add</Icon>}
          onClick={() =>
            navigate(RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES_ADD)
          }
        >
          Add Floating Rate
        </Button>
      </PageHeader>
      <Paper className="grid gap-4 p-4">
        <div className="flex">
          <div className="flex-1" />
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
                generatePath(
                  RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES_DETAILS,
                  {
                    id: row.original.id,
                  }
                )
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default FloatingRatesList;

const columns = [
  { Header: "Name", accessor: "name" },
  {
    Header: "Created By",
    accessor: (row) => format(new Date(row?.createdOn), "dd MMMM yyyy"),
  },
  {
    Header: "Is Base Lending Rate?",
    accessor: "active",
    Cell: ({ value }) => <FloatingRateStatusChip status={value} />,
    width: 100,
  },
  {
    Header: "Is Active",
    accessor: "isActive",
    Cell: ({ value }) => <FloatingRateStatusChip status={value} />,
    width: 100,
  },
];
