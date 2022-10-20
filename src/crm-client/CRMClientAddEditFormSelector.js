import React, { useState, useEffect } from "react";
import { Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { nimbleX360WrapperApi, nimbleX360Api } from "common/StoreQuerySlice";

import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import FormatToNumber from "common/FormatToNumber";
import { getTextFieldFormikProps } from "common/Utils";

function CRMClientAddEditFormSelector({
  formik,
  setBVNClientDetail,
  isEdit,
  data,
}) {
  const [bvnValue, setBvnValue] = useState("");
  const [emptyBvnOnEdited, setEmptyBvnOnEdited] = useState(false);

  const dataBvn = data?.clients?.bvn;

  const { data: clientType } = nimbleX360Api.useGetCodeValuesQuery(16);
  const { data: employmentSectorList } =
    nimbleX360Api.useGetCodeValuesQuery(36);

  const [
    resolveBVN,
    { data: bvnDetailsData, isError, isLoading: bvnDetailsIsLoading },
  ] = nimbleX360WrapperApi.useResolveBVNDetailsMutation({ bvn: bvnValue });

  useEffect(() => {
    setBVNClientDetail(bvnDetailsData);
    // eslint-disable-next-line
  }, [bvnDetailsData]);

  useEffect(() => {
    if (bvnValue.length === 11) {
      resolveBVN({ bvn: bvnValue });
    }
    // eslint-disable-next-line
  }, [bvnValue]);

  useEffect(() => {
    if (isEdit && formik?.values?.clients?.bvn !== "" && !bvnValue) {
      setEmptyBvnOnEdited(true);
    }
    // eslint-disable-next-line
  }, [formik?.values?.clients?.bvn]);

  useEffect(() => {
    if (formik?.values?.clients?.clientTypeId) {
      if (
        formik?.values?.clients?.clientTypeId === 67 ||
        formik?.values?.clients?.clientTypeId === 68 ||
        formik?.values?.clients?.clientTypeId === 2492
      ) {
        formik.setFieldValue("clients.employmentSectorId", 18);
      } else {
        formik.setFieldValue("clients.employmentSectorId", 17);
      }
    }
    // eslint-disable-next-line
  }, [formik?.values?.clients?.clientTypeId]);

  return (
    <Paper className="my-10 py-10 px-5 rounded-md">
      <div className="max-w-2xl mx-auto ">
        <Typography variant="h5" textAlign="center">
          <b>Selector</b>
        </Typography>

        <div className="mt-10">
          <Grid
            container
            justifyContent="space-between"
            alignItems="start"
            spacing={3}
          >
            <Grid item xs={12} md={6}>
              <Typography>Enter Client BVN</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <TextField
                  fullWidth
                  label="Bvn"
                  disabled={
                    (isEdit && emptyBvnOnEdited) || (!isEdit && dataBvn)
                  }
                  focused={isEdit}
                  error={
                    (!!formik.touched.clients?.bvn &&
                      !!formik.errors.clients?.bvn) ||
                    isError
                  }
                  inputProps={{
                    maxLength: 11,
                    inputComponent: FormatToNumber,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {bvnDetailsIsLoading && <CircularProgress size={15} />}
                      </InputAdornment>
                    ),
                  }}
                  // type="number"
                  helperText={
                    !isError
                      ? !!formik.touched.clients?.bvn &&
                        formik.errors.clients?.bvn
                      : "Invalid Bvn"
                  }
                  onChange={(e) => {
                    formik.setFieldValue("clients.bvn", e.target.value);
                    setBvnValue(e.target.value);
                  }}
                  value={formik.values.clients?.bvn || ""}
                />
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
              <Typography>Select employment Type?</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box flex justifyContent="center">
                <TextField
                  select
                  fullWidth
                  label="Employer Type"
                  {...getTextFieldFormikProps(formik, "clients.clientTypeId")}
                >
                  {clientType &&
                    clientType?.map((option, index) => (
                      <MenuItem key={index} value={option.id}>
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
              <Typography>What employment sector do you work in?</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box flex justifyContent="center">
                <TextField
                  label="sector"
                  fullWidth
                  select
                  disabled
                  {...formik.getFieldProps("clients.employmentSectorId")}
                  error={
                    !!formik.touched.clients?.employmentSectorId &&
                    !!formik.errors.clients?.employmentSectorId
                  }
                  helperText={
                    !!formik.touched.clients?.employmentSectorId &&
                    formik.errors.clients?.employmentSectorId
                  }
                >
                  {employmentSectorList &&
                    employmentSectorList.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>
    </Paper>
  );
}

export default CRMClientAddEditFormSelector;
