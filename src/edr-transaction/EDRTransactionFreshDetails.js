import { useMemo } from "react";
import { Paper, Typography, Divider, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DateConfig, RouteEnum } from "common/Constants";
import { useDropzone } from "react-dropzone";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import { useSnackbar } from "notistack";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { useNavigate, useParams } from "react-router-dom";
import CurrencyTypography from "common/CurrencyTypography";
import LoadingContent from "common/LoadingContent";
import EDRTransactionStatusChip from "./EDRTransactionStatusChip";
import PageHeader from "common/PageHeader";
import EDRTransactionFreshDetailsSingleRepayment from "./EDRTransactionFreshDetailsSingleRepayment";
import useToggle from "hooks/useToggle";

function EDRTransactionUnProcessedDetails(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { id } = useParams();

  const [isSingleRepaymentDialog, toggleSingleRepaymentDialog] = useToggle();

  const { data, isLoading, isError, refetch } =
    nxEDRTransactionApi.useGetEDRTransactionJournalEntryQuery({
      journalEntryId: id,
      ...queryArgs,
    });

  const [uploadEDRTransactionsMutation, uploadEDRTransactionsMutationResult] =
    nxEDRTransactionApi.useUploadEDRTransactionsMutation();

  const uploadResult = uploadEDRTransactionsMutationResult.data;
  const isUploadComplete = !!uploadResult?.completed;
  const uploadErrorData = useMemo(
    () =>
      isUploadComplete && uploadResult?.errorLog
        ? JSON.parse(uploadResult?.errorLog)
        : undefined,
    [isUploadComplete, uploadResult?.errorLog]
  );

  const errorTableInstance = useTable({
    columns: errorColumns,
    data: uploadErrorData,
  });

  const dropzone = useDropzone({
    accept: ".xls",
    onDropAccepted: async (files) => {
      try {
        const data = await uploadEDRTransactionsMutation({
          file: files[0],
          transid: id,
          locale: DateConfig.LOCALE,
          dateFormat: DateConfig.FORMAT,
        }).unwrap();
        if (data?.completed && !data?.errorLog) {
          navigate(RouteEnum.EDR);
          enqueueSnackbar(`EDRs Upload Successful`, { variant: "success" });
          return;
        }
        enqueueSnackbar(`Error Uploading EDRs`, { variant: "error" });
      } catch (error) {
        enqueueSnackbar(`Failed to Upload EDRs`, { variant: "error" });
      }
    },
  });

  return (
    <>
      <PageHeader
        title="EDR Transactions Details"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          {
            name: "EDR Transactions",
            to: RouteEnum.EDR,
          },
          {
            name: "Details",
          },
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <>
            <EDRTransactionFreshDetailsSingleRepayment
              id={id}
              open={isSingleRepaymentDialog}
              onClose={() => toggleSingleRepaymentDialog()}
            />
            <Paper className="p-4 mb-4">
              <div className="flex items-center flex-wrap gap-4">
                <Typography variant="h6" className="font-bold">
                  {data?.referenceNumber}
                </Typography>
                <EDRTransactionStatusChip status={data?.status} />
                <div className="flex-1" />
                <Button onClick={toggleSingleRepaymentDialog}>
                  Single Repayment
                </Button>
                <div {...dropzone.getRootProps()}>
                  <input {...dropzone.getInputProps()} />
                  <LoadingButton
                    disabled={uploadEDRTransactionsMutationResult.isLoading}
                    loading={uploadEDRTransactionsMutationResult.isLoading}
                    loadingPosition="end"
                    endIcon={<></>}
                  >
                    Upload EDR
                  </LoadingButton>
                </div>
              </div>
              <Divider className="my-4" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[
                  {
                    label: "Transaction ID",
                    value: data?.transactionId,
                  },
                  {
                    label: "Amount Remitted",
                    value: (
                      <CurrencyTypography>{data?.amount}</CurrencyTypography>
                    ),
                  },
                  { label: "FCMB Reference No", value: data?.referenceNumber },
                  {
                    label: "Transaction Date",
                    value: data?.transactionDate?.join("-"),
                  },
                ].map(({ label, value }) => (
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
            {!!uploadErrorData && (
              <Paper className="p-4 mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <Typography className="font-bold text-error-main">
                    Uploaded EDR Errors
                  </Typography>
                </div>
                <DynamicTable instance={errorTableInstance} />
              </Paper>
            )}
          </>
        )}
      </LoadingContent>
    </>
  );
}

export default EDRTransactionUnProcessedDetails;

const queryArgs = { status: "PENDING" };

const errorColumns = [{ Header: "Message", accessor: "message" }];
