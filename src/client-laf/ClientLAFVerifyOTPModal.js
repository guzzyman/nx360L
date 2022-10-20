import { InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUserErrorMessage } from "common/Utils";
import { LoadingButton } from "@mui/lab";
import Modal from "common/Modal";
import { useSnackbar } from "notistack";
import useDataRef from "hooks/useDataRef";

export function ClientLAFVerifyOTPModal({
  open,
  onClose,
  data,
  useAcceptLafDocumentMutation,
  useResendLafDocumentTokenMutation,
  onSuccess,
  onError,
}) {
  const loanId = data?.loanId;

  const [LAFOTP, setLAFOTP] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const [validateWorkEmailOTP, { isLoading }] = useAcceptLafDocumentMutation();

  const [getLAFOTP, getLAFOTPResult] = useResendLafDocumentTokenMutation();

  const handleVerifyOtp = async () => {
    try {
      const data = await validateWorkEmailOTP({
        loanId: loanId,
        token: LAFOTP,
      }).unwrap();
      enqueueSnackbar(data?.defaultUserMessage || `Valid!`, {
        variant: "success",
      });
      typeof onSuccess === "function" && onSuccess(data);
      onClose();
    } catch (error) {
      enqueueSnackbar(
        getUserErrorMessage(error?.data?.errors) || `Invalid OTP!`,
        {
          variant: "error",
        }
      );
      typeof onError === "function" && onError(error);
    }
  };

  const handleResendOtp = async () => {
    try {
      const resp = await getLAFOTP({
        loanId,
        mode: "both",
      });

      enqueueSnackbar(resp?.defaultUserMessage || `OTP sent successfully!`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        getUserErrorMessage(error?.data?.errors) || `OTP failed to send!`,
        {
          variant: "error",
        }
      );
    }
  };

  const dataRef = useDataRef({ handleResendOtp });

  useEffect(() => {
    dataRef.current.handleResendOtp();
  }, [dataRef]);

  return (
    <Modal
      title="Kindly enter the verification code sent to your mobile number."
      open={open}
      onClose={onClose}
      cancel
    >
      <div>
        <TextField
          fullWidth
          label="OTP"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LoadingButton
                  onClick={handleResendOtp}
                  size="small"
                  disabled={getLAFOTPResult?.isFetching}
                  loading={getLAFOTPResult?.isFetching}
                  variant="outlined-opaque"
                  color="success"
                >
                  Resend OTP
                </LoadingButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setLAFOTP(e.target.value)}
        />

        <div className="mt-3 flex justify-center">
          <LoadingButton
            loading={isLoading}
            disabled={isLoading}
            size="small"
            onClick={handleVerifyOtp}
            className="whitespace-nowrap"
          >
            Verify OTP
          </LoadingButton>
        </div>
      </div>
    </Modal>
  );
}
