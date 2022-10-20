import React from "react";
import {
  Paper,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { nimbleX360Api } from "common/StoreQuerySlice";
import { useState } from "react";
import { useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { ReactComponent as NigeriaFlag } from "assets/svgs/nigeria-flag.svg";
import FormatToNumber from "common/FormatToNumber";

function CRMClientAddEditFormNextOfKin({ formik }) {
  const { data: residentStatusIdList } =
    nimbleX360Api.useGetCodeValuesQuery(45);
  const [useResidentialAddress, setUseResidentialAddress] = useState(false);

  const { data: titleIdList } = nimbleX360Api.useGetCodeValuesQuery(37);

  const { data: relationshipIdList } = nimbleX360Api.useGetCodeValuesQuery(31);

  const { data: maritalStatusIdList } = nimbleX360Api.useGetCodeValuesQuery(30);

  const { data: stateIdList } = nimbleX360Api.useGetCodeValuesQuery(27);

  const { data: LGAIdList, isFetching: LGAIsFetching } =
    nimbleX360Api.useGetStateLGAQuery(
      React.useMemo(
        () => formik.values?.addresses?.[1]?.stateProvinceId,
        // eslint-disable-next-line
        [formik.values?.addresses?.[1]?.stateProvinceId]
      )
    );

  useEffect(() => {
    if (useResidentialAddress) {
      formik.setFieldValue(
        "addresses.[1].stateProvinceId",
        formik.values.addresses?.[0]?.stateProvinceId
      );
      formik.setFieldValue(
        "addresses.[1].lgaId",
        formik.values.addresses?.[0]?.lgaId
      );
      formik.setFieldValue(
        "addresses.[1].addressLine1",
        formik.values.addresses?.[0]?.addressLine1
      );
      formik.setFieldValue(
        "addresses.[1].nearestLandMark",
        formik.values.addresses?.[0]?.nearestLandMark
      );
      formik.setFieldValue(
        "addresses.[1].residentStatusId",
        formik.values.addresses?.[0]?.residentStatusId
      );
      formik.setFieldValue(
        "addresses.[1].dateMovedIn",
        formik.values.addresses?.[0]?.dateMovedIn
      );
    }
    // eslint-disable-next-line
  }, [useResidentialAddress]);

  return (
    <div>
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div className="max-w-3xl">
          <div className="max-w-xl">
            <Typography variant="h5">
              <b>Next of Kin</b>
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
                    label="Title"
                    select
                    {...formik.getFieldProps("familyMembers.[0].titleId")}
                    value={formik.values.familyMembers?.[0]?.titleId || ""}
                    error={
                      !!formik.touched.familyMembers?.[0]?.titleId &&
                      !!formik.errors.familyMembers?.[0]?.titleId
                    }
                    helperText={
                      !!formik.touched.familyMembers?.[0]?.titleId &&
                      formik.errors.familyMembers?.[0]?.titleId
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

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Marital Status"
                    select
                    {...formik.getFieldProps(
                      "familyMembers.[0].maritalStatusId"
                    )}
                    value={
                      formik.values.familyMembers?.[0]?.maritalStatusId || ""
                    }
                    error={
                      !!formik.touched.familyMembers?.[0]?.maritalStatusId &&
                      !!formik.errors.familyMembers?.[0]?.maritalStatusId
                    }
                    helperText={
                      !!formik.touched.familyMembers?.[0]?.maritalStatusId &&
                      formik.errors.familyMembers?.[0]?.maritalStatusId
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
                    label="Relationship"
                    select
                    {...formik.getFieldProps(
                      "familyMembers.[0].relationshipId"
                    )}
                    value={
                      formik.values.familyMembers?.[0]?.relationshipId || ""
                    }
                    error={
                      !!formik.touched.familyMembers?.[0]?.relationshipId &&
                      !!formik.errors.familyMembers?.[0]?.relationshipId
                    }
                    helperText={
                      !!formik.touched.familyMembers?.[0]?.relationshipId &&
                      formik.errors.familyMembers?.[0]?.relationshipId
                    }
                  >
                    {relationshipIdList &&
                      relationshipIdList.map((option) => (
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
                    {...formik.getFieldProps("familyMembers.[0].firstName")}
                    error={
                      !!formik.touched.familyMembers?.[0]?.firstName &&
                      !!formik.errors.familyMembers?.[0]?.firstName
                    }
                    helperText={
                      !!formik.touched.familyMembers?.[0]?.firstName &&
                      formik.errors.familyMembers?.[0]?.firstName
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Middle Name (Optional)"
                    {...formik.getFieldProps("familyMembers.[0].middleName")}
                    error={
                      !!formik.touched.familyMembers?.[0]?.middleName &&
                      !!formik.errors.familyMembers?.[0]?.middleName
                    }
                    helperText={
                      !!formik.touched.familyMembers?.[0]?.middleName &&
                      formik.errors.familyMembers?.[0]?.middleName
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Last Name*"
                    {...formik.getFieldProps("familyMembers.[0].lastName")}
                    error={
                      !!formik.touched.familyMembers?.[0]?.lastName &&
                      !!formik.errors.familyMembers?.[0]?.lastName
                    }
                    helperText={
                      !!formik.touched.familyMembers?.[0]?.lastName &&
                      formik.errors.familyMembers?.[0]?.lastName
                    }
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    label="Phone Number"
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
                      !!formik.touched.familyMembers?.[0]?.mobileNumber &&
                      !!formik.errors.familyMembers?.[0]?.mobileNumber
                    }
                    helperText={
                      !!formik.touched.familyMembers?.[0]?.mobileNumber &&
                      formik.errors.familyMembers?.[0]?.mobileNumber
                    }
                    {...formik.getFieldProps("familyMembers.[0].mobileNumber")}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Email addresses"
                    {...formik.getFieldProps("familyMembers.[0].emailAddress")}
                    error={
                      !!formik.touched.familyMembers?.[0]?.emailAddress &&
                      !!formik.errors.familyMembers?.[0]?.emailAddress
                    }
                    helperText={
                      !!formik.touched.familyMembers?.[0]?.emailAddress &&
                      formik.errors.familyMembers?.[0]?.emailAddress
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Paper>

      <Paper className="my-10 py-10 px-5 rounded-md">
        <div className="max-w-3xl">
          <div className="flex flex-wrap justify-between">
            <div>
              <Typography variant="h5">
                <b>Next Of kin Residential Information</b>
              </Typography>
              <div className="max-w-xl">
                <Typography>Ensure you enter correct information</Typography>
              </div>
            </div>

            <div>
              <FormControlLabel
                label="Use Residential Address"
                control={
                  <Checkbox
                    checked={useResidentialAddress}
                    onChange={(event) => {
                      setUseResidentialAddress(event.target.checked);
                    }}
                    value={useResidentialAddress}
                  />
                }
              />
            </div>
          </div>

          <Box mt={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="Permanent Residential State"
                    select
                    {...formik.getFieldProps("addresses.[1].stateProvinceId")}
                    value={formik.values.addresses?.[1]?.stateProvinceId || ""}
                    error={
                      !!formik.touched.addresses?.[1]?.stateProvinceId &&
                      !!formik.errors.addresses?.[1]?.stateProvinceId
                    }
                    helperText={
                      !!formik.touched.addresses?.[1]?.stateProvinceId &&
                      formik.errors.addresses?.[1]?.stateProvinceId
                    }
                  >
                    {stateIdList &&
                      stateIdList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="LGA*"
                    select
                    {...formik.getFieldProps("addresses.[1].lgaId")}
                    value={formik.values.addresses?.[1]?.lgaId || ""}
                    error={
                      !!formik.touched.addresses?.[1]?.lgaId &&
                      !!formik.errors.addresses?.[1]?.lgaId
                    }
                    helperText={
                      !!formik.touched.addresses?.[1]?.lgaId &&
                      formik.errors.addresses?.[1]?.lgaId
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {LGAIsFetching && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  >
                    {LGAIdList &&
                      !LGAIsFetching &&
                      LGAIdList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12}>
                <Box>
                  <TextField
                    fullWidth
                    label="Permanent addresses"
                    {...formik.getFieldProps("addresses.[1].addressLine1")}
                    error={
                      !!formik.touched.addresses?.[1]?.addressLine1 &&
                      !!formik.errors.addresses?.[1]?.addressLine1
                    }
                    helperText={
                      !!formik.touched.addresses?.[1]?.addressLine1 &&
                      formik.errors.addresses?.[1]?.addressLine1
                    }
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="Nearest Landmark"
                    {...formik.getFieldProps("addresses.[1].nearestLandMark")}
                    error={
                      !!formik.touched.addresses?.[1]?.nearestLandMark &&
                      !!formik.errors.addresses?.[1]?.nearestLandMark
                    }
                    helperText={
                      !!formik.touched.addresses?.[1]?.nearestLandMark &&
                      formik.errors.addresses?.[1]?.nearestLandMark
                    }
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="Residential Status"
                    select
                    {...formik.getFieldProps("addresses.[1].residentStatusId")}
                    value={formik.values.addresses?.[1]?.residentStatusId || ""}
                    error={
                      !!formik.touched.addresses?.[1]?.residentStatusId &&
                      !!formik.errors.addresses?.[1]?.residentStatusId
                    }
                    helperText={
                      !!formik.touched.addresses?.[1]?.residentStatusId &&
                      formik.errors.addresses?.[1]?.residentStatusId
                    }
                  >
                    {residentStatusIdList &&
                      residentStatusIdList?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <DesktopDatePicker
                    label="Date Moved in"
                    inputFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    error={
                      !!formik.touched.addresses?.[1]?.dateMovedIn &&
                      !!formik.errors.addresses?.[1]?.dateMovedIn
                    }
                    helperText={
                      !!formik.touched.addresses?.[1]?.dateMovedIn &&
                      formik.errors.addresses?.[1]?.dateMovedIn
                    }
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        "addresses.[1].dateMovedIn",
                        newValue
                      );
                    }}
                    value={formik.values.addresses?.[1]?.dateMovedIn || ""}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
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

export default CRMClientAddEditFormNextOfKin;
