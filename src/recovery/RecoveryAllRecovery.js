import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import {
  CurrencyEnum,
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
} from "common/Constants";
import { formatNumberToCurrency, urlSearchParamsExtractor } from "common/Utils";
import RecoveryStatusChip from "./RecoveryStatusChip";
import { useEffect, useMemo, useState } from "react";
import useDebouncedState from "hooks/useDebouncedState";
import { nx360RecoveryApi } from "./RecoveryStoreQuerySlice";
import { Button, ButtonBase, MenuItem, TextField } from "@mui/material";
import SearchTextField from "common/SearchTextField";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";

function RecoveryAllRecovery(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productFilter, setProductFilter] = useState("");
  const productFilterString = productFilter;

  const productList = nx360RecoveryApi.useGetProductListQuery();
  const memoizedProductList = useMemo(() => productList, [productList]);

  const productListResult = memoizedProductList?.data;

  useEffect(() => {
    const defaultProduct = productListResult?.find(
      (option, index) =>
        option?.name?.includes("DEVICE") || option?.name?.includes("FINANCE")
    );
    setProductFilter(defaultProduct?.id || "");
  }, [productListResult]);

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
    nx360RecoveryApi.useGetAllRecoveryQuery({
      offset,
      limit,
      productId: productFilterString,
      ...(debouncedQ
        ? {
            ticketId: debouncedQ,
            customerType: debouncedQ,
            customerName: debouncedQ,
          }
        : {}),
    });

  const exportedFile = nx360RecoveryApi.useExportRecoveryQuery({
    offset,
    limit,
    productId: productFilterString,
    ...(debouncedQ
      ? {
          ticketId: debouncedQ,
          customerType: debouncedQ,
          customerName: debouncedQ,
        }
      : {}),
  });

  console.log(exportedFile?.data)

  const handleExport = () => {
    // Some code here
    console.log("Stuff was clicked!");
  };

  const myRequestTableInstance = usePaginationSearchParamsTable({
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
        <TextField
          style={{ minWidth: "150px" }}
          className="mr-4"
          size="small"
          label="Filter Products"
          onChange={(e) => {
            setProductFilter(e.target.value);
          }}
          value={productFilter}
          select
        >
          {productListResult &&
            productListResult?.map((option, index) => (
              <MenuItem key={option?.id} value={option?.id}>
                {option?.name}
              </MenuItem>
            ))}
        </TextField>
        <SearchTextField
          size="small"
          value={myRequestTableInstance.state.globalFilter}
          onChange={(e) => {
            myRequestTableInstance.setGlobalFilter(e.target.value);
          }}
        />
        {/* <Button
          style={{ minWidth: "150px", padding: "5px" }}
          className="ml-4"
          size="small"
          color="primary"
          onClick={() => {
            handleExport();
          }}
        >
          Export Records
        </Button> */}
      </div>
      <DynamicTable
        instance={myRequestTableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
        rowProps={(row) => ({
          onClick: () =>
            navigate(
              generatePath(RouteEnum.RECOVERY_DETAILS, {
                id: row?.original?.id,
              })
            ),
        })}
      />
    </>
  );
}

export default RecoveryAllRecovery;

const columns = [
  {
    Header: "Collection ID",
    accessor: (row) => `${row?.ticketNumber?.toUpperCase()}`,
    width: 250,
  },
  {
    Header: "Client Name",
    accessor: (row) => `${row?.clientData?.displayName?.toUpperCase()}`,
  },
  {
    Header: "Loan Product Name",
    accessor: (row) => `${row?.loan?.loanProductName}`,
  },
  {
    Header: "Recovery Officer",
    accessor: (row) =>
      `${row?.collectionOfficer?.map((item, index) =>
        !index ? item?.staff?.displayName?.toUpperCase() : undefined
      )}`,
  },
  {
    Header: "Skip Officer",
    accessor: (row) =>
      `${row?.collectionOfficer?.map((item, index) =>
        index ? item?.staff?.displayName?.toUpperCase() : undefined
      )}`,
  },
  {
    Header: "Status",
    accessor: (row) => <RecoveryStatusChip status={row?.ticketUpdate} />,
  },
  {
    Header: "Amount Paid (Total Repayment)",
    accessor: (row) =>
      `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(
        row?.loan?.summary?.totalRepayment
      )}`,
  },
  {
    Header: "Outstanding",
    accessor: (row) =>
      `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(
        row?.loan?.summary?.totalOutstanding
      )}`,
  },
  {
    Header: "Days Over Due",
    accessor: (row) => `${row?.daysOverDue} days`,
  },
];
