import { Paper, Typography, TextField, MenuItem } from "@mui/material";
import { nimbleX360Api } from "common/StoreQuerySlice";
import { getTextFieldFormikProps } from "common/Utils";
import { useMemo } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { ReactComponent as NigeriaFlag } from "assets/svgs/nigeria-flag.svg";
import FormatToNumber from "common/FormatToNumber";

function CRMEmployerAddEditAddress({ formik, data }) {
  const { data: stateIdList } = nimbleX360Api.useGetCodeValuesQuery(27);

  const { data: LGAIdList } = nimbleX360Api.useGetStateLGAQuery(
    useMemo(
      () => formik.values?.stateId,
      // eslint-disable-next-line
      [formik.values?.stateId]
    ),
    { skip: formik.values?.stateId <= 0 }
  );

  return (
    <div className="grid gap-4">
      <Paper className="p-4 md:p-8">
        <Typography variant="h6" className="font-bold">
          Employer Address
        </Typography>
        <Typography variant="body2" className="mb-8" color="textSecondary">
          Kindly fill in all information in the Employer application form.
        </Typography>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl">
          <TextField
            fullWidth
            label="State*"
            select
            {...getTextFieldFormikProps(formik, "stateId")}
          >
            {stateIdList &&
              stateIdList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            fullWidth
            label="LGA*"
            select
            {...getTextFieldFormikProps(formik, "lgaId")}
          >
            {LGAIdList &&
              LGAIdList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="RC Number"
            {...getTextFieldFormikProps(formik, "rcNumber")}
          />

          <TextField
            label="Contact Person"
            {...getTextFieldFormikProps(formik, "contactPerson")}
          />

          <TextField
            label="office Address"
            {...getTextFieldFormikProps(formik, "officeAddress")}
          />

          <TextField
            label="Nearest Landmark"
            {...getTextFieldFormikProps(formik, "nearestLandMark")}
          />

          <TextField
            label="Phone Number*"
            inputProps={{ maxLength: 11, inputComponent: FormatToNumber }}
            placeholder="e.g 09082736728"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NigeriaFlag />
                </InputAdornment>
              ),
            }}
            error={!!formik.touched?.mobileNo && !!formik.errors?.mobileNo}
            helperText={!!formik.touched?.mobileNo && formik.errors?.mobileNo}
            {...formik.getFieldProps("mobileNo")}
          />

          <TextField
            label="emailAddress"
            {...getTextFieldFormikProps(formik, "emailAddress")}
          />

          <TextField
            placeholder="@gmail.com"
            label="Email Extension"
            value={formik?.values?.emailExtension}
            onChange={(e) => {
              const { value } = e.target;
              if (value?.charAt(0) !== "@") {
                formik.setFieldValue("emailExtension", `@${value}`);
              } else {
                formik.setFieldValue("emailExtension", value);
              }
            }}
            error={!!formik.touched?.emailExtension && !!formik.errors?.emailExtension}
            helperText={!!formik.touched?.emailExtension && formik.errors?.emailExtension}
          />
        </div>
      </Paper>
    </div>
  );
}

export default CRMEmployerAddEditAddress;
