import { MenuItem, Paper, TextField, Typography } from "@mui/material";
import { formatNumberToCurrency, getTextFieldFormikProps } from "common/Utils";
import CurrencyField from "common/CurrencyField";
import { useEffect } from "react";

function ClientXLeadFixedDepositAddEditTerms({
  formik,
  data,
  isReoccurringDeposit,
}) {
  useEffect(() => {
    if (isReoccurringDeposit) {
      if (formik.values.depositPeriod) {
        formik.setFieldValue("recurringFrequency", formik.values.depositPeriod);
      }
      if (
        formik.values.depositPeriodFrequencyId ||
        formik.values.depositPeriodFrequencyId === 0
      ) {
        formik.setFieldValue(
          "recurringFrequencyType",
          formik.values.depositPeriodFrequencyId
        );
      }
    }
  }, [formik.values.depositPeriod, formik.values.depositPeriodFrequencyId]);

  return (
    <div className="grid gap-4">
      <Paper className="p-4 md:p-8">
        <Typography variant="h6" className="font-bold">
          Terms
        </Typography>
        <Typography variant="body2" className="mb-4" color="textSecondary">
          Kindly fill in all required information in the loan application form.
        </Typography>

        <div className="mt-8 my-4 flex flex-wrap gap-5">
          <Typography>
            Minimum Deposit Term:{" "}
            <b>
              {formatNumberToCurrency(data?.minDepositTerm)}{" "}
              {data?.minDepositTermType?.value}
            </b>
          </Typography>

          <Typography>
            Maximum Deposit Term:{" "}
            <b>
              {formatNumberToCurrency(data?.maxDepositTerm)}{" "}
              {data?.minDepositTermType?.value}
            </b>
          </Typography>

          <Typography>
            In Multiples Of:{" "}
            <b>
              {formatNumberToCurrency(data?.inMultiplesOfDepositTerm)}{" "}
              {data?.inMultiplesOfDepositTermType?.value}
            </b>
          </Typography>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
          {isReoccurringDeposit ? (
            <CurrencyField
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
            />
          ) : (
            <CurrencyField
              label="Deposit Amount"
              {...formik.getFieldProps("depositAmount")}
              focused={formik.values?.depositAmount}
              error={
                !!formik.touched?.depositAmount &&
                !!formik.errors?.depositAmount
              }
              helperText={
                !!formik.touched?.depositAmount && formik.errors?.depositAmount
              }
            />
          )}

          <TextField
            required
            label="Deposit Period Frequency"
            // inputProps={{
            //   minLength: data?.minDepositTerm,
            //   maxLength: data?.maxDepositTerm,
            // }}
            {...getTextFieldFormikProps(formik, "depositPeriod")}
          />
          <TextField
            required
            label="Deposit Period Type"
            select
            {...getTextFieldFormikProps(formik, "depositPeriodFrequencyId")}
          >
            {data?.periodFrequencyTypeOptions &&
              data?.periodFrequencyTypeOptions?.map((frequency, i) => (
                <MenuItem value={frequency?.id} key={i}>
                  {frequency.value}
                </MenuItem>
              ))}
          </TextField>
        </div>
      </Paper>

      <Paper className="p-4 md:p-8">
        <Typography variant="h6" className="font-bold mb-4">
          Interest Terms
        </Typography>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl">
          <TextField
            required
            fullWidth
            label="Interest Compounding Period"
            select
            {...getTextFieldFormikProps(
              formik,
              "interestCompoundingPeriodType"
            )}
          >
            {data?.interestCompoundingPeriodTypeOptions &&
              data?.interestCompoundingPeriodTypeOptions?.map(
                (interestCompoundingPeriodType, i) => (
                  <MenuItem value={interestCompoundingPeriodType?.id} key={i}>
                    {interestCompoundingPeriodType.value}
                  </MenuItem>
                )
              )}
          </TextField>

          <TextField
            required
            fullWidth
            label="Interest Posting Period"
            select
            {...getTextFieldFormikProps(formik, "interestPostingPeriodType")}
          >
            {data?.interestPostingPeriodTypeOptions &&
              data?.interestPostingPeriodTypeOptions?.map(
                (interestPostingPeriodType, i) => (
                  <MenuItem value={interestPostingPeriodType?.id} key={i}>
                    {interestPostingPeriodType.value}
                  </MenuItem>
                )
              )}
          </TextField>

          <TextField
            required
            fullWidth
            label="Interest Calculated using"
            select
            {...getTextFieldFormikProps(formik, "interestCalculationType")}
          >
            {data?.interestCalculationTypeOptions &&
              data?.interestCalculationTypeOptions?.map(
                (interestCalculationType, i) => (
                  <MenuItem value={interestCalculationType?.id} key={i}>
                    {interestCalculationType.value}
                  </MenuItem>
                )
              )}
          </TextField>

          <TextField
            required
            fullWidth
            label="Days in Year"
            select
            {...getTextFieldFormikProps(
              formik,
              "interestCalculationDaysInYearType"
            )}
          >
            {data?.interestCalculationDaysInYearTypeOptions &&
              data?.interestCalculationDaysInYearTypeOptions?.map(
                (interestCalculationDaysInYearType, i) => (
                  <MenuItem
                    value={interestCalculationDaysInYearType?.id}
                    key={i}
                  >
                    {interestCalculationDaysInYearType.value}
                  </MenuItem>
                )
              )}
          </TextField>
        </div>
      </Paper>
    </div>
  );
}

export default ClientXLeadFixedDepositAddEditTerms;
