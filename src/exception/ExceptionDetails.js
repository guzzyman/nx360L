import { useState } from "react";
import { Divider, Paper, Tab, Tabs, Typography } from "@mui/material";
import BackButton from "common/BackButton";
import PageHeader from "common/PageHeader";
import LoadingContent from "common/LoadingContent";
import { RouteEnum } from "common/Constants";
import { useParams } from "react-router";
import { sequestExceptionApi } from "./ExceptionStoreQuerySlice";
import ExceptionStatusChip from "./ExceptionStatusChip";
// import { parseDateToString } from "common/Utils";
import ExceptionDetailsHistory from "./ExceptionDetailsHistory";
import ExceptionDetailsDiscuss from "./ExceptionDetailsDiscuss";
import ExceptionDetailsFile from "./ExceptionDetailsFile";
import * as dfn from "date-fns";

function ExceptionDetails(props) {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState(0);

  const exceptionQueryResult = sequestExceptionApi.useGetExceptionDetailsQuery(id);

  const exceptionDetails = exceptionQueryResult.data?.data?.exceptionDetails;

  const tabs = [
    {
      name: "HISTORY",
      content: (
        <ExceptionDetailsHistory exceptionQueryResult={exceptionQueryResult} />
      ),
    },
    {
      name: "DISCOURSE",
      content: (
        <ExceptionDetailsDiscuss exceptionQueryResult={exceptionQueryResult} />
      ),
    },
    {
      name: "FILES",
      content: <ExceptionDetailsFile exceptionQueryResult={exceptionQueryResult} />,
    },
  ];

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "Sequest", to: RouteEnum.SEQUEST_EXCEPTION },
          { name: "Exception", to: RouteEnum.SEQUEST_EXCEPTION },
        ]}
      />
      <LoadingContent
        loading={exceptionQueryResult.isLoading}
        error={exceptionQueryResult.isError}
        onReload={exceptionQueryResult.refetch}
      >
        {() => (
          <>
            <Paper className="p-4 md:p-8 mb-4">
              <div className="flex items-center gap-4">
                <Typography variant="h6" className="font-bold" gutterBottom>
                  {exceptionDetails?.creatorName}
                </Typography>
                <ExceptionStatusChip status={exceptionDetails?.status} />
              </div>
              <Divider className="my-4" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[
                  {
                    label: "Exception ID:",
                    value: exceptionDetails?.exceptionId,
                  },
                  {
                    label: "Exception Name:",
                    value: exceptionDetails?.title,
                  },
                  {
                    label: "Category:",
                    value: exceptionDetails?.category,
                  },
                  {
                    label: "Sub Category:",
                    value: exceptionDetails?.subCategory,
                  },
                  {
                    label: "Responsible Person:",
                    value: exceptionDetails?.responsiblePerson,
                  },
                  {
                    label: "Submitted Date:",
                    value:
                      dfn.format(
                        new Date(exceptionDetails?.dateCreated),
                        "dd MMM yyyy"
                      ) && dfn.format(
                        new Date(exceptionDetails?.dateCreated),
                        "dd MMM yyyy"
                      ),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="">
                    <Typography variant="body2" className="text-text-secondary">
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
                Exception Engagements
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
        )}
      </LoadingContent>
    </>
  );
}

export default ExceptionDetails;
