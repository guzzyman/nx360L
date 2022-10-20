import { Paper, Typography, ButtonBase } from "@mui/material";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import {
  formatNumberToCurrency,
  formatNumberToCurrency2,
  formatTableDate,
  parseDateToString,
} from "common/Utils";
import ClientXLeadStatusChip from "./ClientXLeadStatusChip";
import { useNavigate, generatePath } from "react-router-dom";
import { ClientXLeadSavingsDepositTypeDeEnum } from "./ClientXLeadConstants";
import { useMemo } from "react";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import { UIPermissionEnum } from "common/Constants";

function ClientXLeadWalletList(props) {
  const { walletQueryResult, id, detailsRoute } = props;
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = walletQueryResult;
  const walletData = useMemo(
    () =>
      data?.savingsAccounts?.filter(
        (e) => e.depositType.id === ClientXLeadSavingsDepositTypeDeEnum.SAVING
      ),
    [data?.savingsAccounts]
  );

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: walletData,
    manualPagination: true,
    totalPages: data?.totalFilteredRecords,
  });

  return (
    <Paper className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Wallet
        </Typography>
      </div>

      <AuthUserUIPermissionRestrictor
        permissions={[UIPermissionEnum.READ_SAVINGSACCOUNT]}
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
                generatePath(detailsRoute, {
                  id,
                  walletId: row.original.id,
                })
              ),
          })}
        />
      </AuthUserUIPermissionRestrictor>
    </Paper>
  );
}

export default ClientXLeadWalletList;

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
        ? `₦${formatNumberToCurrency2(row?.accountBalance)}`
        : "₦0",
    width: 200,
  },
  // {
  //   Header: "Account Type",
  //   accessor: (row) => row?.accountType?.value,
  //   width: 200,
  // },
  // {
  //   Header: "Deposit Type",
  //   accessor: (row) => row?.depositType?.value,
  //   width: 200,
  // },
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
    width: 100,
  },
];
