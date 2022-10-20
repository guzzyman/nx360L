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

function FixedDepositProductCreateEditAccounting({
  formik,
  fixedDepositProductTemplate,
}) {
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

  console.log(formik.values?.accountingRule);

  return (
    <>
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold mb-4">
          Accounting
        </Typography>
        <RadioGroup
          row
          // defaultValue={fixedDepositProductTemplate?.accountingRule?.id}
          {...getTextFieldFormikProps(formik, "accountingRule")}
        >
          {fixedDepositProductTemplate?.accountingRuleOptions
            ?.slice?.(0, 2)
            ?.map((rule) => (
              <FormControlLabel
                name="accountingRule"
                key={rule.id}
                value={rule.id}
                control={<Radio />}
                label={rule.value.replace(/(?<=\w)\w+/g, (match) =>
                  match.toUpperCase()
                )}
              />
            ))}
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
                    label="Saving reference"
                    title="An Asset account (typically a Cash account), to which the amount is debited when a deposit is made by the account holder and credit when the account holder makes a withdrawal"
                  />
                }
                {...getTextFieldFormikProps(
                  formik,
                  "savingsReferenceAccountId"
                )}
              >
                {fixedDepositProductTemplate?.accountingMappingOptions?.assetAccountOptions?.map(
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
                    label="Income from fees"
                    title="An Income account which is credited when a fee is paid by account holder on this account"
                  />
                }
                {...getTextFieldFormikProps(formik, "incomeFromFeeAccountId")}
              >
                {fixedDepositProductTemplate?.accountingMappingOptions?.incomeAccountOptions?.map(
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
                {fixedDepositProductTemplate?.accountingMappingOptions?.incomeAccountOptions?.map(
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
                    label="Interest on savings"
                    title="An Expense account, which is debited when interest is due to be paid to the customer"
                  />
                }
                {...getTextFieldFormikProps(
                  formik,
                  "interestOnSavingsAccountId"
                )}
              >
                {fixedDepositProductTemplate?.accountingMappingOptions?.expenseAccountOptions?.map(
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
                    label="Saving control"
                    title="A Liability account which denotes the Savings deposit accounts portfolio and is credited when a deposit is made and debited when a withdrawal is done"
                  />
                }
                {...getTextFieldFormikProps(formik, "savingsControlAccountId")}
              >
                {fixedDepositProductTemplate?.accountingMappingOptions?.liabilityAccountOptions?.map(
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
                    label="Savings transfers in suspense"
                    title="An Asset account that is used a suspense account for tracking Portfolio of Loans under transfer"
                  />
                }
                {...getTextFieldFormikProps(
                  formik,
                  "transfersInSuspenseAccountId"
                )}
              >
                {fixedDepositProductTemplate?.accountingMappingOptions?.liabilityAccountOptions?.map(
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
                          {fixedDepositProductTemplate?.paymentTypeOptions?.map(
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
                          {fixedDepositProductTemplate?.accountingMappingOptions?.assetAccountOptions?.map(
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
                          {fixedDepositProductTemplate?.chargeOptions?.map(
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
                          {[
                            fixedDepositProductTemplate
                              ?.accountingMappingOptions.incomeAccountOptions ||
                              [],
                            fixedDepositProductTemplate
                              ?.accountingMappingOptions
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
                          {fixedDepositProductTemplate?.penaltyOptions?.map(
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
                          {fixedDepositProductTemplate?.accountingMappingOptions?.incomeAccountOptions?.map(
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

export default FixedDepositProductCreateEditAccounting;
