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
import LoanProductCreateEditAccounting from "./LoanProductCreateEditAccounting";
import LoanProductCreateEditCharges from "./LoanProductCreateEditCharges";
import LoanProductCreateEditDetailsXCurrency from "./LoanProductCreateEditDetailsXCurrency";
import LoanProductCreateEditPreview from "./LoanProductCreateEditPreview";
import LoanProductCreateEditSettings from "./LoanProductCreateEditSettings";
import LoanProductCreateEditTerms from "./LoanProductCreateEditTerms";
import { nimbleX360CRMLoanProductApi } from "./LoanProductStoreQuerySlice";
import * as dfn from "date-fns";
import {
  formatCurrencyToNumber,
  getTruthyValue,
  removeEmptyProperties,
} from "common/Utils";
import useDataRef from "hooks/useDataRef";

function LoanProductCreateEdit(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);

  const isEdit = !!id;

  const { step, nextStep, prevStep, setStep } = useStep(isEdit ? 5 : 0);

  const loanProductTemplateQueryResult =
    nimbleX360CRMLoanProductApi.useGetLoanProductTemplateQuery();

  const loanProductTemplate = loanProductTemplateQueryResult.data;

  const loanProductQueryResult =
    nimbleX360CRMLoanProductApi.useGetLoanProductQuery(id, {
      skip: !id,
    });

  const loanProduct = loanProductQueryResult?.data;

  const [createLoanProductMutation] =
    nimbleX360CRMLoanProductApi.useCreateLoanProductMutation();

  const [updateLoanProductMutation] =
    nimbleX360CRMLoanProductApi.useUpdateLoanProductMutation();

  const formik = useFormik({
    initialValues: {
      id,
      locale: DateConfig.LOCALE,

      // DetailsXCurrency
      name: "",
      shortName: "",
      fundId: "",
      description: "",
      dateFormat: DateConfig.FORMAT,
      startDate: null,
      closeDate: null,
      includeInBorrowerCycle: false,
      configs: [],
      repaymentMethod: [],
      employerType: [],
      salesReview: true,
      underwriterReview: true,
      underwriterTwoReview: true,
      autoDisburse: false,

      currencyCode: "NGN",
      digitsAfterDecimal: 2,
      inMultiplesOf: 100,
      // installmentAmountInMultiplesOf: 100,

      // Terms
      useBorrowerCycle: false,
      minPrincipal: "",
      principal: "",
      maxPrincipal: "",
      principalVariationsForBorrowerCycle: [],
      minNumberOfRepayments: "",
      numberOfRepayments: "",
      maxNumberOfRepayments: "",
      numberOfRepaymentVariationsForBorrowerCycle: [],
      isLinkedToFloatingInterestRates: false,
      floatingRatesId: "",
      interestRateDifferential: "",
      isFloatingInterestRateCalculationAllowed: true,
      minDifferentialLendingRate: "",
      defaultDifferentialLendingRate: "",
      maxDifferentialLendingRate: "",
      minInterestRatePerPeriod: "",
      interestRatePerPeriod: "",
      maxInterestRatePerPeriod: "",
      interestRateFrequencyType: "",
      interestRateVariationsForBorrowerCycle: [],
      repaymentEvery: "",
      repaymentFrequencyType: "",
      minimumDaysBetweenDisbursalAndFirstRepayment: "",

      // Settings
      amortizationType: "",
      interestType: 0,
      isEqualAmortization: false,
      interestCalculationPeriodType: "",
      allowPartialPeriodInterestCalcualtion: false,
      transactionProcessingStrategyId: "",
      graceOnPrincipalPayment: "",
      graceOnInterestPayment: "",
      graceOnInterestCharged: "",
      inArrearsTolerance: "",
      daysInYearType: "",
      daysInMonthType: "",
      canDefineInstallmentAmount: false,
      graceOnArrearsAgeing: "",
      overdueDaysForNPA: "",
      accountMovesOutOfNPAOnlyOnArrearsCompletion: false,
      principalThresholdForLastInstallment: 0,
      allowVariableInstallments: false,
      minimumGap: "",
      maximumGap: "",
      canUseForTopup: false,
      topUpNumberOfRepayment: 0,

      isInterestRecalculationEnabled: false,
      preClosureInterestCalculationStrategy: "",
      rescheduleStrategyMethod: "",
      interestRecalculationCompoundingMethod: "",
      recalculationCompoundingFrequencyType: "",
      recalculationCompoundingFrequencyNthDayType: "",
      recalculationCompoundingFrequencyDayOfWeekType: "",
      recalculationCompoundingFrequencyInterval: "",
      recalculationRestFrequencyType: "",
      recalculationRestFrequencyNthDayType: "",
      recalculationRestFrequencyDayOfWeekType: "",
      recalculationRestFrequencyInterval: "",
      isArrearsBasedOnOriginalSchedule: false,

      holdGuaranteeFunds: false,
      mandatoryGuarantee: "",
      minimumGuaranteeFromOwnFunds: "",
      minimumGuaranteeFromGuarantor: "",

      multiDisburseLoan: false,
      maxTrancheCount: 0,
      outstandingLoanBalance: 0,

      eligibility: true,
      dsr: "",
      nplAmountThreshold: "",
      maxAge: "",
      minNetPay: "",
      minServiceYear: "",
      maxServiceYear: "",

      externalService: false,
      vendorMethod: [],
      downPaymentLimit: 0,
      acceptDisbursementServiceFeeFromExternal: false,
      downPaymentPaidFull: false,

      allowAttributeConfiguration: true,
      allowAttributeOverrides: {
        amortizationType: true,
        interestType: true,
        transactionProcessingStrategyId: true,
        interestCalculationPeriodType: true,
        inArrearsTolerance: true,
        repaymentEvery: true,
        graceOnPrincipalAndInterestPayment: true,
        graceOnArrearsAgeing: true,
      },

      // Charges
      charges: [],

      // Accounting
      accountingRule: "",
      fundSourceAccountId: "",
      loanPortfolioAccountId: "",
      receivableInterestAccountId: "",
      receivableFeeAccountId: "",
      receivablePenaltyAccountId: "",
      transfersInSuspenseAccountId: "",

      interestOnLoanAccountId: "",
      incomeFromFeeAccountId: "",
      incomeFromPenaltyAccountId: "",
      incomeFromRecoveryAccountId: "",

      writeOffAccountId: "",
      overpaymentLiabilityAccountId: "",

      advancedAccountingRules: false,
      paymentChannelToFundSourceMappings: [],
      feeToIncomeAccountMappings: [],
      penaltyToIncomeAccountMappings: [],

      otherConfig: {
        checkBvn: false,
        checkRemita: false,
        checkBankSchedule: false,
        checkBankStatement: false,
        checkCRC: false,
      },
    },
    validationSchema: yup.lazy((values, options) => {
      return yup.object({
        // Details X Currency
        name: yup.string().label("Product Name").required(),
        shortName: yup.string().label("Short Name").required(),
        fundId: yup.string().label("Fund").notRequired(),
        description: yup.string().label("Description").notRequired(),
        startDate: yup.date().label("Start Date").optional().nullable(),
        closeDate: yup.date().label("Close Date").optional().nullable(),
        includeInBorrowerCycle: yup
          .bool()
          .label("Include In Borrower Cycle")
          .required(),
        // configs: [],
        // repaymentMethod: [],
        // employerType: [],
        // salesReview: true,
        // underwriterReview: true,
        // underwriterTwoReview: true,
        autoDisburse: yup
          .boolean()
          .label("Auto Disburse")
          .test(
            "is-auto-disburse",
            "select another review in failure of auto disburse",
            (value, context) => {
              if (value === true) {
                return [
                  context.parent.salesReview,
                  context.parent.underwriterReview,
                  context.parent.underwriterTwoReview,
                ].includes(true);
              }
              return true;
            }
          ),

        currencyCode: yup.string().label("Currency").required(),
        digitsAfterDecimal: yup.string().label("Decimal Places").required(),
        inMultiplesOf: yup
          .string()
          .label("Currency In Multiples Of")
          .required(),
        // installmentAmountInMultiplesOf: yup
        //   .string()
        //   .label("Installment Amount In Multiples Of")
        //   .required(),

        // Terms
        useBorrowerCycle: yup.bool().label("useBorrowerCycle").notRequired(),
        minPrincipal: yup.string().label("Minimum Principal").required(),
        principal: yup.string().label("Principal").required(),
        maxPrincipal: yup.string().label("Maximum Principal").required(),
        principalVariationsForBorrowerCycle: yup
          .array()
          .of(
            yup.object({
              valueConditionType: yup.string().label("Condition").required(),
              borrowerCycleNumber: yup.string().label("Loan Cycle").required(),
              minValue: yup.string().label("Minimum").required(),
              defaultValue: yup.string().label("Default").required(),
              maxValue: yup.string().label("Maximam").required(),
            })
          )
          .label("principalVariationsForBorrowerCycle")
          .notRequired(),
        minNumberOfRepayments: yup
          .string()
          .label("Minimum Number Of Repayments")
          .required(),
        numberOfRepayments: yup
          .string()
          .label("Number Of Repayments")
          .required(),
        maxNumberOfRepayments: yup
          .string()
          .label("Maximum Number Of Repayments")
          .required(),
        numberOfRepaymentVariationsForBorrowerCycle: yup
          .array()
          .of(
            yup.object({
              valueConditionType: yup.string().label("Condition").required(),
              borrowerCycleNumber: yup.string().label("Loan Cycle").required(),
              minValue: yup.string().label("Minimum").required(),
              defaultValue: yup.string().label("Default").required(),
              maxValue: yup.string().label("Maximam").required(),
            })
          )
          .label("numberOfRepaymentVariationsForBorrowerCycle")
          .notRequired(),
        isLinkedToFloatingInterestRates: yup
          .bool()
          .label("isLinkedToFloatingInterestRates")
          .notRequired(),
        floatingRatesId: yup.string().label("floatingRatesId").notRequired(),
        interestRateDifferential: yup
          .string()
          .label("floatingRatesId")
          .notRequired(),
        isFloatingInterestRateCalculationAllowed: yup
          .bool()
          .label("isFloatingInterestRateCalculationAllowed"),
        minDifferentialLendingRate: yup
          .string()
          .label("minDifferentialLendingRate")
          .notRequired(),
        defaultDifferentialLendingRate: yup
          .string()
          .label("defaultDifferentialLendingRate")
          .notRequired(),
        maxDifferentialLendingRate: yup
          .string()
          .label("maxDifferentialLendingRate")
          .notRequired(),
        minInterestRatePerPeriod: yup
          .string()
          .label("minInterestRatePerPeriod")
          .notRequired(),
        interestRatePerPeriod: yup
          .string()
          .label("interestRatePerPeriod")
          .notRequired(),
        maxInterestRatePerPeriod: yup
          .string()
          .label("maxInterestRatePerPeriod")
          .notRequired(),
        interestRateFrequencyType: yup
          .string()
          .label("interestRateFrequencyType")
          .notRequired(),
        interestRateVariationsForBorrowerCycle: yup
          .array()
          .of(
            yup.object({
              valueConditionType: yup.string().label("Condition").required(),
              borrowerCycleNumber: yup.string().label("Loan Cycle").required(),
              minValue: yup.string().label("Minimum").required(),
              defaultValue: yup.string().label("Default").required(),
              maxValue: yup.string().label("Maximam").required(),
            })
          )
          .label("interestRateVariationsForBorrowerCycle")
          .notRequired(),
        repaymentEvery: yup.string().label("repaymentEvery").required(),
        repaymentFrequencyType: yup
          .string()
          .label("repaymentFrequencyType")
          .required(),
        minimumDaysBetweenDisbursalAndFirstRepayment: yup
          .string()
          .label("minimumDaysBetweenDisbursalAndFirstRepayment")
          .notRequired(),

        // Settings
        amortizationType: yup.string().label("Amortization").required(),
        interestType: yup.string().label("Interest Method").required(),
        isEqualAmortization: yup
          .bool()
          .label("isEqualAmortization")
          .notRequired(),
        interestCalculationPeriodType: yup
          .string()
          .label("interestCalculationPeriodType")
          .required(),
        allowPartialPeriodInterestCalcualtion: yup
          .bool()
          .label("allowPartialPeriodInterestCalcualtion")
          .notRequired(),
        transactionProcessingStrategyId: yup
          .string()
          .label("transactionProcessingStrategyId")
          .required(),
        graceOnPrincipalPayment: yup
          .number()
          .positive()
          .label("graceOnPrincipalPayment")
          .when("numberOfRepayments", (numberOfRepayments, schema) => {
            return schema.max(
              numberOfRepayments ? numberOfRepayments - 1 : 0,
              "Must be less than number of repayments"
            );
          })
          .notRequired(),
        graceOnInterestPayment: yup
          .number()
          .positive()
          .when("numberOfRepayments", (numberOfRepayments, schema) => {
            return schema.max(
              numberOfRepayments ? numberOfRepayments - 1 : 0,
              "Must be less than number of repayments"
            );
          })
          .label("graceOnInterestPayment")
          .notRequired(),
        graceOnInterestCharged: yup
          .number()
          .positive()
          .when("numberOfRepayments", (numberOfRepayments, schema) => {
            return schema.max(
              numberOfRepayments ? numberOfRepayments - 1 : 0,
              "Must be less than number of repayments"
            );
          })
          .label("graceOnInterestCharged")
          .notRequired(),
        inArrearsTolerance: yup
          .string()
          .label("inArrearsTolerance")
          .notRequired(),
        daysInYearType: yup.string().label("daysInYearType").required(),
        daysInMonthType: yup.string().label("daysInMonthType").required(),
        canDefineInstallmentAmount: yup
          .bool()
          .label("canDefineInstallmentAmount"),
        graceOnArrearsAgeing: yup
          .string()
          .label("graceOnArrearsAgeing")
          .notRequired(),
        overdueDaysForNPA: yup
          .string()
          .label("overdueDaysForNPA")
          .notRequired(),
        accountMovesOutOfNPAOnlyOnArrearsCompletion: yup
          .bool()
          .label("accountMovesOutOfNPAOnlyOnArrearsCompletion")
          .required(),
        principalThresholdForLastInstallment: yup
          .string()
          .label("principalThresholdForLastInstallment")
          .notRequired(),
        allowVariableInstallments: yup
          .bool()
          .label("allowVariableInstallments")
          .notRequired(),
        minimumGap: yup.string().label("minimumGap").notRequired(),
        maximumGap: yup.string().label("maximumGap").notRequired(),
        canUseForTopup: yup.bool().label("canUseForTopup").notRequired(),

        isInterestRecalculationEnabled: yup
          .bool()
          .label("isInterestRecalculationEnabled")
          .notRequired(),
        preClosureInterestCalculationStrategy: yup
          .string()
          .label("preClosureInterestCalculationStrategy")
          .when(
            ["isEqualAmortization", "isInterestRecalculationEnabled"],
            (isEqualAmortization, isInterestRecalculationEnabled, schema) => {
              return !isEqualAmortization && !!isInterestRecalculationEnabled
                ? schema.required()
                : schema.notRequired();
            }
          ),
        rescheduleStrategyMethod: yup
          .string()
          .label("rescheduleStrategyMethod")
          .when(
            ["isEqualAmortization", "isInterestRecalculationEnabled"],
            (isEqualAmortization, isInterestRecalculationEnabled, schema) => {
              return !isEqualAmortization && !!isInterestRecalculationEnabled
                ? schema.required()
                : schema.notRequired();
            }
          ),
        interestRecalculationCompoundingMethod: yup
          .string()
          .label("interestRecalculationCompoundingMethod")
          .when(
            ["isEqualAmortization", "isInterestRecalculationEnabled"],
            (isEqualAmortization, isInterestRecalculationEnabled, schema) => {
              return !isEqualAmortization && !!isInterestRecalculationEnabled
                ? schema.required()
                : schema.notRequired();
            }
          ),
        recalculationCompoundingFrequencyType: yup
          .string()
          .label("recalculationCompoundingFrequencyType")
          .when(
            [
              "isEqualAmortization",
              "isInterestRecalculationEnabled",
              "interestRecalculationCompoundingMethod",
            ],
            (
              isEqualAmortization,
              isInterestRecalculationEnabled,
              interestRecalculationCompoundingMethod,
              schema
            ) => {
              return !isEqualAmortization &&
                !!isInterestRecalculationEnabled &&
                interestRecalculationCompoundingMethod !== 0
                ? schema.required()
                : schema.notRequired();
            }
          ),
        recalculationCompoundingFrequencyNthDayType: yup
          .string()
          .label("recalculationCompoundingFrequencyNthDayType")
          .when(
            [
              "isEqualAmortization",
              "isInterestRecalculationEnabled",
              "interestRecalculationCompoundingMethod",
              "recalculationCompoundingFrequencyType",
            ],
            (
              isEqualAmortization,
              isInterestRecalculationEnabled,
              interestRecalculationCompoundingMethod,
              recalculationCompoundingFrequencyType,
              schema
            ) => {
              return !isEqualAmortization &&
                !!isInterestRecalculationEnabled &&
                interestRecalculationCompoundingMethod !== 0 &&
                recalculationCompoundingFrequencyType === 4
                ? schema.required()
                : schema.notRequired();
            }
          ),
        recalculationCompoundingFrequencyDayOfWeekType: yup
          .string()
          .label("recalculationCompoundingFrequencyDayOfWeekType")
          .when(
            [
              "isEqualAmortization",
              "isInterestRecalculationEnabled",
              "interestRecalculationCompoundingMethod",
              "recalculationCompoundingFrequencyType",
            ],
            (
              isEqualAmortization,
              isInterestRecalculationEnabled,
              interestRecalculationCompoundingMethod,
              recalculationCompoundingFrequencyType,
              schema
            ) => {
              return !isEqualAmortization &&
                !!isInterestRecalculationEnabled &&
                interestRecalculationCompoundingMethod !== 0 &&
                (recalculationCompoundingFrequencyType === 3 ||
                  recalculationCompoundingFrequencyType === 4)
                ? schema.required()
                : schema.notRequired();
            }
          ),
        recalculationCompoundingFrequencyInterval: yup
          .number()
          .label("recalculationCompoundingFrequencyInterval")
          .when(
            [
              "isEqualAmortization",
              "isInterestRecalculationEnabled",
              "interestRecalculationCompoundingMethod",
            ],
            (
              isEqualAmortization,
              isInterestRecalculationEnabled,
              interestRecalculationCompoundingMethod,
              schema
            ) => {
              return !isEqualAmortization &&
                !!isInterestRecalculationEnabled &&
                interestRecalculationCompoundingMethod !== 0
                ? schema.required()
                : schema.notRequired();
            }
          ),
        recalculationRestFrequencyType: yup
          .string()
          .label("interestRecalculationCompoundingMethod")
          .when(
            ["isEqualAmortization", "isInterestRecalculationEnabled"],
            (isEqualAmortization, isInterestRecalculationEnabled, schema) => {
              return !isEqualAmortization && !!isInterestRecalculationEnabled
                ? schema.required()
                : schema.notRequired();
            }
          ),
        recalculationRestFrequencyNthDayType: yup
          .string()
          .label("recalculationRestFrequencyNthDayType")
          .when(
            [
              "isEqualAmortization",
              "isInterestRecalculationEnabled",
              "recalculationRestFrequencyType",
            ],
            (
              isEqualAmortization,
              isInterestRecalculationEnabled,
              recalculationRestFrequencyType,
              schema
            ) => {
              return !isEqualAmortization &&
                !!isInterestRecalculationEnabled &&
                recalculationRestFrequencyType === 4
                ? schema.required()
                : schema.notRequired();
            }
          ),
        recalculationRestFrequencyDayOfWeekType: yup
          .string()
          .label("recalculationRestFrequencyDayOfWeekType")
          .when(
            [
              "isEqualAmortization",
              "isInterestRecalculationEnabled",
              "recalculationRestFrequencyType",
            ],
            (
              isEqualAmortization,
              isInterestRecalculationEnabled,
              recalculationRestFrequencyType,
              schema
            ) => {
              return !isEqualAmortization &&
                !!isInterestRecalculationEnabled &&
                (recalculationRestFrequencyType === 3 ||
                  recalculationRestFrequencyType === 4)
                ? schema.required()
                : schema.notRequired();
            }
          ),
        recalculationRestFrequencyInterval: yup
          .string()
          .label("recalculationRestFrequencyInterval")
          .when(
            [
              "isEqualAmortization",
              "isInterestRecalculationEnabled",
              "recalculationRestFrequencyType",
            ],
            (
              isEqualAmortization,
              isInterestRecalculationEnabled,
              recalculationRestFrequencyType,
              schema
            ) => {
              return !isEqualAmortization &&
                !!isInterestRecalculationEnabled &&
                recalculationRestFrequencyType !== 1
                ? schema.required()
                : schema.notRequired();
            }
          ),
        isArrearsBasedOnOriginalSchedule: yup
          .bool()
          .label("isArrearsBasedOnOriginalSchedule")
          .notRequired(),

        holdGuaranteeFunds: yup
          .bool()
          .label("holdGuaranteeFunds")
          .notRequired(),
        mandatoryGuarantee: yup
          .string()
          .label("mandatoryGuarantee")
          .when("holdGuaranteeFunds", (holdGuaranteeFunds, schema) => {
            return !!holdGuaranteeFunds
              ? schema.required()
              : schema.notRequired();
          }),
        minimumGuaranteeFromOwnFunds: yup
          .string()
          .label("minimumGuaranteeFromOwnFunds")
          .notRequired(),
        minimumGuaranteeFromGuarantor: yup
          .string()
          .label("minimumGuaranteeFromGuarantor")
          .notRequired(),

        multiDisburseLoan: yup.bool().label("multiDisburseLoan").notRequired(),

        allowAttributeConfiguration: yup
          .bool()
          .label("allowAttributeConfiguration")
          .notRequired(),
        allowAttributeOverrides: yup.object({
          amortizationType: yup.bool().label("amortizationType").notRequired(),
          interestType: yup.string().label("interestType").notRequired(),
          transactionProcessingStrategyId: yup
            .bool()
            .label("transactionProcessingStrategyId")
            .notRequired(),
          interestCalculationPeriodType: yup
            .bool()
            .label("interestCalculationPeriodType")
            .notRequired(),
          inArrearsTolerance: yup
            .bool()
            .label("inArrearsTolerance")
            .notRequired(),
          repaymentEvery: yup.bool().label("repaymentEvery").notRequired(),
          graceOnPrincipalAndInterestPayment: yup
            .bool()
            .label("graceOnPrincipalAndInterestPayment")
            .notRequired(),
          graceOnArrearsAgeing: yup
            .bool()
            .label("graceOnArrearsAgeing")
            .notRequired(),
        }),

        // Charges
        charges: yup
          .array()
          .label("Charges")
          .of(yup.object({ id: yup.string().required() }))
          .notRequired(),

        // Accounting
        accountingRule: yup.string().label("accountingRule").required(),
        fundSourceAccountId: yup
          .string()
          .label("fundSourceAccountId")
          .notRequired(),
        loanPortfolioAccountId: yup
          .string()
          .label("loanPortfolioAccountId")
          .notRequired(),
        receivableInterestAccountId: yup
          .string()
          .label("receivableInterestAccountId")
          .notRequired(),
        receivableFeeAccountId: yup
          .string()
          .label("receivableFeeAccountId")
          .notRequired(),
        receivablePenaltyAccountId: yup
          .string()
          .label("receivablePenaltyAccountId")
          .notRequired(),
        transfersInSuspenseAccountId: yup
          .string()
          .label("transfersInSuspenseAccountId")
          .notRequired(),

        interestOnLoanAccountId: yup
          .string()
          .label("interestOnLoanAccountId")
          .notRequired(),
        incomeFromFeeAccountId: yup
          .string()
          .label("incomeFromFeeAccountId")
          .notRequired(),
        incomeFromPenaltyAccountId: yup
          .string()
          .label("incomeFromPenaltyAccountId")
          .notRequired(),
        incomeFromRecoveryAccountId: yup
          .string()
          .label("incomeFromRecoveryAccountId")
          .notRequired(),

        writeOffAccountId: yup
          .string()
          .label("writeOffAccountId")
          .notRequired(),
        overpaymentLiabilityAccountId: yup
          .string()
          .label("overpaymentLiabilityAccountId")
          .notRequired(),

        advancedAccountingRules: yup
          .bool()
          .label("advancedAccountingRules")
          .notRequired(),

        paymentChannelToFundSourceMappings: yup
          .array()
          .label("paymentChannelToFundSourceMappings")
          .of(
            yup.object({
              paymentTypeId: yup.string().label("paymentTypeId").required(),
              fundSourceAccountId: yup
                .string()
                .label("fundSourceAccountId")
                .required(),
            })
          ),
        feeToIncomeAccountMappings: yup
          .array()
          .label("feeToIncomeAccountMappings")
          .of(
            yup.object({
              chargeId: yup.string().label("chargeId").required(),
              incomeAccountId: yup.string().label("incomeAccountId").required(),
            })
          ),
        penaltyToIncomeAccountMappings: yup
          .array()
          .label("penaltyToIncomeAccountMappings")
          .of(
            yup.object({
              chargeId: yup.string().label("chargeId").required(),
              incomeAccountId: yup.string().label("incomeAccountId").required(),
            })
          ),
      });
    }),
    onSubmit: async (_values, helper) => {
      const values = { ..._values };
      delete values.allowAttributeConfiguration;
      delete values.advancedAccountingRules;

      if (values.isEqualAmortization) {
        delete values.isLinkedToFloatingInterestRates;
        delete values.isInterestRecalculationEnabled;
        delete values.allowVariableInstallments;
      }

      if (values.isLinkedToFloatingInterestRates) {
        delete values.interestRatePerPeriod;
        delete values.minInterestRatePerPeriod;
        delete values.maxInterestRatePerPeriod;
        delete values.interestRateFrequencyType;
        values.defaultDifferentialLendingRate = formatCurrencyToNumber(
          values.defaultDifferentialLendingRate
        );
        values.interestRateDifferential = formatCurrencyToNumber(
          values.interestRateDifferential
        );
        values.maxDifferentialLendingRate = formatCurrencyToNumber(
          values.maxDifferentialLendingRate
        );
        values.minDifferentialLendingRate = formatCurrencyToNumber(
          values.minDifferentialLendingRate
        );
      } else {
        delete values.floatingRatesId;
        delete values.interestRateDifferential;
        delete values.minDifferentialLendingRate;
        delete values.defaultDifferentialLendingRate;
        delete values.maxDifferentialLendingRate;
        delete values.isFloatingInterestRateCalculationAllowed;
      }

      if (values.multiDisburseLoan) {
        values.outstandingLoanBalance = formatCurrencyToNumber(
          values.outstandingLoanBalance
        );
      }

      if (values.allowVariableInstallments) {
        values.minimumGap = formatCurrencyToNumber(values.minimumGap);
        values.maximumGap = formatCurrencyToNumber(values.maximumGap);
      } else {
        delete values.minimumGap;
        delete values.maximumGap;
      }

      if (!values.canUseForTopup || !values.topUpNumberOfRepayment) {
        delete values.topUpNumberOfRepayment;
      }

      if (!values.eligibility) {
        delete values?.dsr;
        delete values?.nplAmountThreshold;
        delete values?.maxAge;
        delete values?.minNetPay;
        delete values?.minServiceYear;
        delete values?.maxServiceYear;
      } else {
        values.nplAmountThreshold = formatCurrencyToNumber(
          values.nplAmountThreshold
        );
        values.minNetPay = formatCurrencyToNumber(values.minNetPay);
      }
      delete values.eligibility;

      if (!values.externalService) {
        delete values?.acceptDisbursementServiceFeeFromExternal;
        delete values?.downPaymentLimit;
        delete values?.downPaymentPaidFull;
      }
      delete values.externalService;

      const func = isEdit
        ? updateLoanProductMutation
        : createLoanProductMutation;
      try {
        await func(
          removeEmptyProperties(
            {
              ...values,
              startDate: values.startDate
                ? dfn.format(values.startDate, DateConfig.FORMAT)
                : values.startDate,
              closeDate: values.closeDate
                ? dfn.format(values.closeDate, DateConfig.FORMAT)
                : values.closeDate,
              minPrincipal: formatCurrencyToNumber(values.minPrincipal),
              principal: formatCurrencyToNumber(values.principal),
              maxPrincipal: formatCurrencyToNumber(values.maxPrincipal),
            },
            { allowEmptyArray: true }
          )
        ).unwrap();
        enqueueSnackbar("Product Successfully Added", { variant: "success" });
        navigate(RouteEnum.ADMINISTRATION_PRODUCTS_LOANS);
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

      // Details & Currency
      name: loanProduct?.name || values?.name,
      shortName: loanProduct?.shortName || values?.shortName,
      fundId: loanProduct?.fundId || values?.fundId,
      description: loanProduct?.description || values?.description,
      dateFormat: loanProduct?.dateFormat || values?.dateFormat,
      startDate: loanProduct?.startDate?.length
        ? new Date(
            loanProduct?.startDate?.[0],
            loanProduct?.startDate?.[1] - 1,
            loanProduct?.startDate?.[2]
          )
        : values?.startDate,
      closeDate: loanProduct?.closeDate?.length
        ? new Date(
            loanProduct?.closeDate?.[0],
            loanProduct?.closeDate?.[1] - 1,
            loanProduct?.closeDate?.[2]
          )
        : values?.closeDate,
      includeInBorrowerCycle:
        loanProduct?.includeInBorrowerCycle ||
        loanProductTemplate?.includeInBorrowerCycle ||
        values?.includeInBorrowerCycle,
      configs: loanProduct?.configs || values?.configs,
      repaymentMethod: loanProduct?.repaymentMethod || values?.repaymentMethod,
      employerType: loanProduct?.employerType || values?.employerType,
      salesReview: getTruthyValue(
        [loanProduct?.salesReview, values?.salesReview],
        {
          truthyValues: [false],
        }
      ),
      underwriterReview: getTruthyValue(
        [loanProduct?.underwriterReview, values?.underwriterReview],
        { truthyValues: [false] }
      ),
      underwriterTwoReview: getTruthyValue(
        [loanProduct?.underwriterTwoReview, values?.underwriterTwoReview],
        { truthyValues: [false] }
      ),
      autoDisburse: getTruthyValue(
        [loanProduct?.autoDisburse, values?.autoDisburse],
        { truthyValues: [false] }
      ),

      currencyCode:
        loanProduct?.currency?.code ||
        loanProductTemplate?.currency?.code ||
        values?.currencyCode,
      digitsAfterDecimal:
        loanProduct?.currency?.decimalPlaces ||
        loanProductTemplate?.currency?.decimalPlaces ||
        values?.digitsAfterDecimal,
      inMultiplesOf:
        loanProduct?.inMultiplesOf ||
        loanProductTemplate?.currency?.inMultiplesOf ||
        values?.inMultiplesOf,
      installmentAmountInMultiplesOf:
        loanProduct?.installmentAmountInMultiplesOf ||
        values?.installmentAmountInMultiplesOf,

      // Terms
      useBorrowerCycle:
        loanProduct?.useBorrowerCycle ||
        loanProductTemplate?.useBorrowerCycle ||
        values?.useBorrowerCycle,
      minPrincipal: loanProduct?.minPrincipal || values?.minPrincipal,
      principal: loanProduct?.principal || values?.principal,
      maxPrincipal: loanProduct?.maxPrincipal || values?.maxPrincipal,
      principalVariationsForBorrowerCycle:
        loanProduct?.principalVariationsForBorrowerCycle ||
        loanProductTemplate?.principalVariationsForBorrowerCycle ||
        values?.principalVariationsForBorrowerCycle,
      minNumberOfRepayments:
        loanProduct?.minNumberOfRepayments || values?.minNumberOfRepayments,
      numberOfRepayments:
        loanProduct?.numberOfRepayments || values?.numberOfRepayments,
      maxNumberOfRepayments:
        loanProduct?.maxNumberOfRepayments || values?.maxNumberOfRepayments,
      numberOfRepaymentVariationsForBorrowerCycle:
        loanProduct?.numberOfRepaymentVariationsForBorrowerCycle ||
        loanProductTemplate?.numberOfRepaymentVariationsForBorrowerCycle ||
        values.numberOfRepaymentVariationsForBorrowerCycle,
      isLinkedToFloatingInterestRates:
        loanProduct?.isLinkedToFloatingInterestRates ||
        loanProductTemplate?.isLinkedToFloatingInterestRates ||
        values?.isLinkedToFloatingInterestRates,
      floatingRatesId:
        loanProduct?.floatingRatesId ||
        loanProductTemplate?.floatingRatesId ||
        values?.floatingRatesId,
      interestRateDifferential:
        loanProduct?.interestRateDifferential ||
        values?.interestRateDifferential,
      isFloatingInterestRateCalculationAllowed:
        loanProduct?.isFloatingInterestRateCalculationAllowed ||
        loanProductTemplate?.isFloatingInterestRateCalculationAllowed ||
        values?.isFloatingInterestRateCalculationAllowed,
      minDifferentialLendingRate:
        loanProduct?.minDifferentialLendingRate ||
        values?.minDifferentialLendingRate,
      defaultDifferentialLendingRate:
        loanProduct?.defaultDifferentialLendingRate ||
        values?.defaultDifferentialLendingRate,
      maxDifferentialLendingRate:
        loanProduct?.maxDifferentialLendingRate ||
        values?.maxDifferentialLendingRate,
      minInterestRatePerPeriod:
        loanProduct?.minInterestRatePerPeriod ||
        values?.minInterestRatePerPeriod,
      interestRatePerPeriod:
        loanProduct?.interestRatePerPeriod || values?.interestRatePerPeriod,
      maxInterestRatePerPeriod:
        loanProduct?.maxInterestRatePerPeriod ||
        values?.maxInterestRatePerPeriod,

      interestRateFrequencyType: getTruthyValue(
        [
          loanProduct?.interestRateFrequencyType?.id,
          loanProductTemplate?.interestRateFrequencyType?.id,
          values?.interestRateFrequencyType,
        ],
        { truthyValues: [0] }
      ),
      interestRateVariationsForBorrowerCycle:
        loanProduct?.interestRateVariationsForBorrowerCycle ||
        loanProductTemplate?.interestRateVariationsForBorrowerCycle ||
        values?.interestRateVariationsForBorrowerCycle,
      repaymentEvery: loanProduct?.repaymentEvery || values?.repaymentEvery,
      repaymentFrequencyType: getTruthyValue(
        [
          loanProduct?.repaymentFrequencyType?.id,
          loanProductTemplate?.repaymentFrequencyType?.id,
          values?.repaymentFrequencyType,
        ],
        { truthyValues: [0] }
      ),
      minimumDaysBetweenDisbursalAndFirstRepayment:
        loanProduct?.minimumDaysBetweenDisbursalAndFirstRepayment ||
        values?.minimumDaysBetweenDisbursalAndFirstRepayment,

      // Settings
      amortizationType:
        loanProduct?.amortizationType?.id ||
        loanProductTemplate?.amortizationType?.id ||
        values?.amortizationType,
      interestType:
        loanProduct?.interestType?.id ||
        loanProductTemplate?.interestType?.id ||
        values?.interestType,
      isEqualAmortization:
        loanProduct?.isEqualAmortization ||
        loanProductTemplate?.isEqualAmortization ||
        values?.isEqualAmortization,
      interestCalculationPeriodType: getTruthyValue(
        [
          loanProduct?.interestCalculationPeriodType?.id,
          loanProductTemplate?.interestCalculationPeriodType?.id,
          values?.interestCalculationPeriodType,
        ],
        { truthyValues: [false, 0] }
      ),
      allowPartialPeriodInterestCalcualtion:
        loanProduct?.allowPartialPeriodInterestCalcualtion ||
        values?.allowPartialPeriodInterestCalcualtion,
      transactionProcessingStrategyId:
        loanProduct?.transactionProcessingStrategyId ||
        values?.transactionProcessingStrategyId,
      graceOnPrincipalPayment:
        loanProduct?.graceOnPrincipalPayment || values?.graceOnPrincipalPayment,
      graceOnInterestPayment:
        loanProduct?.graceOnInterestPayment || values?.graceOnInterestPayment,
      graceOnInterestCharged:
        loanProduct?.graceOnInterestCharged || values?.graceOnInterestCharged,
      inArrearsTolerance:
        loanProduct?.inArrearsTolerance || values?.inArrearsTolerance,
      daysInYearType:
        loanProduct?.daysInYearType?.id ||
        loanProductTemplate?.daysInYearType?.id ||
        values?.daysInYearType,
      daysInMonthType:
        loanProduct?.daysInMonthType?.id ||
        loanProductTemplate?.daysInMonthType?.id ||
        values?.daysInMonthType,
      canDefineInstallmentAmount:
        loanProduct?.canDefineInstallmentAmount ||
        loanProductTemplate?.canDefineInstallmentAmount ||
        values?.canDefineInstallmentAmount,
      graceOnArrearsAgeing:
        loanProduct?.graceOnArrearsAgeing || values?.graceOnArrearsAgeing,
      overdueDaysForNPA:
        loanProduct?.overdueDaysForNPA || values?.overdueDaysForNPA,
      accountMovesOutOfNPAOnlyOnArrearsCompletion:
        loanProduct?.accountMovesOutOfNPAOnlyOnArrearsCompletion ||
        loanProductTemplate?.accountMovesOutOfNPAOnlyOnArrearsCompletion ||
        values?.accountMovesOutOfNPAOnlyOnArrearsCompletion,
      principalThresholdForLastInstallment:
        loanProduct?.principalThresholdForLastInstallment ||
        values?.principalThresholdForLastInstallment,
      allowVariableInstallments:
        loanProduct?.allowVariableInstallments ||
        loanProductTemplate?.allowVariableInstallments ||
        values?.allowVariableInstallments,
      minimumGap: loanProduct?.minimumGap || values?.minimumGap,
      maximumGap: loanProduct?.maximumGap || values?.maximumGap,
      canUseForTopup:
        loanProduct?.canUseForTopup ||
        loanProductTemplate?.canUseForTopup ||
        values?.canUseForTopup,
      topUpNumberOfRepayment:
        loanProduct?.topUpNumberOfRepayment || values?.topUpNumberOfRepayment,
      isInterestRecalculationEnabled:
        loanProduct?.isInterestRecalculationEnabled ||
        loanProductTemplate?.isInterestRecalculationEnabled ||
        values?.isInterestRecalculationEnabled,
      preClosureInterestCalculationStrategy:
        loanProduct?.preClosureInterestCalculationStrategy ||
        values?.preClosureInterestCalculationStrategy,
      rescheduleStrategyMethod:
        loanProduct?.rescheduleStrategyMethod ||
        values?.rescheduleStrategyMethod,
      interestRecalculationCompoundingMethod:
        loanProduct?.interestRecalculationCompoundingMethod ||
        values?.interestRecalculationCompoundingMethod,
      recalculationCompoundingFrequencyType:
        loanProduct?.recalculationCompoundingFrequencyType ||
        values?.recalculationCompoundingFrequencyType,
      recalculationCompoundingFrequencyNthDayType:
        loanProduct?.recalculationCompoundingFrequencyNthDayType ||
        values?.recalculationCompoundingFrequencyNthDayType,
      recalculationCompoundingFrequencyDayOfWeekType:
        loanProduct?.recalculationCompoundingFrequencyDayOfWeekType ||
        values?.recalculationCompoundingFrequencyDayOfWeekType,
      recalculationCompoundingFrequencyInterval:
        loanProduct?.recalculationCompoundingFrequencyInterval ||
        values?.recalculationCompoundingFrequencyInterval,
      recalculationRestFrequencyType:
        loanProduct?.recalculationRestFrequencyType ||
        values?.recalculationRestFrequencyType,
      recalculationRestFrequencyInterval:
        loanProduct?.recalculationRestFrequencyInterval ||
        values?.recalculationRestFrequencyInterval,
      isArrearsBasedOnOriginalSchedule:
        loanProduct?.isArrearsBasedOnOriginalSchedule ||
        loanProductTemplate?.isArrearsBasedOnOriginalSchedule ||
        values?.isArrearsBasedOnOriginalSchedule,

      holdGuaranteeFunds:
        loanProduct?.holdGuaranteeFunds ||
        loanProductTemplate?.holdGuaranteeFunds ||
        values?.holdGuaranteeFunds,

      mandatoryGuarantee:
        loanProduct?.mandatoryGuarantee || values?.mandatoryGuarantee,
      minimumGuaranteeFromOwnFunds:
        loanProduct?.minimumGuaranteeFromOwnFunds ||
        values?.minimumGuaranteeFromOwnFunds,
      minimumGuaranteeFromGuarantor:
        loanProduct?.minimumGuaranteeFromGuarantor ||
        values?.minimumGuaranteeFromGuarantor,

      multiDisburseLoan: !!(
        loanProduct?.maxTrancheCount || loanProduct?.outstandingLoanBalance
      ),
      maxTrancheCount: loanProduct?.maxTrancheCount || values?.maxTrancheCount,
      outstandingLoanBalance:
        loanProduct?.outstandingLoanBalance || values?.outstandingLoanBalance,

      eligibility:
        !!(
          loanProduct?.dsr ||
          loanProduct?.nplAmountThreshold ||
          loanProduct?.maxAge ||
          loanProduct?.minNetPay ||
          loanProduct?.minServiceYear ||
          loanProduct?.maxServiceYear
        ) || values.eligibility,
      dsr: loanProduct?.dsr || values.dsr,
      nplAmountThreshold:
        loanProduct?.nplAmountThreshold || values.nplAmountThreshold,
      maxAge: loanProduct?.maxAge || values.maxAge,
      minNetPay: loanProduct?.minNetPay || values.minNetPay,
      minServiceYear: loanProduct?.minServiceYear || values.minServiceYear,
      maxServiceYear: loanProduct?.maxServiceYear || values.maxServiceYear,

      externalService: !!(
        loanProduct?.acceptDisbursementServiceFeeFromExternal ||
        loanProduct?.downPaymentLimit ||
        loanProduct?.downPaymentPaidFull ||
        values?.externalService
      ),
      vendorMethod: loanProduct?.vendorMethod || values?.vendorMethod,
      downPaymentLimit:
        loanProduct?.downPaymentLimit || values?.downPaymentLimit,
      acceptDisbursementServiceFeeFromExternal:
        loanProduct?.acceptDisbursementServiceFeeFromExternal ||
        values?.acceptDisbursementServiceFeeFromExternal,
      downPaymentPaidFull:
        loanProduct?.downPaymentPaidFull || values?.downPaymentPaidFull,

      allowAttributeConfiguration:
        loanProduct?.allowAttributeConfiguration ||
        values?.allowAttributeConfiguration,
      allowAttributeOverrides: {
        amortizationType:
          loanProduct?.allowAttributeOverrides?.amortizationType ||
          values?.allowAttributeOverrides?.amortizationType,
        interestType:
          loanProduct?.allowAttributeOverrides?.interestType ||
          values?.allowAttributeOverrides?.interestType,
        transactionProcessingStrategyId:
          loanProduct?.allowAttributeOverrides
            ?.transactionProcessingStrategyId ||
          values?.allowAttributeOverrides?.transactionProcessingStrategyId,
        interestCalculationPeriodType:
          loanProduct?.allowAttributeOverrides?.interestCalculationPeriodType ||
          values?.allowAttributeOverrides?.interestCalculationPeriodType,
        inArrearsTolerance:
          loanProduct?.allowAttributeOverrides?.inArrearsTolerance ||
          values?.allowAttributeOverrides?.inArrearsTolerance,
        repaymentEvery:
          loanProduct?.allowAttributeOverrides?.repaymentEvery ||
          values?.allowAttributeOverrides?.repaymentEvery,
        graceOnPrincipalAndInterestPayment:
          loanProduct?.allowAttributeOverrides
            ?.graceOnPrincipalAndInterestPayment ||
          values?.allowAttributeOverrides?.graceOnPrincipalAndInterestPayment,
        graceOnArrearsAgeing:
          loanProduct?.allowAttributeOverrides?.graceOnArrearsAgeing ||
          values?.allowAttributeOverrides?.graceOnArrearsAgeing,
      },

      // Charges
      charges: loanProduct?.charges || values?.charges,

      // Accounting
      accountingRule:
        loanProduct?.accountingRule?.id ||
        loanProductTemplate?.accountingRule?.id ||
        values?.accountingRule,
      fundSourceAccountId:
        loanProduct?.accountingMappings?.fundSourceAccount?.id ||
        values?.fundSourceAccountId,
      loanPortfolioAccountId:
        loanProduct?.accountingMappings?.loanPortfolioAccount?.id ||
        values?.loanPortfolioAccountId,
      receivableInterestAccountId:
        loanProduct?.accountingMappings?.receivableInterestAccount?.id ||
        values?.receivableInterestAccountId,
      receivableFeeAccountId:
        loanProduct?.accountingMappings?.receivableFeeAccount?.id ||
        values?.receivableFeeAccountId,
      receivablePenaltyAccountId:
        loanProduct?.accountingMappings?.receivablePenaltyAccount?.id ||
        values?.receivablePenaltyAccountId,
      transfersInSuspenseAccountId:
        loanProduct?.accountingMappings?.transfersInSuspenseAccount?.id ||
        values?.transfersInSuspenseAccountId,

      interestOnLoanAccountId:
        loanProduct?.accountingMappings?.interestOnLoanAccount?.id ||
        values?.interestOnLoanAccountId,
      incomeFromFeeAccountId:
        loanProduct?.accountingMappings?.incomeFromFeeAccount?.id ||
        values?.incomeFromFeeAccountId,
      incomeFromPenaltyAccountId:
        loanProduct?.accountingMappings?.incomeFromPenaltyAccount?.id ||
        values?.incomeFromPenaltyAccountId,
      incomeFromRecoveryAccountId:
        loanProduct?.accountingMappings?.incomeFromRecoveryAccount?.id ||
        values?.incomeFromRecoveryAccountId,

      writeOffAccountId:
        loanProduct?.accountingMappings?.writeOffAccount?.id ||
        values?.writeOffAccountId,
      overpaymentLiabilityAccountId:
        loanProduct?.accountingMappings?.overpaymentLiabilityAccount?.id ||
        values?.overpaymentLiabilityAccountId,

      advancedAccountingRules:
        loanProduct?.advancedAccountingRules || values?.advancedAccountingRules,
      paymentChannelToFundSourceMappings:
        loanProduct?.paymentChannelToFundSourceMappings ||
        values?.paymentChannelToFundSourceMappings,
      feeToIncomeAccountMappings:
        loanProduct?.feeToIncomeAccountMappings ||
        values?.feeToIncomeAccountMappings,
      penaltyToIncomeAccountMappings:
        loanProduct?.penaltyToIncomeAccountMappings ||
        values?.penaltyToIncomeAccountMappings,

      // Other Config
      otherConfig: {
        checkBvn:
          loanProduct?.otherConfig?.checkBvn || values?.otherConfig?.checkBvn,
        checkRemita:
          loanProduct?.otherConfig?.checkRemita ||
          values?.otherConfig?.checkRemita,
        checkBankSchedule:
          loanProduct?.otherConfig?.checkBankSchedule ||
          values?.otherConfig?.checkBankSchedule,
        checkBankStatement:
          loanProduct?.otherConfig?.checkBankStatement ||
          values?.otherConfig?.checkBankStatement,
        checkCRC:
          loanProduct?.otherConfig?.checkCRC || values?.otherConfig?.checkCRC,
      },
    });
  }, [dataRef, loanProductTemplate, loanProduct]);

  const contentProps = { formik, loanProductTemplate, setStep };

  const contents = [
    {
      // title: "Details & Currency",
      title: "Details",
      body: <LoanProductCreateEditDetailsXCurrency {...contentProps} />,
    },
    { title: "Terms", body: <LoanProductCreateEditTerms {...contentProps} /> },
    {
      title: "Settings",
      body: <LoanProductCreateEditSettings {...contentProps} />,
    },
    {
      title: "Charges",
      body: <LoanProductCreateEditCharges {...contentProps} />,
    },
    {
      title: "Accounting",
      body: <LoanProductCreateEditAccounting {...contentProps} />,
    },
    {
      title: "Preview",
      body: <LoanProductCreateEditPreview {...contentProps} />,
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
        {isLastStep ? "Complete" : isSecondLastStep ? "Preview" : "Next"}
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
            ? "Update Loan Product"
            : "Create Loan Product"
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

export default LoanProductCreateEdit;
