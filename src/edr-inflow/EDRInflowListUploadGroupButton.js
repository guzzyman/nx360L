import { useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DateConfig } from "common/Constants";
import { nxEDRInflowApi } from "./EDRInflowStoreQuerySlice";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";
import EDRErrorTable from "edr/EDRErrorTable";
import useToggle from "hooks/useToggle";

function EDRInflowListUploadGroupButton({ tableInstance }) {
  const { enqueueSnackbar } = useSnackbar();

  const [isUploadErrorDialog, toggleUploadErrorDialog, setUploadErrorDialog] =
    useToggle();

  const [uploadEDRsMutation, uploadEDRsMutationResult] =
    nxEDRInflowApi.useUploadEDRsMutation();

  const uploadResult = uploadEDRsMutationResult.data;
  const isUploadComplete = !!uploadResult?.completed;
  const uploadErrorData = useMemo(
    () =>
      isUploadComplete && uploadResult?.errorLog
        ? JSON.parse(uploadResult?.errorLog)
        : undefined,
    [isUploadComplete, uploadResult?.errorLog]
  );

  useEffect(() => {
    setUploadErrorDialog(!!uploadErrorData);
  }, [setUploadErrorDialog, uploadErrorData]);

  const dropzone = useDropzone({
    accept: ".xls",
    onDropAccepted: async (files) => {
      try {
        const data = await uploadEDRsMutation({
          file: files[0],
          transid: tableInstance?.selectedFlatRows?.map(
            (row) => row.original.id
          ),
          locale: DateConfig.LOCALE,
          dateFormat: DateConfig.FORMAT,
        }).unwrap();
        if (data?.errorLog) {
          throw new Error("Failed to upload EDR");
        }
        enqueueSnackbar(data?.defaultUserMessage || `EDRs Upload Successful`, {
          variant: "success",
        });
      } catch (error) {
        if (error.data) {
          error.data?.errors?.forEach((err) =>
            enqueueSnackbar(err.defaultUserMessage, { variant: "error" })
          );
        } else {
          enqueueSnackbar(`Failed to Upload EDRs`, { variant: "error" });
        }
      }
    },
  });

  if (!tableInstance?.selectedFlatRows?.length) {
    return null;
  }

  return (
    <>
      <div {...dropzone.getRootProps()}>
        <input {...dropzone.getInputProps()} />
        <LoadingButton
          disabled={uploadEDRsMutationResult.isLoading}
          loading={uploadEDRsMutationResult.isLoading}
          loadingPosition="end"
          endIcon={<></>}
        >
          Upload EDR
        </LoadingButton>
      </div>
      <Dialog open={!!isUploadErrorDialog} fullWidth>
        <DialogTitle>EDR Upload Errors</DialogTitle>
        <DialogContent>
          <EDRErrorTable data={uploadErrorData} />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={toggleUploadErrorDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EDRInflowListUploadGroupButton;
