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
import FixedDepositProductCreateEditDetailsXCurrency from "./FixedDepositProductCreateEditDetailsXCurrency";
import FixedDepositProductCreateEditTerms from "./FixedDepositProductCreateEditTerms";
import FixedDepositProductCreateEditSettings from "./FixedDepositProductCreateEditSettings";
import FixedDepositProductCreateEditInterestRate from "./FixedDepositProductCreateEditInterestRate";
import FixedDepositProductCreateEditCharges from "./FixedDepositProductCreateEditCharges";
import FixedDepositProductCreateEditAccounting from "./FixedDepositProductCreateEditAccounting";
import FixedDepositProductCreateEditPreview from "./FixedDepositProductCreateEditPreview";
import { nxFixedDepositProductApi } from "./FixedDepositProductStoreQuerySlice";
import * as dfn from "date-fns";
import { formatCurrencyToNumber, getTruthyValue } from "common/Utils";
import useDataRef from "hooks/useDataRef";

function FixedDepositProductCreateEdit(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);

  const isEdit = !!id;

  const { step, nextStep, prevStep, setStep } = useStep(isEdit ? 6 : 0);

  const fixedDepositProductTemplateQueryResult =
    nxFixedDepositProductApi.useGetFixedDepositProductTemplateQuery();

  const fixedDepositProductTemplate =
    fixedDepositProductTemplateQueryResult.data;

  const fixedDepositProductQueryResult =
    nxFixedDepositProductApi.useGetFixedDepositProductQuery(id, {
      skip: !id,
    });

  const fixedDeposit = fixedDepositProductQueryResult?.data;

  const [createFixedDepositProductMutation] =
    nxFixedDepositProductApi.useCreateFixedDepositProductMutation();

  const [updateFixedDepositProductMutation] =
    nxFixedDepositProductApi.useUpdateFixedDepositProductMutation();

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
        ? updateFixedDepositProductMutation
        : createFixedDepositProductMutation;
      try {
        const data = await func({
          ...values,
        }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage || "Product Successfully Added",
          { variant: "success" }
        );
        navigate(RouteEnum.FIXED_DEPOSIT_PRODUCT);
      } catch (error) {
        console.log(error);
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
        fixedDeposit?.locale ||
        fixedDepositProductTemplate?.locale ||
        values?.locale,

      // Details & Currency
      name:
        fixedDeposit?.name || fixedDepositProductTemplate?.name || values?.name,
      shortName:
        fixedDeposit?.shortName ||
        fixedDepositProductTemplate?.shortName ||
        values?.shortName,
      description:
        fixedDeposit?.description ||
        fixedDepositProductTemplate?.description ||
        values?.description,
      currencyCode:
        fixedDeposit?.currency?.code ||
        fixedDepositProductTemplate?.currency?.code ||
        values?.currencyCode,
      digitsAfterDecimal:
        fixedDeposit?.digitsAfterDecimal ||
        // fixedDepositProductTemplate?.digitsAfterDecimal ||
        values?.digitsAfterDecimal,
      inMultiplesOf:
        fixedDeposit?.inMultiplesOf ||
        // fixedDepositProductTemplate?.inMultiplesOf ||
        values?.inMultiplesOf,

      // Terms
      minDepositAmount:
        fixedDeposit?.minDepositAmount ||
        fixedDepositProductTemplate?.minDepositAmount ||
        values?.minDepositAmount,
      depositAmount:
        fixedDeposit?.depositAmount ||
        fixedDepositProductTemplate?.depositAmount ||
        values?.depositAmount,
      maxDepositAmount:
        fixedDeposit?.maxDepositAmount ||
        fixedDepositProductTemplate?.maxDepositAmount ||
        values?.maxDepositAmount,
      interestCompoundingPeriodType:
        fixedDeposit?.interestCompoundingPeriodType?.id ||
        fixedDepositProductTemplate?.interestCompoundingPeriodType?.id ||
        values?.interestCompoundingPeriodType,
      interestPostingPeriodType:
        fixedDeposit?.interestPostingPeriodType?.id ||
        fixedDepositProductTemplate?.interestPostingPeriodType?.id ||
        values?.interestPostingPeriodType,
      interestCalculationType:
        fixedDeposit?.interestCalculationType?.id ||
        fixedDepositProductTemplate?.interestCalculationType?.id ||
        values?.interestCalculationType,
      interestCalculationDaysInYearType:
        fixedDeposit?.interestCalculationDaysInYearType?.id ||
        fixedDepositProductTemplate?.interestCalculationDaysInYearType?.id ||
        values?.interestCalculationDaysInYearType,

      // Settings
      lockinPeriodFrequency:
        fixedDeposit?.lockinPeriodFrequency ||
        fixedDepositProductTemplate?.lockinPeriodFrequency ||
        values?.lockinPeriodFrequency,
      lockinPeriodFrequencyType: getTruthyValue(
        [
          fixedDeposit?.lockinPeriodFrequencyType?.id,
          fixedDepositProductTemplate?.lockinPeriodFrequencyType?.id,
          values?.lockinPeriodFrequencyType,
        ],
        { truthyValues: [0, ""] }
      ),
      minDepositTerm:
        fixedDeposit?.minDepositTerm ||
        fixedDepositProductTemplate?.minDepositTerm ||
        values?.minDepositTerm,
      minDepositTermTypeId: getTruthyValue(
        [
          fixedDeposit?.minDepositTermType?.id,
          fixedDepositProductTemplate?.minDepositTermType?.id,
          values?.minDepositTermTypeId,
        ],
        { truthyValues: [0, ""] }
      ),
      inMultiplesOfDepositTerm:
        fixedDeposit?.inMultiplesOfDepositTerm ||
        fixedDepositProductTemplate?.inMultiplesOfDepositTerm ||
        values?.inMultiplesOfDepositTerm,
      inMultiplesOfDepositTermTypeId: getTruthyValue(
        [
          fixedDeposit?.inMultiplesOfDepositTermType?.id,
          fixedDepositProductTemplate?.inMultiplesOfDepositTermType?.id,
          values?.inMultiplesOfDepositTermTypeId,
        ],
        { truthyValues: [0, ""] }
      ),
      maxDepositTerm:
        fixedDeposit?.maxDepositTerm ||
        fixedDepositProductTemplate?.maxDepositTerm ||
        values?.maxDepositTerm,
      maxDepositTermTypeId: getTruthyValue(
        [
          fixedDeposit?.maxDepositTermType?.id,
          fixedDepositProductTemplate?.maxDepositTermType?.id,
          values?.maxDepositTermTypeId,
        ],
        { truthyValues: [0, ""] }
      ),
      preClosurePenalApplicable:
        fixedDeposit?.preClosurePenalApplicable ||
        fixedDepositProductTemplate?.preClosurePenalApplicable ||
        values?.preClosurePenalApplicable,
      preClosurePenalInterest: getTruthyValue(
        [
          fixedDeposit?.preClosurePenalInterest,
          fixedDepositProductTemplate?.preClosurePenalInterest,
          values?.preClosurePenalInterest,
        ],
        { truthyValues: [0, ""] }
      ),
      preClosurePenalInterestOnTypeId:
        fixedDeposit?.preClosurePenalInterestOnType?.id ||
        fixedDepositProductTemplate?.preClosurePenalInterestOnType?.id ||
        values?.preClosurePenalInterestOnTypeId,
      withHoldTax:
        fixedDeposit?.withHoldTax ||
        fixedDepositProductTemplate?.withHoldTax ||
        values?.withHoldTax,
      taxGroupId:
        fixedDeposit?.taxGroup?.id ||
        fixedDepositProductTemplate?.taxGroup?.id ||
        values?.taxGroupId,

      // Interest Rate
      charts: fixedDeposit?.interestRateCharts?.length
        ? fixedDeposit?.interestRateCharts?.map((chart) => {
            return {
              id: chart?.id,
              fromDate: chart?.fromDate?.length
                ? new Date(
                    chart?.fromDate?.[0],
                    chart?.fromDate?.[1] - 1,
                    chart?.fromDate?.[2]
                  )
                : null,
              endDate: chart?.endDate?.length
                ? new Date(
                    chart?.endDate?.[0],
                    chart?.endDate?.[1] - 1,
                    chart?.endDate?.[2]
                  )
                : null,
              isPrimaryGroupingByAmount: chart?.isPrimaryGroupingByAmount,
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
        : fixedDepositProductTemplate?.charts || values?.charts,

      // Charges
      charges:
        fixedDeposit?.charges?.map((charge) => ({ id: charge.id })) ||
        fixedDepositProductTemplate?.charges ||
        values?.charges,

      // Accounting
      accountingRule:
        fixedDeposit?.accountingRule?.id ||
        fixedDepositProductTemplate?.accountingRule?.id ||
        values?.accountingRule,
      savingsReferenceAccountId:
        fixedDeposit?.accountingMappings?.savingsReferenceAccount?.id ||
        fixedDepositProductTemplate?.accountingMappings?.savingsReferenceAccount
          ?.id ||
        values?.savingsReferenceAccountId,
      savingsControlAccountId:
        fixedDeposit?.accountingMappings?.savingsControlAccount?.id ||
        fixedDepositProductTemplate?.accountingMappings?.savingsControlAccount
          ?.id ||
        values?.savingsControlAccountId,
      transfersInSuspenseAccountId:
        fixedDeposit?.accountingMappings?.transfersInSuspenseAccount?.id ||
        fixedDepositProductTemplate?.accountingMappings
          ?.transfersInSuspenseAccount?.id ||
        values?.transfersInSuspenseAccountId,
      interestOnSavingsAccountId:
        fixedDeposit?.accountingMappings?.interestOnSavingsAccount?.id ||
        fixedDepositProductTemplate?.accountingMappings
          ?.interestOnSavingsAccount?.id ||
        values?.interestOnSavingsAccountId,
      incomeFromFeeAccountId:
        fixedDeposit?.accountingMappings?.incomeFromFeeAccount?.id ||
        fixedDepositProductTemplate?.accountingMappings?.incomeFromFeeAccount
          ?.id ||
        values?.incomeFromFeeAccountId,
      incomeFromPenaltyAccountId:
        fixedDeposit?.accountingMappings?.incomeFromPenaltyAccount?.id ||
        fixedDepositProductTemplate?.accountingMappings
          ?.incomeFromPenaltyAccount?.id ||
        values?.incomeFromPenaltyAccountId,
      advancedAccountingRules:
        !!fixedDeposit?.paymentChannelToFundSourceMappings?.length ||
        !!fixedDeposit?.feeToIncomeAccountMappings?.length ||
        !!fixedDeposit?.penaltyToIncomeAccountMappings?.length,
      paymentChannelToFundSourceMappings:
        fixedDeposit?.paymentChannelToFundSourceMappings?.map((item) => ({
          paymentTypeId: item?.paymentType?.id,
          fundSourceAccountId: item?.fundSourceAccount?.id,
        })) ||
        fixedDepositProductTemplate?.paymentChannelToFundSourceMappings ||
        values?.paymentChannelToFundSourceMappings,
      feeToIncomeAccountMappings:
        fixedDeposit?.feeToIncomeAccountMappings?.map((item) => ({
          chargeId: item?.charge?.id,
          incomeAccountId: item?.incomeAccount?.id,
        })) ||
        fixedDepositProductTemplate?.feeToIncomeAccountMappings ||
        values?.feeToIncomeAccountMappings,
      penaltyToIncomeAccountMappings:
        fixedDeposit?.penaltyToIncomeAccountMappings?.map((item) => ({
          chargeId: item?.charge?.id,
          incomeAccountId: item?.incomeAccount?.id,
        })) ||
        fixedDepositProductTemplate?.penaltyToIncomeAccountMappings ||
        values?.penaltyToIncomeAccountMappings,
    });
  }, [dataRef, fixedDeposit, fixedDepositProductTemplate]);

  const contentProps = { formik, fixedDepositProductTemplate, setStep };

  const contents = [
    {
      title: "Details",
      body: <FixedDepositProductCreateEditDetailsXCurrency {...contentProps} />,
    },
    {
      title: "Terms",
      body: <FixedDepositProductCreateEditTerms {...contentProps} />,
    },
    {
      title: "Settings",
      body: <FixedDepositProductCreateEditSettings {...contentProps} />,
    },
    {
      title: "Interest Rate Chart",
      body: <FixedDepositProductCreateEditInterestRate {...contentProps} />,
    },
    {
      title: "Charges",
      body: <FixedDepositProductCreateEditCharges {...contentProps} />,
    },
    {
      title: "Accounting",
      body: <FixedDepositProductCreateEditAccounting {...contentProps} />,
    },
    {
      title: "Preview",
      body: <FixedDepositProductCreateEditPreview {...contentProps} />,
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
            ? "Update Fixed Deposit Product"
            : "Create Fixed Deposit Product"
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

export default FixedDepositProductCreateEdit;
