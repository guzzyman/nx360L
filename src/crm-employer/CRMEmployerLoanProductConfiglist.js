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
import { nimbleX360CRMEmployerApi } from "./CRMEmployerStoreQuerySlice";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import CRMEmployerSetLoanProductConfig from "./CRMEmployerSetLoanProductConfig";
import CurrencyTypography from "common/CurrencyTypography";

function CRMEmployerLoanProductConfiglist(props) {
  const { id } = useParams();
  const [configId, setConfigId] = useState(-1);

  const { data, isLoading, isError, refetch } =
    nimbleX360CRMEmployerApi.useGetEmployerLoanProductsQuery(id);

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
        <Button
          endIcon={<Icon>add</Icon>}
          variant="outlined"
          onClick={() => {
            setConfigId(0);
          }}
        >
          Set Loan Product Config
        </Button>
      </div>

      <DynamicTable
        instance={tableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
      />
      {configId > -1 && (
        <CRMEmployerSetLoanProductConfig
          open
          configId={configId}
          onClose={() => setConfigId(-1)}
        />
      )}
    </Paper>
  );
}

export default CRMEmployerLoanProductConfiglist;
