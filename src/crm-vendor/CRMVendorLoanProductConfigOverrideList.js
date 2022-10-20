import {
  Paper,
  Typography,
  ButtonBase,
  Button,
  Icon,
  IconButton,
} from "@mui/material";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import { nimbleX360CRMVendorApi } from "./CRMVendorStoreQuerySlice";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import CRMVendorLoanProductConfigOverrideAddEdit from "./CRMVendorLoanProductConfigOverrideAddEdit";
import CurrencyTypography from "common/CurrencyTypography";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import { UIPermissionEnum } from "common/Constants";

function CRMVendorLoanProductConfigOverrideList(props) {
  const { id } = useParams();
  const [configId, setConfigId] = useState(-1);

  const { data, isLoading, isError, refetch } =
    nimbleX360CRMVendorApi.useGetVendorLoanProductOverridesQuery(id);

  const columns = useMemo(
    () => [
      {
        Header: "Product",
        accessor: (row) => row?.loanProductName,
      },
      {
        Header: "Interest Rate",
        accessor: (row) => `${row?.interestRate} %`,
      },
      {
        Header: "Amount",
        accessor: (row) => (
          <CurrencyTypography>{row?.principal}</CurrencyTypography>
        ),
      },
      {
        Header: "DSR (%)",
        accessor: (row) => `${row?.dsr}`,
      },
      {
        Header: "Tenure",
        accessor: (row) => `${row?.termFrequency}`,
      },
      {
        Header: "Actions",
        accessor: (row) => (
          <IconButton
            color="primary"
            onClick={() => {
              setConfigId(row.id);
            }}
          >
            <Icon>edit</Icon>
          </IconButton>
        ),
      },
    ],
    []
  );

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data,
    manualPagination: true,
    totalPages: data?.totalFilteredRecords,
  });

  return (
    <Paper className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Loan Product Config
        </Typography>
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.CREATE_ACCOUNTTRANSFER_CHECKER]}
        >
          <Button
            endIcon={<Icon>add</Icon>}
            variant="outlined"
            onClick={() => {
              setConfigId(0);
            }}
          >
            Set Loan Product Config
          </Button>
        </AuthUserUIPermissionRestrictor>
      </div>

      <DynamicTable
        instance={tableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
      />
      {configId > -1 && (
        <CRMVendorLoanProductConfigOverrideAddEdit
          open
          configId={configId}
          onClose={() => setConfigId(-1)}
        />
      )}
    </Paper>
  );
}

export default CRMVendorLoanProductConfigOverrideList;
