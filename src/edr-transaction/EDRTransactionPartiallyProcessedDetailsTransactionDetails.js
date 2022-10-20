import { Button, Icon } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { RouteEnum } from "common/Constants";
import EDRTransactionDetailsTransactionDetailsScaffold from "./EDRTransactionDetailsTransactionDetailsScaffold";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import EDRTransactionPartiallyProcessedDetailsTransactionDetailsEdit from "./EDRTransactionPartiallyProcessedDetailsTransactionDetailsEdit";
import useToggle from "hooks/useToggle";

function EDRTransactionPartiallyProcessedDetailsTransactionDetails(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { id, tid } = useParams();

  const [isEditModal, toggleEditModal] = useToggle();

  const [processEDRTransactionMutation, processEDRTransactionMutationResult] =
    nxEDRTransactionApi.useProcessEDRTransactionMutation();

  async function handleProcessEDRTransaction(details) {
    try {
      const data = await processEDRTransactionMutation({
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
          `Failed to Process EDRs`,
        {
          variant: "error",
        }
      );
    }
  }

  return (
    <>
      <EDRTransactionDetailsTransactionDetailsScaffold
        title="Partially Processed Transaction Details"
        breadcrumbs={[
          {
            name: "Partially Processed",
            to: RouteEnum.EDR_PARTIALLY_PROCESSED,
          },
          {
            name: "Details",
            to: generatePath(
              RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS,
              { id }
            ),
          },
          {
            name: "Transaction",
          },
        ]}
        actions={(data) =>
          data?.status !== "SUCCESS" ? (
            <>
              <EDRTransactionPartiallyProcessedDetailsTransactionDetailsEdit
                open={isEditModal}
                transaction={data}
                onClose={toggleEditModal}
              />
              <Button startIcon={<Icon>edit</Icon>} onClick={toggleEditModal}>
                Edit
              </Button>
              <LoadingButton
                disabled={processEDRTransactionMutationResult.isLoading}
                loading={processEDRTransactionMutationResult.isLoading}
                loadingPosition="end"
                endIcon={<></>}
                onClick={() => handleProcessEDRTransaction(data)}
              >
                Process EDR
              </LoadingButton>
            </>
          ) : null
        }
      ></EDRTransactionDetailsTransactionDetailsScaffold>
    </>
  );
}

export default EDRTransactionPartiallyProcessedDetailsTransactionDetails;
