import React, { useMemo } from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps } from "common/Utils";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

export default function CRMClientLoanNotesAddEdit(props) {
  const { onClose, noteId, ...rest } = props;
  const isEdit = !!noteId;

  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientLoanNoteMutation();

  const [updateMutation, { isLoading: updateLoading }] =
    nimbleX360CRMClientApi.useUpdateCRMClientLoanNoteMutation();

  const { data: noteData, isLoading: noteIsLoading } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanNoteQuery(
      useMemo(() => ({ loanId, noteId }), [noteId, loanId]),
      { skip: !noteId }
    );

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      note: isEdit ? noteData?.note : "" || "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      note: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        !isEdit
          ? await addMutation({ loanId, ...values }).unwrap()
          : await updateMutation({ loanId, noteId, ...values }).unwrap();
        enqueueSnackbar(`Note ${isEdit ? "update" : "creation"} Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Note ${isEdit ? "update" : "creation"} Failed!`, {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal
      onClose={onClose}
      title={`${isEdit ? "update" : "Add"} Note`}
      {...rest}
    >
      <TextField
        {...getTextFieldFormikProps(formik, "note")}
        label="Note"
        fullWidth
        multiline
        rows={5}
        disabled={isEdit && noteIsLoading}
      />
      <div className="mt-5">
        <LoadingButton
          size="large"
          loading={isLoading || updateLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          {isEdit ? "update" : "Add"} Note
        </LoadingButton>
      </div>
    </Modal>
  );
}
