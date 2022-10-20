import { Paper, Typography, TextField, MenuItem } from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { format, isValid } from "date-fns";

function ClientXLeadFixedDepositAddEditDetails({
  formik,
  setProductId,
  data,
  isEdit,
}) {
  return (
    <div className="grid gap-4">
      <Paper className="p-4 md:p-8">
        <Typography variant="h6" className="font-bold">
          Details
        </Typography>
        <Typography variant="body2" className="mb-8" color="textSecondary">
          Kindly fill in all required information in the Fixed Deposit
          application form.
        </Typography>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl">
          <TextField
            select
            required
            label="Product Name"
            onChange={(newValue) => {
              formik.setFieldValue("productId", newValue.target.value);
              setProductId(newValue.target.value);
            }}
            error={!!formik.touched?.productId && !!formik.errors?.productId}
            helperText={!!formik.touched?.productId && formik.errors?.productId}
            value={formik.values?.productId}
          >
            {data?.productOptions &&
              data?.productOptions?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>

          <DesktopDatePicker
            value={formik.values?.approvedOnDate || new Date()}
            disabled
            label="Submitted On*"
            inputFormat="dd/MM/yyyy"
            maxDate={new Date()}
            {...getTextFieldFormikProps(formik, "submittedOnDate")}
            onChange={(newValue) => {
              if (isValid(new Date(newValue))) {
                formik.setFieldValue(
                  "submittedOnDate",
                  format(new Date(newValue), "dd MMMM yyyy")
                );
              }
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />

          <TextField
            select
            required
            label="Field Officer"
            {...getTextFieldFormikProps(formik, "fieldOfficerId")}
          >
            {data?.fieldOfficerOptions &&
              data?.fieldOfficerOptions?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.displayName}
                </MenuItem>
              ))}
          </TextField>

          {isEdit && (
            <TextField
              disabled
              label="External ID"
              {...getTextFieldFormikProps(formik, "externalId")}
            />
          )}
        </div>
      </Paper>
    </div>
  );
}

export default ClientXLeadFixedDepositAddEditDetails;
