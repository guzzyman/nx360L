import { Paper, TextField, Typography, MenuItem } from "@mui/material";
import TextFieldLabelHelpTooltip from "common/TextFieldLabelXHelpTooltip";
import { getTextFieldFormikProps } from "common/Utils";

function FixedDepositProductCreateEditDetailsXCurrency({
  formik,
  fixedDepositProductTemplate,
}) {
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
        <div className="grid sm:grid-cols-2 gap-4" style={{ maxWidth: 500 }}>
          <TextField
            fullWidth
            required
            label={
              <TextFieldLabelHelpTooltip
                label="Product Name"
                title="The product name is a unique identifier for the lending product."
              />
            }
            {...getTextFieldFormikProps(formik, "name")}
          />
          <TextField
            fullWidth
            required
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
            required
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
        </div>
      </Paper>
      {/* <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Currency
        </Typography>
        <div className="grid sm:grid-cols-3 gap-4" style={{ maxWidth: 750 }}>
          <TextField
            fullWidth
            required
            select
            label={
              <TextFieldLabelHelpTooltip
                label="Currency"
                title="The currency in which the loan will be disbursed."
              />
            }
            {...getTextFieldFormikProps(formik, "currencyCode")}
          >
            {fixedDepositProductTemplate?.currencyOptions?.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
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
            required
            type="number"
            label={
              <TextFieldLabelHelpTooltip
                label="Multiples Of"
                title="You can enter multiples of currency value. For example, if you put multiples of 100, the currency value will be rounded off to 200, 300, 400, etc."
              />
            }
            {...getTextFieldFormikProps(formik, "inMultiplesOf")}
          />
        </div>
      </Paper> */}
    </>
  );
}

export default FixedDepositProductCreateEditDetailsXCurrency;
