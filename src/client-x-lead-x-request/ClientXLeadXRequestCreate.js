import React, { useCallback, useRef } from "react";
import { sequestRequestApi } from "./ClientXLeadXRequestStoreQuerySlice";
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
  Icon,
  Menu,
  ListItemText,
  IconButton,
  FormControl,
  FormLabel,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import useAuthUser from "hooks/useAuthUser";
import { Box } from "@mui/system";
import FileUploadInput from "common/FileUploadInput";
import { blobToBase64 } from "common/Utils";
import { userTypeEnum } from "./ClientXLeadXRequestConstants";
import { getUserErrorMessage } from "common/Utils";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import CKEditorDecoupled from "@ckeditor/ckeditor5-build-decoupled-document";
import useToggle from "hooks/useToggle";
import useDataRef from "hooks/useDataRef";
import usePopover from "hooks/usePopover";
import "./ClientXLeadXRequest.css";
import { EMAIL_RESPONSE_TEMPLATE } from "request/RequestConstants";

export default function ClientXLeadXRequestCreate(props) {
  const {
    title = "New Request",
    submitText = "Submit Request",
    open,
    onClose,
    userType,
    customerId,
    isDisabled,
    ...rest
  } = props;

  const authUser = useAuthUser();

  const requestAttachmentRef = useRef();

  const isSequestRequest = userType === undefined;

  const [addMutation, { isLoading }] =
    sequestRequestApi.useAddRequestMutation();
  const userTypeTemplateQueryResult = sequestRequestApi.useGetUserTypesQuery();
  const unitTemplateQueryResult = sequestRequestApi.useGetUnitsQuery();
  const userTypeQueryResult = userTypeTemplateQueryResult.data?.data || [];
  const unitQueryResult = unitTemplateQueryResult.data?.data || [];
  const escalatedUnitQueryResult = unitTemplateQueryResult.data?.data || [];
  const requestChannel = sequestRequestApi.useGetChannelsQuery();
  const requestChannelQueryResult = requestChannel?.data?.data || [];

  const { enqueueSnackbar } = useSnackbar();

  const templatePopover = usePopover();
  const toolbarRef = useRef();
  const [isToolbar, toggleToolbar] = useToggle();

  const formik = useFormik({
    initialValues: {
      subject: "",
      description: "",
      affectedTypeId: isSequestRequest ? "" : userType,
      affectedPartyEmail: "",
      affectedPartyName: "",
      clientId: `${customerId || ""}`,
      responsibleUnitId: isSequestRequest ? "" : "2666",
      closeTicket: false,
      requestTypeId: "",
      requestingParty: authUser?.staff?.organizationUnit?.id,
      categoryId: "",
      subCategoryId: "",
      hasAttachment: false,
      channelId: "",
      fileName: "",
      fileSize: "",
      attachment: "",
      createdBy: `${authUser.fullname}`,
      createdById: `${authUser?.staffId}`,
      createdByEmail: authUser.email,
      notifyCustomer: false,
      escalateRequest: {
        escalate: false,
        unitResponsible: 0,
        category: 0,
        subCategory: 0,
      },
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object({
      subject: Yup.string().trim().required(),
      description: Yup.string().trim().required(),
      affectedTypeId: Yup.string().trim().required(),
      clientId: Yup.string().trim().required(),
      channelId: Yup.string().trim().required(),
      responsibleUnitId: Yup.string().trim().required(),
      requestTypeId: Yup.string().trim().required(),
      categoryId: Yup.string().trim().required(),
      subCategoryId: Yup.string().trim().required(),
      escalateRequest: Yup.object().shape({
        escalate: Yup.string().trim().required(),
        unitResponsible: Yup.string().trim().required(),
        category: Yup.string().trim().required(),
        subCategory: Yup.string().trim().required(),
      }),
    }),
    onSubmit: async (values) => {
      try {
        await addMutation({ ...values }).unwrap();
        enqueueSnackbar(
          isSequestRequest
            ? "Request Created Successfully!"
            : "Interaction Created Successfully!",
          {
            variant: "success",
          }
        );
        onClose();
      } catch (error) {
        enqueueSnackbar(
          getUserErrorMessage(error.data.message) ||
            `Error submitting form, ${error?.data?.message} ... kindly contact support`,
          {
            variant: "error",
          }
        );
      }
    },
  });

  const isEscalate = formik.values?.escalateRequest?.escalate;

  const dataRef = useDataRef({ formik });

  const affectedType = formik.values?.affectedTypeId;

  const handlerequestAttachmentChange = async (e) => {
    try {
      let file = e.target.files[0];
      formik.setFieldValue("attachment", await blobToBase64(file));
      formik.setFieldValue("fileName", file.name);
      formik.setFieldValue("fileSize", file.size.toString());
    } catch (error) {
      enqueueSnackbar(`Failed to attach files`, { variant: "error" });
    }
  };

  const subcategoryByCategoryTemplateQueryResult =
    sequestRequestApi.useGetSubCategoryByCategoryIDQuery(
      formik.values.categoryId,
      {
        skip: !formik.values.categoryId,
      }
    );

  const subcategoryQueryResult =
    subcategoryByCategoryTemplateQueryResult.data?.data || [];

  const requestTypeByAfftectedQueryResult =
    sequestRequestApi.useGetRequestTypeByAffectedTypeQuery(
      formik.values.affectedTypeId,
      {
        skip: !formik.values.affectedTypeId,
      }
    );

  const affectedTypeQueryResult =
    requestTypeByAfftectedQueryResult.data?.data || [];

  const getCategoryByEscalatedUnitIdQueryResult =
    sequestRequestApi.useGetCategoryByUnitIdQuery(
      formik.values.escalateRequest?.unitResponsible,
      {
        skip: !formik.values.escalateRequest?.unitResponsible,
      }
    );

  const escalatedSubcategoryByCategoryTemplateQueryResult =
    sequestRequestApi.useGetSubCategoryByCategoryIDQuery(
      formik.values.escalateRequest?.category,
      {
        skip: !formik.values.escalateRequest?.category,
      }
    );

  const escalatedSubcategoryQueryResult =
    escalatedSubcategoryByCategoryTemplateQueryResult.data?.data || [];

  const CategoryByEscalatedUnitQueryResult =
    getCategoryByEscalatedUnitIdQueryResult.data?.data || [];

  const getCategoryByType = sequestRequestApi.useGetCategoriesByTypesQuery({
    requestTypeId: formik.values.requestTypeId,
    responsibleUnitId: formik.values.responsibleUnitId,
  });

  const getCategoriesResultsOptions = getCategoryByType?.data?.data;

  const onEditorReady = useCallback((editor) => {
    toolbarRef.current.appendChild(editor.ui.view.toolbar.element);
  }, []);

  const onChangeBody = useCallback(
    (event, editor) => {
      dataRef.current.formik.setFieldValue("description", editor.getData());
    },
    [dataRef]
  );

  return (
    <Dialog open={open} fullWidth {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className="ClientXLeadXRequest">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 py-4">
          <TextField
            label="Title"
            className="sm:col-span-2"
            {...formik.getFieldProps("subject")}
            error={!!formik.touched.subject && formik.errors.subject}
            helperText={!!formik.touched.subject && formik.errors.subject}
          />

          {affectedType === 2 ? (
            <div className="sm:col-span-2">
              <FormControl fullWidth>
                <FormLabel>Description</FormLabel>
                <div className="border rounded" style={{ borderColor: "gray" }}>
                  <CKEditor
                    data={formik.values.description}
                    editor={CKEditorDecoupled}
                    onReady={onEditorReady}
                    onChange={onChangeBody}
                  />
                </div>
                <div className="relative mb-2">
                  <div ref={toolbarRef} hidden={!isToolbar} />
                </div>
              </FormControl>
              <>
                <Button
                  variant="outlined"
                  endIcon={<Icon>expand_more</Icon>}
                  onClick={templatePopover.togglePopover}
                >
                  Select Template
                </Button>
                <Menu
                  open={templatePopover.isOpen}
                  anchorEl={templatePopover.anchorEl}
                  onClose={templatePopover.togglePopover}
                >
                  {EMAIL_RESPONSE_TEMPLATE.map((template, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        templatePopover.togglePopover();
                        formik.setFieldValue(
                          "description",
                          `${template.opening}
                            <p>&nbsp;</p><p>&nbsp;</p>
                            ${template.closing}
                            `
                        );
                      }}
                    >
                      <ListItemText>{template.category}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
                <IconButton onClick={toggleToolbar} className="ml-2">
                  <Icon>menu</Icon>
                </IconButton>
              </>
            </div>
          ) : (
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={6}
              className="sm:col-span-2"
              {...getTextFieldFormikProps(formik, "description")}
            />
          )}

          <TextField
            label="Related User Type:"
            disabled={!isSequestRequest}
            {...getTextFieldFormikProps(formik, "affectedTypeId")}
            onChange={(e) => {
              if (isSequestRequest) {
                formik.handleChange(e);
              }
            }}
            select
          >
            {userTypeQueryResult.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.affectedTypeName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={`${
              userType === userTypeEnum.CUSTOMER
                ? "Customer"
                : userType === userTypeEnum.LEAD
                ? "Lead"
                : userType === userTypeEnum.EMPLOYER
                ? "Employer"
                : "Staff"
            } Id`}
            disabled={!isSequestRequest}
            {...getTextFieldFormikProps(formik, "clientId")}
            onChange={(e) => {
              if (isSequestRequest) {
                formik.handleChange(e);
              }
            }}
          />
          <TextField
            label="Responsible Department (Unit):"
            select
            disabled={!isSequestRequest}
            {...getTextFieldFormikProps(formik, "responsibleUnitId")}
            onChange={(e) => {
              if (isSequestRequest) {
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
          <TextField
            label="Request Channel:"
            select
            {...formik.getFieldProps("channelId")}
            error={!!formik.touched.channelId && formik.errors.channelId}
            helperText={!!formik.touched.channelId && formik.errors.channelId}
          >
            {requestChannelQueryResult.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.channelName}
              </MenuItem>
            ))}
          </TextField>
          <Box>
            <FileUploadInput
              fileRef={requestAttachmentRef}
              label="Request Attachment"
              // className="sm:col-span-2"
              onChange={handlerequestAttachmentChange}
              fullWidth
              error={!!formik.touched.attachment && !!formik.errors.attachment}
              helperText={
                !!formik.touched.attachment && formik.errors.attachment
              }
              inputProps={{
                accept: ".jpg, .jpeg, .png, .doc, .docx, .xls, .xlxs, .pdf",
              }}
            />
            <FormHelperText>
              Upload attachment with the following file format .jpg, .jpeg,
              .png, .doc, .docx, .xls, .xlxs, .pdf format
            </FormHelperText>
          </Box>
          {affectedType === 2 ? (
            <FormControlLabel
              label="Notify Customer"
              control={
                <Checkbox
                  checked={formik.values.notifyCustomer}
                  onChange={(event) => {
                    formik.setFieldValue(
                      "notifyCustomer",
                      event.target.checked
                    );
                  }}
                />
              }
            />
          ) : undefined}
          {!isSequestRequest && (
            <FormControlLabel
              label="Is Ticket Resolved"
              control={
                <Checkbox
                  checked={formik.values?.closeTicket}
                  disabled={
                    formik.values.escalateRequest?.escalate ? true : false
                  }
                  onChange={(event) => {
                    formik.setFieldValue("closeTicket", event.target.checked);
                  }}
                  value={formik.values?.closeTicket}
                />
              }
            />
          )}

          {isSequestRequest ? undefined : (
            <></>
            // <FormControlLabel
            //   label="Escalate Request"
            //   className="sm:col-span-2"
            //   control={
            //     <Checkbox
            //       checked={formik.values.escalateRequest?.escalate}
            //       disabled={formik.values?.closeTicket ? true : false}
            //       onChange={(event) => {
            //         formik.setFieldValue(
            //           "escalateRequest.escalate",
            //           event.target.checked
            //         );
            //       }}
            //     />
            //   }
            // />
          )}

          {isEscalate ? (
            <TextField
              label="Responsible Department (Unit):"
              select
              {...getTextFieldFormikProps(
                formik,
                "escalateRequest.unitResponsible"
              )}
              onChange={(e) => {
                formik.handleChange(e);
              }}
            >
              {escalatedUnitQueryResult.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.unitName}
                </MenuItem>
              ))}
            </TextField>
          ) : undefined}
          {isEscalate ? (
            <TextField
              label="Category:"
              select
              {...formik.getFieldProps("escalateRequest.category")}
              error={!!formik.touched.category && formik.errors.category}
              helperText={!!formik.touched.category && formik.errors.category}
            >
              {CategoryByEscalatedUnitQueryResult.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.categoryName}
                </MenuItem>
              ))}
            </TextField>
          ) : undefined}
          {isEscalate ? (
            <TextField
              label="Sub-Category:"
              select
              {...formik.getFieldProps("escalateRequest.subCategory")}
              error={!!formik.touched.subCategory && formik.errors.subCategory}
              helperText={
                !!formik.touched.subCategory && formik.errors.subCategory
              }
            >
              {escalatedSubcategoryQueryResult.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.subCategoryName}
                </MenuItem>
              ))}
            </TextField>
          ) : undefined}
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
