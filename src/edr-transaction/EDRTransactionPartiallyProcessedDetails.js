import { MenuItem, TextField } from "@mui/material";
import { RouteEnum } from "common/Constants";
import { useState } from "react";
import { useNavigate, generatePath, useParams } from "react-router-dom";
import EDRTransactionDetailsScaffold from "./EDRTransactionDetailsScaffold";
import EDRTransactionDetailsTransactionListScaffold from "./EDRTransactionDetailsTransactionListScaffold";
import EDRTransactionUploadBreakdownList from "./EDRTransactionUploadBreakdownList";

function EDRTransactionPartiallyProcessedDetails(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState("ALL");

  return (
    <EDRTransactionDetailsScaffold
      title="Partially Processed Details"
      breadcrumbs={[
        {
          name: "Partially Processed",
          to: RouteEnum.EDR_PARTIALLY_PROCESSED,
        },
        {
          name: "Details",
        },
      ]}
      actions={() => (
        <>
          <TextField
            size="small"
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["ALL", "FAILED", "SUCCESS", "PROCCESSING"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}
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
            queryArgs={{
              ...queryArgs,
              status: status !== "ALL" ? status : undefined,
              transId: data?.uniqueId,
            }}
            onRowClick={(_, row) => {
              navigate(
                generatePath(
                  row?.original.isSingle
                    ? `${RouteEnum.CRM_CLIENTS_LOAN_DETAILS}?defaultTab=2`
                    : RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS_BREAKDOWN_DETAILS,
                  row?.original.isSingle
                    ? {
                        id: row.original.clientId,
                        loanId: row.original.transaction,
                      }
                    : {
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

const queryArgs = { status: "PROCCESSING" };

export default EDRTransactionPartiallyProcessedDetails;
