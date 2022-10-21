import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { getTextFieldFormikProps } from "common/Utils";
import { nimbleX360CRMLoanProductApi } from "loan-product/LoanProductStoreQuerySlice";

export default function LoanDeciderAddEditBankScheduleAnalysis({ formik }) {
  const loanProductQuery =
    nimbleX360CRMLoanProductApi.useGetLoanProductsQuery();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <TextField
        fullWidth
        label="Product Name"
        className="col-span-2"
        select
        {...getTextFieldFormikProps(formik, "productId")}
      >
        {loanProductQuery?.data &&
          loanProductQuery?.data?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
      </TextField>

      <TextField
        fullWidth
        label="Average Inflow Minimum"
        {...getTextFieldFormikProps(formik, "averageInflowMin")}
      />

      <TextField
        fullWidth
        label="Average Inflow Maximum"
        {...getTextFieldFormikProps(formik, "averageInflowMax")}
      />

      <TextField
        fullWidth
        label="Account Sweep"
        select
        {...getTextFieldFormikProps(formik, "accountSweep")}
      >
        {["true", "false"].map((data, i) => (
          <MenuItem key={i} value={data}>
            {data}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        label="Minimum Gambling Rate (%)"
        {...getTextFieldFormikProps(formik, "minGamblingRate")}
      />
      <TextField
        fullWidth
        label="Last Date Of Credit"
        {...getTextFieldFormikProps(formik, "lastIntervalOfCredit")}
      />
      <TextField
        fullWidth
        label="Min. No of salary payment"
        {...getTextFieldFormikProps(formik, "miniNoOfSalaryPayment")}
      />
      <TextField
        fullWidth
        label="Salary Earner (DSR %)"
        {...getTextFieldFormikProps(formik, "salaryEarnerDSR")}
      />
      <TextField
        fullWidth
        label="Non Salary Earner (DSR %)"
        {...getTextFieldFormikProps(formik, "nonSalaryEarnerDSR")}
      />
    </div>
  );
}
