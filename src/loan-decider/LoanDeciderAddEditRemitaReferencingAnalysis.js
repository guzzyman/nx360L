import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { monthInView, prefferedPaymentMode } from "./LoanDeciderConstant";

export default function LoanDeciderAddEditRemitaReferencingAnalysis({
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
        {...formik.getFieldProps("bankScheduleAnalysis.minimumNetPay")}
        error={
          !!formik.touched.bankScheduleAnalysis?.minimumNetPay &&
          !!formik.errors.bankScheduleAnalysis?.minimumNetPay
        }
        helperText={
          !!formik.touched.bankScheduleAnalysis?.minimumNetPay &&
          formik.errors.bankScheduleAnalysis?.minimumNetPay
        }
        type="number"
      />

      <TextField
        fullWidth
        disabled={isView}
        label="Min Gross Pay"
        {...formik.getFieldProps("bankScheduleAnalysis.minimumGrossPay")}
        error={
          !!formik.touched.bankScheduleAnalysis?.minimumGrossPay &&
          !!formik.errors.bankScheduleAnalysis?.minimumGrossPay
        }
        helperText={
          !!formik.touched.bankScheduleAnalysis?.minimumGrossPay &&
          formik.errors.bankScheduleAnalysis?.minimumGrossPay
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
        {...formik.getFieldProps(
          "bankScheduleAnalysis.minimumNoOfSalaryPayment"
        )}
        error={
          !!formik.touched.bankScheduleAnalysis?.minimumNoOfSalaryPayment &&
          !!formik.errors.bankScheduleAnalysis?.minimumNoOfSalaryPayment
        }
        helperText={
          !!formik.touched.bankScheduleAnalysis?.minimumNoOfSalaryPayment &&
          formik.errors.bankScheduleAnalysis?.minimumNoOfSalaryPayment
        }
        type="number"
      />

      <TextField
        fullWidth
        disabled={isView}
        label="DSR"
        {...formik.getFieldProps(
          "bankScheduleAnalysis.dsr"
        )}
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
