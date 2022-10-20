import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Icon,
  MenuItem,
  IconButton,
} from "@mui/material";
import CurrencyTextField from "common/CurrencyTextField";
import TextFieldLabelHelpTooltip from "common/TextFieldLabelXHelpTooltip";
import { getTextFieldFormikProps } from "common/Utils";

function LoanProductCreateEditTerms({ formik, loanProductTemplate }) {
  function handleAddLoanCycle(key) {
    formik.setFieldValue(key, [
      ...formik.values[key],
      {
        valueConditionType: "",
        borrowerCycleNumber: "",
        minValue: "",
        defaultValue: "",
        maxValue: "",
      },
    ]);
  }

  // function handleToggleTermsVaryBasedOnLoanCycle(e) {
  //   formik.setFieldValue("useBorrowerCycle", e.target.checked);
  //   if (
  //     e.target.checked &&
  //     !formik.values.principalVariationsForBorrowerCycle?.length
  //   ) {
  //     handleAddLoanCycle("principalVariationsForBorrowerCycle");
  //   }
  //   if (
  //     e.target.checked &&
  //     !formik.values.numberOfRepaymentVariationsForBorrowerCycle?.length
  //   ) {
  //     handleAddLoanCycle("numberOfRepaymentVariationsForBorrowerCycle");
  //   }
  //   if (
  //     e.target.checked &&
  //     !formik.values.interestRateVariationsForBorrowerCycle?.length
  //   ) {
  //     handleAddLoanCycle("interestRateVariationsForBorrowerCycle");
  //   }
  // }

  function renderSingleLoanCycle(
    title,
    titleTooltip,
    minKey,
    defaultKey,
    maxKey
  ) {
    return (
      <>
        <Typography className="font-bold" gutterBottom>
          <TextFieldLabelHelpTooltip label={title} title={titleTooltip} />
        </Typography>
        <div
          className="grid sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-4"
          style={{ maxWidth: 700 }}
        >
          <CurrencyTextField
            code={formik.values?.currencyCode}
            fullWidth
            label="Minimum"
            {...getTextFieldFormikProps(formik, minKey)}
          />
          <CurrencyTextField
            code={formik.values?.currencyCode}
            fullWidth
            label="Default"
            {...getTextFieldFormikProps(formik, defaultKey)}
          />
          <CurrencyTextField
            code={formik.values?.currencyCode}
            fullWidth
            label="Maximum"
            {...getTextFieldFormikProps(formik, maxKey)}
          />
        </div>
      </>
    );
  }

  function renderMultipleLoanCycle(formikKey, title, titleTooltip) {
    return null;
    // eslint-disable-next-line
    return (
      <div className="mb-4">
        {formik.values?.useBorrowerCycle && (
          <>
            <div className="flex items-center gap-4 mt-4 mb-2">
              <Typography className="font-bold">
                <TextFieldLabelHelpTooltip label={title} title={titleTooltip} />
              </Typography>
              <Button
                startIcon={<Icon>add</Icon>}
                onClick={() => handleAddLoanCycle(formikKey)}
              >
                Add
              </Button>
            </div>
            {formik.values[formikKey]?.map((cycle, index) => {
              const valueKey = `${formikKey}[${index}]`;
              return (
                <div
                  key={index}
                  className="relative grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 p-2 mb-2"
                >
                  {formik.values[formikKey]?.length > 1 && (
                    <div className="absolute -right-4 -top-4">
                      <IconButton
                        onClick={() => {
                          const newLoanCycles = [...formik.values[formikKey]];
                          newLoanCycles.splice(index, 1);
                          formik.setFieldValue(formikKey, newLoanCycles);
                        }}
                      >
                        <Icon>cancel</Icon>
                      </IconButton>
                    </div>
                  )}
                  <TextField
                    fullWidth
                    select
                    label="Condition"
                    {...getTextFieldFormikProps(
                      formik,
                      valueKey + ".valueConditionType"
                    )}
                  >
                    {loanProductTemplate?.valueConditionTypeOptions?.map(
                      (option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.value}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                  <TextField
                    fullWidth
                    type="number"
                    label="Loan Cycle"
                    {...getTextFieldFormikProps(
                      formik,
                      valueKey + ".borrowerCycleNumber"
                    )}
                  />
                  <CurrencyTextField
                    code={formik.values.currencyCode}
                    fullWidth
                    label="Minimum"
                    {...getTextFieldFormikProps(formik, valueKey + ".minValue")}
                  />
                  <CurrencyTextField
                    code={formik.values.currencyCode}
                    fullWidth
                    label="Default"
                    {...getTextFieldFormikProps(
                      formik,
                      valueKey + ".defaultValue"
                    )}
                  />
                  <CurrencyTextField
                    code={formik.values.currencyCode}
                    fullWidth
                    label="Maximum"
                    {...getTextFieldFormikProps(formik, valueKey + ".maxValue")}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold mb-4" gutterBottom>
          Loan Circle
        </Typography>
        {/* <FormControlLabel
          className="mb-4"
          label={
            <TextFieldLabelHelpTooltip
              label="Terms vary based on loan cycle"
              title="Check this checkbox if terms vary based on the Loan Cycle."
            />
          }
          control={
            <Checkbox
              checked={formik.values?.useBorrowerCycle}
              onChange={handleToggleTermsVaryBasedOnLoanCycle}
            />
          }
        /> */}
        {renderSingleLoanCycle(
          "Principals",
          "These fields are used to define the minimum, default, and maximum principal allowed for the loan product.",
          "minPrincipal",
          "principal",
          "maxPrincipal"
        )}
        {renderMultipleLoanCycle(
          "principalVariationsForBorrowerCycle",
          "Principal by Loan Cycles",
          "These fields are used to define the minimum, default, and maximum principal allowed for the loan product based on the Loan Cycle."
        )}

        <Typography className="font-bold" gutterBottom>
          <TextFieldLabelHelpTooltip
            label="Number of Repayments"
            title="These fields are used to define the minimum, default, and maximum number of repayments allowed for the loan product."
          />
        </Typography>
        <div
          className="grid sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-4"
          style={{ maxWidth: 700 }}
        >
          <TextField
            fullWidth
            label="Minimum"
            {...getTextFieldFormikProps(formik, "minNumberOfRepayments")}
            onChange={(e) => {
              const value = e.target.value;
              formik.setFieldValue("minNumberOfRepayments", value);
              if (value > formik.values.numberOfRepayments) {
                formik.setFieldValue("numberOfRepayments", value);
              }
              if (value > formik.values.maxNumberOfRepayments) {
                formik.setFieldValue("maxNumberOfRepayments", value);
              }
            }}
            type="number"
          />
          <TextField
            fullWidth
            label="Default"
            {...getTextFieldFormikProps(formik, "numberOfRepayments")}
            onChange={(e) => {
              const value = e.target.value;
              formik.setFieldValue("numberOfRepayments", value);
              if (value > formik.values.maxNumberOfRepayments) {
                formik.setFieldValue("maxNumberOfRepayments", value);
              }
            }}
            type="number"
          />
          <TextField
            fullWidth
            label="Maximum"
            {...getTextFieldFormikProps(formik, "maxNumberOfRepayments")}
            type="number"
          />
        </div>

        {renderMultipleLoanCycle(
          "numberOfRepaymentVariationsForBorrowerCycle",
          "Number of Repayments by loan cycle",
          "These fields are used to define the minimum, default, and maximum number of repayments allowed for the loan product based on the Loan Cycle."
        )}

        {!formik.values.isEqualAmortization && (
          <>
            {/* <FormControlLabel
              className="mb-4"
              label="Is Linked to Floating Interest Rates?"
              control={
                <Checkbox
                  {...getTextFieldFormikProps(
                    formik,
                    "isLinkedToFloatingInterestRates"
                  )}
                />
              }
            /> */}

            {formik.values?.isLinkedToFloatingInterestRates ? (
              <>
                <Typography className="font-bold" gutterBottom>
                  <TextFieldLabelHelpTooltip
                    label="Floating interest rate"
                    title="These fields are used to define the minimum, default, maximum, and period for the floating interest rate allowed for the loan product. The minimum, default, and maximum floating interest rates are expressed as percentages."
                  />
                </Typography>
                <div
                  className="grid sm:grid-cols-3 lg:grid-cols-3 gap-4"
                  style={{ maxWidth: 700 }}
                >
                  <TextField
                    fullWidth
                    select
                    type="number"
                    label="Floating Rate"
                    {...getTextFieldFormikProps(formik, "floatingRatesId")}
                  >
                    {loanProductTemplate?.floatingRateOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <CurrencyTextField
                    code={formik.values?.currencyCode}
                    fullWidth
                    label="Differential Rate"
                    {...getTextFieldFormikProps(
                      formik,
                      "interestRateDifferential"
                    )}
                  />
                  <FormControlLabel
                    className="mb-4"
                    label="Is Floating Calculation Allowed?"
                    control={
                      <Checkbox
                        checked={
                          formik.values
                            ?.isFloatingInterestRateCalculationAllowed
                        }
                        onChange={(e) =>
                          formik.setFieldValue(
                            "isFloatingInterestRateCalculationAllowed",
                            e.target.checked
                          )
                        }
                      />
                    }
                  />
                  <CurrencyTextField
                    code={formik.values?.currencyCode}
                    fullWidth
                    label="Minimum"
                    {...getTextFieldFormikProps(
                      formik,
                      "minDifferentialLendingRate"
                    )}
                  />
                  <CurrencyTextField
                    code={formik.values?.currencyCode}
                    fullWidth
                    label="Default"
                    {...getTextFieldFormikProps(
                      formik,
                      "defaultDifferentialLendingRate"
                    )}
                  />
                  <CurrencyTextField
                    code={formik.values?.currencyCode}
                    fullWidth
                    label="Maximum"
                    {...getTextFieldFormikProps(
                      formik,
                      "maxDifferentialLendingRate"
                    )}
                  />
                </div>
              </>
            ) : (
              <>
                <Typography className="font-bold" gutterBottom>
                  <TextFieldLabelHelpTooltip
                    label="Nominal interest rate"
                    title="These fields are used to define the minimum, default, maximum, and period for the nominal interest rate allowed for the loan product. The minimum, default, and maximum nominal interest rates are expressed as percentages."
                  />
                </Typography>
                <div
                  className="grid sm:grid-cols-4 lg:grid-cols-4 gap-4 mb-4"
                  style={{ maxWidth: 800 }}
                >
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum"
                    {...getTextFieldFormikProps(
                      formik,
                      "minInterestRatePerPeriod"
                    )}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("minInterestRatePerPeriod", value);
                      if (value > formik.values.interestRatePerPeriod) {
                        formik.setFieldValue("interestRatePerPeriod", value);
                      }
                      if (value > formik.values.maxInterestRatePerPeriod) {
                        formik.setFieldValue("maxInterestRatePerPeriod", value);
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Default"
                    {...getTextFieldFormikProps(
                      formik,
                      "interestRatePerPeriod"
                    )}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("interestRatePerPeriod", value);
                      if (value > formik.values.maxInterestRatePerPeriod) {
                        formik.setFieldValue("maxInterestRatePerPeriod", value);
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum"
                    {...getTextFieldFormikProps(
                      formik,
                      "maxInterestRatePerPeriod"
                    )}
                  />
                  <TextField
                    fullWidth
                    defaultValue={
                      loanProductTemplate?.interestRateFrequencyType?.id
                    }
                    select
                    label="Frequency"
                    {...getTextFieldFormikProps(
                      formik,
                      "interestRateFrequencyType"
                    )}
                  >
                    {loanProductTemplate?.interestRateFrequencyTypeOptions?.map(
                      (option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.value}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                </div>
              </>
            )}
          </>
        )}
        {renderMultipleLoanCycle(
          "interestRateVariationsForBorrowerCycle",
          "Nominal Interest Rate by loan cycle",
          "These fields are used to define the minimum, default, maximum, and period for the nominal interest rate allowed for the loan product based on the Loan Cycle. The minimum, default, and maximum nominal interest rates are expressed as percentages."
        )}
        <Typography className="font-bold" gutterBottom>
          <TextFieldLabelHelpTooltip
            label="Repaid every"
            title="These fields are input to calculating the repayment schedule for a loan account and are used to determine when payments are due."
          />
        </Typography>
        <div
          className="grid sm:grid-cols-2 gap-4 mb-4"
          style={{ maxWidth: 400 }}
        >
          <TextField
            fullWidth
            required
            label="Count"
            {...getTextFieldFormikProps(formik, "repaymentEvery")}
            type="number"
          />
          <TextField
            fullWidth
            required
            defaultValue={loanProductTemplate?.repaymentFrequencyType?.id}
            select
            label="Frequency"
            {...getTextFieldFormikProps(formik, "repaymentFrequencyType")}
          >
            {loanProductTemplate?.repaymentFrequencyTypeOptions?.map(
              (option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.value}
                </MenuItem>
              )
            )}
          </TextField>
        </div>
        <Typography className="font-bold" gutterBottom>
          Minimum days between disbursal and first repayment date
        </Typography>
        <div className="grid sm:grid-cols-2 gap-4" style={{ maxWidth: 400 }}>
          <TextField
            fullWidth
            label="Disbursal"
            {...getTextFieldFormikProps(
              formik,
              "minimumDaysBetweenDisbursalAndFirstRepayment"
            )}
          />
        </div>
      </Paper>
    </>
  );
}

export default LoanProductCreateEditTerms;
