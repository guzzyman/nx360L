import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { getTextFieldFormikProps } from "common/Utils";
import { nimbleX360CRMLoanProductApi } from "loan-product/LoanProductStoreQuerySlice";

export default function LoanDeciderAddEditBankStatement({ formik, isView }) {
  const loanProductQuery =
    nimbleX360CRMLoanProductApi.useGetLoanProductsQuery();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <TextField
        fullWidth
        disabled={isView}
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
        disabled={isView}
        label="Average Inflow Minimum"
        {...formik.getFieldProps("bankStatement.averageInflowMin")}
        error={
          !!formik.touched.bankStatement?.averageInflowMin &&
          !!formik.errors.bankStatement?.averageInflowMin
        }
        helperText={
          !!formik.touched.bankStatement?.averageInflowMin &&
          formik.errors.bankStatement?.averageInflowMin
        }
      />

      <TextField
        fullWidth
        disabled={isView}
        label="Average Inflow Maximum"
        {...formik.getFieldProps("bankStatement.averageInflowMax")}
        error={
          !!formik.touched.bankStatement?.averageInflowMax &&
          !!formik.errors.bankStatement?.averageInflowMax
        }
        helperText={
          !!formik.touched.bankStatement?.averageInflowMax &&
          formik.errors.bankStatement?.averageInflowMax
        }
      />

      <TextField
        fullWidth
        disabled={isView}
        label="Account Sweep"
        select
        {...formik.getFieldProps("bankStatement.accountSweep")}
        error={
          !!formik.touched.bankStatement?.accountSweep &&
          !!formik.errors.bankStatement?.accountSweep
        }
        helperText={
          !!formik.touched.bankStatement?.accountSweep &&
          formik.errors.bankStatement?.accountSweep
        }
      >
        {["true", "false"].map((data, i) => (
          <MenuItem key={i} value={data}>
            {data}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        disabled={isView}
        label="Minimum Gambling Rate (%)"
        {...formik.getFieldProps("bankStatement.minGamblingRate")}
        error={
          !!formik.touched.bankStatement?.minGamblingRate &&
          !!formik.errors.bankStatement?.minGamblingRate
        }
        helperText={
          !!formik.touched.bankStatement?.minGamblingRate &&
          formik.errors.bankStatement?.minGamblingRate
        }
      />
      <TextField
        fullWidth
        disabled={isView}
        label="Last Date Of Credit"
        {...formik.getFieldProps("bankStatement.lastIntervalOfCredit")}
        error={
          !!formik.touched.bankStatement?.lastIntervalOfCredit &&
          !!formik.errors.bankStatement?.lastIntervalOfCredit
        }
        helperText={
          !!formik.touched.bankStatement?.lastIntervalOfCredit &&
          formik.errors.bankStatement?.lastIntervalOfCredit
        }
      />
      <TextField
        fullWidth
        disabled={isView}
        label="Min. No of salary payment"
        {...formik.getFieldProps("bankStatement.miniNoOfSalaryPayment")}
        error={
          !!formik.touched.bankStatement?.miniNoOfSalaryPayment &&
          !!formik.errors.bankStatement?.miniNoOfSalaryPayment
        }
        helperText={
          !!formik.touched.bankStatement?.miniNoOfSalaryPayment &&
          formik.errors.bankStatement?.miniNoOfSalaryPayment
        }
      />
      <TextField
        fullWidth
        disabled={isView}
        label="Salary Earner (DSR %)"
        {...formik.getFieldProps("bankStatement.salaryEarnerDSR")}
        error={
          !!formik.touched.bankStatement?.salaryEarnerDSR &&
          !!formik.errors.bankStatement?.salaryEarnerDSR
        }
        helperText={
          !!formik.touched.bankStatement?.salaryEarnerDSR &&
          formik.errors.bankStatement?.salaryEarnerDSR
        }
      />
      <TextField
        fullWidth
        disabled={isView}
        label="Non Salary Earner (DSR %)"
        {...formik.getFieldProps("bankStatement.nonSalaryEarnerDSR")}
        error={
          !!formik.touched.bankStatement?.nonSalaryEarnerDSR &&
          !!formik.errors.bankStatement?.nonSalaryEarnerDSR
        }
        helperText={
          !!formik.touched.bankStatement?.nonSalaryEarnerDSR &&
          formik.errors.bankStatement?.nonSalaryEarnerDSR
        }
      />
      <TextField
        fullWidth
        disabled={isView}
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
