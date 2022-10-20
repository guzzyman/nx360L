import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import { configureRoutes } from "common/Utils";
import { RouteEnum } from "common/Constants";

function FixedDepositProduct(props) {
  return useRoutes(ROUTES);
}

export default FixedDepositProduct;

const ROUTES = configureRoutes(
  [
    {
      index: true,
      element: lazy(() => import("./RecurringDepositProductList")),
    },
    {
      path: RouteEnum.RECURRING_DEPOSIT_PRODUCT_ADD,
      element: lazy(() => import("./RecurringDepositProductCreateEdit")),
    },
    {
      path: RouteEnum.RECURRING_DEPOSIT_PRODUCT_EDIT,
      element: lazy(() => import("./RecurringDepositProductCreateEdit")),
    },
  ],
  {
    parentPath: RouteEnum.RECURRING_DEPOSIT_PRODUCT,
  }
);
