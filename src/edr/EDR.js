import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { configureRoutes } from "common/Utils";
import { RouteEnum } from "common/Constants";

function EDR(props) {
  return useRoutes(ROUTES);
}

export default EDR;

const ROUTES = configureRoutes(
  [
    {
      path: RouteEnum.EDR.concat("/*"),
      element: <Navigate to={RouteEnum.EDR} replace />,
    },
    {
      index: true,
      element: lazy(() => import("edr-inflow/EDRInflowList")),
    },
    {
      path: RouteEnum.EDR_DETAILS,
      element: lazy(() => import("edr-inflow/EDRInflowDetails")),
    },
    {
      path: RouteEnum.EDR_CREATE,
      element: lazy(() => import("edr-inflow/EDRInflowCreateEdit")),
    },
    {
      path: RouteEnum.EDR_EDIT,
      element: lazy(() => import("edr-inflow/EDRInflowCreateEdit")),
    },
    // {
    //   path: RouteEnum.EDR_UNPROCESSED,
    //   element: lazy (() => import ('edr-unprocessed/EDRUnProcessed')),
    // },
    // {
    //   path: RouteEnum.EDR_UNPROCESSED_DETAILS,
    //   element: lazy (() => import ('edr-unprocessed/EDRUnProcessedDetails')),
    // },
    {
      path: RouteEnum.EDR_PARTIALLY_PROCESSED,
      element: lazy(() =>
        import("edr-partially-processed/EDRPartiallyProcessed")
      ),
    },
    {
      path: RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS,
      element: lazy(() =>
        import("edr-partially-processed/EDRPartiallyProcessedDetails")
      ),
    },
    {
      path: RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS_BREAKDOWN_DETAILS,
      element: lazy(() =>
        import(
          "edr-partially-processed/EDRPartiallyProcessedDetailsBreakdownDetails"
        )
      ),
    },
    {
      path: RouteEnum.EDR_FULLY_PROCESSED,
      element: lazy(() => import("edr-fully-processed/EDRFullyProcessed")),
    },
    {
      path: RouteEnum.EDR_FULLY_PROCESSED_DETAILS,
      element: lazy(() =>
        import("edr-fully-processed/EDRFullyProcessedDetails")
      ),
    },
    {
      path: RouteEnum.EDR_FULLY_PROCESSED_DETAILS_BREAKDOWN_DETAILS,
      element: lazy(() =>
        import("edr-fully-processed/EDRFullyProcessedDetailsBreakdownDetails")
      ),
    },
    {
      path: RouteEnum.EDR_APPROVAL,
      element: lazy(() =>
        import("edr-single-repayment-approval/EDRSingleRepaymentApproval")
      ),
    },
    {
      path: RouteEnum.EDR_OVERDUE_LOAN,
      element: lazy(() => import("edr-loans/EDRLoansOverdue")),
    },
    {
      path: RouteEnum.EDR_FUND_VENDORS,
      element: lazy(() => import("edr-fund-vendors/EDRFundVendors")),
    },
  ],
  {
    parentPath: RouteEnum.EDR,
  }
);
