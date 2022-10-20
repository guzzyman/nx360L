import { RouteEnum, UIPermissionEnum } from "common/Constants";
import { Link, useParams } from "react-router-dom";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import ClientXLeadDetails from "client-x-lead/ClientXLeadDetails";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";
import ClientXLeadDetailsGeneral from "client-x-lead/ClientXLeadDetailsGeneral";
import ClientXLeadDetailsInteractions from "client-x-lead/ClientXLeadDetailsInteractions";
import { parseDateToString } from "common/Utils";
import CRMClientDetailsProfile from "./CRMClientDetailsProfile";
import CRMClientWalletList from "./CRMClientWalletList";
import ClientXLeadLoanList from "client-x-lead/ClientXLeadLoanList";
import { userTypeEnum } from "client-x-lead-x-request/ClientXLeadXRequestConstants";
import { ClientXLeadStatusEnum } from "client-x-lead/ClientXLeadConstants";
import { Button, Icon, Link as MuiLink } from "@mui/material";
import { useMemo, useState } from "react";
import ClientApprovalActivateAction from "client-approval/ClientApprovalActivateAction";
import CRMClientRejectAction from "./CRMClientRejectAction";
import ClientXLeadXEmployerSurvey from "client-x-lead-x-employer/ClientXLeadXEmployerSurvey";
import ClientXLeadFixedDepositList from "client-x-lead/ClientXLeadFixedDepositList";
import ClientXLeadActivitiesLog from "client-x-lead/ClientXLeadActivitiesLog";
import CRMClientDeactivateAction from "./CRMClientDeactivateAction";
import ClientXLeadReAssignOfficer from "client-x-lead/ClientXLeadReAssignOfficer";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import CRMClientDetailsLagacySystem from "./CRMClientDetailsLagacySystem";
import { nimbleX360MambuApi } from "common/StoreQuerySlice";
import ClientXLeadNXLoanList from "client-x-lead/ClientXLeadNXLoanList";

function CRMClientDetails(props) {
  // const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [activateClient, setActivateClient] = useState(false);
  const [rejectClient, setRejectClient] = useState(false);
  const [deactivateClient, setDeactivateClient] = useState(false);
  const [reactivate, setReactivateClient] = useState(false);
  const [reAssignOfficer, setReAssignOfficer] = useState(false);
  const [openLagacySystem, setOpenLagacySystem] = useState(false);

  const clientQueryResult = nimbleX360CRMClientApi.useGetCRMCDLClientQuery(id);

  const clientImageQueryResult =
    nimbleX360CRMClientApi.useGetCRMClientImageQuery(id);

  const loansQueryResult = nimbleX360CRMClientApi.useGetClientLoansQuery(id);

  const externalId = clientQueryResult?.data?.clients?.externalId;
  const nxLoansQueryResult = nimbleX360MambuApi.useGetLoansQuery(externalId, {
    skip: !externalId,
  });

  const fixedDepositQueryResult =
    nimbleX360CRMClientApi.useGetClientAccountQuery({
      id,
      fields: "savingsAccounts",
    });

  const clientTrackingQueryResult =
    nimbleX360CRMClientApi.useGetClientTrackingQuery(
      useMemo(
        () => ({
          accountNumber: clientQueryResult?.data?.clients?.accountNo,
          limit: 2,
        }),
        [clientQueryResult?.data?.clients?.accountNo]
      ),
      { skip: !clientQueryResult?.data?.clients?.accountNo }
    );

  console.log(
    "clientQueryResult?.data?.clients?.sourceId",
    clientQueryResult?.data?.clients?.sourceId,
    clientQueryResult?.data?.clients?.sourceName
  );

  const clientActions = useMemo(
    () => [
      clientQueryResult?.data?.clients?.sourceId
        ? {
            name: "Lagacy System",
            action: () => setOpenLagacySystem(true),
            icon: "add",
            color: "primary",
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
            permissions: [UIPermissionEnum.READ_CLIENT],
          }
        : {},
      {
        name: "Activate",
        action: () => setActivateClient(true),
        icon: "chevron_right",
        status: ["clientStatusType.pending"],
      },
      {
        name: "Reactivate",
        action: () => {
          setActivateClient(true);
          setReactivateClient(true);
        },
        icon: "chevron_right",
        status: ["clientStatusType.closed"],
      },
      {
        name: "Reject",
        action: () => setRejectClient(true),
        icon: "chevron_right",
        color: "warning",
        status: ["clientStatusType.pending"],
      },
      {
        name: "Deactivate",
        action: () => setDeactivateClient(true),
        icon: "chevron_right",
        color: "warning",
        status: ["clientStatusType.active"],
        permissions: [UIPermissionEnum.ACTIVATE_CLIENT],
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
        permissions: [UIPermissionEnum.ASSIGNSTAFF_CLIENT],
      },
    ],
    // eslint-disable-next-line
    [clientQueryResult?.data]
  );

  return (
    <>
      <ClientXLeadDetails
        id={id}
        breadcrumbName="Clients"
        breadcrumbTo={RouteEnum.CRM_CLIENTS}
        imageQueryResult={clientImageQueryResult}
        detailsQueryResult={clientQueryResult}
        loansQueryResult={loansQueryResult}
        name={(data) => data?.clients?.displayName}
        summary={(data) => [
          {
            label: "Customer Type",
            value: data?.clients?.employmentSector?.name,
          },
          {
            label: "Account Officer",
            value: data?.clients?.staffName,
          },
          {
            label: "Customer ID",
            value: data?.clients?.id,
          },
          {
            label: "External ID",
            value: data?.clients?.accountNo,
          },
          {
            ...(data?.clients?.timeline?.submittedOnDate
              ? {
                  label: "Submitted Date",
                  value:
                    data?.clients?.timeline?.submittedOnDate &&
                    parseDateToString(data?.clients?.timeline?.submittedOnDate),
                }
              : {}),
          },
          {
            label: "Client Status",
            value: <ClientXLeadStatusChip status={data?.clients?.status} />,
          },
          {
            label: (
              <div className="col-span-2">
                {data?.clients?.status == 50 && (
                  <MuiLink
                    component={Link}
                    to={RouteEnum.CRM_CLIENTS_ADD + `/${data?.clients?.id}`}
                  >
                    To book a loan click here to complete clients profile
                  </MuiLink>
                )}
              </div>
            ),
          },
        ]}
        actions={clientActions?.map(
          (action, i) =>
            action?.status?.includes(
              clientQueryResult?.data?.clients?.status?.code
            ) && (
              <AuthUserUIPermissionRestrictor
                permissions={action.permissions}
                validateAll={action.validateAllPermissions}
                negateValidation={action.negatePermissionsValidation}
              >
                <Button
                  variant="outlined"
                  color={action.color}
                  onClick={action.action}
                  endIcon={<Icon>{action.icon}</Icon>}
                >
                  {action.name}
                </Button>
              </AuthUserUIPermissionRestrictor>
            )
        )}
        // defaultTab={parseInt(searchParams.get("defaultTab"))}
        tabs={(data) => [
          {
            name: "GENERAL",
            permissions: [UIPermissionEnum.READ_CLIENT],
            content: (
              <ClientXLeadDetailsGeneral
                customerId={data?.clients?.accountNo || ""}
                userType={userTypeEnum.CUSTOMER}
                clientId={data?.clients?.id}
                clientTrackingQueryResult={clientTrackingQueryResult}
              />
            ),
          },
          {
            name: "PROFILE",
            permissions: [UIPermissionEnum.READ_CLIENT],
            content: <CRMClientDetailsProfile client={data} />,
          },
          data?.clients?.status?.value === ClientXLeadStatusEnum?.INCOMPLETE ||
          data?.clients?.status?.value === ClientXLeadStatusEnum?.PENDING
            ? null
            : {
                name: "LOANS",
                permissions: [UIPermissionEnum.READ_LOAN],
                content: (
                  <ClientXLeadLoanList
                    id={id}
                    addRoute={RouteEnum.CRM_CLIENTS_LOAN_ADD}
                    detailsRoute={RouteEnum.CRM_CLIENTS_LOAN_DETAILS}
                    loansQueryResult={loansQueryResult}
                    active={data?.clients?.active}
                  />
                ),
              },

          data?.clients?.status?.value === ClientXLeadStatusEnum?.INCOMPLETE ||
          data?.clients?.status?.value === ClientXLeadStatusEnum?.PENDING
            ? null
            : {
                name: "NX LOANS",
                permissions: [UIPermissionEnum.READ_LOAN],
                content: (
                  <ClientXLeadNXLoanList
                    id={id}
                    addRoute={RouteEnum.CRM_CLIENTS_LOAN_ADD}
                    detailsRoute={RouteEnum.CRM_CLIENTS_LOAN_DETAILS}
                    loansQueryResult={nxLoansQueryResult}
                    active={data?.clients?.active}
                  />
                ),
              },
          {
            name: "INTERACTIONS",
            permissions: [UIPermissionEnum.READ_INTERREQUEST],
            content: (
              <ClientXLeadDetailsInteractions
                customerId={data?.clients?.id || ""}
                userType={userTypeEnum.CUSTOMER}
              />
            ),
          },
          {
            name: "SURVEY",
            permissions: [
              UIPermissionEnum.REGISTER_SURVEY,
              UIPermissionEnum.READ_ClientTrendsByDay,
            ],
            content: <ClientXLeadXEmployerSurvey client={data} />,
          },
          {
            name: "CHANNELS ACTIVITIES",
            permissions: [
              UIPermissionEnum.READ_ProgramDetails,
              UIPermissionEnum.READ_ClientTrendsByWeek,
            ],
            content: (
              <ClientXLeadActivitiesLog
                customerId={data?.clients?.accountNo || ""}
                userType={userTypeEnum.CUSTOMER}
                clientId={data?.clients?.id}
                clientTrackingQueryResult={clientTrackingQueryResult}
              />
            ),
          },

          data?.clients?.status?.value === ClientXLeadStatusEnum?.INCOMPLETE ||
          data?.clients?.status?.value === ClientXLeadStatusEnum?.PENDING
            ? null
            : {
                name: "INVESTMENT",
                permissions: [UIPermissionEnum.READ_FIXEDDEPOSITACCOUNT],
                content: (
                  <ClientXLeadFixedDepositList
                    id={id}
                    addRoute={RouteEnum.CRM_CLIENT_FIXED_DEPOSIT_ADD}
                    detailsRoute={RouteEnum.CRM_CLIENTS_FIXED_DEPOSIT_DETAILS}
                    fixedDepositQueryResult={fixedDepositQueryResult}
                    active={data?.clients?.active}
                  />
                ),
              },

          data?.clients?.status?.value === ClientXLeadStatusEnum?.INCOMPLETE ||
          data?.clients?.status?.value === ClientXLeadStatusEnum?.PENDING
            ? null
            : {
                name: "WALLET",
                permissions: [UIPermissionEnum.READ_SAVINGSACCOUNT],
                content: (
                  <CRMClientWalletList
                    id={id}
                    addRoute={RouteEnum.CRM_CLIENT_FIXED_DEPOSIT_ADD}
                    detailsRoute={RouteEnum.CRM_CLIENTS_WALLET_DETAILS}
                    active={data?.clients?.active}
                  />
                ),
              },
        ]}
      />

      {activateClient && (
        <ClientApprovalActivateAction
          reactivate={reactivate}
          open={activateClient}
          onClose={() => setActivateClient(false)}
        />
      )}
      {rejectClient && (
        <CRMClientRejectAction
          open={rejectClient}
          onClose={() => setRejectClient(false)}
        />
      )}
      {deactivateClient && (
        <CRMClientDeactivateAction
          open={deactivateClient}
          onClose={() => setDeactivateClient(false)}
        />
      )}
      {reAssignOfficer && (
        <ClientXLeadReAssignOfficer
          open={reAssignOfficer}
          clientId={id}
          onClose={() => setReAssignOfficer(false)}
        />
      )}
      {openLagacySystem && (
        <CRMClientDetailsLagacySystem
          open={openLagacySystem}
          clientQueryResult={clientQueryResult}
          onClose={() => setOpenLagacySystem(false)}
        />
      )}
    </>
  );
}

export default CRMClientDetails;
