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
import { sequestRecoveryApi } from "./RecoveryStoreQuerySlice";
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

function RecoveryDetailsDiscuss(props) {
  const { recoveryExceptionQueryResult } = props;
  const { enqueueSnackbar } = useSnackbar();
  const authUser = useAuthUser();

  const [addRecoveryReplyMutation, addRecoveryReplyMutationResult] =
    sequestRecoveryApi.useAddExceptionReplyMutation();

  const _recoveryId = recoveryExceptionQueryResult?.data?.data?.exceptionDetails?.exceptionId;

  // const _isLogger = recoveryExceptionQueryResult?.data?.data?.exceptionDetails;

  const discourseData = [
    ...(recoveryExceptionQueryResult?.data?.data?.discourseList || []),
  ];

  // const recoverytStatusByActor =
  //   sequestRecoveryApi.useGetRequestStatusByActorQuery(
  //     _isLogger?.createdBy === authUser.fullname ? 1 : 2
  //   );

  const recoverytStatusByActor = sequestRecoveryApi.useGetStatusGenericQuery(_recoveryId, {
    skip: !_recoveryId
  });

  // console.log(recoverytStatusByActor);

  const exceptionStatusOption = recoverytStatusByActor?.data?.data || [];

  const collectionOfficerValue = authUser?.staff?.collectionOfficerValue?.id;

  const filteredStatusOptions = collectionOfficerValue === 2668 ? exceptionStatusOption?.filter((item) => item.sequestActorId === 1) : exceptionStatusOption?.filter((item) => item.sequestActorId === 2);

  const formik = useFormik({
    initialValues: {
      exceptionId: _recoveryId,
      responseBody: "",
      creatorName: `${authUser?.fullname}`,
      creatorStaffId: `${authUser?.staff?.id}`,
      creatorEmail: `${authUser?.email}`,
      creatorUnit: `${authUser?.staff?.organizationUnit?.id}`,
      exceptiontStatus: "",
      supportingDocument: "",
      fileName: "",
      fileSize: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      responseBody: yup.string().trim().required(),
      exceptiontStatus: yup.string().trim().required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        await addRecoveryReplyMutation({ ...values }).unwrap();
        enqueueSnackbar(`Chat Sent Successful!`, {
          variant: "success",
        });
        helper.resetForm();
      } catch (error) {
        // enqueueSnackbar(`Error Responding to Chat!`, {
        //   variant: "error",
        // });
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
      loading={recoveryExceptionQueryResult.isLoading}
      error={recoveryExceptionQueryResult.isError}
      onReload={recoveryExceptionQueryResult.refetch}
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
              {filteredStatusOptions?.map((option) => (
                <MenuItem key={option?.id} value={option?.id}>
                  {
                    option?.statusDescription
                  }
                </MenuItem>
              ))}
            </TextField>
            <Fab
              disabled={addRecoveryReplyMutationResult.isLoading}
              size="small"
              color="primary"
              type="submit"
            >
              {addRecoveryReplyMutationResult.isLoading ? (
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

export default RecoveryDetailsDiscuss;

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
