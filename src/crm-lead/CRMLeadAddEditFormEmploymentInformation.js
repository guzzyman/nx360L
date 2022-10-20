import {
  Grid,
  MenuItem,
  Autocomplete,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { nimbleX360Api } from "common/StoreQuerySlice";
import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns/esm";
import InputAdornment from "@mui/material/InputAdornment";
import { ReactComponent as NigeriaFlag } from "assets/svgs/nigeria-flag.svg";
import FormatToNumber from "common/FormatToNumber";
import useDebouncedState from "hooks/useDebouncedState";

import { nimbleX360CRMEmployerApi } from "crm-employer/CRMEmployerStoreQuerySlice";
import { isValid } from "date-fns";

function CRMLeadAddEditFormEmploymentInformation({ formik, data, isEdit }) {
  const [parentId, setParentId] = useState("");
  const { data: employmentStatusIdList } =
    nimbleX360Api.useGetCodeValuesQuery(44);

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

  const { data: employmentIdList, isFetching: employmentIdListIsLoading } =
    nimbleX360Api.useGetEmployersQuery(
      {
        ...(debouncedQ
          ? {
              selectOnlyParentEmployer: true,
              name: debouncedQ,
              active: true,
            }
          : {}),
      },
      { skip: !isEdit && !debouncedQ }
    );

  const {
    data: employmentBranchIdList,
    isFetching: employmentBranchIdListIsLoading,
  } = nimbleX360CRMEmployerApi.useGetEmployerBranchesQuery(
    useMemo(
      () => ({
        id: parentId,
        name: brachDebouncedQ || data?.clientEmployers?.[0]?.employer?.name,
      }),
      [brachDebouncedQ, parentId, data]
    ),
    { skip: !isEdit && !brachDebouncedQ && parentId }
  );

  useEffect(() => {
    if (data?.moreInfo?.clientEmployers?.[0]?.employer?.name) {
      setQ(data?.moreInfo?.clientEmployers?.[0]?.employer?.name);
    }
  }, [data?.moreInfo?.clientEmployers]);

  const { data: salaryRangeIdList } = nimbleX360Api.useGetCodeValuesQuery(43);
  const { data: stateIdList } = nimbleX360Api.useGetCodeValuesQuery(27);

  const { data: LGAIdList } = nimbleX360Api.useGetStateLGAQuery(
    formik.values.moreInfo.clientEmployers?.[0]?.stateId
  );

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
                      console.log(value, "values");
                      setParentId(value?.id);
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
                        "moreInfo.clientEmployers.[0].employerId",
                        value?.id || ""
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        label="Employer Branch Name"
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

            {formik?.values?.moreInfo?.clientEmployers?.[0]?.employerId && (
              <>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <TextField
                        fullWidth
                        label="State*"
                        select
                        {...formik.getFieldProps(
                          "moreInfo.clientEmployers.[0].stateId"
                        )}
                        value={
                          formik.values.moreInfo?.clientEmployers?.[0]
                            ?.stateId || ""
                        }
                        error={
                          !!formik.touched?.moreInfo?.clientEmployers?.[0]
                            ?.stateId &&
                          !!formik.errors?.moreInfo?.clientEmployers?.[0]
                            ?.stateId
                        }
                        helperText={
                          !!formik.touched?.moreInfo?.clientEmployers?.[0]
                            ?.stateId &&
                          formik.errors?.moreInfo?.clientEmployers?.[0]?.stateId
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
                        {...formik.getFieldProps(
                          "moreInfo.clientEmployers.[0].lgaId"
                        )}
                        value={
                          formik.values.moreInfo?.clientEmployers?.[0]?.lgaId ||
                          ""
                        }
                        error={
                          !!formik.touched?.moreInfo?.clientEmployers?.[0]
                            ?.lgaId &&
                          !!formik.errors?.moreInfo?.clientEmployers?.[0]?.lgaId
                        }
                        helperText={
                          !!formik.touched?.moreInfo?.clientEmployers?.[0]
                            ?.lgaId &&
                          formik.errors?.moreInfo?.clientEmployers?.[0]?.lgaId
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
                          "moreInfo.clientEmployers.[0].officeAddress"
                        )}
                        error={
                          !!formik.touched?.moreInfo?.clientEmployers?.[0]
                            ?.officeAddress &&
                          !!formik.errors?.moreInfo?.clientEmployers?.[0]
                            ?.officeAddress
                        }
                        helperText={
                          !!formik.touched?.moreInfo?.clientEmployers?.[0]
                            ?.officeAddress &&
                          formik.errors?.moreInfo?.clientEmployers?.[0]
                            ?.officeAddress
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
                          "moreInfo.clientEmployers.[0].nearestLandMark"
                        )}
                        error={
                          !!formik.touched?.moreInfo?.clientEmployers?.[0]
                            ?.nearestLandMark &&
                          !!formik.errors?.moreInfo?.clientEmployers?.[0]
                            ?.nearestLandMark
                        }
                        helperText={
                          !!formik.touched?.moreInfo?.clientEmployers?.[0]
                            ?.nearestLandMark &&
                          formik.errors?.moreInfo?.clientEmployers?.[0]
                            ?.nearestLandMark
                        }
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
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
                          !!formik.touched?.moreInfo?.clientEmployers?.[0]
                            ?.mobileNo &&
                          !!formik.errors?.moreInfo?.clientEmployers?.[0]
                            ?.mobileNo
                        }
                        helperText={
                          !!formik.touched?.moreInfo?.clientEmployers?.[0]
                            ?.mobileNo &&
                          formik.errors?.moreInfo?.clientEmployers?.[0]
                            ?.mobileNo
                        }
                        {...formik.getFieldProps(
                          "moreInfo.clientEmployers.[0].mobileNo"
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

      {formik?.values?.moreInfo?.clientEmployers?.[0]?.employerId && (
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
                      {...formik.getFieldProps(
                        "moreInfo.clientEmployers.[0].staffId"
                      )}
                      error={
                        !!formik.touched?.moreInfo?.clientEmployers?.[0]
                          ?.staffId &&
                        !!formik.errors?.moreInfo?.clientEmployers?.[0]?.staffId
                      }
                      helperText={
                        !!formik.touched?.moreInfo?.clientEmployers?.[0]
                          ?.staffId &&
                        formik.errors?.moreInfo?.clientEmployers?.[0]?.staffId
                      }
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Job Role/Grade*"
                      {...formik.getFieldProps(
                        "moreInfo.clientEmployers.[0].jobGrade"
                      )}
                      error={
                        !!formik.touched?.moreInfo?.clientEmployers?.[0]
                          ?.jobGrade &&
                        !!formik.errors?.moreInfo?.clientEmployers?.[0]
                          ?.jobGrade
                      }
                      helperText={
                        !!formik.touched?.moreInfo?.clientEmployers?.[0]
                          ?.jobGrade &&
                        formik.errors?.moreInfo?.clientEmployers?.[0]?.jobGrade
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
                        "moreInfo.clientEmployers.[0].employmentStatusId"
                      )}
                      value={
                        formik.values.moreInfo?.clientEmployers?.[0]
                          ?.employmentStatusId || ""
                      }
                      error={
                        !!formik.touched.clientEmployers?.[0]
                          ?.employmentStatusId &&
                        !!formik.errors?.moreInfo?.clientEmployers?.[0]
                          ?.employmentStatusId
                      }
                      helperText={
                        !!formik.touched.clientEmployers?.[0]
                          ?.employmentStatusId &&
                        formik.errors?.moreInfo?.clientEmployers?.[0]
                          ?.employmentStatusId
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
                      error={
                        !!formik.touched?.moreInfo?.clientEmployers?.[0]
                          ?.employmentDate &&
                        !!formik.errors?.moreInfo?.clientEmployers?.[0]
                          ?.employmentDate
                      }
                      helperText={
                        !!formik.touched?.moreInfo?.clientEmployers?.[0]
                          ?.employmentDate &&
                        formik.errors?.moreInfo?.clientEmployers?.[0]
                          ?.employmentDate
                      }
                      onChange={(newValue) => {
                        formik.setFieldValue(
                          "moreInfo.clientEmployers.[0].employmentDate",
                          format(new Date(newValue), "dd MMMM yyyy")
                        );
                      }}
                      value={
                        formik.values?.moreInfo?.clientEmployers?.[0]
                          ?.employmentDate || ""
                      }
                      renderInput={(params) => (
                        <TextField fullWidth {...params} />
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Work Email*"
                      {...formik.getFieldProps(
                        "moreInfo.clientEmployers.[0].emailAddress"
                      )}
                      error={
                        !!formik.touched?.moreInfo?.clientEmployers?.[0]
                          ?.emailAddress &&
                        !!formik.errors?.moreInfo?.clientEmployers?.[0]
                          ?.emailAddress
                      }
                      helperText={
                        !!formik.touched?.moreInfo?.clientEmployers?.[0]
                          ?.emailAddress &&
                        formik.errors?.moreInfo?.clientEmployers?.[0]
                          ?.emailAddress
                      }
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
                      "moreInfo.clientEmployers.[0].salaryRangeId"
                    )}
                    value={
                      formik.values.moreInfo?.clientEmployers?.[0]
                        ?.salaryRangeId || ""
                    }
                    error={
                      !!formik.touched?.moreInfo?.clientEmployers?.[0]
                        ?.salaryRangeId &&
                      !!formik.errors?.moreInfo?.clientEmployers?.[0]
                        ?.salaryRangeId
                    }
                    helperText={
                      !!formik.touched?.moreInfo?.clientEmployers?.[0]
                        ?.salaryRangeId &&
                      formik.errors?.moreInfo?.clientEmployers?.[0]
                        ?.salaryRangeId
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
                      !!formik.touched?.moreInfo?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate &&
                      !!formik.errors?.moreInfo?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate
                    }
                    helperText={
                      !!formik.touched?.moreInfo?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate &&
                      formik.errors?.moreInfo?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate
                    }
                    onChange={(newValue) => {
                      if (isValid(new Date(newValue))) {
                        formik.setFieldValue(
                          "moreInfo.clientEmployers.[0].nextMonthSalaryPaymentDate",
                          format(new Date(newValue), "dd MMMM yyyy")
                        );
                      }
                    }}
                    value={
                      formik.values?.moreInfo?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate || ""
                    }
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </div>
        </Paper>
      )}
    </div>
  );
}

export default CRMLeadAddEditFormEmploymentInformation;
