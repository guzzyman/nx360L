import React, { useMemo } from "react";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import { useTable } from "react-table";
import "./ClientLAF.css";

function ClientLAFRepaymentScheduleTable({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    manualPagination: false,
    hideRowCounter: true,
    totalPages: data?.length,
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((group) => (
          <tr {...group.getHeaderGroupProps()}>
            {group.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        {footerGroups.map((group) => (
          <tr {...group.getFooterGroupProps()}>
            {group.headers.map((column) => (
              <td {...column?.getFooterProps()}>{column?.render("Footer")}</td>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}

export function ClientLAFRepaymentSchedule({ data, dataTableTotal }) {
  const columns = useMemo(
    () => [
      {
        Header: "S/N",
        accessor: (row, i) => i + 1,
        width: 150,
        Footer: "Total",
      },
      {
        Header: "Date",
        accessor: (row) => parseDateToString(row?.dueDate),
      },
      {
        Header: "Principal",
        accessor: (row) =>
          row?.principalDue
            ? `₦${formatNumberToCurrency(row?.principalDue)}`
            : "",
        width: 150,
        Footer: dataTableTotal?.totalPrincipalDisbursed,
      },
      {
        Header: "Interest",
        accessor: (row) =>
          row?.interestDue
            ? `₦${formatNumberToCurrency(row?.interestDue)}`
            : "",
        width: 150,
        Footer: `₦${formatNumberToCurrency(
          dataTableTotal?.totalInterestCharged
        )}`,
      },
      {
        Header: "Fees",
        accessor: (row) => `₦${formatNumberToCurrency(row?.feeChargesDue)}`,
        width: 150,
        Footer: `₦${formatNumberToCurrency(
          dataTableTotal?.totalFeeChargesCharged || 0
        )}`,
      },
      {
        Header: "Payment Due",
        accessor: (row) =>
          row?.totalInstallmentAmountForPeriod
            ? `₦${formatNumberToCurrency(row?.totalInstallmentAmountForPeriod)}`
            : "",
        Footer: `₦${formatNumberToCurrency(
          dataTableTotal?.totalRepaymentExpected
        )}`,
      },

      // {
      //   Header: "Balance",
      //   accessor: (row) =>
      //     `₦${formatNumberToCurrency(row?.principalLoanBalanceOutstanding)}`,
      //   width: 150,
      //   // Footer: "Total",
      // },
    ],
    [dataTableTotal]
  );

  return (
    <ClientLAFRepaymentScheduleTable columns={columns} data={data || []} />
  );
}
