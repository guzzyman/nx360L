import {} from "@mui/material";
import EDRList from "edr/EDRList";
import { RouteEnum } from "common/Constants";
import { EDRStatusEnum } from "edr/EDRConstants";

function EDRUnProcessed(props) {
  return (
    <EDRList
      title="Unprocessed"
      breadcrumbs={() => [{ name: "Unprocessed" }]}
      queryArgs={queryArgs}
      detailsRoutePath={RouteEnum.EDR_UNPROCESSED_DETAILS}
    />
  );
}

export default EDRUnProcessed;

const queryArgs = {
  statusId: EDRStatusEnum.PENDING,
  creditDirectPayEnum: 6,
  withUniqueId: true,
};
