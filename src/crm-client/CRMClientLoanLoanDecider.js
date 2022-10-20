import { useMemo, useState } from "react";
import PropTypes from "prop-types";

import {
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  ButtonBase,
  Button,
  Icon,
  // IconButton,
  // Icon,
} from "@mui/material";
import { CurrencyEnum } from "common/Constants";
import { ReactComponent as ProductLoan } from "assets/svgs/product-loan.svg";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { format } from "date-fns";
import CRMClientLoanSendDraftLoanForApproval from "./CRMClientLoanSendDraftLoanForApproval";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function CRMClientLoanLoanDecider(props) {
  const { queryResult, clientLoanAnalysis } = props;

  const creditReportResult = queryResult?.data;
  const creditReport = useMemo(
    () =>
      creditReportResult?.reduce((acc, curr) => {
        acc = { ...acc, ...curr?.responseJson };
        return acc;
      }, {}),
    [creditReportResult]
  );

  const clientLoanAnalysisResult = clientLoanAnalysis?.data;

  console.log(`Client LoanAnalysis Result`,creditReport?.data)

  // Filter the the first central creditAgreementSummary Data
  const creditAgreementSummaryReport = useMemo(() => {
    return creditReport?.firstCentral?.item1?.filter((item) => {
      return !!item.creditAgreementSummary;
    });
  }, [creditReport?.firstCentral]);

  // Map to the creditAgreementSummary Object
  const creditAgreementSummaryTable = useMemo(() => {
    return creditAgreementSummaryReport?.map((item) => {
      return item.creditAgreementSummary;
    });
  }, [creditAgreementSummaryReport]);

  // Filter the the first central creditAgreementSummary Data
  const creditAccountSummaryReport = useMemo(() => {
    return creditReport?.firstCentral?.item1?.filter((item) => {
      return !!item.creditAccountSummary;
    });
  }, [creditReport?.firstCentral]);

  // Filter the the first central creditAgreementSummary Data
  const creditAccountSummaryReportScoring = useMemo(() => {
    return creditReport?.firstCentral?.item1?.filter((item) => {
      return !!item.scoring;
    });
  }, [creditReport?.firstCentral]);

  // Filter the the first central personalDetailsSummary Data
  const personalDetailsSummaryReport = useMemo(() => {
    return creditReport?.firstCentral?.item1?.filter((item) => {
      return !!item.personalDetailsSummary;
    });
  }, [creditReport?.firstCentral]);

  // console.log("Personal Details Summary Report",personalDetailsSummaryReport)

  const Payment_Total =
    creditReport?.creditRegistry?.accountSummaries?.[0]?.payment_Total || "0";

  const Balance_Total =
    creditReport?.creditRegistry?.accountSummaries?.[0]?.balance_Total || "0";

  const Count_Total =
    creditReport?.creditRegistry?.accountSummaries?.[0]?.count_Total || "0";

  const CreditLimit_Total =
    creditReport?.creditRegistry?.accountSummaries?.[0]?.creditLimit_Total ||
    "0";

  const Accounts = useMemo(
    () => creditReport?.creditRegistry?.accounts || [],
    []
  );

  const _decisionScore = useMemo(
    () => creditReport?.data?.status || "",
    [creditReport]
  );

  const score_cardResult = useMemo(
    () =>
      creditReport?.scorecard_results?.reduce((acc, curr) => {
        acc[curr.name] = curr.pass;
        return acc;
      }, {}),
    [creditReport]
  );

  const rules = creditReport?.data?.statementBreakdown?.breakdown;
  const rulesDecision = creditReport?.data?.status;

  // const affordabilityBreakDown = useMemo(
  //   () =>
  //     creditReport?.affordability?.breakdown?.reduce((acc, curr, i) => {
  //       acc = { ...acc, ...curr};
  //       return acc;
  //     }, {}),
  //   [creditReport]
  // );

  // console.log(affordabilityBreakDown);

  const behaviouralAnalysisData = {
    AccountSweep:
      creditReport?.bankStatementSummary?.behaviouralAnalysis?.accountSweep,
    GamblingRate:
      creditReport?.bankStatementSummary?.behaviouralAnalysis?.gamblingRate,
    InflowOutflowRate: `${creditReport?.bankStatementSummary?.behaviouralAnalysis?.inflowOutflowRate}`,
    LoanAmount:
      creditReport?.bankStatementSummary?.behaviouralAnalysis?.loanAmount,
    LoanRepayments:
      creditReport?.bankStatementSummary?.behaviouralAnalysis?.loanRepayments,
  };

  const cashFlowAnalysis = {
    AverageBalance:
      creditReport?.bankStatementSummary?.cashFlowAnalysis?.averageBalance,
    AverageCredits:
      creditReport?.bankStatementSummary?.cashFlowAnalysis?.averageCredits,
    AverageDebits:
      creditReport?.bankStatementSummary?.cashFlowAnalysis?.averageDebits,
    ClosingBalance:
      creditReport?.bankStatementSummary?.cashFlowAnalysis?.closingBalance,
    FirstDay: `${creditReport?.bankStatementSummary?.cashFlowAnalysis?.firstDay}`,
    LastDay: `${creditReport?.bankStatementSummary?.cashFlowAnalysis?.lastDay}`,
    NetAverageMonthlyEarnings:
      creditReport?.bankStatementSummary?.cashFlowAnalysis
        ?.netAverageMonthlyEarnings,
    TotalCreditTurnover:
      creditReport?.bankStatementSummary?.cashFlowAnalysis?.totalCreditTurnover,
    TotalDebitTurnover:
      creditReport?.bankStatementSummary?.cashFlowAnalysis?.totalDebitTurnover,
  };

  const incomeAnalysis = {
    ExpectedSalaryDay:
      creditReport?.bankStatementSummary?.incomeAnalysis?.expectedSalaryDay ||
      "NA",
    LastSalaryDate:
      creditReport?.bankStatementSummary?.incomeAnalysis?.lastSalaryDate ||
      "NA",
    SalaryEarner: `${creditReport?.bankStatementSummary?.incomeAnalysis?.salaryEarner}`,
  };

  const creditAgreementSummaryInstance = useTable({
    columns: creditAgreementSummaryColumns,
    data: creditAgreementSummaryTable,
    manualPagination: false,
  });

  const creditScoreTableInstance = useTable({
    columns: creditScoreColumns,
    data: Accounts,
    manualPagination: false,
  });

  const affordabilityAmounts = {
    ThreeMonths: creditReport?.affordabilityAmounts?.["4 months"],
    SixMonths: creditReport?.affordabilityAmounts?.["6 months"],
    NineMonths: creditReport?.affordabilityAmounts?.["9 months"],
    TwelveMonths: creditReport?.affordabilityAmounts?.["12 months"],
  };

  const statementAnalysisTableInstance = useTable({
    columns: rulesColumns,
    data: rules,
    manualPagination: false,
  });

  const PRODUCTS = [
    {
      name: `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(Payment_Total)}`,
      description: "Current Monthly Repayment Obligation",
      Icon: ProductLoan,
    },
    {
      name: `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(Balance_Total)}`,
      description: "Current Total Obligation",
      Icon: ProductLoan,
    },
    {
      name: `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(
        CreditLimit_Total
      )}`,
      description: "Credit Limit Total",
      Icon: ProductLoan,
    },
    {
      name: `${Count_Total}`,
      description: "Total Outstanding Loan",
      Icon: ProductLoan,
    },
  ];

  const FirstCentralData = [
    {
      name: `${CurrencyEnum.NG.symbol}${creditAccountSummaryReport?.[0]?.creditAccountSummary?.totalMonthlyInstalment}`,
      description: "Current Monthly Repayment Obligation",
      Icon: ProductLoan,
    },
    {
      name: `${CurrencyEnum.NG.symbol}${creditAccountSummaryReport?.[0]?.creditAccountSummary?.totalOutstandingdebt}`,
      description: "Current Total Obligation",
      Icon: ProductLoan,
    },
    {
      name: `${creditAccountSummaryReport?.[0]?.creditAccountSummary?.totalAccountarrear}`,
      description: "Total Outstanding Loan",
      Icon: ProductLoan,
    },
    {
      name: `${creditAccountSummaryReportScoring?.[0]?.scoring?.totalConsumerScore}`,
      description: "Total Consumer Score",
      Icon: ProductLoan,
    },
    {
      name: `${creditAccountSummaryReportScoring?.[0]?.scoring?.description}`,
      description: "Risk Description",
      Icon: ProductLoan,
    },
  ];

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function renderDeciderCards(props) {
    return PRODUCTS.map(({ name, description, Icon }) => (
      <Paper key={name} className="flex flex-col items-center p-4 ">
        <div className="mb-2">
          <Icon />
        </div>
        <Typography variant="h6" className="text-center font-bold">
          {name}
        </Typography>
        <Typography
          className="text-center"
          variant="body2"
          color="textSecondary"
        >
          {description}
        </Typography>
      </Paper>
    ));
  }

  function renderFirstCentralProps(props) {
    return FirstCentralData.map(({ name, description, Icon }) => (
      <Paper key={name} className="flex flex-col items-center p-4 ">
        <div className="mb-2">
          <Icon />
        </div>
        <Typography variant="h6" className="text-center font-bold">
          {name}
        </Typography>
        <Typography
          className="text-center"
          variant="body2"
          color="textSecondary"
        >
          {description}
        </Typography>
      </Paper>
    ));
  }
  // const onDownload = (attachment, fileName) => {
  //   const link = document.createElement("a");
  //   let fileType = "";
  //   fileType = `./${fileName === null ? "" : fileName}.pdf`;
  //   link.download = fileType;
  //   link.href = `data:application/pdf;base64,${attachment.slice(
  //     1,
  //     attachment.length - 1
  //   )}`;
  //   link.click();
  // };

  return (
    <div className="pb-10">
      <Paper className="p-4 w-full flex justify-center">
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "flex",
            minHeight: 224,
          }}
          className="w-full"
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs"
            sx={{ borderRight: 1, borderColor: "divider" }}
            className="w-1/4"
          >
            <Tab label="Statement Analysis" {...a11yProps(0)} />
            <Tab label="Loan Analysis" {...a11yProps(1)} />
            <Tab label="Credit Score (CRC)" {...a11yProps(2)} />
            <Tab label="Credit Score (First Central)" {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <div>
              <div className="grid gap-4 md:grid-cols-1 mb-4">
                {/* {[
                  {
                    label: "Behavioural Analysis",
                    values: [
                      {
                        label: "Account Sweep",
                        value: behaviouralAnalysisData?.AccountSweep,
                      },
                      {
                        label: "Gambling Percentage",
                        value: behaviouralAnalysisData?.GamblingRate,
                      },
                      {
                        label: "Inflow-Outflow Rate",
                        value: behaviouralAnalysisData?.InflowOutflowRate,
                      },
                      {
                        label: "Loan Amount",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          behaviouralAnalysisData?.LoanAmount
                        )}`,
                      },
                      {
                        label: "Loan Repayments",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          behaviouralAnalysisData?.LoanRepayments
                        )}`,
                      },
                    ],
                  },
                  {
                    label: "Cash Flow Analysis",
                    values: [
                      {
                        label: "Average Balance",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          cashFlowAnalysis?.AverageBalance
                        )}`,
                      },
                      {
                        label: "Average Credits",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          cashFlowAnalysis?.AverageCredits
                        )}`,
                      },
                      {
                        label: "Average Debits",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          cashFlowAnalysis?.AverageDebits
                        )}`,
                      },
                      {
                        label: "Closing Balance",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          cashFlowAnalysis?.AverageDebits
                        )}`,
                      },
                      {
                        label: "First Day",
                        value: parseDateToString(cashFlowAnalysis?.FirstDay),
                      },
                      {
                        label: "Last Day",
                        value: parseDateToString(cashFlowAnalysis?.LastDay),
                      },
                      {
                        label: "Net Average Monthly Earnings",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          cashFlowAnalysis?.NetAverageMonthlyEarnings
                        )}`,
                      },
                      {
                        label: "Total Credit Turnover",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          cashFlowAnalysis?.TotalCreditTurnover
                        )}`,
                      },
                      {
                        label: "Total Debit Turnover",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          cashFlowAnalysis?.TotalDebitTurnover
                        )}`,
                      },
                    ],
                  },
                  {
                    label: "Income Analysis",
                    values: [
                      {
                        label: "Expected Salary Day",
                        value: incomeAnalysis?.ExpectedSalaryDay,
                      },
                      {
                        label: "Last Salary Date",
                        value: incomeAnalysis?.LastSalaryDate,
                      },
                      {
                        label: "Salary Earner",
                        value: incomeAnalysis?.SalaryEarner,
                      },
                    ],
                  },
                  {
                    label: "Recommendation",
                    values: [
                      {
                        label: `Tenor: ${creditReport?.affordability?.breakdown[0].tenor} month`,
                        value: `${CurrencyEnum.NG.symbol}${creditReport?.affordability?.breakdown[0].value}`,
                      },
                      {
                        label: `Tenor: ${creditReport?.affordability?.breakdown[1].tenor} month`,
                        value: `${CurrencyEnum.NG.symbol}${creditReport?.affordability?.breakdown[1].value}`,
                      },
                      {
                        label: `Tenor: ${creditReport?.affordability?.breakdown[2].tenor} month`,
                        value: `${CurrencyEnum.NG.symbol}${creditReport?.affordability?.breakdown[2].value}`,
                      },
                      {
                        label: `Tenor: ${creditReport?.affordability?.breakdown[3].tenor} month`,
                        value: `${CurrencyEnum.NG.symbol}${creditReport?.affordability?.breakdown[3].value}`,
                      },
                    ],
                  },
                  {
                    label: "Score Card",
                    values: [
                      {
                        label: "Max Monthly Repayment",
                        value: score_cardResult?.maxMonthlyRepayment,
                      },
                      {
                        label: "Number Salary Payments",
                        value: score_cardResult?.numberSalaryPayments,
                      },
                      {
                        label: "Average Other Income Plus Average Salary",
                        value:
                          score_cardResult?.averageOtherIncomePlusAverageSalary,
                      },
                      {
                        label: "Account Sweep",
                        value: score_cardResult?.accountSweep,
                      },
                      {
                        label: "Gambling Rate",
                        value: score_cardResult?.gamblingRate,
                      },
                      {
                        label: "Date Difference",
                        value: score_cardResult?.dateDifference,
                      },
                    ],
                  },
                ].map((item) => {
                  return (
                    <Paper className="p-4">
                      <div className="flex flex-col items-center justify-center mb-2">
                        <ProductLoan />
                        <Typography
                          variant="h6"
                          className="text-center font-bold"
                        >
                          {item.label}
                        </Typography>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {item.values.map((term) => {
                          return (
                            <div>
                              <Typography variant="body2" color="textSecondary">
                                {term.label}
                              </Typography>
                              <Typography>{term.value}</Typography>
                            </div>
                          );
                        })}
                      </div>
                    </Paper>
                  );
                })} */}
                <Paper className="flex flex-col items-center p-4">
                  <div className="mb-2">
                    <ProductLoan />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-center font-bold">
                      Decision
                    </Typography>
                    <Typography
                      className="text-center"
                      variant="body2"
                      color="textSecondary"
                    >
                      {_decisionScore ? _decisionScore : rulesDecision}
                    </Typography>
                  </div>
                </Paper>
              </div>
              <div className="col-span-6">
                <DynamicTable
                  instance={statementAnalysisTableInstance}
                  renderPagination={() => null}
                  RowComponent={ButtonBase}
                  className="col-span-6"
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mb-4">
              {[
                {
                  name: `${clientLoanAnalysisResult?.averageNumberOfTenure}`,
                  description: "Average Number Of Tenure",
                  Icon: ProductLoan,
                },
                {
                  name: `${clientLoanAnalysisResult?.numberOfLatePayment}`,
                  description: "Number Of Late Payment",
                  Icon: ProductLoan,
                },
                {
                  name: `${clientLoanAnalysisResult?.totalActiveLoan}`,
                  description: "Total Active Loan",
                  Icon: ProductLoan,
                },
                {
                  name: `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(
                    clientLoanAnalysisResult?.totalLoanAmount
                  )}`,
                  description: "Total Outstanding Loan",
                  Icon: ProductLoan,
                },
                {
                  name: `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(
                    clientLoanAnalysisResult?.totalLoanPaid
                  )}`,
                  description: "Total Loan Paid",
                  Icon: ProductLoan,
                },
                {
                  name: `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(
                    clientLoanAnalysisResult?.totalOutstandingPayment
                  )}`,
                  description: "Total Outstanding Payment",
                  Icon: ProductLoan,
                },
              ].map((item, index) => {
                return (
                  <Paper key={index} className="flex flex-col items-center p-4">
                    <div className="mb-2">
                      <ProductLoan />
                    </div>
                    <Typography variant="h6" className="text-center font-bold">
                      {item.name}
                    </Typography>
                    <Typography
                      className="text-center"
                      variant="body2"
                      color="textSecondary"
                    >
                      {item.description}
                    </Typography>
                  </Paper>
                );
              })}
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4">
              {renderDeciderCards()}
              <div className="col-span-6">
                <DynamicTable
                  instance={creditScoreTableInstance}
                  renderPagination={() => null}
                  RowComponent={ButtonBase}
                  className="col-span-6"
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <div className="colspan-5 mb-4">
              {[
                {
                  label: "Personal Information Summary",
                  values: [
                    {
                      label: "Surname",
                      value: `${personalDetailsSummaryReport?.[0]?.personalDetailsSummary?.surname}`,
                    },
                    {
                      label: "Firstname",
                      value: `${personalDetailsSummaryReport?.[0]?.personalDetailsSummary?.firstName}`,
                    },
                    {
                      label: "Date of Birth",
                      value: `${personalDetailsSummaryReport?.[0]?.personalDetailsSummary?.birthDate}`,
                    },
                    {
                      label: "BVN",
                      value: `${personalDetailsSummaryReport?.[0]?.personalDetailsSummary?.bankVerificationNo}`,
                    },
                    {
                      label: "Mobile Number",
                      value: `${personalDetailsSummaryReport?.[0]?.personalDetailsSummary?.homeTelephoneNo}`,
                    },
                    {
                      label: "Email",
                      value: `${personalDetailsSummaryReport?.[0]?.personalDetailsSummary?.emailAddress}`,
                    },
                    {
                      label: "Gender",
                      value: `${personalDetailsSummaryReport?.[0]?.personalDetailsSummary?.gender}`,
                    },
                  ],
                },
              ].map((item) => {
                return (
                  <Paper className="p-4">
                    <div className="flex flex-col items-center justify-center mb-2">
                      <ProductLoan />
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        {item.label}
                      </Typography>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-4">
                      {item.values.map((term) => {
                        return (
                          <div>
                            <Typography variant="body2" color="textSecondary">
                              {term.label}
                            </Typography>
                            <Typography>{term.value}</Typography>
                          </div>
                        );
                      })}
                    </div>
                  </Paper>
                );
              })}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4">
              {
                // firstCentralData ? (
                //   <>
                //     {/* Download button here */}
                //     <Button
                //       size="small"
                //       onClick={() => {
                //         const attachment = firstCentralData;
                //         const fileName = "FirstCentralCreditReport";
                //         onDownload(attachment, fileName);
                //       }}
                //     >
                //       <Icon>download</Icon>Download First Central Credit Score
                //     </Button>
                //   </>
                // ) : (
                //   <>No Data</>
                // )
              }
              {renderFirstCentralProps()}
              <div className="col-span-6">
                <DynamicTable
                  instance={creditAgreementSummaryInstance}
                  renderPagination={() => null}
                  RowComponent={ButtonBase}
                  className="col-span-6"
                />
              </div>
            </div>
          </TabPanel>
        </Box>
      </Paper>
    </div>
  );
}

export default CRMClientLoanLoanDecider;

const statementAnalysisColumns = [
  {
    Header: "Amount",
    accessor: (row) =>
      `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(row?.amount)}`,
  },
  {
    Header: "Description",
    accessor: "description",
  },
];

const rulesColumns = [
  { Header: "Condition", accessor: "condition" },
  { Header: "Name", accessor: "name" },
  { Header: "Status", accessor: "status" },
];

const creditScoreColumns = [
  {
    Header: "Creditor Name",
    accessor: "creditor_Name",
  },
  {
    Header: "Date Opened",
    accessor: (row) => format(new Date(row?.date_Opened), "dd MMMM yyyy"),
  },
  {
    Header: "Date First Reported",
    accessor: (row) =>
      format(new Date(row?.date_First_Reported), "dd MMMM yyyy"),
  },
  {
    Header: "Credit Limit",
    accessor: (row) =>
      `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(row?.credit_Limit)}`,
  },
  {
    Header: "Account Status",
    accessor: "Account_Status",
  },
  {
    Header: "Current Balance",
    accessor: (row) =>
      `${CurrencyEnum.NG.symbol}${formatNumberToCurrency(row?.balance)}`,
  },
  {
    Header: "Term",
    accessor: "term",
  },
  {
    Header: "Term Frequency",
    accessor: "term_Frequency",
  },
  {
    Header: "Purpose",
    accessor: "purpose",
  },
  {
    Header: "Legal Status",
    accessor: "legal_Status",
  },
];

const creditAgreementSummaryColumns = [
  { Header: "Account Number", accessor: "accountNo" },
  { Header: "Account Status", accessor: "accountStatus" },
  { Header: "Amount Overdue", accessor: "amountOverdue" },
  { Header: "Closed Date", accessor: "closedDate" },
  { Header: "Current Balance Ammount", accessor: "currentBalanceAmt" },
  { Header: "Date Account Opened", accessor: "dateAccountOpened" },
  { Header: "Indicator Description", accessor: "indicatorDescription" },
  { Header: "Installment Amount", accessor: "instalmentAmount" },
  { Header: "Last Updated Date", accessor: "lastUpdatedDate" },
  { Header: "Loan Duration", accessor: "loanDuration" },
  { Header: "Opening Balance Ammount", accessor: "openingBalanceAmt" },
  { Header: "Performance Status", accessor: "performanceStatus" },
  { Header: "Repayment Frequency", accessor: "repaymentFrequency" },
  { Header: "Subscriber Name", accessor: "subscriberName" },
];
