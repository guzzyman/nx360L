import {
  Button,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import FormatToNumber from "common/FormatToNumber";
import { ReactComponent as NigeriaFlag } from "assets/svgs/nigeria-flag.svg";
import { getTextFieldFormikProps } from "common/Utils";
import { nimbleX360CRMVendorApi } from "./CRMVendorStoreQuerySlice";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

function CRMVendorAddEditFormPersonalInformation({ formik, isEdit }) {
  const { data } = nimbleX360CRMVendorApi.useGetCRMVendorsOfficesQuery();
  const { enqueueSnackbar } = useSnackbar();
  // filter out head office
  const newData = data?.filter((e) => e.id !== 1);
  const localFormik = useFormik({
    initialValues: {
      emailAddress: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      emailAddress: Yup.string().label("Email Address").email().required(),
    }),
    onSubmit: (values, { resetForm }) => {
      //Check if email address already exists before updating list
      if (formik.values.emailAddress.indexOf(values.emailAddress) === -1) {
        formik.setFieldValue("emailAddress", [
          ...formik.values.emailAddress,
          values.emailAddress,
        ]);
        resetForm();
      } else {
        enqueueSnackbar("Email address already exists", { variant: "error" });
      }
    },
  });

  const onDeleteEmailAddress = (email) => {
    const newEmailAddress = formik.values.emailAddress.filter(
      (value) => value !== email
    );
    formik.setFieldValue("emailAddress", newEmailAddress);
  };

  return (
    <div>
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div className="max-w-3xl">
          <div className="max-w-xl">
            <Typography variant="h5">
              <b>Personal Information</b>
            </Typography>
            <Typography>Ensure you enter correct information.</Typography>
          </div>

          <Box mt={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="FullName*"
                    {...formik.getFieldProps("fullname")}
                    error={
                      !!formik.touched?.fullname && !!formik.errors?.fullname
                    }
                    helperText={
                      !!formik.touched?.fullname && formik.errors?.fullname
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    label="Phone Number*"
                    inputProps={{
                      maxLength: 11,
                      inputComponent: FormatToNumber,
                    }}
                    fullWidth
                    placeholder="e.g 09082736728"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NigeriaFlag />
                        </InputAdornment>
                      ),
                    }}
                    error={
                      !!formik.touched?.mobileNo && !!formik.errors?.mobileNo
                    }
                    helperText={
                      !!formik.touched?.mobileNo && formik.errors?.mobileNo
                    }
                    {...formik.getFieldProps("mobileNo")}
                  />
                </Box>
              </Grid>

              {!isEdit && (
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label="Office"
                    select
                    fullWidth
                    {...getTextFieldFormikProps(formik, "officeId")}
                  >
                    {newData &&
                      newData?.map((frequency, i) => (
                        <MenuItem value={frequency?.id} key={i}>
                          {frequency.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12} md={12}>
                <TextField
                  {...getTextFieldFormikProps(localFormik, "emailAddress")}
                  fullWidth
                  label="Email Address"
                  InputProps={{
                    endAdornment: (
                      <>
                        <Button onClick={localFormik.handleSubmit}>Add</Button>
                      </>
                    ),
                  }}
                />
                <div className="flex gap-2 flex-wrap">
                  {formik?.values?.emailAddress?.map((email, i) => (
                    <Chip
                      key={i}
                      label={email}
                      className="mt-2 "
                      onDelete={() => onDeleteEmailAddress(email)}
                    />
                  ))}
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Paper>
    </div>
  );
}

export default CRMVendorAddEditFormPersonalInformation;
