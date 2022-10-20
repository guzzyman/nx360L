import ClientLAF from "client-laf/ClientLAF";
import { CreditDirectPayEventEnum } from "./CreditDirectPayConstant";
import CreditDirectPayStepPaper from "./CreditDirectPayStepPaper";
import { cdlPayPublicApi } from "./CreditDirectPayStoreQuerySlice";

function CreditDirectPayLAFDocument({
  sendEvent,
  data,
  urlQueryParams,
  cdlPayDetailsQueryResult,
}) {
  const loanInfo = data?.loanInfo;

  return (
    <CreditDirectPayStepPaper className="p-0 relative">
      <ClientLAF
        component="div"
        onSuccess={() => {
          sendEvent(CreditDirectPayEventEnum.LAF_SIGNING_SUCCESSFUL);
        }}
        onError={() => {
          sendEvent(CreditDirectPayEventEnum.LAF_SIGNING_FAILED);
        }}
        useAcceptLafDocumentMutation={
          cdlPayPublicApi.useCdlPayAcceptLAFDocumentMutation
        }
        useResendLafDocumentTokenMutation={
          cdlPayPublicApi.useResendCdlPayLAFDocumentTokenMutation
        }
        hideAcceptButton={urlQueryParams.hideAcceptButton}
        isAcceptButtonLoading={
          cdlPayDetailsQueryResult.isLoading ||
          cdlPayDetailsQueryResult.isFetching
        }
        disableAcceptedButton={
          cdlPayDetailsQueryResult.isLoading ||
          cdlPayDetailsQueryResult.isFetching
        }
        data={{
          loanId: loanInfo?.loanInfo?.id,
          isLafSigned: loanInfo?.loanInfo?.isLafSigned,
          loanProduct: loanInfo?.loanInfo?.loanProductName,
          submittedOnDate: loanInfo?.loanInfo?.timeline?.submittedOnDate,
          loanDescription: loanInfo?.loanInfo?.loanProductDescription,
          loanAmount: loanInfo?.loanInfo?.approvedPrincipal,
          customerFullName: loanInfo?.customerInfo?.clients?.displayName,
          expectedDisbursementDate:
            loanInfo?.loanInfo?.timeline?.expectedDisbursementDate,
          expectedMaturityDate:
            loanInfo?.loanInfo?.timeline?.expectedMaturityDate,
          loanTermFrequency: loanInfo?.loanInfo?.termFrequency,
          firstRepaymentDate: loanInfo?.loanInfo?.expectedFirstRepaymentOnDate,
          lastRepaymentDate: loanInfo?.loanInfo?.timeline?.expectedMaturityDate,
          loanInterestRate: loanInfo?.loanInfo?.interestRatePerPeriod,
          repaymentEvery: loanInfo?.loanInfo?.repaymentEvery,
          interestRateFrequencyType:
            loanInfo?.loanInfo?.interestRateFrequencyType?.value,
          dateOfBirth: loanInfo?.customerInfo?.clients?.dateOfBirth,
          emailAddress: loanInfo?.customerInfo?.clients?.emailAddress,
          houseAddress: loanInfo?.customerInfo?.addresses?.[0]?.addressLine1,
          gender: loanInfo?.customerInfo?.clients?.gender?.name,
          altPhoneNumber: loanInfo?.customerInfo?.clients?.alternateMobileNo,
          phoneNumber: loanInfo?.customerInfo?.clients?.mobileNo,
          clientIdentifiers: loanInfo?.customerInfo?.clientIdentifiers,
          customerAddress1:
            loanInfo?.customerInfo?.addresses?.[0]?.addressLine1,
          customerLGA: loanInfo?.customerInfo?.addresses?.[0]?.lga,
          customerStateName: loanInfo?.customerInfo?.addresses?.[0]?.stateName,
          employerName:
            loanInfo?.customerInfo?.clientEmployers?.[0]?.employer?.name,
          loanTermPeriodFrequencyType:
            loanInfo?.loanInfo?.termPeriodFrequencyType?.value,
          employerOfficeAddress:
            loanInfo?.customerInfo?.clientEmployers?.[0]?.officeAddress,
          loanReschedulePeriods: loanInfo?.loanInfo?.repaymentSchedule?.periods,
          totalPrincipalDisbursed:
            loanInfo?.loanInfo?.repaymentSchedule?.totalPrincipalDisbursed,
          totalInterestCharged:
            loanInfo?.loanInfo?.repaymentSchedule?.totalInterestCharged,
          totalRepaymentExpected:
            loanInfo?.loanInfo?.repaymentSchedule?.totalRepaymentExpected,
          paymentMethod: data?.loanInfo?.paymentMethod?.valueRef,
        }}
      />
    </CreditDirectPayStepPaper>
  );
}

export default CreditDirectPayLAFDocument;
