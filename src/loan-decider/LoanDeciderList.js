import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { Button, Icon, Paper, ButtonBase } from "@mui/material";
import { TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import { useSearchParams } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { urlSearchParamsExtractor } from "common/Utils";
import { LoanDeciderStoreQuerySlice } from "./LoanDeciderStoreQuerySlice";
import useDebouncedState from "hooks/useDebouncedState";
import LoanDeciderAddEditDialog from "./LoanDeciderAddEditDialog";

export default function LoanDeciderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openAddLoanDecider, setOpenAddLoanDecider] = useState(false);
  const [loanDeciderInstance, setLoanDeciderInstance] = useState({});
  const [page, setPage] = useState(0);
  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        name: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { name, offset, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(name, {
    wait: 1000,
    enableReInitialize: true,
  });

  const { data, isLoading, isError, refetch } =
    LoanDeciderStoreQuerySlice.useGetAdminLoanDecidersQuery(
      useMemo(
        () => ({
          Page: page,
          PageSize: limit,
          ...(debouncedQ
            ? {
                SearchTerm: debouncedQ,
                // firstName: debouncedQ,
                // lastName: debouncedQ,
              }
            : {}),
        }),
        [page, limit, debouncedQ]
      )
    );

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.data,
    manualPagination: true,
    dataCount: data?.data?.length,
  });

  useEffect(() => {
    setPage(tableInstance.state.pageIndex);
  }, [tableInstance.state.pageIndex, page]);

  return (
    <>
      <PageHeader
        title="Loan Decider"
        breadcrumbs={[{ name: "CRM", to: "/" }, { name: "Loan Decider" }]}
      >
        <Button
          variant="outlined"
          onClick={() => setOpenAddLoanDecider(true)}
          endIcon={<Icon>add</Icon>}
        >
          Add New
        </Button>
      </PageHeader>
      <Paper className="grid gap-4 p-4">
        <div className="flex">
          <div className="flex-1" />
          <SearchTextField
            size="small"
            value={name}
            placeholder="Search"
            onChange={(e) =>
              setSearchParams(
                { ...extractedSearchParams, name: e.target.value },
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
          pageSize={30}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () => {
              setLoanDeciderInstance(row.original);
              setOpenAddLoanDecider(true);
            },
          })}
        />
      </Paper>
      {openAddLoanDecider && (
        <LoanDeciderAddEditDialog
          loanDeciderInstance={loanDeciderInstance}
          setLoanDeciderInstance={setLoanDeciderInstance}
          open={openAddLoanDecider}
          onClose={() => setOpenAddLoanDecider(false)}
        />
      )}
    </>
  );
}

const columns = [
  {
    Header: "Product ID",
    accessor: "productId",
  },
  {
    Header: "Product Name",
    accessor: "productname",
  },

  {
    Header: "Bank Statement Analysis",
    accessor: (row) => (row?.bankStatement ? "True" : "False"),
  },

  {
    Header: "Credit Analysis",
    accessor: (row) => (row?.creditReport ? "True" : "False"),
  },

  {
    Header: "Remita Analysis",
    accessor: (row) => (row?.remit ? "True" : "False"),
  },

  {
    Header: "Bank Schedule Analysis",
    accessor: (row) => (row?.bankSchedule ? "True" : "False"),
  },
];
