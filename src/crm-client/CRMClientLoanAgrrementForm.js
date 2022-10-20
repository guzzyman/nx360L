import React from "react";
import {Container} from '@mui/material'
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import { useParams } from "react-router-dom";
import ClientLAF from "client-laf/ClientLAF";

export default function CRMClientLoanAgrrementForm() {
  const { loanId } = useParams();

  const { data, isSuccess, isError, isFetching } =
    nimbleX360CRMClientApi.useGetCRMClientLoanLAFQuery({
      loanId,
      associations: "all",
      exclude: "guarantors,futureSchedule",
    });

  return (
    <Container className="max-w-2xl py-8">
      {isSuccess && (
        <ClientLAF
          // acceptanceOnComplete={() => alert("testing")}
          // acceptanceOnError={() => console.log("error")}
          useAcceptLafDocumentMutation={
            nimbleX360CRMClientApi.useAcceptCRMClientLAFTokenMutation
          }
          useResendLafDocumentTokenMutation={
            nimbleX360CRMClientApi.useGetCRMClientLAFTokenMutation
          }
          data={{
            loanId: loanId,
            isLafSigned: data?.loanInfo?.isLafSigned,
            loanProduct: data?.loanInfo?.loanProductName,
            submittedOnDate: data?.loanInfo?.timeline?.submittedOnDate,
            loanDescription: data?.loanInfo?.loanProductDescription,
            loanAmount: data?.loanInfo?.approvedPrincipal,
            customerFullName: data?.customerInfo?.clients?.displayName,
            expectedDisbursementDate:
              data?.loanInfo?.timeline?.expectedDisbursementDate,
            expectedMaturityDate:
              data?.loanInfo?.timeline?.expectedMaturityDate,
            loanTermFrequency: data?.loanInfo?.termFrequency,
            firstRepaymentDate: data?.loanInfo?.expectedFirstRepaymentOnDate,
            lastRepaymentDate: data?.loanInfo?.timeline?.expectedMaturityDate,
            loanInterestRate: data?.loanInfo?.interestRatePerPeriod,
            repaymentEvery: data?.loanInfo?.repaymentEvery,
            interestRateFrequencyType:
              data?.loanInfo?.interestRateFrequencyType?.value,
            dateOfBirth: data?.customerInfo?.clients?.dateOfBirth,
            emailAddress: data?.customerInfo?.clients?.emailAddress,
            houseAddress: data?.customerInfo?.addresses?.[0]?.addressLine1,
            gender: data?.customerInfo?.clients?.gender?.name,
            altPhoneNumber: data?.customerInfo?.clients?.alternateMobileNo,
            phoneNumber: data?.customerInfo?.clients?.mobileNo,
            clientIdentifiers: data?.customerInfo?.clientIdentifiers,
            customerAddress1: data?.customerInfo?.addresses?.[0]?.addressLine1,
            customerLGA: data?.customerInfo?.addresses?.[0]?.lga,
            customerStateName: data?.customerInfo?.addresses?.[0]?.stateName,
            employerName:
              data?.customerInfo?.clientEmployers?.[0]?.employer?.name,
            loanTermPeriodFrequencyType:
              data?.loanInfo?.termPeriodFrequencyType?.value,
            employerOfficeAddress:
              data?.customerInfo?.clientEmployers?.[0]?.officeAddress,
            loanReschedulePeriods: data?.loanInfo?.repaymentSchedule?.periods,
            totalPrincipalDisbursed:
              data?.loanInfo?.repaymentSchedule?.totalPrincipalDisbursed,
            totalInterestCharged:
              data?.loanInfo?.repaymentSchedule?.totalInterestCharged,
            totalRepaymentExpected:
              data?.loanInfo?.repaymentSchedule?.totalRepaymentExpected,
            paymentMethod: data?.loanInfo?.paymentMethod?.valueRef,
          }}
        />
      )}

      {isFetching && (
        <h5 className="text-center">Generating Loan Agreement Form</h5>
      )}

      {isError && (
        <h5 className="text-center text-red-400">
          Something went wrong, failed to generate... Try Again!
        </h5>
      )}
    </Container>
  );
}
