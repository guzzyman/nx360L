import "@mui/material";
import { RouteEnum } from "common/Constants";
import { EDRStatusEnum } from "edr/EDRConstants";
import EDRList from "edr/EDRList";

function EDRFullyProcessed(props) {
  return (
    <EDRList
      title="Fully Processed"
      breadcrumbs={() => [{ name: "Fully Processed" }]}
      queryArgs={queryArgs}
      detailsRoutePath={RouteEnum.EDR_FULLY_PROCESSED_DETAILS}
    />
  );
}

export default EDRFullyProcessed;

const queryArgs = {
  statusId: EDRStatusEnum.SUCCESS,
  creditDirectPayEnum: 6,
  withUniqueId: true,
};
