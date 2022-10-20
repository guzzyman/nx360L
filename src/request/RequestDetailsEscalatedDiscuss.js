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
import { sequestRequestApi } from "./RequestStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as yup from "yup";
import { } from "react-router-dom";
import useAuthUser from "hooks/useAuthUser";
import clsx from "clsx";
import LoadingContent from "common/LoadingContent";
import * as dfn from "date-fns";
import { blobToBase64 } from "common/Utils";
import { useDropzone } from "react-dropzone";

function RequestDetailsEscalatedDiscuss(props) {
  const { requestQueryResult } = props;
  const { enqueueSnackbar } = useSnackbar();
  const authUser = useAuthUser();

  const [addTicketReplyMutation, addTicketReplyMutationResult] =
    sequestRequestApi.useAddTicketReplyMutation();

  const _ticketId = requestQueryResult?.data?.data?.ticketDetails.ticketId;

  const _escalatedTicketId = requestQueryResult?.data?.data?.ticketDetails.escalatedTicketId;

  const _isLogger = requestQueryResult?.data?.data?.ticketDetails;

  const escalatedDiscourseData = [
    ...(requestQueryResult?.data?.data?.escalatedDiscourses || []),
  ];

  // const requestStatusByActor =
  //   sequestRequestApi.useGetRequestStatusByActorQuery(
  //     _isLogger.createdBy === authUser.fullname ? 1 : 2
  //   );

  const getRequestStatusByTicketId = sequestRequestApi.useGetRequestStatusByTicketIdQuery(_ticketId);


  const requestStatusOption = getRequestStatusByTicketId?.data?.data || [];

  const formik = useFormik({
    initialValues: {
      ticketId: _escalatedTicketId,
      messageBody: "",
      unitId: 0,
      attachment: "",
      fileName: "",
      fileSize: "",
      createdBy: `${authUser.fullname}`,
      createdById: `${authUser?.staffId}`,
      requestStatus: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      messageBody: yup.string().trim().required(),
      requestStatus: yup.string().trim().required(),
    }),
    onSubmit: async (values) => {
      try {
        await addTicketReplyMutation({ ...values }).unwrap();
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
          ) : "Error Responding to Chat!",
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

  return (
    <LoadingContent
      loading={requestQueryResult.isLoading}
      error={requestQueryResult.isError}
      onReload={requestQueryResult.refetch}
    >
      {() => (
        <div className="overflow-auto relative" style={{ maxHeight: 400 }}>
          <div className="flex flex-col gap-4 p-4" style={{ minHeight: 0 }}>
            {escalatedDiscourseData
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
                  previousDiscuss={escalatedDiscourseData[key - 1]}
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
              {...formik.getFieldProps("messageBody")}
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
              {...formik.getFieldProps("requestStatus")}
            >
              {
                _isLogger.createdBy === authUser.fullname ?
                  requestStatusOption?.loggerStatuses?.map((option) => (
                    <MenuItem key={option.status} value={option.status}>
                      {option.description}
                    </MenuItem>
                  )) : requestStatusOption?.resolverStatuses?.map((option) => (
                    <MenuItem key={option.status} value={option.status}>
                      {option.description}
                    </MenuItem>
                  ))
              }
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
          </form>
        </div>
      )}
    </LoadingContent>
  );
}

export default RequestDetailsEscalatedDiscuss;

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
