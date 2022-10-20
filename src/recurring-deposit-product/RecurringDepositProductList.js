import { Button, ButtonBase, Icon, Paper } from "@mui/material";
import PageHeader from "common/PageHeader";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import SearchTextField from "common/SearchTextField";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import { nxRecurringDepositProductApi } from "./RecurringDepositProductStoreQuerySlice";
import DynamicTable from "common/DynamicTable";
import { useEffect, useMemo } from "react";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import useDataRef from "hooks/useDataRef";

function RecurringDepositProductList(props) {
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

  const { q } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(q, {
    wait: 200,
    enableReInitialize: true,
  });

  const { data, isLoading, isError, refetch } =
    nxRecurringDepositProductApi.useGetRecurringDepositProductsQuery({
      // offset,
      // limit,
      // ...(debouncedQ
      //   ? {
      //       name: debouncedQ,
      //     }
      //   : {}),
    });

  const tableInstance = usePaginationSearchParamsTable({ columns, data });

  const dataRef = useDataRef({ tableInstance });

  useEffect(() => {
    dataRef.current.tableInstance.setGlobalFilter(debouncedQ);
  }, [dataRef, debouncedQ]);

  return (
    <>
      <PageHeader
        title="Recurring Deposit Products"
        breadcrumbs={[
          {
            name: "Administration",
            to: RouteEnum.RECURRING_DEPOSIT_PRODUCT,
          },
          { name: "Fixed Deposit Products" },
        ]}
      >
        <Button
          endIcon={<Icon>add</Icon>}
          onClick={() => navigate(RouteEnum.RECURRING_DEPOSIT_PRODUCT_ADD)}
        >
          Create Recurring Deposit
        </Button>
      </PageHeader>
      <Paper className="p-4">
        <div className="flex items-center flex-wrap mb-4">
          <SearchTextField
            placeholder="Search item list"
            size="small"
            value={q}
            onChange={(e) =>
              setSearchParams(
                { ...extractedSearchParams, q: e.target.value },
                { replace: true }
              )
            }
          />
          <div className="flex-1" />
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
                generatePath(RouteEnum.RECURRING_DEPOSIT_PRODUCT_EDIT, {
                  id: row.original.id,
                })
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default RecurringDepositProductList;

const columns = [
  { Header: "Name", accessor: "name" },
  { Header: "Short Name", accessor: "shortName" },
  // {
  //   Header: "Expiry Date",
  //   accessor: (row) => row?.closeDate?.join("-"),
  //   id: "date",
  // },
  // {
  //   Header: "Status",
  //   accessor: "status",
  //   width: 70,
  //   Cell: ({ value }) => (
  //     <Chip
  //       className="w-full"
  //       variant="outlined-opaque"
  //       color={value === "loanProduct.active" ? "success" : "error"}
  //       label={value === "loanProduct.active" ? "Active" : "In Active"}
  //     />
  //   ),
  // },
];
