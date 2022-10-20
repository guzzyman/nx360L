import { RouteEnum, UIPermissionEnum } from "common/Constants";
import { useParams, useSearchParams } from "react-router-dom";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";
import ClientXLeadTabDetails from "client-x-lead/ClientXLeadTabDetails";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import CRMClientLoanRepaymentSchedule from "./CRMClientLoanRepaymentSchedule";
import CRMClientLoanTransactions from "./CRMClientLoanTransactions";
import CRMClientLoanCharges from "./CRMClientLoanCharges";
import CRMClientLoanNotes from "./CRMClientLoanNotes";
import CRMClientLoanDocuments from "./CRMClientLoanDocuments";
import CRMClientLoanOtherDocuments from "./CRMClientLoanOtherDocuments";
import CRMClientLoanLoanDecider from "./CRMClientLoanLoanDecider";
import ClientXLeadLoanStatusChip from "client-x-lead/ClientXLeadLoanStatusChip";
import { useEffect, useMemo, useState } from "react";
import CRMClientLoanWriteOffLoanAccountAdd from "crm-client/CRMClientLoanWriteOffLoanAccountAdd";
import CRMClientLoanCloseAdd from "crm-client/CRMClientLoanCloseAdd";
import CRMClientLoanAssignLoanOfficerAdd from "crm-client/CRMClientLoanAssignLoanOfficerAdd";
import CRMClientLoanRescheduleAdd from "crm-client/CRMClientLoanRescheduleAdd";
import CRMClientLoanWaiveInterestAdd from "crm-client/CRMClientLoanWaiveInterestAdd";
import CRMClientRejectLoanAction from "./CRMClientRejectLoanAction";
import CRMClientAcceptLoanAction from "./CRMClientAcceptLoanAction";
import CRMClientRewriteLoanAction from "./CRMClientRewriteLoanAction";
import CRMClientDisburseLoanToWalletAction from "./CRMClientDisburseLoanToWalletAction";
import { generatePath, useNavigate } from "react-router-dom";
import CRMClientRecoveryPaymentLoanAction from "./CRMClientRecoveryPaymentLoanAction";
import CRMClientLoanAccountDetails from "./CRMClientLoanAccountDetails";
import CRMClientDetailsLoanEDR from "./CRMClientDetailsLoanEDR";
import CRMClientLoanSendDraftLoanForApproval from "./CRMClientLoanSendDraftLoanForApproval";
import CRMClientLoanUndoSalesLoanApproval from "./CRMClientLoanUndoSalesLoanApproval";
import CRMClientDetailsProfile from "./CRMClientDetailsProfile";
import { Button, Icon, Typography } from "@mui/material";
import useToggle from "hooks/useToggle";
import useClipboard from "hooks/useClipboard";
import CRMClientDetailsLoanLinkGenerationModal from "./CRMClientDetailsLoanLinkGenerationModal";
import { format } from "date-fns/esm";
import CRMClientLoanFundTransfer from "./CRMClientLoanFundTransfer";
import CRMClientLoanDetailsLagacySystem from "./CRMClientLoanDetailsLagacySystem";

import DocumentPreviewerCard from "common/DocumentPreviewerCard";
import { DOCUMENT_TYPE } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import DocumentPreviewDrawer from "common/DocumentPreviewDrawer";
import CRMClientDetailsLoanSendForApprovalChecks from "./CRMClientDetailsLoanSendForApprovalChecks";
import useDocumentPreviewSideMenu from "hooks/useDocumentPreviewSideMenu";
import useSideMenuTemporary from "hooks/useSideMenuTemporary";
import { lastDayOfMonth } from "date-fns";
import CRMClientLoanReAssignLoanOfficerAdd from "./CRMClientLoanReAssignLoanOfficerAdd";

function CRMClientDetails(props) {
  const [searchParams] = useSearchParams();
  const { id, loanId } = useParams();
  const navigate = useNavigate();
  const clipboard = useClipboard();

  const [openWaiveInterest, setOpenWaiveInterest] = useState(false);
  const [openWriteOffLoanAccount, setOpenWriteOffLoanAccount] = useState(false);
  const [openLoanClose, setOpenLoanClose] = useState(false);
  const [openAssignLoanOfficer, setOpenAssignLoanOfficer] = useState(false);
  const [openReAssignLoanOfficer, setOpenReAssignLoanOfficer] = useState(false);
  const [openLoanReschedule, setOpenLoanReschedule] = useState(false);
  const [transferFunds, setTransferFunds] = useState(false);

  const [acceptLoan, setAcceptLoan] = useState(false);
  const [rejectLoan, setRejectLoan] = useState(false);
  const [rewrite, setRewrite] = useState(false);
  const [disburseToWallet, setDisburseToWallet] = useState(false);
  const [isDisburseToBank, toggleDisburseToBank] = useToggle();
  const [recoveryPayment, setRecoveryPayment] = useState(false);
  const [loanForApproval, setLoanForApproval] = useState(false);
  const [undoSalesLoan, setUndoSalesLoan] = useState(false);
  const [isGenerateLinkModal, toggleGenerateLinkModal] = useToggle();
  const [openLagacySystem, setOpenLagacySystem] = useState(false);

  const { isDocumentPreviewSideMenu, toggleDocumentPreviewSideMenu } =
    useDocumentPreviewSideMenu();

  const { data, isLoading, isError, refetch } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanDocumentsQuery(loanId);

  const clientLoanQueryResult =
    nimbleX360CRMClientApi.useGetClientLoadDetailsQuery({
      loanId,
      associations: "all",
      exclude: "guarantors,futureSchedule",
    });
  const clientQueryResult = nimbleX360CRMClientApi.useGetCRMCDLClientQuery(id);

  const clientCreditReport =
    nimbleX360CRMClientApi.useGetCRMClientCreditReportQuery(loanId);

  const clientLoanAnalysis =
    nimbleX360CRMClientApi.useGetCRMClientLoanAnalysisQuery(loanId);

  const isLafSigned = clientLoanQueryResult.data?.isLafSigned;
  const isDocumentComplete = clientLoanQueryResult.data?.isDocumentComplete;
  const isPaymentMethod = clientLoanQueryResult.data?.paymentMethod?.id;
  const isExternalService = clientLoanQueryResult.data?.isExternalService;

  const loanActions = useMemo(
    () =>
      [
        {
          name: "Waive Interest",
          action: () => setOpenWaiveInterest(true),
          permissions: [
            UIPermissionEnum.WAIVEINTERESTPORTION_LOAN,
            UIPermissionEnum.ACTIVE_DROPDOWN,
          ],
        },
        {
          name: "Reschedule",
          action: () => setOpenLoanReschedule(true),
          permissions: [
            UIPermissionEnum.CREATE_RESCHEDULELOAN,
            UIPermissionEnum.ACTIVE_DROPDOWN,
          ],
        },
        {
          name: "Write Off",
          action: () => setOpenWriteOffLoanAccount(true),
          permissions: [
            UIPermissionEnum.WRITEOFF_LOAN,
            UIPermissionEnum.ACTIVE_DROPDOWN,
          ],
        },
        {
          name: "Close",
          action: () => setOpenLoanClose(true),
          permissions: [
            UIPermissionEnum.CLOSE_LOAN,
            UIPermissionEnum.ACTIVE_DROPDOWN,
          ],
        },
        {
          name: "Assign Loan Officer",
          action: () => setOpenAssignLoanOfficer(true),
          permissions: [
            UIPermissionEnum.UPDATELOANOFFICER_LOAN,
            UIPermissionEnum.ACTIVE_DROPDOWN,
          ],
        },

        {
          name: "L1 Approve Loan",
          action: () => setAcceptLoan(true),
          status: [
            "loanStatusType.submitted.and.pending.approval",
            "loanStatusType.submitted.and.pending.approval",
          ],
          permissions: [
            UIPermissionEnum.SUBMITTED_AND_PENDING_APPROVAL_DROPDOWN,
          ],
        },
        {
          name: "Sales Lead Approve Loan",
          action: () => setAcceptLoan(true),
          status: ["loanStatusType.sales.submitted.and.pending.approval"],
          permissions: [
            UIPermissionEnum.SALES_SUBMITTED_AND_PENDING_APPROVAL_DROPDOWN,
          ],
        },
        {
          name: "Rework Loan",
          action: () => setRewrite(true),
          status: ["loanStatusType.submitted.and.pending.approval"],
          permissions: [
            UIPermissionEnum.SUBMITTED_AND_PENDING_APPROVAL_DROPDOWN,
          ],
        },
        {
          name: "Undo Loan Approval",
          action: () => setRewrite(true),
          status: ["loanStatusType.approved"],
          permissions: [
            UIPermissionEnum.SALES_APPROVALUNDO_LOAN,
            UIPermissionEnum.DISBURSETOSAVINGS_LOAN,
            UIPermissionEnum.APPROVED_DROPDOWN,
          ],
        },
        {
          name: "Reject Loan",
          action: () => setRejectLoan(true),
          status: [
            // "loanStatusType.sales.submitted.and.pending.approval",
            "loanStatusType.submitted.and.pending.approval",
          ],
          permissions: [
            UIPermissionEnum.SUBMITTED_AND_PENDING_APPROVAL_DROPDOWN,
          ],
        },
        {
          ...(!isExternalService
            ? {
                name: "Modify Loan",
                action: () =>
                  navigate(
                    generatePath(RouteEnum.CRM_CLIENTS_LOAN_EDIT, {
                      id,
                      loanId,
                    })
                  ),
                status: [
                  "loanStatusType.sales.submitted.and.pending.approval",
                  "loanStatusType.submitted.and.pending.approval",
                  "loanStatusType.draft",
                ],
                permissions: [
                  UIPermissionEnum.ADJUST_LOAN,
                  UIPermissionEnum.SUBMITTED_AND_PENDING_APPROVAL_DROPDOWN,
                  UIPermissionEnum.SALES_SUBMITTED_AND_PENDING_APPROVAL_DROPDOWN,
                ],
              }
            : {}),
        },
        {
          name: "Disburse to Wallet",
          action: () => setDisburseToWallet(true),
          status: ["loanStatusType.approved"],
          permissions: [UIPermissionEnum.APPROVED_DROPDOWN],
        },
        {
          name: "Disburse to Bank",
          action: toggleDisburseToBank,
          status: ["loanStatusType.approved"],
          permissions: [UIPermissionEnum.APPROVED_DROPDOWN],
          // disabled: true,
        },
        {
          name: "Recovery Payment",
          action: () => setRecoveryPayment(true),
          status: ["loanStatusType.closed.written.off"],
        },
        {
          name: "Send Loan For Approval",
          action: () => setLoanForApproval(true),
          status: ["loanStatusType.draft"],
          permissions: [UIPermissionEnum.DRAFT_DROPDOWN],
        },
        {
          name: "Undo Sales Approval",
          action: () => setUndoSalesLoan(true),
          status: ["loanStatusType.sales.submitted.and.pending.approval"],
          permissions: [
            UIPermissionEnum.SALES_SUBMITTED_AND_PENDING_APPROVAL_DROPDOWN,
          ],
        },
        {
          name: "Transfer Funds",
          action: () => setTransferFunds(true),
          status: ["loanStatusType.overpaid"],
        },
        {
          name: `Reassign ${
            clientLoanQueryResult.data?.status?.id === 100 ? "L1" : ""
          } ${
            clientLoanQueryResult.data?.status?.id === 200 ? "L2" : ""
          } Officer`,
          status: [
            "loanStatusType.submitted.and.pending.approval",
            "loanStatusType.approved",
          ],
          action: () => setOpenReAssignLoanOfficer(true),
        },
        {
          name: "Loan Agreement Form",
          action: () =>
            window
              .open(
                generatePath(RouteEnum.CRM_CLIENTS_LOAN_AGREEMENT_FORM, {
                  id,
                  loanId,
                }),
                "_blank"
              )
              ?.focus(),
          status: [
            "loanStatusType.sales.submitted.and.pending.approval",
            "loanStatusType.submitted.and.pending.approval",
            "loanStatusType.approved",
            "loanStatusType.active",
            "loanStatusType.transfer.in.progress",
            "loanStatusType.transfer.on.hold",
            "loanStatusType.withdrawn.by.client",
            "loanStatusType.rejected",
            "loanStatusType.closed.obligations.met",
            "loanStatusType.closed.written.off",
            "loanStatusType.closed.reschedule.outstanding.amount",
            "loanStatusType.overpaid",
            "loanStatusType.draft",
          ],
          permissions: [UIPermissionEnum.DRAFT_LOAN],
        },
      ].filter((value) => Object.keys(value).length !== 0),
    // eslint-disable-next-line
    [id, loanId, clientLoanQueryResult.data]
  );

  const lagacySystem = !!clientLoanQueryResult?.data?.sourceId;

  const { data: settlementBalanceDailyData } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanTransactionTemplateQuery(
      {
        loanId,
        command: "foreclosure",
        dateFormat: "dd MMMM yyyy",
        locale: "en",
        transactionDate: format(new Date(), "dd MMMM yyyy"),
      },
      { skip: clientLoanQueryResult?.data?.status?.id !== 300 }
    );

  const { data: settlementBalanceWeeklyData } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanTransactionTemplateQuery(
      {
        loanId,
        command: "foreclosure",
        dateFormat: "dd MMMM yyyy",
        locale: "en",
        transactionDate: format(lastDayOfMonth(new Date()), "dd MMMM yyyy"),
      },
      { skip: clientLoanQueryResult?.data?.status?.id !== 300 }
    );

  const client = clientQueryResult?.data;

  const { toggleSideMenuTemporary } = useSideMenuTemporary();

  useEffect(() => {
    if (isDocumentPreviewSideMenu) {
      toggleSideMenuTemporary(true);
    } else {
      toggleSideMenuTemporary(false);
    }
    // eslint-disable-next-line
  }, [isDocumentPreviewSideMenu]);

  useEffect(() => {
    return () => {
      toggleDocumentPreviewSideMenu(false);
      toggleSideMenuTemporary(false);
    };
  }, []);

  console.log(
    "settlementBalanceWeeklyData?.amount",
    settlementBalanceWeeklyData?.amount
  );

  return (
    <>
      <ClientXLeadTabDetails
        id={id}
        breadcrumbName="loan"
        breadcrumbTo={RouteEnum.CRM_CLIENTS}
        detailsQueryResult={clientLoanQueryResult}
        clientQueryResult={clientQueryResult}
        detailsRoute={RouteEnum.CRM_CLIENTS_LOAN_DETAILS}
        summaryHeader={(data) => (
          <>
            {data?.accountNo} ({data?.loanProductName})
            {data?.inArrears ? (
              <ClientXLeadLoanStatusChip
                variant="outlined-opaque"
                color={"error"}
                label={data?.status?.value}
              />
            ) : (
              <ClientXLeadLoanStatusChip status={data?.status} />
            )}
          </>
        )}
        contentAfterSummary={(data) => (
          <>
            <div className="flex items-center justify-end flex-wrap gap-4 border-t-2 pt-4 border-gray-100 my-4">
              <Button
                endIcon={<Icon>visibility</Icon>}
                variant="outlined"
                onClick={() => toggleDocumentPreviewSideMenu(true)}
              >
                Preview All Documents
              </Button>
              {lagacySystem && (
                <Button
                  variant="outlined"
                  endIcon={<Icon>add</Icon>}
                  onClick={() => setOpenLagacySystem()}
                >
                  Lagacy System
                </Button>
              )}
              {data?.payRef ? (
                <Button
                  variant="outlined"
                  endIcon={<Icon>content_copy</Icon>}
                  onClick={() =>
                    clipboard.writeText(
                      `${window.location.origin}${generatePath(
                        RouteEnum.CREDIT_DIRECT_PAY,
                        {
                          payRef: data?.payRef,
                        }
                      )}`
                    )
                  }
                >
                  Copy Payment Link
                </Button>
              ) : null}
              <Button
                endIcon={<Icon>navigate_next</Icon>}
                variant="outlined"
                onClick={toggleGenerateLinkModal}
              >
                Generate Payment Link
              </Button>
            </div>
            {isGenerateLinkModal && (
              <CRMClientDetailsLoanLinkGenerationModal
                open={isGenerateLinkModal}
                onClose={toggleGenerateLinkModal}
                data={data}
                client={client}
              />
            )}
          </>
        )}
        summaryAside={(data) => [
          {
            label: "Loan Balance",
            value: (
              <>
                {data?.currency?.displaySymbol}
                {formatNumberToCurrency(data?.summary?.totalOutstanding || 0)}
              </>
            ),
          },
          {
            label: "Settlement Balance (Daily):",
            value: (
              <>
                {data?.currency?.displaySymbol}
                {data?.status?.id === 300
                  ? formatNumberToCurrency(settlementBalanceDailyData?.amount)
                  : 0}
              </>
            ),
          },
          {
            label: "Settlement Balance (Monthly):",
            value: (
              <>
                {data?.currency?.displaySymbol}
                {data?.status?.id === 300
                  ? formatNumberToCurrency(settlementBalanceWeeklyData?.amount)
                  : 0}
              </>
            ),
          },

          {
            label: "Arrears:",
            value: (
              <>
                {data?.currency?.displaySymbol}
                {formatNumberToCurrency(data?.summary?.totalOverdue)}
              </>
            ),
          },
        ]}
        summary={(data) => [
          {
            label: "Loan Type:",
            value: data?.isTopup ? "Topup" : "New Loan",
          },

          {
            label: "Net Pay:",
            value: `${
              data?.currency?.displaySymbol || ""
            }${formatNumberToCurrency(data?.netPay)}`,
          },
          {
            label: "Payment Method:",
            value: data?.paymentMethod?.valueRef
              ? data?.paymentMethod?.valueRef
              : "Not Available",
          },
          {
            label: "Channel:",
            value: data?.activationChannel?.name,
          },
          {
            label: "Disbursement Date:",
            value: parseDateToString(data?.timeline?.expectedDisbursementDate),
          },
          {
            label: "Maturity Date:",
            value: parseDateToString(data?.timeline?.expectedMaturityDate),
          },
          {
            label: "Loan Tenure:",
            value: data?.numberOfRepayments,
          },
          {
            label: "Loan Purpose:",
            value: data?.loanPurposeName,
          },
          {
            label: "Proposed Amount:",
            value: `${
              data?.currency?.displaySymbol || ""
            }${formatNumberToCurrency(data?.proposedPrincipal)}`,
          },

          {
            label: "Approved Amount:",
            value: `${data?.currency?.displaySymbol || ""}${
              data?.status?.id === 10
                ? 0
                : formatNumberToCurrency(data?.approvedPrincipal)
            }`,
          },
          {
            label:
              data?.status?.id < 300
                ? "Expected Disbursed Amount:"
                : "Disbursed Amount:",
            value: `${
              data?.currency?.displaySymbol || ""
            }${formatNumberToCurrency(
              data?.summary?.cdlPrincipalDisbursed
              // (data?.summary?.principalDisbursed ||
              //   data?.approvedPrincipal ||
              //   0) - (data?.feeChargesAtDisbursementCharged || 0)
            )}`,
          },
          data?.loanOfficerName && {
            label: "Sales Officer:",
            value: data?.loanOfficerName,
          },
          // {
          //   label: "Settlement Balance (Monthly):",
          //   value: `${data?.currency?.displaySymbol || ""}${
          //     data?.status?.id === 300
          //       ? formatNumberToCurrency(settlementBalanceWeeklyData?.amount)
          //       : 0
          //   }`,
          // },
        ]}
        summaryActions={loanActions}
        info={(data) => [
          {
            label: "Customer Type",
            value: data?.clients?.employmentSector?.name,
          },
          {
            label: "Customer ID",
            value: data?.clients?.id,
          },
          {
            label: "External ID",
            value: data?.clients?.accountNo,
          },
          {
            label: "Activation Date",
            value:
              parseDateToString(data?.clients?.activationDate) ||
              "Not Activated",
          },
          {
            label: "Client Status",
            value: <ClientXLeadStatusChip status={data?.clients?.status} />,
          },
        ]}
        defaultTab={parseInt(searchParams.get("defaultTab"))}
        tabs={(data) => [
          {
            name: "PROFILE",
            content: (
              <CRMClientDetailsProfile
                noEdit
                client={clientQueryResult?.data}
              />
            ),
            permissions: [UIPermissionEnum.READ_LOAN],
          },
          {
            name: "DOCUMENTS",
            content: (
              <CRMClientLoanDocuments
                clientLoanQueryResult={clientLoanQueryResult}
              />
            ),
            permissions: [UIPermissionEnum.READ_LOAN],
          },
          {
            name: "OTHER DOCUMENTS",
            content: <CRMClientLoanOtherDocuments />,
            permissions: [UIPermissionEnum.READ_LOAN],
          },
          {
            name: "LOAN DETAILS",
            content: (
              <CRMClientLoanAccountDetails
                queryResult={clientLoanQueryResult}
              />
            ),
            permissions: [UIPermissionEnum.READ_LOAN],
          },

          {
            name: "INFLOW",
            content: (
              <CRMClientDetailsLoanEDR queryResult={clientLoanQueryResult} />
            ),
            permissions: [UIPermissionEnum.READ_LOAN],
          },
          {
            name: "REPAYMENT SCHEDULE",
            content: (
              <CRMClientLoanRepaymentSchedule
                queryResult={clientLoanQueryResult}
              />
            ),
            permissions: [UIPermissionEnum.READ_LOAN],
          },
          clientLoanQueryResult?.data?.originalSchedule
            ? {
                name: "ORIGINAL REPAYMENT SCHEDULE",
                content: (
                  <CRMClientLoanRepaymentSchedule
                    original
                    queryResult={clientLoanQueryResult}
                  />
                ),
                permissions: [UIPermissionEnum.READ_LOAN],
              }
            : null,
          {
            name: "TRANSACTIONS",
            content: (
              <CRMClientLoanTransactions queryResult={clientLoanQueryResult} />
            ),
            permissions: [UIPermissionEnum.READ_LOAN],
          },
          {
            name: "CHARGES",
            content: (
              <CRMClientLoanCharges queryResult={clientLoanQueryResult} />
            ),
            permissions: [UIPermissionEnum.READ_LOAN],
          },
          // {
          //   name: "COLLATERAL",
          //   content: (
          //     <CRMClientLoanCollateral queryResult={clientLoanQueryResult} />
          //   ),
          // },
          {
            name: "NOTES",
            content: <CRMClientLoanNotes />,
            permissions: [UIPermissionEnum.READ_LOAN],
          },

          {
            name: "LOAN DECIDER",
            content: (
              <CRMClientLoanLoanDecider
                queryResult={clientCreditReport}
                clientLoanAnalysis={clientLoanAnalysis}
              />
            ),
            permissions: [UIPermissionEnum.READ_LOAN],
          },
        ]}
      />

      {isDocumentPreviewSideMenu && (
        <DocumentPreviewDrawer
          anchor="right"
          title="Loan Document Preview"
          open={isDocumentPreviewSideMenu}
          onClose={() => toggleDocumentPreviewSideMenu()}
        >
          <LoadingContent
            loading={isLoading}
            error={isError}
            onReload={refetch}
          >
            {data?.length >= 1 ? (
              data?.map((e, i) => (
                <DocumentPreviewerCard
                  title={e.name}
                  key={i}
                  url={e.location}
                  type={`${
                    e.type.includes(DOCUMENT_TYPE.IMAGE)
                      ? DOCUMENT_TYPE.IMAGE
                      : ""
                  }${
                    e.type.includes(DOCUMENT_TYPE.PDF) ? DOCUMENT_TYPE.PDF : ""
                  }`}
                />
              ))
            ) : (
              <Typography variant="h5" className="text-center text-red-300">
                Document is Empty
              </Typography>
            )}
          </LoadingContent>
        </DocumentPreviewDrawer>
      )}

      {openWaiveInterest && (
        <CRMClientLoanWaiveInterestAdd
          open={openWaiveInterest}
          onClose={() => setOpenWaiveInterest(false)}
        />
      )}
      {openWriteOffLoanAccount && (
        <CRMClientLoanWriteOffLoanAccountAdd
          open={openWriteOffLoanAccount}
          onClose={() => setOpenWriteOffLoanAccount(false)}
        />
      )}
      {openLoanClose && (
        <CRMClientLoanCloseAdd
          open={openLoanClose}
          onClose={() => setOpenLoanClose(false)}
        />
      )}
      {openAssignLoanOfficer && (
        <CRMClientLoanAssignLoanOfficerAdd
          clientLoanQueryResult={clientLoanQueryResult}
          open={openAssignLoanOfficer}
          onClose={() => setOpenAssignLoanOfficer(false)}
        />
      )}
      {openReAssignLoanOfficer && (
        <CRMClientLoanReAssignLoanOfficerAdd
          clientLoanQueryResult={clientLoanQueryResult}
          open={openReAssignLoanOfficer}
          onClose={() => setOpenReAssignLoanOfficer(false)}
        />
      )}
      {openLoanReschedule && (
        <CRMClientLoanRescheduleAdd
          open={openLoanReschedule}
          onClose={() => setOpenLoanReschedule(false)}
        />
      )}
      {acceptLoan && (
        <CRMClientAcceptLoanAction
          salesApproval={
            clientLoanQueryResult?.data?.status?.code ===
            "loanStatusType.sales.submitted.and.pending.approval"
              ? true
              : false
          }
          open={acceptLoan}
          onClose={() => setAcceptLoan(false)}
        />
      )}
      {rejectLoan && (
        <CRMClientRejectLoanAction
          open={rejectLoan}
          onClose={() => setRejectLoan(false)}
        />
      )}
      {rewrite && (
        <CRMClientRewriteLoanAction
          open={rewrite}
          loanApproval={
            clientLoanQueryResult?.data?.status?.code ===
            "loanStatusType.approved"
              ? true
              : false
          }
          onClose={() => setRewrite(false)}
        />
      )}
      {disburseToWallet && (
        <CRMClientDisburseLoanToWalletAction
          open={disburseToWallet}
          onClose={() => setDisburseToWallet(false)}
          submitCommand="disburseToSavings"
          title="Disburse to Wallet"
        />
      )}
      {isDisburseToBank && (
        <CRMClientDisburseLoanToWalletAction
          open={isDisburseToBank}
          onClose={toggleDisburseToBank}
          submitCommand="disburseToSavingsToBank"
          title="Disburse to Bank"
        />
      )}
      {recoveryPayment && (
        <CRMClientRecoveryPaymentLoanAction
          open={recoveryPayment}
          onClose={() => setRecoveryPayment(false)}
        />
      )}

      {loanForApproval &&
        (isLafSigned && isDocumentComplete && isPaymentMethod ? (
          <CRMClientLoanSendDraftLoanForApproval
            open={loanForApproval}
            onClose={() => setLoanForApproval(false)}
          />
        ) : (
          <CRMClientDetailsLoanSendForApprovalChecks
            open={loanForApproval}
            clientLoanQueryResult={clientLoanQueryResult}
            onClose={() => setLoanForApproval(false)}
          />
        ))}

      {undoSalesLoan && (
        <CRMClientLoanUndoSalesLoanApproval
          open={undoSalesLoan}
          onClose={() => setUndoSalesLoan(false)}
        />
      )}
      {transferFunds && (
        <CRMClientLoanFundTransfer
          open={transferFunds}
          onClose={() => setTransferFunds(false)}
        />
      )}
      {openLagacySystem && (
        <CRMClientLoanDetailsLagacySystem
          clientQueryResult={clientQueryResult}
          clientLoanQueryResult={clientLoanQueryResult}
          open={openLagacySystem}
          onClose={() => setOpenLagacySystem(false)}
        />
      )}
    </>
  );
}

export default CRMClientDetails;
