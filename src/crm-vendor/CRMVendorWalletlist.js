import ClientXLeadWalletList from 'client-x-lead/ClientXLeadWalletList';
import {RouteEnum} from 'common/Constants';
import React from 'react';
import {nimbleX360CRMVendorApi} from './CRMVendorStoreQuerySlice';

export default function CRMVendorWalletlist({clientId}) {
  const walletQueryResult = nimbleX360CRMVendorApi.useGetVendorWalletQuery (
    {id: clientId},
    {skip: !clientId}
  );

  return (
    <ClientXLeadWalletList
      walletQueryResult={walletQueryResult}
      detailsRoute={RouteEnum.CRM_CLIENTS_WALLET_DETAILS}
      id={clientId}
    />
  );
}
