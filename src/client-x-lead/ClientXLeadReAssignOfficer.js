import React from "react";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import LoadingButton from "@mui/lab/LoadingButton";

import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { MenuItem, TextField } from "@mui/material";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";

export default function ClientXLeadReAssignOfficer(props) {
  const { onClose, clientId, ...rest } = props;
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientCommandActionsMutation();
  const { data: templateOptionData } =
    nimbleX360CRMClientApi.useGetCRMClientQuery({
      id: clientId,
      staffInSelectedOfficeOnly: true,
      template: true,
    });

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      staffId: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      staffId: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({
          clientId,
          command: "assignStaff",
          ...values,
        }).unwrap();
        enqueueSnackbar(`Client Reassign Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Client Reassign Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="" title="Reassign Officer" {...rest}>
      <TextField
        {...getTextFieldFormikProps(formik, "staffId")}
        label="Officer"
        fullWidth
        select
      >
        {templateOptionData?.staffOptions &&
          templateOptionData?.staffOptions.map((value, index) => (
            <MenuItem key={index} value={value?.id}>
              {value?.displayName}
            </MenuItem>
          ))}
      </TextField>

      <div className="mt-5">
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Reassign Officer
        </LoadingButton>
      </div>
    </Modal>
  );
}
