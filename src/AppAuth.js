import { lazy } from "react";
import { RouteEnum } from "common/Constants";
import { useRoutes, Navigate } from "react-router-dom";
import Suspense from "common/Suspense";
import useAuthUser from "hooks/useAuthUser";

function AppAuth(props) {
  const authUser = useAuthUser();

  const navigateToDashboardElement = <Navigate to={RouteEnum.LOGIN} replace />;

  const routes = useRoutes([
    {
      path: "/*",
      element: navigateToDashboardElement,
    },
    { path: RouteEnum.LOGIN, element: <Login /> },
    {
      path: RouteEnum.LOGIN_VERIFICATION,
      element: !!authUser ? (
        <LoginOTPVerification />
      ) : (
        navigateToDashboardElement
      ),
    },
  ]);

  return <Suspense>{routes}</Suspense>;
}

export default AppAuth;

const Login = lazy(() => import("login/Login"));
const LoginOTPVerification = lazy(() => import("login/LoginOTPVerification"));
