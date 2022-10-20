import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactComponent as EditSvg } from "assets/svgs/edit-icon.svg";
import DynamicTable from "common/DynamicTable";
import { useTable } from "react-table";

function ClientXLeadLoanAddEditPreview({ formik, data, setStep }) {
  const formikValue = formik?.values;
  const previewConfig = [
    {
      title: "Details",
      step: 0,
      data: [
        {
          title: "Product Name",
          value:
            data?.productOptions?.find((e) => e.id === formikValue?.productId)
              ?.name || "",
        },
        {
          title: "Submitted On",
          value: formikValue?.submittedOnDate || "",
        },
        // {
        //   title: "Submitted On",
        //   value: formikValue?.approvedOnDate || "",
        // },
        {
          title: "Loan Officer",
          value:
            data?.loanOfficerOptions?.find(
              (e) => e.id === formikValue?.loanOfficerId
            )?.displayName || "",
        },
        {
          title: "Loan Purpose",
          value:
            data?.loanPurposeOptions?.find(
              (e) => e.id === formikValue?.loanPurposeId
            )?.name || "",
        },
        {
          title: "Fund",
          value:
            data?.fundOptions?.find((e) => e.id === formikValue?.fundId)
              ?.name || "",
        },
        {
          title: "Link Savings",
          value:
            data?.accountLinkingOptions?.find(
              (e) => e.id === formikValue?.linkAccountId
            )?.productName || "",
        },
      ],
    },

    {
      title: "Terms",
      step: 1,
      data: [
        {
          title: "Principal",
          value: formikValue?.principal || "",
        },
        {
          title: "Netpay",
          value: formikValue?.netpay || "",
        },
        {
          title: "First Repayment Date",
          value: formikValue?.repaymentsStartingFromDate || "",
        },
        {
          title: "Loan Term",
          value: `${formikValue?.loanTermFrequency || ""} ${
            data?.termFrequencyTypeOptions?.find(
              (e) => e.id === formikValue?.loanTermFrequencyType
            )?.value || ""
          }`,
        },
        {
          title: "Nominal Interest Rate",
          value: formikValue?.interestRatePerPeriod || "",
        },
        formikValue?.loanIdToClose
          ? {
              title: "Topup Loan",
              value:
                `${
                  data?.clientActiveLoanOptions?.find(
                    (e) => e.id === formikValue?.loanIdToClose
                  )?.accountNo
                } (${
                  data?.clientActiveLoanOptions?.find(
                    (e) => e.id === formikValue?.loanIdToClose
                  )?.productName
                })
              ` || "",
            }
          : {},
      ],
    },

    // {
    //   title: "Repaid Every",
    //   step: 1,
    //   data: [
    //     {
    //       title: "Repaid Every",
    //       value: `${formikValue?.repaymentEvery || ""} ${
    //         data?.repaymentFrequencyTypeOptions?.find(
    //           (e) => e.id === formikValue?.repaymentFrequencyType
    //         )?.value || ""
    //       } of ${
    //         data?.repaymentFrequencyNthDayTypeOptions?.find(
    //           (e) => e.id === formikValue?.repaymentFrequencyNthDayType
    //         )?.value || ""
    //       } ${
    //         data?.repaymentFrequencyDaysOfWeekTypeOptions?.find(
    //           (e) => e.id === formikValue?.repaymentFrequencyDayOfWeekType
    //         )?.value || ""
    //       }`,
    //     },

    //     {
    //       title: "Interest Charged From",
    //       value: formikValue?.interestChargedFromDate || "",
    //     },
    //     {
    //       title: "Nominal Interest Rate",
    //       value: formikValue?.interestRatePerPeriod || "",
    //     },

    //     {
    //       title: "Interest Method",
    //       value:
    //         data?.interestTypeOptions?.find(
    //           (e) => e.id === formikValue?.interestType
    //         )?.value || "",
    //     },
    //     {
    //       title: "Amortization Type",
    //       value:
    //         data?.amortizationTypeOptions?.find(
    //           (e) => e.id === formikValue?.amortizationType
    //         )?.value || "",
    //     },
    //   ],
    // },

    // {
    //   title: "Interest Calculations",
    //   step: 1,
    //   data: [
    //     {
    //       title: "Interest Calculation Period",
    //       value:
    //         data?.interestCalculationPeriodTypeOptions?.find(
    //           (e) => e.id === formikValue?.interestCalculationPeriodType
    //         )?.value || "",
    //     },

    //     {
    //       title: "Calculate interest for the exact days in partial period",
    //       value: formikValue?.allowPartialPeriodInterestCalcualtion || "",
    //     },
    //     {
    //       title: "Arrears Tolerance",
    //       value: formikValue?.inArrearsTolerance || "",
    //     },
    //     {
    //       title: "Interest Free Period",
    //       value: formikValue?.graceOnInterestCharged || "",
    //     },
    //     {
    //       title: "Repayment Strategy",
    //       value:
    //         data?.transactionProcessingStrategyOptions?.find(
    //           (e) => e.id === formikValue?.transactionProcessingStrategyId
    //         )?.value || "",
    //     },
    //     {
    //       title: "Maximum Allowed Outstanding Balance",
    //       value: formikValue?.maxOutstandingLoanBalance || "",
    //     },
    //   ],
    // },

    // {
    //   title: "Charges",
    //   step: 5,
    //   table: true,
    //   data: formikValue?.charges || [],
    //   dataColumns: [
    //     {
    //       Header: "Name",
    //       accessor: (row) =>
    //         data?.chargeOptions?.find((el) => el.id === row?.chargeId)?.name,
    //     },
    //     {
    //       Header: "Type",
    //       accessor: (row) =>
    //         data?.chargeOptions?.find((el) => el.id === row?.chargeId)
    //           ?.chargeCalculationType?.value,
    //     },
    //     {
    //       Header: "Amount(N)",
    //       accessor: (row) => FormatToCurrency(row?.amount),
    //     },
    //     {
    //       Header: "Collected On",
    //       accessor: (row) =>
    //         data?.chargeOptions?.find((el) => el.id === row?.chargeId)
    //           ?.chargeTimeType?.value,
    //     },
    //     {
    //       Header: "Date",
    //       accessor: (row, i) => row?.dueDate,
    //     },
    //   ],
    // },
  ];

  return (
    <div className="pb-10">
      {previewConfig.map((preview, i) => (
        <Paper key={i} className="my-10 py-10 px-5 rounded-md">
          <div>
            <div className="flex justify-between">
              <Typography variant="h5" mr={5}>
                <b>{preview?.title}</b>
              </Typography>
              <Button
                onClick={() => setStep(parseInt(`${preview?.step}`))}
                variant="text"
                endIcon={<EditSvg />}
              />
            </div>
          </div>

          {preview?.table && (
            <div>
              {preview?.data && (
                <CRMClientLoanAddEditPreviewTable
                  columns={preview?.dataColumns}
                  data={preview?.data}
                />
              )}
            </div>
          )}

          <Box>
            <Grid container>
              {!preview?.table &&
                preview?.data.map((data, i) => (
                  <Grid item xs={6} md={3} mt={3}>
                    <Box>
                      <Typography variant="caption">{data?.title}</Typography>
                      <Typography variant="body1">{data?.value}</Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Paper>
      ))}
    </div>
  );
}

function CRMClientLoanAddEditPreviewTable({ columns, data }) {
  const tableInstance = useTable({
    columns,
    data,
    manualPagination: false,
    hideRowCounter: true,
  });

  return (
    <DynamicTable instance={tableInstance} renderPagination={() => null} />
  );
}

export default ClientXLeadLoanAddEditPreview;
