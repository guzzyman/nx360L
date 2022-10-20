import "@mui/material";
import { RouteEnum } from "common/Constants";
import { EDRStatusEnum } from "edr/EDRConstants";
import EDRList from "edr/EDRList";

function EDRPartiallyProcessed(props) {
  return (
    <EDRList
      title="Partially Processed"
      breadcrumbs={() => [{ name: "Partially Processed" }]}
      queryArgs={queryArgs}
      detailsRoutePath={RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS}
    />
  );
}

export default EDRPartiallyProcessed;

const queryArgs = {
  statusId: EDRStatusEnum.PROCCESSING,
  creditDirectPayEnum: 6,
  withUniqueId: true,
};
