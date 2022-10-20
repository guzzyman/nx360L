import { useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EDRTransactionScaffold from "./EDRTransactionScaffold";
import { DateConfig, RouteEnum } from "common/Constants";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";
import useTableRef from "hooks/useTableRef";
import EDRTransactionUploadErrorTable from "./EDRTransactionUploadErrorTable";
import useToggle from "hooks/useToggle";

function EDRTransactionFreshList(props) {
  const { enqueueSnackbar } = useSnackbar();

  const [isUploadErrorDialog, toggleUploadErrorDialog, setUploadErrorDialog] =
    useToggle();

  const [uploadEDRTransactionsMutation, uploadEDRTransactionsMutationResult] =
    nxEDRTransactionApi.useUploadEDRTransactionsMutation();

  const uploadResult = uploadEDRTransactionsMutationResult.data;
  const isUploadComplete = !!uploadResult?.completed;
  const uploadErrorData = useMemo(
    () =>
      isUploadComplete && uploadResult?.errorLog
        ? JSON.parse(uploadResult?.errorLog)
        : undefined,
    [isUploadComplete, uploadResult?.errorLog]
  );

  const tableRef = useTableRef();

  const dropzone = useDropzone({
    accept: ".xls",
    onDropAccepted: async (files) => {
      try {
        const data = await uploadEDRTransactionsMutation({
          file: files[0],
          transid: tableRef.current?.selectedFlatRows?.map(
            (row) => row.original.id
          ),
          locale: DateConfig.LOCALE,
          dateFormat: DateConfig.FORMAT,
        }).unwrap();
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

  useEffect(() => {
    setUploadErrorDialog(!!uploadErrorData);
  }, [setUploadErrorDialog, uploadErrorData]);

  return (
    <>
      <EDRTransactionScaffold
        title="EDR Transactions"
        breadcrumbs={[{ name: "EDR Transactions" }]}
        queryArgs={queryArgs}
        detailsRoutePath={RouteEnum.EDR_DETAILS}
        displayRowCheckbox
        tableRef={tableRef}
        actions={({ tableInstance }) => (
          <>
            {!!tableInstance?.selectedFlatRows?.length && (
              <div {...dropzone.getRootProps()}>
                <input {...dropzone.getInputProps()} />
                <LoadingButton
                  disabled={uploadEDRTransactionsMutationResult.isLoading}
                  loading={uploadEDRTransactionsMutationResult.isLoading}
                  loadingPosition="end"
                  endIcon={<></>}
                >
                  Upload EDR
                </LoadingButton>
              </div>
            )}
          </>
        )}
      />
      <Dialog open={!!isUploadErrorDialog} fullWidth>
        <DialogTitle>EDR Upload Errors</DialogTitle>
        <DialogContent>
          <EDRTransactionUploadErrorTable data={uploadErrorData} />
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

export default EDRTransactionFreshList;

const queryArgs = { status: "PENDING", withUniqueId: false };
