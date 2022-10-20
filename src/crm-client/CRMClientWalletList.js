import ClientXLeadWalletList from "client-x-lead/ClientXLeadWalletList";
import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";

export default function CRMClientWalletList({
  id,
  addRoute,
  active,
  detailsRoute,
}) {
  const walletQueryResult = nimbleX360CRMClientApi.useGetClientAccountQuery({
    id,
    fields: "savingsAccounts",
  });

  return (
    <ClientXLeadWalletList
      detailsRoute={detailsRoute}
      id={id}
      addRoute={addRoute}
      active={active}
      walletQueryResult={walletQueryResult}
    />
  );
}
