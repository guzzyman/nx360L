import { RouteEnum, UIPermissionEnum } from "common/Constants";
import { useParams, useNavigate } from "react-router";
import ClientXLeadDetails from "client-x-lead/ClientXLeadDetails";
import { nimbleX360CRMLeadApi } from "./CRMLeadStoreQuerySlice";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { parseDateToString } from "common/Utils";
import CRMLeadDetailsProfile from "./CRMLeadDetailsProfile";
import { userTypeEnum } from "client-x-lead-x-request/ClientXLeadXRequestConstants";
import ClientXLeadDetailsInteractions from "client-x-lead/ClientXLeadDetailsInteractions";
import { Button, Icon } from "@mui/material";
import CRMLeadDetailsGeneral from "./CRMLeadDetailsGeneral";
import ClientXLeadActivitiesLog from "client-x-lead/ClientXLeadActivitiesLog";
import { useMemo, useState } from "react";
import ClientXLeadReAssignOfficer from "client-x-lead/ClientXLeadReAssignOfficer";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";

function CRMLeadDetails(props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const authUserUIPermissionRestrictor = useAuthUserUIPermissionRestrictor();

  const [reAssignOfficer, setReAssignOfficer] = useState(false);

  const clientQueryResult = nimbleX360CRMLeadApi.useGetCRMLeadQuery(id);
  const clientImageQueryResult =
    nimbleX360CRMClientApi.useGetCRMClientImageQuery(id);
  console.log(
    "clientQueryResult",
    clientQueryResult?.data?.moreInfo?.clients?.id
  );
  const clientActions = useMemo(
    () =>
      authUserUIPermissionRestrictor.filter([
        {
          name: "Convert to Client",
          action: () =>
            navigate(
              `/crm/clients/add/${clientQueryResult?.data?.moreInfo?.clients?.id}/lead/${id}`
            ),
          disabled: clientQueryResult.isFetching,
          icon: "add",
          status: [
            "clientStatusType.incomplete",
            "clientStatusType.pending",
            "clientStatusType.active",
            "clientStatusType.transfer.in.progress",
            "clientStatusType.transfer.on.hold",
            "clientStatusType.closed",
            "clientStatusType.rejected",
            "clientStatusType.withdraw",
          ],
          permissions: [UIPermissionEnum.PAY_CLIENTCHARGE],
        },
        {
          name: "Reassign Officer",
          action: () => setReAssignOfficer(true),
          icon: "chevron_right",
          status: [
            "clientStatusType.incomplete",
            "clientStatusType.pending",
            "clientStatusType.active",
            "clientStatusType.transfer.in.progress",
            "clientStatusType.transfer.on.hold",
            "clientStatusType.closed",
            "clientStatusType.rejected",
            "clientStatusType.withdraw",
          ],
          permissions: [UIPermissionEnum.PAY_CLIENTCHARGE_CHECKER],
        },
      ]),
    [
      authUserUIPermissionRestrictor,
      clientQueryResult?.data?.moreInfo?.clients?.id,
      clientQueryResult.isFetching,
      id,
      navigate,
    ]
  );
  return (
    <div>
      <ClientXLeadDetails
        id={id}
        breadcrumbName="Leads"
        leads
        breadcrumbTo={RouteEnum.CRM_LEADS}
        imageQueryResult={clientImageQueryResult}
        detailsQueryResult={clientQueryResult}
        name={(data) => data?.moreInfo?.clients?.displayName}
        summary={(data) => [
          {
            label: "Lead Category",
            value: data?.leadCategory?.name,
          },
          {
            label: "Account Officer",
            value: data?.moreInfo?.clients?.staffName,
          },
          {
            label: "Customer ID",
            value: data?.moreInfo?.clients?.id,
          },
          {
            ...(data?.moreInfo?.clients?.timeline?.submittedOnDate
              ? {
                  label: "Submitted Date",
                  value:
                    data?.moreInfo?.clients?.timeline?.submittedOnDate &&
                    parseDateToString(
                      data?.moreInfo?.clients?.timeline?.submittedOnDate
                    ),
                }
              : {}),
          },
          // {
          //   label: "Client Status",
          //   value: (
          //     <ClientXLeadStatusChip status={data?.moreInfo?.clients?.status} />
          //   ),
          // },
        ]}
        actions={clientActions?.map(
          (action, i) =>
            action.status.includes(
              clientQueryResult?.data?.moreInfo?.clients?.status?.code
            ) && (
              <Button
                variant="outlined"
                color={action.color}
                disable={action.disabled}
                onClick={action.action}
                endIcon={<Icon>{action.icon}</Icon>}
              >
                {action.name}
              </Button>
            )
        )}
        tabs={(data) => [
          {
            name: "GENERAL",
            content: (
              <CRMLeadDetailsGeneral
                customerId={data?.moreInfo?.clients?.accountNo || ""}
                userType={userTypeEnum.LEAD}
                clientId={data?.moreInfo?.clients?.id}
              />
            ),
          },
          { name: "PROFILE", content: <CRMLeadDetailsProfile client={data} /> },
          {
            name: "INTERACTIONS",
            content: (
              <ClientXLeadDetailsInteractions
                customerId={data?.moreInfo?.clients?.id || ""}
                userType={userTypeEnum.LEAD}
              />
            ),
          },
          {
            name: "CHANNELS ACTIVITIES",
            content: (
              <ClientXLeadActivitiesLog
                customerId={data?.clients?.accountNo || ""}
                userType={userTypeEnum.CUSTOMER}
                clientId={data?.clients?.id}
              />
            ),
          },
        ]}
      />

      {reAssignOfficer && (
        <ClientXLeadReAssignOfficer
          open={clientQueryResult?.data ? reAssignOfficer : false}
          clientId={clientQueryResult?.data?.moreInfo?.clients?.id}
          onClose={() => setReAssignOfficer(false)}
        />
      )}
    </div>
  );
}

export default CRMLeadDetails;
