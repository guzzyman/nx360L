import { Divider, Paper, Typography } from "@mui/material";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import PageHeader from "common/PageHeader";
import { useParams } from "react-router-dom";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import EDRTransactionDetailsNotes from "./EDRTransactionDetailsNotes";
import EDRTransactionStatusChip from "./EDRTransactionStatusChip";
import CurrencyTypography from "common/CurrencyTypography";

function EDRTransactionDetailsTransactionDetailsScaffold(props) {
  const {
    title,
    breadcrumbs,
    summary,
    actions,
    children,
    useGetEDRTransactionQuery,
    queryArgs,
    status,
  } = props;

  const { tid } = useParams();

  const { data, isLoading, isError, refetch } = useGetEDRTransactionQuery({
    edrId: tid,
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
                  {data?.employeeNumber}
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
            {children?.(data) || <EDRTransactionDetailsNotes />}
          </>
        )}
      </LoadingContent>
    </>
  );
}

EDRTransactionDetailsTransactionDetailsScaffold.defaultProps = {
  breadcrumbs: [],
  useGetEDRTransactionQuery: nxEDRTransactionApi.useGetEDRTransactionQuery,
  status: (data) => data?.status,
  summary: (data) => [
    { label: "Employer", value: data?.employerName },
    { label: "Employee Name", value: data?.employeeName },
    { label: "Loan Type", value: data?.elementName },
    { label: "Staff ID", value: data?.employeeNumber },
    { label: "Ref ID", value: data?.refId },
    { label: "Period", value: data?.period?.join("-") },
    {
      label: "Deduction Amount",
      value: <CurrencyTypography>{data?.deductionAmount}</CurrencyTypography>,
    },
  ],
};

export default EDRTransactionDetailsTransactionDetailsScaffold;
