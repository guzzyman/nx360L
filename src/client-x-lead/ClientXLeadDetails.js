import { useState } from "react";
import { Avatar, Divider, Paper, Tab, Tabs, Typography } from "@mui/material";
import BackButton from "common/BackButton";
import PageHeader from "common/PageHeader";
import LoadingContent from "common/LoadingContent";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import { Lightbox } from "react-modal-image";

function ClientXLeadDetails(props) {
  const {
    breadcrumbName,
    breadcrumbTo,
    // id,
    detailsQueryResult,
    imageQueryResult,
    // loansQueryResult,
    name,
    summary,
    tabs,
    defaultTab,
    actions,
  } = props;
  const [activeTab, setActiveTab] = useState(defaultTab);

  const { data, isLoading, isError, refetch } = detailsQueryResult;

  const [openPreview, setOpenPreview] = useState(false);

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "CRM", to: breadcrumbTo },
          { name: breadcrumbName, to: breadcrumbTo },
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
              <Paper className="flex flex-wrap justify-center md:justify-start gap-8 p-4 md:p-8">
                <Avatar
                  onClick={() => setOpenPreview(true)}
                  src={imageQueryResult.data}
                  className="w-20 h-20 border-8 cursor-pointer"
                />
                <div>
                  <Typography
                    variant="h6"
                    className="font-bold mb-4 uppercase"
                    gutterBottom
                  >
                    {name?.(data)}
                  </Typography>
                  <div className="grid gap-3">
                    {summary?.(data)?.map(({ label, value }) => (
                      <div
                        key={label}
                        className="inline-grid gap-8 grid-cols-2"
                      >
                        {typeof label === "string" ? (
                          <Typography color="textSecondary">{label}</Typography>
                        ) : (
                          label
                        )}
                        {typeof value === "string" ? (
                          <Typography>{value}</Typography>
                        ) : (
                          value
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex items-end justify-end content-end gap-2 flex-wrap">
                  {actions}
                </div>
              </Paper>
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
      {openPreview && (
        <Lightbox
          // alt={data?.title}
          medium={imageQueryResult.data}
          large={imageQueryResult.data}
          onClose={() => setOpenPreview(false)}
        />
      )}
    </>
  );
}

ClientXLeadDetails.defaultProps = {
  defaultTab: 0,
};

export default ClientXLeadDetails;
