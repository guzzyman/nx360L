import { ButtonBase, Paper } from "@mui/material";
import { useNavigate, generatePath } from "react-router-dom";
import DynamicTable from "common/DynamicTable";
import { parseDateToString } from "common/Utils";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { RouteEnum } from "common/Constants";

import useTable from "hooks/useTable";
import PageHeader from "common/PageHeader";

function RecoveryManageRescheduleLoan(props) {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } =
    nimbleX360CRMClientApi.useGetCRMClientRescheduleLoanQuery({
      command: "pending",
    });

  const tableInstance = useTable({
    columns,
    data: data,
    manualPagination: true,
    dataCount: data?.length,
  });

  return (
    <div>
      <PageHeader
        title="Reschedule Loan"
        breadcrumbs={[
          {
            name: "Home",
            to: "/",
          },
          { name: "Reschedule Loan List" },
        ]}
     />
      <Paper className="p-2">
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () =>
              navigate(
                generatePath(RouteEnum.RESCHEDULE_LOAN_DETAIL, {
                  id: row.original.id,
                })
              ),
          })}
        />
      </Paper>
    </div>
  );
}

export default RecoveryManageRescheduleLoan;

const columns = [
  { Header: "Client", accessor: "clientName" },
  { Header: "Reschedule Request#", accessor: "id" },
  { Header: "Loan account number", accessor: "loanAccountNumber" },
  {
    Header: "Reschedule From",
    accessor: (row) => parseDateToString(row?.rescheduleFromDate),
  },
  {
    Header: "Reschedule Reason",
    accessor: (row) => row?.rescheduleReasonCodeValue?.name,
  },
];
