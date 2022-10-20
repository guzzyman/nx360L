import { useState } from "react";
import {
  Divider,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import BackButton from "common/BackButton";
import PageHeader from "common/PageHeader";
import LoadingContent from "common/LoadingContent";
import { formatNumberToCurrency } from "common/Utils";
import CRMClientLoanWaiveInterestAdd from "crm-client/CRMClientLoanWaiveInterestAdd";
import { useMemo } from "react";
import CRMClientLoanWriteOffLoanAccountAdd from "crm-client/CRMClientLoanWriteOffLoanAccountAdd";
import CRMClientLoanCloseAdd from "crm-client/CRMClientLoanCloseAdd";
import CRMClientLoanAssignLoanOfficerAdd from "crm-client/CRMClientLoanAssignLoanOfficerAdd";
import CRMClientLoanRescheduleAdd from "crm-client/CRMClientLoanRescheduleAdd";
import ClientXLeadLoanStatusChip from "./ClientXLeadLoanStatusChip";

function ClientXLeadDetailsLoan(props) {
  const {
    breadcrumbName,
    breadcrumbTo,
    id,
    detailsQueryResult,
    clientQueryResult,
    summary,
    info,
    tabs,
  } = props;
  const [activeTab, setActiveTab] = useState(0);
  const [loanActionEl, setLoanActionEl] = useState(null);
  const [openWaiveInterest, setOpenWaiveInterest] = useState(false);
  const [openWriteOffLoanAccount, setOpenWriteOffLoanAccount] = useState(false);
  const [openLoanClose, setOpenLoanClose] = useState(false);
  const [openAssignLoanOfficer, setOpenAssignLoanOfficer] = useState(false);
  const [openLoanReschedule, setOpenLoanReschedule] = useState(false);

  const handleLoanActionOpenButton = (event) => {
    setLoanActionEl(event.currentTarget);
  };
  const { data, isLoading, isError, refetch } = detailsQueryResult;

  const loanActions = useMemo(
    () => [
      { name: "Waive Interest", action: () => setOpenWaiveInterest(true) },
      { name: "Reschedule", action: () => setOpenLoanReschedule(true) },
      { name: "Write Off", action: () => setOpenWriteOffLoanAccount(true) },
      { name: "Close", action: () => setOpenLoanClose(true) },
      {
        name: "Assign Loan Officer",
        action: () => setOpenAssignLoanOfficer(true),
      },
    ],
    []
  );

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "CRM", to: "clients" },
          { name: "clients", to: breadcrumbTo },
          {
            name: `Clients Details`,
            to: `${breadcrumbTo}/${id}`,
          },
          {
            name: `${breadcrumbName} Details`,
          },
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => {
          const _tabs = tabs?.(data);
          return (
            <>
              <Grid container spacing={1}>
                <Grid item xs={12} md={9}>
                  <Paper className="flex flex-wrap  justify-center md:justify-start gap-8 p-4 md:p-8">
                    <div className="w-full">
                      <div className="flex flex-wrap justify-between align-middle">
                        {/* <Typography
                          variant="h5"
                          className="font-bold mb-4"
                          gutterBottom
                          color="primary"
                        >
                          {data?.accountNo}
                          {data?.inArrears ? (
                            <ClientXLeadLoanStatusChip
                              variant="outlined-opaque"
                              color={"error"}
                              label={data?.status?.value}
                            />
                          ) : (
                            <ClientXLeadLoanStatusChip status={data?.status} />
                          )}
                        </Typography> */}

                        <div>
                          {data?.status?.active && (
                            <>
                              <IconButton
                                aria-describedby={"action-popover"}
                                onClick={handleLoanActionOpenButton}
                              >
                                <Icon>more_vert</Icon>
                              </IconButton>

                              <Popover
                                id={"action-popover"}
                                open={Boolean(loanActionEl)}
                                anchorEl={loanActionEl}
                                onClose={() => setLoanActionEl(null)}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "left",
                                }}
                              >
                                <List>
                                  {loanActions.map((action, index) => (
                                    <ListItem
                                      key={index}
                                      onClick={action.action}
                                      disablePadding
                                    >
                                      <ListItemButton>
                                        <ListItemText>
                                          {action.name}
                                        </ListItemText>
                                      </ListItemButton>
                                    </ListItem>
                                  ))}
                                </List>
                              </Popover>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
                        <div className="inline-grid gap-1 grid-cols-2 mb-4">
                          <Typography color="textSecondary" mr={2}>
                            Loan Balance:
                          </Typography>

                          <Typography fontWeight={600}>
                            {data?.summary?.currency?.displaySymbol}
                            {formatNumberToCurrency(
                              data?.summary?.totalOutstanding
                            )}
                          </Typography>
                        </div>

                        <div className="inline-grid gap-1 grid-cols-2 mb-4">
                          <Typography color="textSecondary" mr={2}>
                            Arrears By:
                          </Typography>

                          <Typography fontWeight={600}>
                            {data?.summary?.currency?.displaySymbol}
                            {formatNumberToCurrency(
                              data?.summary?.totalOverdue
                            )}
                          </Typography>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
                        {summary?.(data)?.map(({ label, value }) => (
                          <div
                            key={label}
                            className="inline-grid gap-1 grid-cols-2"
                          >
                            <Typography color="textSecondary">
                              {label}
                            </Typography>
                            {typeof value === "string" ? (
                              <Typography fontWeight={600}>{value}</Typography>
                            ) : (
                              value
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Paper className="flex flex-wrap justify-center md:justify-start gap-8 p-4 md:p-8">
                    <div>
                      <Typography
                        variant="h5"
                        className="font-bold mb-4"
                        gutterBottom
                        color="primary"
                      >
                        {clientQueryResult?.data?.displayName}
                      </Typography>
                      <div className="grid gap-3">
                        {info?.(clientQueryResult?.data)?.map(
                          ({ label, value }) => (
                            <div
                              key={label}
                              className="inline-grid gap-8 grid-cols-2"
                            >
                              <Typography color="textSecondary">
                                {label}
                              </Typography>
                              {typeof value === "string" ? (
                                <Typography>{value}</Typography>
                              ) : (
                                value
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Paper>
                </Grid>
              </Grid>

              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
              >
                {_tabs?.map((tab, index) => (
                  <Tab key={tab.name} value={index} label={tab.name} />
                ))}
              </Tabs>
              <Divider className="mb-3" style={{ marginTop: -1 }} />
              {_tabs?.[activeTab]?.content}
            </>
          );
        }}
      </LoadingContent>

      {openWaiveInterest && (
        <CRMClientLoanWaiveInterestAdd
          open={openWaiveInterest}
          onClose={() => setOpenWaiveInterest(false)}
        />
      )}

      {openWriteOffLoanAccount && (
        <CRMClientLoanWriteOffLoanAccountAdd
          open={openWriteOffLoanAccount}
          onClose={() => setOpenWriteOffLoanAccount(false)}
        />
      )}

      {openLoanClose && (
        <CRMClientLoanCloseAdd
          open={openLoanClose}
          onClose={() => setOpenLoanClose(false)}
        />
      )}

      {openAssignLoanOfficer && (
        <CRMClientLoanAssignLoanOfficerAdd
          open={openAssignLoanOfficer}
          onClose={() => setOpenAssignLoanOfficer(false)}
        />
      )}

      {openLoanReschedule && (
        <CRMClientLoanRescheduleAdd
          open={openLoanReschedule}
          onClose={() => setOpenLoanReschedule(false)}
        />
      )}
    </>
  );
}

export default ClientXLeadDetailsLoan;
