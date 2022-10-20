import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { monthInView, prefferedPaymentMode } from "./LoanDeciderConstant";

export default function LoanDeciderAddEditBankScheduleAnalysis({
  formik,
  isView,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <TextField
        fullWidth
        disabled={isView}
        label="Month In View"
        className="col-span-2"
        select
        {...formik.getFieldProps("bankScheduleAnalysis.monthInView")}
        error={
          !!formik.touched.bankScheduleAnalysis?.monthInView &&
          !!formik.errors.bankScheduleAnalysis?.monthInView
        }
        helperText={
          !!formik.touched.bankScheduleAnalysis?.monthInView &&
          formik.errors.bankScheduleAnalysis?.monthInView
        }
      >
        {monthInView.map((option, i) => (
          <MenuItem key={i} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        disabled={isView}
        label="Min Net Pay"
        {...formik.getFieldProps("bankScheduleAnalysis.minNetPay")}
        error={
          !!formik.touched.bankScheduleAnalysis?.minNetPay &&
          !!formik.errors.bankScheduleAnalysis?.minNetPay
        }
        helperText={
          !!formik.touched.bankScheduleAnalysis?.minNetPay &&
          formik.errors.bankScheduleAnalysis?.minNetPay
        }
        type="number"
      />

      <TextField
        fullWidth
        disabled={isView}
        label="Min Gross Pay"
        {...formik.getFieldProps("bankScheduleAnalysis.minGrossPay")}
        error={
          !!formik.touched.bankScheduleAnalysis?.minGrossPay &&
          !!formik.errors.bankScheduleAnalysis?.minGrossPay
        }
        helperText={
          !!formik.touched.bankScheduleAnalysis?.minGrossPay &&
          formik.errors.bankScheduleAnalysis?.minGrossPay
        }
        type="number"
      />

      <TextField
        fullWidth
        disabled={isView}
        label="Preferred Payment Mode"
        select
        {...formik.getFieldProps("bankScheduleAnalysis.preferredPaymentMode")}
        error={
          !!formik.touched.bankScheduleAnalysis?.preferredPaymentMode &&
          !!formik.errors.bankScheduleAnalysis?.preferredPaymentMode
        }
        helperText={
          !!formik.touched.bankScheduleAnalysis?.preferredPaymentMode &&
          formik.errors.bankScheduleAnalysis?.preferredPaymentMode
        }
      >
        {prefferedPaymentMode.map((data, i) => (
          <MenuItem key={i} value={data}>
            {data}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        disabled={isView}
        label="Minimum Number of Salary Payment"
        {...formik.getFieldProps("bankScheduleAnalysis.minNoOSalary")}
        error={
          !!formik.touched.bankScheduleAnalysis?.minNoOSalary &&
          !!formik.errors.bankScheduleAnalysis?.minNoOSalary
        }
        helperText={
          !!formik.touched.bankScheduleAnalysis?.minNoOSalary &&
          formik.errors.bankScheduleAnalysis?.minNoOSalary
        }
        type="number"
      />

      <TextField
        fullWidth
        disabled={isView}
        label="DSR"
        {...formik.getFieldProps("bankScheduleAnalysis.dsr")}
        error={
          !!formik.touched.bankScheduleAnalysis?.dsr &&
          !!formik.errors.bankScheduleAnalysis?.dsr
        }
        helperText={
          !!formik.touched.bankScheduleAnalysis?.dsr &&
          formik.errors.bankScheduleAnalysis?.dsr
        }
        type="number"
      />

      <TextField
        fullWidth
        disabled={isView}
        label="Allow Null"
        select
        {...formik.getFieldProps("bankScheduleAnalysis.allowNull")}
        error={
          !!formik.touched.bankScheduleAnalysis?.allowNull &&
          !!formik.errors.bankScheduleAnalysis?.allowNull
        }
        helperText={
          !!formik.touched.bankScheduleAnalysis?.allowNull &&
          formik.errors.bankScheduleAnalysis?.allowNull
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
