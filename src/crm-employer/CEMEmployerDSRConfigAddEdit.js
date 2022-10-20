import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  getTextFieldFormikProps,
  getCheckFieldFormikProps,
} from "common/Utils";
import { useParams } from "react-router-dom";
import { nimbleX360CRMEmployerApi } from "./CRMEmployerStoreQuerySlice";
import FormatToNumber from "common/FormatToNumber";
import { dateLocaleFormat } from "common/Constants";

export default function CEMEmployerDSRConfigAddEdit(props) {
  const { onClose, businessId, dsrConfigDetail, ...rest } = props;
  const isEdit = !!dsrConfigDetail;
  const { enqueueSnackbar } = useSnackbar();

  const [addDSRConfigMutation, addDSRConfigMutationResult] =
    nimbleX360CRMEmployerApi.useAddEmployerDSRConfigMutation();
  const [updateDSRConfigMutation, updateDSRConfigMutationResult] =
    nimbleX360CRMEmployerApi.useEditEmployerDSRConfigMutation();

  const config = dsrConfigDetail;
  const id = config?.id;

  const formik = useFormik({
    initialValues: {
      minTenure: config?.minTenure || 0,
      maxTenure: config?.maxTenure || 0,
      dsrNew: config?.dsrNew || 0,
      dsrReturning: config?.dsrReturning || 0,
      isEnabled: config?.isEnabled || true,
      dateFormat: "dd MMMM yyyy",
      locale: dateLocaleFormat.LOCALE,
    },
    validationSchema: yup.object({
      minTenure: yup.number().label("Minimum Tenure").required(),
      maxTenure: yup.number().label("Maximum Tenure").required(),
      dsrNew: yup.number().label("DSR New").required(),
      dsrReturning: yup.number().label("DSR Returning").required(),
      isEnabled: yup.boolean().label("Is Enabled").required(),
    }),
    onSubmit: async (values) => {
      try {
        const func = isEdit ? updateDSRConfigMutation : addDSRConfigMutation;

        const data = await func({
          businessId,
          id,
          params: { genericResultSet: "true" },
          ...values,
        }).unwrap();

        enqueueSnackbar(
          data?.defaultUserMessage ||
            `${isEdit ? "Edit" : "Added"} DSR Config Successfully!`,
          {
            variant: "success",
          }
        );
        onClose();
      } catch (error) {
        enqueueSnackbar(
          error.data.errors?.[0]?.defaultUserMessage ||
            `${isEdit ? "Edit" : "Set"} DSR Config Failed!`,
          {
            variant: "error",
          }
        );
      }
    },
  });

  return (
    <Dialog fullWidth {...rest}>
      <DialogTitle>{isEdit ? "Edit" : "Add"} DSR Config</DialogTitle>
      <>
        <DialogContent>
          <div className="grid grid-cols-3 gap-x-4">
            <TextField
              label="Minimum Tenure"
              InputProps={{
                inputComponent: FormatToNumber,
              }}
              margin="normal"
              fullWidth
              {...getTextFieldFormikProps(formik, "minTenure")}
            />
            <TextField
              label="Maximum Tenure"
              InputProps={{
                inputComponent: FormatToNumber,
              }}
              margin="normal"
              fullWidth
              {...getTextFieldFormikProps(formik, "maxTenure")}
            />
            <TextField
              label="DSR New"
              InputProps={{
                inputComponent: FormatToNumber,
              }}
              margin="normal"
              fullWidth
              {...getTextFieldFormikProps(formik, "dsrNew")}
            />

            <TextField
              label="DSR Returning"
              InputProps={{
                inputComponent: FormatToNumber,
              }}
              margin="normal"
              fullWidth
              {...getTextFieldFormikProps(formik, "dsrReturning")}
            />

            <FormControlLabel
              control={
                <Checkbox {...getCheckFieldFormikProps(formik, "isEnabled")} />
              }
              label="Is Enabled"
            />
          </div>
        </DialogContent>
      </>

      <DialogActions>
        <Button variant="outlined" onClick={() => onClose()}>
          Cancel
        </Button>
        <LoadingButton
          loading={
            addDSRConfigMutationResult.isLoading ||
            updateDSRConfigMutationResult.isLoading
          }
          onClick={formik.handleSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
