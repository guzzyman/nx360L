import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import {
  Button,
  Icon,
  Paper,
  ButtonBase,
  IconButton,
  Tooltip,
} from "@mui/material";
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
import { ussdPrequalificationQuerySlice } from "./UssdPrequalificationStoreQuerySlice";
import { format } from "date-fns/esm";
import useDebouncedState from "hooks/useDebouncedState";
import USSDPrequalificationAddEdit from "./USSDPrequalificationAddEdit";

export default function UssdPrequalificationList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openAddEditUSSDPrequalification, setOpenAddEditUSSDPrequalification] =
    useState(false);
  const [USSDPrequalification, setUSSDPrequalification] = useState(null);
  const [page, setPage] = useState(0);

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        name: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { name, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(name, {
    wait: 1000,
    enableReInitialize: true,
  });

  const { data, isLoading, isError, refetch } =
    ussdPrequalificationQuerySlice.useGetUSSDPrequalificationsQuery(
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

  const columns = useMemo(
    () => [
      {
        Header: "Product Name",
        accessor: "productName",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "Start Date",
        accessor: (row) =>
          row?.startDate
            ? format(new Date(row?.startDate), dateLocaleFormat.DATE_FORMAT)
            : null,
      },
      {
        Header: "End Date",
        accessor: (row) =>
          row?.endDate
            ? format(new Date(row?.endDate), dateLocaleFormat.DATE_FORMAT)
            : null,
      },
      {
        Header: "Frequency",
        accessor: "frequency",
      },
      {
        Header: "Created By",
        accessor: (row) =>
          row?.creationDate
            ? format(new Date(row?.creationDate), dateLocaleFormat.DATE_FORMAT)
            : null,
      },
      // {
      //   Header: "Status",
      //   accessor: "status",
      // },
      {
        Header: "Action",
        accessor: (row) => (
          <div>
            <Tooltip title="View History">
              <IconButton
                onClick={() => {
                  navigate(
                    generatePath(
                      RouteEnum.ADMINISTRATION_PRODUCTS_USSD_PREQUALIFICATION_HISTORY,
                      {
                        id: row.id,
                      }
                    )
                  );
                }}
              >
                <Icon>preview</Icon>
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit">
              <IconButton
                onClick={() => {
                  setOpenAddEditUSSDPrequalification(true);
                  setUSSDPrequalification(row);
                }}
              >
                <Icon>edit</Icon>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.data,
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
        title="USSD Prequalification"
        breadcrumbs={[
          { name: "CRM", to: "/" },
          { name: "USSD Prequalification" },
        ]}
      >
        <Button
          variant="outlined"
          onClick={() => {
            setOpenAddEditUSSDPrequalification(true);
            setUSSDPrequalification(null);
          }}
          endIcon={<Icon>add</Icon>}
        >
          Create New
        </Button>
      </PageHeader>
      <Paper className="grid gap-4 p-4">
        <div className="flex">
          <div className="flex-1" />
          <SearchTextField
            size="small"
            value={name}
            placeholder="Search Item List"
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
        />
      </Paper>
      {openAddEditUSSDPrequalification && (
        <USSDPrequalificationAddEdit
          open={openAddEditUSSDPrequalification}
          ussPrequalificationInstance={USSDPrequalification}
          onClose={() => setOpenAddEditUSSDPrequalification(false)}
        />
      )}
    </>
  );
}
