import { RouteEnum, UIPermissionEnum } from "common/Constants";
import { ReactComponent as ProductLoan } from "assets/svgs/product-loan.svg";

export const PRODUCTS = [
  {
    name: "Loan Products",
    description: "Add new or modify existing products",
    Icon: ProductLoan,
    to: RouteEnum.ADMINISTRATION_PRODUCTS_LOANS,
    permissions: [
      UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT,
      UIPermissionEnum.CREATE_DIVIDEND_SHAREPRODUCT_CHECKER,
    ],
  },
  {
    name: "Saving Products",
    description: "Add new or modify existing products",
    Icon: ProductLoan,
    to: RouteEnum.ADMINISTRATION_PRODUCTS,
    permissions: [UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT_CHECKER],
  },
  {
    name: "Share Products",
    description: "Add new or modify existing products",
    Icon: ProductLoan,
    to: RouteEnum.ADMINISTRATION_PRODUCTS,
    permissions: [UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT],
  },
  {
    name: "Charges",
    description: "Define Charges/Penalties for products",
    Icon: ProductLoan,
    to: RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES,
    permissions: [UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT_CHECKER],
  },
  {
    name: "Products Mix",
    description: "Define rules for taking multiple rules",
    Icon: ProductLoan,
    to: RouteEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX,
    permissions: [UIPermissionEnum.UPDATE_PRODUCTMIX],
  },
  {
    name: "Fixed Deposit Products",
    description: "Add new or modify existing products",
    Icon: ProductLoan,
    to: RouteEnum.FIXED_DEPOSIT_PRODUCT,
    permissions: [UIPermissionEnum.CREATE_SAVINGSPRODUCT_CHECKER],
  },
  {
    name: "Recurring Deposit",
    description: "Add, modify or inactivate a Recurring Deposit",
    Icon: ProductLoan,
    to: RouteEnum.RECURRING_DEPOSIT_PRODUCT,
    permissions: [UIPermissionEnum.UPDATE_LOANPRODUCT],
  },
  {
    name: "Rates",
    description: "Define rate for loan products",
    Icon: ProductLoan,
    to: RouteEnum.ADMINISTRATION_PRODUCTS_RATES,
    permissions: [UIPermissionEnum.UPDATE_LOANPRODUCT_CHECKER],
  },
  {
    name: "Floating Rates",
    description: "Floating rates for loan products",
    Icon: ProductLoan,
    to: RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES,
    permissions: [UIPermissionEnum.CREATE_SAVINGSPRODUCT],
  },
  {
    name: "Manage Tax Configurations",
    description: "Define Tax components and Tax Group",
    Icon: ProductLoan,
    to: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_COMPONENT_GROUPS,
    permissions: [UIPermissionEnum.UPDATE_SAVINGSPRODUCT],
  },
  {
    name: "Loan Decider",
    description: "Your loan Decisioning",
    Icon: ProductLoan,
    to: RouteEnum.ADMINISTRATION_PRODUCTS_LOAN_DECIDER,
    // permissions: [UIPermissionEnum.UPDATE_SAVINGSPRODUCT],
  },
  {
    name: "USSD Prequalification",
    description: "USSD Bank Schedule Prequalification",
    Icon: ProductLoan,
    to: RouteEnum.ADMINISTRATION_PRODUCTS_USSD_PREQUALIFICATION,
    // permissions: [UIPermissionEnum.UPDATE_SAVINGSPRODUCT],
  },
];
