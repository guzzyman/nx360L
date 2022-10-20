import { DatePicker, LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Icon,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import { ReconciliationApi } from "api/ReconciliationApi";
import { yupFileSchema } from "common/Utils";

function DisbursementUpload({ open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const [uploadMuation, uploadMuationResult] =
    ReconciliationApi.useUploadReconciliationDisbursementMutation();

  const formik = useFormik({
    initialValues: {
      // date: null,
      file: null,
    },
    validationSchema: yup.object({
      // date: yup.date().max(new Date()).required(),
      file: yupFileSchema().required(),
    }),
    onSubmit: async (values) => {
      try {
        const data = await uploadMuation({ data: values }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage || "Bank Statement Upload Successful",
          {
            variant: "success",
          }
        );
        handleClose();
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.[0]?.defaultUserMessage ||
            "Failed to Upload Bank Statement",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const dropzone = useDropzone({
    multiple: false,
    accept: [".xls", ".xlsx", ".csv"],
    onDropAccepted: async (files) => {
      try {
        let file = files[0];
        await formik.setFieldValue("file", file);
      } catch (error) {
        enqueueSnackbar(`Failed to attach files`, { variant: "error" });
      }
    },
  });

  function handleClose(params) {
    formik.resetForm();
    onClose();
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Upload Bank Statement</DialogTitle>
      <DialogContent>
        {/* <div className="flex justify-center mb-4">
          <DatePicker
            label="Select Date"
            value={formik.values.date}
            disableFuture
            onChange={(newValue) => {
              formik.setFieldValue("date", newValue);
            }}
            renderInput={(params) => <TextField {...params} margin="normal" />}
          />
        </div> */}
        <div {...dropzone.getRootProps()}>
          <input {...dropzone.getInputProps()} />
          <div className="border border-dashed flex flex-col items-center justify-center p-4 h-44 bg-gray-50">
            {formik.values.file ? (
              <Typography>{formik.values.file.name}</Typography>
            ) : (
              <>
                <Icon
                  className="material-icons-outlined text-4xl mb-4"
                  color="primary"
                >
                  cloud_upload
                </Icon>
                <Typography>Drag and drop or browse your files</Typography>
                <Typography>Supported file types: .xls, .xlsx, .csv</Typography>
              </>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        <LoadingButton
          onClick={formik.handleSubmit}
          loading={uploadMuationResult.isLoading}
        >
          Upload
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default DisbursementUpload;
