import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import {
  getTextFieldFormikProps,
  getUserErrorMessage,
  parseDateToString,
} from "common/Utils";
import { Button, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import FormatToNumber from "common/FormatToNumber";
import { daysFromNow } from "./CRMClientUtils";

export default function CRMClientAcceptLoanAction(props) {
  const { onClose, salesApproval, ...rest } = props;

  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientLoanAssignLoanMutation();

  const { data: templateOptionData } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanActivationTemplateQuery({
      loanId,
      templateType: "approval",
    });

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      ...(salesApproval
        ? {
            salesApprovedOnDate: parseDateToString(
              templateOptionData?.approvalDate
            ),
          }
        : {
            approvedOnDate: parseDateToString(templateOptionData?.approvalDate),
          }),

      expectedDisbursementDate: parseDateToString(
        templateOptionData?.approvalDate
      ),
      approvedLoanAmount: templateOptionData?.approvalAmount,
      disbursementData: [],
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({}),

    onSubmit: async (values) => {
      try {
        await addMutation({
          loanId,
          params: { command: salesApproval ? "salesapprove" : "approve" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Loan Approval Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Loan Approval Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Approve Loan" {...rest}>
      <div className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
          <DesktopDatePicker
            value={formik.values?.approvedOnDate || new Date()}
            label="Approved On*"
            inputFormat="dd/MM/yyyy"
            minDate={daysFromNow(20, "past")}
            maxDate={new Date()}
            error={
              !!formik.touched.approvedOnDate && !!formik.errors.approvedOnDate
            }
            helperText={
              !!formik.touched.approvedOnDate && formik.errors.approvedOnDate
            }
            onChange={(newValue) => {
              if (isValid(new Date(newValue))) {
                formik.setFieldValue(
                  "approvedOnDate",
                  format(new Date(newValue), "dd MMMM yyyy")
                );
              }
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />

          <DesktopDatePicker
            label="Expected disbursement on"
            inputFormat="dd/MM/yyyy"
            minDate={daysFromNow(20, "past")}
            maxDate={new Date()}
            error={
              !!formik.touched.expectedDisbursementDate &&
              !!formik.errors.expectedDisbursementDate
            }
            helperText={
              !!formik.touched.expectedDisbursementDate &&
              formik.errors.expectedDisbursementDate
            }
            onChange={(newValue) => {
              if (isValid(new Date(newValue))) {
                formik.setFieldValue(
                  "expectedDisbursementDate",
                  format(new Date(newValue), "dd MMMM yyyy")
                );
              }
            }}
            value={formik.values?.expectedDisbursementDate || new Date()}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />

          <TextField
            label="Approved Amount"
            focused
            InputProps={{
              readOnly: true,
              inputComponent: FormatToNumber,
            }}
            {...getTextFieldFormikProps(formik, "approvedLoanAmount")}
            fullWidth
          />

          <TextField
            label="Transaction amount*"
            focused
            InputProps={{
              readOnly: true,
              inputComponent: FormatToNumber,
            }}
            {...getTextFieldFormikProps(formik, "approvedLoanAmount")}
            fullWidth
          />
        </div>
      </div>

      <TextField
        {...getTextFieldFormikProps(formik, "note")}
        label="Note"
        fullWidth
        multiline
        rows={5}
      />

      <div className="mt-5 flex gap-3 justify-between">
        <Button variant="outlined" fullWidth onClick={() => onClose()}>
          Cancel
        </Button>
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Approve Loan
        </LoadingButton>
      </div>
    </Modal>
  );
}
