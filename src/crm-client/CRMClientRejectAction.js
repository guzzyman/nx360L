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
import { format } from "date-fns";

export default function CRMClientRejectAction(props) {
  const { onClose, ...rest } = props;

  const { id } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientActionsMutation();

  const { data: templateOptionData } =
    nimbleX360CRMClientApi.useGetCRMClientsTemplateQuery({
      commandParam: "reject",
    });
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      rejectedOnDate: format(new Date(), "dd MMMM yyyy"),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({}),

    onSubmit: async (values) => {
      try {
        await addMutation({
          id,
          params: { command: "reject" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Client Rejected Successfully!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Client Rejection Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Reject Client" {...rest}>
      <TextField
        {...getTextFieldFormikProps(formik, "rejectionReasonId")}
        label="Rejection Reason"
        fullWidth
        select
      >
        {templateOptionData?.narrations &&
          templateOptionData?.narrations.map((value, index) => (
            <MenuItem key={index} value={value?.id}>
              {value?.name}
            </MenuItem>
          ))}
      </TextField>

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
          Reject Client
        </LoadingButton>
      </div>
    </Modal>
  );
}
