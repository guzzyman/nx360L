import { Button, Paper, Typography, Tabs, Tab, Grid, ButtonBase, Divider, Icon } from "@mui/material";
import PageHeader from "common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { nimbleX360JournalEntriesApi } from "./JournalEntriesStoreQuerySlice";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import JournalEntryTransactionDetails from "./JournalEntryTransactionDetails";
import { useState } from "react";
import { parseDateToString } from "common/Utils";
import JournalEntryReverseTransaction from "./JournalEntryReverseTransaction";

function JournalEntryDetail(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const { data, isLoading, isError, refetch } =
    nimbleX360JournalEntriesApi.useJournalEntryDetailQuery(id);
  const [openModal, setOpenModal] = useState(false);

  const journalTransactionResult = data?.pageItems;

  const tabs = [
    {
      name: "JOURNAL ENTRY TRANSACTION DETAIL ",
      content: (<JournalEntryTransactionDetails
        data={data}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase} />),
    },
  ];

  return (
    <>
      <PageHeader
        title="Journal Entry Details"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Accounting", to: RouteEnum.ACCOUNTING },
          { name: "Journal Entry" },
          {
            name: "View Transaction",
          },
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <div className="max-w-full flex justify-center">
            {openModal && (
              <JournalEntryReverseTransaction
                title="Reverse Journal Entry Transaction"
                open={openModal}
                onClose={() => setOpenModal(false)}
              />
            )}
            <div className="w-full">
              <Paper className="max-w-full p-4 md:p-4 mb-4">
                <div className="flex items-center justify-end gap-2 my-0">
                  <Button variant="outlined" endIcon={<Icon>stop</Icon>} onClick={() => setOpenModal(true)}>
                    Reverse Transaction
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Office:
                    </Typography>
                    <Typography variant={"h6"}>{journalTransactionResult?.[0]?.officeName}</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Transaction Date:
                    </Typography>
                    <Typography variant={"h6"}>
                      {parseDateToString(journalTransactionResult?.[0]?.transactionDate)}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Created By:
                    </Typography>
                    <Typography variant={"h6"}>
                      {journalTransactionResult?.[0]?.createdByUserName}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Created On:
                    </Typography>
                    <Typography variant={"h6"}>
                      {parseDateToString(journalTransactionResult?.[0]?.createdDate)}
                    </Typography>
                  </Grid>
                </div>
              </Paper>
              <Paper className="p-4 md:p-4 mb-4">
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
            </div>
          </div>
        )}
      </LoadingContent>
    </>
  );
}

export default JournalEntryDetail;
