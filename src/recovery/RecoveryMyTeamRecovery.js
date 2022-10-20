import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
// import * as dfn from "date-fns";
// import RequestStatusChip from "./RequestStatusChip";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import { CurrencyEnum, RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import { formatNumberToCurrency, urlSearchParamsExtractor } from "common/Utils";
import RecoveryStatusChip from "./RecoveryStatusChip";
import { nx360RecoveryApi } from "./RecoveryStoreQuerySlice";
import { MenuItem, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";

function RecoveryMyTeamRecovery(props) {
  const [productFilter, setProductFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const productFilterString = productFilter;
  const productList = nx360RecoveryApi.useGetProductListQuery();
  const memoizedProductList = useMemo(() => productList, [productList]);
  const productListResult = memoizedProductList?.data;

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
  const { data, isLoading, isError, refetch, ButtonBase } =
    nx360RecoveryApi.useGetMyTeamRecoveryQuery({offset, limit,
      productId: productFilterString,
    });

    useEffect(() => {
      const defaultProduct = productListResult?.find(
        (option, index) =>
          option?.name?.includes("DEVICE") || option?.name?.includes("FINANCE")
      );
      setProductFilter(defaultProduct?.id || "");
    }, [productListResult]);    

  const myRequestTableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.pageItems,
    manualPagination: false,
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
          value={productFilter}
          onChange={(e) => {
            setProductFilter(e.target.value);
          }}
          select
        >
          {productListResult &&
            productListResult?.map((option, index) => (
              <MenuItem key={option?.id} value={option?.id}>
                {option?.name}
              </MenuItem>
            ))}
        </TextField>
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

export default RecoveryMyTeamRecovery;

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
      `${row?.collectionOfficer?.map((item) => item?.staff?.displayName)}`,
  },
  {
    Header: "Skip Officer",
    accessor: (row) =>
      `${row?.collectionOfficer?.map((item) => item?.staff?.displayName)}`,
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
