import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import {
  Paper,
  ButtonBase,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import {
  dateLocaleFormat,
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import { generatePath, useParams } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import { ussdPrequalificationQuerySlice } from "./UssdPrequalificationStoreQuerySlice";
import { format } from "date-fns/esm";
import BackButton from "common/BackButton";
import { formatNumberToCurrency } from "common/Utils";
import { DatePicker } from "@mui/lab";

export default function UssdPrequalificationHistory() {
  const { id } = useParams();
  const [page, setPage] = useState(0);

  const { limit } = TABLE_PAGINATION_DEFAULT;

  const { data, isLoading, isError, refetch } =
    ussdPrequalificationQuerySlice.useGetUSSDPrequalificationsQuery(
      useMemo(
        () => ({
          id,
          Page: page,
          PageSize: limit,
        }),
        [page, limit, id]
      )
    );

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.data,
    manualPagination: true,
    dataCount: data?.data?.length,
  });

  useEffect(() => {
    setPage(tableInstance.state.pageIndex);
  }, [tableInstance.state.pageIndex, page]);

  console.log("tableInstance", tableInstance.state.pageIndex + 1);

  return (
    <>
      <PageHeader
        title={`${data?.state || ""}`}
        breadcrumbs={[
          { name: "CRM", to: "/" },
          {
            name: "USSD Prequalification",
            to: generatePath(
              RouteEnum.ADMINISTRATION_PRODUCTS_USSD_PREQUALIFICATION
            ),
          },
          {
            name: "USSD Prequalification History",
          },
        ]}
      >
        <BackButton />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 mt-5">
        <Paper className="p-5">
          <Typography>
            <b>State:</b> {data?.state}
          </Typography>
          <Typography>
            <b>Last Run:</b>
          </Typography>
        </Paper>
        <Paper className="p-3">
          <div className="gap-2 grid grid-cols-1 md:grid-cols-3 ">
            <DatePicker
              label="Start Date"
              inputFormat="yyyy-MM-dd"
              disablePast
              // helperText={!!formik.touched.startDate && formik.errors.startDate}
              // onChange={(newValue) => {
              //   formik.setFieldValue("startDate", new Date(newValue));
              // }}
              fullWidth
              className="mb-5"
              // value={formik.values?.startDate}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <DatePicker
              label="End Date"
              inputFormat="yyyy-MM-dd"
              disablePast
              // helperText={!!formik.touched.startDate && formik.errors.startDate}
              // onChange={(newValue) => {
              //   formik.setFieldValue("startDate", new Date(newValue));
              // }}
              fullWidth
              className="mb-5"
              // value={formik.values?.startDate}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <div className="flex items-center ">
              <Button>Retrieve Record</Button>
            </div>
          </div>
        </Paper>
      </div>
      <Paper className="grid gap-4 p-4">
        <Typography>Prequalified Offer</Typography>
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          pageSize={30}
          RowComponent={ButtonBase}
        />
      </Paper>
    </>
  );
}

const columns = [
  {
    Header: "Date Initiated",
    accessor: (row) =>
      row?.dateInitiated
        ? format(new Date(row?.dateInitiated), dateLocaleFormat.DATE_FORMAT)
        : null,
  },
  {
    Header: "Client ID",
    accessor: "clientId",
  },
  {
    Header: "Client Name",
    accessor: "clientName",
  },
  {
    Header: "Proposed Amount",
    accessor: (row) => formatNumberToCurrency(row?.proposedAmount),
  },
  {
    Header: "Approved Amount",
    accessor: (row) => formatNumberToCurrency(row?.approvedAmount),
  },
  {
    Header: "Offer Status",
    accessor: "status",
  },
  {
    Header: "Date Confirmed",
    accessor: (row) =>
      row?.dateConfirmed
        ? format(new Date(row?.dateConfirmed), dateLocaleFormat.DATE_FORMAT)
        : null,
  },
];
