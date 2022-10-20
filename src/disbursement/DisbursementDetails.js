import { DatePicker, LoadingButton } from "@mui/lab";
import { Paper, TextField, Typography } from "@mui/material";
import { ReconciliationApi } from "api/ReconciliationApi";
import BackButton from "common/BackButton";
import DynamicTable from "common/DynamicTable";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import useTable from "hooks/useTable";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import * as dfn from "date-fns";
import { DateConfig } from "common/Constants";
import { useMemo } from "react";
import DisbursementStatusChip from "./DisbursementStatus";
import CurrencyTypography from "common/CurrencyTypography";
import { useSnackbar } from "notistack";

function DisbursementDetails(props) {
  const { enqueueSnackbar } = useSnackbar();

  const { id: uniqueId } = useParams();

  const [reconcileStatementMutation, reconcileStatementMutationResult] =
    ReconciliationApi.useCreateReconciliationDisbursementMutation();

  const [loanQuery, loanQueryResult] =
    ReconciliationApi.useLazyGetReconciliationLoanDisbursementsQuery();

  const today = useMemo(() => new Date(), []);

  const formik = useFormik({
    initialValues: {
      startPeriod: today,
      endPeriod: today,
    },
    validationSchema: yup.lazy((values) =>
      yup.object({
        startPeriod: yup
          .date()
          .label("Start Date")
          .max(values.endPeriod || today)
          .required(),
        endPeriod: yup
          .date()
          .label("End Date")
          .min(values.startPeriod || today)
          .max(today)
          .required(),
      })
    ),
    onSubmit: async (values) => {
      loanQuery({
        params: {
          locale: DateConfig.LOCALE,
          dateFormat: DateConfig.HYPHEN_MM_dd_yyyy,
          startPeriod: dfn.format(
            values.startPeriod,
            DateConfig.HYPHEN_MM_dd_yyyy
          ),
          endPeriod: dfn.format(values.endPeriod, DateConfig.HYPHEN_MM_dd_yyyy),
        },
      });
    },
  });

  async function reconcileStatement() {
    try {
      const data = await reconcileStatementMutation({
        data: {
          locale: DateConfig.LOCALE,
          dateFormat: DateConfig.HYPHEN_MM_dd_yyyy,
          startPeriod: dfn.format(
            formik.values.startPeriod,
            DateConfig.HYPHEN_MM_dd_yyyy
          ),
          endPeriod: dfn.format(
            formik.values.endPeriod,
            DateConfig.HYPHEN_MM_dd_yyyy
          ),
          uniqueId,
        },
      }).unwrap();
      enqueueSnackbar(
        data?.defaultUserMessage || "Statement Reconciled Successful",
        {
          variant: "success",
        }
      );
    } catch (error) {
      enqueueSnackbar(
        error?.data?.errors?.[0]?.defaultUserMessage ||
          error?.data?.defaultUserMessage ||
          "Failed to Reconcile Statement",
        { variant: "error" }
      );
    }
  }

  const bankStatmentQueryResult =
    ReconciliationApi.useGetReconciliationDisbursementBankStatementQuery({
      params: { uniqueId },
    });

  const bankStatmentTableInstance = useTable({
    columns: bankStatmentColumns,
    data: bankStatmentQueryResult?.data,
  });

  const nxTableInstance = useTable({
    columns: nxColumns,
    data: loanQueryResult?.data,
  });

  return (
    <>
      <PageHeader beforeTitle={<BackButton />} title={`#${uniqueId}`} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
        <Paper className="p-4 lg:p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <DatePicker
              label="Start Date"
              value={formik.values.startPeriod}
              maxDate={formik.values.endPeriod}
              disableFuture
              onChange={(newValue) => {
                formik.setFieldValue("startPeriod", newValue);
              }}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
            <DatePicker
              label="End Date"
              minDate={formik.values.startPeriod}
              disableFuture
              value={formik.values.endPeriod}
              onChange={(newValue) => {
                formik.setFieldValue("endPeriod", newValue);
              }}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </div>
        </Paper>
        <Paper>
          <div className="flex items-center p-2 gap-2 h-14">
            <Typography>Bank Statement</Typography>
          </div>
          <DynamicTable
            instance={bankStatmentTableInstance}
            loading={bankStatmentQueryResult.isLoading}
            error={bankStatmentQueryResult.isError}
            onReload={bankStatmentQueryResult.refetch}
          />
        </Paper>
        <Paper>
          <div className="flex items-center p-2 gap-2 h-14">
            <Typography>NX360</Typography>
            <div className="flex-1" />
            <LoadingButton
              loading={loanQueryResult.isLoading || loanQueryResult.isFetching}
              loadingPosition="start"
              onClick={formik.handleSubmit}
            >
              Retrieve Records
            </LoadingButton>
          </div>
          <DynamicTable
            instance={nxTableInstance}
            loading={loanQueryResult.isLoading || loanQueryResult.isFetching}
            error={loanQueryResult.isError}
            onReload={formik.handleSubmit}
          />
        </Paper>
        <div className="px-4 lg:p-6 lg:col-span-2 flex items-center justify-center">
          <LoadingButton
            size="large"
            loading={
              reconcileStatementMutationResult.isLoading ||
              reconcileStatementMutationResult.isFetching
            }
            loadingPosition="start"
            onClick={reconcileStatement}
          >
            Reconcile Statement
          </LoadingButton>
        </div>
      </div>
    </>
  );
}

export default DisbursementDetails;

const bankStatmentColumns = [
  { Header: "Date", accessor: "date" },
  { Header: "Reference ID", accessor: "referenceId" },
  { Header: "Narration", accessor: "narration" },
  {
    Header: "Transaction Amount",
    accessor: "transactionAmount",
    Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <DisbursementStatusChip status={value} />,
  },
];

const nxColumns = [
  { Header: "Client ID", accessor: "clientId" },
  { Header: "Disbursement Date", accessor: "date" },
  { Header: "Bank Name", accessor: "bank" },
  { Header: "Account Number", accessor: "accountNumber" },
  { Header: "Client Name", accessor: "clientName" },
  {
    Header: "Loan Amount",
    accessor: "loanAmount",
    Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
  },
  {
    Header: "Status",
    accessor: "reconciliationStatus",
    Cell: ({ value }) => <DisbursementStatusChip status={value} />,
  },
];
