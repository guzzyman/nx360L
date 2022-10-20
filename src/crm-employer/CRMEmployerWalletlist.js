import ClientXLeadWalletList from "client-x-lead/ClientXLeadWalletList";
import { RouteEnum } from "common/Constants";
import React from "react";
import { nimbleX360CRMEmployerApi } from "./CRMEmployerStoreQuerySlice";

export default function CRMEmployerWalletlist({ businessId }) {
  const walletQueryResult = nimbleX360CRMEmployerApi.useGetEmployerWalletQuery(
    businessId,
    { skip: !businessId }
  );

  return (
    <ClientXLeadWalletList
      walletQueryResult={walletQueryResult}
      detailsRoute={RouteEnum.CRM_CLIENTS_WALLET_DETAILS}
      id={businessId}
    />
  );
}
