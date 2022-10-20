import { RouteEnum, UIPermissionEnum } from "common/Constants";
import { useParams, useSearchParams } from "react-router-dom";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";
import ClientXLeadTabDetails from "client-x-lead/ClientXLeadTabDetails";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import CRMClientLoanRepaymentSchedule from "./CRMClientLoanRepaymentSchedule";
import CRMClientLoanTransactions from "./CRMClientLoanTransactions";
import ClientXLeadLoanStatusChip from "client-x-lead/ClientXLeadLoanStatusChip";
import { useState } from "react";
import { Button, Icon } from "@mui/material";
import { format } from "date-fns/esm";
import CRMClientLoanDetailsLagacySystem from "./CRMClientLoanDetailsLagacySystem";
import { nimbleX360MambuApi } from "common/StoreQuerySlice";
import CRMClientLoanAccountDetails from "./CRMClientLoanAccountDetails";

function CRMClientDetailsLoanPendingValidation(props) {
  const [searchParams] = useSearchParams();
  const { id, loanId } = useParams();
  console.log("loanId", loanId)

  const [openLagacySystem, setOpenLagacySystem] = useState(false);

  const clientLoanQueryResult = nimbleX360MambuApi.useGetUnsettledPendingLoansQuery(loanId);
  const clientQueryResult = nimbleX360CRMClientApi.useGetCRMCDLClientQuery(id);

  const lagacySystem = !!clientLoanQueryResult?.data?.sourceId;

  const { data: templateOptionData } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanTransactionTemplateQuery({
      loanId,
      command: "foreclosure",
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      transactionDate: format(new Date(), "dd MMMM yyyy"),
    });

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
            <div className="flex items-center justify-end gap-4 border-t-2 pt-4 border-gray-100 my-4">
              {lagacySystem && (
                <Button
                  variant="outlined"
                  endIcon={<Icon>add</Icon>}
                  onClick={() => setOpenLagacySystem(true)}
                >
                  Lagacy System
                </Button>
              )}
              </div>
          </>
        )}
        summaryAside={(data) => [
          {
            label: "Loan Balance",
            value: (
              <>
                {"₦"}
                {formatNumberToCurrency(data?.summary?.totalOutstanding)}
              </>
            ),
          },
          // {
          //   label: "Settlement Balance:",
          //   value: (
          //     <>
          //       {"₦"}
          //       {formatNumberToCurrency(templateOptionData?.amount)}
          //     </>
          //   ),
          // },
          {
            label: "Arrears:",
            value: (
              <>
                {"₦"}
                {formatNumberToCurrency(data?.summary?.totalOverdue)}
              </>
            ),
          },
        ]}
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
        summary={(data) => [
          {
            label: "Loan Type:",
            value: data?.isTopup ? "Topup" : "New Loan",
          },
          {
            label: "Net Pay:",
            value: `${
              "₦" || ""
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
              "₦" || ""
            }${formatNumberToCurrency(data?.proposedPrincipal)}`,
          },
          {
            label: "Approved Amount:",
            value: `${
              "₦" || ""
            }${formatNumberToCurrency(data?.approvedPrincipal)}`,
          },
          {
            label: "Disbursed Amount:",
            value: `${
              "₦" || ""
            }${formatNumberToCurrency(data?.summary?.principalDisbursed)}`,
          },
          data?.loanOfficerName && {
            label: "Sales Officer:",
            value: data?.loanOfficerName,
          },
        ]}
       
        defaultTab={parseInt(searchParams.get("defaultTab"))}
        tabs={(data) => [
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
        ]}
      />

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

export default CRMClientDetailsLoanPendingValidation;
