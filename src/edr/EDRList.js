import { useMemo, useState, useEffect } from "react";
import { DatePicker } from "@mui/lab";
import {
  ButtonBase,
  CircularProgress,
  Icon,
  IconButton,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import {
  DateConfig,
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import SearchTextField from "common/SearchTextField";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import { nxEDRApi } from "./EDRStoreQuerySlice";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import { useSnackbar } from "notistack";
import CurrencyTypography from "common/CurrencyTypography";
import * as dfn from "date-fns";
import useDataRef from "hooks/useDataRef";
import EDRStatusChip from "./EDRStatusChip";

function EDRList(props) {
  const {
    title,
    breadcrumbs,
    columns,
    useGetEDRsQuery,
    defaultSearchParams,
    queryArgs,
    detailsRoutePath,
    actions,
    TableProps,
    tableHookProps,
  } = props;

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState(0);

  const [selectedEDRToDownload, setSelectedEDRToDownload] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        fromDate: dfn.format(
          activeTab ? dfn.subDays(new Date(), 2) : new Date(),
          DateConfig.HYPHEN_MM_dd_yyyy
        ),
        toDate: dfn.format(new Date(), DateConfig.HYPHEN_MM_dd_yyyy),
        ...TABLE_PAGINATION_DEFAULT,
        ...defaultSearchParams,
      }),
    [activeTab, defaultSearchParams, searchParams]
  );

  const { q, offset, limit, fromDate, toDate } = extractedSearchParams;
  const fromDateInstance = new Date(fromDate);
  const toDateInstance = new Date(toDate);

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const codeValuesQueryResult = nxEDRApi.useGetCodeValuesQuery(16);

  const [
    downloadEDRTransactionTemplateMutation,
    downloadEDRTransactionTemplateMutationResult,
  ] = nxEDRApi.useDownloadEDRInflowTemplateMutation();

  const { data, isFetching, isError, refetch } = useGetEDRsQuery({
    offset,
    limit,
    locale: DateConfig.LOCALE,
    dateFormat: DateConfig.HYPHEN_MM_dd_yyyy,
    fromDate,
    toDate:
      toDateInstance.getTime() < fromDateInstance.getTime() ? fromDate : toDate,
    ...(debouncedQ
      ? {
          // displayName: debouncedQ,
          // firstName: debouncedQ,
          // lastName: debouncedQ,
        }
      : {}),
    ...queryArgs,
  });

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.pageItems,
    manualPagination: true,
    dataCount: data?.totalFilteredRecords,
    defaultSearchParams,
    ...tableHookProps?.({ data }),
  });

  function handleSetSearchParams(params) {
    setSearchParams({ ...extractedSearchParams, ...params }, { replace: true });
  }

  async function handleDownloadEDRTransactionTemplate() {
    if (selectedEDRToDownload) {
      try {
        await downloadEDRTransactionTemplateMutation({
          clientTypeId: selectedEDRToDownload,
          fileName:
            codeValuesQueryResult?.data?.find(
              (edr) => edr.id === selectedEDRToDownload
            )?.name || "EDR",
        });
      } catch (error) {
        enqueueSnackbar("Failed to Download Template", { variant: "error" });
      }
    }
  }

  const dataRef = useDataRef({
    tableInstance,
    activeTab,
    extractedSearchParams,
    setSearchParams,
  });

  const callbackUIProps = { dataRef, ...dataRef.current };

  useEffect(() => {
    if (!activeTab) {
      const newParams = { ...dataRef.current.extractedSearchParams };
      delete newParams.fromDate;
      delete newParams.toDate;
      dataRef.current.setSearchParams(newParams);
    }
  }, [activeTab, dataRef]);

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          ...breadcrumbs?.(callbackUIProps),
        ]}
      />
      <Paper className="p-4">
        <div className="-mt-4 mb-4">
          <Tabs
            variant="fullWidth"
            value={activeTab}
            onChange={(_, value) => {
              setActiveTab(value);
            }}
          >
            <Tab label="TODAY" />
            <Tab label="HISTORY" />
          </Tabs>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* <div className="flex items-center w-52">
            <TextField
              size="small"
              select
              fullWidth
              label="EDR Template"
              value={selectedEDRToDownload}
              onChange={(e) => setSelectedEDRToDownload(e.target.value)}
            >
              {codeValuesQueryResult?.data?.map((edr) => (
                <MenuItem key={edr.id} value={edr.id}>
                  {edr.name}
                </MenuItem>
              ))}
            </TextField>
            {downloadEDRTransactionTemplateMutationResult.isLoading ? (
              <div className="ml-4">
                <CircularProgress size={20} />
              </div>
            ) : (
              <IconButton
                disabled={!selectedEDRToDownload}
                color="primary"
                onClick={handleDownloadEDRTransactionTemplate}
                // download={
                //   codeValuesQueryResult?.data?.find(
                //     (edr) => edr.id == selectedEDRToDownload
                //   )?.name || "EDR"
                // }
                // component="a"
                // href={`${process.env.REACT_APP_API_URL}/edr/downloadtemplate?clientTypeId=${selectedEDRToDownload}`}
              >
                <Icon>download</Icon>
              </IconButton>
            )}
          </div> */}
          <SearchTextField
            size="small"
            value={q}
            onChange={(e) =>
              setSearchParams(
                { ...extractedSearchParams, q: e.target.value },
                { replace: true }
              )
            }
          />
          <div className="flex-1" />
          {activeTab === 1 && (
            <>
              <DatePicker
                label="Start Date"
                value={fromDateInstance}
                disableFuture
                onChange={(newValue) => {
                  handleSetSearchParams({
                    fromDate: dfn.format(
                      newValue,
                      DateConfig.HYPHEN_MM_dd_yyyy
                    ),
                  });
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
              <DatePicker
                label="End Date"
                minDate={fromDateInstance}
                disableFuture
                value={toDateInstance}
                onChange={(newValue) => {
                  handleSetSearchParams({
                    toDate: dfn.format(newValue, DateConfig.HYPHEN_MM_dd_yyyy),
                  });
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </>
          )}
          {actions?.(callbackUIProps)}
        </div>
        <DynamicTable
          instance={tableInstance}
          loading={isFetching}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
          {...TableProps?.(callbackUIProps)}
          rowProps={function (row) {
            return {
              onClick: () => {
                navigate(
                  generatePath(detailsRoutePath, {
                    id: row.original.id,
                  })
                );
              },
              ...TableProps?.(callbackUIProps)?.rowProps?.(...arguments),
            };
          }}
        />
      </Paper>
    </>
  );
}

const columns = [
  {
    Header: "Transaction ID",
    accessor: "tranId",
  },
  {
    Header: "Amount",
    accessor: "tranAmount",
    Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
  },
  { Header: "Reference No", accessor: "reference" },
  {
    Header: "Transaction Date",
    accessor: (row) => row?.tranDate?.join("-"),
  },
  {
    Header: "Value Date",
    accessor: (row) => row?.valueDate?.join("-"),
  },
  {
    Header: "Entry Date",
    accessor: (row) => row?.createdDate?.join("-"),
  },
  {
    Header: "Entry",
    accessor: (row) => (row?.isManualEntry ? "MANUAL" : "SYSTEM"),
  },
  {
    Header: "Status",
    accessor: "statusData",
    Cell: ({ value }) => <EDRStatusChip status={value?.code} />,
  },
];

EDRList.defaultProps = {
  breadcrumbs: () => [],
  columns,
  useGetEDRsQuery: nxEDRApi.useGetEDRInflowsQuery,
};

export default EDRList;
