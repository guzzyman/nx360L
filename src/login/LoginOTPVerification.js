import { useMemo } from "react";
import {
  Paper,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import BackButton from "common/BackButton";
import Logo from "common/Logo";
import { ReactComponent as LoginVericationLockOpenSvg } from "assets/svgs/login-verification-lock-open.svg";
import useAuthUser from "hooks/useAuthUser";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimblex360LoginApi } from "./LoginStoreQuerySlice";
import { useSnackbar } from "notistack";
import useCountdown from "hooks/useCountdown";
import useLogout from "hooks/useLogout";
import useDebouncedState from "hooks/useDebouncedState";
import { useSelector } from "react-redux";

function LoginOTPVerification(props) {
  const { logout } = useLogout();

  const { enqueueSnackbar } = useSnackbar();

  const authUser = useAuthUser();

  const extendedAccessToken = useSelector(
    (state) => state.login.extendedAccessToken
  );

  const OTP_REQUEST_PARAMS = {
    deliveryMethod: "email",
    extendedToken: extendedAccessToken,
  };

  const countdown = useCountdown(
    useMemo(() => {
      const date = new Date();
      date.setTime(
        authUser?.otpRequest?.requestTime +
          authUser?.otpRequest?.tokenLiveTimeInSec * 1000
      );
      return date;
    }, [
      authUser?.otpRequest?.requestTime,
      authUser?.otpRequest?.tokenLiveTimeInSec,
    ])
  );

  const [isResendOTP] = useDebouncedState(
    countdown.completed || (countdown.completedIdle && !!authUser?.otpRequest),
    {
      enableReInitialize: true,
      wait: 2000,
    }
  );

  nimblex360LoginApi.useGetLoginOTPDeliveryMethodsQuery(undefined, {
    skip: !authUser || !!authUser?.otpRequest,
  });

  nimblex360LoginApi.useRequestLoginOTPQuery(OTP_REQUEST_PARAMS, {
    skip: !authUser?.otpDeliveryMethods || !!authUser?.otpRequest,
  });

  const [resendOTPMutataion] = nimblex360LoginApi.useResendLoginOTPMutation();

  const [validateLoginOTPMutation, validateLoginOTPMutationResult] =
    nimblex360LoginApi.useValidateLoginOTPMutation();

  const formik = useFormik({
    initialValues: { token: "" },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      token: yup.string().trim().length(5).required(),
    }),
    onSubmit: async (values) => {
      try {
        await validateLoginOTPMutation(values).unwrap();
        enqueueSnackbar("Verified Successful", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Invalid OTP", { variant: "error" });
      }
    },
  });

  async function resendOTP() {
    try {
      await resendOTPMutataion(OTP_REQUEST_PARAMS).unwrap();
      enqueueSnackbar("Sent", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to Resend OTP", { variant: "error" });
    }
  }

  return (
    <div className="h-full p-4">
      <BackButton onClick={logout} />
      <div className="flex flex-col gap-8 justify-center items-center mt-4">
        <div className="">
          <Logo />
        </div>

        <Paper elevation={4} className="p-10 w-full max-w-md">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-center items-center mb-8">
              <LoginVericationLockOpenSvg />
            </div>
            <Typography className="text-center font-bold" variant="h5">
              Verify Login
            </Typography>
            <Typography className="text-center mb-8">
              Enter six (6) digit verification code sent <br></br> to{" "}
              {authUser?.otpRequest?.deliveryMethod?.target || "******@*****"}{" "}
              to continue
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Verification Code"
              {...formik.getFieldProps("token")}
              error={!!formik.touched.token && !!formik.errors.token}
              helperText={!!formik.touched.token && formik.errors.token}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography color="primary">
                      {countdown.minutes}:
                      {countdown.seconds < 10
                        ? `0${countdown.seconds}`
                        : countdown.seconds}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            {isResendOTP && (
              <div className="flex justify-center">
                <Button variant="text" onClick={resendOTP}>
                  Resend OTP
                </Button>
              </div>
            )}
            <LoadingButton
              disabled={validateLoginOTPMutationResult.isLoading}
              loading={validateLoginOTPMutationResult.isLoading}
              loadingPosition="end"
              endIcon={<></>}
              fullWidth
              className="mt-8"
              type="submit"
            >
              Submit
            </LoadingButton>
          </form>
        </Paper>
      </div>
    </div>
  );
}

export default LoginOTPVerification;
