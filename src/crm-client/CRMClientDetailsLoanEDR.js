import { Paper, TextField, MenuItem, Chip, ButtonBase } from "@mui/material";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { renderRow } from "common/StandardTable";
import { TABLE_PAGINATION_DEFAULT } from "common/Constants";
import { useEffect, useState } from "react";
import { nxClientDetailsLoanEdrApi } from "./CRMClientDetailsLoanEDRStoreQuerySlice";
import CRMClientDetailsLoanEDRAction from "./CRMClientDetailsLoanEDRAction";
import CurrencyTypography from "common/CurrencyTypography";
import {
  ClientXLeadXEDRLoanPaymentTypeEnum,
  ClientXLeadXEDRLoanStatusEnum,
} from "client-x-lead-x-edr/ClientXLeadXEDRLoanConstants";
import ClientXLeadXEDRLoanMakeRepayment from "client-x-lead-x-edr/ClientXLeadXEDRLoanMakeRepayment";
import ClientXLeadXEDRLoanFundWallet from "client-x-lead-x-edr/ClientXLeadXEDRLoanFundWallet";
import ClientXLeadXEDRLoanPrepayLoan from "client-x-lead-x-edr/ClientXLeadXEDRLoanPrepayLoan";
import ClientXLeadXEDRLoanForeclosure from "client-x-lead-x-edr/ClientXLeadXEDRLoanForeclosure";
import useToggle from "hooks/useToggle";

function CRMClientDetailsLoanEDR({ queryResult }) {
  const [status, setStatus] = useState(-1);
  const [creditDirectPayEnum, setCreditDirectPayEnum] = useState(-1);

  const [{ offset, limit }, setTablePaginationConfig] = useState(
    TABLE_PAGINATION_DEFAULT
  );

  const { data, isLoading, isFetching, isError, refetch } =
    nxClientDetailsLoanEdrApi.useGetClientDetailsLoanEDRQuery(
      {
        offset,
        limit,
        status: status == -1 ? undefined : status,
        creditDirectPayEnum:
          creditDirectPayEnum == -1 ? undefined : creditDirectPayEnum,
        clientLoanId: queryResult?.data?.id,
      },
      { skip: !queryResult?.data?.id }
    );

  const tableInstance = useTable({
    columns,
    data: data?.pageItems,
    manualPagination: true,
    pageCount:
      data?.totalFilteredRecords > limit
        ? Math.ceil(data?.totalFilteredRecords / limit)
        : 1,
  });

  useEffect(() => {
    setTablePaginationConfig({
      offset: tableInstance.state.pageIndex * limit,
      limit: tableInstance.state.pageSize,
    });
  }, [limit, tableInstance.state.pageIndex, tableInstance.state.pageSize]);

  return (
    <Paper className="p-4">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex-1" />
        <TextField
          size="small"
          select
          label="Credit Pay Type"
          value={creditDirectPayEnum}
          onChange={(e) => setCreditDirectPayEnum(e.target.value)}
        >
          {[
            { label: "ALL", value: -1 },
            // { label: "TOKENIZATION", value: 1 },
            {
              label: "PREPAY",
              value: ClientXLeadXEDRLoanPaymentTypeEnum.PREPAY,
            },
            {
              label: "FUND WALLET",
              value: ClientXLeadXEDRLoanPaymentTypeEnum.FUND_WALLET,
            },
            {
              label: "FORECLOSURE",
              value: ClientXLeadXEDRLoanPaymentTypeEnum.FORECLOSURE,
            },
            {
              label: "REPAYMENT",
              value: ClientXLeadXEDRLoanPaymentTypeEnum.REPAYMENT,
            },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {[
            { label: "ALL", value: -1 },
            { label: "FAILED", value: ClientXLeadXEDRLoanStatusEnum.FAILED },
            { label: "SUCCESS", value: ClientXLeadXEDRLoanStatusEnum.SUCCESS },
            {
              label: "PROCCESSING",
              value: ClientXLeadXEDRLoanStatusEnum.PROCCESSING,
            },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <DynamicTable
        instance={tableInstance}
        loading={isLoading || isFetching}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
        renderRow={function (row, instance, props) {
          return <RowContainer {...{ row, instance, props }} />;
        }}
      />
    </Paper>
  );
}

export default CRMClientDetailsLoanEDR;

function RowContainer({ row, instance, props }) {
  const data = row?.original;
  const [isDialog, toggleDialog] = useToggle();

  const dialogProps = { data, onClose: toggleDialog };

  return (
    <>
      {isDialog &&
        {
          [ClientXLeadXEDRLoanPaymentTypeEnum.REPAYMENT]: (
            <ClientXLeadXEDRLoanMakeRepayment {...dialogProps} />
          ),
          [ClientXLeadXEDRLoanPaymentTypeEnum.FUND_WALLET]: (
            <ClientXLeadXEDRLoanFundWallet {...dialogProps} />
          ),
          [ClientXLeadXEDRLoanPaymentTypeEnum.PREPAY]: (
            <ClientXLeadXEDRLoanPrepayLoan {...dialogProps} />
          ),
          [ClientXLeadXEDRLoanPaymentTypeEnum.FORECLOSURE]: (
            <ClientXLeadXEDRLoanForeclosure {...dialogProps} />
          ),
        }[data?.isSingle]}
      {renderRow(row, instance, {
        ...props,
        rowProps: {
          ...props.rowProps,
          onClick: data?.status === "PROCCESSING" ? toggleDialog : undefined,
        },
      })}
    </>
  );
}

const columns = [
  { Header: "Employer", accessor: (row) => row?.employerName || "--" },
  // { Header: "Employee Name", accessor: (row) => row?.employeeName || "--" },
  { Header: "Loan Type", accessor: "elementName" },
  {
    Header: "Amount",
    accessor: "deductionAmount",
    Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
  },
  {
    Header: "Period",
    accessor: (row) => row?.period?.join("-"),
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => (
      <Chip
        variant="outlined-opaque"
        color={StatusColorEnum[value]}
        label={value}
      />
    ),
  },
  // {
  //   Header: "Action",
  //   accessor: "id",
  //   Cell: ({ value, row }) => (
  //     <CRMClientDetailsLoanEDRAction data={row.original} />
  //   ),
  // },
];

const StatusColorEnum = {
  FAILED: "error",
  PENDING: "warning",
  SUCCESS: "success",
  PROCCESSING: "warning",
};
