import { Button, ButtonBase, Chip, Icon, Paper } from "@mui/material";
import PageHeader from "common/PageHeader";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import SearchTextField from "common/SearchTextField";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import { nxDocumentConfigurationApi } from "./DocumentConfigurationStoreQuerySlice";
import DynamicTable from "common/DynamicTable";
import { useEffect, useMemo } from "react";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import useDataRef from "hooks/useDataRef";

function DocumentConfigurationList(props) {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { q, offset, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(q, {
    wait: 200,
    enableReInitialize: true,
  });

  const { data, isLoading, isError, refetch } =
    nxDocumentConfigurationApi.useGetDocumentConfigurationsQuery({
      offset,
      limit,
    });

  const tableInstance = usePaginationSearchParamsTable({
    manualPagination: true,
    columns,
    data: data?.pageItems,
    dataCount: data?.totalFilteredRecords,
  });

  const dataRef = useDataRef({ tableInstance });

  useEffect(() => {
    dataRef.current.tableInstance.setGlobalFilter(debouncedQ);
  }, [dataRef, debouncedQ]);

  return (
    <>
      <PageHeader
        title="Document Configurations"
        breadcrumbs={[
          {
            name: "Document Configurations",
            to: RouteEnum.DOCUMENT_CONFIGURATIONS,
          },
          { name: "List" },
        ]}
      >
        <Button
          endIcon={<Icon>add</Icon>}
          onClick={() => navigate(RouteEnum.DOCUMENT_CONFIGURATIONS_ADD)}
        >
          Add Document Configuration
        </Button>
      </PageHeader>
      <Paper className="p-4">
        <div className="flex items-center flex-wrap mb-4">
          <SearchTextField
            placeholder="Search item list"
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
                generatePath(RouteEnum.DOCUMENT_CONFIGURATIONS_EDIT, {
                  id: row.original.id,
                })
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default DocumentConfigurationList;

const columns = [
  { Header: "Name", accessor: "name" },
  { Header: "Description", accessor: "description" },
  {
    Header: "Type",
    accessor: "globalEntityType",
  },
  {
    Header: "Status",
    accessor: "disabled",
    width: 60,
    Cell: ({ value }) => (
      <Chip
        className="w-full"
        variant="outlined-opaque"
        color={!value ? "success" : "error"}
        label={!value ? "Enabled" : "Disabled"}
      />
    ),
  },
];
