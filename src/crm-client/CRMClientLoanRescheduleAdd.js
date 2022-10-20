import React, { useState } from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import FormatToNumber from "common/FormatToNumber";

export default function CRMClientLoanRescheduleAdd(props) {
  const { onClose, ...rest } = props;
  const [changeRepaymentDate, setchangeRepaymentDate] = useState(false);
  const [midTermGracePeriod, setMidTermGracePeriod] = useState(false);
  const [extendRepaymentPeriod, setExtendRepaymentPeriod] = useState(false);
  const [adjustInterestRate, setAdjustInterestRate] = useState(false);
  const [changeEMI, setChangeEMI] = useState(false);

  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientRescheduleLoanMutation();

  const { data: templateOptionData } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanRescheduleTemplateQuery();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      loanId,
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      rescheduleReasonComment: "",
      submittedOnDate: format(new Date(), "dd MMMM yyyy"),
      rescheduleFromDate: format(new Date(), "dd MMMM yyyy"),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      rescheduleReasonComment: Yup.string()
        .label("Reschedule Comment")
        .required(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({
          params: { command: "reschedule" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Reschedule Loan Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Reschedule Loan Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Reschedule Loan" {...rest}>
      <div className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
          <DesktopDatePicker
            label="Reschedule from Installment On*"
            inputFormat="dd/MM/yyyy"
            error={
              !!formik.touched.rescheduleFromDate &&
              !!formik.errors.rescheduleFromDate
            }
            helperText={
              !!formik.touched.rescheduleFromDate &&
              formik.errors.rescheduleFromDate
            }
            onChange={(newValue) => {
              if (isValid(new Date(newValue))) {
                formik.setFieldValue(
                  "rescheduleFromDate",
                  format(new Date(newValue), "dd MMMM yyyy")
                );
              }
            }}
            value={formik.values?.rescheduleFromDate || new Date()}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />

          <TextField
            label="Reason for Rescheduling*"
            fullWidth
            {...getTextFieldFormikProps(formik, "rescheduleReasonId")}
            select
          >
            {templateOptionData &&
              templateOptionData?.rescheduleReasons?.map((data, index) => (
                <MenuItem value={data.id} key={index}>
                  {data.name}
                </MenuItem>
              ))}
          </TextField>

          <DesktopDatePicker
            label="Submitted On*"
            inputFormat="dd/MM/yyyy"
            minDate={new Date()}
            error={
              !!formik.touched.submittedOnDate &&
              !!formik.errors.submittedOnDate
            }
            helperText={
              !!formik.touched.submittedOnDate && formik.errors.submittedOnDate
            }
            onChange={(newValue) => {
              if (isValid(new Date(newValue))) {
                formik.setFieldValue(
                  "submittedOnDate",
                  format(new Date(newValue), "dd MMMM yyyy")
                );
              }
            }}
            value={formik.values?.submittedOnDate || new Date()}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </div>
      </div>

      <TextField
        label="Comments"
        {...getTextFieldFormikProps(formik, "rescheduleReasonComment")}
        fullWidth
        multiline
        rows={3}
      />

      {/* Change Repayment Date  */}
      <div className="mt-4">
        <FormControlLabel
          label="Change Repayment Date "
          control={
            <Checkbox
              checked={changeRepaymentDate}
              onChange={(event) => {
                setchangeRepaymentDate(event.target.checked);
              }}
              value={changeRepaymentDate}
            />
          }
        />

        {changeRepaymentDate && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
            <DesktopDatePicker
              label="Installment Rescheduled to"
              inputFormat="dd/MM/yyyy"
              minDate={new Date()}
              error={
                !!formik.touched.adjustedDueDate &&
                !!formik.errors.adjustedDueDate
              }
              helperText={
                !!formik.touched.adjustedDueDate &&
                formik.errors.adjustedDueDate
              }
              onChange={(newValue) => {
                if (isValid(new Date(newValue))) {
                  formik.setFieldValue(
                    "adjustedDueDate",
                    format(new Date(newValue), "dd MMMM yyyy")
                  );
                }
              }}
              value={formik.values?.adjustedDueDate || new Date()}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </div>
        )}
      </div>
      {/* End Change Repayment Date  */}

      {/* midTermGracePeriod  */}
      <div className="mt-4">
        <FormControlLabel
          label="Introduce Mid-term grace periods  "
          control={
            <Checkbox
              checked={midTermGracePeriod}
              onChange={(event) => {
                setMidTermGracePeriod(event.target.checked);
              }}
              value={midTermGracePeriod}
            />
          }
        />

        {midTermGracePeriod && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
            <TextField
              {...getTextFieldFormikProps(formik, "graceOnPrincipal")}
              label="Principal Grace Periods "
              InputProps={{
                inputComponent: FormatToNumber,
              }}
              fullWidth
            />

            <TextField
              {...getTextFieldFormikProps(formik, "graceOnInterest")}
              label="Interest Grace Periods"
              InputProps={{
                inputComponent: FormatToNumber,
              }}
              fullWidth
            />
          </div>
        )}
      </div>
      {/* End midTermGracePeriod */}

      {/* extendRepaymentPeriod  */}
      <div className="mt-4">
        <FormControlLabel
          label="Extend Repayment Period "
          control={
            <Checkbox
              checked={extendRepaymentPeriod}
              onChange={(event) => {
                setExtendRepaymentPeriod(event.target.checked);
              }}
              value={extendRepaymentPeriod}
            />
          }
        />

        {extendRepaymentPeriod && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
            <TextField
              {...getTextFieldFormikProps(formik, "extraTerms")}
              label="Number Of new Repayments "
              InputProps={{
                inputComponent: FormatToNumber,
              }}
              fullWidth
            />
          </div>
        )}
      </div>
      {/* End extendRepaymentPeriod */}

      {/* Adjust interest rates for remainder of loan  */}
      <div className="mt-4">
        <FormControlLabel
          label="Adjust interest rates for remainder of loan"
          control={
            <Checkbox
              checked={adjustInterestRate}
              onChange={(event) => {
                setAdjustInterestRate(event.target.checked);
              }}
              value={adjustInterestRate}
            />
          }
        />

        {adjustInterestRate && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
            <TextField
              {...getTextFieldFormikProps(formik, "newInterestRate")}
              label="New Interest Rate "
              InputProps={{
                inputComponent: FormatToNumber,
              }}
              fullWidth
            />
          </div>
        )}
      </div>
      {/* End Adjust interest rates for remainder of loan */}

      {/* Change EMI   */}
      <div className="mt-4">
        <FormControlLabel
          label="Change EMI"
          control={
            <Checkbox
              checked={changeEMI}
              onChange={(event) => {
                setChangeEMI(event.target.checked);
              }}
              value={changeEMI}
            />
          }
        />

        {changeEMI && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
            <DesktopDatePicker
              label="EMI change End Date"
              inputFormat="dd/MM/yyyy"
              minDate={new Date()}
              error={!!formik.touched.endDate && !!formik.errors.endDate}
              helperText={!!formik.touched.endDate && formik.errors.endDate}
              onChange={(newValue) => {
                if (isValid(new Date(newValue))) {
                  formik.setFieldValue(
                    "endDate",
                    format(new Date(newValue), "dd MMMM yyyy")
                  );
                }
              }}
              value={formik.values?.endDate || new Date()}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />

            <TextField
              {...getTextFieldFormikProps(formik, "emi")}
              label="New EMI "
              InputProps={{
                inputComponent: FormatToNumber,
              }}
              fullWidth
            />
          </div>
        )}
      </div>
      {/* End Change EMI  */}

      <div className="mt-5 flex gap-3 justify-between">
        <Button
          variant="outlined"
          color="warning"
          fullWidth
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Reschedule Loan
        </LoadingButton>
      </div>
    </Modal>
  );
}
