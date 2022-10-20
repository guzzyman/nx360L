import { useMemo } from "react";
import { Paper, Typography, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DateConfig, RouteEnum } from "common/Constants";
import { useDropzone } from "react-dropzone";
import { nxEDRInflowApi } from "./EDRInflowStoreQuerySlice";
import { useSnackbar } from "notistack";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import EDRInflowDetailsSingleRepaymentModal from "./EDRInflowDetailsSingleRepaymentModal";
import useToggle from "hooks/useToggle";
import EDRDetails from "edr/EDRDetails";
import EDRNoteList from "edr/EDRNoteList";
import useLoadingModal from "hooks/useLoadingModal";
import EDRInflowFundEmployer from "./EDRInflowFundEmployer";

function EDRInflowDetails(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { toggleLoadingModal } = useLoadingModal();

  const { id } = useParams();

  const [isSingleRepaymentDialog, toggleSingleRepaymentDialog] = useToggle();

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

  const errorTableInstance = useTable({
    columns: errorColumns,
    data: uploadErrorData,
  });

  const dropzone = useDropzone({
    accept: ".xls",
    onDropAccepted: async (files) => {
      toggleLoadingModal();
      try {
        const data = await uploadEDRsMutation({
          file: files[0],
          transid: id,
          locale: DateConfig.LOCALE,
          dateFormat: DateConfig.FORMAT,
        }).unwrap();
        if (data?.completed && !data?.errorLog) {
          navigate(RouteEnum.EDR);
          enqueueSnackbar(`EDRs Upload Successful`, { variant: "success" });
        } else {
          enqueueSnackbar(`Error Uploading EDRs`, { variant: "error" });
        }
      } catch (error) {
        enqueueSnackbar(`Failed to Upload EDRs`, { variant: "error" });
      }
      toggleLoadingModal(false);
    },
  });

  return (
    <>
      <EDRDetails
        title="EDR Transactions Details"
        breadcrumbs={() => [
          {
            name: "EDR Transactions",
            to: RouteEnum.EDR,
          },
          {
            name: "Details",
          },
        ]}
        queryArgs={queryArgs}
        actions={({ data }) => (
          <>
            {data?.isManualEntry && (
              <Button
                onClick={() =>
                  navigate(generatePath(RouteEnum.EDR_EDIT, { id }))
                }
              >
                Edit
              </Button>
            )}
            <Button onClick={toggleSingleRepaymentDialog}>
              Single Repayment
            </Button>
            <EDRInflowDetailsSingleRepaymentModal
              id={id}
              open={isSingleRepaymentDialog}
              onClose={() => toggleSingleRepaymentDialog()}
            />
            <EDRInflowFundEmployer
              transactions={[data]}
              onSuccess={() => {
                navigate(RouteEnum.EDR);
              }}
            />
            {/* <div {...dropzone.getRootProps()}>
              <input {...dropzone.getInputProps()} />
              <LoadingButton
                disabled={uploadEDRsMutationResult.isLoading}
                loading={uploadEDRsMutationResult.isLoading}
                loadingPosition="end"
                endIcon={<></>}
              >
                Upload EDR
              </LoadingButton>
            </div> */}
          </>
        )}
      >
        {() => (
          <>
            {uploadErrorData ? (
              <Paper className="p-4 mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <Typography className="font-bold text-error-main">
                    Uploaded EDR Errors
                  </Typography>
                </div>
                <DynamicTable instance={errorTableInstance} />
              </Paper>
            ) : null}
            <EDRNoteList
              queryArgs={{ fcmbId: id }}
              useGetNotesQuery={nxEDRInflowApi.useGetInflowNotesQuery}
            />
          </>
        )}
      </EDRDetails>
    </>
  );
}

export default EDRInflowDetails;

const queryArgs = {};

const errorColumns = [{ Header: "Message", accessor: "message" }];
