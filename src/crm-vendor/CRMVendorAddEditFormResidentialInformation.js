import React from "react";
import {
  Paper,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import { nimbleX360Api } from "common/StoreQuerySlice";
import { format } from "date-fns";

function CRMVendorAddEditFormResidentialInformation({ formik }) {
  const { data: residentStatusIdList } =
    nimbleX360Api.useGetCodeValuesQuery(45);

  const { data: stateIdList } = nimbleX360Api.useGetCodeValuesQuery(27);

  const { data: LGAIdList } = nimbleX360Api.useGetStateLGAQuery(
    React.useMemo(
      () => formik.values?.stateProvinceId,
      // eslint-disable-next-line
      [formik.values?.stateProvinceId]
    ),
    { skip: !formik.values?.stateProvinceId }
  );

  console.log("formik", formik);

  return (
    <div>
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div className="max-w-3xl">
          <Typography variant="h5">
            <b>Residential Information</b>
          </Typography>
          <div className="max-w-xl">
            <Typography>Ensure you enter correct information</Typography>
          </div>

          <Box mt={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="Permanent Residential State"
                    select
                    {...formik.getFieldProps("stateProvinceId")}
                    error={
                      !!formik.touched?.stateProvinceId &&
                      !!formik.errors?.stateProvinceId
                    }
                    helperText={
                      !!formik.touched?.stateProvinceId &&
                      formik.errors?.stateProvinceId
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
                    {...formik.getFieldProps("lgaId")}
                    error={!!formik.touched?.lgaId && !!formik.errors?.lgaId}
                    helperText={!!formik.touched?.lgaId && formik.errors?.lgaId}
                  >
                    {LGAIdList &&
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
                    {...formik.getFieldProps("addressLine1")}
                    error={
                      !!formik.touched?.addressLine1 &&
                      !!formik.errors?.addressLine1
                    }
                    helperText={
                      !!formik.touched?.addressLine1 &&
                      formik.errors?.addressLine1
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
                    {...formik.getFieldProps("nearestLandMark")}
                    error={
                      !!formik.touched?.nearestLandMark &&
                      !!formik.errors?.nearestLandMark
                    }
                    helperText={
                      !!formik.touched?.nearestLandMark &&
                      formik.errors?.nearestLandMark
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

export default CRMVendorAddEditFormResidentialInformation;
