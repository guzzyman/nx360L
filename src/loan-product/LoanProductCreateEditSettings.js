import {
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import CurrencyTextField from "common/CurrencyTextField";
import TextFieldLabelHelpTooltip from "common/TextFieldLabelXHelpTooltip";
import {
  getCheckFieldFormikProps,
  getTextFieldFormikProps,
} from "common/Utils";
import { useMemo } from "react";

function LoanProductCreateEditSettings({ formik, loanProductTemplate }) {
  const normalizedVendorMethodOptions = useMemo(
    () =>
      loanProductTemplate?.vendorMethodOptions?.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {}),
    [loanProductTemplate?.vendorMethodOptions]
  );

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
        <div
          className="grid sm:grid-cols-3 gap-4 mb-4"
          style={{ maxWidth: 800 }}
        >
          <TextField
            fullWidth
            defaultValue={loanProductTemplate?.amortizationType?.id}
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Amortization"
                title="The Amortization value is input to calculating the repayment amounts for repayment of the loan."
              />
            }
            {...getTextFieldFormikProps(formik, "amortizationType")}
          >
            {loanProductTemplate?.amortizationTypeOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            defaultChecked={loanProductTemplate?.isEqualAmortization}
            label="Is Equal Amortization"
            control={
              <Checkbox
                {...getCheckFieldFormikProps(formik, "isEqualAmortization")}
              />
            }
            className="sm:col-span-2"
          />
          <TextField
            fullWidth
            defaultValue={loanProductTemplate?.interestType?.id}
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Interest method"
                title="The Interest method value is input to calculating the payments amount for repayment of the loan."
              />
            }
            {...getTextFieldFormikProps(formik, "interestType")}
          >
            {loanProductTemplate?.interestTypeOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            defaultValue={
              loanProductTemplate?.interestCalculationPeriodType?.id
            }
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Interest calculation period"
                title="Daily - Will Calculate the interest on DAILY basis ex: Month of February has 28days and it will calculate interest for 28days, SAME AS REPAYMENT PERIOD- it calculates for the month,that is, 30days."
              />
            }
            {...getTextFieldFormikProps(
              formik,
              "interestCalculationPeriodType"
            )}
          >
            {loanProductTemplate?.interestCalculationPeriodTypeOptions?.map(
              (option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.value}
                </MenuItem>
              )
            )}
          </TextField>
          {formik.values.interestCalculationPeriodType === 1 && (
            <FormControlLabel
              label="Calculate interest for exact days in partial period"
              control={
                <Checkbox
                  {...getCheckFieldFormikProps(
                    formik,
                    "allowPartialPeriodInterestCalcualtion"
                  )}
                />
              }
            />
          )}

          <TextField
            fullWidth
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Repayment strategy"
                title="The repayment strategy determines the sequence in which each of the components is paid."
              />
            }
            {...getTextFieldFormikProps(
              formik,
              "transactionProcessingStrategyId"
            )}
          >
            {loanProductTemplate?.transactionProcessingStrategyOptions?.map(
              (option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              )
            )}
          </TextField>
        </div>

        <Typography className="font-bold" gutterBottom>
          <TextFieldLabelHelpTooltip
            label="Moratorium"
            title="The moratorium information will default from the loan product settings, but can be changed for this loan account"
          />
        </Typography>
        <div
          className="grid sm:grid-cols-2 gap-4 mb-4"
          style={{ maxWidth: 400 }}
        >
          <TextField
            fullWidth
            required
            label="On principal payment"
            {...getTextFieldFormikProps(formik, "graceOnPrincipalPayment")}
          />
          <TextField
            fullWidth
            required
            label="On interest payment"
            {...getTextFieldFormikProps(formik, "graceOnInterestPayment")}
          />
          <TextField
            fullWidth
            required
            label={
              <TextFieldLabelHelpTooltip
                label="Interest free period"
                title="If the Interest Free Period is '4' and the client's Repayment Frequency is every week, then for the first four weeks the client need not to pay interest, he has to pay principle due for that week only."
              />
            }
            {...getTextFieldFormikProps(formik, "graceOnInterestCharged")}
          />
          <TextField
            fullWidth
            required
            label={
              <TextFieldLabelHelpTooltip
                label="Arrears tolerance"
                title="With 'Arrears tolerance' you can specify a tolerance amount and if the loan is behind (in arrears), but within the tolerance, it won't be classified as 'in arrears' and part of the portfolio at risk."
              />
            }
            {...getTextFieldFormikProps(formik, "inArrearsTolerance")}
          />
          <TextField
            fullWidth
            required
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Days in year"
                title="The setting for number of days in year to use to calculate interest"
              />
            }
            defaultValue={loanProductTemplate?.daysInYearType?.id}
            {...getTextFieldFormikProps(formik, "daysInYearType")}
          >
            {loanProductTemplate?.daysInYearTypeOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            required
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Days in month"
                title="Number of days in month."
              />
            }
            defaultValue={loanProductTemplate?.daysInMonthType?.id}
            {...getTextFieldFormikProps(formik, "daysInMonthType")}
          >
            {loanProductTemplate?.daysInMonthTypeOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <FormControlLabel
          defaultChecked={loanProductTemplate?.canDefineInstallmentAmount}
          label="Allow fixing of the installment amount"
          control={
            <Checkbox
              {...getCheckFieldFormikProps(
                formik,
                "canDefineInstallmentAmount"
              )}
            />
          }
        />

        <Typography className="font-bold" gutterBottom>
          <TextFieldLabelHelpTooltip
            label="Number of days a loan may be overdue before moving into arrears"
            title="A loan is in arrears once the number of days entered into this field is exceeded. If this field is blank, the loan will be in arrears the day after a scheduled payment is missed. "
          />
        </Typography>
        <div className="mb-4" style={{ maxWidth: 200 }}>
          <TextField
            fullWidth
            required
            label={
              <TextFieldLabelHelpTooltip
                label="Number of days a loan may be overdue before moving into arrears"
                title="A loan is in arrears once the number of days entered into this field is exceeded. If this field is blank, the loan will be in arrears the day after a scheduled payment is missed. "
              />
            }
            {...getTextFieldFormikProps(formik, "graceOnArrearsAgeing")}
            type="number"
          />
        </div>

        <Typography className="font-bold" gutterBottom>
          <TextFieldLabelHelpTooltip
            label="Maximum number of days a loan may be overdue before becoming a NPA (non performing asset)"
            title="A loan is a NPA (non performing asset) once the number of days entered into this field is exceeded. If this field is blank, the loan will be an NPA the day after a scheduled payment is missed."
          />
        </Typography>
        <div className="mb-4" style={{ maxWidth: 200 }}>
          <TextField
            fullWidth
            required
            label={
              <TextFieldLabelHelpTooltip
                label="Maximum number of days a loan may be overdue before becoming a NPA (non performing asset)"
                title="A loan is a NPA (non performing asset) once the number of days entered into this field is exceeded. If this field is blank, the loan will be an NPA the day after a scheduled payment is missed."
              />
            }
            {...getTextFieldFormikProps(formik, "overdueDaysForNPA")}
            type="number"
          />
        </div>

        <FormControlLabel
          label="Account moves out of NPA only after all arrears have been cleared?"
          control={
            <Checkbox
              defaultChecked={
                loanProductTemplate?.accountMovesOutOfNPAOnlyOnArrearsCompletion
              }
              {...getCheckFieldFormikProps(
                formik,
                "accountMovesOutOfNPAOnlyOnArrearsCompletion"
              )}
            />
          }
        />

        <Typography className="font-bold" gutterBottom>
          Principal Threshold (%) for Last Installment
        </Typography>
        <div className="mb-4" style={{ maxWidth: 200 }}>
          <TextField
            fullWidth
            required
            {...getTextFieldFormikProps(
              formik,
              "principalThresholdForLastInstallment"
            )}
          />
        </div>

        {!formik.values.isEqualAmortization && (
          <>
            <FormControlLabel
              defaultChecked={loanProductTemplate?.allowVariableInstallments}
              label={
                <TextFieldLabelHelpTooltip
                  label="Is Variable Installments Allowed?"
                  title="These fields are used to define the minimum, maximum gap that should be present between the installments for the loan product"
                />
              }
              control={
                <Checkbox
                  {...getCheckFieldFormikProps(
                    formik,
                    "allowVariableInstallments"
                  )}
                />
              }
            />
            {formik.values?.allowVariableInstallments && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                <CurrencyTextField
                  code={formik.values.currencyCode}
                  fullWidth
                  label={<TextFieldLabelHelpTooltip label="Minimun" title="" />}
                  {...getTextFieldFormikProps(formik, "minimumGap")}
                />
                <CurrencyTextField
                  code={formik.values.currencyCode}
                  fullWidth
                  label={<TextFieldLabelHelpTooltip label="Maximum" title="" />}
                  {...getTextFieldFormikProps(formik, "maximumGap")}
                />
              </div>
            )}
          </>
        )}
        <FormControlLabel
          label={
            <TextFieldLabelHelpTooltip
              label="Is allowed to be used for providing Topup Loans?"
              title="If selected, the Loan Product can be used to apply for Topup Loans."
            />
          }
          control={
            <Checkbox
              defaultChecked={loanProductTemplate?.canUseForTopup}
              {...getCheckFieldFormikProps(formik, "canUseForTopup")}
            />
          }
        />
        {!!formik.values.canUseForTopup && (
          <div className="mb-4" style={{ maxWidth: 200 }}>
            <TextField
              fullWidth
              required
              type="number"
              label="Number of Repayment Allowed (%)"
              {...getTextFieldFormikProps(formik, "topUpNumberOfRepayment")}
            />
          </div>
        )}
      </Paper>

      {!formik.values.isEqualAmortization && (
        <Paper className="p-4 mb-4">
          <Typography variant="h6" className="font-bold" gutterBottom>
            Interest Recalculation
          </Typography>
          <FormControlLabel
            defaultChecked={loanProductTemplate?.isInterestRecalculationEnabled}
            label="Recalculate Interest"
            control={
              <Checkbox
                {...getCheckFieldFormikProps(
                  formik,
                  "isInterestRecalculationEnabled"
                )}
              />
            }
          />
          {formik.values.isInterestRecalculationEnabled && (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                <TextField
                  fullWidth
                  required
                  select
                  label={
                    <TextFieldLabelHelpTooltip
                      label="Pre-closure interest calculation rule"
                      title=""
                    />
                  }
                  {...getTextFieldFormikProps(
                    formik,
                    "preClosureInterestCalculationStrategy"
                  )}
                >
                  {loanProductTemplate?.preClosureInterestCalculationStrategyOptions?.map(
                    (option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value}
                      </MenuItem>
                    )
                  )}
                </TextField>
                <TextField
                  fullWidth
                  required
                  select
                  label={
                    <TextFieldLabelHelpTooltip
                      label="Advance payments adjustment type"
                      title="Whenever advanced payment for next installments is made by the client, then we can either reduce EMI amount or we can reduce number of installments. Otherwise we can reschedule next repayments."
                    />
                  }
                  {...getTextFieldFormikProps(
                    formik,
                    "rescheduleStrategyMethod"
                  )}
                >
                  {loanProductTemplate?.rescheduleStrategyTypeOptions?.map(
                    (option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </div>

              <Typography className="font-bold" gutterBottom>
                <TextFieldLabelHelpTooltip
                  label="Interest recalculation compounding on"
                  title="If you select None, next period(month or week) interest will be calculated on principle only. If you select Fee, next period interest will be recalculated based on Principle + Fee. If you select Interest, next period interest will be recalculated based on Principle + Interest. If you select 'Fee and Interest' next period interest will be recalculated based on Principle + Interest+ Fee"
                />
              </Typography>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                <TextField
                  fullWidth
                  required
                  select
                  label="Interest recalculation compounding on"
                  {...getTextFieldFormikProps(
                    formik,
                    "interestRecalculationCompoundingMethod"
                  )}
                >
                  {loanProductTemplate?.interestRecalculationCompoundingTypeOptions?.map(
                    (option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value}
                      </MenuItem>
                    )
                  )}
                </TextField>
                {formik.values?.interestRecalculationCompoundingMethod !==
                  0 && (
                  <>
                    <TextField
                      fullWidth
                      required
                      select
                      label={
                        <TextFieldLabelHelpTooltip
                          label="Frequency for compounding"
                          title="The Frequency for compounding interest/fee may be weekly, fortnightly, monthly or quarterly thereby increasing the outstanding balance"
                        />
                      }
                      {...getTextFieldFormikProps(
                        formik,
                        "recalculationCompoundingFrequencyType"
                      )}
                    >
                      {loanProductTemplate?.interestRecalculationFrequencyTypeOptions?.map(
                        (option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.value}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                    {(formik.values.recalculationCompoundingFrequencyType ===
                      3 ||
                      formik.values.recalculationCompoundingFrequencyType ===
                        4) && (
                      <>
                        {formik.values.recalculationCompoundingFrequencyType ===
                          4 && (
                          <TextField
                            fullWidth
                            required
                            select
                            label="Monthly Quatre"
                            {...getTextFieldFormikProps(
                              formik,
                              "recalculationCompoundingFrequencyNthDayType"
                            )}
                          >
                            {loanProductTemplate?.interestRecalculationNthDayTypeOptions?.map(
                              (option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.value}
                                </MenuItem>
                              )
                            )}
                          </TextField>
                        )}
                        <TextField
                          fullWidth
                          required
                          select
                          label="Day of the Week"
                          {...getTextFieldFormikProps(
                            formik,
                            "recalculationCompoundingFrequencyDayOfWeekType"
                          )}
                        >
                          {loanProductTemplate?.interestRecalculationDayOfWeekTypeOptions?.map(
                            (option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.value}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      </>
                    )}
                    {formik.values.recalculationCompoundingFrequencyType !==
                      1 && (
                      <TextField
                        fullWidth
                        required
                        label={
                          <TextFieldLabelHelpTooltip
                            label="Frequency Interval for compounding"
                            title="This field accompanies the 'Frequency for compounding on outstanding principle' . Ex: selecting the interval as 1 and the frequency as monthly, would result in the outstanding balance (increase) being calculated for every month."
                          />
                        }
                        {...getTextFieldFormikProps(
                          formik,
                          "recalculationCompoundingFrequencyInterval"
                        )}
                        type="number"
                      />
                    )}
                  </>
                )}
              </div>

              <Typography className="font-bold" gutterBottom>
                <TextFieldLabelHelpTooltip
                  label="Frequency for recalculate Outstanding Principal"
                  title="Once the client makes advance repayments, his outstanding principle may be recalculated on a weekly, fortnightly, monthly or quarterly basis, thereby reducing the weekly, fortnightly, monthly outstanding balance."
                />
              </Typography>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                <TextField
                  fullWidth
                  required
                  select
                  label="Principal"
                  {...getTextFieldFormikProps(
                    formik,
                    "recalculationRestFrequencyType"
                  )}
                >
                  {loanProductTemplate?.interestRecalculationFrequencyTypeOptions?.map(
                    (option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value}
                      </MenuItem>
                    )
                  )}
                </TextField>
                {(formik.values.recalculationRestFrequencyType === 3 ||
                  formik.values.recalculationRestFrequencyType === 4) && (
                  <>
                    {formik.values.recalculationRestFrequencyType === 4 && (
                      <TextField
                        fullWidth
                        required
                        select
                        label="Monthly Quatre"
                        {...getTextFieldFormikProps(
                          formik,
                          "recalculationRestFrequencyNthDayType"
                        )}
                      >
                        {loanProductTemplate?.interestRecalculationNthDayTypeOptions?.map(
                          (option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.value}
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    )}
                    <TextField
                      fullWidth
                      required
                      select
                      label="Day of the Week"
                      {...getTextFieldFormikProps(
                        formik,
                        "recalculationRestFrequencyDayOfWeekType"
                      )}
                    >
                      {loanProductTemplate?.interestRecalculationDayOfWeekTypeOptions?.map(
                        (option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.value}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </>
                )}
                {formik.values.recalculationRestFrequencyType !== 1 && (
                  <TextField
                    fullWidth
                    required
                    label={
                      <TextFieldLabelHelpTooltip
                        label="Frequency Interval for recalculation"
                        title="Once the client makes advance repayments, his outstanding principle may be recalculated on a weekly, fortnightly, monthly or quarterly basis, thereby reducing the weekly, fortnightly, monthly outstanding balance."
                      />
                    }
                    {...getTextFieldFormikProps(
                      formik,
                      "recalculationRestFrequencyInterval"
                    )}
                    type="number"
                  />
                )}
              </div>
              <FormControlLabel
                label="Is Arrears recognization based on original schedule"
                control={
                  <Checkbox
                    {...getCheckFieldFormikProps(
                      formik,
                      "isArrearsBasedOnOriginalSchedule"
                    )}
                  />
                }
              />
            </>
          )}
        </Paper>
      )}

      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold" gutterBottom>
          Guarantee Requirements
        </Typography>
        <FormControlLabel
          label="Place Guarantee Funds On-Hold?"
          control={
            <Checkbox
              defaultChecked={loanProductTemplate?.holdGuaranteeFunds}
              {...getCheckFieldFormikProps(formik, "holdGuaranteeFunds")}
            />
          }
        />
        {formik.values?.holdGuaranteeFunds && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            <TextField
              fullWidth
              required
              label={
                <TextFieldLabelHelpTooltip
                  label="Mandatory Guarantee: (%)"
                  title=""
                />
              }
              {...getTextFieldFormikProps(formik, "mandatoryGuarantee")}
              type="number"
            />
            <TextField
              fullWidth
              label={
                <TextFieldLabelHelpTooltip
                  label="Minimum Guarantee from Own Funds: (%)"
                  title=""
                />
              }
              {...getTextFieldFormikProps(
                formik,
                "minimumGuaranteeFromOwnFunds"
              )}
              type="number"
            />
            <TextField
              fullWidth
              required
              label={
                <TextFieldLabelHelpTooltip
                  label="Minimum Guarantee from Guarantor Funds: (%)"
                  title=""
                />
              }
              {...getTextFieldFormikProps(
                formik,
                "minimumGuaranteeFromGuarantor"
              )}
              type="number"
            />
          </div>
        )}
      </Paper>

      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold" gutterBottom>
          Loan Tranche Details
        </Typography>
        <FormControlLabel
          label={
            <TextFieldLabelHelpTooltip
              label="Enable Multiple Disbursals"
              title="Leave this checkbox unchecked if the loan is a single disburse loan. Check this checkbox if the loan is a multi disburse loan. See additional fields for additional information required for this type of loan."
            />
          }
          control={
            <Checkbox
              // defaultChecked={loanProductTemplate?.multiDisburseLoan}
              {...getCheckFieldFormikProps(formik, "multiDisburseLoan")}
            />
          }
        />
        {formik.values?.multiDisburseLoan && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            <TextField
              fullWidth
              required
              label={
                <TextFieldLabelHelpTooltip
                  label="Maximum Tranche count"
                  title="The maximum number of disbursements allowed for a loan account."
                />
              }
              {...getTextFieldFormikProps(formik, "maxTrancheCount")}
              type="number"
            />
            <CurrencyTextField
              code={formik.values.currencyCode}
              fullWidth
              label={
                <TextFieldLabelHelpTooltip
                  label="Maximum allowed outstanding balance"
                  title="The maximum outstanding loan account balance allowed at a point in time."
                />
              }
              {...getTextFieldFormikProps(formik, "outstandingLoanBalance")}
            />
          </div>
        )}
      </Paper>
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold" gutterBottom>
          Eligibility
        </Typography>
        <FormControlLabel
          label={<TextFieldLabelHelpTooltip label="Enable Eligibility" />}
          control={
            <Checkbox
              // defaultChecked={loanProductTemplate?.multiDisburseLoan}
              {...getCheckFieldFormikProps(formik, "eligibility")}
            />
          }
        />
        {formik.values?.eligibility && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            <TextField
              fullWidth
              required
              label={<TextFieldLabelHelpTooltip label="Debt Service Ratio %" />}
              {...getTextFieldFormikProps(formik, "dsr")}
              type="number"
            />
            <CurrencyTextField
              code={formik.values.currencyCode}
              fullWidth
              label={
                <TextFieldLabelHelpTooltip label="Non Performing Loan Amount Threshold " />
              }
              {...getTextFieldFormikProps(formik, "nplAmountThreshold")}
            />
            <TextField
              fullWidth
              required
              label={<TextFieldLabelHelpTooltip label="Max Age" />}
              {...getTextFieldFormikProps(formik, "maxAge")}
              type="number"
            />
            <CurrencyTextField
              code={formik.values.currencyCode}
              fullWidth
              label={<TextFieldLabelHelpTooltip label="Min Net Pay" />}
              {...getTextFieldFormikProps(formik, "minNetPay")}
            />
            <TextField
              fullWidth
              required
              label={<TextFieldLabelHelpTooltip label="Min Service Year" />}
              {...getTextFieldFormikProps(formik, "minServiceYear")}
              type="number"
            />
            <TextField
              fullWidth
              required
              label={<TextFieldLabelHelpTooltip label="Max Service Year" />}
              {...getTextFieldFormikProps(formik, "maxServiceYear")}
              type="number"
            />
          </div>
        )}
      </Paper>
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold" gutterBottom>
          External Service
        </Typography>
        <FormControlLabel
          label={<TextFieldLabelHelpTooltip label="Enable External Service" />}
          control={
            <Checkbox
              // defaultChecked={loanProductTemplate?.multiDisburseLoan}
              {...getCheckFieldFormikProps(formik, "externalService")}
            />
          }
        />
        {formik.values?.externalService && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            <Autocomplete
              fullWidth
              multiple
              freeSolo
              options={loanProductTemplate?.vendorMethodOptions || []}
              filterOptions={(option) => option}
              getOptionLabel={(option) => {
                return (
                  normalizedVendorMethodOptions?.[option?.id]?.displayName || ""
                );
              }}
              isOptionEqualToValue={(option, value) => {
                return option?.id === value?.id;
              }}
              // value={formik.values.vendorMethod?.[0] || ""}
              value={formik.values.vendorMethod}
              onChange={(_, value) => {
                formik.setFieldValue(
                  "vendorMethod",
                  value.map((item) => ({
                    id: item?.id || item,
                    displayName: item?.displayName,
                  }))
                );
                // formik.setFieldValue("vendorMethod", [
                //   { id: value?.id || value, displayName: value?.displayName },
                // ]);
              }}
              // className="sm:col-span-2"
              renderInput={(params) => (
                <TextField label="Vendor Methods" {...params} />
              )}
            />
            <TextField
              fullWidth
              required
              label="Down Payment Limit (%)"
              {...getTextFieldFormikProps(formik, "downPaymentLimit")}
              type="number"
            />
            <FormControlLabel
              label={
                <TextFieldLabelHelpTooltip label="Accept Disbursement Service Fee From External" />
              }
              control={
                <Checkbox
                  // defaultChecked={loanProductTemplate?.multiDisburseLoan}
                  {...getCheckFieldFormikProps(
                    formik,
                    "acceptDisbursementServiceFeeFromExternal"
                  )}
                />
              }
            />
            <FormControlLabel
              label="AutoDisburse full asset service amount"
              control={
                <Checkbox
                  {...getCheckFieldFormikProps(formik, "downPaymentPaidFull")}
                />
              }
            />
          </div>
        )}
      </Paper>
      {/* <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold" gutterBottom>
          Configurable Terms and Settings
        </Typography>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
          <FormControlLabel
            label="Allow overriding select terms and settings in loan accounts"
            control={
              <Checkbox
                {...getCheckFieldFormikProps(
                  formik,
                  "allowAttributeConfiguration"
                )}
              />
            }
          />
          {formik.values?.allowAttributeConfiguration && (
            <>
              <FormControlLabel
                label="Amortization"
                control={
                  <Checkbox
                    {...getCheckFieldFormikProps(
                      formik,
                      "allowAttributeOverrides.amortizationType"
                    )}
                  />
                }
              />
              <FormControlLabel
                label="Interest method"
                control={
                  <Checkbox
                    {...getCheckFieldFormikProps(
                      formik,
                      "allowAttributeOverrides.interestType"
                    )}
                  />
                }
              />
              <FormControlLabel
                label="Repayment strategy"
                control={
                  <Checkbox
                    {...getCheckFieldFormikProps(
                      formik,
                      "allowAttributeOverrides.transactionProcessingStrategyId"
                    )}
                  />
                }
              />
              <FormControlLabel
                label="Interest calculation period"
                control={
                  <Checkbox
                    {...getCheckFieldFormikProps(
                      formik,
                      "allowAttributeOverrides.interestCalculationPeriodType"
                    )}
                  />
                }
              />
              <FormControlLabel
                label="Arrears tolerance"
                control={
                  <Checkbox
                    {...getCheckFieldFormikProps(
                      formik,
                      "allowAttributeOverrides.inArrearsTolerance"
                    )}
                  />
                }
              />
              <FormControlLabel
                label="Repaid every"
                control={
                  <Checkbox
                    {...getCheckFieldFormikProps(
                      formik,
                      "allowAttributeOverrides.repaymentEvery"
                    )}
                  />
                }
              />
              <FormControlLabel
                label="Moratorium"
                control={
                  <Checkbox
                    {...getCheckFieldFormikProps(
                      formik,
                      "allowAttributeOverrides.graceOnPrincipalAndInterestPayment"
                    )}
                  />
                }
              />
              <FormControlLabel
                label="Number of days a loan may be overdue before moving into arrears"
                control={
                  <Checkbox
                    {...getCheckFieldFormikProps(
                      formik,
                      "allowAttributeOverrides.graceOnArrearsAgeing"
                    )}
                  />
                }
              />
            </>
          )}
        </div>
      </Paper> */}
    </>
  );
}

export default LoanProductCreateEditSettings;
