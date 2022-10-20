import React from "react";
import {
  Paper,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import { nimbleX360Api, nimbleX360WrapperApi } from "common/StoreQuerySlice";

import InputAdornment from "@mui/material/InputAdornment";
import FormatToNumber from "common/FormatToNumber";
import { LoadingButton } from "@mui/lab";

function CRMClientAddEditFormBankDetails({ formik, isEdit }) {
  const { data: bankList } = nimbleX360Api.useGetBanksQuery();

  const bankCode = bankList?.filter(
    (e) => e.id === formik.values.clientBanks?.[0]?.bankId
  )?.[0]?.bankSortCode;

  const [
    validateBank,
    {
      data: otherBankDetails,
      isLoading: otherBankDetailsIsLoading,
      error: otherBankDetailsIsError,
    },
  ] = nimbleX360WrapperApi.useNameEnquiryMutation();

  const verifyBank = async () => {
    try {
      const resp = await validateBank({
        bankCode: bankCode,
        accountNumber: formik.values.clientBanks?.[0]?.accountnumber,
      }).unwrap();
      if (!!resp?.data?.accountName) {
        formik.setFieldValue("clientBanks.[0].active", true);
      } else {
        formik.setFieldValue("clientBanks.[0].active", false);
      }
    } catch (error) {
      formik.setFieldValue("clientBanks.[0].active", false);
    }
  };

  const bankErrorMessage = otherBankDetailsIsError?.data?.Message;

  React.useEffect(() => {
    formik.setFieldValue(
      "clientBanks.[0].accountname",
      `${otherBankDetails?.data?.accountName}`
    );
    // eslint-disable-next-line
  }, [otherBankDetails]);

  return (
    <div>
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div className="max-w-3xl">
          <div className="max-w-xl">
            <Typography variant="h5">
              <b>Bank Details</b>
            </Typography>
            <Typography>
              Ensure you enter correct information, some of the information
              provided will later be matched with your BVN details.
            </Typography>
          </div>

          <Box mt={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    select
                    {...formik.getFieldProps("clientBanks.[0].bankId")}
                    value={formik.values.clientBanks?.[0]?.bankId || ""}
                    error={
                      !!formik.touched.clientBanks?.[0]?.bankId &&
                      !!formik.errors.clientBanks?.[0]?.bankId
                    }
                    helperText={
                      !!formik.touched.clientBanks?.[0]?.bankId &&
                      formik.errors.clientBanks?.[0]?.bankId
                    }
                  >
                    {bankList &&
                      bankList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="Account Number*"
                    inputProps={{
                      maxLength: 10,
                      inputComponent: FormatToNumber,
                    }}
                    //   InputProps={{
                    //   endAdornment: (
                    /* <InputAdornment position="end">
                          {bvnDetailsIsLoading && <CircularProgress size={15} />}
                        </InputAdornment> */
                    //   ),
                    // }}
                    InputProps={{
                      endAdornment: (
                        <>
                          <InputAdornment position="end">
                            <LoadingButton
                              loading={otherBankDetailsIsLoading}
                              disabled={
                                otherBankDetailsIsLoading ||
                                formik.values.clientBanks?.[0]?.accountnumber
                                  .length !== 10
                              }
                              onClick={() => verifyBank()}
                              size="small"
                            >
                              verify
                            </LoadingButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                    {...formik.getFieldProps("clientBanks.[0].accountnumber")}
                    error={
                      (!!formik.touched.clientBanks?.[0]?.accountnumber &&
                        !!formik.errors.clientBanks?.[0]?.accountnumber) ||
                      bankErrorMessage
                    }
                    helperText={
                      (!!formik.touched.clientBanks?.[0]?.accountnumber &&
                        formik.errors.clientBanks?.[0]?.accountnumber) ||
                      bankErrorMessage
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="Account Name"
                    {...formik.getFieldProps("clientBanks.[0].accountname")}
                    error={
                      !!formik.touched.clientBanks?.[0]?.accountname &&
                      !!formik.errors.clientBanks?.[0]?.accountname
                    }
                    helperText={
                      !!formik.touched.clientBanks?.[0]?.accountname &&
                      formik.errors.clientBanks?.[0]?.accountname
                    }
                    inputProps={{ readOnly: true }}
                    focused
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

export default CRMClientAddEditFormBankDetails;
