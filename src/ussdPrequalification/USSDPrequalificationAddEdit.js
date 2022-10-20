import { DatePicker, LoadingButton } from "@mui/lab";
import { MenuItem, TextField } from "@mui/material";
import Modal from "common/Modal";

import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React from "react";
import * as yup from "yup";
import { ussdPrequalificationQuerySlice } from "./UssdPrequalificationStoreQuerySlice";
import { nimbleX360Api } from "common/StoreQuerySlice";
import { getTextFieldFormikProps } from "common/Utils";
import { nimbleX360CRMLoanProductApi } from "loan-product/LoanProductStoreQuerySlice";

export default function USSDPrequalificationAddEdit({
  open,
  onClose,
  ussPrequalificationInstance,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const isEdit = !!ussPrequalificationInstance;

  const [ussdPrequalificationAdd, ussdPrequalificationAddResultQuery] =
    ussdPrequalificationQuerySlice.useAddUSSDPrequalificationMutation();

  const [ussdPrequalificationEdit, ussdPrequalificationEditResultQuery] =
    ussdPrequalificationQuerySlice.useEditUSSDPrequalificationMutation();

  const loanProductQuery =
    nimbleX360CRMLoanProductApi.useGetLoanProductsQuery();
  const formik = useFormik({
    initialValues: {
      productName: ussPrequalificationInstance?.productName || "",
      productId: ussPrequalificationInstance?.productId || "",
      state: ussPrequalificationInstance?.state || "",
      startDate: ussPrequalificationInstance?.startDate || "",
      endDate: ussPrequalificationInstance?.endDate || "",
      frequency: ussPrequalificationInstance?.frequency || "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      startDate: yup.date().required(),
      endDate: yup.date().required(),
      state: yup.string().required(),
      frequency: yup.string().required(),
      productName: yup.string().required(),
      productId: yup.string().required(),
    }),

    onSubmit: async (values, helper) => {
      try {
        const resp = isEdit
          ? await ussdPrequalificationEdit({
              id: ussPrequalificationInstance.id,
              ...values,
            }).unwrap()
          : await ussdPrequalificationAdd(values).unwrap();
        onClose();

        enqueueSnackbar(
          resp?.message ||
            `${isEdit ? "Edit" : "add"} USSD Prequalification Successfully`,
          {
            variant: "success",
          }
        );
      } catch (error) {
        console.log("error", error);
        enqueueSnackbar(
          error?.data?.message ||
            `Failed to ${isEdit ? "Edit" : "add"} USSD Prequalification `,
          {
            variant: "error",
          }
        );
      }
    },
  });

  const { data: stateIdList } = nimbleX360Api.useGetCodeValuesQuery(27);

  return (
    <Modal title="Add Bank Schedule" open={open} onClose={onClose} cancel>
      <div className="grid grid-cols-2 gap-4 ">
        <TextField
          fullWidth
          label="Product Name"
          className="mb-5 col-span-2"
          select
          {...getTextFieldFormikProps(formik, "productId")}
        >
          {loanProductQuery?.data &&
            loanProductQuery?.data?.map((option) => (
              <MenuItem
                key={option.id}
                onClick={() => formik.setFieldValue("productName", option.name)}
                value={option.id}
              >
                {option.name}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          fullWidth
          label="State"
          className="mb-5 col-span-2"
          select
          {...formik.getFieldProps("state")}
          error={!!formik.touched?.state && !!formik.errors?.state}
          helperText={!!formik.touched?.state && formik.errors?.state}
        >
          {stateIdList &&
            stateIdList.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
        </TextField>

        <DatePicker
          label="Start Date"
          inputFormat="yyyy-MM-dd"
          disablePast
          helperText={!!formik.touched.startDate && formik.errors.startDate}
          onChange={(newValue) => {
            formik.setFieldValue("startDate", new Date(newValue));
          }}
          fullWidth
          className="mb-5"
          value={formik.values?.startDate}
          renderInput={(params) => <TextField fullWidth {...params} />}
        />

        <DatePicker
          label="End Date"
          inputFormat="yyyy-MM-dd"
          disablePast
          className="mb-5"
          helperText={!!formik.touched.endDate && formik.errors.endDate}
          onChange={(newValue) => {
            formik.setFieldValue("endDate", new Date(newValue));
          }}
          fullWidth
          value={formik.values?.endDate}
          renderInput={(params) => <TextField fullWidth {...params} />}
        />

        <TextField
          fullWidth
          label="Frequency"
          select
          className="col-span-2"
          {...formik.getFieldProps("frequency")}
          error={!!formik.touched?.frequency && !!formik.errors?.frequency}
          helperText={!!formik.touched?.frequency && formik.errors?.frequency}
        >
          {["daily", "Monthly", "quarterly", "annual"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <LoadingButton
        loading={
          ussdPrequalificationAddResultQuery.isLoading ||
          ussdPrequalificationEditResultQuery.isLoading
        }
        fullWidth
        className="mt-4"
        onClick={formik.handleSubmit}
      >
        {isEdit ? "Edit" : "Add"} Ussd Prequalification
      </LoadingButton>
    </Modal>
  );
}
