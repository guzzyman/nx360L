import { Button, Paper, Typography, Icon, Chip } from "@mui/material";
import clsx from "clsx";
import { DateConfig } from "common/Constants";
import { objectAccessor } from "common/Utils";
import dfnFormat from "date-fns/format";

function LoanProductCreateEditPreview({
  formik,
  setStep,
  loanProductTemplate,
}) {
  function getFieldValueXErrorOnObject(
    object,
    key,
    optionsKey,
    optionKey,
    optionValueKey,
    format
  ) {
    const _value = optionsKey
      ? objectAccessor(
          objectAccessor(loanProductTemplate, optionsKey)?.find(
            (option) =>
              objectAccessor(option, optionKey) === objectAccessor(object, key)
          ),
          optionValueKey
        )
      : objectAccessor(object, key);

    const value = format?.(_value) || _value;

    return {
      value:
        typeof value === "boolean" ? (
          value ? (
            "TRUE"
          ) : (
            "FALSE"
          )
        ) : Array.isArray(value) ? (
          <div className="flex gap-1 mt-1">
            {value?.map((item) => (
              <Chip size="small" label={item}></Chip>
            ))}
          </div>
        ) : (
          value
        ),
      error: !!formik.errors[key],
    };
  }

  function getFieldValueXError(
    key,
    optionsKey,
    optionKey,
    optionValueKey,
    format
  ) {
    return getFieldValueXErrorOnObject(
      formik.values,
      key,
      optionsKey,
      optionKey,
      optionValueKey,
      format
    );
  }

  const renderHeader = (title, step) => (
    <div className="flex items-center justify-between border-b">
      <Typography className="text-primary-main font-bold">{title}</Typography>
      <Button
        onClick={() => setStep(step)}
        variant="text"
        endIcon={<Icon>edit</Icon>}
      >
        <b>Edit</b>
      </Button>
    </div>
  );

  const renderItem = ({ label, value, error }) => (
    <div key={label} className="">
      <Typography
        variant="body2"
        className={clsx(error ? "text-error-main" : "text-text-secondary")}
      >
        {label}
      </Typography>
      {typeof value === "string" ? (
        <Typography>
          {value !== undefined && value !== null && value !== "" ? value : "-"}
        </Typography>
      ) : (
        value
      )}
    </div>
  );

  const renderBody = (items) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {items.map(renderItem)}
    </div>
  );

  const renderArrayBody = (items, configs) =>
    objectAccessor(formik.values, items)?.map((item) => {
      const resolvedConfig = configs?.(item);
      return (
        resolvedConfig && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 border-b">
            {resolvedConfig?.map((config) => renderItem(config))}
          </div>
        )
      );
    });

  const renderArrayPreview = (title, step, items, configs) => (
    <Paper className="p-4">
      {renderHeader(title, step)}
      {renderArrayBody(items, configs)}
    </Paper>
  );

  const renderPreview = (title, step, items) => (
    <Paper className="p-4">
      {renderHeader(title, step)}
      {renderBody(items)}
    </Paper>
  );

  return (
    <div className="grid gap-y-4">
      {renderPreview("Details", 0, [
        {
          label: "Product Name",
          ...getFieldValueXError("name"),
        },
        {
          label: "Short Name",
          ...getFieldValueXError("shortName"),
        },
        {
          label: "Fund",
          ...getFieldValueXError("fundId", "fundOptions", "id", "name"),
        },
        {
          label: "Description",
          ...getFieldValueXError("description"),
        },
        {
          label: "Repayment Methods",
          ...getFieldValueXError(
            "repaymentMethod",
            undefined,
            undefined,
            undefined,
            (value) => value?.map((item) => item?.name)
          ),
        },
        {
          label: "Employement Types",
          ...getFieldValueXError(
            "employerType",
            undefined,
            undefined,
            undefined,
            (value) => value?.map((item) => item?.name)
          ),
        },
        {
          label: "Vendor Methods",
          ...getFieldValueXError(
            "vendorMethod",
            undefined,
            undefined,
            undefined,
            (value) => value?.map((item) => item?.displayName)
          ),
        },
        {
          label: "Start Date",
          ...getFieldValueXError("startDate"),
          value:
            formik.values?.startDate &&
            dfnFormat(new Date(formik.values?.startDate), DateConfig.FORMAT),
        },
        {
          label: "Closing Date",
          ...getFieldValueXError("closeDate"),
          value:
            formik.values?.closeDate &&
            dfnFormat(new Date(formik.values?.closeDate), DateConfig.FORMAT),
        },
        {
          label: "Include in customer loan counter",
          ...getFieldValueXError("includeInBorrowerCycle"),
        },
      ])}
      {renderPreview("Currency", 0, [
        {
          label: "Currency",
          ...getFieldValueXError(
            "currencyCode",
            "currencyOptions",
            "code",
            "displayLabel"
          ),
        },
        {
          label: "Decimal Places",
          ...getFieldValueXError("decimalPlaces"),
        },
        {
          label: "Currency in Multiple Of",
          ...getFieldValueXError("inMultiplesOf"),
        },
        // {
        //   label: "Installment In Multiple Of",
        //   ...getFieldValueXError("installmentAmountInMultiplesOf"),
        // },
      ])}

      {renderPreview("Integration Configuration", 2, [
        {
          label: "Check Bvn",
          ...getFieldValueXError("otherConfig.checkBvn"),
        },
        {
          label: "Check Remita",
          ...getFieldValueXError("otherConfig.checkRemita"),
        },
        {
          label: "Check Bank Schedule",
          ...getFieldValueXError("otherConfig.checkBankSchedule"),
        },
        {
          label: "Check Bank Statement",
          ...getFieldValueXError("otherConfig.checkBankStatement"),
        },
        {
          label: "Check CRC",
          ...getFieldValueXError("otherConfig.checkCRC"),
        },
      ])}

      {renderPreview("Terms - Terms vary based on loan cycle", 1, [
        {
          label: "Terms vary based on loan cycle",
          ...getFieldValueXError("useBorrowerCycle"),
        },
      ])}
      {renderPreview("Terms - Principals", 1, [
        {
          label: "Minimum",
          ...getFieldValueXError("minPrincipal"),
        },
        {
          label: "Default",
          ...getFieldValueXError("principal"),
        },
        {
          label: "Maximum",
          ...getFieldValueXError("maxPrincipal"),
        },
      ])}
      {renderArrayPreview(
        "Terms - Principals by Loan Cycles",
        1,
        "principalVariationsForBorrowerCycle",
        (item) => [
          {
            label: "Minimum",
            ...getFieldValueXErrorOnObject(
              item,
              "valueConditionType",
              "valueConditionTypeOptions",
              "id",
              "value"
            ),
          },
          {
            label: "Minimum",
            ...getFieldValueXErrorOnObject(item, "minValue"),
          },
          {
            label: "Default",
            ...getFieldValueXErrorOnObject(item, "defaultValue"),
          },
          {
            label: "Maximum",
            ...getFieldValueXErrorOnObject(item, "maxValue"),
          },
        ]
      )}
      {renderPreview("Terms - Number of Repayments", 1, [
        {
          label: "Minimum",
          ...getFieldValueXError("minNumberOfRepayments"),
        },
        {
          label: "Default",
          ...getFieldValueXError("numberOfRepayments"),
        },
        {
          label: "Maximum",
          ...getFieldValueXError("maxNumberOfRepayments"),
        },
      ])}
      {renderArrayPreview(
        "Terms - Number of Repayments by loan cycle",
        1,
        "numberOfRepaymentVariationsForBorrowerCycle",
        (item) => [
          {
            label: "Minimum",
            ...getFieldValueXErrorOnObject(
              item,
              "valueConditionType",
              "valueConditionTypeOptions",
              "id",
              "value"
            ),
          },
          {
            label: "Minimum",
            ...getFieldValueXErrorOnObject(item, "minValue"),
          },
          {
            label: "Default",
            ...getFieldValueXErrorOnObject(item, "defaultValue"),
          },
          {
            label: "Maximum",
            ...getFieldValueXErrorOnObject(item, "maxValue"),
          },
        ]
      )}
      {renderPreview("Terms - Is Linked to Floating Interest Rates?", 1, [
        {
          label: "Is Linked to Floating Interest Rates?",
          ...getFieldValueXError("isLinkedToFloatingInterestRates"),
        },
      ])}
      {renderPreview("Terms - Floating interest rate", 1, [
        {
          label: "Floating Rate",
          ...getFieldValueXError(
            "floatingRatesId",
            "floatingRateOptions",
            "id",
            "name"
          ),
        },
        {
          label: "Differential Rate",
          ...getFieldValueXError("interestRateDifferential"),
        },
        {
          label: "Is Floating Calculation Allowed?",
          ...getFieldValueXError("isFloatingInterestRateCalculationAllowed"),
        },
        {
          label: "Minimum",
          ...getFieldValueXError("minDifferentialLendingRate"),
        },
        {
          label: "Default",
          ...getFieldValueXError("defaultDifferentialLendingRate"),
        },
        {
          label: "Maximum",
          ...getFieldValueXError("maxDifferentialLendingRate"),
        },
      ])}

      {renderPreview("Terms - Nominal interest rate", 1, [
        {
          label: "Minimum",
          ...getFieldValueXError("minInterestRatePerPeriod"),
        },
        {
          label: "Default",
          ...getFieldValueXError("interestRatePerPeriod"),
        },
        {
          label: "Maximum",
          ...getFieldValueXError("maxInterestRatePerPeriod"),
        },
        {
          label: "Floating Rate",
          ...getFieldValueXError(
            "interestRateFrequencyType",
            "interestRateFrequencyTypeOptions",
            "id",
            "value"
          ),
        },
      ])}

      {renderArrayPreview(
        "Terms - Nominal Interest Rate by loan cycle",
        1,
        "interestRateVariationsForBorrowerCycle",
        (item) => [
          {
            label: "Condition",
            ...getFieldValueXErrorOnObject(
              item,
              "valueConditionType",
              "valueConditionTypeOptions",
              "id",
              "value"
            ),
          },
          {
            label: "Loan Cycle",
            ...getFieldValueXErrorOnObject(item, "borrowerCycleNumber"),
          },
          {
            label: "Minimum",
            ...getFieldValueXErrorOnObject(item, "minValue"),
          },
          {
            label: "Default",
            ...getFieldValueXErrorOnObject(item, "defaultValue"),
          },
          {
            label: "Maximum",
            ...getFieldValueXErrorOnObject(item, "maxValue"),
          },
        ]
      )}
      {renderPreview("Terms - Repaid every", 1, [
        {
          label: "Count",
          ...getFieldValueXError("repaymentEvery"),
        },
        {
          label: "Frequency",
          ...getFieldValueXError(
            "repaymentFrequencyType",
            "repaymentFrequencyTypeOptions",
            "id",
            "name"
          ),
        },
      ])}
      {renderPreview(
        "Terms - Minimum days between disbursal and first repayment date",
        1,
        [
          {
            label: "Disbursal",
            ...getFieldValueXError(
              "minimumDaysBetweenDisbursalAndFirstRepayment"
            ),
          },
        ]
      )}

      {renderPreview("Settings", 2, [
        {
          label: "Amortization",
          ...getFieldValueXError(
            "amortizationType",
            "amortizationTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Is Equal Amortization",
          ...getFieldValueXError("isEqualAmortization"),
        },
        {
          label: "Interest method",
          ...getFieldValueXError(
            "interestType",
            "interestTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Interest calculation period",
          ...getFieldValueXError(
            "interestCalculationPeriodType",
            "interestCalculationPeriodTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Calculate interest for exact days in partial period",
          ...getFieldValueXError("allowPartialPeriodInterestCalcualtion"),
        },
        {
          label: "Repayment strategy",
          ...getFieldValueXError(
            "transactionProcessingStrategyId",
            "transactionProcessingStrategyOptions",
            "id",
            "value"
          ),
        },
      ])}
      {renderPreview("Moratorium", 2, [
        {
          label: "On principal payment",
          ...getFieldValueXError("graceOnPrincipalPayment"),
        },
        {
          label: "On interest payment",
          ...getFieldValueXError("graceOnInterestPayment"),
        },
        {
          label: "Interest free period",
          ...getFieldValueXError("graceOnInterestCharged"),
        },
        {
          label: "Arrears tolerance",
          ...getFieldValueXError("inArrearsTolerance"),
        },
        {
          label: "Days in year",
          ...getFieldValueXError(
            "daysInYearType",
            "daysInYearTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Days in month",
          ...getFieldValueXError(
            "daysInMonthType",
            "daysInMonthTypeOptions",
            "id",
            "value"
          ),
        },
      ])}

      {renderPreview("Settings - Allow fixing of the installment amount", 2, [
        {
          label: "Allow fixing of the installment amount",
          ...getFieldValueXError("canDefineInstallmentAmount"),
        },
      ])}

      {renderPreview(
        "Settings - Number of days a loan may be overdue before moving into arrears",
        2,
        [
          {
            label:
              "Number of days a loan may be overdue before moving into arrears",
            ...getFieldValueXError("graceOnArrearsAgeing"),
          },
        ]
      )}
      {renderPreview(
        "Settings - Maximum number of days a loan may be overdue before becoming a NPA (non performing asset)",
        2,
        [
          {
            label:
              "Maximum number of days a loan may be overdue before becoming a NPA (non performing asset)",
            ...getFieldValueXError("overdueDaysForNPA"),
          },
        ]
      )}
      {renderPreview(
        "Settings - Maximum number of days a loan may be overdue before becoming a NPA (non performing asset)",
        2,
        [
          {
            label:
              "Maximum number of days a loan may be overdue before becoming a NPA (non performing asset)",
            ...getFieldValueXError("overdueDaysForNPA"),
          },
        ]
      )}
      {renderPreview(
        "Settings - Account moves out of NPA only after all arrears have been cleared?",
        2,
        [
          {
            label:
              "Account moves out of NPA only after all arrears have been cleared?",
            ...getFieldValueXError(
              "accountMovesOutOfNPAOnlyOnArrearsCompletion"
            ),
          },
        ]
      )}
      {renderPreview(
        "Settings -  Principal Threshold (%) for Last Installment",
        2,
        [
          {
            label: "Principal Threshold (%) for Last Installment",
            ...getFieldValueXError("principalThresholdForLastInstallment"),
          },
        ]
      )}
      {renderPreview("Settings - Is Variable Installments Allowed?", 2, [
        {
          label: "Is Variable Installments Allowed?",
          ...getFieldValueXError("allowVariableInstallments"),
        },
        {
          label: "Minimun",
          ...getFieldValueXError("minimumGap"),
        },
        {
          label: "Maximum",
          ...getFieldValueXError("maximumGap"),
        },
      ])}
      {renderPreview(
        "Settings - Is allowed to be used for providing Topup Loans?",
        2,
        [
          {
            label: "Is allowed to be used for providing Topup Loans?",
            ...getFieldValueXError("canUseForTopup"),
          },
        ]
      )}
      {renderPreview("Settings - Interest Recalculation", 2, [
        {
          label: "Recalculate Interest",
          ...getFieldValueXError("isInterestRecalculationEnabled"),
        },
        {
          label: "Pre-closure interest calculation rule",
          ...getFieldValueXError(
            "preClosureInterestCalculationStrategy",
            "preClosureInterestCalculationStrategyOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Advance payments adjustment type",
          ...getFieldValueXError(
            "rescheduleStrategyMethod",
            "rescheduleStrategyTypeOptions",
            "id",
            "value"
          ),
        },
      ])}
      {renderPreview("Settings - Interest recalculation compounding on", 2, [
        {
          label: "Interest recalculation compounding on",
          ...getFieldValueXError(
            "interestRecalculationCompoundingMethod",
            "interestRecalculationCompoundingTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Frequency for compounding",
          ...getFieldValueXError(
            "recalculationCompoundingFrequencyType",
            "interestRecalculationFrequencyTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Monthly Quatre",
          ...getFieldValueXError(
            "recalculationCompoundingFrequencyNthDayType",
            "interestRecalculationNthDayTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Day of the Week",
          ...getFieldValueXError(
            "recalculationCompoundingFrequencyDayOfWeekType",
            "interestRecalculationDayOfWeekTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Frequency Interval for compounding",
          ...getFieldValueXError("recalculationCompoundingFrequencyInterval"),
        },
      ])}
      {renderPreview(
        "Settings - Frequency for recalculate Outstanding Principal",
        2,
        [
          {
            label: "Principal",
            ...getFieldValueXError(
              "recalculationRestFrequencyType",
              "interestRecalculationFrequencyTypeOptions",
              "id",
              "value"
            ),
          },
          {
            label: "Monthly Quatre",
            ...getFieldValueXError(
              "recalculationRestFrequencyNthDayType",
              "interestRecalculationNthDayTypeOptions",
              "id",
              "value"
            ),
          },
          {
            label: "Day of the Week",
            ...getFieldValueXError(
              "recalculationRestFrequencyDayOfWeekType",
              "interestRecalculationDayOfWeekTypeOptions",
              "id",
              "value"
            ),
          },
          {
            label: "Frequency Interval for recalculation",
            ...getFieldValueXError("recalculationRestFrequencyInterval"),
          },
        ]
      )}
      {renderPreview(
        "Settings - Is Arrears recognization based on original schedule",
        2,
        [
          {
            label: "Is Arrears recognization based on original schedule",
            ...getFieldValueXError("isArrearsBasedOnOriginalSchedule"),
          },
        ]
      )}
      {renderPreview("Settings - Guarantee Requirements", 2, [
        {
          label: "Place Guarantee Funds On-Hold?",
          ...getFieldValueXError("holdGuaranteeFunds"),
        },
        {
          label: "Mandatory Guarantee: (%)",
          ...getFieldValueXError("mandatoryGuarantee"),
        },
        {
          label: "Minimum Guarantee from Own Funds: (%)",
          ...getFieldValueXError("minimumGuaranteeFromOwnFunds"),
        },
        {
          label: "Minimum Guarantee from Guarantor Funds: (%)",
          ...getFieldValueXError("minimumGuaranteeFromGuarantor"),
        },
      ])}
      {renderPreview("Settings - Loan Tranche Details", 2, [
        {
          label: "Enable Multiple Disbursals",
          ...getFieldValueXError("multiDisburseLoan"),
        },
        {
          label: "Maximum Tranche count",
          ...getFieldValueXError("maxTrancheCount"),
        },
        {
          label: "Maximum allowed outstanding balance",
          ...getFieldValueXError("outstandingLoanBalance"),
        },
      ])}
      {renderPreview("Settings - Configurable Terms and Settings", 2, [
        {
          label: "Allow overriding select terms and settings in loan accounts",
          ...getFieldValueXError("allowAttributeConfiguration"),
        },
        {
          label: "Amortization",
          ...getFieldValueXError("allowAttributeOverrides.amortizationType"),
        },
        {
          label: "Interest method",
          ...getFieldValueXError("allowAttributeOverrides.interestType"),
        },
        {
          label: "Repayment strategy",
          ...getFieldValueXError(
            "allowAttributeOverrides.transactionProcessingStrategyId"
          ),
        },
        {
          label: "Interest calculation period",
          ...getFieldValueXError(
            "allowAttributeOverrides.interestCalculationPeriodType"
          ),
        },
        {
          label: "Arrears tolerance",
          ...getFieldValueXError("allowAttributeOverrides.inArrearsTolerance"),
        },
        {
          label: "Repaid every",
          ...getFieldValueXError("allowAttributeOverrides.repaymentEvery"),
        },
        {
          label: "Moratorium",
          ...getFieldValueXError(
            "allowAttributeOverrides.graceOnPrincipalAndInterestPayment"
          ),
        },
        {
          label:
            "Number of days a loan may be overdue before moving into arrears",
          ...getFieldValueXError(
            "allowAttributeOverrides.graceOnArrearsAgeing"
          ),
        },
      ])}

      {renderArrayPreview("Charges - Loan", 3, "charges", (item) => {
        const valueXerror = getFieldValueXErrorOnObject(
          item,
          "id",
          "chargeOptions",
          "id"
        );

        if (!valueXerror?.value) {
          return null;
        }
        return [
          {
            label: "Name",
            ...getFieldValueXErrorOnObject(
              item,
              "id",
              "chargeOptions",
              "id",
              "name"
            ),
          },
          {
            label: "Type",
            ...getFieldValueXErrorOnObject(
              item,
              "id",
              "chargeOptions",
              "id",
              "chargeCalculationType.value"
            ),
          },
          {
            label: "Amount",
            ...getFieldValueXErrorOnObject(
              item,
              "id",
              "chargeOptions",
              "id",
              "amount"
            ),
          },
          {
            label: "Collected On",
            ...getFieldValueXErrorOnObject(
              item,
              "id",
              "chargeOptions",
              "id",
              "chargeTimeType.value"
            ),
          },
          {
            label: "Mode",
            ...getFieldValueXErrorOnObject(
              item,
              "id",
              "chargeOptions",
              "id",
              "chargePaymentMode.value"
            ),
          },
        ];
      })}
      {renderArrayPreview("Charges - Overdue", 3, "charges", (item) => {
        const valueXerror = getFieldValueXErrorOnObject(
          item,
          "id",
          "penaltyOptions",
          "id"
        );

        if (!valueXerror?.value) {
          return null;
        }
        return [
          {
            label: "Name",
            ...getFieldValueXErrorOnObject(
              item,
              "id",
              "penaltyOptions",
              "id",
              "name"
            ),
          },
          {
            label: "Type",
            ...getFieldValueXErrorOnObject(
              item,
              "id",
              "penaltyOptions",
              "id",
              "chargeCalculationType.value"
            ),
          },
          {
            label: "Amount",
            ...getFieldValueXErrorOnObject(
              item,
              "id",
              "penaltyOptions",
              "id",
              "amount"
            ),
          },
          {
            label: "Collected On",
            ...getFieldValueXErrorOnObject(
              item,
              "id",
              "penaltyOptions",
              "id",
              "chargeTimeType.value"
            ),
          },
          {
            label: "Mode",
            ...getFieldValueXErrorOnObject(
              item,
              "id",
              "penaltyOptions",
              "id",
              "chargePaymentMode.value"
            ),
          },
        ];
      })}

      {formik.values?.accountingRule != 1 && (
        <>
          {renderPreview("Accounting - Rule", 4, [
            {
              label: "Accounting Rule",
              ...getFieldValueXError(
                "accountingRule",
                "accountingRuleOptions",
                "id",
                "value"
              ),
            },
          ])}
          {renderPreview("Accounting - Assets", 4, [
            {
              label: "Fund source",
              ...getFieldValueXError(
                "fundSourceAccountId",
                "accountingMappingOptions.assetAccountOptions",
                "id",
                "name"
              ),
            },
            {
              label: "Loan portfolio",
              ...getFieldValueXError(
                "loanPortfolioAccountId",
                "accountingMappingOptions.assetAccountOptions",
                "id",
                "name"
              ),
            },
            {
              label: "Interest Receivable",
              ...getFieldValueXError(
                "receivableInterestAccountId",
                "accountingMappingOptions.assetAccountOptions",
                "id",
                "name"
              ),
            },
            {
              label: "Fees Receivable",
              ...getFieldValueXError(
                "receivableFeeAccountId",
                "accountingMappingOptions.assetAccountOptions",
                "id",
                "name"
              ),
            },
            {
              label: "Penalties Receivable",
              ...getFieldValueXError(
                "receivablePenaltyAccountId",
                "accountingMappingOptions.assetAccountOptions",
                "id",
                "name"
              ),
            },
            {
              label: "Transfer in suspense",
              ...getFieldValueXError(
                "transfersInSuspenseAccountId",
                "accountingMappingOptions.assetAccountOptions",
                "id",
                "name"
              ),
            },
          ])}
          {renderPreview("Accounting - Income", 4, [
            {
              label: "Income from Interest",
              ...getFieldValueXError(
                "interestOnLoanAccountId",
                "accountingMappingOptions.incomeAccountOptions",
                "id",
                "name"
              ),
            },
            {
              label: "Income from fees",
              ...getFieldValueXError(
                "incomeFromFeeAccountId",
                "accountingMappingOptions.incomeAccountOptions",
                "id",
                "name"
              ),
            },
            {
              label: "Income from penalties",
              ...getFieldValueXError(
                "incomeFromPenaltyAccountId",
                "accountingMappingOptions.incomeAccountOptions",
                "id",
                "name"
              ),
            },
            {
              label: "Income from Recovery Repayments",
              ...getFieldValueXError(
                "incomeFromRecoveryAccountId",
                "accountingMappingOptions.incomeAccountOptions",
                "id",
                "name"
              ),
            },
          ])}
          {renderPreview("Accounting - Expenses", 4, [
            {
              label: "Losses written off",
              ...getFieldValueXError(
                "writeOffAccountId",
                "accountingMappingOptions.expenseAccountOptions",
                "id",
                "name"
              ),
            },
          ])}
          {renderPreview("Accounting - Liabilities", 4, [
            {
              label: "Over payment liability",
              ...getFieldValueXError(
                "overpaymentLiabilityAccountId",
                "accountingMappingOptions.liabilityAccountOptions",
                "id",
                "name"
              ),
            },
          ])}
        </>
      )}
      {/* {renderPreview("Accounting - Advanced Accounting Rule", 4, [
        {
          label: "Accounting Rule",
          ...getFieldValueXError("advancedAccountingRules"),
        },
      ])}
      {renderArrayPreview(
        "Accounting - Advanced Accounting Rule - Configure Fund Sources for Payment Channels",
        4,
        "paymentChannelToFundSourceMappings",
        (item) => [
          {
            label: "Payment Type",
            ...getFieldValueXErrorOnObject(
              item,
              "paymentTypeId",
              "paymentTypeOptions",
              "id",
              "name"
            ),
          },
          {
            label: "Fund Source",
            ...getFieldValueXErrorOnObject(
              item,
              "fundSourceAccountId",
              "accountingMappingOptions.assetAccountOptions",
              "id",
              "name"
            ),
          },
        ]
      )}
      {renderArrayPreview(
        "Accounting - Advanced Accounting Rule - Map Fees to Income Accounts",
        4,
        "feeToIncomeAccountMappings",
        (item) => {
          const sourceFromIncomeAccountOptions = getFieldValueXErrorOnObject(
            item,
            "incomeAccountId",
            "accountingMappingOptions.incomeAccountOptions",
            "id",
            "name"
          );

          const sourceFromLiabilityAccountOptions = getFieldValueXErrorOnObject(
            item,
            "incomeAccountId",
            "accountingMappingOptions.liabilityAccountOptions",
            "id",
            "name"
          );

          const source = sourceFromIncomeAccountOptions.value
            ? sourceFromIncomeAccountOptions
            : sourceFromLiabilityAccountOptions;

          return [
            {
              label: "Payment Type",
              ...getFieldValueXErrorOnObject(
                item,
                "chargeId",
                "chargeOptions",
                "id",
                "name"
              ),
            },
            {
              label: "Fund Source",
              ...source,
            },
          ];
        }
      )}
      {renderArrayPreview(
        "Accounting - Advanced Accounting Rule - Map Penalties to Specific Income Accounts",
        4,
        "penaltyToIncomeAccountMappings",
        (item) => [
          {
            label: "Penalty",
            ...getFieldValueXErrorOnObject(
              item,
              "chargeId",
              "penaltyOptions",
              "id",
              "name"
            ),
          },
          {
            label: "Income Account",
            ...getFieldValueXErrorOnObject(
              item,
              "incomeAccountId",
              "accountingMappingOptions.incomeAccountOptions",
              "id",
              "name"
            ),
          },
        ]
      )} */}
    </div>
  );
}

export default LoanProductCreateEditPreview;
