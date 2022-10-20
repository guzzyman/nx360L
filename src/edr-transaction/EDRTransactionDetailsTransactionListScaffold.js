import { useEffect, useState } from "react";
import { ButtonBase, Paper } from "@mui/material";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { TABLE_PAGINATION_DEFAULT } from "common/Constants";
import { useParams } from "react-router-dom";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import EDRTransactionStatusChip from "./EDRTransactionStatusChip";
import CurrencyTypography from "common/CurrencyTypography";

function EDRTransactionDetailsTransactionListScaffold({
  columns,
  queryArgs,
  onRowClick,
  useGetEDRTransactionQuery,
}) {
  const { id } = useParams();

  const [{ offset, limit }, setTablePaginationConfig] = useState(
    TABLE_PAGINATION_DEFAULT
  );

  const { data, isLoading, isError, refetch } = useGetEDRTransactionQuery({
    offset,
    limit,
    // ...(debouncedQ
    //   ? {
    //       // displayName: debouncedQ,
    //       // firstName: debouncedQ,
    //       // lastName: debouncedQ,
    //     }
    //   : {}),
    transId: id,
    ...queryArgs,
  });

  const tableInstance = useTable({
    columns,
    data: data?.pageItems,
    manualPagination: true,
    pageCount:
      data?.totalFilteredRecords > limit
        ? Math.ceil(data?.totalFilteredRecords / limit)
        : 1,
  });

  useEffect(() => {
    setTablePaginationConfig({
      offset: tableInstance.state.pageIndex * limit,
      limit: tableInstance.state.pageSize,
    });
  }, [limit, tableInstance.state.pageIndex, tableInstance.state.pageSize]);

  return (
    <Paper className="p-4 mb-4">
      <DynamicTable
        instance={tableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
        rowProps={(row) => ({
          onClick: (e) => onRowClick?.(e, row),
        })}
      />
    </Paper>
  );
}

EDRTransactionDetailsTransactionListScaffold.defaultProps = {
  columns: [
    { Header: "Employer", accessor: "employerName" },
    { Header: "Employee Name", accessor: "employeeName" },
    { Header: "Loan Type", accessor: "elementName" },
    { Header: "Staff ID", accessor: "employeeNumber" },
    { Header: "Ref ID", accessor: "refId" },
    { Header: "Period", accessor: (row) => row?.period?.join("-") },
    {
      Header: "Deduction Amount",
      accessor: "deductionAmount",
      Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => <EDRTransactionStatusChip status={value} />,
    },
  ],
  useGetEDRTransactionQuery: nxEDRTransactionApi.useGetEDRTransactionsQuery,
};

export default EDRTransactionDetailsTransactionListScaffold;
