import React from "react";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getUserErrorMessage } from "common/Utils";
import { useNavigate, useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { format } from "date-fns";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { RouteEnum } from "common/Constants";

export default function ClientApprovalActivateAction(props) {
  const { onClose, reactivate, ...rest } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientActionsMutation();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      [`${reactivate ? "reactivationDate" : "activationDate"}`]: format(
        new Date(),
        "dd MMMM yyyy"
      ),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({}),

    onSubmit: async (values) => {
      try {
        await addMutation({
          clientId: id,
          params: { command: `${reactivate ? "reactivate" : "activate"}` },
          ...values,
        }).unwrap();
        enqueueSnackbar(
          `Client ${reactivate ? "reactivate" : "activate"} Successful!`,
          {
            variant: "success",
          }
        );
        navigate(RouteEnum.CRM_CLIENTS);
        onClose();
      } catch (error) {
        enqueueSnackbar(
          `Client ${reactivate ? "reactivate" : "activate"} Failed!`,
          {
            variant: "error",
          }
        );
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="" title="Activate Client" {...rest}>
      <div className="mt-4">
        {/* <div className=" max-w-3xl mb-4"> */}
        {/* <DesktopDatePicker              
value={formik.values?.approvedOnDate || new Date()}
            label="Activation date*"
            inputFormat="dd/MM/yyyy"
            minDate={daysFromNow(7, "past")}
            maxDate={new Date()}
            error={
              !formik.touched.activationDate && !formik.errors.activationDate
            } 
            helperText={
              !!formik.touched.activationDate && formik.errors.activationDate
            }
            onChange={(newValue) => {
              formik.setFieldValue(
                "activationDate",
                format(new Date(newValue), "dd MMMM yyyy")
              );
            }}
            value={formik.values?.activationDate || new Date()}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </div> */}
      </div>

      <div className="mt-5">
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          {reactivate ? "reactivate" : "activate"} Client
        </LoadingButton>
      </div>
    </Modal>
  );
}
