import { DatePicker, LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import FileUploadInput from "common/FileUploadInput";
import Modal from "common/Modal";

import { useFormik } from "formik";
import useAuthUser from "hooks/useAuthUser";
import { useSnackbar } from "notistack";
import React from "react";
import * as yup from "yup";
import { BankScheduleStoreQuerySlice } from "./BankScheduleStoreQuerySlice";
import { nimbleX360Api } from "common/StoreQuerySlice";
import { getTextFieldFormikProps } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import { nimbleX360CRMEmployerApi } from "crm-employer/CRMEmployerStoreQuerySlice";
import { useState } from "react";
import { useEffect } from "react";

export default function BankScheduleAddDialog({ open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthUser();
  const [q, setQ] = useState("");

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const [uploadBankSchedule, uploadBankScheduleQuery] =
    BankScheduleStoreQuerySlice.useUploadBankScheduleMutation();
  const formik = useFormik({
    initialValues: {
      date: "",
      EmployerId: "",
      UploadedById: user.id,
      UploadedByName: user.fullname,
      UploadedByEmail: user.email,
      SectorId: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      date: yup.date().required(),
      file: yup.string().required(),
      SectorId: yup.string().required(),
    }),

    onSubmit: async (values, helper) => {
      try {
        const dateFn = new Date(values.date);
        const newValues = {
          Month: dateFn.getMonth() + 1,
          Year: dateFn.getFullYear(),
          UploadedById: values.UploadedById,
          UploadedByName: values.UploadedByName,
          UploadedByEmail: values.UploadedByEmail,
          file: values.file,
          SectorId: values.SectorId,
          ...(values.StateId ? { StateId: values.StateId } : {}),
          ...(values.EmployerId ? { EmployerId: values.EmployerId } : {}),
        };
        const resp = await uploadBankSchedule(newValues).unwrap();
        onClose();

        enqueueSnackbar(
          resp?.message || "Bank Schedule uploaded Successfully",
          {
            variant: "success",
          }
        );
      } catch (error) {
        console.log("error", error);
        enqueueSnackbar(
          error?.data?.message || "Failed to Upload Bank Schedule",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const { data: stateIdList } = nimbleX360Api.useGetCodeValuesQuery(27);
  const { data: employerSector } = nimbleX360Api.useGetCodeValuesQuery(16);

  const { data: employmentIdList, isFetching: employmentIdListIsLoading } =
    nimbleX360Api.useGetEmployersQuery(
      {
        ...(debouncedQ
          ? {
              selectOnlyParentEmployer: true,
              name: debouncedQ,
              // if sector is public
              ...(formik?.values?.SectorId && {
                SectorId: formik?.values?.SectorId,
              }),
            }
          : {}),
      },
      { skip: !debouncedQ }
    );

  const federalID = 67;
  // const stateID = 68;
  const privateID = 2645;

  useEffect(() => {
    if (formik.values.SectorId === federalID) {
      // set FCT as state for federal sector
      formik.setFieldValue("StateId", 105);
    } else {
      formik.setFieldValue("StateId", "");
    }
  }, [formik.values.SectorId]);

  return (
    <Modal title="Add Bank Schedule" open={open} onClose={onClose} cancel>
      <div className="grid grid-cols-1 gap-4 ">
        <DatePicker
          views={["year", "month"]}
          label="Year and Month"
          inputFormat="yyyy-MM"
          disableFuture
          helperText={
            !!formik.touched.activationDate && formik.errors.activationDate
          }
          onChange={(newValue) => {
            formik.setFieldValue("date", new Date(newValue));
          }}
          value={formik.values?.date}
          renderInput={(params) => <TextField fullWidth {...params} />}
        />

        <FileUploadInput
          fullWidth
          label="Bank Schedule"
          onChange={(e) => {
            let file = e.target.files[0];
            formik.setFieldValue("file", file);
          }}
          maxSize={100 * 1024 * 1024}
          error={!!formik.touched.file && !!formik.errors.file}
          helperText={!!formik.touched.file && formik.errors.file}
          inputProps={{
            accept:
              ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
          }}
        />

        <TextField
          select
          required
          label="Sector"
          {...getTextFieldFormikProps(formik, "SectorId")}
        >
          {/* sector without NYSC */}
          {employerSector &&
            employerSector
              ?.filter((val) => val.id !== 2492)
              ?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
        </TextField>

        {formik.values.SectorId !== privateID && (
          <TextField
            fullWidth
            label="State"
            select
            {...formik.getFieldProps("StateId")}
            disabled={formik.values.SectorId === federalID}
            error={!!formik.touched?.StateId && !!formik.errors?.StateId}
            helperText={!!formik.touched?.StateId && formik.errors?.StateId}
          >
            {stateIdList &&
              stateIdList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
        )}

        {formik.values.SectorId === privateID && (
          <Autocomplete
            loading={employmentIdListIsLoading}
            freeSolo
            options={employmentIdList?.pageItems || []}
            getOptionLabel={(option) => option?.name}
            inputValue={q || ""}
            onInputChange={(_, value) => setQ(value)}
            onChange={(_, value) => {
              formik.setFieldValue("EmployerId", value?.id);
            }}
            renderInput={(params) => (
              <TextField
                label="Employer"
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
        )}
      </div>

      <LoadingButton
        loading={uploadBankScheduleQuery.isLoading}
        fullWidth
        className="mt-4"
        onClick={formik.handleSubmit}
      >
        Upload Bank Schedule
      </LoadingButton>
    </Modal>
  );
}
