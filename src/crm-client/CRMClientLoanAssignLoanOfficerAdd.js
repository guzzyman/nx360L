import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import { MenuItem, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

export default function CRMClientLoanAssignLoanOfficerAdd(props) {
  const { onClose, clientLoanQueryResult, ...rest } = props;

  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientLoanAssignLoanMutation();

  const { data: templateOptionData } =
    nimbleX360CRMClientApi.useGetClientLoadDetailsQuery({
      loanId,
      fields: "id,loanOfficerId,loanOfficerOptions",
      staffInSelectedOfficeOnly: true,
      template: true,
    });

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
      assignmentDate: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({
          loanId,
          params: { command: "assignloanofficer" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Assign Loan Officer Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Assign Loan Officer Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Assign Loan Officer" {...rest}>
      <div className="mt-4">
        <div className="mb-4">
          <TextField
            label="To loan officer"
            fullWidth
            {...getTextFieldFormikProps(formik, "toLoanOfficerId")}
            select
          >
            {templateOptionData &&
              templateOptionData?.loanOfficerOptions?.map((data, index) => (
                <MenuItem value={data.id} key={index}>
                  {data.displayName}
                </MenuItem>
              ))}
          </TextField>
        </div>
      </div>

      <div className="mt-5">
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Assign Loan Officer
        </LoadingButton>
      </div>
    </Modal>
  );
}
