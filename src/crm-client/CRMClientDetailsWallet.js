import { RouteEnum } from "common/Constants";
import { useParams } from "react-router";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";
import ClientXLeadTabDetails from "client-x-lead/ClientXLeadTabDetails";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import ClientXLeadLoanStatusChip from "client-x-lead/ClientXLeadLoanStatusChip";
import CRMClientWalletTransactions from "./CRMClientWalletTransactions";
import CRMClientWalletStandingInstructions from "./CRMClientWalletStandingInstructions";
import { useMemo, useState } from "react";
import CRMClientWalletPostInterestAction from "./CRMClientWalletPostInterestAction";
import CRMClientWalletDepositAction from "./CRMClientWalletDepositAction";
import CRMClientWalletWithdrawAction from "./CRMClientWalletWithdrawAction";
import { useConfirmDialog } from "react-mui-confirm";
import { useSnackbar } from "notistack";
import CRMClientWalletChargesAction from "./CRMClientWalletChargesAction";
import CRMClientWalletAccountTransferAction from "./CRMClientWalletAccountTransferAction";

function CRMClientDetailsWallet(props) {
  const { id, walletId } = useParams();
  const [postInterest, setPostInterest] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [charges, setCharges] = useState(false);
  const [accountTransfer, setAccountTransfer] = useState(false);

  const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();

  const [calculateInterest] =
    nimbleX360CRMClientApi.useAddCRMClientSavingsAccountDetailsActionMutation();

  const clientWalletQueryResult =
    nimbleX360CRMClientApi.useGetClientSavingsAccountDetailsQuery({
      walletId,
      associations: "all",
    });

  //   const clientDataTablesQueryResult =
  //     nimbleX360CRMClientApi.useGetClientdataTablesQuery({
  //       apptable: "m_savings_account",
  //     });

  const clientQueryResult = nimbleX360CRMClientApi.useGetCRMClientQuery({ id });

  const handleCalculateInterestConfirm = (walletId) =>
    confirm({
      title: "Are you sure you want to Calculate Interest?",
      onConfirm: async () => {
        try {
          await calculateInterest({
            walletId,
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

  const handlePostInterestConfirm = (walletId) =>
    confirm({
      title: "Are you sure you want to Post Interest?",
      onConfirm: async () => {
        try {
          await calculateInterest({
            walletId,
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

  const walletActions = useMemo(
    () =>
      // If Reconciliation wallet disabled wallet actions
      parseInt(clientWalletQueryResult?.data?.savingsProductId) === 16 ||
      parseInt(clientWalletQueryResult?.data?.savingsProductId) === 2
        ? []
        : [
            {
              name: "Post Interest as on",
              action: () => setPostInterest(true),
            },
            { name: "Deposit", action: () => setDeposit(true) },
            {
              name: "Transfer To Bank",
              action: () => setWithdraw(true),
            },
            {
              name: "Calculate Interest",
              action: () => handleCalculateInterestConfirm(walletId),
            },
            {
              name: "Post Interest",
              action: () => handlePostInterestConfirm(walletId),
            },
            {
              name: "Account Transfer",
              action: () => setAccountTransfer(true),
            },
          ],
    // eslint-disable-next-line
    []
  );

  return (
    <>
      <ClientXLeadTabDetails
        id={id}
        breadcrumbName="Wallet"
        breadcrumbTo={RouteEnum.CRM_CLIENTS}
        detailsQueryResult={clientWalletQueryResult}
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
              <ClientXLeadLoanStatusChip status={data?.status} />
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
            label: "Available Balance:",
            value: (
              <>
                {data?.summary?.currency?.displaySymbol}
                {formatNumberToCurrency(data?.summary?.availableBalance)}
              </>
            ),
          },
        ]}
        summary={(data) => [
          {
            ...(data?.summary?.totalWithdrawals && {
              label: "Total Withdrawals:",
              value: `${
                data?.summary?.currency?.displaySymbol || ""
              }${formatNumberToCurrency(data?.summary?.totalWithdrawals)}`,
            }),
          },
          {
            ...(data?.summary?.totalWithdrawalFees && {
              label: "Withdrawals Fees:",
              value: `${
                data?.summary?.currency?.displaySymbol || ""
              }${formatNumberToCurrency(data?.summary?.totalWithdrawalFees)}`,
            }),
          },
          {
            ...(data?.summary?.totalWithdrawalFees && {
              label: "Annual Fees:",
              value: `${
                data?.summary?.currency?.displaySymbol || ""
              }${formatNumberToCurrency(data?.summary?.totalAnnualFees)}`,
            }),
          },
          // {
          //   ...(data?.summary?.totalInterestEarned >= 0 && {
          //     label: "Interest Earned:",
          //     value: `${
          //       data?.summary?.currency?.displaySymbol || ""
          //     }${formatNumberToCurrency(data?.summary?.totalInterestEarned)}`,
          //   }),
          // },
          // {
          //   ...(data?.summary?.totalInterestPosted && {
          //     label: "Interest Posted:",
          //     value: `${
          //       data?.summary?.currency?.displaySymbol || ""
          //     }${formatNumberToCurrency(data?.summary?.totalInterestPosted)}`,
          //   }),
          // },
          // {
          //   ...(data?.summary?.interestNotPosted >= 0 && {
          //     label: "Interest Earned Not Posted:",
          //     value: `${
          //       data?.summary?.currency?.displaySymbol || ""
          //     }${formatNumberToCurrency(data?.summary?.interestNotPosted)}`,
          //   }),
          // },
          // {
          //   ...(data?.summary?.totalOverdraftInterestDerived && {
          //     label: "Interest On Overdraft:",
          //     value: `${
          //       data?.summary?.currency?.displaySymbol || ""
          //     }${formatNumberToCurrency(
          //       data?.summary?.totalOverdraftInterestDerived
          //     )}`,
          //   }),
          // },
          // {
          //   ...(data?.summary?.interestNotPosted < 0 && {
          //     label: "Overdraft Interest Not Posted:",
          //     value: `${
          //       data?.summary?.currency?.displaySymbol || ""
          //     }${formatNumberToCurrency(data?.summary?.interestNotPosted)}`,
          //   }),
          // },

          // {
          //   label: "Nominal interest rate:",
          //   value: `${parseInt(data?.nominalAnnualInterestRate) || 0}%`,
          // },
          // {
          //   label: "Interest compounding period:",
          //   value: data?.interestCompoundingPeriodType?.value,
          // },
          // {
          //   label: "Interest posting period:",
          //   value: data?.interestPostingPeriodType?.value,
          // },
          // {
          //   label: "Interest calculated using:",
          //   value: data?.interestCalculationType?.value,
          // },
          // {
          //   label: "# Days in Year:",
          //   value: data?.interestCalculationDaysInYearType?.value,
          // },
          {
            ...(data?.withdrawalFee?.amount && {
              label: "Withdrawal fee:",
              value: `${
                data?.summary?.currency?.displaySymbol || ""
              }${formatNumberToCurrency(data?.withdrawalFee?.amount)}`,
            }),
          },
          {
            ...(data?.subStatus?.id !== 0 && {
              label: "Substatus:",
              value: data?.subStatus?.value,
            }),
          },
          {
            ...(data?.lastActiveTransactionDate && {
              label: "Last Active Transaction Date:",
              value: parseDateToString(data?.lastActiveTransactionDate),
            }),
          },
          {
            ...(data?.data?.daysToInactive && {
              label: "Days to Inactive:",
              value: parseDateToString(data?.daysToInactive),
            }),
          },
          {
            ...(data?.data?.daysToDormancy && {
              label: "Days to Dormancy:",
              value: data?.daysToDormancy,
            }),
          },
          {
            ...(data?.daysToEscheat && {
              label: "Days to Escheat:",
              value: data?.daysToEscheat,
            }),
          },
          {
            ...(data?.annualFee && {
              label: "Days to Escheat:",
              value: `${
                data?.summary?.currency?.displaySymbol || ""
              }${formatNumberToCurrency(data?.annualFee?.amount)}`,
            }),
          },
          {
            ...(data?.allowOverdraft && {
              label: "Over Draft Limit:",
              value: data?.allowOverdraft,
            }),
          },
          {
            ...(data?.allowOverdraft && {
              label: "Over Draft Limit:",
              value: data?.overdraftLimit,
            }),
          },
          {
            ...(data?.allowOverdraft && {
              label: "Min Overdraft Required for Interest Calculation:",
              value: data?.minOverdraftForInterestCalculation,
            }),
          },
          {
            ...(data?.minBalanceForInterestCalculation && {
              label: "Min Balance Required for Interest Calculation:",
              value: data?.minBalanceForInterestCalculation,
            }),
          },
          {
            ...(data?.minRequiredBalance && {
              label: "Minimum Required Balance:",
              value: data?.minRequiredBalance,
            }),
          },
          {
            ...(data?.enforceMinRequiredBalance && {
              label: "Enforce Minimum Required Balance:",
              value: data?.enforceMinRequiredBalance,
            }),
          },
          // {
          //   ...(data?.summary?.lastInterestCalculationDate && {
          //     label: "Interest Recalculation Date:",
          //     value: parseDateToString(
          //       data?.summary?.lastInterestCalculationDate
          //     ),
          //   }),
          // },
          {
            ...(data?.onHoldFunds && {
              label: "On Hold Funds:",
              value: data?.onHoldFunds,
            }),
          },
          {
            ...(data?.onHoldFunds && {
              label: "On Hold Funds:",
              value: data?.onHoldFunds,
            }),
          },
          {
            label: "Activated On",
            value: data?.timeline?.activatedOnDate
              ? parseDateToString(data?.timeline?.activatedOnDate)
              : "Not Activated",
          },
          // {
          //   label: "Field Officer",
          //   value: data?.fieldOfficerName
          //     ? data?.fieldOfficerName
          //     : "Unassigned",
          // },
          // {
          //   label: "External Id",
          //   value: data?.externalId ? data?.externalId : "Not Provided",
          // },
          {
            label: "Currency",
            value: `${data?.currency?.name} [${data?.currency?.code}]`,
          },
          // {
          //   label: "Nominal Interest Rate",
          //   value: data?.nominalAnnualInterestRate,
          // },
        ]}
        summaryActions={walletActions}
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
            name: "TRANSACTIONS",
            content: (
              <CRMClientWalletTransactions
                queryResult={clientWalletQueryResult}
              />
            ),
          },
          {
            name: "ALL STANDING INSTRUCTIONS",
            content: (
              <CRMClientWalletStandingInstructions
                clientQueryResult={clientQueryResult}
              />
            ),
          },
          //   {
          //     name: "CHARGES",
          //     content: (
          //       <CRMClientWalletCharges queryResult={clientWalletQueryResult} />
          //     ),
          //   },
        ]}
      />

      {postInterest && (
        <CRMClientWalletPostInterestAction
          open={postInterest}
          onClose={() => setPostInterest(false)}
        />
      )}

      {deposit && (
        <CRMClientWalletDepositAction
          open={deposit}
          onClose={() => setDeposit(false)}
        />
      )}

      {withdraw && (
        <CRMClientWalletWithdrawAction
          open={withdraw}
          clientWalletQueryResult={clientWalletQueryResult}
          onClose={() => setWithdraw(false)}
        />
      )}

      {charges && (
        <CRMClientWalletChargesAction
          open={charges}
          onClose={() => setCharges(false)}
        />
      )}

      {accountTransfer && (
        <CRMClientWalletAccountTransferAction
          open={accountTransfer}
          onClose={() => setAccountTransfer(false)}
        />
      )}
    </>
  );
}

export default CRMClientDetailsWallet;
