import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Step,
  StepButton,
  StepContent,
  Stepper,
  useMediaQuery,
  Typography,
} from "@mui/material";
import BackButton from "common/BackButton";
import {
  MediaQueryBreakpointEnum,
  DateConfig,
  RouteEnum,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import useStep from "hooks/useStep";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import RecurringDepositProductCreateEditDetailsXCurrency from "./RecurringDepositProductCreateEditDetailsXCurrency";
import RecurringDepositProductCreateEditTerms from "./RecurringDepositProductCreateEditTerms";
import RecurringDepositProductCreateEditSettings from "./RecurringDepositProductCreateEditSettings";
import RecurringDepositProductCreateEditInterestRate from "./RecurringDepositProductCreateEditInterestRate";
import RecurringDepositProductCreateEditCharges from "./RecurringDepositProductCreateEditCharges";
import RecurringDepositProductCreateEditAccounting from "./RecurringDepositProductCreateEditAccounting";
import RecurringDepositProductCreateEditPreview from "./RecurringDepositProductCreateEditPreview";
import { nxRecurringDepositProductApi } from "./RecurringDepositProductStoreQuerySlice";
import * as dfn from "date-fns";
import { formatCurrencyToNumber, getTruthyValue } from "common/Utils";
import useDataRef from "hooks/useDataRef";

function RecurringDepositProductCreateEdit(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);

  const isEdit = !!id;

  const { step, nextStep, prevStep, setStep } = useStep(isEdit ? 6 : 0);

  const recurringDepositProductTemplateQueryResult =
    nxRecurringDepositProductApi.useGetRecurringDepositProductTemplateQuery();

  const recurringDepositProductTemplate =
    recurringDepositProductTemplateQueryResult.data;

  const recurringDepositProductQueryResult =
    nxRecurringDepositProductApi.useGetRecurringDepositProductQuery(id, {
      skip: !id,
    });

  const recurringDeposit = recurringDepositProductQueryResult?.data;

  const [createRecurringDepositProductMutation] =
    nxRecurringDepositProductApi.useCreateRecurringDepositProductMutation();

  const [updateRecurringDepositProductMutation] =
    nxRecurringDepositProductApi.useUpdateRecurringDepositProductMutation();

  const formik = useFormik({
    initialValues: {
      id,
      locale: DateConfig.LOCALE,

      // Details & Currency
      name: "",
      shortName: "",
      description: "",
      currencyCode: "",
      digitsAfterDecimal: 2,
      inMultiplesOf: 100,

      // Terms
      minDepositAmount: 0,
      depositAmount: 0,
      maxDepositAmount: 0,
      interestCompoundingPeriodType: "",
      interestPostingPeriodType: "",
      interestCalculationType: "",
      interestCalculationDaysInYearType: "",

      // Settings
      isMandatoryDeposit: false,
      adjustAdvanceTowardsFuturePayments: false,
      allowWithdrawal: false,
      lockinPeriodFrequency: "",
      lockinPeriodFrequencyType: "",
      minDepositTerm: "",
      minDepositTermTypeId: "",
      inMultiplesOfDepositTerm: "",
      inMultiplesOfDepositTermTypeId: "",
      maxDepositTerm: "",
      maxDepositTermTypeId: "",
      preClosurePenalApplicable: false,
      preClosurePenalInterest: "",
      preClosurePenalInterestOnTypeId: "",
      withHoldTax: false,
      taxGroupId: "",

      // Interest Rate
      charts: [
        {
          fromDate: new Date(),
          endDate: new Date(),
          isPrimaryGroupingByAmount: false,
          dateFormat: DateConfig.FORMAT,
          locale: DateConfig.LOCALE,
          chartSlabs: [
            {
              periodType: "",
              fromPeriod: 1,
              toPeriod: "",
              amountRangeFrom: "",
              amountRangeTo: "",
              annualInterestRate: "",
              description: "",
              incentives: [],
            },
          ],
        },
      ],

      //charges
      charges: [],

      // Accounting
      accountingRule: "",
      savingsReferenceAccountId: "",
      savingsControlAccountId: "",
      transfersInSuspenseAccountId: "",
      interestOnSavingsAccountId: "",
      incomeFromFeeAccountId: "",
      incomeFromPenaltyAccountId: "",
      advancedAccountingRules: false,
      paymentChannelToFundSourceMappings: [],
      feeToIncomeAccountMappings: [],
      penaltyToIncomeAccountMappings: [],
    },
    validationSchema: yup.object({
      // Details & Currency
      name: yup.string().label("Product Name").required(),
      shortName: yup.string().label("Short Name").required(),
      description: yup.string().label("Description").required(),
      currencyCode: yup.string().label("Currency Code").required(),
      digitsAfterDecimal: yup.string().label("Decimal Places").required(),
      inMultiplesOf: yup.string().label("Currency In Multiples Of").required(),
    }),
    onSubmit: async (_values, helper) => {
      const values = { ..._values };
      delete values.advancedAccountingRules;

      if (!values.preClosurePenalApplicable) {
        delete values.preClosurePenalInterest;
        delete values.preClosurePenalInterestOnTypeId;
      }

      if (!values.withHoldTax) {
        delete values.taxGroupId;
      }

      values.charts = values.charts.map((chart) => {
        return {
          ...chart,
          fromDate: chart.fromDate
            ? dfn.format(chart.fromDate, chart.dateFormat)
            : chart.fromDate,
          endDate: chart.endDate
            ? dfn.format(chart.endDate, chart.dateFormat)
            : chart.endDate,
          chartSlabs:
            chart?.chartSlabs?.map((chartSlab) => {
              if (!chart.isPrimaryGroupingByAmount) {
                delete chartSlab.amountRangeFrom;
                delete chartSlab.amountRangeTo;
              } else {
                chartSlab.amountRangeFrom = formatCurrencyToNumber(
                  chartSlab.amountRangeFrom
                );
                chartSlab.amountRangeTo = formatCurrencyToNumber(
                  chartSlab.amountRangeTo
                );
              }
              return {
                ...chartSlab,
                incentives:
                  chartSlab.incentives?.map((incentive) => {
                    return {
                      ...incentive,
                      amount: formatCurrencyToNumber(incentive.amount),
                    };
                  }) || [],
              };
            }) || [],
        };
      });

      const func = isEdit
        ? updateRecurringDepositProductMutation
        : createRecurringDepositProductMutation;
      try {
        const data = await func({
          ...values,
        }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage || "Product Successfully Added",
          { variant: "success" }
        );
        navigate(RouteEnum.RECURRING_DEPOSIT_PRODUCT);
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.length ? (
            <div>
              {error?.data?.errors?.map((error, key) => (
                <Typography key={key}>{error?.defaultUserMessage}</Typography>
              ))}
            </div>
          ) : (
            "Failed to add Product"
          ),
          { variant: "error" }
        );
      }
      helper.setSubmitting(false);
    },
  });

  console.log(formik.errors);

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    const values = dataRef.current.formik.values;
    dataRef.current.formik.setValues({
      ...values,
      // id,
      locale:
        recurringDeposit?.locale ||
        recurringDepositProductTemplate?.locale ||
        values?.locale,

      // Details & Currency
      name:
        recurringDeposit?.name ||
        recurringDepositProductTemplate?.name ||
        values?.name,
      shortName:
        recurringDeposit?.shortName ||
        recurringDepositProductTemplate?.shortName ||
        values?.shortName,
      description:
        recurringDeposit?.description ||
        recurringDepositProductTemplate?.description ||
        values?.description,
      currencyCode:
        recurringDeposit?.currency?.code ||
        recurringDepositProductTemplate?.currency?.code ||
        values?.currencyCode,
      digitsAfterDecimal:
        recurringDeposit?.digitsAfterDecimal ||
        // recurringDepositProductTemplate?.digitsAfterDecimal ||
        values?.digitsAfterDecimal,
      inMultiplesOf:
        recurringDeposit?.inMultiplesOf ||
        // recurringDepositProductTemplate?.inMultiplesOf ||
        values?.inMultiplesOf,

      // Terms
      minDepositAmount:
        recurringDeposit?.minDepositAmount ||
        recurringDepositProductTemplate?.minDepositAmount ||
        values?.minDepositAmount,
      depositAmount:
        recurringDeposit?.depositAmount ||
        recurringDepositProductTemplate?.depositAmount ||
        values?.depositAmount,
      maxDepositAmount:
        recurringDeposit?.maxDepositAmount ||
        recurringDepositProductTemplate?.maxDepositAmount ||
        values?.maxDepositAmount,
      interestCompoundingPeriodType:
        recurringDeposit?.interestCompoundingPeriodType?.id ||
        recurringDepositProductTemplate?.interestCompoundingPeriodType?.id ||
        values?.interestCompoundingPeriodType,
      interestPostingPeriodType:
        recurringDeposit?.interestPostingPeriodType?.id ||
        recurringDepositProductTemplate?.interestPostingPeriodType?.id ||
        values?.interestPostingPeriodType,
      interestCalculationType:
        recurringDeposit?.interestCalculationType?.id ||
        recurringDepositProductTemplate?.interestCalculationType?.id ||
        values?.interestCalculationType,
      interestCalculationDaysInYearType:
        recurringDeposit?.interestCalculationDaysInYearType?.id ||
        recurringDepositProductTemplate?.interestCalculationDaysInYearType
          ?.id ||
        values?.interestCalculationDaysInYearType,

      // Settings
      isMandatoryDeposit:
        recurringDeposit?.isMandatoryDeposit ||
        recurringDepositProductTemplate?.isMandatoryDeposit ||
        values?.isMandatoryDeposit,
      adjustAdvanceTowardsFuturePayments:
        recurringDeposit?.adjustAdvanceTowardsFuturePayments ||
        recurringDepositProductTemplate?.adjustAdvanceTowardsFuturePayments ||
        values?.adjustAdvanceTowardsFuturePayments,
      allowWithdrawal:
        recurringDeposit?.allowWithdrawal ||
        recurringDepositProductTemplate?.allowWithdrawal ||
        values?.allowWithdrawal,
      lockinPeriodFrequency:
        recurringDeposit?.lockinPeriodFrequency ||
        recurringDepositProductTemplate?.lockinPeriodFrequency ||
        values?.lockinPeriodFrequency,
      lockinPeriodFrequencyType: getTruthyValue(
        [
          recurringDeposit?.lockinPeriodFrequencyType?.id,
          recurringDepositProductTemplate?.lockinPeriodFrequencyType?.id,
          values?.lockinPeriodFrequencyType,
        ],
        { truthyValues: [0, ""] }
      ),
      minDepositTerm:
        recurringDeposit?.minDepositTerm ||
        recurringDepositProductTemplate?.minDepositTerm ||
        values?.minDepositTerm,
      minDepositTermTypeId: getTruthyValue(
        [
          recurringDeposit?.minDepositTermType?.id,
          recurringDepositProductTemplate?.minDepositTermType?.id,
          values?.minDepositTermTypeId,
        ],
        { truthyValues: [0, ""] }
      ),
      inMultiplesOfDepositTerm:
        recurringDeposit?.inMultiplesOfDepositTerm ||
        recurringDepositProductTemplate?.inMultiplesOfDepositTerm ||
        values?.inMultiplesOfDepositTerm,
      inMultiplesOfDepositTermTypeId: getTruthyValue(
        [
          recurringDeposit?.inMultiplesOfDepositTermType?.id,
          recurringDepositProductTemplate?.inMultiplesOfDepositTermType?.id,
          values?.inMultiplesOfDepositTermTypeId,
        ],
        { truthyValues: [0, ""] }
      ),
      maxDepositTerm:
        recurringDeposit?.maxDepositTerm ||
        recurringDepositProductTemplate?.maxDepositTerm ||
        values?.maxDepositTerm,
      maxDepositTermTypeId: getTruthyValue(
        [
          recurringDeposit?.maxDepositTermType?.id,
          recurringDepositProductTemplate?.maxDepositTermType?.id,
          values?.maxDepositTermTypeId,
        ],
        { truthyValues: [0, ""] }
      ),
      preClosurePenalApplicable:
        recurringDeposit?.preClosurePenalApplicable ||
        recurringDepositProductTemplate?.preClosurePenalApplicable ||
        values?.preClosurePenalApplicable,
      preClosurePenalInterest: getTruthyValue(
        [
          recurringDeposit?.preClosurePenalInterest,
          recurringDepositProductTemplate?.preClosurePenalInterest,
          values?.preClosurePenalInterest,
        ],
        { truthyValues: [0, ""] }
      ),
      preClosurePenalInterestOnTypeId:
        recurringDeposit?.preClosurePenalInterestOnType?.id ||
        recurringDepositProductTemplate?.preClosurePenalInterestOnType?.id ||
        values?.preClosurePenalInterestOnTypeId,
      withHoldTax:
        recurringDeposit?.withHoldTax ||
        recurringDepositProductTemplate?.withHoldTax ||
        values?.withHoldTax,
      taxGroupId:
        recurringDeposit?.taxGroup?.id ||
        recurringDepositProductTemplate?.taxGroup?.id ||
        values?.taxGroupId,

      // Interest Rate
      charts: recurringDeposit?.interestRateCharts?.length
        ? recurringDeposit?.interestRateCharts?.map((chart) => {
            return {
              id: chart?.id,
              fromDate: chart?.fromDate?.length
                ? new Date(
                    chart.fromDate[0],
                    chart.fromDate[1] - 1,
                    chart.fromDate[2]
                  )
                : null,
              endDate: chart?.endDate?.length
                ? new Date(
                    chart.endDate[0],
                    chart.endDate[1] - 1,
                    chart.endDate[2]
                  )
                : null,
              isPrimaryGroupingByAmount: chart.isPrimaryGroupingByAmount,
              dateFormat: chart.dateFormat || DateConfig.FORMAT,
              locale: chart.locale || DateConfig.LOCALE,
              chartSlabs:
                chart?.chartSlabs?.map((chartSlab) => {
                  return {
                    id: chartSlab?.id,
                    periodType: chartSlab.periodType?.id,
                    fromPeriod: chartSlab.fromPeriod,
                    toPeriod: chartSlab.toPeriod,
                    amountRangeFrom: chartSlab.amountRangeFrom,
                    amountRangeTo: chartSlab.amountRangeTo,
                    annualInterestRate: chartSlab.annualInterestRate,
                    description: chartSlab.description,
                    incentives:
                      chartSlab.incentives?.map((incentive) => {
                        return {
                          id: incentive?.id,
                          entityType: incentive.entityType?.id || 2,
                          attributeName: incentive.attributeName?.id || "",
                          conditionType: incentive.conditionType?.id || "",
                          attributeValue: incentive.attributeValue || "",
                          incentiveType: incentive.incentiveType?.id || "",
                          amount: incentive.amount,
                        };
                      }) || [],
                  };
                }) || [],
            };
          })
        : recurringDepositProductTemplate?.charts || values?.charts,

      // Charges
      charges:
        recurringDeposit?.charges?.map((charge) => ({ id: charge.id })) ||
        recurringDepositProductTemplate?.charges ||
        values?.charges,

      // Accounting
      accountingRule:
        recurringDeposit?.accountingRule?.id ||
        recurringDepositProductTemplate?.accountingRule?.id ||
        values?.accountingRule,
      savingsReferenceAccountId:
        recurringDeposit?.accountingMappings?.savingsReferenceAccount?.id ||
        recurringDepositProductTemplate?.accountingMappings
          ?.savingsReferenceAccount?.id ||
        values?.savingsReferenceAccountId,
      savingsControlAccountId:
        recurringDeposit?.accountingMappings?.savingsControlAccount?.id ||
        recurringDepositProductTemplate?.accountingMappings
          ?.savingsControlAccount?.id ||
        values?.savingsControlAccountId,
      transfersInSuspenseAccountId:
        recurringDeposit?.accountingMappings?.transfersInSuspenseAccount?.id ||
        recurringDepositProductTemplate?.accountingMappings
          ?.transfersInSuspenseAccount?.id ||
        values?.transfersInSuspenseAccountId,
      interestOnSavingsAccountId:
        recurringDeposit?.accountingMappings?.interestOnSavingsAccount?.id ||
        recurringDepositProductTemplate?.accountingMappings
          ?.interestOnSavingsAccount?.id ||
        values?.interestOnSavingsAccountId,
      incomeFromFeeAccountId:
        recurringDeposit?.accountingMappings?.incomeFromFeeAccount?.id ||
        recurringDepositProductTemplate?.accountingMappings
          ?.incomeFromFeeAccount?.id ||
        values?.incomeFromFeeAccountId,
      incomeFromPenaltyAccountId:
        recurringDeposit?.accountingMappings?.incomeFromPenaltyAccount?.id ||
        recurringDepositProductTemplate?.accountingMappings
          ?.incomeFromPenaltyAccount?.id ||
        values?.incomeFromPenaltyAccountId,
      advancedAccountingRules:
        !!recurringDeposit?.paymentChannelToFundSourceMappings?.length ||
        !!recurringDeposit?.feeToIncomeAccountMappings?.length ||
        !!recurringDeposit?.penaltyToIncomeAccountMappings?.length,
      paymentChannelToFundSourceMappings:
        recurringDeposit?.paymentChannelToFundSourceMappings?.map((item) => ({
          paymentTypeId: item?.paymentType?.id,
          fundSourceAccountId: item?.fundSourceAccount?.id,
        })) ||
        recurringDepositProductTemplate?.paymentChannelToFundSourceMappings ||
        values?.paymentChannelToFundSourceMappings,
      feeToIncomeAccountMappings:
        recurringDeposit?.feeToIncomeAccountMappings?.map((item) => ({
          chargeId: item?.charge?.id,
          incomeAccountId: item?.incomeAccount?.id,
        })) ||
        recurringDepositProductTemplate?.feeToIncomeAccountMappings ||
        values?.feeToIncomeAccountMappings,
      penaltyToIncomeAccountMappings:
        recurringDeposit?.penaltyToIncomeAccountMappings?.map((item) => ({
          chargeId: item?.charge?.id,
          incomeAccountId: item?.incomeAccount?.id,
        })) ||
        recurringDepositProductTemplate?.penaltyToIncomeAccountMappings ||
        values?.penaltyToIncomeAccountMappings,
    });
  }, [dataRef, recurringDeposit, recurringDepositProductTemplate]);

  const contentProps = { formik, recurringDepositProductTemplate, setStep };

  const contents = [
    {
      title: "Details & Currency",
      body: (
        <RecurringDepositProductCreateEditDetailsXCurrency {...contentProps} />
      ),
    },
    {
      title: "Terms",
      body: <RecurringDepositProductCreateEditTerms {...contentProps} />,
    },
    {
      title: "Settings",
      body: <RecurringDepositProductCreateEditSettings {...contentProps} />,
    },
    {
      title: "Interest Rate Chart",
      body: <RecurringDepositProductCreateEditInterestRate {...contentProps} />,
    },
    {
      title: "Charges",
      body: <RecurringDepositProductCreateEditCharges {...contentProps} />,
    },
    {
      title: "Accounting",
      body: <RecurringDepositProductCreateEditAccounting {...contentProps} />,
    },
    {
      title: "Preview",
      body: <RecurringDepositProductCreateEditPreview {...contentProps} />,
    },
  ];
  const content = contents[step];

  // const isFirstStep = step === 0;
  // const isSecondStep = step === 1;
  const isLastStep = step === contents.length - 1;
  const isSecondLastStep = step === contents.length - 2;

  const footer = (
    <div className="flex justify-end items-center gap-4 py-8">
      <Button variant="outlined" disabled={!step} onClick={prevStep}>
        Previous
      </Button>

      <LoadingButton
        disabled={formik.isSubmitting || (isLastStep && !formik.isValid)}
        loading={formik.isSubmitting}
        loadingPosition="end"
        endIcon={<></>}
        onClick={(e) => {
          if (isLastStep) {
            formik.handleSubmit(e);
          } else {
            nextStep();
          }
        }}
      >
        {isLastStep
          ? isEdit
            ? "Update"
            : "Complete"
          : isSecondLastStep
          ? "Preview"
          : "Next"}
      </LoadingButton>
    </div>
  );

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton variant="text" />}
        title={
          isLastStep
            ? content.title
            : isEdit
            ? "Update Recurring Deposit Product"
            : "Create Recurring Deposit Product"
        }
      />
      <Stepper
        activeStep={step}
        alternativeLabel={ismd}
        orientation={ismd ? "horizontal" : "vertical"}
        className="mb-4"
      >
        {contents.map((content, index) => (
          <Step key={index} completed={step > index}>
            <StepButton onClick={() => setStep(index)}>
              {content.title}
            </StepButton>
            {!ismd && (
              <StepContent>
                {content.body}
                {footer}
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
      {ismd && content.body}
      {ismd && footer}
    </>
  );
}

export default RecurringDepositProductCreateEdit;
