import { Button, Paper, Typography, Icon, ButtonBase } from "@mui/material";
import { Link, useNavigate, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import {
  formatNumberToCurrency,
  formatTableDate,
  parseDateToString,
} from "common/Utils";
import { ClientXLeadSavingsDepositTypeDeEnum } from "./ClientXLeadConstants";
import { useMemo } from "react";
import ClientXLeadStatusChip from "./ClientXLeadStatusChip";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function ClientXLeadFixedDepositList(props) {
  const { id, active, fixedDepositQueryResult, addRoute, detailsRoute } = props;

  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = fixedDepositQueryResult;

  const fixedDepositData = useMemo(
    () =>
      data?.savingsAccounts?.filter(
        (e) =>
          e.depositType.id ===
            ClientXLeadSavingsDepositTypeDeEnum.FIXED_DEPOSIT ||
          e.depositType.id ===
            ClientXLeadSavingsDepositTypeDeEnum.RECURRING_FIXED_DEPOSIT
      ),
    [data?.savingsAccounts]
  );
  console.log("fixedDepositData", fixedDepositData);
  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: fixedDepositData,
    manualPagination: false,
    totalPages: fixedDepositData?.length,
  });

  return (
    <Paper className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Investment
        </Typography>

        {active && (
          <AuthUserUIPermissionRestrictor
            permissions={[UIPermissionEnum.READ_RECURRINGDEPOSITACCOUNT]}
          >
            <Button
              endIcon={<Icon>add</Icon>}
              variant="outlined"
              component={Link}
              to={generatePath(addRoute, { id })}
            >
              New Investment
            </Button>
          </AuthUserUIPermissionRestrictor>
        )}

        {active && (
          <AuthUserUIPermissionRestrictor
            permissions={[UIPermissionEnum.READ_RECURRINGDEPOSITACCOUNT]}
          >
            <Button
              endIcon={<Icon>add</Icon>}
              variant="outlined"
              component={Link}
              to={generatePath(
                RouteEnum.CRM_CLIENT_REOCCURRING_FIXED_DEPOSIT_ADD,
                { id }
              )}
            >
              New Reccurring Investment
            </Button>
          </AuthUserUIPermissionRestrictor>
        )}
      </div>
      <AuthUserUIPermissionRestrictor
        permissions={[UIPermissionEnum.READ_FIXEDDEPOSITACCOUNT]}
      >
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () =>
              navigate(
                generatePath(
                  row.original.depositType.id ===
                    ClientXLeadSavingsDepositTypeDeEnum.FIXED_DEPOSIT
                    ? detailsRoute
                    : RouteEnum.CRM_CLIENTS_REOCCURRING_FIXED_DEPOSIT_DETAILS,
                  {
                    id,
                    fixedDepositId: row.original.id,
                  }
                )
              ),
          })}
        />
      </AuthUserUIPermissionRestrictor>
    </Paper>
  );
}

export default ClientXLeadFixedDepositList;

const columns = [
  { Header: "Wallet ID", accessor: "accountNo", width: 100 },
  {
    Header: "Product",
    accessor: (row) => row?.productName,
  },
  {
    Header: "Amount",
    accessor: (row) =>
      row?.accountBalance
        ? `₦${formatNumberToCurrency(row?.accountBalance)}`
        : "₦0",
    width: 100,
  },
  // {
  //   Header: "Account Type",
  //   accessor: (row) => row?.accountType?.value,
  //   width: 200,
  // },
  {
    Header: "Deposit Type",
    accessor: (row) => row?.depositType?.value,
    width: 200,
  },
  {
    Header: "Submitted Date",
    width: 100,
    accessor: (row) =>
      row?.timeline?.submittedOnDate
        ? parseDateToString(row?.timeline?.submittedOnDate)
        : null,
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <ClientXLeadStatusChip status={value} />,
    width: 150,
  },
];
