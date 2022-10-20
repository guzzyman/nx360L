import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import * as yup from "yup";
import { nxClientDetailsLoanApi } from "./CRMClientDetailsLoanStoreQuerySlice";

function CRMClientDetailsLoanLinkGenerationModal(props) {
  const { onClose, data, client, ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [
    generateClientDetailsLoanLinkMutation,
    generateClientDetailsLoanLinkMutationResult,
  ] = nxClientDetailsLoanApi.useGenerateClientDetailsLoanLinkMutation();

  const LINK_TYPE_OPTIONS = useMemo(() => {
    return [
      ...(data?.paymentMethod && data?.status?.id === 300
        ? [
            { label: "TOKENIZE", value: "tokenization" },
            { label: "REPAYMENT", value: "repayment" },
            // { label: "PREPAY", value: "prepay" },
            // { label: "FORECLOSURE", value: "foreclosure" },
          ]
        : [
            { label: "LAF & REPAYMENT METHOD", value: "tokenization" },
            ...(data?.isExternalService &&
            !data?.externalDownPaymentDate &&
            !data?.externalDownPaymentUserId
              ? [{ label: "DOWN PAYMENT", value: "down_payment" }]
              : []),
          ]),
      // "FUND_WALLET",
    ];
  }, [
    data?.externalDownPaymentDate,
    data?.externalDownPaymentUserId,
    data?.isExternalService,
    data?.paymentMethod,
    data?.status?.id,
  ]);

  const MODE_OPTIONS = useMemo(() => {
    return [
      { label: "Mobile", value: "mobile" },
      { label: "Email", value: "email" },
    ].reduce((acc, curr) => {
      if (
        (curr.value === "mobile" && !client?.clients?.mobileNo) ||
        (curr.value === "email" && !client?.clients?.emailAddress)
      ) {
        return acc;
      }
      acc.push(curr);
      return acc;
    }, []);
  }, [client?.clients?.emailAddress, client?.clients?.mobileNo]);

  const formik = useFormik({
    initialValues: {
      command: "",
      mode: "",
    },
    validationSchema: yup.object({
      command: yup.string().label("Link Type").required(),
      mode: yup.string().label("Mode").required(),
    }),
    onSubmit: async (values) => {
      try {
        const resData = await generateClientDetailsLoanLinkMutation({
          ...values,
          loanId: data?.id,
        }).unwrap();
        onClose();
        enqueueSnackbar(
          resData?.defaultUserMessage || "Link Generated Successfully",
          {
            variant: "success",
          }
        );
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.[0]?.defaultUserMessage ||
            "Failed to Generate Link",
          { variant: "error" }
        );
      }
    },
  });

  return (
    <Dialog fullWidth maxWidth="xs" {...rest}>
      <DialogTitle>Generate Link</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Link Type"
          required
          select
          placeholder="Select Link Type"
          {...getTextFieldFormikProps(formik, "command")}
        >
          {LINK_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {!!MODE_OPTIONS.length && (
          <TextField
            fullWidth
            margin="normal"
            label="Mode"
            required
            select
            placeholder="Select Mode"
            {...getTextFieldFormikProps(formik, "mode")}
          >
            {MODE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <LoadingButton
          disabled={generateClientDetailsLoanLinkMutationResult?.isLoading}
          loading={generateClientDetailsLoanLinkMutationResult.isLoading}
          loadingPosition="end"
          endIcon={<></>}
          onClick={formik.handleSubmit}
        >
          Generate
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default CRMClientDetailsLoanLinkGenerationModal;
