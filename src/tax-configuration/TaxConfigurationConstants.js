import { RouteEnum } from "common/Constants";
import { ReactComponent as TaxConfigModules } from "assets/svgs/product-loan.svg";

export const TAXCONFIGURATION = [
  {
    name: "Manage Tax Components",
    description: "Define Tax Components",
    Icon: TaxConfigModules,
    to: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_COMPONENTS,
  },
  {
    name: "Manage Tax Groups",
    description: "Define Tax Groups",
    Icon: TaxConfigModules,
    to: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_GROUPS,
  },
];
