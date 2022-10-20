import { useEffect, useState } from "react";
import { ButtonBase, Paper, Typography } from "@mui/material";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { TABLE_PAGINATION_DEFAULT } from "common/Constants";
import { nxEDRApi } from "./EDRStoreQuerySlice";
import EDRStatusChip from "./EDRStatusChip";
import CurrencyTypography from "common/CurrencyTypography";

function EDRBreakdownList({
  columns,
  queryArgs,
  onRowClick,
  useGetEDRsQuery,
  actions,
}) {
  const [{ offset, limit }, setTablePaginationConfig] = useState(
    TABLE_PAGINATION_DEFAULT
  );

  const { data, isLoading, isError, refetch } = useGetEDRsQuery(
    {
      offset,
      limit,
      // ...(debouncedQ
      //   ? {
      //       // displayName: debouncedQ,
      //       // firstName: debouncedQ,
      //       // lastName: debouncedQ,
      //     }
      //   : {}),
      ...queryArgs,
    },
    { skip: !queryArgs?.transId }
  );

  const tableInstance = useTable({
    columns,
    data: data?.pageItems,
    manualPagination: true,
    pageCount:
      data?.totalFilteredRecords > limit
        ? Math.ceil(data?.totalFilteredRecords / limit)
        : 1,
  });

  const callbackProps = { data };

  useEffect(() => {
    setTablePaginationConfig({
      offset: tableInstance.state.pageIndex * limit,
      limit: tableInstance.state.pageSize,
    });
  }, [limit, tableInstance.state.pageIndex, tableInstance.state.pageSize]);

  return (
    <Paper className="p-4 mb-4">
      <div className="flex items-center flex-wrap gap-4 mb-4">
        <Typography className="font-bold">Breakdowns</Typography>
        <div className="flex-1" />
        {actions?.(callbackProps)}
      </div>
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

EDRBreakdownList.defaultProps = {
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
      Cell: ({ value }) => <EDRStatusChip status={value} />,
    },
  ],
  useGetEDRsQuery: nxEDRApi.useGetUploadedEDRsTemplateQuery,
};

export default EDRBreakdownList;
