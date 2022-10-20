import {
  Paper,
  TextField,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import TextFieldLabelHelpTooltip from "common/TextFieldLabelXHelpTooltip";
import {
  getCheckFieldFormikProps,
  getTextFieldFormikProps,
} from "common/Utils";

function FixedDepositProductCreateEditSettings({
  formik,
  recurringDepositProductTemplate,
}) {
  function renderCountPeriod(
    label,
    tooltipTitle,
    frequencyKey,
    frequencyTypeKey,
    frequencyTypeOptionKey
  ) {
    return (
      <>
        <Typography className="font-bold" gutterBottom>
          <TextFieldLabelHelpTooltip label={label} title={tooltipTitle} />
        </Typography>
        <div
          className="grid sm:grid-cols-2 gap-4 mb-4"
          style={{ maxWidth: 500 }}
        >
          <TextField
            fullWidth
            required
            label="Frequency"
            {...getTextFieldFormikProps(formik, frequencyKey)}
          />
          <TextField
            fullWidth
            select
            label="Period"
            displayEmpty
            {...getTextFieldFormikProps(formik, frequencyTypeKey)}
          >
            {recurringDepositProductTemplate?.[frequencyTypeOptionKey]?.map(
              (option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.value}
                </MenuItem>
              )
            )}
          </TextField>
        </div>
      </>
    );
  }

  return (
    <>
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Settings
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className="max-w-sm mb-4"
        >
          Ensure you enter correct information.
        </Typography>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <FormControlLabel
            label={
              <TextFieldLabelHelpTooltip
                label="Is Mandatory Deposit"
                title="The value identifies whether the recurring deposit is Mandatory or Voluntary."
              />
            }
            control={
              <Checkbox {...getCheckFieldFormikProps(formik, "isMandatoryDeposit")} />
            }
          />
          <FormControlLabel
            label={
              <TextFieldLabelHelpTooltip
                label="Adjust advance payments toward future installments"
                title="The value indicates whether advance payments should be adjusted towards future installment."
              />
            }
            control={
              <Checkbox {...getCheckFieldFormikProps(formik, "adjustAdvanceTowardsFuturePayments")} />
            }
          />
          <FormControlLabel
            label={
              <TextFieldLabelHelpTooltip
                label="Allow Withdrawals"
                title="The value indicates whether withdraws are allowed for this recurring deposit product."
              />
            }
            control={
              <Checkbox {...getCheckFieldFormikProps(formik, "allowWithdrawal")} />
            }
          />
        </div>
        {renderCountPeriod(
          "Lock-in period",
          "A period of time during which a fixed deposit account based on this fixed deposit product will be locked-in after it is opened.",
          "lockinPeriodFrequency",
          "lockinPeriodFrequencyType",
          "lockinPeriodFrequencyTypeOptions"
        )}
        {renderCountPeriod(
          "Minimum Deposit Term",
          "The minimum length of time the funds must remain in the fixed deposit account to earn the full interest income.",
          "minDepositTerm",
          "minDepositTermTypeId",
          "periodFrequencyTypeOptions"
        )}
        {renderCountPeriod(
          "And thereafter, In Multiples of",
          "After the minimum deposit term has passed, additional deposit durations may be specified.",
          "inMultiplesOfDepositTerm",
          "inMultiplesOfDepositTermTypeId",
          "periodFrequencyTypeOptions"
        )}
        {renderCountPeriod(
          "Maximum Deposit Term",
          "The maximum length of time funds may be deposited in a fixed deposit account based on this fixed deposit product.",
          "maxDepositTerm",
          "maxDepositTermTypeId",
          "periodFrequencyTypeOptions"
        )}
        <>
          <Typography className="font-bold" gutterBottom>
            <TextFieldLabelHelpTooltip
              label="For Pre-mature Closure"
              title="This sections defines an interest penalty for pre-mature closure."
            />
          </Typography>
          <div
            className="grid sm:grid-cols-3 gap-4 mb-4"
            style={{ maxWidth: 750 }}
          >
            <FormControlLabel
              label="Apply penal interest (less)"
              control={
                <Checkbox
                  {...getCheckFieldFormikProps(
                    formik,
                    "preClosurePenalApplicable"
                  )}
                />
              }
            />
            {!!formik.values?.preClosurePenalApplicable && (
              <>
                <TextField
                  fullWidth
                  required
                  label="Penal Interest"
                  {...getTextFieldFormikProps(
                    formik,
                    "preClosurePenalInterest"
                  )}
                />
                <TextField
                  fullWidth
                  select
                  label="Period"
                  displayEmpty
                  {...getTextFieldFormikProps(
                    formik,
                    "preClosurePenalInterestOnTypeId"
                  )}
                >
                  {recurringDepositProductTemplate?.preClosurePenalInterestOnTypeOptions?.map(
                    (option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </>
            )}
          </div>
        </>
        <>
          <Typography className="font-bold" gutterBottom>
            <TextFieldLabelHelpTooltip
              label="Withhold Tax"
              title="An boolean flag to attach  taxes to interest posting"
            />
          </Typography>
          <div
            className="grid sm:grid-cols-2 gap-4 mb-4"
            style={{ maxWidth: 500 }}
          >
            <FormControlLabel
              label="Is Withhold tax applicable"
              control={
                <Checkbox
                  {...getCheckFieldFormikProps(formik, "withHoldTax")}
                />
              }
            />
            {!!formik.values?.withHoldTax && (
              <TextField
                fullWidth
                select
                label="Tax Group"
                displayEmpty
                {...getTextFieldFormikProps(formik, "taxGroupId")}
              >
                {recurringDepositProductTemplate?.taxGroupOptions?.map(
                  (option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  )
                )}
              </TextField>
            )}
          </div>
        </>
      </Paper>
    </>
  );
}

export default FixedDepositProductCreateEditSettings;
