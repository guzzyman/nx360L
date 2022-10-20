import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import { daysFromNow } from "./CRMClientUtils";
import FormatToNumber from "common/FormatToNumber";

export default function CRMClientLoanWaiveInterestAdd(props) {
  const { onClose, ...rest } = props;

  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientLoanPrepayLoanMutation();

  const { data: templateOptionData } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanTransactionTemplateQuery({
      loanId,
      command: "waiveinterest",
    });

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      transactionAmount:
        `${templateOptionData ? templateOptionData?.amount : ""}` || "",
      transactionDate: format(new Date(), "dd MMMM yyyy"),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      transactionAmount: Yup.string(),
      transactionDate: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({
          loanId,
          params: { command: "waiveinterest" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Waive Interest Creation Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Waive Interest Creation Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Waive Interest" {...rest}>
      <div className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
          <DesktopDatePicker
            label="Interest waived on*"
            inputFormat="dd/MM/yyyy"
            minDate={daysFromNow(7, "past")}
            maxDate={new Date()}
            error={
              !!formik.touched.transactionDate &&
              !!formik.errors.transactionDate
            }
            helperText={
              !!formik.touched.transactionDate && formik.errors.transactionDate
            }
            onChange={(newValue) => {
              if (isValid(new Date(newValue))) {
                formik.setFieldValue(
                  "transactionDate",
                  format(new Date(newValue), "dd MMMM yyyy")
                );
              }
            }}
            value={formik.values?.transactionDate || new Date()}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
          <TextField
            {...getTextFieldFormikProps(formik, "transactionAmount")}
            label="Transaction amount"
            InputProps={{
              inputComponent: FormatToNumber,
            }}
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

      <div className="mt-5">
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Waive Interest
        </LoadingButton>
      </div>
    </Modal>
  );
}
