import { RouteEnum, UIPermissionEnum } from "common/Constants";
import { useParams } from "react-router";
import ClientXLeadDetails from "client-x-lead/ClientXLeadDetails";
import { nimbleX360CRMVendorApi } from "./CRMVendorStoreQuerySlice";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { userTypeEnum } from "client-x-lead-x-request/ClientXLeadXRequestConstants";
import { useMemo } from "react";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";
import CRMVendorDetailsGeneral from "./CRMVendorDetailsGeneral";
import CRMVendorProfile from "./CRMVendorProfile";
import CRMVendorWalletlist from "./CRMVendorWalletlist";
import CRMVendorLoanProductConfigOverrideList from "./CRMVendorLoanProductConfigOverrideList";

function CRMVendorDetails(props) {
  const { id } = useParams();

  const clientQueryResult = nimbleX360CRMVendorApi.useGetCRMVendorQuery(id);

  const clientImageQueryResult =
    nimbleX360CRMClientApi.useGetCRMClientImageQuery(
      useMemo(
        () => clientQueryResult?.data?.businessId,
        [clientQueryResult?.data?.businessId]
      ),
      { skip: !clientQueryResult?.data?.businessId }
    );

  return (
    <ClientXLeadDetails
      defaultTab={1}
      id={id}
      breadcrumbName="Vendor"
      leads
      breadcrumbTo={RouteEnum.CRM_VENDOR}
      imageQueryResult={clientImageQueryResult}
      detailsQueryResult={clientQueryResult}
      name={(data) => data?.name}
      summary={(data) => [
        {
          label: "Vendor Id",
          value: data?.id,
        },
        {
          label: "External Id",
          value: data?.accountNo,
        },
        {
          label: "Activation Date",
          value: data?.activationDate,
        },
        {
          label: "Vendor Status",
          value: <ClientXLeadStatusChip status={data?.status} />,
        },
      ]}
      tabs={(data) => [
        {
          name: "GENERAL",
          content: (
            <CRMVendorDetailsGeneral
              customerId={data?.moreInfo?.clients?.accountNo || ""}
              userType={userTypeEnum.EMPLOYER}
              clientId={data?.id}
            />
          ),
          permissions: [UIPermissionEnum.READ_Vendor,
            UIPermissionEnum.READ_VENDOR,],
        },
        {
          name: "PROFILE",
          content: <CRMVendorProfile client={data} />,
          permissions: [UIPermissionEnum.READ_Vendor,  UIPermissionEnum.READ_VENDOR],
        },
        {
          name: "WALLET",
          content: <CRMVendorWalletlist clientId={data?.id} />,
          permissions: [UIPermissionEnum.CREATE_ACCOUNTNUMBERFORMAT],
        },
        {
          name: "LOAN PRODUCT CONFIG",
          content: (
            <CRMVendorLoanProductConfigOverrideList clientId={data?.id} />
          ),
          permissions: [UIPermissionEnum.CREATE_ACCOUNTTRANSFER],
        },
      ]}
    />
  );
}

export default CRMVendorDetails;
