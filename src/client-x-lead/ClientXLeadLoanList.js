import { Button, Paper, Typography, Icon, ButtonBase } from "@mui/material";
import { Link, useNavigate, generatePath } from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import {
  formatNumberToCurrency,
  getUserErrorMessage,
  parseDateToString,
} from "common/Utils";

import ClientXLeadLoanStatusChip from "./ClientXLeadLoanStatusChip";
import { useConfirmDialog } from "react-mui-confirm";
import { useSnackbar } from "notistack";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { useEffect } from "react";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import SearchTextField from "common/SearchTextField";
import { format } from "date-fns";

function ClientXLeadLoanList(props) {
  const { id, active, loansQueryResult, addRoute, detailsRoute } = props;

  const navigate = useNavigate();
  const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();

  const { data, isLoading, isError, refetch } = loansQueryResult;

  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.loanAccounts,
    manualPagination: false,
    totalPages: data?.loanAccounts,
  });

  const [
    sendLetterOfIndeptedness,
    { data: letterData, isSuccess, isError: sendLetterIsError, error },
  ] = nimbleX360CRMClientApi.useLazyGetCRMClientIndebtednessQuery();

  const handleSendLetter = (id) =>
    confirm({
      title:
        "Are you sure you want to Email Letter of Indebtedness/Non-Indebtedness?",
      onConfirm: () => {
        try {
          sendLetterOfIndeptedness(id);
        } catch (error) {
          enqueueSnackbar(
            getUserErrorMessage(error.data.errors) || `Letter Failed to send`,
            { variant: "error" }
          );
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(
        letterData?.defaultUserMessage || `Letter Successfully sent`,
        {
          variant: "success",
        }
      );
    }
    if (sendLetterIsError) {
      enqueueSnackbar(
        getUserErrorMessage(error.data.errors) || `Letter Failed to send`,
        { variant: "error" }
      );
    }
    // eslint-disable-next-line
  }, [isSuccess, sendLetterIsError]);

  return (
    <Paper className="p-4">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div className="flex gap-4 flex-wrap">
          <Typography variant="h6" className="font-bold">
            Loans
          </Typography>
          {active && (
            <AuthUserUIPermissionRestrictor
              permissions={[UIPermissionEnum.CREATE_LOAN]}
            >
              <Button
                endIcon={<Icon>add</Icon>}
                variant="outlined"
                component={Link}
                to={generatePath(addRoute, { id })}
              >
                New Loan
              </Button>
            </AuthUserUIPermissionRestrictor>
          )}
        </div>

        <div className="flex gap-4 flex-wrap">
          <AuthUserUIPermissionRestrictor
            permissions={[UIPermissionEnum.READ_EMAIL_CAMPAIGN]}
          >
            <Button onClick={() => handleSendLetter(id)}>
              Email Letter of Indebtedness/Non-Indebtedness
            </Button>
          </AuthUserUIPermissionRestrictor>

          <SearchTextField
            // onChange={(e) =>
            //   setSearchParams(
            //     { ...extractedSearchParams, q: e.target.value },
            //     { replace: true }
            //   )
            // }
            value={tableInstance.state.globalFilter}
            onChange={(e) => {
              tableInstance.setGlobalFilter(e.target.value);
            }}
          />
        </div>
      </div>
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
                  row?.original?.sourceValidated
                    ? RouteEnum.CRM_LEADS_LOAN_DETAILS_PENDING_VALIDATION
                    : detailsRoute,
                  {
                    id,
                    loanId: row?.original?.sourceValidated
                      ? row.original.externalId
                      : row.original.id,
                  }
                )
              ),
          })}
        />
      </AuthUserUIPermissionRestrictor>
    </Paper>
  );
}

export default ClientXLeadLoanList;

const columns = [
  { Header: "Loan ID", accessor: "accountNo", width: 100 },
  {
    Header: "Product",
    accessor: (row) => row?.productName,
  },
  {
    Header: "Amount",
    accessor: (row) =>
      row?.originalLoan
        ? `₦${formatNumberToCurrency(row?.originalLoan)}`
        : "-----",
    width: 200,
  },
  {
    Header: "Channel",
    accessor: (row) => row?.activationChannel?.name,
    width: 200,
  },
  {
    Header: "Loan Type",
    accessor: (row) => (row?.isTopup ? "Topup" : "New Loan"),
    width: 200,
  },
  {
    Header: "Submitted Date",
    width: 150,
    accessor: (row) =>
      row?.timeline?.submittedOnDateTimestamp
        ? format(new Date(row?.timeline?.submittedOnDateTimestamp), "PPpp")
        : null,
  },
  {
    Header: "Status",
    accessor: (row) =>
      !row?.sourceValidated ? (
        row?.inArrears ? (
          <ClientXLeadLoanStatusChip
            variant="outlined-opaque"
            color={"error"}
            label={row?.status?.value}
          />
        ) : (
          <ClientXLeadLoanStatusChip status={row?.status} />
        )
      ) : null,
    width: 200,
  },
];
