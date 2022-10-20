import {
  Chip,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import EDRTransactionDetailsScaffold from "./EDRTransactionDetailsScaffold";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import { useSnackbar } from "notistack";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EDRTransactionUploadBreakdownList from "./EDRTransactionUploadBreakdownList";
import useAsyncUI from "hooks/useAsyncUI";

function EDRTransactionUnProcessedDetails(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const confirmAsyncUI = useAsyncUI();

  const [processEDRTransactionsMutation, processEDRTransactionsMutationResult] =
    nxEDRTransactionApi.useProcessEDRTransactionsMutation();
  const [rejectEDRTransactionsMutation, rejectEDRTransactionsMutationResult] =
    nxEDRTransactionApi.useRejectEDRTransactionsMutation();

  async function handleProcessEDRTransaction(details) {
    if (
      !(await confirmAsyncUI.open({
        context: { title: "Confirm Process" },
      }))
    ) {
      return;
    }
    try {
      const data = await processEDRTransactionsMutation({
        transId: details?.uniqueId,
      }).unwrap();
      const isSuccess = data?.httpStatusCode < 300;
      enqueueSnackbar(data?.defaultUserMessage, {
        variant: isSuccess ? "success" : "error",
      });
      navigate(RouteEnum.EDR_UNPROCESSED);
    } catch (error) {
      enqueueSnackbar(`Failed to Process EDRs`, { variant: "error" });
    }
  }

  async function handleRejectEDRTransaction(details) {
    if (
      !(await confirmAsyncUI.open({
        context: { title: "Confirm Reject" },
      }))
    ) {
      return;
    }
    try {
      const data = await rejectEDRTransactionsMutation({
        uniqueId: details?.uniqueId,
      }).unwrap();
      enqueueSnackbar(data?.defaultUserMessage || "EDR Rejected Successful", {
        variant: "success",
      });
      navigate(RouteEnum.EDR_UNPROCESSED);
    } catch (error) {
      enqueueSnackbar(`Failed to Reject EDRs`, { variant: "error" });
    }
  }

  return (
    <>
      <EDRTransactionDetailsScaffold
        title="Unprocessed Details"
        queryArgs={queryArgs}
        breadcrumbs={[
          {
            name: "Unprocessed",
            to: RouteEnum.EDR_UNPROCESSED,
          },
          {
            name: "Details",
          },
        ]}
        status={(data) => data?.status}
        summary={(data) => []}
        actions={(data) => (
          <>
            <LoadingButton
              disabled={processEDRTransactionsMutationResult.isLoading}
              loading={processEDRTransactionsMutationResult.isLoading}
              loadingPosition="end"
              endIcon={<></>}
              onClick={() => handleProcessEDRTransaction(data)}
            >
              Process EDR
            </LoadingButton>
            <LoadingButton
              color="error"
              disabled={rejectEDRTransactionsMutationResult.isLoading}
              loading={rejectEDRTransactionsMutationResult.isLoading}
              loadingPosition="end"
              endIcon={<></>}
              onClick={() => handleRejectEDRTransaction(data)}
            >
              Reject EDR
            </LoadingButton>
            {confirmAsyncUI.render(({ context }) => (
              <Dialog open fullWidth maxWidth="xs">
                <DialogTitle className="font-bold text-center">
                  {context?.title}
                </DialogTitle>
                <DialogActions className="justify-center">
                  <Button
                    variant="outlined"
                    onClick={() => confirmAsyncUI.resolve(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="error"
                    onClick={() => confirmAsyncUI.resolve(true)}
                  >
                    Accept
                  </Button>
                </DialogActions>
              </Dialog>
            ))}
          </>
        )}
      >
        {(data) => (
          <>
            <EDRTransactionUploadBreakdownList
              queryArgs={{
                ...queryArgs,
                uniqueId: data?.uniqueId,
              }}
            />
            <EDRTransactionUploadExcelList transId={data?.uniqueId} />
          </>
        )}
      </EDRTransactionDetailsScaffold>
    </>
  );
}

export default EDRTransactionUnProcessedDetails;

function EDRTransactionUploadExcelList(props) {
  const [{ offset, limit }, setTablePaginationConfig] = useState(
    TABLE_PAGINATION_DEFAULT
  );

  const uploadedEDRTransactionsQueryResult =
    nxEDRTransactionApi.useGetUploadedEDRTransactionsQuery({
      transId: props.transId,
      offset,
      limit,
    });

  const uploadedEDRTransactions = uploadedEDRTransactionsQueryResult?.data;

  const uploadedTableInstance = useTable({
    columns,
    data: uploadedEDRTransactions?.pageItems,
    manualPagination: true,
    pageCount:
      uploadedEDRTransactions?.totalFilteredRecords > limit
        ? Math.ceil(uploadedEDRTransactions?.totalFilteredRecords / limit)
        : 1,
  });

  useEffect(() => {
    setTablePaginationConfig({
      offset: uploadedTableInstance.state.pageIndex * limit,
      limit: uploadedTableInstance.state.pageSize,
    });
  }, [
    limit,
    uploadedTableInstance.state.pageIndex,
    uploadedTableInstance.state.pageSize,
  ]);

  return (
    <Paper className="p-4 mb-4">
      <div className="flex items-center gap-4 mb-4">
        <Typography className="font-bold">Uploaded EDR</Typography>
      </div>
      <DynamicTable
        instance={uploadedTableInstance}
        loading={uploadedEDRTransactionsQueryResult.isLoading}
        error={uploadedEDRTransactionsQueryResult.isError}
        onReload={uploadedEDRTransactionsQueryResult.refetch}
      />
    </Paper>
  );
}

const queryArgs = { status: "PENDING" };

const columns = [
  { Header: "Employer Name", accessor: "employerName" },
  { Header: "Employee Count", accessor: "id" },
  { Header: "Loan Type", accessor: "elementName" },
  { Header: "Deducted Amount", accessor: "deductionAmount" },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => (
      <Chip
        className="w-full"
        variant="outlined-opaque"
        // color={value === "loanProduct.active" ? "success" : "error"}
        label={value}
      />
    ),
  },
];
