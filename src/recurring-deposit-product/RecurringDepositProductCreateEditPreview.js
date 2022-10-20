import { Button, Paper, Typography, Icon } from "@mui/material";
import clsx from "clsx";
import { objectAccessor } from "common/Utils";

function FixedDepositProductCreateEditPreview({
  formik,
  setStep,
  recurringDepositProductTemplate,
}) {
  function getFieldValueXErrorOnObject(
    object,
    key,
    optionsKey,
    optionKey,
    optionValueKey
  ) {
    const value = optionsKey
      ? objectAccessor(
          objectAccessor(recurringDepositProductTemplate, optionsKey)?.find(
            (option) =>
              objectAccessor(option, optionKey) === objectAccessor(object, key)
          ),
          optionValueKey
        )
      : objectAccessor(object, key);
    return {
      value: typeof value === "boolean" ? (value ? "TRUE" : "FALSE") : value,
      error: !!formik.errors[key],
    };
  }

  function getFieldValueXError(key, optionsKey, optionKey, optionValueKey) {
    return getFieldValueXErrorOnObject(
      formik.values,
      key,
      optionsKey,
      optionKey,
      optionValueKey
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
      <Typography>
        {value !== undefined && value !== null && value !== "" ? value : "-"}
      </Typography>
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
      {renderPreview("Details & Currency", 0, [
        {
          label: "Product Name",
          ...getFieldValueXError("name"),
        },
        {
          label: "Short Name",
          ...getFieldValueXError("shortName"),
        },
        {
          label: "Description",
          ...getFieldValueXError("description"),
        },
        // {
        //   label: "Currency",
        //   ...getFieldValueXError("currencyCode"),
        // },
        // {
        //   label: "Decimal Places",
        //   ...getFieldValueXError("digitsAfterDecimal"),
        // },
        // {
        //   label: "Multiples Of",
        //   ...getFieldValueXError("inMultiplesOf"),
        // },
      ])}

      {renderPreview("Terms", 1, [
        {
          label: "Default Deposit Amount",
          ...getFieldValueXError("depositAmount"),
        },
        {
          label: "Minimum Deposit Amount",
          ...getFieldValueXError("minDepositAmount"),
        },
        {
          label: "Maximum Deposit Amount",
          ...getFieldValueXError("maxDepositAmount"),
        },
        {
          label: "Interest compounding period",
          ...getFieldValueXError(
            "interestCompoundingPeriodType",
            "interestCompoundingPeriodTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Interest posting period",
          ...getFieldValueXError(
            "interestPostingPeriodType",
            "interestPostingPeriodTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Interest calculated using",
          ...getFieldValueXError(
            "interestCalculationType",
            "interestCalculationTypeOptions",
            "id",
            "value"
          ),
        },
        {
          label: "Days in year",
          ...getFieldValueXError(
            "interestCalculationDaysInYearType",
            "interestCalculationDaysInYearTypeOptions",
            "id",
            "value"
          ),
        },
      ])}
      {renderPreview("Settings", 2, [
        {
          label: "Is Mandatory Deposit",
          ...getFieldValueXError("isMandatoryDeposit"),
        },
        {
          label: "Adjust advance payments toward future installments",
          ...getFieldValueXError("adjustAdvanceTowardsFuturePayments"),
        },
        {
          label: "Allow Withdrawals",
          ...getFieldValueXError("allowWithdrawal"),
        },
      ])}
      {renderPreview("Settings  - Lock-in period", 2, [
        {
          label: "Frequency",
          ...getFieldValueXError("lockinPeriodFrequency"),
        },
        {
          label: "Period",
          ...getFieldValueXError(
            "lockinPeriodFrequencyType",
            "lockinPeriodFrequencyTypeOptions",
            "id",
            "value"
          ),
        },
      ])}
      {renderPreview("Settings - Minimum Deposit Term", 2, [
        {
          label: "Frequency",
          ...getFieldValueXError("minDepositTerm"),
        },
        {
          label: "Period",
          ...getFieldValueXError(
            "minDepositTermTypeId",
            "periodFrequencyTypeOptions",
            "id",
            "value"
          ),
        },
      ])}
      {renderPreview("Settings - And thereafter, In Multiples of", 2, [
        {
          label: "Frequency",
          ...getFieldValueXError("inMultiplesOfDepositTerm"),
        },
        {
          label: "Period",
          ...getFieldValueXError(
            "inMultiplesOfDepositTermTypeId",
            "periodFrequencyTypeOptions",
            "id",
            "value"
          ),
        },
      ])}
      {renderPreview("Settings - Maximum Deposit Term", 2, [
        {
          label: "Frequency",
          ...getFieldValueXError("maxDepositTerm"),
        },
        {
          label: "Period",
          ...getFieldValueXError(
            "maxDepositTermTypeId",
            "periodFrequencyTypeOptions",
            "id",
            "value"
          ),
        },
      ])}
      {renderPreview("Settings - For Pre-mature Closure", 2, [
        {
          label: "Apply penal interest (less)",
          ...getFieldValueXError("preClosurePenalApplicable"),
        },
        {
          label: "Penal Interest",
          ...getFieldValueXError("preClosurePenalInterest"),
        },
        {
          label: "Period",
          ...getFieldValueXError(
            "preClosurePenalInterestOnTypeId",
            "preClosurePenalInterestOnTypeOptions",
            "id",
            "value"
          ),
        },
      ])}
      {renderPreview("Settings - Is Withhold tax applicable", 2, [
        {
          label: "Apply penal interest (less)",
          ...getFieldValueXError("withHoldTax"),
        },
        {
          label: "Tax Group",
          ...getFieldValueXError("taxGroupId", "taxGroupOptions", "id", "name"),
        },
      ])}

      {renderPreview("Interest Rate Chart", 3, [
        {
          label: "Apply penal interest (less)",
          ...getFieldValueXError("withHoldTax"),
        },
        {
          label: "Tax Group",
          ...getFieldValueXError("taxGroupId", "taxGroupOptions", "id", "name"),
        },
      ])}

      {renderArrayPreview("Charges", 4, "charges", (item) => {
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
      {formik.values?.accountingRule != 1 && (
        <>
          {renderPreview("Accounting - Rule", 5, [
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
          {renderPreview("Accounting - Assets", 5, [
            {
              label: "Saving reference",
              ...getFieldValueXError(
                "savingsReferenceAccountId",
                "accountingMappingOptions.assetAccountOptions",
                "id",
                "name"
              ),
            },
          ])}
          {renderPreview("Accounting - Income", 5, [
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
          ])}
          {renderPreview("Accounting - Expenses", 5, [
            {
              label: "Interest on savings",
              ...getFieldValueXError(
                "interestOnSavingsAccountId",
                "accountingMappingOptions.expenseAccountOptions",
                "id",
                "name"
              ),
            },
          ])}
          {renderPreview("Accounting - Liabilities", 5, [
            {
              label: "Saving control",
              ...getFieldValueXError(
                "savingsControlAccountId",
                "accountingMappingOptions.liabilityAccountOptions",
                "id",
                "name"
              ),
            },
            {
              label: "Savings transfers in suspense",
              ...getFieldValueXError(
                "transfersInSuspenseAccountId",
                "accountingMappingOptions.liabilityAccountOptions",
                "id",
                "name"
              ),
            },
          ])}
        </>
      )}
      {/* {renderPreview("Accounting - Advanced Accounting Rule", 5, [
        {
          label: "Accounting Rule",
          ...getFieldValueXError("advancedAccountingRules"),
        },
      ])}
      {renderArrayPreview(
        "Accounting - Advanced Accounting Rule - Configure Fund Sources for Payment Channels",
        5,
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
        5,
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
        5,
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

export default FixedDepositProductCreateEditPreview;
