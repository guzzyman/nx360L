import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimblex360LoginApi } from "./LoginStoreQuerySlice";
import { getTextFieldFormikProps } from "common/Utils";
import { useSnackbar } from "notistack";

function LoginIssue({ onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const [sendLoginIssueMutation, sendLoginIssueMutationResult] =
    nimblex360LoginApi.useSendLoginIssueMutation();

  const formik = useFormik({
    initialValues: {
      location: "",
      email: "",
      phone: "",
      body: "",
    },
    validationSchema: yup.object({
      email: yup.string().label("Email").email().required(),
      phone: yup.string().label("Phone Number").required(),
      body: yup.string().label("Message").trim().required(),
    }),
    onSubmit: async (values) => {
      try {
        const data = await sendLoginIssueMutation({
          email: "cdlitsupport@fcmb.com",
          // email: "olakunle.thompson@fcmb.com",
          subject: "Login Issue",
          body: `
          Email: ${values.email}
          Phone: ${values.phone}
          Location: ${values.location}

          ${values.body}
          `,
        }).unwrap();
        enqueueSnackbar(data?.defaultUserMessage || "Mail Sent", {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(
          error?.data?.defaultUserMessage ||
            error?.data?.errors?.[0]?.defaultUserMessage ||
            "Failed to Send Mail",
          {
            variant: "error",
          }
        );
      }
    },
  });

  return (
    <Dialog open fullWidth>
      <DialogTitle>Send Mail</DialogTitle>
      <DialogContent>
        <div className="grid sm:grid-cols-2 gap-x-4">
          <TextField
            required
            fullWidth
            margin="normal"
            label="Email"
            {...getTextFieldFormikProps(formik, "email")}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Phone Number"
            {...getTextFieldFormikProps(formik, "phone")}
          />
        </div>
        <TextField
          required
          fullWidth
          margin="normal"
          label="Location"
          {...getTextFieldFormikProps(formik, "location")}
        />
        <TextField
          required
          fullWidth
          margin="normal"
          multiline
          minRows={4}
          label="Message"
          {...getTextFieldFormikProps(formik, "body")}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          disabled={sendLoginIssueMutationResult.isLoading}
          loading={sendLoginIssueMutationResult.isLoading}
          loadingPosition="end"
          endIcon={<></>}
          onClick={formik.handleSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default LoginIssue;
