import React from "react";
import {
  Paper,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { nimbleX360Api } from "common/StoreQuerySlice";
import { format, isValid } from "date-fns";

function CRMLeadAddEditFormResidentialInformation({ formik }) {
  const { data: residentStatusIdList } =
    nimbleX360Api.useGetCodeValuesQuery(45);

  const { data: stateIdList } = nimbleX360Api.useGetCodeValuesQuery(27);

  const { data: LGAIdList } = nimbleX360Api.useGetStateLGAQuery(
    React.useMemo(
      () => formik.values.moreInfo?.addresses?.[0]?.stateProvinceId,
      // eslint-disable-next-line
      [formik.values.moreInfo?.addresses?.[0]?.stateProvinceId]
    )
  );
  return (
    <div>
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div className="max-w-3xl">
          <Typography variant="h5">
            <b>Residential Information</b>
          </Typography>
          <div className="max-w-xl">
            <Typography>
              Ensure you enter correct information, some of the information
              provided will later be matched with your BVN details.
            </Typography>
          </div>

          <Box mt={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="Permanent Residential State"
                    select
                    {...formik.getFieldProps(
                      "moreInfo.addresses.[0].stateProvinceId"
                    )}
                    value={
                      formik.values.moreInfo?.addresses?.[0]?.stateProvinceId ||
                      ""
                    }
                    error={
                      !!formik.touched.moreInfo?.addresses?.[0]
                        ?.stateProvinceId &&
                      !!formik.errors.moreInfo?.addresses?.[0]?.stateProvinceId
                    }
                    helperText={
                      !!formik.touched.moreInfo?.addresses?.[0]
                        ?.stateProvinceId &&
                      formik.errors.moreInfo?.addresses?.[0]?.stateProvinceId
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
                    {...formik.getFieldProps("moreInfo.addresses.[0].lgaId")}
                    value={formik.values.moreInfo?.addresses?.[0]?.lgaId || ""}
                    error={
                      !!formik.touched.moreInfo?.addresses?.[0]?.lgaId &&
                      !!formik.errors.moreInfo?.addresses?.[0]?.lgaId
                    }
                    helperText={
                      !!formik.touched.moreInfo?.addresses?.[0]?.lgaId &&
                      formik.errors.moreInfo?.addresses?.[0]?.lgaId
                    }
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
                    {...formik.getFieldProps(
                      "moreInfo.addresses.[0].addressLine1"
                    )}
                    error={
                      !!formik.touched.moreInfo?.addresses?.[0]?.addressLine1 &&
                      !!formik.errors.moreInfo?.addresses?.[0]?.addressLine1
                    }
                    helperText={
                      !!formik.touched.moreInfo?.addresses?.[0]?.addressLine1 &&
                      formik.errors.moreInfo?.addresses?.[0]?.addressLine1
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
                    {...formik.getFieldProps(
                      "moreInfo.addresses.[0].nearestLandMark"
                    )}
                    error={
                      !!formik.touched.moreInfo?.addresses?.[0]
                        ?.nearestLandMark &&
                      !!formik.errors.moreInfo?.addresses?.[0]?.nearestLandMark
                    }
                    helperText={
                      !!formik.touched.moreInfo?.addresses?.[0]
                        ?.nearestLandMark &&
                      formik.errors.moreInfo?.addresses?.[0]?.nearestLandMark
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
                    {...formik.getFieldProps(
                      "moreInfo.addresses.[0].residentStatusId"
                    )}
                    value={
                      formik.values.moreInfo?.addresses?.[0]
                        ?.residentStatusId || ""
                    }
                    error={
                      !!formik.touched.moreInfo?.addresses?.[0]
                        ?.residentStatusId &&
                      !!formik.errors.moreInfo?.addresses?.[0]?.residentStatusId
                    }
                    helperText={
                      !!formik.touched.moreInfo?.addresses?.[0]
                        ?.residentStatusId &&
                      formik.errors.moreInfo?.addresses?.[0]?.residentStatusId
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
                      !!formik.touched.moreInfo?.addresses?.[0]?.dateMovedIn &&
                      !!formik.errors.moreInfo?.addresses?.[0]?.dateMovedIn
                    }
                    helperText={
                      !!formik.touched.moreInfo?.addresses?.[0]?.dateMovedIn &&
                      formik.errors.moreInfo?.addresses?.[0]?.dateMovedIn
                    }
                    onChange={(newValue) => {
                      if (isValid(new Date(newValue))) {
                        formik.setFieldValue(
                          "moreInfo.addresses.[0].dateMovedIn",
                          format(new Date(newValue), "dd MMMM yyyy")
                        );
                      }
                    }}
                    value={
                      formik.values.moreInfo?.addresses?.[0]?.dateMovedIn ||
                      new Date()
                    }
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

export default CRMLeadAddEditFormResidentialInformation;
