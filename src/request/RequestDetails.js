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
import { generatePath, useNavigate } from "react-router-dom";
import { sequestRequestApi } from "./RequestStoreQuerySlice";
import RequestStatusChip from "./RequestStatusChip";
import RequestDetailsHistory from "./RequestDetailsHistory";
import RequestDetailsDiscuss from "./RequestDetailsDiscuss";
import RequestDetailsEscalatedDiscuss from "./RequestDetailsEscalatedDiscuss";
import RequestDetailsFile from "./RequestDetailsFile";
import * as dfn from "date-fns";
import RequestEscalationStatusChip from "./RequestEscalationStatusChip";
import RequestDetailsClientUpdate from "./RequestDetailsClientUpdate";
import RequestTicketReCategorization from "./RequestTicketReCategorization";

function RequestDetails(props) {
  const { id } = useParams();

  const [openModal, setOpenModal] = useState(false);

  const [openRecategorizeModal, setOpenRecategorizeModal] = useState(false);

  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();

  const requestQueryResult = sequestRequestApi.useGetRequestDetailsQuery(id);

  const ticketDetails = requestQueryResult.data?.data?.ticketDetails;

  const isEscalatedDiscourseExist = ticketDetails?.isEscalated;

  const tabProps = { requestQueryResult, ticketDetails };

  const tabs = isEscalatedDiscourseExist
    ? [
        {
          name: "HISTORY",
          content: <RequestDetailsHistory {...tabProps} />,
        },
        {
          name: "DISCOURSE",
          content: <RequestDetailsDiscuss {...tabProps} />,
        },
        {
          name: "ESCALATED DISCOURSE",
          content: <RequestDetailsEscalatedDiscuss {...tabProps} />,
        },
        {
          name: "FILES",
          content: <RequestDetailsFile {...tabProps} />,
        },
      ]
    : [
        {
          name: "HISTORY",
          content: <RequestDetailsHistory {...tabProps} />,
        },
        {
          name: "DISCOURSE",
          content: <RequestDetailsDiscuss {...tabProps} />,
        },
        {
          name: "FILES",
          content: <RequestDetailsFile {...tabProps} />,
        },
      ];

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "Sequest", to: RouteEnum.SEQUEST_REQUEST },
          { name: "Request", to: RouteEnum.SEQUEST_REQUEST },
        ]}
      />
      <LoadingContent
        loading={requestQueryResult.isLoading}
        error={requestQueryResult.isError}
        onReload={requestQueryResult.refetch}
      >
        {() => (
          <>
            {openModal && (
              <RequestDetailsClientUpdate
                title="Update Client Details"
                open={openModal}
                onClose={() => setOpenModal(false)}
                affectedPersonEmail={ticketDetails?.affectedPersonEmail}
                clientId={ticketDetails?.clientId}
              />
            )}
            {openRecategorizeModal && (
              <RequestTicketReCategorization
                title="Update Ticket Category"
                open={openRecategorizeModal}
                onClose={() => setOpenRecategorizeModal(false)}
                affectedPersonEmail={ticketDetails?.affectedPersonEmail}
                clientId={ticketDetails?.clientId}
                ticketId={ticketDetails?.ticketId}
              />
            )}
            {ticketDetails ? (
              <>
                <Paper className="p-4 md:p-8 mb-4">
                  <div className="flex flex-row gap-4">
                    <div className="flex items-center gap-4">
                      <Typography
                        variant="h6"
                        className="font-bold"
                        gutterBottom
                      >
                        {ticketDetails?.customerName}
                      </Typography>
                      <RequestStatusChip status={ticketDetails?.status} />
                    </div>
                    <div className="flex-1" />
                    {isEscalatedDiscourseExist ? (
                      <>
                        <div>
                          <RequestEscalationStatusChip
                            status={ticketDetails?.escalatedStatus}
                          />
                        </div>
                      </>
                    ) : undefined}
                    <div>
                      <Button
                        variant="outlined"
                        endIcon={<Icon>add</Icon>}
                        onClick={() => setOpenRecategorizeModal(true)}
                      >
                        Re-Categorize Ticket
                      </Button>
                    </div>
                    {ticketDetails?.clientId === "" ? (
                      <div>
                        <Button
                          variant="outlined"
                          endIcon={<Icon>add</Icon>}
                          onClick={() => setOpenModal(true)}
                        >
                          Update Client Details
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            navigate(
                              generatePath(RouteEnum.CRM_CLIENTS_DETAILS, {
                                id: ticketDetails?.clientId,
                              })
                            )
                          }
                        >
                          View Client
                        </Button>
                      </div>
                    )}
                  </div>
                  <Divider className="my-4" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Customer Type:",
                        value: ticketDetails?.customerType,
                      },
                      {
                        label: "Client Email Address:",
                        value: !!ticketDetails?.affectedPersonEmail
                          ? ticketDetails?.affectedPersonEmail
                          : "--",
                      },
                      {
                        label: "Client ID:",
                        value: !!ticketDetails?.clientId
                          ? ticketDetails?.clientId
                          : "--",
                      },
                      {
                        label: "Ticket ID:",
                        value: ticketDetails?.ticketId,
                      },
                      {
                        label: "Ticket Type:",
                        value: ticketDetails?.ticketType,
                      },
                      {
                        label: "Ticket Title:",
                        value: ticketDetails?.title,
                      },
                      {
                        label: "Category:",
                        value: ticketDetails?.category,
                      },
                      {
                        label: "Sub Category:",
                        value: ticketDetails?.subCategory,
                      },
                      {
                        label: "Requesting Unit:",
                        value: !!ticketDetails?.requestingUnit
                          ? ticketDetails?.requestingUnit
                          : "--",
                      },
                      {
                        label: "Submitted Date:",
                        value:
                          dfn.format(
                            new Date(ticketDetails?.dateCreated),
                            "dd MMM yyyy"
                          ) &&
                          dfn.format(
                            new Date(ticketDetails?.dateCreated),
                            "dd MMM yyyy"
                          ),
                        // parseDateToString(ticketDetails?.dateCreated),
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
                    Ticket Engagements
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
                        Ticket information is not available at this time. Please
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
    </>
  );
}

export default RequestDetails;
