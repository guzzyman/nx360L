import { Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { nimbleX360Api } from "common/StoreQuerySlice";
import InputAdornment from "@mui/material/InputAdornment";
import { ReactComponent as NigeriaFlag } from "assets/svgs/nigeria-flag.svg";
import FormatToNumber from "common/FormatToNumber";
import { isBlank } from "common/Utils";

function CRMClientAddEditFormPersonalInformation({ formik, isEdit }) {
  const { data: titleIdList } = nimbleX360Api.useGetCodeValuesQuery(37);

  const { data: genderIdList } = nimbleX360Api.useGetCodeValuesQuery(4);

  const { data: maritalStatusIdList } = nimbleX360Api.useGetCodeValuesQuery(30);

  const { data: educationLevelIdList } =
    nimbleX360Api.useGetCodeValuesQuery(38);

  return (
    <div>
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div className="max-w-3xl">
          <div className="max-w-xl">
            <Typography variant="h5">
              <b>Personal Information</b>
            </Typography>
            <Typography>
              Ensure you enter correct information, some of the information
              provided will later be matched with your BVN details.
            </Typography>
          </div>

          <Box mt={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Title*"
                    select
                    {...formik.getFieldProps("clients.titleId")}
                    value={formik.values.clients?.titleId || ""}
                    error={
                      !!formik.touched.clients?.titleId &&
                      !!formik.errors.clients?.titleId
                    }
                    helperText={
                      !!formik.touched.clients?.titleId &&
                      formik.errors.clients?.titleId
                    }
                  >
                    {titleIdList &&
                      titleIdList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="First Name*"
                    disabled={!isBlank(formik.values?.clients?.firstname)}
                    {...formik.getFieldProps("clients.firstname")}
                    error={
                      !!formik.touched.clients?.firstname &&
                      !!formik.errors.clients?.firstname
                    }
                    helperText={
                      !!formik.touched.clients?.firstname &&
                      formik.errors.clients?.firstname
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Middle Name (Optional)"
                    disabled={!isBlank(formik.values?.clients?.middlename)}
                    {...formik.getFieldProps("clients.middlename")}
                    error={
                      !!formik.touched.clients?.middlename &&
                      !!formik.errors.clients?.middlename
                    }
                    helperText={
                      !!formik.touched.clients?.middlename &&
                      formik.errors.clients?.middlename
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Last Name*"
                    disabled={!isBlank(formik.values?.clients?.lastname)}
                    {...formik.getFieldProps("clients.lastname")}
                    error={
                      !!formik.touched.clients?.lastname &&
                      !!formik.errors.clients?.lastname
                    }
                    helperText={
                      !!formik.touched.clients?.lastname &&
                      formik.errors.clients?.lastname
                    }
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Gender"
                    disabled={!isBlank(formik.values?.clients?.genderId)}
                    select
                    {...formik.getFieldProps("clients.genderId")}
                    value={formik.values.clients?.genderId || ""}
                    error={
                      !!formik.touched.clients?.genderId &&
                      !!formik.errors.clients?.genderId
                    }
                    helperText={
                      !!formik.touched.clients?.genderId &&
                      formik.errors.clients?.genderId
                    }
                  >
                    {genderIdList &&
                      genderIdList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <DesktopDatePicker
                    label="Date Of Birth*"
                    inputFormat="dd/MM/yyyy"
                    disableFuture
                    disableHighlightToday
                    disabled={!isBlank(formik.values?.clients?.dateOfBirth)}
                    error={
                      !!formik.touched.clients?.dateOfBirth &&
                      !!formik.errors.clients?.dateOfBirth
                    }
                    helperText={
                      !!formik.touched.clients?.dateOfBirth &&
                      formik.errors.clients?.dateOfBirth
                    }
                    onChange={(newValue) => {
                      formik.setFieldValue("clients.dateOfBirth", newValue);
                    }}
                    value={formik.values?.clients?.dateOfBirth || new Date()}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Marital Status*"
                    select
                    {...formik.getFieldProps("clients.maritalStatusId")}
                    value={formik.values.clients?.maritalStatusId || ""}
                    error={
                      !!formik.touched.clients?.maritalStatusId &&
                      !!formik.errors.clients?.maritalStatusId
                    }
                    helperText={
                      !!formik.touched.clients?.maritalStatusId &&
                      formik.errors.clients?.maritalStatusId
                    }
                  >
                    {maritalStatusIdList &&
                      maritalStatusIdList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="No. Of Dependent*"
                    select
                    {...formik.getFieldProps("clients.numberOfDependent")}
                    value={formik.values.clients?.numberOfDependent || ""}
                    error={
                      !!formik.touched.clients?.numberOfDependent &&
                      !!formik.errors.clients?.numberOfDependent
                    }
                    helperText={
                      !!formik.touched.clients?.numberOfDependent &&
                      formik.errors.clients?.numberOfDependent
                    }
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Educational Level"
                    select
                    {...formik.getFieldProps("clients.educationLevelId")}
                    value={formik.values.clients?.educationLevelId || ""}
                    error={
                      !!formik.touched.clients?.educationLevelId &&
                      !!formik.errors.clients?.educationLevelId
                    }
                    helperText={
                      !!formik.touched.clients?.educationLevelId &&
                      formik.errors.clients?.educationLevelId
                    }
                  >
                    {educationLevelIdList &&
                      educationLevelIdList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Paper>

      <Paper className="my-10 py-10 px-5 rounded-md">
        <div className="max-w-3xl">
          <div className="max-w-xl">
            <Typography variant="h5">
              <b>Contact Information</b>
            </Typography>
            <Typography>
              Ensure you enter correct information, some of the information
              provided will later be matched with your BVN details.
            </Typography>
          </div>

          <Box mt={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    label="Phone Number"
                    inputProps={{
                      maxLength: 11,
                      inputComponent: FormatToNumber,
                    }}
                    disabled={!isBlank(formik.values?.clients?.mobileNo)}
                    placeholder="e.g 09082736728"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NigeriaFlag />
                        </InputAdornment>
                      ),
                    }}
                    error={
                      !!formik.touched.clients?.mobileNo &&
                      !!formik.errors.clients?.mobileNo
                    }
                    helperText={
                      !!formik.touched.clients?.mobileNo &&
                      formik.errors.clients?.mobileNo
                    }
                    fullWidth
                    {...formik.getFieldProps("clients.mobileNo")}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    label="Alt Phone Number"
                    inputProps={{
                      maxLength: 11,
                      inputComponent: FormatToNumber,
                    }}
                    placeholder="e.g 09082736728"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NigeriaFlag />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    error={
                      !!formik.touched.clients?.alternateMobileNo &&
                      !!formik.errors.clients?.alternateMobileNo
                    }
                    helperText={
                      !!formik.touched.clients?.alternateMobileNo &&
                      formik.errors.clients?.alternateMobileNo
                    }
                    {...formik.getFieldProps("clients.alternateMobileNo")}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Email Address*"
                    {...formik.getFieldProps("clients.emailAddress")}
                    error={
                      !!formik.touched?.clients?.emailAddress &&
                      !!formik.errors?.clients?.emailAddress
                    }
                    helperText={
                      !!formik.touched.clients?.emailAddress &&
                      formik.errors?.clients?.emailAddress
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Paper>
    </div>
  );
}

export default CRMClientAddEditFormPersonalInformation;
