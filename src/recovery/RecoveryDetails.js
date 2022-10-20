import { useMemo, useState } from "react";
import {
  Button,
  Divider,
  Icon,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import BackButton from "common/BackButton";
import PageHeader from "common/PageHeader";
import LoadingContent from "common/LoadingContent";
import { CurrencyEnum, RouteEnum, UIPermissionEnum } from "common/Constants";
import { useParams } from "react-router";
import { sequestRecoveryApi } from "./RecoveryStoreQuerySlice";
import { nx360RecoveryApi } from "./RecoveryStoreQuerySlice";
import RecoveryStatusChip from "./RecoveryStatusChip";
import RecoveryDetailsHistory from "./RecoveryDetailsHistory";
import RecoveryDetailsDiscuss from "./RecoveryDetailsDiscuss";
import RecoveryDetailsFile from "./RecoveryDetailsFile";
import { generatePath, useNavigate } from "react-router-dom";
import { formatNumberToCurrency } from "common/Utils";
import RecoveryReassignOfficer from "./RecoveryReassignOfficer";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
// import useAuthUser from "hooks/useAuthUser";

function RecoveryDetails(props) {
  const { id } = useParams();

  const [reAssignOfficer, setReAssignOfficer] = useState(false);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);

  const recoverDetailsQueryResult = nx360RecoveryApi.useGetAllRecoveryByIdQuery(
    id,
    { skip: !id }
  );

  const recoverDetails = recoverDetailsQueryResult?.data;

  const recoveryExceptionQueryResult =
    sequestRecoveryApi.useGetExceptionDetailsQuery(
      recoverDetails?.ticketNumber,
      {
        skip: !recoverDetails?.ticketNumber,
      }
    );

  const exceptionDetails = useMemo(
    () => recoveryExceptionQueryResult.data?.data?.exceptionDetails,
    [recoveryExceptionQueryResult.data?.data?.exceptionDetails]
  );

  const tabProps = { recoveryExceptionQueryResult };

  const tabs = [
    {
      name: "HISTORY",
      content: <RecoveryDetailsHistory {...tabProps} />,
    },
    {
      name: "DISCOURSE",
      content: <RecoveryDetailsDiscuss {...tabProps} />,
    },
    {
      name: "FILES",
      content: <RecoveryDetailsFile {...tabProps} />,
    },
  ];

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Recovery", to: RouteEnum.SEQUEST_EXCEPTION },
        ]}
      />
      <LoadingContent
        loading={
          recoverDetailsQueryResult.isLoading ||
          recoveryExceptionQueryResult.isLoading
        }
        error={
          recoverDetailsQueryResult.isError ||
          recoveryExceptionQueryResult.isError
        }
        onReload={() => {
          if (recoverDetailsQueryResult?.isError) {
            recoverDetailsQueryResult.refetch();
          }
          if (recoveryExceptionQueryResult?.isError) {
            recoveryExceptionQueryResult.refetch();
          }
        }}
      >
        {() => (
          <>
            {exceptionDetails ? (
              <>
                <Paper className="p-4 md:p-8 mb-4">
                  <div className="flex flex-row gap-4">
                    <div>
                      <Typography
                        variant="h6"
                        className="font-bold"
                        gutterBottom
                      >
                        {exceptionDetails?.creatorName}
                      </Typography>
                    </div>
                    <div>
                      <RecoveryStatusChip status={exceptionDetails?.status} />
                    </div>
                    <div className="flex-1" />
                    <div>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          navigate(
                            generatePath(RouteEnum.CRM_CLIENTS_DETAILS, {
                              id: recoverDetailsQueryResult?.data?.clientData
                                ?.id,
                            })
                          )
                        }
                      >
                        View Client
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          navigate(
                            generatePath(RouteEnum.CRM_CLIENTS_LOAN_DETAILS, {
                              id: recoverDetailsQueryResult?.data?.clientData
                                ?.id,
                              loanId: recoverDetailsQueryResult?.data?.loan?.id,
                            })
                          )
                        }
                      >
                        View Loan
                      </Button>
                    </div>
                    <AuthUserUIPermissionRestrictor
                      permissions={[UIPermissionEnum.ASSIGNSTAFF_GROUP]}
                    >
                      <div>
                        <Button
                          variant="outlined"
                          endIcon={<Icon>add</Icon>}
                          onClick={() => setReAssignOfficer(true)}
                        >
                          Reassign Recovery Officer
                        </Button>
                      </div>
                    </AuthUserUIPermissionRestrictor>
                  </div>
                  <Divider className="my-4" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Recovery ID:",
                        value: exceptionDetails?.exceptionId,
                      },
                      {
                        label: "Recovery Name:",
                        value: exceptionDetails?.title,
                      },
                      {
                        label: "Responsible Person:",
                        value: exceptionDetails?.responsiblePerson,
                      },
                      {
                        label: "Client ID",
                        value: `${recoverDetailsQueryResult?.data?.clientData?.id}`,
                      },
                      {
                        label: "Client Name",
                        value: `${recoverDetailsQueryResult?.data?.clientData?.displayName}`,
                      },
                      {
                        label: "Loan ID",
                        value: `${recoverDetailsQueryResult?.data?.loan?.id}`,
                      },
                      {
                        label: "Loan Product Name",
                        value: `${recoverDetailsQueryResult?.data?.loan?.loanProductName}`,
                      },
                      {
                        label: "Status",
                        value: `${recoverDetailsQueryResult?.data?.loan?.status?.value}`,
                        Cell: ({ value }) => (
                          <RecoveryStatusChip status={value} />
                        ),
                        width: 100,
                      },
                      {
                        label: "Amount Paid (Total Repayment)",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          recoverDetailsQueryResult?.data?.loan?.summary
                            ?.totalRepayment
                        )}`,
                      },
                      {
                        label: "Outstanding",
                        value: `${
                          CurrencyEnum.NG.symbol
                        }${formatNumberToCurrency(
                          recoverDetailsQueryResult?.data?.loan?.summary
                            ?.totalOutstanding
                        )}`,
                      },
                      {
                        label: "Days Over Due",
                        value: `${recoverDetailsQueryResult?.data?.daysOverDue} days`,
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="">
                        <Typography
                          variant="body2"
                          className="text-text-secondary"
                        >
                          {label}
                        </Typography>
                        <Typography>
                          {value !== undefined && value !== null && value !== ""
                            ? value
                            : "-"}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </Paper>
                <Paper className="p-4 md:p-8 mb-4">
                  <Typography className="font-bold" variant="h6">
                    Recovery Engagements
                  </Typography>
                  <Tabs
                    value={activeTab}
                    onChange={(_, value) => setActiveTab(value)}
                  >
                    {tabs?.map((tab, index) => (
                      <Tab key={tab.name} value={index} label={tab.name} />
                    ))}
                  </Tabs>
                  <Divider className="mb-3" style={{ marginTop: -1 }} />
                  {tabs?.[activeTab]?.content}
                </Paper>
              </>
            ) : (
              <>
                <Paper className="p-4 md:p-8 mb-4">
                  <div className="flex flex-row gap-4">
                    <div className="flex items-center gap-4">
                      <Typography
                        variant="h6"
                        className="font-bold"
                        gutterBottom
                      >
                        Recovery information is not available at this time.
                        Please try again later.
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </>
            )}
          </>
        )}
      </LoadingContent>
      {reAssignOfficer && (
        <RecoveryReassignOfficer
          open={reAssignOfficer}
          clientId={id}
          onClose={() => setReAssignOfficer(false)}
        />
      )}
    </>
  );
}

export default RecoveryDetails;
