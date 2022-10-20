import { Paper, TextField, Typography, MenuItem } from "@mui/material";
import TextFieldLabelHelpTooltip from "common/TextFieldLabelXHelpTooltip";
import CurrencyTextField from "common/CurrencyTextField";
import { getTextFieldFormikProps } from "common/Utils";

function FixedDepositProductCreateEditTerms({
  formik,
  recurringDepositProductTemplate,
}) {
  return (
    <>
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Terms
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className="max-w-sm mb-4"
        >
          Ensure you enter correct information.
        </Typography>
        <div className="grid sm:grid-cols-2 gap-4" style={{ maxWidth: 500 }}>
          <CurrencyTextField
            code={formik.values?.currencyCode}
            fullWidth
            required
            label={
              <TextFieldLabelHelpTooltip
                label="Default Deposit Amount"
                title="The default deposit amount expected when a fixed deposit account based on this fixed deposit product is opened."
              />
            }
            // className="sm:col-span-2"
            {...getTextFieldFormikProps(formik, "depositAmount")}
          />
          <div />
          <CurrencyTextField
            code={formik.values?.currencyCode}
            fullWidth
            required
            label={
              <TextFieldLabelHelpTooltip
                label="Minimum Deposit Amount"
                title="The minimum deposit amount required to open a fixed deposit account based on this fixed deposit product."
              />
            }
            {...getTextFieldFormikProps(formik, "minDepositAmount")}
          />
          <CurrencyTextField
            code={formik.values?.currencyCode}
            fullWidth
            required
            label={
              <TextFieldLabelHelpTooltip
                label="Maximum Deposit Amount"
                title="The maximum deposit amount allowed when a fixed deposit account based on this fixed deposit product is opened."
              />
            }
            {...getTextFieldFormikProps(formik, "maxDepositAmount")}
          />
          <TextField
            fullWidth
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Interest compounding period"
                title="The period at which interest rate is compounded."
              />
            }
            displayEmpty
            {...getTextFieldFormikProps(
              formik,
              "interestCompoundingPeriodType"
            )}
          >
            {recurringDepositProductTemplate?.interestCompoundingPeriodTypeOptions?.map(
              (option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.value}
                </MenuItem>
              )
            )}
          </TextField>
          <TextField
            fullWidth
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Interest posting period"
                title="The period at which interest rate is posted or credited to a fixed deposit account based on this fixed deposit product."
              />
            }
            displayEmpty
            {...getTextFieldFormikProps(formik, "interestPostingPeriodType")}
          >
            {recurringDepositProductTemplate?.interestPostingPeriodTypeOptions?.map(
              (option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.value}
                </MenuItem>
              )
            )}
          </TextField>
          <TextField
            fullWidth
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Interest calculated using"
                title="The method used to calculate interest."
              />
            }
            displayEmpty
            {...getTextFieldFormikProps(formik, "interestCalculationType")}
          >
            {recurringDepositProductTemplate?.interestCalculationTypeOptions?.map(
              (option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.value}
                </MenuItem>
              )
            )}
          </TextField>
          <TextField
            fullWidth
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Days in year"
                title="The setting for number of days in year to use to calculate interest."
              />
            }
            displayEmpty
            {...getTextFieldFormikProps(
              formik,
              "interestCalculationDaysInYearType"
            )}
          >
            {recurringDepositProductTemplate?.interestCalculationDaysInYearTypeOptions?.map(
              (option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.value}
                </MenuItem>
              )
            )}
          </TextField>
        </div>
      </Paper>
    </>
  );
}

export default FixedDepositProductCreateEditTerms;
