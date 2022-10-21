import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { getTextFieldFormikProps } from "common/Utils";
import { nimbleX360CRMLoanProductApi } from "loan-product/LoanProductStoreQuerySlice";

export default function LoanDeciderAddEditCreditReportAnalysis({ formik }) {
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
        label="Allow Null"
        select
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
