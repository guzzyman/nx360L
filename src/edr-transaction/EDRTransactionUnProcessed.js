import {} from "@mui/material";
import EDRTransactionScaffold from "./EDRTransactionScaffold";
// import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import { RouteEnum } from "common/Constants";

function EDRTransactionUnProcessed(props) {
  return (
    <EDRTransactionScaffold
      title="Unprocessed"
      breadcrumbs={[{ name: "Unprocessed" }]}
      queryArgs={queryArgs}
      detailsRoutePath={RouteEnum.EDR_UNPROCESSED_DETAILS}
    />
  );
}

export default EDRTransactionUnProcessed;

const queryArgs = { status: "PENDING", withUniqueId: true };

// const columns = [
//   {
//     Header: "Transaction ID",
//     accessor: "transactionId",
//   },
//   {
//     Header: "Amount Remitted",
//     accessor: "amount",
//     Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
//   },
//   { Header: "FCMB Reference No", accessor: "referenceNumber" },
//   {
//     Header: "Transaction Date",
//     accessor: (row) => row?.transactionDate?.join("-"),
//   },
// ];
