import {
  Paper,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { nimbleX360Api } from "common/StoreQuerySlice";
import { getTextFieldFormikProps } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import { useEffect, useState } from "react";
import { nimbleX360CRMEmployerApi } from "./CRMEmployerStoreQuerySlice";

function CRMEmployerAddEditInformation({
  formik,
  data,
  isEdit,
  setOfficeType,
  isAddBranch,
  parentId,
  officeType,
}) {
  const { data: clientType } = nimbleX360Api.useGetCodeValuesQuery(16);
  const { data: employerSector } = nimbleX360Api.useGetCodeValuesQuery(36);
  const { data: employerIndustry } = nimbleX360Api.useGetCodeValuesQuery(39);

  const [bQ, setBQ] = useState("");

  const [brachDebouncedQ] = useDebouncedState(bQ, {
    wait: 1000,
    enableReInitialize: true,
  });

  const { data: parentData } = nimbleX360CRMEmployerApi.useGetCRMEmployerQuery(
    parentId,
    {
      skip: !parentId,
    }
  );
  const {
    data: employmentParentIdList,
    isFetching: employmentParentIdListIsLoading,
  } = nimbleX360CRMEmployerApi.useGetCRMEmployersQuery(
    {
      selectOnlyParentEmployer: true,
      sectorId: formik?.values?.sectorId || data?.sector?.id || parentData?.id,
      name: brachDebouncedQ || data?.parent?.name || parentData?.name,
      active: true,
    },
    {
      skip: !brachDebouncedQ,
    }
  );

  console.log("parentData", parentData?.name);
  useEffect(() => {
    if (formik?.values?.clientTypeId) {
      if (
        formik?.values?.clientTypeId === 67 ||
        formik?.values?.clientTypeId === 68 ||
        formik?.values?.clientTypeId === 2492
      ) {
        formik.setFieldValue("sectorId", 18);
      } else {
        formik.setFieldValue("sectorId", 17);
      }
    }
    // eslint-disable-next-line
  }, [formik?.values?.clientTypeId]);

  useEffect(() => {
    if (parentData?.name) {
      setBQ(parentData?.name);
    }
  }, [parentData?.name]);

  useEffect(() => {
    if (data?.parent?.id) {
      setBQ(data?.parent?.name);
    }
  }, [data?.parent?.id]);

  return (
    <div className="grid gap-4">
      <Paper className="p-4 md:p-8">
        <Typography variant="h6" className="font-bold">
          Employer Information
        </Typography>
        <Typography variant="body2" className="mb-8" color="textSecondary">
          Kindly fill in all required information in the Employer application
          form.
        </Typography>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl">
          <TextField
            required
            label="Fullname"
            {...getTextFieldFormikProps(formik, "name")}
          />

          <TextField
            label="Nickname"
            {...getTextFieldFormikProps(formik, "slug")}
          />

          <TextField
            select
            label="Employer Type"
            {...getTextFieldFormikProps(formik, "clientTypeId")}
          >
            {clientType &&
              clientType?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField select value={officeType} label="Office Type">
            {[
              { name: "Head Office", id: 1 },
              { name: "Branch", id: 2 },
            ]?.map((option, index) => (
              <MenuItem
                key={index}
                value={option.id}
                onClick={() => setOfficeType(option.id)}
              >
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          {officeType === 2 && (
            <Autocomplete
              loading={employmentParentIdListIsLoading}
              freeSolo
              options={employmentParentIdList?.pageItems || []}
              getOptionLabel={(option) => option?.name}
              inputValue={bQ || ""}
              onInputChange={(_, value) => setBQ(value)}
              onChange={(_, value) => {
                formik.setFieldValue("parentId", value?.id || "");
              }}
              renderInput={(params) => (
                <TextField
                  label="Specify Head Office"
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {employmentParentIdListIsLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}

          <TextField
            select
            required
            label="Sector"
            disabled
            {...getTextFieldFormikProps(formik, "sectorId")}
          >
            {employerSector &&
              employerSector?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            select
            required
            label="Industry"
            {...getTextFieldFormikProps(formik, "industryId")}
          >
            {employerIndustry &&
              employerIndustry?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
        </div>
      </Paper>
    </div>
  );
}

export default CRMEmployerAddEditInformation;
