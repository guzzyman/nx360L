import { Paper, ButtonBase } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";
import useTable from "hooks/useTable";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";

function CRMClientWalletStandingInstructions({ clientQueryResult }) {
  const { clientId, walletId } = useParams();

  const { data, isLoading, isError, refetch } =
    nimbleX360CRMClientApi.useGetClientStadingInstructionsQuery(
      useMemo(
        () => ({
          clientId,
          clientName: clientQueryResult?.data?.displayName,
          dateFormat: "dd MMMM yyyy",
          fromAccountId: walletId,
          fromAccountType: 2,
          limit: 14,
          locale: "en",
          offset: 0,
        }),
        [clientQueryResult?.data, clientId, walletId]
      )
    );

  const tableInstance = useTable({
    columns,
    data: data?.pageItems,
    manualPagination: true,
    totalPages: data?.totalFilteredRecords,
  });

  return (
    <div className="pb-10">
      <Paper className="p-4">
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
        />
      </Paper>
    </div>
  );
}

export default CRMClientWalletStandingInstructions;

const columns = [
  {
    Header: "Client",
    accessor: (row) => row?.fromClient?.displayName + "-" + row?.fromClient?.id,
    width: 150,
  },
  {
    Header: "From Account",
    accessor: (row) =>
      row?.fromAccount?.accountNo + " " + row?.fromAccountType?.value,
  },

  {
    Header: "Beneficiary",
    accessor: (row) => row?.toClient?.displayName,
  },

  {
    Header: "To Account",
    accessor: (row) =>
      row?.toAccount?.accountNo + " " + row?.toAccountType?.value,
  },
  {
    Header: "Amount",
    accessor: (row) =>
      `${row?.instructionType?.value}/${formatNumberToCurrency(
        row?.amount || 0
      )}`,
  },

  {
    Header: "Validity",
    accessor: (row) =>
      parseDateToString(row?.validFrom) +
      "to" +
      parseDateToString(row?.validTill),
  },
];
