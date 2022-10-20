import { useMemo } from "react";
import { Button, Icon, Paper, ButtonBase, Chip } from "@mui/material";
import {
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
  UIPermissionEnum,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import { useNavigate, useSearchParams, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { nimbleX360CRMVendorApi } from "./CRMVendorStoreQuerySlice";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import { CRMClientStatusColorEnum } from "crm-client/CRMClientConstants";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
// import CRMEmployerStatusChip from "./CRMEmployerStatusChip";

function CRMVendorList(props) {
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

  const { data, isLoading, isError, refetch } =
    nimbleX360CRMVendorApi.useGetCRMVendorsQuery({
      offset,
      limit,
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
        title="Vendor"
        breadcrumbs={[
          { name: "CRM", to: RouteEnum.CRM_VENDOR },
          { name: "VENDOR" },
        ]}
      >
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.CREATE_ADHOC]}
        >
          <Button
            endIcon={<Icon>add</Icon>}
            onClick={() => navigate(RouteEnum.CRM_VENDOR_ADD)}
          >
            Add Vendor
          </Button>
        </AuthUserUIPermissionRestrictor>
      </PageHeader>
      <AuthUserUIPermissionRestrictor
        permissions={[
          UIPermissionEnum.READ_Vendor,
          UIPermissionEnum.READ_VENDOR,
        ]}
      >
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
            loading={isLoading}
            error={isError}
            onReload={refetch}
            RowComponent={ButtonBase}
            rowProps={(row) => ({
              onClick: () =>
                navigate(
                  generatePath(RouteEnum.CRM_VENDOR_DETAILS, {
                    id: row.original.id,
                  })
                ),
            })}
          />
        </Paper>
      </AuthUserUIPermissionRestrictor>
    </>
  );
}

export default CRMVendorList;

const columns = [
  {
    Header: "Full Name",
    accessor: "fullname",
  },
  { Header: "External Id", accessor: "accountNo" },
  {
    Header: "Office Name",
    accessor: "officeName",
  },
  {
    Header: "Status",
    accessor: (row) => (
      <Chip
        variant="outlined-opaque"
        color={CRMClientStatusColorEnum[row?.status?.id]}
        label={row?.status?.value}
      />
    ),
  },
];
