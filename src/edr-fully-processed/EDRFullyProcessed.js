import "@mui/material";
import { RouteEnum } from "common/Constants";
import CurrencyTypography from "common/CurrencyTypography";
import { EDRStatusEnum } from "edr/EDRConstants";
import EDRList from "edr/EDRList";
import { nxEDRFullyProcessedApi } from "./EDRFullyProcessedStoreQuerySlice";

function EDRFullyProcessed(props) {
  return (
    <EDRList
      title="Fully Processed"
      breadcrumbs={() => [{ name: "Fully Processed" }]}
      queryArgs={queryArgs}
      useGetEDRsQuery={nxEDRFullyProcessedApi.useGetEDRsQuery}
      detailsRoutePath={RouteEnum.EDR_FULLY_PROCESSED_DETAILS}
      columns={columns}
    />
  );
}

export default EDRFullyProcessed;

const queryArgs = {
  status: EDRStatusEnum.SUCCESS,
  creditDirectPayEnum: 6,
  withUniqueId: true,
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
