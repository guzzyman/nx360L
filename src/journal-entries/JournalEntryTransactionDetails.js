import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
// import { useNavigate } from "react-router-dom";
import JournalTransactionSummary from "./JournalTransactionSummary";
import { useState } from "react";

function JournalEntryTransactionDetails(props) {
    const { isLoading, isError, refetch, ButtonBase, data } = props;    
    const [selectedRowData, setSelectedRowData] = useState(null);
    const tableInstance = useTable({
        columns,
        data: data?.pageItems,
        manualPagination: true,
        totalPages: data?.totalFilteredRecords,
        hideRowCounter: true,
    });

    // const navigate = useNavigate();

    return (
        <>
            {!!selectedRowData ? (
                <JournalTransactionSummary
                    title="Journal Transaction Summary"
                    data={selectedRowData}
                    onClose={() => setSelectedRowData(null)}
                />
            ) : undefined}
            <DynamicTable
                instance={tableInstance}
                loading={isLoading}
                error={isError}
                onReload={refetch}
                RowComponent={ButtonBase}
                rowProps={(row) => ({
                    onClick: () => setSelectedRowData(row?.original)
                })}
            />
        </>
    );
}

export default JournalEntryTransactionDetails;

const columns = [
    { Header: "Entry ID", accessor: "id" },
    {
        Header: "Transaction Type",
        accessor: (row) => row?.glAccountType?.value,
    },
    {
        Header: "Account",
        accessor: "glAccountName",
    },
    {
        Header: "Debit",
        accessor: (row) => row?.entryType?.value === "DEBIT" ? row?.amount : '--',
    },
    {
        Header: "Credit",
        accessor: (row) => row?.entryType?.value === "CREDIT" ? row?.amount : '--',
    },
];
