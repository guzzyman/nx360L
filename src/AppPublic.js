import { lazy } from "react";
import Suspense from "common/Suspense";
import { Navigate, useRoutes } from "react-router-dom";
import { configureRoutes } from "common/Utils";
import "./App.css";
import { RouteEnum } from "common/Constants";

function AppPublic() {
  const routes = useRoutes(ROUTES);

  return <Suspense>{routes}</Suspense>;
}

const ROUTES = configureRoutes(
  [
    {
      index: true,
      element: <Navigate to="/" replace />,
    },
    {
      path: RouteEnum.CREDIT_DIRECT_PAY,
      element: lazy(() => import("credit-direct-pay/CreditDirectPay")),
    },
    {
      path: RouteEnum.CRM_CLIENTS_LOAN_AGREEMENT_FORM,
      element: lazy(() => import("crm-client/CRMClientLoanAgrrementForm")),
    },
    {
      path: RouteEnum.SURVEYS_CLIENT,
      element: lazy(() =>
        import("client-x-lead-x-employer/ClientXLeadXEmployerSurveyPublicForm")
      ),
    },
  ],
  { parentPath: "/_/" }
);

export default AppPublic;
