import { useState } from "react";
import {
  Box,
  Button,
  capitalize,
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
import { removeEmptyProperties } from "common/Utils";
import { useMemo } from "react";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import {
  CUSTOMER_ENUM,
  CUSTOMER_TYPE_NAME_ENUM,
  CUSTOMER_TYPE_TO_ENUM,
} from "common/Constants";

function ClientXLeadTabDetails(props) {
  const {
    breadcrumbName,
    breadcrumbTo,
    id,
    detailsQueryResult,
    clientQueryResult,
    summary,
    summaryAside,
    summaryHeader,
    summaryActions,
    contentBeforeSummary,
    contentAfterSummary,
    info,
    defaultTab,
    tabs,
  } = props;
  const [activeTab, setActiveTab] = useState(defaultTab || 0);
  const [loanActionEl, setLoanActionEl] = useState(null);

  const handleLoanActionOpenButton = (event) => {
    setLoanActionEl(event.currentTarget);
  };
  const { data, isLoading, isError, refetch } = detailsQueryResult;
  let sum = useMemo(
    () => removeEmptyProperties(summary(data)),
    //eslint-disable-next-line
    [data]
  );

  const legalForm =
    clientQueryResult.data?.legalForm?.id ||
    clientQueryResult?.data?.clients?.legalForm?.id;
  const legalFormBreadCrumb = `${
    CUSTOMER_TYPE_TO_ENUM[legalForm]?.toUpperCase() || ""
  }`;
  const legalFormBreadCrumbName = CUSTOMER_TYPE_NAME_ENUM[legalForm] || "";

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "CRM", to: "" },
          {
            name: capitalize(legalFormBreadCrumbName),
            to: legalFormBreadCrumb,
          },
          legalFormBreadCrumbName === CUSTOMER_TYPE_NAME_ENUM[2]
            ? {}
            : {
                name: `${capitalize(legalFormBreadCrumbName)} Details`,
                to: `${legalFormBreadCrumb}/${id}`,
              },
          {
            name: `${capitalize(legalFormBreadCrumbName)} Details`,
          },
        ].filter((value) => Object.keys(value).length >= 1)}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => {
          const _tabs = tabs?.(data);
          return (
            <>
              <Grid container spacing={1}>
                <Grid item xs={12} md={12} lg={9}>
                  <Paper className="flex flex-wrap justify-center md:justify-start h-full gap-8 p-4 md:p-8">
                    <div className="w-full">
                      <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
                        <Typography
                          variant="h5"
                          className="font-bold"
                          gutterBottom
                          color="primary"
                        >
                          {summaryHeader(data)}
                        </Typography>

                        <div className="flex justify-end items-start">
                          <Button
                            className="border-2"
                            size="small"
                            variant="outlined"
                            aria-describedby={"action-popover"}
                            onClick={handleLoanActionOpenButton}
                            endIcon={<Icon>expand_more</Icon>}
                          >
                            <b>More</b>
                          </Button>

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
                              {summaryActions?.map((action, index) => (
                                <>
                                  {(
                                    action?.status
                                      ? action?.status?.includes(
                                          data?.status?.value
                                        ) ||
                                        action?.status?.includes(
                                          data?.status?.code
                                        )
                                      : data?.status?.active
                                  ) ? (
                                    <AuthUserUIPermissionRestrictor
                                      permissions={action.permissions}
                                    >
                                      <ListItemButton
                                        key={index}
                                        onClick={action.action}
                                        disablePadding
                                        disabled={action.disabled}
                                      >
                                        <ListItemText>
                                          {action.name}
                                        </ListItemText>
                                      </ListItemButton>
                                    </AuthUserUIPermissionRestrictor>
                                  ) : null}
                                </>
                              ))}
                            </List>
                          </Popover>
                        </div>
                      </div>
                      <hr></hr>
                      <Box mt={3} />
                      {contentBeforeSummary?.(data)}
                      <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
                        {summaryAside?.(data)?.map(({ label, value }) => (
                          <div
                            key={label}
                            className="inline-grid gap-1 grid-cols-2 mb-4"
                          >
                            <Typography fontWeight={700} color="textSecondary">
                              {label}
                            </Typography>

                            <Typography fontWeight={700}>{value}</Typography>
                          </div>
                        ))}
                      </div>

                      <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
                        {sum?.map(({ label, value }) => (
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
                      {contentAfterSummary?.(data)}
                    </div>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={12} lg={3}>
                  <Paper className="flex flex-wrap justify-center md:justify-start h-full gap-8 p-4 md:p-8">
                    <div>
                      <Typography
                        variant="h5"
                        className="font-bold mb-4 uppercase"
                        gutterBottom
                        color="primary"
                      >
                        {clientQueryResult?.data?.displayName ||
                          clientQueryResult?.data?.clients?.displayName}
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
                {_tabs?.map(
                  (tab, index) =>
                    tab?.name && (
                      <AuthUserUIPermissionRestrictor
                        permissions={tab.permissions}
                        validateAll={tab.validateAllPermissions}
                        negateValidation={tab.negatePermissionsValidation}
                        key={tab?.name}
                        value={index}
                        label={tab?.name}
                      >
                        {(params) => {
                          return <Tab {...params} />;
                        }}
                      </AuthUserUIPermissionRestrictor>
                    )
                )}
              </Tabs>
              <Divider className="mb-3" style={{ marginTop: -1 }} />
              {_tabs?.[activeTab]?.content}
            </>
          );
        }}
      </LoadingContent>
    </>
  );
}

ClientXLeadTabDetails.defaultProps = {
  defaultTab: 0,
};

export default ClientXLeadTabDetails;
