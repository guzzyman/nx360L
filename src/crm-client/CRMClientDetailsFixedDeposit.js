import { RouteEnum, UIPermissionEnum } from "common/Constants";
import { useParams } from "react-router";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";
import ClientXLeadTabDetails from "client-x-lead/ClientXLeadTabDetails";
import {
  formatNumberToCurrency,
  getUserErrorMessage,
  parseDateToString,
} from "common/Utils";
import ClientXLeadLoanStatusChip from "client-x-lead/ClientXLeadLoanStatusChip";
import CRMClientFixedDepositTransactions from "./CRMClientFixedDepositTransactions";
import CRMClientFixedDepositStandingInstructions from "./CRMClientFixedDepositStandingInstructions";
import CRMClientFixedDepositInterestRateChart from "./CRMClientFixedDepositInterestRateChart";
import CRMClientFixedDepositCharges from "./CRMClientFixedDepositCharges";
import { useMemo, useState } from "react";
import CRMClientFixedDepositPrematureClosureAction from "./CRMClientFixedDepositPrematureClosureAction";
import { useConfirmDialog } from "react-mui-confirm";
import { useSnackbar } from "notistack";
import CRMClientFixedDepositChargesAction from "./CRMClientFixedDepositChargesAction";
import CRMClientFixedDepositPendingApprovalAction from "./CRMClientFixedDepositPendingApprovalAction";
import CRMClientFixedDepositPendingRejectAction from "./CRMClientFixedDepositPendingRejectAction";
import CRMClientFixedDepositPendingWithdrawnByClientAction from "./CRMClientFixedDepositPendingWithdrawnByClientAction";
import CRMClientFixedDepositUndoApprovalAction from "./CRMClientFixedDepositUndoApprovalAction";
import { format } from "date-fns/esm";
import { generatePath, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CRMClientFixedDepositWithdrawToSavingsAction from "./CRMClientFixedDepositWithdrawToSavingsAction";
import CRMClientFixedDepositDepositToReccurringAction from "./CRMClientFixedDepositDepositToReccurringAction";

function CRMClientDetailsFixedDeposit(props) {
  const { id, fixedDepositId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isReoccurringDeposit = location.pathname?.includes("reoccurring");

  const [prematureClose, setPrematureClose] = useState(false);
  const [approval, setApproval] = useState(false);
  const [reject, setReject] = useState(false);
  const [charges, setCharges] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [undoApproval, setUndoApproval] = useState(false);
  const [withdrawToSavings, setWithdrawToSavings] = useState(false);
  const [depositTosRecurring, setDepositTosRecurring] = useState(false);

  const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();

  const [calculateInterest] = isReoccurringDeposit
    ? nimbleX360CRMClientApi.useAddCRMClientReoccurringFixedDepositDetailsActionMutation()
    : nimbleX360CRMClientApi.useAddCRMClientFixedDepositDetailsActionMutation();

  const [updateWithholdTask] =
    nimbleX360CRMClientApi.usePutCRMClientSavingsAccountDetailsActionMutation();

  const clientFixedDepositQueryResult = isReoccurringDeposit
    ? nimbleX360CRMClientApi.useGetClientReoccurringFixedDepositAccountDetailsQuery(
        {
          fixedDepositId,
          associations: "all",
        },
        { skip: !isReoccurringDeposit }
      )
    : nimbleX360CRMClientApi.useGetClientFixedDepositAccountDetailsQuery(
        {
          fixedDepositId,
          associations: "all",
        },
        { skip: isReoccurringDeposit }
      );

  const clientQueryResult = nimbleX360CRMClientApi.useGetCRMClientQuery({ id });

  const handleCalculateInterestConfirm = (fixedDepositId) =>
    confirm({
      title: "Are you sure you want to Calculate Interest?",
      onConfirm: async () => {
        try {
          await calculateInterest({
            fixedDepositId,
            params: { command: "calculateInterest" },
          }).unwrap();
          enqueueSnackbar(`Interest Calculation Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Interest Calculation Failed`, { variant: "error" });
        }
      },
    });

  const handleWitholdTaskConfirm = (
    fixedDepositId,
    clientFixedDepositQueryResult
  ) =>
    confirm({
      title: `Are you sure you want to ${
        clientFixedDepositQueryResult?.data?.withHoldTax ? "Disable" : "Enable"
      }  Withhold Task?`,
      onConfirm: async () => {
        try {
          await updateWithholdTask({
            walletId: fixedDepositId,
            params: { command: "updateWithHoldTax" },
            withHoldTax: clientFixedDepositQueryResult?.data?.withHoldTax
              ? false
              : true,
          }).unwrap();
          enqueueSnackbar(
            ` ${
              clientFixedDepositQueryResult?.data?.withHoldTax
                ? "Disable"
                : "Enable"
            }  Withhold Task Successfully`,
            {
              variant: "success",
            }
          );
        } catch (error) {
          enqueueSnackbar(
            `${
              clientFixedDepositQueryResult?.data?.withHoldTax
                ? "Disable"
                : "Enable"
            }  Withhold Task Failed`,
            { variant: "error" }
          );
        }
      },
    });

  const handlePostInterestConfirm = (fixedDepositId) =>
    confirm({
      title: "Are you sure you want to Post Interest?",
      onConfirm: async () => {
        try {
          await calculateInterest({
            fixedDepositId,
            params: { command: "postInterest" },
          }).unwrap();
          enqueueSnackbar(`Interest Post Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Interest Post Failed`, { variant: "error" });
        }
      },
    });

  const handleActivateConfirm = (fixedDepositId) =>
    confirm({
      title: "Are you sure you want to Activate?",
      onConfirm: async () => {
        try {
          await calculateInterest({
            fixedDepositId,
            params: { command: "activate" },
            activatedOnDate: format(new Date(), "dd MMMM yyyy"),
            locale: "en",
            dateFormat: "dd MMMM yyyy",
          }).unwrap();
          enqueueSnackbar(`Activation Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Activation Failed`, { variant: "error" });
        }
      },
    });

  const [
    sendEmailCertificate,
    { data: certificateData, isSuccess, isError: certificateIsError, error },
  ] = nimbleX360CRMClientApi.useLazyGetCRMClientFixedDepositCertificateQuery();

  const sendCertificate = (id) =>
    confirm({
      title: "Are you sure you want to send Certificate?",
      onConfirm: () => {
        try {
          sendEmailCertificate(id);
        } catch (error) {
          enqueueSnackbar(
            getUserErrorMessage(error.data.errors) ||
              `Certificate Failed to send`,
            { variant: "error" }
          );
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(
        certificateData?.defaultUserMessage || `Certificate Successfully sent`,
        {
          variant: "success",
        }
      );
    }
    if (certificateIsError) {
      enqueueSnackbar(
        getUserErrorMessage(error.data.errors) || `Certificate Failed to send`,
        { variant: "error" }
      );
    }
    // eslint-disable-next-line
  }, [isSuccess, certificateIsError]);

  const fixedDepositActions = useMemo(
    () => [
      {
        name: "Premature Closure",
        action: () => setPrematureClose(true),
        permissions: [UIPermissionEnum.PREMATURECLOSE_RECURRINGDEPOSITACCOUNT],
      },
      {
        name: "Calculate Interest",
        action: () => handleCalculateInterestConfirm(fixedDepositId),
        permissions: [
          UIPermissionEnum.CALCULATEINTEREST_RECURRINGDEPOSITACCOUNT,
        ],
      },
      {
        name: "Add Charges",
        action: () => setCharges(true),
        status: ["Submitted and pending approval", "Active"],
        permissions: [
          UIPermissionEnum.UPDATE_LOANCHARGE,
          UIPermissionEnum.UPDATE_SAVINGSACCOUNTCHARGE,
        ],
      },
      {
        name: "Post Interest",
        action: () => handlePostInterestConfirm(fixedDepositId),
        permissions: [UIPermissionEnum.POSTINTEREST_RECURRINGDEPOSITACCOUNT],
      },
      {
        name: `${
          clientFixedDepositQueryResult?.data?.withHoldTax
            ? "Disable"
            : "Enable"
        } Withhold Tax`,
        action: () =>
          handleWitholdTaskConfirm(
            fixedDepositId,
            clientFixedDepositQueryResult
          ),
        permissions: [UIPermissionEnum.UPDATEWITHHOLDTAX_SAVINGSACCOUNT],
      },

      {
        name: "Approve",
        action: () => setApproval(true),
        status: ["Submitted and pending approval"],
        permissions: [UIPermissionEnum.APPROVE_LOAN],
      },
      {
        name: "Reject",
        action: () => setReject(true),
        status: ["Submitted and pending approval"],
        permissions: [UIPermissionEnum.REJECT_LOAN],
      },
      {
        name: "Withdrawn",
        action: () => setWithdrawn(true),
        status: ["Submitted and pending approval"],
        permissions: [UIPermissionEnum.WITHDRAW_LOAN],
      },
      {
        name: "Undo Approval",
        action: () => setUndoApproval(true),
        status: ["Approved"],
      },
      {
        name: "Activate",
        action: () => handleActivateConfirm(fixedDepositId),
        status: ["Approved"],
      },
      {
        name: "Modify Application",
        action: () =>
          navigate(
            generatePath(
              isReoccurringDeposit
                ? RouteEnum.CRM_CLIENT_REOCCURRING_FIXED_DEPOSIT_EDIT
                : RouteEnum.CRM_CLIENT_FIXED_DEPOSIT_EDIT,
              {
                id,
                depositId: fixedDepositId,
              }
            )
          ),
        status: ["Submitted and pending approval"],
        permissions: [UIPermissionEnum.ADJUST_LOAN],
      },
      {
        name: "Email Certificate",
        action: () => sendCertificate(fixedDepositId),
        status: ["Active", "savingsAccountStatusType.matured"],
        permissions: [UIPermissionEnum.CREATE_EMAIL_CHECKER],
      },
      isReoccurringDeposit && {
        name: "Withdraw",
        action: () => setWithdrawToSavings(true),
        status: ["Active"],
        permissions: [UIPermissionEnum.WITHDRAWAL_RECURRINGDEPOSITACCOUNT],
      },
      isReoccurringDeposit && {
        name: "Deposit",
        action: () => setDepositTosRecurring(true),
        status: ["Active"],
        permissions: [UIPermissionEnum.DEPOSIT_RECURRINGDEPOSITACCOUNT],
      },
    ],
    // eslint-disable-next-line
    [clientFixedDepositQueryResult?.data]
  );

  return (
    <>
      <ClientXLeadTabDetails
        id={id}
        breadcrumbName="Investment"
        breadcrumbTo={RouteEnum.CRM_CLIENTS}
        detailsQueryResult={clientFixedDepositQueryResult}
        clientQueryResult={clientQueryResult}
        detailsRoute={RouteEnum.CRM_CLIENTS_FIXED_DEPOSIT_DETAILS}
        summaryHeader={(data) => (
          <>
            {data?.accountNo}&nbsp;
            {data?.inArrears ? (
              <ClientXLeadLoanStatusChip
                variant="outlined-opaque"
                color={"error"}
                label={data?.status?.value}
              />
            ) : (
              <ClientXLeadStatusChip status={data?.status} />
            )}
          </>
        )}
        summaryAside={(data) => [
          {
            label: "Current Balance",
            value: (
              <>
                {data?.summary?.currency?.displaySymbol}
                {formatNumberToCurrency(data?.summary?.accountBalance)}
              </>
            ),
          },
          {
            label: "Deposit Amount:",
            value: (
              <>
                {data?.summary?.currency?.displaySymbol}
                {formatNumberToCurrency(data?.depositAmount)}
              </>
            ),
          },
        ]}
        summary={(data) => [
          {
            label: "Interest Rate:",
            value: data?.nominalAnnualInterestRate + "%",
          },
          {
            label: "Interest Compounding Period:",
            value: data?.interestCompoundingPeriodType?.value,
          },
          {
            label: "Interest Posting Period:",
            value: data?.interestPostingPeriodType?.value,
          },
          {
            label: "Period:",
            value: `${data?.depositPeriod} ${data?.depositPeriodFrequency?.value}`,
          },
          {
            label: "Interest Calculated Using:",
            value: data?.interestCalculationType?.value,
          },
          {
            label: "No of Days in Year:",
            value: data?.interestCalculationDaysInYearType?.value,
          },
          {
            ...(data?.preClosurePenalApplicable && {
              label: "preClosurePenal",
              value: `${data?.preClosurePenalInterest} % on ${data?.preClosurePenalInterestOnType?.value}`,
            }),
          },
          {
            label: "Principal Amount:",
            value: `${
              data?.currency?.displaySymbol || ""
            }${formatNumberToCurrency(data?.depositAmount)}`,
          },
          {
            label: "Maturity Amount:",
            value: `${
              data?.currency?.displaySymbol || ""
            }${formatNumberToCurrency(data?.maturityAmount)}`,
          },
          {
            ...(data?.summary?.totalDeposits && {
              label: "Total Deposits:",
              value: `${
                data?.currency?.displaySymbol || ""
              }${formatNumberToCurrency(data?.summary?.totalDeposits)}`,
            }),
          },
          {
            ...(data?.summary?.totalWithdrawals && {
              label: "Total Withdrawals:",
              value: `${
                data?.currency?.displaySymbol || ""
              }${formatNumberToCurrency(data?.summary?.totalWithdrawals)}`,
            }),
          },
          {
            ...(data?.summary?.totalInterestEarned >= 0 && {
              label: "Total Interest Earned:",
              value: `${
                data?.currency?.displaySymbol || ""
              }${formatNumberToCurrency(data?.summary?.totalInterestEarned)}`,
            }),
          },

          {
            label: "Activation On",
            value: data?.timeline.activatedOnDate
              ? parseDateToString(data?.timeline?.activatedOnDate)
              : "Not Activated",
          },
          {
            label: "Closed On",
            value: parseDateToString(data?.timeline?.closedOnDate),
          },
          {
            label: "Field Officer",
            value: data?.fieldOfficerName
              ? data?.fieldOfficerName
              : "Unassigned",
          },
        ]}
        summaryActions={fixedDepositActions}
        info={(data) => [
          {
            label: "Customer Type",
            value: data?.employmentSector?.name,
          },
          {
            label: "Customer ID",
            value: data?.accountNo,
          },
          {
            label: "Activation Date",
            value: parseDateToString(data?.activationOnDate),
          },
          {
            label: "Client Status",
            value: <ClientXLeadStatusChip status={data?.status} />,
          },
        ]}
        tabs={(data) => [
          {
            name: "INTEREST RATE CHART",
            content: (
              <CRMClientFixedDepositInterestRateChart
                queryResult={clientFixedDepositQueryResult}
              />
            ),
          },
          {
            name: "TRANSACTIONS",
            content: (
              <CRMClientFixedDepositTransactions
                queryResult={clientFixedDepositQueryResult}
              />
            ),
          },
          {
            name: "ALL STANDING INSTRUCTIONS",
            content: (
              <CRMClientFixedDepositStandingInstructions
                clientQueryResult={clientQueryResult}
              />
            ),
          },
          {
            name: "CHARGES",
            content: (
              <CRMClientFixedDepositCharges
                queryResult={clientFixedDepositQueryResult}
              />
            ),
          },
        ]}
      />

      {prematureClose && (
        <CRMClientFixedDepositPrematureClosureAction
          open={prematureClose}
          isReoccurringDeposit={isReoccurringDeposit}
          onClose={() => setPrematureClose(false)}
        />
      )}

      {charges && (
        <CRMClientFixedDepositChargesAction
          open={charges}
          isReoccurringDeposit={isReoccurringDeposit}
          onClose={() => setCharges(false)}
        />
      )}

      {approval && (
        <CRMClientFixedDepositPendingApprovalAction
          open={approval}
          isReoccurringDeposit={isReoccurringDeposit}
          onClose={() => setApproval(false)}
        />
      )}

      {reject && (
        <CRMClientFixedDepositPendingRejectAction
          open={reject}
          isReoccurringDeposit={isReoccurringDeposit}
          onClose={() => setReject(false)}
        />
      )}

      {withdrawn && (
        <CRMClientFixedDepositPendingWithdrawnByClientAction
          open={withdrawn}
          isReoccurringDeposit={isReoccurringDeposit}
          onClose={() => setWithdrawn(false)}
        />
      )}

      {undoApproval && (
        <CRMClientFixedDepositUndoApprovalAction
          open={undoApproval}
          isReoccurringDeposit={isReoccurringDeposit}
          onClose={() => setUndoApproval(false)}
        />
      )}

      {withdrawToSavings && (
        <CRMClientFixedDepositWithdrawToSavingsAction
          open={withdrawToSavings}
          isReoccurringDeposit={isReoccurringDeposit}
          onClose={() => setWithdrawToSavings(false)}
        />
      )}

      {depositTosRecurring && (
        <CRMClientFixedDepositDepositToReccurringAction
          open={depositTosRecurring}
          onClose={() => setDepositTosRecurring(false)}
        />
      )}
    </>
  );
}

export default CRMClientDetailsFixedDeposit;
