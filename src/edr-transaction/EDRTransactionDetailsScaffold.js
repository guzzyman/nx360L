import { Divider, Paper, Typography } from "@mui/material";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import PageHeader from "common/PageHeader";
import { useParams } from "react-router-dom";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import EDRTransactionStatusChip from "./EDRTransactionStatusChip";
import CurrencyTypography from "common/CurrencyTypography";

function EDRTransactionDetailsScaffold(props) {
  const {
    title,
    breadcrumbs,
    summary,
    actions,
    children,
    useGetEDRTransactionJournalEntryQuery,
    queryArgs,
    status,
  } = props;

  const { id } = useParams();

  const { data, isLoading, isError, refetch } =
    useGetEDRTransactionJournalEntryQuery({
      journalEntryId: id,
      ...queryArgs,
    });

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          ...breadcrumbs,
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <>
            <Paper className="p-4 mb-4">
              <div className="flex items-center flex-wrap gap-4">
                <Typography variant="h6" className="font-bold">
                  {data?.referenceNumber}
                </Typography>
                <EDRTransactionStatusChip status={status?.(data)} />
                <div className="flex-1" />
                {actions?.(data)}
              </div>
              <Divider className="my-4" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {summary?.(data)?.map(({ label, value }) => (
                  <div key={label} className="">
                    <Typography variant="body2" className="text-text-secondary">
                      {label}
                    </Typography>
                    {typeof value === "object" ? (
                      value
                    ) : (
                      <Typography>
                        {value !== undefined && value !== null && value !== ""
                          ? value
                          : "-"}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            </Paper>
            {children?.(data)}
          </>
        )}
      </LoadingContent>
    </>
  );
}

EDRTransactionDetailsScaffold.defaultProps = {
  breadcrumbs: [],
  useGetEDRTransactionJournalEntryQuery:
    nxEDRTransactionApi.useGetEDRTransactionJournalEntryQuery,
  status: (data) => data?.status,
  summary: (data) => [
    {
      label: "Transaction ID",
      value: data?.transactionId,
    },
    {
      label: "Amount Remitted",
      value: <CurrencyTypography>{data?.amount}</CurrencyTypography>,
    },
    { label: "FCMB Reference No", value: data?.referenceNumber },
    {
      label: "Transaction Date",
      value: data?.transactionDate?.join("-"),
    },
  ],
};

export default EDRTransactionDetailsScaffold;
