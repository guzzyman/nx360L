import {} from "@mui/material";
import { Button, Icon, Paper } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";
import NimbleX360Png from "assets/images/cdl-logo-blue.png";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import { ClientLAFRepaymentSchedule } from "./ClientLAFRepaymentSchedule";
import { ClientLAFVerifyOTPModal } from "./ClientLAFVerifyOTPModal";
import { format } from "date-fns";

/**
 *
 * @param {ClientLAFProps} props
 */
export default function ClientLAF(props) {
  const {
    component: Component,
    data,
    hideAcceptButton,
    disableAcceptedButton,
    isAcceptButtonLoading,
  } = props;

  const [openOTPVerify, setOpenOTPVerify] = useState(false);

  const loanInterestBasis = data?.interestRateFrequencyType;
  const monthlyRepaymentSum =
    data?.loanReschedulePeriods?.[1]?.totalInstallmentAmountForPeriod || "";

  const isLafSigned = data?.isLafSigned;
  const paymentMethod =
    data?.paymentMethod ||
    "Direct debit on the Borrower’s designated Payment Method";
  const customerFullName = data?.customerFullName || "";
  const loanProduct = data?.loanProduct;
  const loanDescription = data?.loanDescription || "";
  const loanAmount = data?.loanAmount || "";
  const expectedDisbursementDate = data?.expectedDisbursementDate || new Date();
  const expectedMaturityDate = data?.expectedMaturityDate || new Date();
  const loanTermFrequency = data?.loanTermFrequency || "";
  const loanInterestRate = data?.loanInterestRate || 0 + "%";
  const repaymentEvery = data?.repaymentEvery;
  const interestRateFrequencyType = data?.interestRateFrequencyType;
  const phoneNumber = data?.phoneNumber || "";
  const emailAddress = data?.emailAddress || "";
  const gender = data?.gender || "";
  const altPhoneNumber = data?.altPhoneNumber || "";
  const dateOfBirth = parseDateToString(data?.dateOfBirth) || "";
  const repaymentMode = data?.repaymentMode;
  const clientIdentifiers = data?.clientIdentifiers;
  const firstRepaymentDate = parseDateToString(data?.firstRepaymentDate) || "";
  const lastRepaymentDate = parseDateToString(data?.lastRepaymentDate) || "";
  const customerAddress1 = data?.customerAddress1;
  const customerLGA = data?.customerLGA;
  const customerStateName = data?.customerStateName;
  const houseAddress = `${customerAddress1 || ""}, ${customerLGA || ""}, ${
    customerStateName || ""
  }`;
  const employerName = data?.employerName;
  const employerOfficeAddress = data?.employerOfficeAddress;
  const loanReschedulePeriods = data?.loanReschedulePeriods;
  const submittedOnDate =
    parseDateToString(data?.submittedOnDate) || "_______________";

  const totalPrincipalDisbursed = data?.totalPrincipalDisbursed || "";
  const totalInterestCharged = data?.totalInterestCharged || "";
  const totalFeeChargesCharged = data?.totalFeeChargesCharged || "";
  const totalRepaymentExpected = data?.totalRepaymentExpected || "";

  const RepaymentDate = data?.firstRepaymentDate
    ? format(new Date(parseDateToString(data?.firstRepaymentDate)), "dd")
    : "" || "";

  const loanTermPeriodFrequencyType =
    data?.loanTermPeriodFrequencyType || ".........";

  const loanTenure = loanTermFrequency + " " + loanTermPeriodFrequencyType;
  const loanFromTo = `${
    parseDateToString(expectedDisbursementDate) || "..................."
  } to ${parseDateToString(expectedMaturityDate) || "..................."}`;
  const repaymentFrequency =
    repaymentEvery + " " + interestRateFrequencyType || "";

  const customerSignature =
    clientIdentifiers?.find((e) => e.documentType.id === 66)?.attachment
      ?.location || "";

  const loanHeader = [
    {
      name: "Date:",
      value: data?.submittedOnDate?.length
        ? [...data?.submittedOnDate]?.reverse()?.join?.("-")
        : format(new Date(), "dd-MM-yyyy"),
    },
    { name: "Obligor’s Name:", value: customerFullName },
    {
      name: "Obligor’s Address:",
      value: `${customerAddress1 || ""}, ${customerLGA || ""}, ${
        customerStateName || ""
      }`,
    },
  ];

  const leanLenderDetails = [
    { name: "Lender:", value: "Credit Direct Limited" },
    { name: "Address:", value: "48/50, Isaac John Street, GRA, lkeja, Lagos" },
    { name: "Facility Type:", value: loanProduct },
    { name: "Facility Amount:", value: formatNumberToCurrency(loanAmount) },
    { name: "Tenor Facility:", value: loanTenure },
    repaymentMode && {
      name: "Repayment Source:",
      value: repaymentMode,
    },
    { name: "Repayment Date:", value: RepaymentDate },
    { name: "Repayment Frequency:", value: repaymentFrequency },
    { name: "First Repayment Date:", value: firstRepaymentDate },
    { name: "Last Repayment Date:", value: lastRepaymentDate },
    // { name: "Monthly installment:", value: repaymentInstallment },
  ];

  const underTaking = [
    "CDL shall have the right to set off the monthly installment or any overdue payments directly from the Borrower’s bank accounts. In the event that the Borrower defaults on their monthly repayments, CDL reserves the right to report the delinquent loan to the Central Bank of Nigeria through the Credit Risk Management System (CRMS) or by any other means and to activate a global standing instruction (GSI) to set-off the indebtedness from all such monies and funds standing to the Borrower’s credit/benefit from all accounts or such other financial assets belonging to Borrower and in the custody of any bank.",
    "The financial information, including the debit card details provided during the application process is true and accurate and undertakes that he/she will notify any other lender of their indebtedness to CDL during the tenor of this loan.",
    "Ensure that the bank account linked to the debit card details provided during the application process will be sufficiently funded throughout the subsistence of this agreement.",
    "He/she authorizes CDL to access any information available to validate their application and give CDL permission to register details of the Borrower’s account with any credit bureau, collection agencies, as well as the Borrower’s employers if the loan has ceased to be serviced by the Borrower and the Borrower waives any claims he / she may have against CDL in respect of such disclosure.",
    "He/she authorizes CDL or their employer to deduct monthly installments from their salary or other sources of income not stated until the loan has been fully paid, and to recover any outstanding instalments against their terminal dues in the event of termination of employment, resignation, voluntary retirement or death before the loan is fully recovered.",
  ];

  const borrowersKYCDetails = [
    { name: "Name:", value: customerFullName },
    { name: "Date of birth:", value: dateOfBirth },
    {
      name: "Phone No:",
      value: phoneNumber,
    },
    {
      name: "E-mail address:",
      value: emailAddress,
    },
    {
      name: "Current residential address:",
      value: houseAddress,
    },
    {
      name: "Gender:",
      value: gender,
    },
    {
      name: "Alternate No:",
      value: altPhoneNumber,
    },
    {
      name: "Employer/Business name and address:",
      value: `${employerName || ""} / ${employerOfficeAddress || ""}`,
    },
  ];

  const dataTableTotal = {
    totalPrincipalDisbursed,
    totalInterestCharged,
    totalFeeChargesCharged,
    totalRepaymentExpected,
  };

  return (
    <div className="contents" style={{ fontSize: "0.65625rem" }}>
      <Component className="p-8 max-w-7xl w-full" id="capture">
        <div className="flex items-center flex-col mb-4">
          <img
            src={NimbleX360Png}
            alt="NimbleX360"
            style={{ maxWidth: "150px" }}
            className="mb-2"
          />

          <h1 className="font-bold">RC 657309</h1>
        </div>

        <div className="bg-primary-main p-4 mb-8">
          <h3 className="font-bold text-center text-white">
            PROVISIONAL OFFER LETTER
          </h3>
        </div>

        {/* loan header start */}
        <div className="mb-8">
          {loanHeader.map((item, i) => (
            <div key={i} className="flex items-center mb-1">
              <h5 className="font-bold w-1/4">{item?.name}</h5>
              <h5 className="w-3/4 uppercase">{item?.value}</h5>
            </div>
          ))}
        </div>
        {/* loan header End */}

        <h4 className="font-bold capitalize">Dear {customerFullName},</h4>

        <div>
          <h5 className="font-bold my-4 text-center">
            OFFER OF CREDIT FACILITY
          </h5>

          {/* loan Leander details Start */}
          <div className="mt-5 mb-10">
            {leanLenderDetails.map((item, i) => (
              <div key={i} className="flex items-center mb-1">
                <h5 className="font-bold w-1/4">{item?.name}</h5>
                <h5 className="w-3/4">{item?.value}</h5>
              </div>
            ))}
          </div>
          {/* loan Leander details End */}
        </div>

        <hr />

        <div className="my-8">
          <h5 className="font-bold mb-2">LOAN AGREEMENT FOR {loanProduct}</h5>
          <p>
            This Loan Agreement is entered the <b>{submittedOnDate}</b> between
            CREDIT DIRECT LIMITED, a financial services company incorporated in
            Nigeria with its registered office at 48/50, Isaac John Street, GRA,
            lkeja, Lagos (“CDL”) and <b>{customerFullName}</b> of {""}
            {houseAddress} (“the Borrower”).
          </p>
        </div>

        <div className="mb-8">
          <h5 className="font-bold mb-2">
            DESCRIPTION <br />
            {loanDescription}
          </h5>
          <p>
            The device financing loan facility is a short-term loan product that
            provides Borrowers with the opportunity to obtain credit facilities
            to enable them acquire assets (including but not limited to
            electronic appliances, devices and gadgets) from participating
            physical and online stores (“Vendors”).
          </p>
        </div>

        <div className="mb-8">
          <h5 className="font-bold mb-2">TERMS OF THE LOAN</h5>
          <p className="mb-2">
            The Borrower has applied for and CDL has agreed to lend the Borrower
            a loan facility in the sum of ₦{formatNumberToCurrency(loanAmount)},
            The loan amount shall be disbursed directly into the requisite
            Client's CDL wallet account in line with the Borrower’s application.
          </p>

          <ul class="list-disc list-inside mb-4">
            <li>
              Tenor: {loanTenure} commencing from {loanFromTo} or until the loan
              is fully repaid.
            </li>

            <li>
              Interest: Interest rate is {loanInterestRate}% and computed{" "}
              {loanInterestBasis}. The monthly interest shall start to
              accumulate on the loan amount from the date following the date of
              loan disbursement. Where the Borrower fails to pay any amount owed
              to CDL on a due date, default interest shall be charged on the
              unpaid amount at the same rate as above or such higher rate to be
              advised.
            </li>
            <li>
              Monthly repayment sum: ₦
              {formatNumberToCurrency(monthlyRepaymentSum)}
            </li>
            <li>Repayment method: {paymentMethod}.</li>
          </ul>

          <p>
            CDL may vary its rates and these terms and conditions at any time if
            required or advisable to do so by law; if there is a change in
            market conditions or to maintain the rate of return on this
            facility. Any variation to these terms and conditions shall be
            communicated to the Borrower and shall be binding on the Borrower
            from the date specified in such notice.
          </p>
        </div>

        <div className="mb-8">
          <h5 className="font-bold mb-2">REPAYMENT SCHEDULE</h5>

          <div className="overflow-x-scroll">
            <ClientLAFRepaymentSchedule
              data={loanReschedulePeriods}
              dataTableTotal={dataTableTotal}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "This offer is subject to a satisfactory credit report and further verification checks. If your application is unsuccessful, an update will be sent to your email.",
              "Please note upfront charges may be deducted from the loan amount depending on the product type.",
            ].map((item, i) => (
              <div key={i} className="p-2 rounded-lg text-gray-900 bg-gray-100">
                <div className="flex gap-1">
                  <svg
                    class="inline flex-shrink-0 mr-3 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>{item}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h5 className="font-bold mb-2">MEMORANDUM OF ACCEPTANCE</h5>
          <p>
            I {customerFullName}, hereby accept the terms and conditions
            contained in this schedule.
          </p>
        </div>

        <div className="mb-8">
          <h5 className="font-bold mb-2">BORROWER’S UNDERTAKINGS</h5>
          <p>The Borrower understands and agrees that:</p>
          <ul className="list-disc list-inside mt-5">
            {underTaking.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>
            These terms and conditions shall remain in force provided CDL
            remains a creditor of the Borrower or any part of the loan remains
            outstanding.
          </p>
        </div>

        <div className="mb-8">
          <h5 className="font-bold mb-2">BORROWER’S KYC DETAILS</h5>
          <div>
            <div className="grid md:grid-cols-2">
              {borrowersKYCDetails.map((item, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <h5 className="font-bold w-1/4">{item?.name}</h5>
                  <h5 className="w-3/4">{item?.value}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h5 className="font-bold mb-2">DISCLAIMER:</h5>
          <p className="mb-4">
            As required by law, Credit Direct Limited is mandated to disclose
            the status of defaulting loans to relevant local and/or
            international credit bureaus, credit monitoring agencies and
            regulatory bodies.
          </p>

          <p>
            Thank you.
            <br />
            Yours faithfully:
            <br />
            For Credit Direct Limited
          </p>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <h5 className="font-bold mb-2">Head, Customer Engagement</h5>
          </div>
          <div>
            <h5 className="font-bold mb-2">Head, Risk Management</h5>
          </div>
        </div>

        <div className="mb-8">
          <h5 className="font-bold mb-2">BORROWER’S ATTESTATION</h5>
          <p>
            I {customerFullName}, hereby accept the terms and conditions
            contained in this schedule.
          </p>
        </div>

        <div className="mb-8">
          <h5 className="font-bold mb-2">BORROWER’S UNDERTAKINGS</h5>
          <p>
            The Borrower understands and agrees that this Loan Agreement is
            executed and delivered electronically and that no separate hard copy
            will be provided. Accordingly, this agreement shall be effective for
            all purposes and shall have the same legal effect, validity and
            enforceability as a manually executed agreement.
          </p>
          <p>
            I, {customerFullName} hereby acknowledges that they have read and
            understood all the terms and conditions as contained herein and
            agree to be bound by them. The Terms and Conditions as available on
            CDL’s website shall be incorporated hereto and shall be construed
            and read as forming part of this Loan Agreement.
          </p>
        </div>

        <div className="flex items-end gap-4 md:gap-8 flex-wrap">
          <div className="flex flex-col">
            <p className="">{customerFullName}</p>
            <p className="font-bold">Name:</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="">
              {customerSignature ? (
                <img src={customerSignature} alt="Signature" />
              ) : (
                "_______________"
              )}
            </p>
            <p className="font-bold">Signature:</p>
          </div>
        </div>
        {!hideAcceptButton && !isLafSigned && (
          <div className="sticky bottom-8 flex items-center justify-end">
            <LoadingButton
              loading={isAcceptButtonLoading}
              disabled={disableAcceptedButton}
              loadingPosition="end"
              endIcon={<></>}
              startIcon={<Icon>assignment</Icon>}
              onClick={() => setOpenOTPVerify(true)}
            >
              Accept Document
            </LoadingButton>
          </div>
        )}
      </Component>

      {openOTPVerify && (
        <ClientLAFVerifyOTPModal
          open={openOTPVerify}
          onClose={() => setOpenOTPVerify(false)}
          {...props}
        />
      )}
    </div>
  );
}

ClientLAF.defaultProps = {
  component: Paper,
};

/**
 * @typedef {{
 * data: ClientLAFData;
 * component: any;
 * onSuccess: () => void;
 * onError: () => void
 * }} ClientLAFProps
 */

/**
 * @typedef {{
 * loanId: string;
 * isLafSigned: boolean;
 * submittedOnDate: array;
 * loanProduct: string;
 * loanDescription: string;
 * loanAmount: string;
 * customerFullName: string;
 * expectedDisbursementDate: string;
 * expectedMaturityDate: string;
 * loanTermFrequency: string;
 * firstRepaymentDate: string;
 * loanInterestRate: string;
 * repaymentEvery: string;
 * interestRateFrequencyType: string;
 * dateOfBirth: string;
 * emailAddress: string;
 * houseAddress: string;
 * gender: string;
 * altPhoneNumber: string;
 * phoneNumber: string;
 * clientIdentifiers: array;
 * customerAddress1: string;
 * customerLGA: string;
 * customerStateName: string;
 * employerName: string;
 * employerOfficeAddress: string;
 * lastRepaymentDate: string;
 * loanReschedulePeriods: array;
 * totalPrincipalDisbursed: string;
 * totalInterestCharged: string;
 * totalFeeChargesCharged: string;
 * totalRepaymentExpected: string;
 * paymentMethod: string;
 * }} ClientLAFData
 */
