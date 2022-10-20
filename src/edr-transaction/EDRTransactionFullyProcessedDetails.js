import {} from "@mui/material";
import { RouteEnum } from "common/Constants";
import CurrencyTypography from "common/CurrencyTypography";
import { useNavigate, generatePath, useParams } from "react-router-dom";
import EDRTransactionDetailsScaffold from "./EDRTransactionDetailsScaffold";
import EDRTransactionDetailsTransactionListScaffold from "./EDRTransactionDetailsTransactionListScaffold";
import EDRTransactionUploadBreakdownList from "./EDRTransactionUploadBreakdownList";

function EDRTransactionFullyProcessedDetails(props) {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <EDRTransactionDetailsScaffold
      title="Fully Processed Details"
      breadcrumbs={[
        {
          name: "Fully Processed",
          to: RouteEnum.EDR_FULLY_PROCESSED,
        },
        {
          name: "Details",
        },
      ]}
      status={(data) => data?.status}
      summary={(data) => [
        {
          label: "Transaction ID",
          value: data?.transactionId,
        },
        {
          label: "Amount Remitted",
          value: <CurrencyTypography>{data?.amount}</CurrencyTypography>,
        },
        { label: "FCMB Reference No", value: data?.referenceNumber },
        {
          label: "Transaction Date",
          value: data?.transactionDate?.join("-"),
        },
      ]}
    >
      {(data) => (
        <>
          <EDRTransactionUploadBreakdownList
            queryArgs={{
              ...queryArgs,
              uniqueId: data?.uniqueId,
            }}
          />
          <EDRTransactionDetailsTransactionListScaffold
            queryArgs={{ ...queryArgs, transId: data?.uniqueId }}
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
        </>
      )}
    </EDRTransactionDetailsScaffold>
  );
}

const queryArgs = { status: "SUCCESS" };

export default EDRTransactionFullyProcessedDetails;
