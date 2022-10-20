import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { configureRoutes } from "common/Utils";
import { RouteEnum } from "common/Constants";

function Disbursement(props) {
  return useRoutes(ROUTES);
}

export default Disbursement;

const ROUTES = configureRoutes(
  [
    {
      path: RouteEnum.EDR.concat("/*"),
      element: <Navigate to={RouteEnum.DISBURSEMENTS} replace />,
    },
    {
      index: true,
      element: lazy(() => import("./DisbursementList")),
    },
    {
      path: RouteEnum.DISBURSEMENTS_DETAILS,
      element: lazy(() => import("./DisbursementDetails")),
    },
  ],
  {
    parentPath: RouteEnum.DISBURSEMENTS,
  }
);
