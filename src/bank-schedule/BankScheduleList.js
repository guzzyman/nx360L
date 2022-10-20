import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { Button, Icon, Paper, ButtonBase } from "@mui/material";
import {
  dateLocaleFormat,
  dateMonths,
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import { useNavigate, useSearchParams, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { urlSearchParamsExtractor } from "common/Utils";
import { BankScheduleStoreQuerySlice } from "./BankScheduleStoreQuerySlice";
import { format } from "date-fns/esm";
import useDebouncedState from "hooks/useDebouncedState";
import BankScheduleAddDialog from "./BankScheduleAddDialog";
import { useSnackbar } from "notistack";

export default function BankScheduleList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openAddBankSchedule, setOpenAddBankSchedule] = useState(false);
  const [page, setPage] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        name: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { name, offset, limit } = extractedSearchParams;

  const [downloadBankScheduleSample, downloadBankScheduleSampleResult] =
    BankScheduleStoreQuerySlice.useLazyDownloadDocumentSampleQuery();

  async function handleDownloadBankScheduleSample() {
    try {
      await downloadBankScheduleSample();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to Download Template", { variant: "error" });
    }
  }

  const [debouncedQ] = useDebouncedState(name, {
    wait: 1000,
    enableReInitialize: true,
  });

  const { data, isLoading, isError, refetch } =
    BankScheduleStoreQuerySlice.useGetBankSchedulesQuery(
      useMemo(
        () => ({
          Page: page,
          PageSize: limit,
          ...(debouncedQ
            ? {
              SearchTerm: debouncedQ,
              // firstName: debouncedQ,
              // lastName: debouncedQ,
            }
            : {}),
        }),
        [page, limit, debouncedQ]
      )
    );

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.data?.records,
    manualPagination: true,
    dataCount: data?.data?.totalRecords,
  });

  useEffect(() => {
    setPage(tableInstance.state.pageIndex);
  }, [tableInstance.state.pageIndex, page]);

  console.log("tableInstance", tableInstance.state.pageIndex + 1);

  return (
    <>
      <PageHeader
        title="Bank Schedule"
        breadcrumbs={[{ name: "CRM", to: "/" }, { name: "Bank Schedule" }]}
      >
        <Button
          disabled={
            downloadBankScheduleSampleResult.isLoading ||
            downloadBankScheduleSampleResult.isFetching
          }
          onClick={() => handleDownloadBankScheduleSample()}
          variant="outlined"
          endIcon={<Icon>download</Icon>}
        >
          Download Template
        </Button>

        <Button
          variant="outlined"
          onClick={() => setOpenAddBankSchedule(true)}
          endIcon={<Icon>add</Icon>}
        >
          Upload Template
        </Button>
      </PageHeader>
      <Paper className="grid gap-4 p-4">
        <div className="flex">
          <div className="flex-1" />
          <SearchTextField
            size="small"
            value={name}
            placeholder="Employer Name , Bank Name, Fullname"
            onChange={(e) =>
              setSearchParams(
                { ...extractedSearchParams, name: e.target.value },
                { replace: true }
              )
            }
          />
        </div>
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          pageSize={30}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () => {
              if (row.original.status === "pending") {
                enqueueSnackbar("Bank Schedule is undergoing processing...", { variant: "info" })
              } else {
                navigate(
                  generatePath(RouteEnum.BANK_SCHEDULE_DETAILS, {
                    id: row.original.id,
                  })
                )
              }
            },
          })}
        />
      </Paper>
      {openAddBankSchedule && (
        <BankScheduleAddDialog
          open={openAddBankSchedule}
          onClose={() => setOpenAddBankSchedule(false)}
        />
      )}
    </>
  );
}

const columns = [
  // {
  //   Header: "Bank Schedule No.",
  //   accessor: "id",
  // },
  {
    Header: "Uploaded By",
    accessor: "uploadedByFullName",
  },
  {
    Header: "Uploaded Date",
    accessor: (row) =>
      row?.creationDate
        ? format(new Date(row?.creationDate), dateLocaleFormat.DATE_FORMAT)
        : null,
  },
  // {
  //   Header: "Employer",
  //   accessor: "employerName",
  // },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "State",
    accessor: "stateName",
  },
  {
    Header: "Bank Schedule Date",
    accessor: (row) => dateMonths[row?.month] + ", " + row?.year,
  },
];
