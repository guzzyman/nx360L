import { DatePicker } from "@mui/lab";
import {
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import TextFieldLabelHelpTooltip from "common/TextFieldLabelXHelpTooltip";
import {
  getCheckFieldFormikProps,
  getTextFieldFormikProps,
} from "common/Utils";
import { useMemo } from "react";

function LoanProductCreateEditDetailsXCurrency({
  formik,
  loanProductTemplate,
}) {
  const { normalizedPaymentTypeOptions, paymentTypeOptions } = useMemo(() => {
    const normalizedPaymentTypeOptions =
      loanProductTemplate?.paymentTypeOptions?.reduce((acc, curr) => {
        if (![1, 3].includes(curr.id)) {
          acc[curr.id] = curr;
        }
        return acc;
      }, {}) || {};
    return {
      normalizedPaymentTypeOptions,
      paymentTypeOptions: Object.values(normalizedPaymentTypeOptions),
    };
  }, [loanProductTemplate?.paymentTypeOptions]);

  const isDeductionAtSourceOnRepaymentMethods = useMemo(
    () => !!formik.values?.repaymentMethod?.find((method) => method?.id == 5),
    [formik.values?.repaymentMethod]
  );

  const normalizedEmployementTypeOptions = useMemo(
    () =>
      loanProductTemplate?.employerTypeOptions?.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {}),
    [loanProductTemplate?.employerTypeOptions]
  );

  return (
    <>
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Details
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className="max-w-sm mb-4"
        >
          Ensure you enter correct information.
        </Typography>
        <div className="grid sm:grid-cols-2 gap-x-4" style={{ maxWidth: 400 }}>
          <TextField
            fullWidth
            required
            margin="normal"
            label={
              <TextFieldLabelHelpTooltip
                label="Product Name"
                title="The product name is a unique identifier for the lending product."
              />
            }
            className="sm:col-span-2"
            {...getTextFieldFormikProps(formik, "name")}
          />
          <TextField
            fullWidth
            required
            margin="normal"
            label={
              <TextFieldLabelHelpTooltip
                label="Short Name"
                title="The short name is a unique identifier for the lending product."
              />
            }
            {...getTextFieldFormikProps(formik, "shortName")}
          />
          <TextField
            fullWidth
            select
            margin="normal"
            label={
              <TextFieldLabelHelpTooltip
                label="Fund"
                title="Loan products may be assigned to a fund set up by your financial institution. If available, the fund field can be used for tracking and reporting on groups of loans."
              />
            }
            {...getTextFieldFormikProps(formik, "fundId")}
          >
            {loanProductTemplate?.fundOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            label={
              <TextFieldLabelHelpTooltip
                label="Description"
                title="The description is used to provide additional information regarding the purpose and characteristics of the loan product."
              />
            }
            className="sm:col-span-2"
            {...getTextFieldFormikProps(formik, "description")}
          />
          <TextField
            fullWidth
            select
            margin="normal"
            label={<TextFieldLabelHelpTooltip label="Loan Document" />}
            {...getTextFieldFormikProps(formik, "configs[0]")}
            value={formik.values?.configs?.[0]?.id}
            onChange={(e) =>
              formik.setFieldValue("configs[0]", { id: e.target.value })
            }
            className="sm:col-span-2"
          >
            {loanProductTemplate?.configOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <Autocomplete
            fullWidth
            multiple
            // loading={searchClientsQueryResult.isFetching}
            freeSolo
            options={paymentTypeOptions || []}
            filterOptions={(option) => option}
            // getOptionDisabled={(option) => {
            //   if (formik.values?.repaymentMethod?.length) {
            //     if (isDeductionAtSourceOnRepaymentMethods) {
            //       return option?.id != 5;
            //     } else {
            //       return option?.id == 5;
            //     }
            //   }
            //   return false;
            // }}
            getOptionLabel={(option) => {
              return normalizedPaymentTypeOptions?.[option?.id]?.name;
            }}
            isOptionEqualToValue={(option, value) => {
              return option?.id === value?.id;
            }}
            value={formik.values.repaymentMethod}
            onChange={(_, value) => {
              formik.setFieldValue(
                "repaymentMethod",
                value?.map((item) => ({
                  id: item?.id || item,
                  name: item?.name,
                }))
              );
            }}
            className="sm:col-span-2"
            renderInput={(params) => (
              <TextField
                label="Repayment Methods"
                margin="normal"
                {...params}
              />
            )}
          />
          <Autocomplete
            fullWidth
            multiple
            freeSolo
            options={loanProductTemplate?.employerTypeOptions || []}
            filterOptions={(option) => option}
            getOptionLabel={(option) => {
              return normalizedEmployementTypeOptions?.[option?.id]?.name;
            }}
            isOptionEqualToValue={(option, value) => {
              return option?.id === value?.id;
            }}
            value={formik.values.employerType}
            onChange={(_, value) => {
              formik.setFieldValue(
                "employerType",
                value?.map((item) => ({
                  id: item?.id || item,
                  name: item?.name,
                }))
              );
            }}
            className="sm:col-span-2"
            renderInput={(params) => (
              <TextField
                label="Employement Types"
                margin="normal"
                {...params}
              />
            )}
          />
          <DatePicker
            disablePast
            label={
              <TextFieldLabelHelpTooltip
                label="Start Date"
                title="The date that the loan product will be active and available to clients. If blank, the loan product will be active as soon as it is created."
              />
            }
            value={formik.values.startDate}
            onChange={(newValue) => {
              formik.setFieldValue("startDate", newValue);
            }}
            renderInput={(params) => (
              <TextField
                fullWidth
                margin="normal"
                required
                {...getTextFieldFormikProps(formik, "startDate")}
                {...params}
              />
            )}
          />
          <DatePicker
            disablePast
            minDate={formik.values.startDate}
            label={
              <TextFieldLabelHelpTooltip
                label="Closing Date"
                title="The date that the loan product will become inactive and unavailable to clients. If blank, the load product will never become inactive."
              />
            }
            value={formik.values.closeDate}
            onChange={(newValue) => {
              formik.setFieldValue("closeDate", newValue);
            }}
            renderInput={(params) => (
              <TextField
                fullWidth
                margin="normal"
                required
                {...getTextFieldFormikProps(formik, "closeDate")}
                {...params}
              />
            )}
          />
          <FormControlLabel
            label={
              <TextFieldLabelHelpTooltip
                label="Sales Review"
                title="Let agent review loan (Step 1)"
              />
            }
            control={
              <Checkbox
                {...getCheckFieldFormikProps(formik, "salesReview")}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setValues({
                    ...formik.values,
                    salesReview: e.target.checked,
                    autoDisburse: false,
                  });
                }}
              />
            }
          />
          <FormControlLabel
            label={
              <TextFieldLabelHelpTooltip
                label="L1 Review"
                title="Let agent review loan (Step 2)"
              />
            }
            control={
              <Checkbox
                {...getCheckFieldFormikProps(formik, "underwriterReview")}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setValues({
                    ...formik.values,
                    underwriterReview: e.target.checked,
                    // autoDisburse: false,
                  });
                }}
              />
            }
          />
          <FormControlLabel
            label={
              <TextFieldLabelHelpTooltip
                label="L2 Review"
                title="Let agent review loan (Step 3)"
              />
            }
            control={
              <Checkbox
                {...getCheckFieldFormikProps(formik, "underwriterTwoReview")}
                onChange={(e) => {
                  formik.setValues({
                    ...formik.values,
                    underwriterTwoReview: e.target.checked,
                    // autoDisburse: false,
                  });
                }}
              />
            }
          />
          <div>
            <FormControlLabel
              label={
                <TextFieldLabelHelpTooltip
                  label="Auto Disburse"
                  title="Let agent review loan"
                />
              }
              control={
                <Checkbox
                  {...getCheckFieldFormikProps(formik, "autoDisburse")}
                  onChange={(e) => {
                    formik.setValues({
                      ...formik.values,
                      autoDisburse: e.target.checked,
                      // salesReview: !e.target.checked,
                      // underwriterReview: !e.target.checked,
                      // underwriterTwoReview: !e.target.checked,
                    });
                  }}
                />
              }
            />
            <FormHelperText error={!!formik.errors?.autoDisburse}>
              {formik.errors?.autoDisburse || ""}
            </FormHelperText>
          </div>
        </div>
        <FormControlLabel
          label={
            <TextFieldLabelHelpTooltip
              label="Include in customer loan counter"
              title="A borrower loan counter (cycle) is used for tracking how many time the client has taken this particular product."
            />
          }
          control={
            <Checkbox
              defaultChecked={loanProductTemplate?.includeInBorrowerCycle}
              {...getCheckFieldFormikProps(formik, "includeInBorrowerCycle")}
            />
          }
        />
      </Paper>
      {/* <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Currency
        </Typography>
        <div className="grid sm:grid-cols-3 gap-x-4" style={{ maxWidth: 700 }}>
          <TextField
            fullWidth
            margin="normal"
            required
            select
            defaultValue={loanProductTemplate?.currency?.code}
            label={
              <TextFieldLabelHelpTooltip
                label="Currency"
                title="The currency in which the loan will be disbursed."
              />
            }
            {...getTextFieldFormikProps(formik, "currencyCode")}
          >
            {loanProductTemplate?.currencyOptions?.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.displayLabel}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            defaultValue={loanProductTemplate?.currency?.decimalPlaces}
            margin="normal"
            required
            type="number"
            label={
              <TextFieldLabelHelpTooltip
                label="Decimal Places"
                title="The number of decimal places to be used to track and report on loans."
              />
            }
            {...getTextFieldFormikProps(formik, "digitsAfterDecimal")}
          />
          <TextField
            fullWidth
            margin="normal"
            required
            type="number"
            label={
              <TextFieldLabelHelpTooltip
                label="Currency in Multiple Of"
                title="You can enter multiples of currency value. For example, if you put multiples of 100, the currency value will be rounded off to 200, 300, 400, etc."
              />
            }
            {...getTextFieldFormikProps(formik, "inMultiplesOf")}
          />
          <TextField
            fullWidth
            margin="normal"
            required
            type="number"
            label="Installment In Multiple Of"
            {...getTextFieldFormikProps(
              formik,
              "installmentAmountInMultiplesOf"
            )}
          />
        </div>
      </Paper> */}
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Integration Configuration
        </Typography>
        <div className="grid sm:grid-cols-2 gap-x-4" style={{ maxWidth: 400 }}>
          {[
            { label: "Check BVN", key: "otherConfig.checkBvn" },
            { label: "Check Remita", key: "otherConfig.checkRemita" },
            {
              label: "Check Bank Schedule",
              key: "otherConfig.checkBankSchedule",
            },
            {
              label: "Check Bank Statement",
              key: "otherConfig.checkBankStatement",
            },
            { label: "Check CRC", key: "otherConfig.checkCRC" },
          ].map((item, index) => {
            return (
              <FormControlLabel
                key={index}
                label={item.label}
                control={
                  <Checkbox {...getCheckFieldFormikProps(formik, item.key)} />
                }
              />
            );
          })}
        </div>
      </Paper>
    </>
  );
}

export default LoanProductCreateEditDetailsXCurrency;
