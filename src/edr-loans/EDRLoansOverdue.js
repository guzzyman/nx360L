import { ButtonBase, Paper } from "@mui/material";
import { useNavigate, generatePath, useSearchParams } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import {
  formatNumberToCurrency,
  formatTableDate,
  urlSearchParamsExtractor,
} from "common/Utils";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import { useMemo } from "react";
import useDebouncedState from "hooks/useDebouncedState";
import SearchTextField from "common/SearchTextField";
import useAuthUser from "hooks/useAuthUser";
import ClientXLeadLoanStatusChip from "client-x-lead/ClientXLeadLoanStatusChip";
import PageHeader from "common/PageHeader";
import { Box } from "@mui/system";

function EDRLoansOverdue(props) {
  const { staffId } = useAuthUser();

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

  const { q, offset } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });
  const { data, isLoading, isError, refetch } =
    nimbleX360CRMClientApi.useGetCRMClientLoansQuery({
      offset,
      limit: 1000,
      sqlSearch: `l.loan_status_id in (700)`,
      ...(debouncedQ
        ? {
            displayName: debouncedQ,
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
    <Box>
      <PageHeader
        title="Overpaid Loans"
        breadcrumbs={
          [
            //   { name: "CRM", to: RouteEnum.CRM_CLIENTS },
            //   { name: "Clients" },
          ]
        }
      />
      <Paper className="p-4">
        <div>
          <div className="flex mb-5">
            <div className="flex-1" />
            <SearchTextField
              size="small"
              value={q}
              onChange={(e) =>
                setSearchParams(
                  { ...extractedSearchParams, q: e.target.value },
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
                  generatePath(RouteEnum.CRM_CLIENTS_LOAN_DETAILS, {
                    id: row.original.clientId,
                    loanId: row.original.id,
                  })
                ),
            })}
          />
        </div>
      </Paper>
    </Box>
  );
}

export default EDRLoansOverdue;

const columns = [
  // { Header: "Client ID", accessor: "clientId" },
  { Header: "Client Name", accessor: "clientName" },
  { Header: "Loan ID", accessor: "accountNo" },
  { Header: "Loan Type", accessor: (row) => row?.loanType?.value },
  {
    Header: "Product",
    accessor: (row) => row?.loanProductName,
  },
  {
    Header: "Amount",
    accessor: (row) =>
      row?.principal ? `₦${formatNumberToCurrency(row?.principal)}` : "-----",
  },
  {
    Header: "Channel",
    accessor: (row) => row?.activationChannel?.name,
  },

  {
    Header: "Date",
    accessor: (row) =>
      row?.timeline?.submittedOnDate
        ? formatTableDate(new Date(...row?.timeline?.submittedOnDate))
        : null,
  },
  {
    Header: "Status",
    width: 200,
    accessor: (row) => <ClientXLeadLoanStatusChip status={row?.status} />,
  },
];
