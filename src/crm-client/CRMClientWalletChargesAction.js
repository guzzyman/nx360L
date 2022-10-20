import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import { Button, MenuItem, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

export default function CRMClientWalletChargesAction(props) {
  const { onClose, ...rest } = props;
  const { walletId } = useParams();
  const { data } =
    nimbleX360CRMClientApi.useGetCRMClientsSavingAccountTransactionTemplateQuery(
      { walletId }
    );
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientSavingsAccountTransactionActionMutation();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      chargeId: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({
          walletId,
          params: { command: "deposit" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Charge add Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Charge add  Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Add Charge" {...rest}>
      <div>
        <TextField
          {...getTextFieldFormikProps(formik, "chargeId")}
          label="Charge Options"
          select
          fullWidth
        >
          {data?.chargeOptions?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option?.name}
            </MenuItem>
          ))}
        </TextField>
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
          Charge
        </LoadingButton>
      </div>
    </Modal>
  );
}
