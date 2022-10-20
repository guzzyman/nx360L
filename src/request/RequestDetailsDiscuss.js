import { useCallback, useRef, useState } from "react";
import {
  Typography,
  IconButton,
  Icon,
  TextField,
  MenuItem,
  Fab,
  CircularProgress,
  InputBase,
  Button,
  Menu,
  ListItemText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { sequestRequestApi } from "./RequestStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as yup from "yup";
import {} from "react-router-dom";
import useAuthUser from "hooks/useAuthUser";
import clsx from "clsx";
import LoadingContent from "common/LoadingContent";
import * as dfn from "date-fns";
import { blobToBase64 } from "common/Utils";
import { useDropzone } from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CKEditorDecoupled from "@ckeditor/ckeditor5-build-decoupled-document";
import useToggle from "hooks/useToggle";
import useDataRef from "hooks/useDataRef";
import usePopover from "hooks/usePopover";
import "./RequestDetailsDiscuss.css";
import { EMAIL_RESPONSE_TEMPLATE } from "./RequestConstants";

function RequestDetailsDiscuss(props) {
  const { requestQueryResult, ticketDetails } = props;
  const { enqueueSnackbar } = useSnackbar();
  const authUser = useAuthUser();
  const templatePopover = usePopover();
  const toolbarRef = useRef();
  const [isToolbar, toggleToolbar] = useToggle();

  const [addTicketReplyMutation, addTicketReplyMutationResult] =
    sequestRequestApi.useAddTicketReplyMutation();

  const _ticketId = requestQueryResult?.data?.data?.ticketDetails?.ticketId;

  const _isLogger = requestQueryResult?.data?.data?.ticketDetails;

  const discourseData = [
    ...(requestQueryResult?.data?.data?.discourseList || []),
  ];

  const getRequestStatusByTicketId =
    sequestRequestApi.useGetRequestStatusByTicketIdQuery(_ticketId);

  const requestStatusOption = getRequestStatusByTicketId?.data?.data || [];

  const isCustomerTicket = ticketDetails?.customerType === "Customer";

  const formik = useFormik({
    initialValues: {
      ticketId: _ticketId,
      messageBody: "",
      unitId: 0,
      attachment: "",
      fileName: "",
      fileSize: "",
      createdBy: `${authUser.fullname}`,
      createdById: `${authUser?.staffId}`,
      requestStatus: "",
      notifyCustomer:false,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      messageBody: yup.string().trim().required(),
      requestStatus: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        await addTicketReplyMutation({ ...values }).unwrap();
        enqueueSnackbar(`Chat Sent Successful!`, {
          variant: "success",
        });
        helper.resetForm();
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.length ? (
            <div>
              {error?.data?.errors?.map((error, key) => (
                <Typography key={key}>{error?.defaultUserMessage}</Typography>
              ))}
            </div>
          ) : (
            "Error Responding to Chat!"
          ),
          { variant: "error" }
        );
      }
    },
  });

  const dropzone = useDropzone({
    onDropAccepted: async (files) => {
      try {
        let file = files[0];
        formik.setFieldValue("attachment", await blobToBase64(file));
        formik.setFieldValue("fileName", file.name);
        formik.setFieldValue("fileSize", file.size.toString());
      } catch (error) {
        enqueueSnackbar(`Failed to attach files`, { variant: "error" });
      }
    },
  });

  const dataRef = useDataRef({ formik });

  const onEditorReady = useCallback((editor) => {
    toolbarRef.current.appendChild(editor.ui.view.toolbar.element);
  }, []);

  const onChangeBody = useCallback(
    (event, editor) => {
      dataRef.current.formik.setFieldValue("messageBody", editor.getData());
    },
    [dataRef]
  );

  return (
    <LoadingContent
      loading={requestQueryResult.isLoading}
      error={requestQueryResult.isError}
      onReload={requestQueryResult.refetch}
    >
      {() => (
        <>
          <div
            className="RequestDetailsDiscuss overflow-auto relative"
            style={{ maxHeight: 400 }}
          >
            <div className="flex flex-col gap-4 p-4" style={{ minHeight: 0 }}>
              {discourseData
                ?.sort((a, b) =>
                  dfn.compareAsc(
                    new Date(a.dateTimeCreated),
                    new Date(b.dateTimeCreated)
                  )
                )
                ?.map((discuss, key) => (
                  <DiscussItem
                    key={key}
                    discuss={discuss}
                    previousDiscuss={discourseData[key - 1]}
                    authenticatedUser={authUser.fullname}
                  />
                ))}
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="sticky left-0 right-0 bottom-0 p-2 border rounded-xl bg-white"
            >
              <div className="mb-2 border-b">
                {isCustomerTicket ? (
                  <div>
                    <CKEditor
                      data={formik.values.messageBody}
                      editor={CKEditorDecoupled}
                      onReady={onEditorReady}
                      onChange={onChangeBody}
                    />
                  </div>
                ) : (
                  <InputBase
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={8}
                    className="flex-1 self-stretch p-2"
                    placeholder="Enter Messages"
                    {...formik.getFieldProps("messageBody")}
                  />
                )}
              </div>
              <div className="relative mb-2">
                <div
                  ref={toolbarRef}
                  // className="absolute left-0 bottom-full w-full shadow-sm"
                  hidden={!isToolbar}
                />
              </div>
              <div className="flex gap-2 items-center">
                {isCustomerTicket && (
                  <>
                    <Button
                      // color="secondary"
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
                              "messageBody",
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
                  </>
                )}
                <div className="flex-1" />
                {isCustomerTicket ? (
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

                <IconButton onClick={toggleToolbar}>
                  <Icon>menu</Icon>
                </IconButton>
                <IconButton size="small">
                  <Icon>sentiment_satisfied</Icon>
                </IconButton>
                <div {...dropzone.getRootProps()}>
                  <input {...dropzone.getInputProps()} />
                  <IconButton size="small">
                    <Icon>attach_file</Icon>
                  </IconButton>
                </div>

                <TextField
                  className="w-36"
                  size="small"
                  select
                  {...formik.getFieldProps("requestStatus")}
                >
                  {_isLogger.createdBy === authUser.fullname
                    ? requestStatusOption?.loggerStatuses?.map((option) => (
                        <MenuItem key={option.status} value={option.status}>
                          {option.description}
                        </MenuItem>
                      ))
                    : requestStatusOption?.resolverStatuses?.map((option) => (
                        <MenuItem key={option.status} value={option.status}>
                          {option.description}
                        </MenuItem>
                      ))}
                </TextField>
                <Fab
                  disabled={addTicketReplyMutationResult.isLoading}
                  size="small"
                  color="primary"
                  type="submit"
                >
                  {addTicketReplyMutationResult.isLoading ? (
                    <CircularProgress />
                  ) : (
                    <Icon>send</Icon>
                  )}
                </Fab>
              </div>
            </form>
          </div>
        </>
      )}
    </LoadingContent>
  );
}

export default RequestDetailsDiscuss;

function DiscussItem({ discuss, previousDiscuss, authenticatedUser }) {
  const isResolver = discuss.messageBy === "resolver";

  return (
    <div className={clsx("flex", isResolver ? "justify-end" : "")}>
      <div
        className={clsx(
          " p-3 rounded-xl relative",
          isResolver ? "bg-gray-100" : "bg-green-50",
          discuss?.messageBy !== previousDiscuss?.messageBy
            ? isResolver
              ? "rounded-tr-none"
              : "rounded-tl-none"
            : ""
        )}
        style={{ minWidth: 100, maxWidth: "85%" }}
      >
        {discuss?.message?.match(/<(“[^”]*”|'[^’]*’|[^'”>])*>/g) ? (
          <Typography
            component="div"
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{
              __html: discuss?.message || "",
            }}
          />
        ) : (
          <Typography className="whitespace-pre-wrap break-words">
            {discuss?.message}
          </Typography>
        )}
        <Typography variant="caption" className="text-right block">
          {discuss?.createdBy}
          {dfn.format(
            new Date(discuss.dateTimeCreated),
            "dd MMM yyyy, h:mm aaa"
          )}
        </Typography>
      </div>
    </div>
  );
}
