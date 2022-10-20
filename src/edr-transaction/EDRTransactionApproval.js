import CurrencyTypography from "common/CurrencyTypography";
import EDRTransactionScaffold from "./EDRTransactionScaffold";
import EDRTransactionStatusChip from "./EDRTransactionStatusChip";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import { renderRow } from "common/StandardTable";
import useToggle from "hooks/useToggle";
import ClientXLeadXEDRLoanMakeRepayment from "client-x-lead-x-edr/ClientXLeadXEDRLoanMakeRepayment";

function EDRTransactionApproval(props) {
  return (
    <>
      <EDRTransactionScaffold
        title="EDR Transactions Approval"
        breadcrumbs={[{ name: "EDR Transactions Approval" }]}
        queryArgs={queryArgs}
        useGetEDRTransactionJournalEntriesQuery={
          nxEDRTransactionApi.useGetEDRTransactionsQuery
        }
        columns={columns}
        TableProps={{
          renderRow: function (row, instance, props) {
            return <RowContainer {...{ row, instance, props }} />;
          },
        }}
      />
    </>
  );
}

export default EDRTransactionApproval;

function RowContainer({ row, instance, props }) {
  const [isMakeRepaymentDialog, toggleMakeRepayementDialog] = useToggle();
  const [isPrepayLoanDialog, togglePrepayLoanDialog] = useToggle();
  const [isLoanForeclosureDialog, toggleLoanForeclosureDialog] = useToggle();

  return (
    <>
      {isMakeRepaymentDialog && (
        <ClientXLeadXEDRLoanMakeRepayment
          data={row?.original}
          onClose={toggleMakeRepayementDialog}
        />
      )}
      {renderRow(row, instance, {
        ...props,
        rowProps: { ...props.rowProps, onClick: toggleMakeRepayementDialog },
      })}
    </>
  );
}

const queryArgs = { status: "PROCCESSING", creditDirectPayEnum: 2 };

const columns = [
  // { Header: "Employer", accessor: "employerName" },
  // { Header: "Employee Name", accessor: "employeeName" },
  { Header: "Loan Type", accessor: "elementName" },
  // { Header: "Staff ID", accessor: "employeeNumber" },
  // { Header: "Ref ID", accessor: "refId" },
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
];
