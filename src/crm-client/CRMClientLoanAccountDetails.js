import { Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import { useParams } from "react-router-dom";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import ClientXLeadLoanStatusChip from "client-x-lead/ClientXLeadLoanStatusChip";
import LoadingContent from "common/LoadingContent";
import { format } from "date-fns";
import { dateLocaleFormat } from "common/Constants";

function CRMClientLoanAccountDetails({ queryResult }) {
  const client = queryResult;
  const { loanId, id } = useParams();

  const vendorLoanQuery = nimbleX360CRMClientApi.useGetCRMClientVendorLoanQuery(
    {
      loanId,
      clientId: id,
    }
  );

  const vendorData = vendorLoanQuery?.data?.pageItems?.[0];

  const accountDetails = [
    // {
    //   title: "Repayment Strategy:",
    //   value: client?.data?.transactionProcessingStrategyName,
    // },
    {
      title: "Repayments:",
      value: (
        <>
          {client?.data?.numberOfRepayments} every{" "}
          {client?.data?.repaymentEvery}&nbsp;
          {client?.data?.repaymentFrequencyType?.value}
          {client?.data?.repaymentFrequencyType?.id === 2 &&
            client?.data?.repaymentFrequencyNthDayType?.id !== 0 &&
            client?.data?.repaymentFrequencyDayOfWeekType?.id !== 0 &&
            `${client?.data?.repaymentFrequencyNthDayType?.value || ""} 
              ${client?.data?.repaymentFrequencyDayOfWeekType?.value || ""}`}
        </>
      ),
    },
    {
      title: "Amortization:",
      value: client?.data?.amortizationType?.value,
    },
    {
      title: "Equal Amortization:",
      value: client?.data?.isEqualAmortization,
    },
    {
      title: "Interest:",
      value: (
        <>
          {client?.data?.annualInterestRate} per annum (
          {client?.data?.interestRatePerPeriod}
          {client?.data?.interestRateFrequencyType?.value}) -
          {client?.data?.interestType?.value}
        </>
      ),
    },
    // {
    //   title: "Grace: On Interest Payment:",
    //   value: client?.data?.graceOnArrearsAgeing,
    // },
    // {
    //   title: "Fund Source:",
    //   value: client?.data?.fundName,
    // },
    // {
    //   title: "Interest Calculation Period:",
    //   value: client?.data?.fundName,
    // },
    {
      title: "Interest Free Period:",
      value: client?.data?.interestCalculationPeriodType?.value,
    },
    // {
    //   title: "Interest Free Period:",
    //   value: client?.data?.interestCalculationPeriodType?.value,
    // },
    {
      title: "Allow Partial Interest Calculation with same as repayment:",
      value: client?.data?.allowPartialPeriodInterestCalcualtion,
    },
    {
      title: "Interest Type:",
      value: client?.data?.interestType?.value,
    },
    {
      title: "Submitted on:",
      value: parseDateToString(client?.data?.timeline?.submittedOnDate),
    },
    {
      title: "Approved on:",
      value: parseDateToString(client?.data?.timeline?.approvedOnDate),
    },
    {
      title: "Disbursed on:",
      value: parseDateToString(client?.data?.timeline?.actualDisbursementDate),
    },
    {
      title: "Matures on:",
      value: parseDateToString(client?.data?.timeline?.expectedMaturityDate),
    },
    client?.data?.isTopup && {
      title: "Is Topup Loan? :",
      value: client?.data?.isTopup ? "True" : "False",
    },
    client?.data?.isTopup && {
      title: "Loan closed with Topup:",
      value: client?.data?.closureLoanAccountNo,
    },
    client?.data?.isTopup && {
      title: "Topup closure amount:",
      value: client?.data?.topupAmount,
    },
    // client?.data?.canDefineInstallmentAmount && {
    //   title: "Fixed EMI amount:",
    //   value: (
    //     <CurrencyTypography>{client?.data?.fixedEmiAmount}</CurrencyTypography>
    //   ),
    // },
    {
      title: "Recalculate Interest based on new terms:",
      value: client?.data?.isInterestRecalculationEnabled ? "Yes" : "No",
    },
    {
      title: "Days in year:",
      value: client?.data?.daysInYearType?.value,
    },
    {
      title: "Days in month:",
      value: client?.data?.daysInMonthType?.value,
    },
    // client?.data?.isInterestRecalculationEnabled && {
    //   title: "Interest recalculation compounding on:",
    //   value:
    //     client?.data?.interestRecalculationData
    //       ?.interestRecalculationCompoundingType?.value,
    // },
    // client?.data?.isInterestRecalculationEnabled && {
    //   title: "Advance payments adjustment type:",
    //   value:
    //     client?.data?.interestRecalculationData?.rescheduleStrategyType?.value,
    // },
    // client?.data?.isInterestRecalculationEnabled && {
    //   title: "Frequency for recalculate Outstanding Principal:",
    //   value:
    //     client?.data?.interestRecalculationData?.calendarData?.humanReadable,
    // },
    // client?.data?.isInterestRecalculationEnabled &&
    //   client?.data?.interestRecalculationData
    //     ?.interestRecalculationCompoundingType?.id !== 0 && {
    //     title: "Frequency for compounding:",
    //     value:
    //       client?.data?.interestRecalculationData?.compoundingCalendarData
    //         ?.humanReadable,
    //   },
    client?.data?.isVariableInstallmentsAllowed && {
      title: "Variable Installments Allowed:",
      value: client?.data?.isVariableInstallmentsAllowed,
    },
    // client?.data?.isVariableInstallmentsAllowed && {
    //   title: "Variable Installments Allowed:",
    //   value: client?.data?.isVariableInstallmentsAllowed,
    // },
  ];

  const externalServiceDetails = [
    {
      title: "Loan Product Name:",
      value: vendorData?.loanProductName,
    },
    {
      title: "Vendor Name:",
      value: vendorData?.vendorDisplayName,
    },
    {
      title: "Client Name:",
      value: vendorData?.clientDisplayName,
    },

    {
      title: "Total Amount:",
      value: "₦" + formatNumberToCurrency(vendorData?.totalAmount),
    },
    {
      title: "Down Payment:",
      value: "₦" + formatNumberToCurrency(vendorData?.downPayment),
    },
    {
      title: "Service Fee:",
      value: "₦" + formatNumberToCurrency(vendorData?.serviceFee),
    },
    {
      title: "Created Date:",
      value: vendorData?.timestampCreatedDate
        ? format(
            new Date(vendorData?.timestampCreatedDate),
            dateLocaleFormat.DATE_FORMAT
          )
        : "",
    },
  ];

  const clientApproval = [
    {
      title: "Submitted",
      username: `${client?.data?.timeline?.submittedByUsername || ""}`,
      date: `${client?.data?.timeline?.submittedOnDateTimestamp || ""}`,
      status: "success",
    },
    {
      title: "Rejected",
      username: `${client?.data?.timeline?.rejectedByUsername || ""}`,
      date: `${client?.data?.timeline?.rejectedOnDateTimestamp || ""}`,
      status: "error",
    },
    {
      title: "Withdrawn",
      username: `${client?.data?.timeline?.withdrawnByUsername || ""}`,
      date: `${client?.data?.timeline?.withdrawnOnDateTimestamp || ""}`,
      status: "info",
    },
    {
      title: "Approve",
      username: `${client?.data?.timeline?.approvedByUsername || ""}`,
      date: `${client?.data?.timeline?.approvedOnDateTimestamp || ""}`,
      status: "success",
    },
    {
      title: " Sales Approval",
      username: `${client?.data?.timeline?.salesLeadByUsername || ""}`,
      date: `${client?.data?.timeline?.salesApprovedOnDatesaleTimestamp || ""}`,
      status: "success",
    },
    {
      title: "External Service",
      username: `${
        client?.data?.timeline?.externalDownPaymentByUsername || ""
      }`,
      date: `${client?.data?.timeline?.externalDownPaymentDateTimestamp || ""}`,
      status: "info",
    },
    {
      title: "Disburse",
      username: `${client?.data?.timeline?.disbursedByUsername || ""}`,
      date: `${client?.data?.timeline?.actualDisbursementDateTimestamp || ""}`,
      status: "success",
    },
    {
      title: "Closed",
      username: `${client?.data?.timeline?.closedByUsername || ""}`,
      date: `${client?.data?.timeline?.closedOnDateTimestamp || ""}`,
      status: "error",
    },
    {
      title: "Written Off",
      username: `${client?.data?.timeline?.writeOffByUsername || ""}`,
      date: `${client?.data?.timeline?.writeOffOnDateTimestamp || ""}`,
      status: "error",
    },
  ];

  return (
    <div className="pb-10  gap-2">
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" mr={5}>
              <b>Loan Details</b>
            </Typography>
          </div>

          <Box mt={2}>
            <Grid container>
              {accountDetails.map((data, i) => (
                <Grid item xs={6} md={3} mt={3}>
                  <Box>
                    <Typography variant="caption">{data?.title}</Typography>
                    <Typography variant="body1">{data?.value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      </Paper>

      {vendorData && (
        <Paper className="my-10 py-10 px-5 rounded-md">
          <LoadingContent
            error={vendorLoanQuery.isError}
            onReload={vendorLoanQuery.refetch}
            loading={vendorLoanQuery.isLoading}
          >
            <div>
              <div className="flex justify-between">
                <Typography variant="h5" mr={5}>
                  <b>External Service</b>
                </Typography>
              </div>

              <Box mt={2}>
                <Grid container>
                  <Grid item md={12}>
                    <Typography variant="caption">Narration:</Typography>
                    <Typography variant="body1" className="white">
                      {vendorData?.narration}
                    </Typography>
                  </Grid>

                  {externalServiceDetails.map((data, i) => (
                    <Grid item xs={6} md={4} mt={4}>
                      <Box>
                        <Typography variant="caption">{data?.title}</Typography>
                        <Typography variant="body1" className="white">
                          {data?.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </div>
          </LoadingContent>
        </Paper>
      )}

      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-center w-full">
            <Typography variant="h5" mb={5}>
              <b>Loan Timeline</b>
            </Typography>
          </div>

          <Timeline position="alternate">
            {clientApproval?.map((data, i) => (
              <div key={i}>
                {!!data?.username ? (
                  <TimelineItem>
                    <TimelineOppositeContent
                      sx={{ m: "auto 0" }}
                      align="right"
                      variant="body2"
                      color="text.secondary"
                    >
                      {data?.date &&
                        format(new Date(data?.date), "dd MMMM yyyy, p")}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineConnector />
                      <TimelineDot color={data?.date ? "success" : "error"} />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: "12px", px: 2 }}>
                      <Typography variant="h6" component="span">
                        {data?.title}
                      </Typography>
                      <Typography className="capitalize">
                        {data?.username || ""}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ""
                )}
              </div>
            ))}
          </Timeline>
        </div>
      </Paper>
    </div>
  );
}

export default CRMClientLoanAccountDetails;
