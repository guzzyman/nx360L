import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getUserErrorMessage } from "common/Utils";
import { Button, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import { daysFromNow } from "./CRMClientUtils";

export default function CRMClientWalletPostInterestAction(props) {
  const { onClose, ...rest } = props;

  const { walletId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientSavingsAccountTransactionActionMutation();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      isPostInterestAsOn: true,
      transactionDate: format(new Date(), "dd MMMM yyyy"),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      transactionDate: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({
          walletId,
          params: { command: "postInterestAsOn" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Post Interest as on Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Post Interest as on Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Post Interest as on" {...rest}>
      <div className="mt-4">
        <DesktopDatePicker
          label="Closed on*"
          inputFormat="dd/MM/yyyy"
          minDate={daysFromNow(7, "past")}
          maxDate={new Date()}
          error={
            !!formik.touched.transactionDate && !!formik.errors.transactionDate
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
          value={formik.values?.transactionDate || ""}
          renderInput={(params) => <TextField fullWidth {...params} />}
        />
      </div>

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
          Post Interest as on
        </LoadingButton>
      </div>
    </Modal>
  );
}
