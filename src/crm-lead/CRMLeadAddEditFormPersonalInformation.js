import { Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { nimbleX360Api } from "common/StoreQuerySlice";
import { differenceInYears, format } from "date-fns/esm";
import InputAdornment from "@mui/material/InputAdornment";
import { ReactComponent as NigeriaFlag } from "assets/svgs/nigeria-flag.svg";
import FormatToNumber from "common/FormatToNumber";

function CRMLeadAddEditFormPersonalInformation({ formik }) {
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
                    {...formik.getFieldProps("moreInfo.clients.titleId")}
                    value={formik.values.moreInfo?.clients?.titleId || ""}
                    error={
                      !!formik.touched.moreInfo?.clients?.titleId &&
                      !!formik.errors.moreInfo?.clients?.titleId
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.titleId &&
                      formik.errors.moreInfo?.clients?.titleId
                    }
                  >
                    {titleIdList &&
                      titleIdList.map((option, i) => (
                        <MenuItem key={i} value={option.id}>
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
                    {...formik.getFieldProps("moreInfo.clients.firstname")}
                    error={
                      !!formik.touched.moreInfo?.clients?.firstname &&
                      !!formik.errors.moreInfo?.clients?.firstname
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.firstname &&
                      formik.errors.moreInfo?.clients?.firstname
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Middle Name (Optional)"
                    {...formik.getFieldProps("moreInfo.clients.middlename")}
                    error={
                      !!formik.touched.moreInfo?.clients?.middlename &&
                      !!formik.errors.moreInfo?.clients?.middlename
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.middlename &&
                      formik.errors.moreInfo?.clients?.middlename
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Last Name*"
                    {...formik.getFieldProps("moreInfo.clients.lastname")}
                    error={
                      !!formik.touched.moreInfo?.clients?.lastname &&
                      !!formik.errors.moreInfo?.clients?.lastname
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.lastname &&
                      formik.errors.moreInfo?.clients?.lastname
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
                    select
                    {...formik.getFieldProps("moreInfo.clients.genderId")}
                    value={formik.values.moreInfo?.clients?.genderId || ""}
                    error={
                      !!formik.touched.moreInfo?.clients?.genderId &&
                      !!formik.errors.moreInfo?.clients?.genderId
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.genderId &&
                      formik.errors.moreInfo?.clients?.genderId
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
                      // readOnly
                      openTo={"year"}
                      maxDate={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 18)
                        )
                      }
                      onChange={(newValue) => {
                        formik.setFieldValue(
                          "moreInfo.clients.dateOfBirth",
                          format(new Date(newValue), "dd MMMM yyyy")
                        );
                      }}
                      value={
                        formik.values?.moreInfo?.clients?.dateOfBirth || ""
                      }
                      renderInput={(params) => (
                        <TextField
                          inputProps={{
                            readOnly: true,
                          }}
                          fullWidth
                          {...params}
                        />
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
                    {...formik.getFieldProps(
                      "moreInfo.clients.maritalStatusId"
                    )}
                    value={
                      formik.values.moreInfo?.clients?.maritalStatusId || ""
                    }
                    error={
                      !!formik.touched.moreInfo?.clients?.maritalStatusId &&
                      !!formik.errors.moreInfo?.clients?.maritalStatusId
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.maritalStatusId &&
                      formik.errors.moreInfo?.clients?.maritalStatusId
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
                    {...formik.getFieldProps(
                      "moreInfo.clients.numberOfDependent"
                    )}
                    value={
                      formik.values.moreInfo?.clients?.numberOfDependent || ""
                    }
                    error={
                      !!formik.touched.moreInfo?.clients?.numberOfDependent &&
                      !!formik.errors.moreInfo?.clients?.numberOfDependent
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.numberOfDependent &&
                      formik.errors.moreInfo?.clients?.numberOfDependent
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
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
                    {...formik.getFieldProps(
                      "moreInfo.clients.educationLevelId"
                    )}
                    value={
                      formik.values.moreInfo?.clients?.educationLevelId || ""
                    }
                    error={
                      !!formik.touched.moreInfo?.clients?.educationLevelId &&
                      !!formik.errors.moreInfo?.clients?.educationLevelId
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.educationLevelId &&
                      formik.errors.moreInfo?.clients?.educationLevelId
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
                    label="Phone Number*"
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
                    error={
                      !!formik.touched.moreInfo?.clients?.mobileNo &&
                      !!formik.errors.moreInfo?.clients?.mobileNo
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.mobileNo &&
                      formik.errors.moreInfo?.clients?.mobileNo
                    }
                    {...formik.getFieldProps("moreInfo.clients.mobileNo")}
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
                    error={
                      !!formik.touched.moreInfo?.clients?.alternateMobileNo &&
                      !!formik.errors.moreInfo?.clients?.alternateMobileNo
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.alternateMobileNo &&
                      formik.errors.moreInfo?.clients?.alternateMobileNo
                    }
                    {...formik.getFieldProps(
                      "moreInfo.clients.alternateMobileNo"
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
                    label="Email Address*"
                    {...formik.getFieldProps("moreInfo.clients.emailAddress")}
                    error={
                      !!formik.touched?.moreInfo?.clients?.emailAddress &&
                      !!formik.errors?.moreInfo?.clients?.emailAddress
                    }
                    helperText={
                      !!formik.touched.moreInfo?.clients?.emailAddress &&
                      formik.errors?.moreInfo?.clients?.emailAddress
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

export default CRMLeadAddEditFormPersonalInformation;
