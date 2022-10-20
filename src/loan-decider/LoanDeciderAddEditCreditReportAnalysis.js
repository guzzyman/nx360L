import { MenuItem, TextField, Typography } from "@mui/material";
import React from "react";

export default function LoanDeciderAddEditCreditReportAnalysis({
  formik,
  isView,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 ">
      <div className="flex justify-between">
        <Typography>Maximum days in arrears:</Typography>
        <TextField
          type={"number"}
          disabled={isView}
          {...formik.getFieldProps("creditReport.maximumDaysInArrears")}
          error={
            !!formik.touched.creditReport?.maximumDaysInArrears &&
            !!formik.errors.creditReport?.maximumDaysInArrears
          }
          helperText={
            !!formik.touched.creditReport?.maximumDaysInArrears &&
            formik.errors.creditReport?.maximumDaysInArrears
          }
        />
      </div>

      <div className="flex justify-between">
        <Typography>Maximum number of accounts in arrears:</Typography>
        <TextField
          type={"number"}
          disabled={isView}
          {...formik.getFieldProps("creditReport.maximumAccountsInArrears")}
          error={
            !!formik.touched.creditReport?.maximumAccountsInArrears &&
            !!formik.errors.creditReport?.maximumAccountsInArrears
          }
          helperText={
            !!formik.touched.creditReport?.maximumAccountsInArrears &&
            formik.errors.creditReport?.maximumAccountsInArrears
          }
        />
      </div>

      <TextField
        fullWidth
        label="Allow Null"
        select
        disabled={isView}
        {...formik.getFieldProps("bankStatement.allowNull")}
        error={
          !!formik.touched.bankStatement?.allowNull &&
          !!formik.errors.bankStatement?.allowNull
        }
        helperText={
          !!formik.touched.bankStatement?.allowNull &&
          formik.errors.bankStatement?.allowNull
        }
      >
        {["true", "false"].map((data, i) => (
          <MenuItem key={i} value={data}>
            {data}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
