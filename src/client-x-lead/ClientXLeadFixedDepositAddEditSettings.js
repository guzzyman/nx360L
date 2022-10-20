import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import FormatToNumber from "common/FormatToNumber";
import { DatePicker } from "@mui/lab";
import CurrencyField from "common/CurrencyField";
import { format } from "date-fns";

function ClientXLeadFixedDepositAddEditSettings({
  formik,
  data,
  isReoccurringDeposit,
}) {
  return (
    <div className="grid gap-4">
      <Paper className="p-4 md:p-8">
        <Typography variant="h6" className="font-bold">
          Settings
        </Typography>
        <Typography variant="body2" className="mb-4" color="textSecondary">
          Kindly fill in all required information in the fixed deposit
          application form.
        </Typography>

        {/* <div className="mt-5">
          <Typography variant="h6" className="font-bold">
            Interest Transfer
          </Typography>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
            <FormControlLabel
              label="Transfer Interest to Linked Savings Account?"
              control={
                <Checkbox
                  checked={formik.values?.transferInterestToSavings}
                  onChange={(event) => {
                    formik.setFieldValue(
                      "transferInterestToSavings",
                      event.target.checked
                    );
                  }}
                  value={formik.values?.transferInterestToSavings}
                />
              }
            />

            {formik.values?.transferInterestToSavings && (
              <TextField
                required
                select
                label="Link Savings Account"
                {...getTextFieldFormikProps(formik, "linkAccountId")}
              >
                {data?.savingsAccounts &&
                  data?.savingsAccounts?.map((option, index) => (
                    <MenuItem key={index} value={option.id}>
                      {option.accountNo}
                    </MenuItem>
                  ))}
              </TextField>
            )}
          </div>
        </div> */}

        <div className="mt-5">
          <Typography variant="h6" className="font-bold">
            For Pre-mature closure
          </Typography>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
            <FormControlLabel
              label="Apply Penal Interest (less)"
              control={
                <Checkbox
                  checked={formik.values?.preClosurePenalApplicable}
                  onChange={(event) => {
                    formik.setFieldValue(
                      "preClosurePenalApplicable",
                      event.target.checked
                    );
                  }}
                  value={formik.values?.preClosurePenalApplicable}
                />
              }
            />
            <TextField
              label="Penal Interest (%)"
              InputProps={{
                inputComponent: FormatToNumber,
              }}
              {...getTextFieldFormikProps(formik, "preClosurePenalInterest")}
            />

            <TextField
              required
              select
              label="Type"
              {...getTextFieldFormikProps(
                formik,
                "preClosurePenalInterestOnTypeId"
              )}
            >
              {data?.preClosurePenalInterestOnTypeOptions &&
                data?.preClosurePenalInterestOnTypeOptions?.map(
                  (option, index) => (
                    <MenuItem key={index} value={option.id}>
                      {option.value}
                    </MenuItem>
                  )
                )}
            </TextField>

            {data?.withHoldTax && (
              <>
                <FormControlLabel
                  label="Is Withhold Tax Applicable?"
                  control={
                    <Checkbox
                      checked={formik.values?.withHoldTax}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "withHoldTax",
                          event.target.checked
                        );
                      }}
                      value={formik.values?.withHoldTax}
                    />
                  }
                />
                <TextField
                  required
                  label="Tax Group"
                  value={data?.taxGroup?.name}
                  //   {...getTextFieldFormikProps(formik, "taxGroupId")}
                />
              </>
            )}
          </div>

          {isReoccurringDeposit && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
              <FormControlLabel
                label="Is Mandatory Deposit?"
                control={
                  <Checkbox
                    checked={formik.values?.isMandatoryDeposit}
                    onChange={(event) => {
                      formik.setFieldValue(
                        "isMandatoryDeposit",
                        event.target.checked
                      );
                    }}
                    value={formik.values?.isMandatoryDeposit}
                  />
                }
              />

              <FormControlLabel
                label="Adjust advance payments towards future installments?"
                control={
                  <Checkbox
                    checked={formik.values?.adjustAdvanceTowardsFuturePayments}
                    onChange={(event) => {
                      formik.setFieldValue(
                        "adjustAdvanceTowardsFuturePayments",
                        event.target.checked
                      );
                    }}
                    value={formik.values?.adjustAdvanceTowardsFuturePayments}
                  />
                }
              />

              <FormControlLabel
                label="Allow withdrawals?"
                control={
                  <Checkbox
                    checked={formik.values?.allowWithdrawal}
                    onChange={(event) => {
                      formik.setFieldValue(
                        "allowWithdrawal",
                        event.target.checked
                      );
                    }}
                    value={formik.values?.allowWithdrawal}
                  />
                }
              />
              {/* 
              <FormControlLabel
                label="Deposit Frequency Same as Group/Center meeting"
                control={
                  <Checkbox
                    checked={formik.values?.isCalendarInherited}
                    onChange={(event) => {
                      formik.setFieldValue(
                        "isCalendarInherited",
                        event.target.checked
                      );
                    }}
                    value={formik.values?.isCalendarInherited}
                  />
                }
              /> */}

              {!formik.values?.isCalendarInherited && (
                <>
                  {/* <DatePicker
                    label="Deposit Start Date"
                    inputFormat="dd/MM/yyyy"
                    {...getTextFieldFormikProps(
                      formik,
                      "expectedFirstDepositOnDate"
                    )}
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        "expectedFirstDepositOnDate",
                        format(new Date(newValue), "dd MMMM yyyy")
                      );
                    }}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  /> */}

                  {/* <div className="grid grid-cols-1  sm:grid-cols-3 gap-2">
                    <TextField
                      required
                      label="Deposit Frequency"
                      placeholder="2"
                      {...getTextFieldFormikProps(formik, "recurringFrequency")}
                    />

                    <TextField
                      required
                      className="col-span-2"
                      label="Deposit Frequency Type"
                      select
                      {...getTextFieldFormikProps(
                        formik,
                        "recurringFrequencyType"
                      )}
                    >
                      {data?.periodFrequencyTypeOptions &&
                        data?.periodFrequencyTypeOptions?.map(
                          (frequency, i) => (
                            <MenuItem value={frequency?.id} key={i}>
                              {frequency.value}
                            </MenuItem>
                          )
                        )}
                    </TextField>
                  </div> */}
                </>
              )}

              {/* <CurrencyField
                label="Recurring Deposit Amount"
                {...formik.getFieldProps("mandatoryRecommendedDepositAmount")}
                focused={formik.values?.mandatoryRecommendedDepositAmount}
                error={
                  !!formik.touched?.mandatoryRecommendedDepositAmount &&
                  !!formik.errors?.mandatoryRecommendedDepositAmount
                }
                helperText={
                  !!formik.touched?.mandatoryRecommendedDepositAmount &&
                  formik.errors?.mandatoryRecommendedDepositAmount
                }
              /> */}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
}

export default ClientXLeadFixedDepositAddEditSettings;
