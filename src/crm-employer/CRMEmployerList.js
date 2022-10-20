import { useMemo } from "react";
import { Button, Icon, Paper, ButtonBase } from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import { useNavigate, useSearchParams, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { nimbleX360CRMEmployerApi } from "./CRMEmployerStoreQuerySlice";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import CRMEmployerStatusChip from "./CRMEmployerStatusChip";
// import CRMEmployerStatusChip from "./CRMEmployerStatusChip";

function CRMEmployerList(props) {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        name: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { name, offset, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(name, {
    wait: 1000,
    enableReInitialize: true,
  });

  const { data, isFetching, isError, refetch } =
    nimbleX360CRMEmployerApi.useGetCRMEmployersQuery({
      offset,
      limit,
      selectOnlyParentEmployer: true,
      ...(debouncedQ
        ? {
            name: debouncedQ,
            // firstName: debouncedQ,
            // lastName: debouncedQ,
          }
        : {}),
    });

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.pageItems,
    manualPagination: true,
    dataCount: data?.totalFilteredRecords,
  });

  return (
    <>
      <PageHeader
        title="Employers"
        breadcrumbs={[
          { name: "CRM", to: RouteEnum.CRM_EMPLOYER },
          { name: "EMPLOYER" },
        ]}
      >
        <Button
          endIcon={<Icon>add</Icon>}
          onClick={() => navigate(RouteEnum.CRM_EMPLOYER_ADD)}
        >
          Add Employer
        </Button>
      </PageHeader>
      <Paper className="grid gap-4 p-4">
        <div className="flex">
          <div className="flex-1" />
          <SearchTextField
            size="small"
            value={name}
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
          loading={isFetching}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () =>
              navigate(
                generatePath(RouteEnum.CRM_EMPLOYER_DETAILS, {
                  id: row.original.id,
                })
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default CRMEmployerList;

const columns = [
  { Header: "Name", accessor: "name"},
  {
    Header: "Employer Type",
    accessor: (row) => row?.clientType?.name,
  },
  {
    Header: "Industry",
    accessor: (row) => row?.industry?.name,
  },
  {
    Header: "Office Type",
    accessor: (row) => (row?.parent?.id ? "Branch" : "Head Office"),
  },
  {
    Header: "Active",
    accessor: (row) => <CRMEmployerStatusChip status={row?.active} />,
  },
];
