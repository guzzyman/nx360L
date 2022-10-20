import "@mui/material";
import { RouteEnum } from "common/Constants";
import CurrencyTypography from "common/CurrencyTypography";
import { EDRStatusEnum } from "edr/EDRConstants";
import EDRList from "edr/EDRList";
import { nxEDRPartiallyProcessedApi } from "./EDRPartiallyProcessedStoreQuerySlice";

function EDRPartiallyProcessed(props) {
  return (
    <EDRList
      title="Partially Processed"
      breadcrumbs={() => [{ name: "Partially Processed" }]}
      queryArgs={queryArgs}
      // useGetEDRsQuery={nxEDRPartiallyProcessedApi.useGetEDRsQuery}
      useGetEDRsQuery={useGetPartialEDRsQuery}
      detailsRoutePath={RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS}
      columns={columns}
    />
  );
}

export default EDRPartiallyProcessed;

function useGetPartialEDRsQuery({ fromDate, toDate, ...arg0 }, arg1) {
  return nxEDRPartiallyProcessedApi.useGetPartialEDRsQuery(
    { ...arg0, startPeriod: fromDate, endPeriod: toDate },
    arg1
  );
}

const queryArgs = {
  status: EDRStatusEnum.PARTIAL,
  creditDirectPayEnum: 6,
  // withUniqueId: true,
};

const columns = [
  { Header: "Employer", accessor: "employerName" },
  { Header: "Employee Name", accessor: "employeeName" },
  { Header: "Loan Type", accessor: "elementName" },
  { Header: "Staff ID", accessor: "employeeNumber" },
  // { Header: "Ref ID", accessor: refId },
  { Header: "Period", accessor: (row) => row?.period?.join("-") },
  {
    Header: "Deduction Amount",
    accessor: "deductionAmount",
    Cell: ({ value }) => <CurrencyTypography>{value}</CurrencyTypography>,
  },
];
