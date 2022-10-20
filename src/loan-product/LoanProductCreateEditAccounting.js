import {
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  MenuItem,
  RadioGroup,
  Radio,
  IconButton,
  Icon,
  Button,
} from "@mui/material";
import TextFieldLabelHelpTooltip from "common/TextFieldLabelXHelpTooltip";
import {
  getTextFieldFormikProps,
  getCheckFieldFormikProps,
} from "common/Utils";

function LoanProductCreateEditAccounting({ formik, loanProductTemplate }) {
  function handleAddConfiguration(key, newItem) {
    formik.setFieldValue(key, [...formik.values[key], newItem]);
  }

  function renderConfiguration(title, configFormikKey, newItem, content) {
    return (
      <>
        <div
          className="flex items-center gap-4 mt-4 mb-2"
          style={{ maxWidth: 500 }}
        >
          <Typography className="font-bold">{title}</Typography>
          <Button
            startIcon={<Icon>add</Icon>}
            onClick={() => handleAddConfiguration(configFormikKey, newItem)}
          >
            Add
          </Button>
        </div>
        {formik.values[configFormikKey]?.map((item, index) => {
          const valueKey = `${configFormikKey}[${index}]`;
          return (
            <div
              key={index}
              className="relative grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 p-2 mb-2"
            >
              {formik.values[configFormikKey]?.length > 1 && (
                <div className="absolute -right-4 -top-4">
                  <IconButton
                    onClick={() => {
                      const newConfig = [...formik.values[configFormikKey]];
                      newConfig.splice(index, 1);
                      formik.setFieldValue(configFormikKey, newConfig);
                    }}
                  >
                    <Icon>cancel</Icon>
                  </IconButton>
                </div>
              )}
              {content(item, valueKey, index)}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold mb-4">
          Accounting
        </Typography>
        <RadioGroup
          row
          defaultValue={loanProductTemplate?.accountingRule?.id}
          {...getTextFieldFormikProps(formik, "accountingRule")}
        >
          {loanProductTemplate?.accountingRuleOptions?.map((rule) => (
            <FormControlLabel
              key={rule.id}
              value={rule.id}
              control={<Radio />}
              label={rule.value.replace(/(?<=\w)\w+/g, (match) =>
                match.toUpperCase()
              )}
            />
          ))}

          {/* <FormControlLabel value="none" control={<Radio />} label="None" />
          <FormControlLabel value="cash" control={<Radio />} label="Cash" />
          <FormControlLabel
            value="accrual-periodic"
            control={<Radio />}
            label="Accrual (Periodic)"
          />
          <FormControlLabel
            value="accrual-upfront"
            control={<Radio />}
            label="Accrual (Upfront)"
          /> */}
        </RadioGroup>
      </Paper>
      {formik.values?.accountingRule != 1 && (
        <>
          <Paper className="p-4 mb-4">
            <Typography variant="h6" className="font-bold mb-4">
              Assets
            </Typography>
            <div
              className="grid sm:grid-cols-2 gap-4"
              style={{ maxWidth: 500 }}
            >
              <TextField
                fullWidth
                select
                label={
                  <TextFieldLabelHelpTooltip
                    label="Fund source"
                    title="an Asset account(typically Bank or cash) that is debited during repayments/payments an credited using disbursals."
                  />
                }
                {...getTextFieldFormikProps(formik, "fundSourceAccountId")}
              >
                {loanProductTemplate?.accountingMappingOptions?.assetAccountOptions?.map(
                  (option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  )
                )}
              </TextField>
              <TextField
                fullWidth
                select
                label={
                  <TextFieldLabelHelpTooltip
                    label="Loan portfolio"
                    title="an Asset account that is debited during disbursement and credited during principal repayment/writeoff."
                  />
                }
                {...getTextFieldFormikProps(formik, "loanPortfolioAccountId")}
              >
                {loanProductTemplate?.accountingMappingOptions?.assetAccountOptions?.map(
                  (option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  )
                )}
              </TextField>

              {(formik.values.accountingRule === 3 ||
                formik.values.accountingRule === 4) && (
                <>
                  <TextField
                    fullWidth
                    select
                    label={
                      <TextFieldLabelHelpTooltip
                        label="Interest Receivable"
                        title="an Asset account that is used to accrue interest"
                      />
                    }
                    {...getTextFieldFormikProps(
                      formik,
                      "receivableInterestAccountId"
                    )}
                  >
                    {loanProductTemplate?.accountingMappingOptions?.assetAccountOptions?.map(
                      (option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                  <TextField
                    fullWidth
                    select
                    label={
                      <TextFieldLabelHelpTooltip
                        label="Fees Receivable"
                        title="an Asset account that is used to accrue fees"
                      />
                    }
                    {...getTextFieldFormikProps(
                      formik,
                      "receivableFeeAccountId"
                    )}
                  >
                    {loanProductTemplate?.accountingMappingOptions?.assetAccountOptions?.map(
                      (option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                  <TextField
                    fullWidth
                    select
                    label={
                      <TextFieldLabelHelpTooltip
                        label="Penalties Receivable"
                        title="an Asset account that is used to accrue penalties"
                      />
                    }
                    {...getTextFieldFormikProps(
                      formik,
                      "receivablePenaltyAccountId"
                    )}
                  >
                    {loanProductTemplate?.accountingMappingOptions?.assetAccountOptions?.map(
                      (option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                </>
              )}

              <TextField
                fullWidth
                select
                label={
                  <TextFieldLabelHelpTooltip
                    label="Transfer in suspense"
                    title="an Asset account that is used a suspense account for tracking portfolios of loans under transfer."
                  />
                }
                {...getTextFieldFormikProps(
                  formik,
                  "transfersInSuspenseAccountId"
                )}
              >
                {loanProductTemplate?.accountingMappingOptions?.assetAccountOptions?.map(
                  (option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  )
                )}
              </TextField>
            </div>
          </Paper>

          <Paper className="p-4 mb-4">
            <Typography variant="h6" className="font-bold mb-4">
              Income
            </Typography>
            <div
              className="grid sm:grid-cols-2 gap-4"
              style={{ maxWidth: 500 }}
            >
              <TextField
                fullWidth
                select
                label={
                  <TextFieldLabelHelpTooltip
                    label="Income from Interest"
                    title="an Income account that is credited during interest payment."
                  />
                }
                {...getTextFieldFormikProps(formik, "interestOnLoanAccountId")}
              >
                {loanProductTemplate?.accountingMappingOptions?.incomeAccountOptions?.map(
                  (option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  )
                )}
              </TextField>
              <TextField
                fullWidth
                select
                label={
                  <TextFieldLabelHelpTooltip
                    label="Income from fees"
                    title="An Income account which is credited when a fee is paid by account holder on this account"
                  />
                }
                {...getTextFieldFormikProps(formik, "incomeFromFeeAccountId")}
              >
                {loanProductTemplate?.accountingMappingOptions?.incomeAccountOptions?.map(
                  (option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  )
                )}
              </TextField>
              <TextField
                fullWidth
                select
                label={
                  <TextFieldLabelHelpTooltip
                    label="Income from penalties"
                    title="An Income account, which is credited when a penalty is paid by account holder on this account"
                  />
                }
                {...getTextFieldFormikProps(
                  formik,
                  "incomeFromPenaltyAccountId"
                )}
              >
                {loanProductTemplate?.accountingMappingOptions?.incomeAccountOptions?.map(
                  (option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  )
                )}
              </TextField>
              <TextField
                fullWidth
                select
                label={
                  <TextFieldLabelHelpTooltip
                    label="Income from Recovery Repayments"
                    title="an Income account that is credited during Recovery Repayment."
                  />
                }
                {...getTextFieldFormikProps(
                  formik,
                  "incomeFromRecoveryAccountId"
                )}
              >
                {loanProductTemplate?.accountingMappingOptions?.incomeAccountOptions?.map(
                  (option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  )
                )}
              </TextField>
            </div>
          </Paper>

          <Paper className="p-4 mb-4">
            <Typography variant="h6" className="font-bold mb-4">
              Expenses
            </Typography>
            <div
              className="grid sm:grid-cols-2 gap-4"
              style={{ maxWidth: 500 }}
            >
              <TextField
                fullWidth
                select
                label={
                  <TextFieldLabelHelpTooltip
                    label="Losses written off"
                    title="An expense account that is debited on principal writeoff (also debited in the events of interest, fee and penalty written-off in case of accrual based accounting.)"
                  />
                }
                {...getTextFieldFormikProps(formik, "writeOffAccountId")}
              >
                {loanProductTemplate?.accountingMappingOptions?.expenseAccountOptions?.map(
                  (option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  )
                )}
              </TextField>
            </div>
          </Paper>

          <Paper className="p-4 mb-4">
            <Typography variant="h6" className="font-bold mb-4">
              Liabilities
            </Typography>
            <div
              className="grid sm:grid-cols-2 gap-4"
              style={{ maxWidth: 500 }}
            >
              <TextField
                fullWidth
                select
                label={
                  <TextFieldLabelHelpTooltip
                    label="Over payment liability"
                    title="an Liability account that is credited on overpayments and credited when refunds are made to client."
                  />
                }
                {...getTextFieldFormikProps(
                  formik,
                  "overpaymentLiabilityAccountId"
                )}
              >
                {loanProductTemplate?.accountingMappingOptions?.liabilityAccountOptions?.map(
                  (option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  )
                )}
              </TextField>
            </div>
          </Paper>

          {/* <Paper className="p-4 mb-4">
            <Typography variant="h6" className="font-bold mb-4">
              Advanced Accounting Rule
              <Checkbox
                {...getCheckFieldFormikProps(formik, "advancedAccountingRules")}
              />
            </Typography>
            {formik.values.advancedAccountingRules && (
              <>
                {renderConfiguration(
                  "Configure Fund Sources for Payment Channels",
                  "paymentChannelToFundSourceMappings",
                  { paymentTypeId: "", fundSourceAccountId: "" },
                  (_, valueKey) => {
                    return (
                      <>
                        <TextField
                          fullWidth
                          select
                          label="Payment Type"
                          {...getTextFieldFormikProps(
                            formik,
                            valueKey + ".paymentTypeId"
                          )}
                        >
                          {loanProductTemplate?.paymentTypeOptions?.map(
                            (option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                        <TextField
                          fullWidth
                          select
                          label="Fund Source"
                          {...getTextFieldFormikProps(
                            formik,
                            valueKey + ".fundSourceAccountId"
                          )}
                        >
                          {loanProductTemplate?.accountingMappingOptions?.assetAccountOptions?.map(
                            (option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      </>
                    );
                  }
                )}
                {renderConfiguration(
                  "Map Fees to Income Accounts",
                  "feeToIncomeAccountMappings",
                  { chargeId: "", incomeAccountId: "" },
                  (_, valueKey) => {
                    return (
                      <>
                        <TextField
                          fullWidth
                          select
                          label="Fees"
                          {...getTextFieldFormikProps(
                            formik,
                            valueKey + ".chargeId"
                          )}
                        >
                          {loanProductTemplate?.chargeOptions?.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          fullWidth
                          select
                          label="Income Account"
                          {...getTextFieldFormikProps(
                            formik,
                            valueKey + ".incomeAccountId"
                          )}
                        >
                          {[
                            loanProductTemplate?.accountingMappingOptions
                              .incomeAccountOptions || [],
                            loanProductTemplate?.accountingMappingOptions
                              ?.liabilityAccountOptions || [],
                          ]
                            .flat()
                            ?.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      </>
                    );
                  }
                )}
                {renderConfiguration(
                  "Map Penalties to Specific Income Accounts",
                  "penaltyToIncomeAccountMappings",
                  { chargeId: "", incomeAccountId: "" },
                  (_, valueKey) => {
                    return (
                      <>
                        <TextField
                          fullWidth
                          select
                          label="Penalty"
                          {...getTextFieldFormikProps(
                            formik,
                            valueKey + ".chargeId"
                          )}
                        >
                          {loanProductTemplate?.penaltyOptions?.map(
                            (option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                        <TextField
                          fullWidth
                          select
                          label="Income Account"
                          {...getTextFieldFormikProps(
                            formik,
                            valueKey + ".incomeAccountId"
                          )}
                        >
                          {loanProductTemplate?.accountingMappingOptions?.incomeAccountOptions?.map(
                            (option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      </>
                    );
                  }
                )}
              </>
            )}
          </Paper> */}
        </>
      )}
    </>
  );
}

export default LoanProductCreateEditAccounting;
