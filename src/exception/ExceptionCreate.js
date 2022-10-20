import React, { useEffect, useRef } from "react";
import {
  sequestExceptionApi,
  nx360RequestApi,
} from "./ExceptionStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { getTextFieldFormikProps } from "common/Utils";
import {
  TextField,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import useAuthUser from "hooks/useAuthUser";
import { Box } from "@mui/system";
import FileUploadInput from "common/FileUploadInput";
import { blobToBase64 } from "common/Utils";
import useDataRef from "hooks/useDataRef";

export default function ExceptionCreate(props) {
  const {
    title = "New Exception",
    submitText = "Submit Exception",
    open,
    onClose,
    userType,
    customerId,
    isDisabled,
    ...rest
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  const authUser = useAuthUser();

  const requestAttachmentRef = useRef();

  const isException = userType === undefined;

  const [addMutation, { isLoading }] =
    sequestExceptionApi.useAddExceptionMutation();
  const unitTemplateQueryResult = sequestExceptionApi.useGetUnitsQuery();
  const unitQueryResult = unitTemplateQueryResult.data?.data || [];

  const organizationUserQueryResult = nx360RequestApi.useGetUsersQuery();
  const organizationUser = organizationUserQueryResult?.data;

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      creatorName: `${authUser?.fullname}`,
      creatorStaffId: `${authUser?.staff?.id}`,
      creatorEmail: authUser.email,
      creatorUnitId: `${authUser?.staff?.organizationUnit?.id}`,
      categoryId: "",
      subCategoryId: "",
      supportingDocs: "",
      fileName: "",
      fileSize: "",
      sequestTypeId: 2,
      responsiblePersons: [
        {
          sequestActorId: 0,
          responsibleUnitId: isException ? "" : "8",
          responsiblePersonEmail: "",
          responsiblePersonName: "",
          responsiblePersonStaffId: "",
        },
      ],
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object({
      title: Yup.string().trim().required(),
      description: Yup.string().trim().required(),
      responsiblePersonStaffId: Yup.string().trim().required(),
      responsibleUnitId: Yup.string().trim().required(),
      categoryId: Yup.string().trim().required(),
      subCategoryId: Yup.string().trim().required(),
    }),
    onSubmit: async (values) => {
      try {
        await addMutation({ ...values }).unwrap();
        enqueueSnackbar(
          isException
            ? "Request Created Successfully!"
            : "Interaction Created Successfully!",
          {
            variant: "success",
          }
        );
        onClose();
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.length ? (
            <div>
              {error?.data?.errors?.map((error, key) => (
                <Typography key={key}>{error?.defaultUserMessage}</Typography>
              ))}
            </div>
          ) : isException ? (
            "Failed to Create Exception"
          ) : (
            "Failed to Add Interaction"
          ),
          { variant: "error" }
        );
      }
    },
  });

  const handlerequestAttachmentChange = async (e) => {
    try {
      let file = e.target.files[0];
      formik.setFieldValue("supportingDocs", await blobToBase64(file));
      formik.setFieldValue("fileName", file.name);
      formik.setFieldValue("fileSize", file.size.toString());
    } catch (error) {
      enqueueSnackbar(`Failed to attach files`, { variant: "error" });
    }
  };

  const subcategoryByCategoryTemplateQueryResult =
    sequestExceptionApi.useGetSubCategoryByCategoryIDQuery(
      formik.values.categoryId,
      {
        skip: !formik.values.categoryId,
      }
    );

  const subcategoryTemplate =
    subcategoryByCategoryTemplateQueryResult.data?.data;

  const exceptionCategoryQueryResult =
    sequestExceptionApi.useGetExceptionCategoryQuery();

  const exceptionCategory = exceptionCategoryQueryResult.data?.data || [];

  const userDetailsByIdQueryResult = nx360RequestApi.useGetUserByIdQuery(
    formik?.values?.responsiblePersonStaffId,
    {
      skip: !formik?.values?.responsiblePersonStaffId,
    }
  );

  const userDetailsById = userDetailsByIdQueryResult?.data;
  console.log(userDetailsById, formik?.values.responsiblePersonStaffId);

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (!!userDetailsById?.staff?.id) {
      dataRef.current.formik.setValues({
        ...dataRef.current.formik.values,
        responsiblePersons: [
          {
            responsiblePersonEmail: `${userDetailsById?.email}`,
            responsiblePersonName: `${userDetailsById?.firstname} ${userDetailsById?.lastname}`,
            responsiblePersonStaffId: userDetailsById?.id.toString(),
            responsibleUnitId: userDetailsById?.staff?.id || "",
          },
        ],
      });
    }
  }, [dataRef, userDetailsById]);

  return (
    <Dialog open={open} fullWidth {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 py-4">
          <TextField
            label="Title"
            className="sm:col-span-2"
            {...formik.getFieldProps("title")}
            error={!!formik.touched.title && formik.errors.title}
            helperText={!!formik.touched.title && formik.errors.title}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={6}
            className="sm:col-span-2"
            {...getTextFieldFormikProps(formik, "description")}
          />
          <TextField
            select
            label="Responsible Person Email"
            {...getTextFieldFormikProps(formik, "responsiblePersonStaffId")}
          >
            {organizationUser?.map((option) => (
              <MenuItem key={option?.id} value={option?.id}>
                {option?.username}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Responsible Department (Unit):"
            select
            disabled={!isException}
            {...getTextFieldFormikProps(formik, "responsibleUnitId")}
            onChange={(e) => {
              if (isException) {
                formik.handleChange(e);
              }
            }}
          >
            {unitQueryResult.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.unitName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Category:"
            select
            {...getTextFieldFormikProps(formik, "categoryId")}
          >
            {exceptionCategory?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.categoryName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Sub-Category:"
            select
            {...getTextFieldFormikProps(formik, "subCategoryId")}
          >
            {subcategoryTemplate?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.subCategoryName}
              </MenuItem>
            ))}
          </TextField>
          <Box>
            <FileUploadInput
              fileRef={requestAttachmentRef}
              label="Supporting Document"
              // className="sm:col-span-2"
              onChange={handlerequestAttachmentChange}
              fullWidth
              error={
                !!formik.touched.supportingDocs &&
                !!formik.errors.supportingDocs
              }
              helperText={
                !!formik.touched.supportingDocs && formik.errors.supportingDocs
              }
              inputProps={{
                accept: ".jpg, .jpeg, .png, .doc, .docx, .xls, .xlxs, .pdf",
              }}
            />
            <FormHelperText>
              Upload supportingDocs with the following file format .jpg, .jpeg,
              .png, .doc, .docx, .xls, .xlxs, .pdf format
            </FormHelperText>
          </Box>
          {!isException && (
            <FormControlLabel
              label="Is Ticket Resolved"
              control={
                <Checkbox
                  checked={formik.values?.closeTicket}
                  onChange={(event) => {
                    formik.setFieldValue("closeTicket", event.target.checked);
                  }}
                  value={formik.values?.closeTicket}
                />
              }
            />
          )}
          {isException ? undefined : (
            <FormControlLabel
              label="Escalate Request"
              className="sm:col-span-2"
              control={
                <Checkbox
                  checked={formik.values.escalateRequest?.escalate}
                  onChange={(event) => {
                    formik.setFieldValue(
                      "escalateRequest.escalate",
                      event.target.checked
                    );
                  }}
                />
              }
            />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
          {submitText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
