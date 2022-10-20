import { ButtonBase, Paper } from "@mui/material";
import { useNavigate, generatePath, useSearchParams } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import {
  formatNumberToCurrency,
  parseDateToString,
  urlSearchParamsExtractor,
} from "common/Utils";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import { useMemo } from "react";
import useDebouncedState from "hooks/useDebouncedState";
import SearchTextField from "common/SearchTextField";
import PageHeader from "common/PageHeader";
import { Box } from "@mui/system";
import { nxEDRApi } from "edr/EDRStoreQuerySlice";

function EDRFundVendors(props) {
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

  const { q, offset } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });
  const { data, isLoading, isError, refetch } =
    nxEDRApi.useGetEDRFundVendorQuery();

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.savingsAccounts,
    manualPagination: true,
    dataCount: data?.length,
  });

  return (
    <Box>
      <PageHeader
        title="Fund Vendors"
        breadcrumbs={
          [
            //   { name: "CRM", to: RouteEnum.CRM_CLIENTS },
            //   { name: "Clients" },
          ]
        }
      />
      <Paper className="p-4">
        <div>
          <div className="flex mb-5">
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
                generatePath(RouteEnum.CRM_CLIENTS_WALLET_DETAILS, {
                  id: row.original.clientId,
                  walletId: row.original.id,
                })
              ),
          })}
          />
        </div>
      </Paper>
    </Box>
  );
}

export default EDRFundVendors;

const columns = [
  { Header: "Wallet ID", accessor: "accountNo", width: 100 },
  {
    Header: "Product",
    accessor: (row) => row?.productName,
  },
  {
    Header: "Amount",
    accessor: (row) =>
      row?.accountBalance
        ? `₦${formatNumberToCurrency(row?.accountBalance)}`
        : "₦0",
    width: 200,
  },
  // {
  //   Header: "Account Type",
  //   accessor: (row) => row?.accountType?.value,
  //   width: 200,
  // },
  // {
  //   Header: "Deposit Type",
  //   accessor: (row) => row?.depositType?.value,
  //   width: 200,
  // },
  {
    Header: "Submitted Date",
    width: 100,
    accessor: (row) =>
      row?.timeline?.submittedOnDate
        ? parseDateToString(row?.timeline?.submittedOnDate)
        : null,
  },
  // {
  //   Header: "Status",
  //   accessor: "status",
  //   Cell: ({ value }) => <ClientXLeadStatusChip status={value} />,
  //   width: 100,
  // },
];