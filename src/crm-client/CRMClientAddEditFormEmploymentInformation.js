import {
  Autocomplete,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { nimbleX360Api } from "common/StoreQuerySlice";
import React, { useEffect, useMemo } from "react";
import { format } from "date-fns/esm";
import FormatToNumber from "common/FormatToNumber";
import InputAdornment from "@mui/material/InputAdornment";
import { ReactComponent as NigeriaFlag } from "assets/svgs/nigeria-flag.svg";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { getUserErrorMessage, isBlank } from "common/Utils";
import Modal from "common/Modal";
import useDebouncedState from "hooks/useDebouncedState";
import { nimbleX360CRMEmployerApi } from "crm-employer/CRMEmployerStoreQuerySlice";

function CRMClientAddEditFormEmploymentInformation({
  formik,
  setWorkEmailValid,
  isEdit,
  data,
}) {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [openVerifyOTP, setopenVerifyOTP] = useState(false);
  const [parentId, setParentId] = useState("");

  const [q, setQ] = useState("");
  const [bQ, setBQ] = useState("");

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const [brachDebouncedQ] = useDebouncedState(bQ, {
    wait: 1000,
    enableReInitialize: true,
  });

  const {
    data: employmentBranchIdList,
    isFetching: employmentBranchIdListIsLoading,
  } = nimbleX360CRMEmployerApi.useGetEmployerBranchesQuery(
    useMemo(
      () => ({
        id: parentId,
        name: brachDebouncedQ || data?.clientEmployers?.[0]?.employer?.name,
        active: true,
      }),
      [brachDebouncedQ, parentId, data?.clientEmployers]
    ),
    { skip: !isEdit && !brachDebouncedQ && !parentId }
  );
  const { data: employmentIdList, isFetching: employmentIdListIsLoading } =
    nimbleX360Api.useGetEmployersQuery(
      {
        ...(debouncedQ
          ? {
              selectOnlyParentEmployer: true,
              name: debouncedQ,
              // if sector is public
              ...(data?.clients?.employmentSector?.id && {
                sectorId: data?.clients?.employmentSector?.id,
              }),
            }
          : {}),
      },
      { skip: (!isEdit && !debouncedQ) || !debouncedQ }
    );

  useEffect(() => {
    if (data?.clientEmployers?.[0]?.employer?.name) {
      setBQ(data?.clientEmployers?.[0]?.employer?.name);
    }
    if (data?.clientEmployers?.[0]?.employer?.parent?.name) {
      setQ(data?.clientEmployers?.[0]?.employer?.parent?.name);
    }
  }, [data?.clientEmployers]);

  const [getWorkEMailOTP, getWorkEMailOTPResult] =
    nimbleX360Api.useLazyGetWorkEmailOTPQuery();

  const onclickGetWorkEMailOTP = async (emailExtension) => {
    try {
      const resp = await getWorkEMailOTP({
        clientId: id,
        workmail: `${formik.values.clientEmployers?.[0]?.emailAddress}${emailExtension}`,
      });

      enqueueSnackbar(resp?.defaultUserMessage || `OTP sent successfully!`, {
        variant: "success",
      });

      setopenVerifyOTP(true);
    } catch (error) {
      enqueueSnackbar(
        getUserErrorMessage(error?.data?.errors) || `OTP failed to send!`,
        {
          variant: "error",
        }
      );
    }
  };

  let employerDetail = employmentBranchIdList?.filter(
    (el) => el.id === formik.values.clientEmployers?.[0]?.employerId
  );

  const { data: employmentStatusIdList } =
    nimbleX360Api.useGetCodeValuesQuery(44);

  const { data: salaryRangeIdList } = nimbleX360Api.useGetCodeValuesQuery(43);
  const { data: stateIdList } = nimbleX360Api.useGetCodeValuesQuery(27);

  const { data: LGAIdList } = nimbleX360Api.useGetStateLGAQuery(
    React.useMemo(
      () => formik.values.clientEmployers?.[0]?.stateId,
      // eslint-disable-next-line
      [formik.values.clientEmployers?.[0]?.stateId]
    ),
    { skip: !formik.values.clientEmployers?.[0]?.stateId }
  );

  const emailExtension = employerDetail?.[0]?.emailExtension;
  const isPublicSector = employerDetail?.[0]?.sector?.id === 18;

  console.log("employerDetail", employerDetail);

  return (
    <div>
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div className="max-w-3xl">
          <Typography variant="h5">
            <b>Employer’s Information</b>
          </Typography>
          <div className="max-w-xl">
            <Typography>
              Ensure you enter correct information, some of the information
              provided will later be matched with your BVN details.
            </Typography>
          </div>

          <Box mt={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Autocomplete
                    loading={employmentIdListIsLoading}
                    freeSolo
                    options={employmentIdList?.pageItems || []}
                    getOptionLabel={(option) => option?.name}
                    inputValue={q || ""}
                    onInputChange={(_, value) => setQ(value)}
                    onChange={(_, value) => {
                      setParentId(value?.id);
                      setBQ("");
                      formik.setFieldValue(
                        "clientEmployers.[0].employerId",
                        ""
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        label="Employer Head Office"
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {employmentIdListIsLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Autocomplete
                    loading={employmentBranchIdListIsLoading}
                    freeSolo
                    options={employmentBranchIdList || []}
                    getOptionLabel={(option) => option?.name}
                    inputValue={bQ || ""}
                    onInputChange={(_, value) => setBQ(value)}
                    onChange={(_, value) => {
                      formik.setFieldValue(
                        "clientEmployers.[0].employerId",
                        value?.id || ""
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        label="Select Employer Branch Name"
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {employmentBranchIdListIsLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>

            {formik?.values?.clientEmployers?.[0]?.employerId && (
              <>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <TextField
                        fullWidth
                        label="State*"
                        select
                        {...formik.getFieldProps("clientEmployers.[0].stateId")}
                        value={
                          formik.values.clientEmployers?.[0]?.stateId || ""
                        }
                        error={
                          !!formik.touched.clientEmployers?.[0]?.stateId &&
                          !!formik.errors.clientEmployers?.[0]?.stateId
                        }
                        helperText={
                          !!formik.touched.clientEmployers?.[0]?.stateId &&
                          formik.errors.clientEmployers?.[0]?.stateId
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

                  <Grid item xs={12} md={6}>
                    <Box>
                      <TextField
                        fullWidth
                        label="LGA*"
                        select
                        {...formik.getFieldProps("clientEmployers.[0].lgaId")}
                        value={formik.values.clientEmployers?.[0]?.lgaId || ""}
                        error={
                          !!formik.touched.clientEmployers?.[0]?.lgaId &&
                          !!formik.errors.clientEmployers?.[0]?.lgaId
                        }
                        helperText={
                          !!formik.touched.clientEmployers?.[0]?.lgaId &&
                          formik.errors.clientEmployers?.[0]?.lgaId
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
                        label="Address*"
                        {...formik.getFieldProps(
                          "clientEmployers.[0].officeAddress"
                        )}
                        error={
                          !!formik.touched.clientEmployers?.[0]
                            ?.officeAddress &&
                          !!formik.errors.clientEmployers?.[0]?.officeAddress
                        }
                        helperText={
                          !!formik.touched.clientEmployers?.[0]
                            ?.officeAddress &&
                          formik.errors.clientEmployers?.[0]?.officeAddress
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
                        label="Nearest Landmark"
                        {...formik.getFieldProps(
                          "clientEmployers.[0].nearestLandMark"
                        )}
                        error={
                          !!formik.touched.clientEmployers?.[0]
                            ?.nearestLandMark &&
                          !!formik.errors.clientEmployers?.[0]?.nearestLandMark
                        }
                        helperText={
                          !!formik.touched.clientEmployers?.[0]
                            ?.nearestLandMark &&
                          formik.errors.clientEmployers?.[0]?.nearestLandMark
                        }
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box>
                      <TextField
                        label="Phone Number"
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
                          !!formik.touched.clientEmployers?.[0]?.mobileNo &&
                          !!formik.errors.clientEmployers?.[0]?.mobileNo
                        }
                        helperText={
                          !!formik.touched.clientEmployers?.[0]?.mobileNo &&
                          formik.errors.clientEmployers?.[0]?.mobileNo
                        }
                        {...formik.getFieldProps(
                          "clientEmployers.[0].mobileNo"
                        )}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </div>
      </Paper>
      {formik?.values?.clientEmployers?.[0]?.employerId && (
        <Paper className="my-10 py-10 px-5 rounded-md">
          <div className="max-w-3xl">
            <Typography variant="h5">
              <b>Work Details</b>
            </Typography>
            <div className="max-w-xl">
              <Typography>
                Fill the information below to help us identify you as an
                employed worker of a company.
              </Typography>
            </div>

            <Box mt={5}>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Staff ID"
                      {...formik.getFieldProps("clientEmployers.[0].staffId")}
                      error={
                        !!formik.touched.clientEmployers?.[0]?.staffId &&
                        !!formik.errors.clientEmployers?.[0]?.staffId
                      }
                      helperText={
                        !!formik.touched.clientEmployers?.[0]?.staffId &&
                        formik.errors.clientEmployers?.[0]?.staffId
                      }
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Job Role/Grade*"
                      {...formik.getFieldProps("clientEmployers.[0].jobGrade")}
                      error={
                        !!formik.touched.clientEmployers?.[0]?.jobGrade &&
                        !!formik.errors.clientEmployers?.[0]?.jobGrade
                      }
                      helperText={
                        !!formik.touched.clientEmployers?.[0]?.jobGrade &&
                        formik.errors.clientEmployers?.[0]?.jobGrade
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
                      label="Employment Type"
                      select
                      {...formik.getFieldProps(
                        "clientEmployers.[0].employmentStatusId"
                      )}
                      value={
                        formik.values.clientEmployers?.[0]
                          ?.employmentStatusId || ""
                      }
                      error={
                        !!formik.touched.clientEmployers?.[0]
                          ?.employmentStatusId &&
                        !!formik.errors.clientEmployers?.[0]?.employmentStatusId
                      }
                      helperText={
                        !!formik.touched.clientEmployers?.[0]
                          ?.employmentStatusId &&
                        formik.errors.clientEmployers?.[0]?.employmentStatusId
                      }
                    >
                      {employmentStatusIdList &&
                        employmentStatusIdList?.map((option) => (
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
                      label="Date Of employment*"
                      inputFormat="dd/MM/yyyy"
                      disableFuture
                      error={
                        !!formik.touched.clientEmployers?.[0]?.employmentDate &&
                        !!formik.errors.clientEmployers?.[0]?.employmentDate
                      }
                      helperText={
                        !!formik.touched.clientEmployers?.[0]?.employmentDate &&
                        formik.errors.clientEmployers?.[0]?.employmentDate
                      }
                      onChange={(newValue) => {
                        formik.setFieldValue(
                          "clientEmployers.[0].employmentDate",
                          newValue
                        );
                      }}
                      value={
                        formik.values.clientEmployers?.[0]?.employmentDate || ""
                      }
                      renderInput={(params) => (
                        <TextField fullWidth {...params} />
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Salary Range*"
                    select
                    {...formik.getFieldProps(
                      "clientEmployers.[0].salaryRangeId"
                    )}
                    value={
                      formik.values.clientEmployers?.[0]?.salaryRangeId || ""
                    }
                    error={
                      !!formik.touched.clientEmployers?.[0]?.salaryRangeId &&
                      !!formik.errors.clientEmployers?.[0]?.salaryRangeId
                    }
                    helperText={
                      !!formik.touched.clientEmployers?.[0]?.salaryRangeId &&
                      formik.errors.clientEmployers?.[0]?.salaryRangeId
                    }
                  >
                    {salaryRangeIdList &&
                      salaryRangeIdList?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <DesktopDatePicker
                    label="Salary Payment Day"
                    inputFormat="dd/MM/yyyy"
                    error={
                      !!formik.touched?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate &&
                      !!formik.errors?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate
                    }
                    helperText={
                      !!formik.touched?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate &&
                      formik.errors?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate
                    }
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        "clientEmployers.[0].nextMonthSalaryPaymentDate",
                        newValue
                      );
                    }}
                    value={
                      formik.values?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate || ""
                    }
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Work Email*"
                      // {...formik.getFieldProps(
                      //   "clientEmployers.[0].emailAddress"
                      // )}
                      value={formik?.values?.clientEmployers?.[0]?.emailAddress}
                      onChange={(e) => {
                        const { value } = e.target;
                        formik.setFieldValue(
                          "clientEmployers.[0].emailAddress",
                          value
                        );
                      }}
                      InputProps={{
                        ...(!isPublicSector && {
                          startAdornment: (
                            <LoadingButton
                              loading={getWorkEMailOTPResult.isLoading}
                              disabled={
                                getWorkEMailOTPResult.isLoading ||
                                isBlank(
                                  formik.values.clientEmployers?.[0]
                                    ?.emailAddress
                                )
                              }
                              size="small"
                              onClick={() =>
                                onclickGetWorkEMailOTP(emailExtension)
                              }
                              className="whitespace-nowrap"
                            >
                              Send OTP
                            </LoadingButton>
                          ),
                          endAdornment: (
                            <Typography color="primary" fontWeight={700}>
                              {emailExtension}
                            </Typography>
                          ),
                        }),
                      }}
                      helperText={
                        !isPublicSector &&
                        !isEdit &&
                        "Verify Work mail before you can proceed"
                      }
                      // error={
                      //   !!formik.touched.clientEmployers?.[0]?.emailAddress &&
                      //   !!formik.errors.clientEmployers?.[0]?.emailAddress
                      // }
                      // helperText={
                      //   !!formik.touched.clientEmployers?.[0]?.emailAddress &&
                      //   formik.errors.clientEmployers?.[0]?.emailAddress
                      // }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </div>
        </Paper>
      )}

      {openVerifyOTP && (
        <CRMClientAddEditFormEmploymentInformationVerifyOTPModal
          open={openVerifyOTP}
          getWorkEMailOTPResult={getWorkEMailOTPResult}
          onclickGetWorkEMailOTP={onclickGetWorkEMailOTP}
          setWorkEmailValid={setWorkEmailValid}
          formik={formik}
          onClose={() => setopenVerifyOTP(false)}
        />
      )}
    </div>
  );
}

export default CRMClientAddEditFormEmploymentInformation;

function CRMClientAddEditFormEmploymentInformationVerifyOTPModal({
  isPublicSector,
  onClose,
  setWorkEmailValid,
  onclickGetWorkEMailOTP,
  getWorkEMailOTPResult,
  formik,
  ...rest
}) {
  const { id } = useParams();
  const [workEmailOTP, setWorkEmailOTP] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const [validateWorkEmailOTP, { isLoading }] =
    nimbleX360Api.useValidateWorkEmailOTPMutation();

  const onclickValidateWorkEmailOTP = async () => {
    try {
      const resp = await validateWorkEmailOTP({
        clientId: id,
        token: workEmailOTP,
      }).unwrap();
      enqueueSnackbar(resp?.defaultUserMessage || `Valid!`, {
        variant: "success",
      });
      formik.setFieldValue("clientEmployers.[0].workEmailVerified", true);
      setWorkEmailValid(true);
      onClose();
    } catch (error) {
      enqueueSnackbar(
        getUserErrorMessage(error?.data?.errors) || `Invalid OTP!`,
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <Modal title="Verify Work Email OTP" onClose={onClose} cancel {...rest}>
      <div>
        {!isPublicSector && (
          <TextField
            fullWidth
            label="Work Email OTP Verification*"
            InputProps={{
              endAdornment: (
                <LoadingButton
                  loading={isLoading}
                  disabled={isLoading || isBlank(workEmailOTP)}
                  size="small"
                  onClick={() => onclickValidateWorkEmailOTP()}
                  className="whitespace-nowrap"
                >
                  Verify OTP
                </LoadingButton>
              ),
            }}
            onChange={(e) => setWorkEmailOTP(e.target.value)}
          />
        )}

        <div className="mt-3 flex justify-center">
          <LoadingButton
            onClick={onclickGetWorkEMailOTP}
            size="small"
            disabled={getWorkEMailOTPResult?.isFetching}
            loading={getWorkEMailOTPResult?.isFetching}
            variant="outlined-opaque"
            color="success"
          >
            Resend OTP
          </LoadingButton>
        </div>
      </div>
    </Modal>
  );
}
