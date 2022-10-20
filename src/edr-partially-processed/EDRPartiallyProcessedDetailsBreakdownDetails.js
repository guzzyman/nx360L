import { Button, Icon } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { RouteEnum } from "common/Constants";
import EDRBreakdownDetails from "edr/EDRBreakdownDetails";
import { nxEDRPartiallyProcessedApi } from "./EDRPartiallyProcessedStoreQuerySlice";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import EDRPartiallyProcessedDetailsBreakdownEdit from "./EDRPartiallyProcessedDetailsBreakdownEdit";
import useToggle from "hooks/useToggle";
import EDRNoteList from "edr/EDRNoteList";
import useLoadingModal from "hooks/useLoadingModal";

function EDRPartiallyProcessedDetailsBreakdownDetails(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { toggleLoadingModal } = useLoadingModal();

  const { id, tid } = useParams();

  const [isEditModal, toggleEditModal] = useToggle();

  const [processEDRMutation, processEDRMutationResult] =
    nxEDRPartiallyProcessedApi.useProcessEDRMutation();

  async function handleProcessEDR(details) {
    toggleLoadingModal();
    try {
      const data = await processEDRMutation({
        transId: details.uniqueId,
        edrId: tid,
      }).unwrap();
      const isSuccess = data?.httpStatusCode < 300;
      enqueueSnackbar(data?.defaultUserMessage, {
        variant: isSuccess ? "success" : "error",
      });
      if (isSuccess) {
        navigate(
          generatePath(RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS, {
            id,
          })
        );
      }
    } catch (error) {
      enqueueSnackbar(
        error?.data?.errors?.[0]?.defaultUserMessage ||
          `Failed to Process EDR`,
        {
          variant: "error",
        }
      );
    }
    toggleLoadingModal(false);
  }

  return (
    <>
      <EDRBreakdownDetails
        title="Partially Processed Transaction Details"
        breadcrumbs={() => [
          {
            name: "Partially Processed",
            to: RouteEnum.EDR_PARTIALLY_PROCESSED,
          },
          {
            name: "Details",
            to: generatePath(RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS, { id }),
          },
          {
            name: "Transaction",
          },
        ]}
        actions={({ data }) =>
          data?.status !== "SUCCESS" ? (
            <>
              <EDRPartiallyProcessedDetailsBreakdownEdit
                open={isEditModal}
                transaction={data}
                onClose={toggleEditModal}
              />
              <Button startIcon={<Icon>edit</Icon>} onClick={toggleEditModal}>
                Edit
              </Button>
              <LoadingButton
                disabled={processEDRMutationResult.isLoading}
                loading={processEDRMutationResult.isLoading}
                loadingPosition="end"
                endIcon={<></>}
                onClick={() => handleProcessEDR(data)}
              >
                Process EDR
              </LoadingButton>
            </>
          ) : null
        }
      >
        {() => (
          <>
            <EDRNoteList
              queryArgs={{ edrId: tid }}
              useGetNotesQuery={nxEDRPartiallyProcessedApi.useGetEDRNotesQuery}
            />
          </>
        )}
      </EDRBreakdownDetails>
    </>
  );
}

export default EDRPartiallyProcessedDetailsBreakdownDetails;
