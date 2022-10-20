import { Paper, ButtonBase, Typography } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import useTable from "hooks/useTable";
import { useMemo } from "react";

function CRMClientLoanRepaymentSchedule(props) {
  const { queryResult, original } = props;

  const { data, isLoading, isError, refetch } = queryResult;

  const totalPrincipalDisbursed = original
    ? data?.originalSchedule?.totalPrincipalDisbursed
    : data?.repaymentSchedule?.totalPrincipalDisbursed || 0;
  const totalInterestCharged = original
    ? data?.originalSchedule?.totalInterestCharged
    : data?.repaymentSchedule?.totalInterestCharged || 0;
  const totalFeeChargesCharged = original
    ? data?.originalSchedule?.totalFeeChargesCharged
    : data?.repaymentSchedule?.totalFeeChargesCharged || 0;
  const totalRepaymentExpected = original
    ? data?.originalSchedule?.totalRepaymentExpected
    : data?.repaymentSchedule?.totalRepaymentExpected || 0;
  const totalOutstanding = original
    ? data?.originalSchedule?.totalOutstanding
    : data?.repaymentSchedule?.totalOutstanding || 0;
  const totalPenaltyChargesCharged = original
    ? data?.originalSchedule?.totalPenaltyChargesCharged
    : data?.repaymentSchedule?.totalPenaltyChargesCharged || 0;
  const totalPaidInAdvance = original
    ? data?.originalSchedule?.totalPaidInAdvance
    : data?.repaymentSchedule?.totalPaidInAdvance || 0;
  const totalPaidLate = original
    ? data?.originalSchedule?.totalPaidLate
    : data?.repaymentSchedule?.totalPaidLate || 0;
  const totalPaid = original
    ? data?.originalSchedule?.totalRepayment
    : data?.repaymentSchedule?.totalRepayment || 0;

  const dataTableTotal = useMemo(
    () => ({
      totalPrincipalDisbursed,
      totalInterestCharged,
      totalFeeChargesCharged,
      totalRepaymentExpected,
      totalOutstanding,
      totalPenaltyChargesCharged,
      totalPaidInAdvance,
      totalPaidLate,
      totalPaid,
    }),
    [
      totalPrincipalDisbursed,
      totalInterestCharged,
      totalFeeChargesCharged,
      totalRepaymentExpected,
      totalOutstanding,
      totalPenaltyChargesCharged,
    ]
  );

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: (row) => row?.period,
        width: 50,
        Footer: "Total",
      },
      {
        Header: "Days",
        accessor: (row) => row?.daysInPeriod,
        width: 50,
      },
      {
        Header: "Date",
        accessor: (row) => parseDateToString(row?.fromDate),
        width: 150,
      },
      {
        Header: "Due Date",
        accessor: (row) => parseDateToString(row?.dueDate),
      },
      {
        Header: "Paid Date",
        accessor: (row) => parseDateToString(row?.obligationsMetOnDate),
      },

      {
        Header: "Principal Due",
        accessor: (row) => `${formatNumberToCurrency(row?.principalDue)}`,
        width: 150,
        Footer: `₦${formatNumberToCurrency(
          dataTableTotal?.totalPrincipalDisbursed
        )}`,
      },
      {
        Header: "Balance Of Loan",
        accessor: (row) =>
          `${formatNumberToCurrency(row?.principalLoanBalanceOutstanding)}`,
        width: 150,
      },
      {
        Header: "Interest",
        accessor: (row) => `${formatNumberToCurrency(row?.interestDue)}`,
        width: 150,
        Footer: `₦${formatNumberToCurrency(
          dataTableTotal?.totalInterestCharged
        )}`,
      },
      {
        Header: "Fees",
        accessor: (row) => `${formatNumberToCurrency(row?.feeChargesDue)}`,
        width: 150,
        Footer: `₦${formatNumberToCurrency(
          dataTableTotal?.totalFeeChargesCharged || 0
        )}`,
      },
      {
        Header: "Penalties",
        accessor: (row) => `${formatNumberToCurrency(row?.penaltyChargesDue)}`,
        width: 150,
        Footer: `₦${formatNumberToCurrency(
          dataTableTotal?.totalPenaltyChargesCharged
        )}`,
      },
      {
        Header: "Due",
        accessor: (row) => `${formatNumberToCurrency(row?.totalDueForPeriod)}`,
        width: 150,
        Footer: `₦${formatNumberToCurrency(
          dataTableTotal?.totalRepaymentExpected
        )}`,
      },
      {
        Header: "Paid",
        accessor: (row) => `${formatNumberToCurrency(row?.totalPaidForPeriod)}`,
        width: 150,
        Footer: `₦${formatNumberToCurrency(dataTableTotal?.totalPaid)}`,
      },
      {
        Header: "In Advance",
        accessor: (row) =>
          `${formatNumberToCurrency(row?.totalPaidInAdvanceForPeriod)}`,
        width: 150,
        Footer: `₦${formatNumberToCurrency(
          dataTableTotal?.totalPaidInAdvance
        )}`,
      },
      {
        Header: "Late",
        accessor: (row) =>
          `${formatNumberToCurrency(row?.totalPaidLateForPeriod)}`,
        width: 150,
        Footer: `₦${formatNumberToCurrency(dataTableTotal?.totalPaidLate)}`,
      },
      {
        Header: "Outstanding",
        accessor: (row) =>
          `${formatNumberToCurrency(row?.totalOutstandingForPeriod)}`,
        width: 150,
        Footer: `₦${formatNumberToCurrency(dataTableTotal?.totalOutstanding)}`,
      },
    ],
    [dataTableTotal]
  );

  const tableInstance = useTable({
    columns,
    // initialState: {
    //   pageSize: 30,
    // },
    manualPagination: true,
    data: original
      ? data?.originalSchedule?.periods
      : data?.repaymentSchedule?.periods,
    hideRowCounter: true,
  });

  return (
    <div className="pb-10">
      <Paper className="p-4">
        <div className="flex md:flex-row flex-col items-center justify-between gap-4 mb-4">
          <Typography variant="h6" className="font-bold">
            Repayment Schedule
          </Typography>
        </div>
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          pageSize={30}
          renderPagination={() => null}
          RowComponent={ButtonBase}
        />
      </Paper>
    </div>
  );
}

export default CRMClientLoanRepaymentSchedule;
