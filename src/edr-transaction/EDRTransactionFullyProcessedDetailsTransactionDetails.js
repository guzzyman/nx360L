import {} from "@mui/material";
import { RouteEnum } from "common/Constants";
import { generatePath, useParams } from "react-router-dom";
import EDRTransactionDetailsTransactionDetailsScaffold from "./EDRTransactionDetailsTransactionDetailsScaffold";

function EDRTransactionPartiallyProcessedDetailsTransactionDetails(props) {
  const { id } = useParams();

  return (
    <EDRTransactionDetailsTransactionDetailsScaffold
      title="Fully Processed Transaction Details"
      breadcrumbs={[
        {
          name: "Fully Processed",
          to: RouteEnum.EDR_FULLY_PROCESSED,
        },
        {
          name: "Details",
          to: generatePath(RouteEnum.EDR_FULLY_PROCESSED_DETAILS, {
            id,
          }),
        },
        {
          name: "Transaction",
        },
      ]}
    ></EDRTransactionDetailsTransactionDetailsScaffold>
  );
}

export default EDRTransactionPartiallyProcessedDetailsTransactionDetails;
