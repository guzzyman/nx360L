import { useMemo, useState } from "react";
import { Paper, Tabs, Tab } from "@mui/material";
import PageHeader from "common/PageHeader";
import { UIPermissionEnum } from "common/Constants";
import LoanUnderwritingPendingListScaffold from "./LoanUnderwritingPendingListScaffold";
import useAuthUser from "hooks/useAuthUser";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";
import { formatTableDate, formatNumberToCurrency } from "common/Utils";
import { nxUnderwritingApi } from "./LoanUnderwritingStoreQuerySlice";
import LoanUnderwritingStatusChip from "./LoanUnderwritingStatusChip";

function LoanUnderwritingPending(props) {
  const authUser = useAuthUser();
  const authUserUIPermissionRestrictor = useAuthUserUIPermissionRestrictor();

  const [activeTab, setActiveTab] = useState(0);

  const tabs = useMemo(
    () =>
      [
        {
          label: "My Sales Loan",
          content: (
            <LoanUnderwritingPendingListScaffold
              useQuery={nxUnderwritingApi.useGetUnderwritingMySalesLoansQuery}
              queryParams={{
                userId: authUser?.id,
              }}
              columns={underwringSalesLoansColumns}
              getClientIdXLoanId={getUnderwringSalesLoansClientIdXLoanId}
            />
          ),
          permissions: [UIPermissionEnum.SALES_APPROVE_LOAN_CHECKER],
        },

        {
          label: "All My Sales Loan",
          content: (
            <LoanUnderwritingPendingListScaffold
              useQuery={nxUnderwritingApi.useGetUnderwritingMySalesLoansQuery}
              queryParams={{}}
              columns={underwringSalesLoansColumns}
              getClientIdXLoanId={getUnderwringSalesLoansClientIdXLoanId}
            />
          ),
          permissions: [UIPermissionEnum.READ_LOANS_PENDING_APPROVAL],
        },
        {
          label: "My Team Loan",
          content: (
            <LoanUnderwritingPendingListScaffold
              useQuery={nxUnderwritingApi.useGetUnderwritingSalesLoansQuery}
              queryParams={{
                userId: authUser?.id,
              }}
              columns={underwringSalesLoansColumns}
              getClientIdXLoanId={getUnderwringSalesLoansClientIdXLoanId}
            />
          ),
          permissions: [UIPermissionEnum.SALES_APPROVE_LOAN],
        },

        {
          label: "All My Team Loan",
          content: (
            <LoanUnderwritingPendingListScaffold
              useQuery={nxUnderwritingApi.useGetUnderwritingSalesLoansQuery}
              columns={underwringSalesLoansColumns}
              getClientIdXLoanId={getUnderwringSalesLoansClientIdXLoanId}
            />
          ),
          permissions: [UIPermissionEnum.READ_LOANS_PENDING_APPROVAL],
        },
        // {
        //   label: "All Pending Sales Loan",
        //   content: (
        //     <LoanUnderwritingPendingListScaffold
        //       // useQuery={nxUnderwritingApi.useGetUnderwritingLoansQuery}
        //       useQuery={nxUnderwritingApi.useGetUnderwritingSalesLoansQuery}
        //       queryParams={
        //         {
        //           // sqlSearch: `l.loan_status_id in (10,50)`,
        //         }
        //       }
        //       columns={underwringSalesLoansColumns}
        //       getClientIdXLoanId={getUnderwringSalesLoansClientIdXLoanId}
        //     />
        //   ),
        //   permissions: [UIPermissionEnum.READ_LOANS_PENDING_APPROVAL],
        // },
        // {
        //   label: "L1 Loan Approval",
        //   content: (
        //     <LoanUnderwritingPendingListScaffold
        //       useQuery={
        //         nxUnderwritingApi.useGetUnderwritingLoanUnderWriterQuery
        //       }
        //       queryParams={{
        //         sqlSearch: `l.loan_status_id in (100)`,
        //       }}
        //      columns={underwringLoansColumns}
        //     />
        //   ),
        //   permissions: [UIPermissionEnum.DISBURSE_LOAN_CHECKER],
        // },
        // {
        //   label: "L2 Loan Disbursal",
        //   content: (
        //     <LoanUnderwritingPendingListScaffold
        //       useQuery={
        //         nxUnderwritingApi.useGetUnderwritingLoanUnderWriterQuery
        //       }
        //       queryParams={{
        //         sqlSearch: `l.loan_status_id in (200)`,
        //       }}
        //      columns={underwringLoansColumns}
        //     />
        //   ),
        //   permissions: [UIPermissionEnum.DISBURSE_LOAN],
        // },
        {
          label: "My L1 Underwriter",
          content: (
            <LoanUnderwritingPendingListScaffold
              useQuery={nxUnderwritingApi.useGetUnderwritingL1LoansQuery}
              queryParams={{
                userId: authUser?.id,
                // statusId: 100,
              }}
              columns={underwringSalesLoansColumns}
              getClientIdXLoanId={getUnderwringSalesLoansClientIdXLoanId}
            />
          ),
          permissions: [UIPermissionEnum.DISBURSE_LOAN_CHECKER],
        },
        {
          label: "All L1 Underwriter",
          content: (
            <LoanUnderwritingPendingListScaffold
              // useQuery={nxUnderwritingApi.useGetUnderwritingLoansQuery}
              useQuery={nxUnderwritingApi.useGetUnderwritingL1LoansQuery}
              // queryParams={{
              //   sqlSearch: `l.loan_status_id in (100)`,
              // }}
              columns={underwringSalesLoansColumns}
              getClientIdXLoanId={getUnderwringSalesLoansClientIdXLoanId}
            />
          ),
          permissions: [UIPermissionEnum.APPROVE_DIVIDEND_SHAREPRODUCT],
        },
        {
          label: "My L2 Underwriter",
          content: (
            <LoanUnderwritingPendingListScaffold
              useQuery={nxUnderwritingApi.useGetUnderwritingL2LoansQuery}
              queryParams={{
                userId: authUser?.id,
                // statusId: 200,
              }}
              columns={underwringSalesLoansColumns}
              getClientIdXLoanId={getUnderwringSalesLoansClientIdXLoanId}
            />
          ),
          permissions: [UIPermissionEnum.DISBURSE_LOAN],
        },
        {
          label: "All L2 Underwriter",
          content: (
            <LoanUnderwritingPendingListScaffold
              useQuery={nxUnderwritingApi.useGetUnderwritingL2LoansQuery}
              columns={underwringSalesLoansColumns}
              getClientIdXLoanId={getUnderwringSalesLoansClientIdXLoanId}
            />
          ),
          permissions: [UIPermissionEnum.APPROVE_DIVIDEND_SHAREPRODUCT_CHECKER],
        },
        // {
        //   label: "All Pending Underwriter Loans",
        //   content: (
        //     <LoanUnderwritingPendingListScaffold
        //       useQuery={nxUnderwritingApi.useGetUnderwritingLoansQuery}
        //       queryParams={{
        //         sqlSearch: `l.loan_status_id in (100,200)`,
        //       }}
        //       columns={underwringLoansColumns}
        //     />
        //   ),
        //   permissions: [UIPermissionEnum.APPROVEADDITIONALSHARES_SHAREACCOUNT],
        // },
      ].filter((tab) => {
        const permissions = Object.assign([], tab?.permissions);
        return tab?.validateAllPermissions
          ? tab?.negatePermissionsValidation
            ? !authUserUIPermissionRestrictor.hasPermissions(...permissions)
            : authUserUIPermissionRestrictor.hasPermissions(...permissions)
          : tab?.negatePermissionsValidation
          ? !authUserUIPermissionRestrictor.hasPermission(...permissions)
          : authUserUIPermissionRestrictor.hasPermission(...permissions);
      }),
    [authUser?.id, authUser?.staffId, authUserUIPermissionRestrictor]
  );

  console.log("tabs", tabs);

  return (
    <>
      <PageHeader
        title="Pending Loans"
        breadcrumbs={
          [
            //   { name: "CRM", to: RouteEnum.CRM_CLIENTS },
            //   { name: "Clients" },
          ]
        }
      />
      <Paper className="p-4">
        <div className="mb-4">
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => {
              setActiveTab(newValue);
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} value={index} label={tab?.label} />
            ))}
          </Tabs>
        </div>

        {tabs?.[activeTab]?.content}
      </Paper>
    </>
  );
}

export default LoanUnderwritingPending;

const startPeriod = new Date(2022, 4, 4);

function getUnderwringSalesLoansClientIdXLoanId(data) {
  return {
    id: data.clientId,
    loanId: data.loanId,
  };
}

const underwringSalesLoansColumns = [
  // { Header: "Client ID", accessor: "clientId" },
  { Header: "Client Name", accessor: "clientDisplayName" },
  { Header: "Account Number", accessor: "loanAccountNo" },
  { Header: "Loan Type", accessor: "loanType" },
  {
    Header: "Product",
    accessor: "productName",
  },
  {
    Header: "Amount",
    accessor: (row) =>
      row?.principalAmount
        ? `₦${formatNumberToCurrency(row?.principalAmount)}`
        : "-----",
  },
  // {
  //   Header: "Channel",
  //   accessor: (row) => row?.loan?.activationChannel?.name,
  // },

  {
    Header: "Date",
    accessor: "approvedDate",
  },
  {
    Header: "Status",
    width: 200,
    accessor: (row) => (
      <LoanUnderwritingStatusChip status={{ value: row?.loanStatus }} />
    ),
  },
];

function getUnderwringLoansClientIdXLoanId(data) {
  return {
    id: data.clientId,
    loanId: data.id,
  };
}
const underwringLoansColumns = [
  // { Header: "Client ID", accessor: "clientId" },
  { Header: "Client Name", accessor: "clientName" },
  { Header: "Account Number", accessor: "accountNo" },
  { Header: "Loan Type", accessor: (row) => row?.loanType?.value },
  {
    Header: "Product",
    accessor: (row) => row?.loanProductName,
  },
  {
    Header: "Amount",
    accessor: (row) =>
      row?.principal ? `₦${formatNumberToCurrency(row?.principal)}` : "-----",
  },
  {
    Header: "Channel",
    accessor: (row) => row?.activationChannel?.name,
  },

  {
    Header: "Date",
    accessor: (row) =>
      row?.timeline?.submittedOnDate
        ? formatTableDate(new Date(...row?.timeline?.submittedOnDate))
        : null,
  },
  {
    Header: "Status",
    width: 200,
    accessor: (row) => <LoanUnderwritingStatusChip status={row?.status} />,
  },
];

function getUnderwringLoanApprovalsClientIdXLoanId(data) {
  return {
    id: data?.loan?.clientId,
    loanId: data?.loan?.id,
  };
}
const underwringLoanApprovalsColumns = [
  // { Header: "Client ID", accessor: "clientId" },
  { Header: "Client Name", accessor: (row) => row?.loan?.clientName },
  { Header: "Account Number", accessor: (row) => row?.loan?.accountNo },
  { Header: "Loan Type", accessor: (row) => row?.loan?.loanType?.value },
  {
    Header: "Product",
    accessor: (row) => row?.loan?.loanProductName,
  },
  {
    Header: "Amount",
    accessor: (row) =>
      row?.loan?.principal
        ? `₦${formatNumberToCurrency(row?.loan?.principal)}`
        : "-----",
  },
  {
    Header: "Channel",
    accessor: (row) => row?.loan?.activationChannel?.name,
  },

  {
    Header: "Date",
    accessor: (row) =>
      row?.loan?.timeline?.submittedOnDate?.length
        ? formatTableDate(
            new Date(
              row?.loan?.timeline?.submittedOnDate?.[0],
              row?.loan?.timeline?.submittedOnDate?.[1] - 1,
              row?.loan?.timeline?.submittedOnDate?.[2]
            )
          )
        : null,
  },
  {
    Header: "Status",
    width: 200,
    accessor: (row) => <LoanUnderwritingStatusChip status={row?.status} />,
  },
];
