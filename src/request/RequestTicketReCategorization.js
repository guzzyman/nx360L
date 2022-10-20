// import React, { useEffect, useState } from "react";
import { getTextFieldFormikProps } from "common/Utils";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { sequestRequestApi, nx360RequestApi } from "./RequestStoreQuerySlice";
// import useDebouncedState from "hooks/useDebouncedState";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
// import { useNavigate } from "react-router-dom";
// import useDataRef from "hooks/useDataRef";
// import useAuthUser from "hooks/useAuthUser";

function RequestTicketReCategorization(props) {
  const { title, open, onClose, affectedPersonEmail, clientId, ticketId, ...rest } =
    props;
  // const [q, setQ] = useState("");
  // const authUser = useAuthUser();
  // const [debouncedQ] = useDebouncedState(q, {
  //   wait: 1000,
  //   enableReInitialize: true,
  // });
  const [updateClientMutation, updateClientMutationResult] =
    nx360RequestApi.useUpdateCRMClientMutation();
  const { enqueueSnackbar } = useSnackbar();
  // const navigate = useNavigate();
  const [updateTicketCategoryMutation, updateTicketCategoryMutationResults] =
    sequestRequestApi.useUpdateTicketCategoryMutation();

  // const userTypeTemplateQueryResult = sequestRequestApi.useGetUserTypesQuery();
  const unitTemplateQueryResult = sequestRequestApi.useGetUnitsQuery();
  // const userTypeQueryResult = userTypeTemplateQueryResult.data?.data || [];
  const unitQueryResult = unitTemplateQueryResult.data?.data || [];

  const formik = useFormik({
    initialValues: {
      ticketId: `${ticketId}`,
      categoryId: "",
      subCategoryId: "",
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: yup.object({
      categoryId: yup.string().trim().required(),
      subCategoryId: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        const data = await updateTicketCategoryMutation({
          ticketId: values.ticketId,
          categoryId: values.categoryId,
          subCategoryId: values.subCategoryId
        }).unwrap();
        onClose(data);
        helper.resetForm();
        enqueueSnackbar(
          data?.defaultUserMessage || "Ticket Recategorized Successfully!!!",
          {
            variant: "success",
          }
        );
      } catch (error) {
        enqueueSnackbar(
          error?.data?.defaultUserMessage ||
            "Failed to Recategorized Ticket!!!",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const subcategoryByCategoryTemplateQueryResult =
    sequestRequestApi.useGetSubCategoryByCategoryIDQuery(
      formik.values.categoryId,
      {
        skip: !formik.values.categoryId,
      }
    );

  const subcategoryQueryResult =
    subcategoryByCategoryTemplateQueryResult.data?.data || [];
  const affectedUserType = 2;
  const requestTypeByAfftectedQueryResult =
    sequestRequestApi.useGetRequestTypeByAffectedTypeQuery(affectedUserType, {
      skip: !affectedUserType,
    });

  const affectedTypeQueryResult =
    requestTypeByAfftectedQueryResult.data?.data || [];

  console.log(affectedTypeQueryResult);

  const getCategoryByType = sequestRequestApi.useGetCategoriesByTypesQuery({
    requestTypeId: formik.values.requestTypeId,
    responsibleUnitId: formik.values.responsibleUnitId,
  });

  const getCategoriesResultsOptions = getCategoryByType?.data?.data;

  return (
    <Dialog maxWidth="xs" open={open} fullWidth>
      <DialogTitle>Update Client Details</DialogTitle>
      <DialogContent>
        <div className="grid gap-4 my-4">
          <TextField
            label="Responsible Department (Unit):"
            select
            {...getTextFieldFormikProps(formik, "responsibleUnitId")}
            onChange={(e) => {
              formik.handleChange(e);
            }}
          >
            {unitQueryResult.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.unitName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Ticket Type:"
            select
            {...formik.getFieldProps("requestTypeId")}
            error={
              !!formik.touched.requestTypeId && formik.errors.requestTypeId
            }
            helperText={
              !!formik.touched.requestTypeId && formik.errors.requestTypeId
            }
          >
            {affectedTypeQueryResult.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.requestTypeName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Category:"
            select
            {...formik.getFieldProps("categoryId")}
            error={!!formik.touched.categoryId && formik.errors.categoryId}
            helperText={!!formik.touched.categoryId && formik.errors.categoryId}
          >
            {getCategoriesResultsOptions?.map((option) => (
              <MenuItem key={option?.id} value={option?.id}>
                {option?.categoryName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Sub-Category:"
            select
            {...formik.getFieldProps("subCategoryId")}
            error={
              !!formik.touched.subCategoryId && formik.errors.subCategoryId
            }
            helperText={
              !!formik.touched.subCategoryId && formik.errors.subCategoryId
            }
          >
            {subcategoryQueryResult.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.subCategoryName}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            formik.resetForm();
            onClose();
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={updateClientMutationResult.isLoading}
          loading={updateClientMutationResult.isLoading}
          loadingPosition="end"
          endIcon={<></>}
          type="submit"
          onClick={formik.handleSubmit}
        >
          Update Client
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default RequestTicketReCategorization;
