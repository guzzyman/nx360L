import { Button, ButtonBase, Icon, Paper, TextField } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import PageHeader from "common/PageHeader";
import SearchTextField from "common/SearchTextField";
import DisbursementStatus from "./DisbursementStatus";
import { ReconciliationApi } from "api/ReconciliationApi";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import { DatePicker, LoadingButton } from "@mui/lab";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { urlSearchParamsExtractor } from "common/Utils";
import * as dfn from "date-fns";
import {
  DateConfig,
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
} from "common/Constants";
import useDebouncedState from "hooks/useDebouncedState";
import DisbursementUpload from "./DisbursementUpload";
import useToggle from "hooks/useToggle";
import { useSnackbar } from "notistack";
import CurrencyTypography from "common/CurrencyTypography";

function DisbursementList(props) {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isUpload, toggleUpload] = useToggle();

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        startPeriod: dfn.format(
          dfn.subDays(new Date(), 2),
          DateConfig.HYPHEN_MM_dd_yyyy
        ),
        endPeriod: dfn.format(new Date(), DateConfig.HYPHEN_MM_dd_yyyy),
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { q, offset, limit, startPeriod, endPeriod } = extractedSearchParams;

  const { startPeriodInstance, endPeriodInstance } = useMemo(
    () => ({
      startPeriodInstance: new Date(startPeriod),
      endPeriodInstance: new Date(endPeriod),
    }),
    [endPeriod, startPeriod]
  );

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const { data, isLoading, isError, refetch } =
    ReconciliationApi.useGetReconciliationDisbursementBankStatementSummaryQuery(
      {
        params: {
          offset,
          limit,
          locale: DateConfig.LOCALE,
          dateFormat: DateConfig.HYPHEN_MM_dd_yyyy,
          startPeriod,
          endPeriod:
            endPeriodInstance.getTime() < startPeriodInstance.getTime()
              ? startPeriod
              : endPeriod,
          ...(debouncedQ
            ? {
                // displayName: debouncedQ,
                // firstName: debouncedQ,
                // lastName: debouncedQ,
              }
            : {}),
        },
      }
    );

  const [
    downloadReconciliationDisbursementTemplateMutation,
    downloadReconciliationDisbursementTemplateMutationResult,
  ] = ReconciliationApi.useDownloadReconciliationDisbursementTemplateMutation();

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.pageItems,
  });

  function handleSetSearchParams(params) {
    setSearchParams({ ...extractedSearchParams, ...params }, { replace: true });
  }

  async function handleDownloadSample() {
    try {
      await downloadReconciliationDisbursementTemplateMutation({
        data: {
          fileName: "Disbursement Template",
          locale: DateConfig.LOCALE,
          dateFormat: DateConfig.HYPHEN_MM_dd_yyyy,
        },
      }).unwrap();
    } catch (error) {
      enqueueSnackbar(
        error?.data?.errors?.[0]?.defaultUserMessage ||
          "Failed to Download Disbursement Template",
        {
          variant: "error",
        }
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Disbursement"
        breadcrumbs={[{ name: "Home" }, { name: "Disbursement" }]}
      >
        <Button
          startIcon={
            <Icon className="material-icons-outlined">file_upload</Icon>
          }
          onClick={toggleUpload}
        >
          Upload Bank Statement
        </Button>
        <LoadingButton
          startIcon={
            <Icon className="material-icons-outlined">file_download</Icon>
          }
          variant="outlined"
          onClick={handleDownloadSample}
          loading={
            downloadReconciliationDisbursementTemplateMutationResult.isLoading
          }
          loadingPosition="end"
          endIcon={<></>}
        >
          Download Sample
        </LoadingButton>
      </PageHeader>
      <Paper className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <SearchTextField
            value={q}
            onChange={(e) =>
              setSearchParams(
                { ...extractedSearchParams, q: e.target.value },
                { replace: true }
              )
            }
          />
          <div className="flex-1" />
          <DatePicker
            label="Start Date"
            value={startPeriodInstance}
            maxDate={endPeriodInstance}
            disableFuture
            onChange={(newValue) => {
              handleSetSearchParams({
                startPeriod: dfn.format(newValue, DateConfig.HYPHEN_MM_dd_yyyy),
              });
            }}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
          <DatePicker
            label="End Date"
            minDate={startPeriodInstance}
            disableFuture
            value={endPeriodInstance}
            onChange={(newValue) => {
              handleSetSearchParams({
                endPeriod: dfn.format(newValue, DateConfig.HYPHEN_MM_dd_yyyy),
              });
            }}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
        </div>
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () =>
              navigate(
                generatePath(RouteEnum.DISBURSEMENTS_DETAILS, {
                  id: row.original.uniqueId,
                })
              ),
          })}
        />
      </Paper>
      <DisbursementUpload open={isUpload} onClose={toggleUpload} />
    </>
  );
}

export default DisbursementList;

const columns = [
  // { Header: "ID", accessor: "id" },
  { Header: "Client Name", accessor: "clientName" },
  { Header: "Date", accessor: (row) => row?.date?.join("-"), id: "date" },
  {
    Header: "Amount",
    accessor: "amount",
    Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
  },
  {
    Header: "Status",
    accessor: "reconciliationStatus",
    Cell: ({ value }) => <DisbursementStatus status={value} />,
  },
];
