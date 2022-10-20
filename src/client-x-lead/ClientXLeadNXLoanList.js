import {Paper, ButtonBase } from "@mui/material";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import {
  formatNumberToCurrency,
} from "common/Utils";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import { RouteEnum, UIPermissionEnum } from "common/Constants";

import { format } from "date-fns";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { generatePath, useNavigate } from "react-router-dom";


function ClientXLeadNXLoanList(props) {
  const { id, active, loansQueryResult, addRoute, detailsRoute } = props;

  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = loansQueryResult;

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.data,
    manualPagination: false,
    totalPages: data?.loanAccounts,
  });

  return (
    <>
     <Paper className="p-4">
      <AuthUserUIPermissionRestrictor
        permissions={[UIPermissionEnum.READ_LOAN]}
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
                  RouteEnum.CRM_LEADS_LOAN_DETAILS_PENDING_VALIDATION,
                  {
                    id,
                    loanId: row?.original?.LoanAccountId,
                  }
                )
              ),
          })}
        />
      </AuthUserUIPermissionRestrictor>
    </Paper>    
    </>

  );
}

export default ClientXLeadNXLoanList;

const columns = [
  { Header: "Loan ID", accessor: "LoanAccountId", width: 100 },
  {
    Header: "Amount",
    accessor: (row) =>
      row?.LoanAmount
        ? `₦${formatNumberToCurrency(row?.LoanAmount)}`
        : "-----",
    width: 200,
  },
  {
    Header: "Loan Category",
    accessor: (row) => row?.LoanCategory,
    width: 200,
  },
  {
    Header: "Status",
    accessor: (row) => row?.LoanStatus,
    width: 200,
  },
  {
    Header: "Submitted Date",
    width: 150,
    accessor: (row) =>
      row?.LoanCreationDate
        ? format(new Date(row?.LoanCreationDate), "PPpp")
        : null,
  }
];
