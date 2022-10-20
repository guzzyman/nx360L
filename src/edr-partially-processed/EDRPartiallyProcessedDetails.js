import { MenuItem, TextField } from "@mui/material";
import { RouteEnum } from "common/Constants";
import { useState } from "react";
import { useNavigate, generatePath, useParams } from "react-router-dom";
import EDRDetails from "edr/EDRDetails";
import EDRGroupBreakdownList from "edr/EDRGroupBreakdownList";
import EDRBreakdownList from "edr/EDRBreakdownList";
import EDRNoteList from "edr/EDRNoteList";
import { nxEDRPartiallyProcessedApi } from "./EDRPartiallyProcessedStoreQuerySlice";
import { EDRStatusEnum } from "edr/EDRConstants";
import CurrencyTypography from "common/CurrencyTypography";

function EDRPartiallyProcessedDetails(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState(-1);

  return (
    <EDRDetails
      title="Partially Processed Details"
      breadcrumbs={() => [
        {
          name: "Partially Processed",
          to: RouteEnum.EDR_PARTIALLY_PROCESSED,
        },
        {
          name: "Details",
        },
      ]}
      queryArgs={{
        edrId: id,
      }}
      useGetEDRQuery={nxEDRPartiallyProcessedApi.useGetEDRQuery}
      status={({ data }) => data?.status}
      summary={({ data }) => [
        // { label: "Employer", value: data?.employerName },
        // { label: "Employee Name", value: data?.employeeName },
        // { label: "Loan Type", value: data?.elementName },
        // { label: "Staff ID", value: data?.employeeNumber },
        // // { label: "Ref ID", value: data?.refId },
        // { label: "Period", value: data?.period?.join("-") },
        // {
        //   label: "Deduction Amount",
        //   value: (
        //     <CurrencyTypography>{data?.deductionAmount}</CurrencyTypography>
        //   ),
        // },
      ]}
    >
      {({ data }) => (
        <>
          {/* <EDRGroupBreakdownList
            queryArgs={{
              ...queryArgs,
              uniqueId: data?.uniqueId,
            }}
          /> */}
          <EDRBreakdownList
            queryArgs={{
              status: status !== -1 ? status : undefined,
              transId: data?.uniqueId,
            }}
            useGetEDRsQuery={nxEDRPartiallyProcessedApi.useGetEDRsQuery}
            actions={() => (
              <>
                <TextField
                  size="small"
                  select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {[
                    { label: "ALL", value: -1 },
                    { label: "FAILED", value: EDRStatusEnum.FAILED },
                    { label: "SUCCESS", value: EDRStatusEnum.SUCCESS },
                    { label: "PROCCESSING", value: EDRStatusEnum.PROCCESSING },
                  ].map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}
            onRowClick={(_, row) => {
              navigate(
                generatePath(
                  RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS_BREAKDOWN_DETAILS,
                  {
                    id: id,
                    tid: row.original.id,
                  }
                )
              );
            }}
          />
          {/* <EDRNoteList
            queryArgs={{ fcmbId: id }}
            useGetNotesQuery={nxEDRPartiallyProcessedApi.useGetInflowNotesQuery}
          /> */}
        </>
      )}
    </EDRDetails>
  );
}

const queryArgs = { statusId: EDRStatusEnum.PROCCESSING };

export default EDRPartiallyProcessedDetails;
