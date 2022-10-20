import { useMemo } from "react";
import { Button, Icon, Paper, ButtonBase } from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import { useNavigate, useSearchParams, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { nimbleX360ChargeProductApi } from "./ChargeProductStoreQuerySlice";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import ChargeProductStatusChip from "./ChargeProductStatusChip";
import ChargeProductPenaltyChip from "./ChargeProductPenaltyChip";

function ChargeProductList(props) {
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
    nimbleX360ChargeProductApi.useGetChargeProductsQuery({
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

  console.log(tableInstance);

  return (
    <>
      <PageHeader
        title="Charges"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Product", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          { name: "Charges", to: RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES },
        ]}
      >
        <Button
          endIcon={<Icon>add</Icon>}
          onClick={() =>
            navigate(RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES_ADD)
          }
        >
          Add Charge
        </Button>
      </PageHeader>
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
                generatePath(
                  RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES_DETAILS,
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

export default ChargeProductList;

const columns = [
  { Header: "Name", accessor: "name" },
  { Header: "Applies to", accessor: "chargeAppliesTo.value" },
  { Header: "Amount", accessor: "amount" },
  {
    Header: "Penalty",
    accessor: "penalty",
    Cell: ({ value }) => <ChargeProductPenaltyChip status={value} />,
    width: 100,
  },
  {
    Header: "Status",
    accessor: "active",
    Cell: ({ value }) => <ChargeProductStatusChip status={value} />,
    width: 100,
  },
];
