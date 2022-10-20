import { Divider, Paper, Typography } from "@mui/material";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import PageHeader from "common/PageHeader";
import { useParams } from "react-router-dom";
import { nxEDRApi } from "./EDRStoreQuerySlice";
import EDRStatusChip from "./EDRStatusChip";
import CurrencyTypography from "common/CurrencyTypography";

function EDRDetails(props) {
  const {
    title,
    breadcrumbs,
    summary,
    actions,
    children,
    useGetEDRQuery,
    queryArgs,
    status,
  } = props;

  const { id } = useParams();

  const { data, isLoading, isError, refetch } = useGetEDRQuery({
    fcmbId: id,
    ...queryArgs,
  });

  const callbackProps = { data };

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          ...breadcrumbs?.(callbackProps),
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <>
            <Paper className="p-4 mb-4">
              <div className="flex items-center flex-wrap gap-4">
                <Typography variant="h6" className="font-bold">
                  {data?.uniqueId || data?.reference}
                </Typography>
                <EDRStatusChip status={status?.(callbackProps)} />
                <div className="flex-1" />
                {actions?.(callbackProps)}
              </div>
              <Divider className="my-4" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {summary?.(callbackProps)?.map(({ label, value }) => (
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
            {children?.(callbackProps)}
          </>
        )}
      </LoadingContent>
    </>
  );
}

EDRDetails.defaultProps = {
  breadcrumbs: () => [],
  useGetEDRQuery: nxEDRApi.useGetEDRInflowQuery,
  status: ({ data }) => data?.statusData?.code,
  summary: ({ data }) => [
    {
      label: "Transaction ID",
      value: data?.tranId,
    },
    {
      label: "Amount",
      value: <CurrencyTypography>{data?.tranAmount}</CurrencyTypography>,
    },
    { label: "Reference No", value: data?.reference },
    {
      label: "Transaction Date",
      value: data?.tranDate?.join("-"),
    },
    {
      label: "Value Date",
      value: data?.valueDate?.join("-"),
    },
    {
      label: "Entry Date",
      value: data?.createdDate?.join("-"),
    },
    {
      label: "Entry",
      value: data?.isManualEntry ? "MANUAL" : "SYSTEM",
    },
    {
      label: "Created By",
      value: data?.createdbyIdData?.username,
    },
    {
      label: "Description",
      value: data?.tranParticular,
    },
  ],
};

export default EDRDetails;
