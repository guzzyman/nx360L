import {} from "@mui/material";
import { RouteEnum } from "common/Constants";
import { useNavigate, generatePath, useParams } from "react-router-dom";
import EDRDetails from "edr/EDRDetails";
import EDRBreakdownList from "edr/EDRBreakdownList";
import EDRGroupBreakdownList from "edr/EDRGroupBreakdownList";
import EDRNoteList from "edr/EDRNoteList";
import { nxEDRFullyProcessedApi } from "./EDRFullyProcessedStoreQuerySlice";
import { EDRStatusEnum } from "edr/EDRConstants";

function EDRTransactionFullyProcessedDetails(props) {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <EDRDetails
      title="Fully Processed Details"
      breadcrumbs={() => [
        {
          name: "Fully Processed",
          to: RouteEnum.EDR_FULLY_PROCESSED,
        },
        {
          name: "Details",
        },
      ]}
    >
      {({ data }) => (
        <>
          <EDRGroupBreakdownList
            queryArgs={{
              ...queryArgs,
              uniqueId: data?.uniqueId,
            }}
          />
          <EDRBreakdownList
            queryArgs={{ transId: data?.uniqueId }}
            onRowClick={(_, row) => {
              navigate(
                generatePath(
                  RouteEnum.EDR_FULLY_PROCESSED_DETAILS_BREAKDOWN_DETAILS,
                  {
                    id: id,
                    tid: row.original.id,
                  }
                )
              );
            }}
          />
          <EDRNoteList
            queryArgs={{ fcmbId: id }}
            useGetNotesQuery={nxEDRFullyProcessedApi.useGetInflowNotesQuery}
          />
        </>
      )}
    </EDRDetails>
  );
}

const queryArgs = { status: EDRStatusEnum.SUCCESS };

export default EDRTransactionFullyProcessedDetails;
