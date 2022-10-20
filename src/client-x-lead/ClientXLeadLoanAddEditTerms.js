import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { formatNumberToCurrency, getTextFieldFormikProps } from "common/Utils";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { format } from "date-fns/esm";

import CurrencyField from "common/CurrencyField";
import FormatToNumber from "common/FormatToNumber";
import { isValid } from "date-fns";

function ClientXLeadLoanAddEditTerms({
  formik,
  data,
  employerData,
  repaymentInfo,
}) {
  return (
    <div className="grid gap-4">
      <Paper className="p-4 md:p-8">
        <Typography variant="h6" className="font-bold">
          Terms
        </Typography>
        <Typography variant="body2" className="mb-4" color="textSecondary">
          Kindly fill in all required information in the loan application form.
        </Typography>

        <div className="my-8 flex flex-wrap gap-4">
          <Typography>
            Minimum Loan Amount:{" "}
            <b>{formatNumberToCurrency(data?.product?.minPrincipal)}</b>
          </Typography>

          <Typography>
            Maximum Loan Amount:{" "}
            <b>{formatNumberToCurrency(data?.product?.maxPrincipal)}</b>
          </Typography>

          <Typography>
            Repayment Amount:{" "}
            <b>
              {formatNumberToCurrency(
                repaymentInfo?.periods?.[1]?.totalDueForPeriod || 0
              )}
            </b>
          </Typography>
          <Typography>
            Nominal Interest Rate:{" "}
            <b>
              {formatNumberToCurrency(formik.values.interestRatePerPeriod || 0)}
            </b>
          </Typography>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl">
          <CurrencyField
            label="Loan Amount"
            {...formik.getFieldProps("principal")}
            inputProps={{
              min: formik.values?.minPrincipal,
              max: formik.values?.maxPrincipal,
            }}
            focused={formik.values?.principal}
            error={!!formik.touched?.principal && !!formik.errors?.principal}
            helperText={!!formik.touched?.principal && formik.errors?.principal}
          />

          <CurrencyField label="Netpay" {...formik.getFieldProps("netpay")} />

          {/* <TextField
            required
            label="Number Of Repayments"
            {...getTextFieldFormikProps(formik, "numberOfRepayments")}
          /> */}

          <DesktopDatePicker
            value={formik.values?.repaymentsStartingFromDate || new Date()}
            label="First Repayment Date*"
            disablePast
            inputFormat="dd/MM/yyyy"
            {...getTextFieldFormikProps(formik, "repaymentsStartingFromDate")}
            onChange={(newValue) => {
              if (isValid(new Date(newValue))) {
                formik.setFieldValue(
                  "repaymentsStartingFromDate",
                  format(new Date(newValue), "dd MMMM yyyy")
                );
              }
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Loan Term"
                InputProps={{
                  inputComponent: FormatToNumber,
                }}
                {...getTextFieldFormikProps(formik, "loanTermFrequency")}
              />
            </Grid>

            {/* <Grid item xs={5}>
              <TextField
                fullWidth
                select
                required
                label="Frequency"
                {...getTextFieldFormikProps(formik, "loanTermFrequencyType")}
                value={formik.values?.loanTermFrequencyType}
                onChange={(e) => {
                  const { value } = e.target;
                  formik.setFieldValue("loanTermFrequencyType", value);
                  formik.setFieldValue("repaymentFrequencyType", value);
                }}
              >
                {data?.termFrequencyTypeOptions &&
                  data?.termFrequencyTypeOptions?.map((option, index) => (
                    <MenuItem key={index} value={option.id}>
                      {option.value}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid> */}
          </Grid>

          {/* {employerData ? (
            employerData?.sector?.id !== 18 && ( // show commitment if not public sector
              <CurrencyField
                label="Commitment"
                {...formik.getFieldProps("commitment")}
              />
            )
          ) : (
            <CurrencyField
              label="Commitment"
              {...formik.getFieldProps("commitment")}
            />
          )} */}

          {/* <TextField
            required
            label="Nominal Interest Rate"
            focused
            InputProps={{
              inputComponent: FormatToNumber,
              readOnly: true,
            }}
            {...getTextFieldFormikProps(formik, "interestRatePerPeriod")}
          /> */}

          {data?.canUseForTopup && (
            <>
              <FormControlLabel
                label="Is Topup Loan?"
                control={
                  <Checkbox
                    checked={formik.values?.isTopup}
                    onChange={(event) => {
                      formik.setFieldValue("isTopup", event.target.checked);
                    }}
                    value={formik.values?.isTopup}
                  />
                }
              />

              {formik.values?.isTopup && (
                <TextField
                  select
                  required
                  label="Choose Loan To Close"
                  {...getTextFieldFormikProps(formik, "loanIdToClose")}
                >
                  {data?.clientActiveLoanOptions &&
                    data?.clientActiveLoanOptions?.map((option, index) => (
                      <MenuItem key={index} value={option.id}>
                        {option.accountNo} - <small>{option.productName}</small>
                      </MenuItem>
                    ))}
                </TextField>
              )}
            </>
          )}
        </div>
      </Paper>
    </div>
  );
}

export default ClientXLeadLoanAddEditTerms;
