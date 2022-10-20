import Modal from "common/Modal";
import React from "react";
import { Paper, ButtonBase, Typography } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import useTable from "hooks/useTable";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { useParams } from "react-router-dom";

export default function RecoveryManageRescheduleLoanDetailsPreview(props) {
  const { onClose, ...rest } = props;
  const { id } = useParams();
  const { data, isLoading, isError, refetch } =
    nimbleX360CRMClientApi.useGetCRMClientRescheduleLoanDetailsQuery({
      id,
      command: "previewLoanReschedule",
    });
  console.log("data", data);
  const tableInstance = useTable({
    columns,
    data: data?.periods,
    manualPagination: false,
    hideRowCounter: true,
    totalPages: data?.periods?.length,
  });

  return (
    <Modal onClose={onClose} size="lg" title="Repayment Schedule" {...rest}>
      <DynamicTable
        instance={tableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        pageSize={20}
        // renderPagination={() => null}
        RowComponent={ButtonBase}
      />
    </Modal>
  );
}

const columns = [
  {
    Header: "#",
    accessor: (row) => row?.period,
    width: 50,
    Footer: "Total",
  },
  {
    Header: "Date",
    accessor: (row) => parseDateToString(row?.fromDate),
    Footer: "Total",
  },
  {
    Header: "Principal Due",
    accessor: (row) => `${formatNumberToCurrency(row?.principalDue)}`,
    Footer: "Total",
  },
  {
    Header: "Balance Of Loan",
    accessor: (row) =>
      `${formatNumberToCurrency(row?.principalLoanBalanceOutstanding)}`,
    // width: 150,
    Footer: "Total",
  },
  {
    Header: "Interest",
    accessor: (row) => `${formatNumberToCurrency(row?.interestDue)}`,
    // width: 150,
    Footer: "Total",
  },
  {
    Header: "Fees",
    accessor: (row) => `${formatNumberToCurrency(row?.feeChargesDue)}`,
    // width: 150,
    Footer: "Total",
  },
  {
    Header: "Penalties",
    accessor: (row) => `${formatNumberToCurrency(row?.penaltyChargesDue)}`,
    // width: 150,
    Footer: "Total",
  },
  {
    Header: "Outstanding",
    accessor: (row) =>
      `${formatNumberToCurrency(row?.totalOutstandingForPeriod)}`,
    width: 150,
    Footer: "Total",
  },
];
