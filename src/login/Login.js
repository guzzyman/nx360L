import {
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LoginImage from "assets/images/login.png";
import Logo from "common/Logo";
import PasswordTextField from "common/PasswordTextField";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimblex360LoginApi } from "./LoginStoreQuerySlice";
import { toggleExtendedAccessTokenAction } from "./LoginStoreSlice";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import LoginIssue from "./LoginIssue";
import useToggle from "hooks/useToggle";

function Login(props) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoginIssueDialog, toggleLoginIssueDialog] = useToggle();

  const extendedAccessToken = useSelector(
    (state) => state.login.extendedAccessToken
  );

  const [loginMutation, loginMutationMutationResult] =
    nimblex360LoginApi.useLoginMutation();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      username: yup.string().trim().required(),
      password: yup.string().trim().required(),
    }),
    onSubmit: async (values) => {
      try {
        const data = await loginMutation({
          ...values,
          username: values?.username?.endsWith(
            process.env.REACT_APP_AUTHENTICATION_USERNAME_SUFFIX
          )
            ? values.username
            : values.username.concat(
                process.env.REACT_APP_AUTHENTICATION_USERNAME_SUFFIX || ""
              ),
        }).unwrap();
        enqueueSnackbar(data?.defaultUserMessage || "Logged In Successful", {
          variant: "success",
        });
        navigate(RouteEnum.LOGIN_VERIFICATION);
      } catch (error) {
        // console.log("Login", JSON.stringify(error?.data));
        enqueueSnackbar(
          error?.data?.errors?.[0]?.defaultUserMessage ||
            error?.data?.defaultUserMessage ||
            "Invalid Crendentials",
          { variant: "error" }
        );
      }
    },
  });

  return (
    <>
      <div className="h-full flex">
        <div className="flex-1 flex justify-center items-center">
          <form className="max-w-md w-full p-8" onSubmit={formik.handleSubmit}>
            <div className="flex justify-center  flex-wrap">
              <Logo />
            </div>
            <Typography className="mb-8 text-center">
              Log in to your account
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              autoComplete="off"
              {...formik.getFieldProps("username")}
              error={!!formik.touched.username && !!formik.errors.password}
              helperText={!!formik.touched.username && formik.errors.password}
              InputProps={{
                ...(!!process.env.REACT_APP_AUTHENTICATION_USERNAME_SUFFIX
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          {process.env.REACT_APP_AUTHENTICATION_USERNAME_SUFFIX}
                        </InputAdornment>
                      ),
                    }
                  : {}),
              }}
            />
            <PasswordTextField
              fullWidth
              margin="normal"
              label="Password"
              autoComplete="off"
              {...formik.getFieldProps("password")}
              error={!!formik.touched.username && !!formik.errors.password}
              helperText={!!formik.touched.username && formik.errors.password}
            />
            <LoadingButton
              disabled={loginMutationMutationResult.isLoading}
              loading={loginMutationMutationResult.isLoading}
              loadingPosition="end"
              endIcon={<></>}
              fullWidth
              className="mt-8 mb-2"
              type="submit"
            >
              Login
            </LoadingButton>
            <div className="flex items-center justify-center">
              <FormControlLabel
                label="Remember Me"
                control={
                  <Checkbox
                    checked={extendedAccessToken}
                    onChange={(e) =>
                      dispatch(
                        toggleExtendedAccessTokenAction(e.target.checked)
                      )
                    }
                  />
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <Link onClick={toggleLoginIssueDialog}>
                Having issues signing in? CLICK HERE
              </Link>
            </div>
          </form>
        </div>
        <div className="hidden md:block flex-1">
          <img src={LoginImage} alt="login" className="w-full h-full" />
        </div>
      </div>
      {isLoginIssueDialog && <LoginIssue onClose={toggleLoginIssueDialog} />}
    </>
  );
}

export default Login;
