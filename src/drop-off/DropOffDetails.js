import { useState } from "react";
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
import { RouteEnum } from "common/Constants";
import { useParams } from "react-router";
import { sequestTeleSalesApi } from "./DropOffsStoreQuerySlice";
import { nx360DropOffApi } from "./DropOffsStoreQuerySlice";
import TeleSalesStatusChip from "./DropOffStatusChip";
import TelesalesDetailsHistory from "./DropOffDetailsHistory";
import TelesalesDetailsDiscuss from "./DropOffDetailsDiscuss";
import TelesalesDetailsFile from "./DropOffDetailsFile";
import { generatePath, useNavigate } from "react-router-dom";
import TelesalesReassignOfficer from "./TelesalesReassignOfficer";

function DropOffDetails(props) {
  const { id } = useParams();
  const [reAssignOfficer, setReAssignOfficer] = useState(false);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);

  const recoveryDetails = nx360DropOffApi.useGetAllSalesByIdQuery(id, {
    skip: !id,
  });

  const recoverDetailsQueryResult = recoveryDetails?.data;

  const recoveryQueryResult = sequestTeleSalesApi.useGetExceptionDetailsQuery(
    recoverDetailsQueryResult?.ticketNumber,
    { skip: !recoverDetailsQueryResult?.ticketNumber }
  );

  const exceptionDetails = recoveryQueryResult.data?.data?.exceptionDetails;

  const tabs = [
    {
      name: "HISTORY",
      content: (
        <TelesalesDetailsHistory recoveryQueryResult={recoveryQueryResult} />
      ),
    },
    {
      name: "DISCOURSE",
      content: (
        <TelesalesDetailsDiscuss recoveryQueryResult={recoveryQueryResult} />
      ),
    },
    {
      name: "FILES",
      content: (
        <TelesalesDetailsFile recoveryQueryResult={recoveryQueryResult} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Telesales", to: RouteEnum.TELESALES },
        ]}
      />
      <LoadingContent
        loading={recoveryQueryResult.isLoading}
        error={recoveryQueryResult.isError}
        onReload={recoveryQueryResult.refetch}
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
                      <TeleSalesStatusChip status={exceptionDetails?.status} />
                    </div>
                    <div className="flex-1" />
                    <div>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          navigate(
                            generatePath(RouteEnum.CRM_CLIENTS_DETAILS, {
                              id: recoverDetailsQueryResult?.clientData?.id,
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
                              id: recoverDetailsQueryResult?.clientData?.id,
                              loanId:
                                recoverDetailsQueryResult?.loanAccountData?.id,
                            })
                          )
                        }
                      >
                        View Loan
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="outlined"
                        endIcon={<Icon>add</Icon>}
                        onClick={() => setReAssignOfficer(true)}
                      >
                        Reassign Telesales Officer
                      </Button>
                    </div>
                  </div>
                  <Divider className="my-4" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Telesales ID:",
                        value: exceptionDetails?.exceptionId,
                      },
                      {
                        label: "Telesales Title:",
                        value: exceptionDetails?.title,
                      },
                      {
                        label: "Responsible Person:",
                        value: exceptionDetails?.responsiblePerson,
                      },
                      {
                        label: "Client ID",
                        value: `${recoverDetailsQueryResult?.clientData?.id}`,
                      },
                      {
                        label: "Client Name",
                        value: `${recoverDetailsQueryResult?.clientData?.displayName}`,
                      },
                      {
                        label: "Loan ID",
                        value: `${recoverDetailsQueryResult?.loanAccountData?.id}`,
                      },
                      {
                        label: "Loan Product Name",
                        value: `${recoverDetailsQueryResult?.loanAccountData?.loanProductName}`,
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
                    Telesales Engagements
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
                        Lead information is not available at this time. Please
                        try again later.
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
        <TelesalesReassignOfficer
          open={reAssignOfficer}
          clientId={id}
          onClose={() => setReAssignOfficer(false)}
        />
      )}
    </>
  );
}

export default DropOffDetails;
