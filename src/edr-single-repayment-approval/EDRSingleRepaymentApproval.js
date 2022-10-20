import { useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import CurrencyTypography from "common/CurrencyTypography";
import EDRList from "edr/EDRList";
import EDRStatusChip from "edr/EDRStatusChip";
import { nxEDRSingleApprovalApi } from "./EDRSingleRepaymentApprovalStoreQuerySlice";
import { renderRow } from "common/StandardTable";
import useToggle from "hooks/useToggle";
import { EDRPaymentTypeEnum, EDRStatusEnum } from "edr/EDRConstants";
import ClientXLeadXEDRLoanMakeRepayment from "client-x-lead-x-edr/ClientXLeadXEDRLoanMakeRepayment";
import ClientXLeadXEDRLoanPrepayLoan from "client-x-lead-x-edr/ClientXLeadXEDRLoanPrepayLoan";
import ClientXLeadXEDRLoanForeclosure from "client-x-lead-x-edr/ClientXLeadXEDRLoanForeclosure";
import ClientXLeadXEDRLoanFundWallet from "client-x-lead-x-edr/ClientXLeadXEDRLoanFundWallet";

function EDRSingleRepaymentApproval(props) {
  const [creditDirectPayEnum, setCreditDirectPayEnum] = useState(
    EDRPaymentTypeEnum.REPAYMENT
  );

  return (
    <>
      <EDRList
        title="Single Repayment Approval"
        breadcrumbs={() => [{ name: "Approval" }]}
        queryArgs={{
          ...queryArgs,
          creditDirectPayEnum:
            creditDirectPayEnum == -1 ? undefined : creditDirectPayEnum,
        }}
        useGetEDRsQuery={nxEDRSingleApprovalApi.useGetEDRsQuery}
        actions={() => (
          <>
            <TextField
              size="small"
              select
              label="Credit Pay Type"
              value={creditDirectPayEnum}
              onChange={(e) => setCreditDirectPayEnum(e.target.value)}
            >
              {[
                // { label: "ALL", value: -1 },
                // { label: "TOKENIZATION", value: 1 },
                { label: "PREPAY", value: EDRPaymentTypeEnum.PREPAY },
                { label: "FUND WALLET", value: EDRPaymentTypeEnum.FUND_WALLET },
                { label: "FORECLOSURE", value: EDRPaymentTypeEnum.FORECLOSURE },
                { label: "REPAYMENT", value: EDRPaymentTypeEnum.REPAYMENT },
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
        columns={columns}
        TableProps={() => ({
          renderRow: function (row, instance, props) {
            return <RowContainer {...{ row, instance, props }} />;
          },
        })}
      />
    </>
  );
}

export default EDRSingleRepaymentApproval;

function RowContainer({ row, instance, props }) {
  const data = row?.original;
  const [isDialog, toggleDialog] = useToggle();

  const dialogProps = { data, onClose: toggleDialog };

  return (
    <>
      {isDialog &&
        {
          [EDRPaymentTypeEnum.REPAYMENT]: (
            <ClientXLeadXEDRLoanMakeRepayment {...dialogProps} />
          ),
          [EDRPaymentTypeEnum.FUND_WALLET]: (
            <ClientXLeadXEDRLoanFundWallet {...dialogProps} />
          ),
          [EDRPaymentTypeEnum.PREPAY]: (
            <ClientXLeadXEDRLoanPrepayLoan {...dialogProps} />
          ),
          [EDRPaymentTypeEnum.FORECLOSURE]: (
            <ClientXLeadXEDRLoanForeclosure {...dialogProps} />
          ),
        }[data?.isSingle]}
      {renderRow(row, instance, {
        ...props,
        rowProps: { ...props.rowProps, onClick: toggleDialog },
      })}
    </>
  );
}

const queryArgs = { status: EDRStatusEnum.PROCCESSING };

const columns = [
  { Header: "Type", accessor: "elementName" },
  {
    Header: "Name",
    accessor: (row) => `${row?.clientDisplayName} (${row?.clientId})`,
  },
  { Header: "Period", accessor: (row) => row?.period?.join("-") },
  {
    Header: "Deduction Amount",
    accessor: "deductionAmount",
    Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
  },
  { Header: "Credit Pay Type", accessor: (row) => row?.isSingleData?.value },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <EDRStatusChip status={value} />,
  },
];
