import {
  Typography,
  IconButton,
  Icon,
  TextField,
  MenuItem,
  Fab,
  CircularProgress,
  InputBase,
} from "@mui/material";
import { sequestExceptionApi } from "./ExceptionStoreQuerySlice";
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

function ExceptionDetailsDiscuss(props) {
  const { exceptionQueryResult } = props;
  const { enqueueSnackbar } = useSnackbar();
  const authUser = useAuthUser();

  const [addExceptionReplyMutation, addExceptionReplyMutationResult] =
    sequestExceptionApi.useAddExceptionReplyMutation();

  const _exceptionId =
    exceptionQueryResult?.data?.data?.exceptionDetails?.exceptionId;

  const _isLogger = exceptionQueryResult?.data?.data?.exceptionDetails;

  const discourseData = [
    ...(exceptionQueryResult?.data?.data?.discourseList || []),
  ];
  const getRequestStatusByTicketId =
    sequestExceptionApi.useGetRequestStatusByTicketIdQuery(_exceptionId);

  const requestStatusOption = getRequestStatusByTicketId?.data?.data || [];

  const formik = useFormik({
    initialValues: {
      exceptionId: _exceptionId,
      responseBody: "",
      creatorUnit: `${authUser?.staff?.organizationUnit?.id}`,
      supportingDocument: "",
      fileName: "",
      fileSize: "",
      creatorName: `${authUser?.fullname}`,
      creatorStaffId: `${authUser?.staff?.id}`,
      exceptiontStatus: "",
      creatorEmail: `${authUser?.email}`,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      responseBody: yup.string().trim().required(),
      exceptiontStatus: yup.string().trim().required(),
    }),
    onSubmit: async (values) => {
      try {
        await addExceptionReplyMutation({ ...values }).unwrap();
        enqueueSnackbar(`Chat Sent Successful!`, {
          variant: "success",
        });
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
        formik.setFieldValue("supportingDocument", await blobToBase64(file));
        formik.setFieldValue("fileName", file.name);
        formik.setFieldValue("fileSize", file.size.toString());
      } catch (error) {
        enqueueSnackbar(`Failed to attach files`, { variant: "error" });
      }
    },
  });

  return (
    <LoadingContent
      loading={exceptionQueryResult.isLoading}
      error={exceptionQueryResult.isError}
      onReload={exceptionQueryResult.refetch}
    >
      {() => (
        <div className="overflow-auto relative" style={{ maxHeight: 400 }}>
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
            className="sticky left-0 right-0 bottom-0 flex gap-2 items-center p-2 border rounded-xl"
          >
            <InputBase
              className="flex-1 self-stretch"
              placeholder="Enter Messages"
              {...formik.getFieldProps("responseBody")}
            />
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
              {...formik.getFieldProps("exceptiontStatus")}
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
              disabled={addExceptionReplyMutationResult.isLoading}
              size="small"
              color="primary"
              type="submit"
            >
              {addExceptionReplyMutationResult.isLoading ? (
                <CircularProgress />
              ) : (
                <Icon>send</Icon>
              )}
            </Fab>
          </form>
        </div>
      )}
    </LoadingContent>
  );
}

export default ExceptionDetailsDiscuss;

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
        <Typography className="whitespace-pre-wrap break-words">
          {discuss?.message}
        </Typography>
        <Typography variant="caption" className="text-right block">
          {discuss?.createdBy}{" "}
          {dfn.format(
            new Date(discuss.dateTimeCreated),
            "dd MMM yyyy, h:mm aaa"
          )}
        </Typography>
      </div>
    </div>
  );
}
