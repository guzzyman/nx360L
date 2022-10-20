import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { RouteEnum } from "common/Constants";
import EDRDetails from "edr/EDRDetails";
import { nxEDRUnProcessedApi } from "./EDRUnProcessedStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import EDRGroupBreakdownList from "edr/EDRGroupBreakdownList";
import EDRBreakdownList from "edr/EDRBreakdownList";
import useAsyncUI from "hooks/useAsyncUI";
// import EDRNoteList from "edr/EDRNoteList";
import { EDRStatusEnum } from "edr/EDRConstants";
import useLoadingModal from "hooks/useLoadingModal";

function EDRUnProcessedDetails(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { toggleLoadingModal } = useLoadingModal();

  // const { id } = useParams();

  const confirmAsyncUI = useAsyncUI();

  const [processEDRsMutation, processEDRsMutationResult] =
    nxEDRUnProcessedApi.useProcessEDRsMutation();
  const [rejectEDRsMutation, rejectEDRsMutationResult] =
    nxEDRUnProcessedApi.useRejectEDRsMutation();

  async function handleProcessEDRs(details) {
    if (
      !(await confirmAsyncUI.open({
        context: { title: "Confirm Process" },
      }))
    ) {
      return;
    }
    toggleLoadingModal();
    try {
      const data = await processEDRsMutation({
        transId: details?.uniqueId,
      }).unwrap();
      const isSuccess = data?.httpStatusCode < 300;
      enqueueSnackbar(data?.defaultUserMessage, {
        variant: isSuccess ? "success" : "error",
      });
      navigate(RouteEnum.EDR_UNPROCESSED);
    } catch (error) {
      enqueueSnackbar(`Failed to Process EDRs`, { variant: "error" });
    }
    toggleLoadingModal(false);
  }

  async function handleRejectEDR(details) {
    if (
      !(await confirmAsyncUI.open({
        context: { title: "Confirm Reject" },
      }))
    ) {
      return;
    }
    toggleLoadingModal();
    try {
      const data = await rejectEDRsMutation({
        uniqueId: details?.uniqueId,
      }).unwrap();
      enqueueSnackbar(data?.defaultUserMessage || "EDR Rejected Successful", {
        variant: "success",
      });
      navigate(RouteEnum.EDR_UNPROCESSED);
    } catch (error) {
      enqueueSnackbar(`Failed to Reject EDRs`, { variant: "error" });
    }
    toggleLoadingModal(false);
  }

  return (
    <>
      <EDRDetails
        title="Unprocessed Details"
        queryArgs={queryArgs}
        breadcrumbs={() => [
          {
            name: "Unprocessed",
            to: RouteEnum.EDR_UNPROCESSED,
          },
          {
            name: "Details",
          },
        ]}
        status={({ data }) => data?.statusData?.code}
        summary={() => []}
        actions={({ data }) => (
          <>
            {!data?.isRunning && (
              <>
                <LoadingButton
                  disabled={processEDRsMutationResult.isLoading}
                  loading={processEDRsMutationResult.isLoading}
                  loadingPosition="end"
                  endIcon={<></>}
                  onClick={() => handleProcessEDRs(data)}
                >
                  Process EDR
                </LoadingButton>
                <LoadingButton
                  color="error"
                  disabled={rejectEDRsMutationResult.isLoading}
                  loading={rejectEDRsMutationResult.isLoading}
                  loadingPosition="end"
                  endIcon={<></>}
                  onClick={() => handleRejectEDR(data)}
                >
                  Reject EDR
                </LoadingButton>
                {confirmAsyncUI.render(({ context }) => (
                  <Dialog open fullWidth maxWidth="xs">
                    <DialogTitle className="font-bold">
                      {context?.title}
                    </DialogTitle>
                    <DialogActions>
                      <Button
                        variant="outlined"
                        onClick={() => confirmAsyncUI.resolve(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => confirmAsyncUI.resolve(true)}>
                        Accept
                      </Button>
                    </DialogActions>
                  </Dialog>
                ))}
              </>
            )}
          </>
        )}
      >
        {({ data }) => (
          <>
            <EDRGroupBreakdownList
              queryArgs={{
                ...queryArgs,
                uniqueId: data?.uniqueId,
                creditDirectPayEnum: 6,
              }}
            />
            <EDRBreakdownList
              queryArgs={{ ...queryArgs, transId: data?.uniqueId }}
            />
            {/* <EDRNoteList
              queryArgs={{ fcmbId: id }}
              useGetNotesQuery={nxEDRUnProcessedApi.useGetInflowNotesQuery}
            /> */}
          </>
        )}
      </EDRDetails>
    </>
  );
}

export default EDRUnProcessedDetails;

const queryArgs = { statusId: EDRStatusEnum.PENDING };
