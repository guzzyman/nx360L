import React from "react";
import { Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { nimbleX360Api } from "common/StoreQuerySlice";
import CurrencyField from "common/CurrencyField";
import { nimbleX360CRMLeadApi } from "./CRMLeadStoreQuerySlice";

function CRMLeadAddEditFormLeadClassification({ formik }) {
  const { data: leadSourceList } = nimbleX360Api.useGetCodeValuesQuery(46);

  const { data: leadCategoryList } = nimbleX360Api.useGetCodeValuesQuery(16);

  const { data: leadTypeList } =
    nimbleX360CRMLeadApi.useGetProductSummaryQuery();

  const { data: leadRatingList } = nimbleX360Api.useGetCodeValuesQuery(49);

  return (
    <Paper className="my-10 py-10 px-5 rounded-md">
      <div className="max-w-2xl mx-auto ">
        <Typography variant="h5" textAlign="center">
          <b>Lead Classification</b>
        </Typography>

        <div className="mt-10">
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mt={5}
            spacing={3}
          >
            <Grid item xs={12} md={6}>
              <Typography>Lead Source*:</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box flex justifyContent="center">
                <TextField
                  label="Select Source"
                  fullWidth
                  select
                  {...formik.getFieldProps("leadSourceId")}
                  error={
                    !!formik.touched.leadSourceId &&
                    !!formik.errors.leadSourceId
                  }
                  helperText={
                    !!formik.touched.leadSourceId && formik.errors.leadSourceId
                  }
                >
                  {leadSourceList &&
                    leadSourceList.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mt={5}
            spacing={3}
          >
            <Grid item xs={12} md={6}>
              <Typography>Lead Category*:</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box flex justifyContent="center">
                <TextField
                  label="Select Category"
                  fullWidth
                  select
                  {...formik.getFieldProps("leadCategoryId")}
                  error={
                    !!formik.touched.leadCategoryId &&
                    !!formik.errors.leadCategoryId
                  }
                  helperText={
                    !!formik.touched.leadCategoryId &&
                    formik.errors.leadCategoryId
                  }
                >
                  {leadCategoryList &&
                    leadCategoryList.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mt={5}
            spacing={3}
          >
            <Grid item xs={12} md={6}>
              <Typography>Interested Products*:</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box flex justifyContent="center">
                <TextField
                  label="Select Type"
                  fullWidth
                  select
                  {...formik.getFieldProps("leadTypeId")}
                  error={
                    !!formik.touched.leadTypeId && !!formik.errors.leadTypeId
                  }
                  helperText={
                    !!formik.touched.leadTypeId && formik.errors.leadTypeId
                  }
                >
                  {leadTypeList &&
                    leadTypeList?.pageItems?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mt={5}
            spacing={3}
          >
            <Grid item xs={12} md={6}>
              <Typography>Lead Rating*:</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box flex justifyContent="center">
                <TextField
                  label="Select Rating"
                  fullWidth
                  select
                  {...formik.getFieldProps("leadRatingId")}
                  error={
                    !!formik.touched.leadRatingId &&
                    !!formik.errors.leadRatingId
                  }
                  helperText={
                    !!formik.touched.leadRatingId && formik.errors.leadRatingId
                  }
                >
                  {leadRatingList &&
                    leadRatingList.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mt={5}
            spacing={3}
          >
            <Grid item xs={12} md={6}>
              <Typography>Projected Inflow*:</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box flex justifyContent="center">
                <CurrencyField
                  label="Amount (N)"
                  fullWidth
                  {...formik.getFieldProps("expectedRevenueIncome")}
                  error={
                    !!formik.touched.expectedRevenueIncome &&
                    !!formik.errors.expectedRevenueIncome
                  }
                  helperText={
                    !!formik.touched.expectedRevenueIncome &&
                    formik.errors.expectedRevenueIncome
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>
    </Paper>
  );
}

export default CRMLeadAddEditFormLeadClassification;
