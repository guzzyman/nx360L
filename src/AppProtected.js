import { lazy, useEffect } from "react";
import { Container, useMediaQuery } from "@mui/material";
import {
  RouteEnum,
  MediaQueryBreakpointEnum,
  APP_SIDE_MENU_WIDTH,
  UIPermissionEnum,
  DOCUMENT_PREVIEW_SIDE_MENU_WIDTH,
} from "common/Constants";
import { useRoutes, Navigate } from "react-router-dom";
import Suspense from "common/Suspense";
import AppProtectedHeader from "AppProtectedHeader";
import AppProtectedSideMenu from "AppProtectedSideMenu";
import { nimbleX360Api } from "common/StoreQuerySlice";
import LoadingContent from "common/LoadingContent";
import IdleTimer from "common/IdleTimer";
import useLogout from "hooks/useLogout";
import { configureRoutes } from "common/Utils";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";
import useDocumentPreviewSideMenu from "hooks/useDocumentPreviewSideMenu";

function AppProtected(props) {
  const islg = useMediaQuery(MediaQueryBreakpointEnum.lg);
  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);
  const { logoutMutation } = useLogout();
  const authUserUIPermissionRestrictor = useAuthUserUIPermissionRestrictor();

  const { isDocumentPreviewSideMenu } = useDocumentPreviewSideMenu();

  const authUserProfileQueryResult = nimbleX360Api.useGetAuthUserProfileQuery();

  useEffect(() => {
    const logout = () => logoutMutation();
    const idleTimer = new IdleTimer({
      timeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT) * 60 * 1000,
      onTimeout: logout,
      // onLoadTimeout: logout,
    });
    return () => {
      idleTimer.cleanUp();
    };
  }, [logoutMutation]);

  useEffect(() => {
    function closeIt(e) {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to exit?");
    }
    window.addEventListener("beforeunload", closeIt);
    return () => {
      window.removeEventListener("beforeunload", closeIt);
    };
  }, []);

  function routeUIRestrictorFilter(routes) {
    return routes?.reduce((acc, curr) => {
      if (hasPermission(curr)) {
        if (curr.children?.length) {
          curr.children = routeUIRestrictorFilter(curr.children);
        }
        acc?.push(curr);
      }
      return acc;
    }, []);

    function hasPermission(route) {
      const permissions = Object.assign([], route?.permissions);
      return route?.validateAllPermissions
        ? route?.negatePermissionsValidation
          ? !authUserUIPermissionRestrictor.hasPermissions(...permissions)
          : authUserUIPermissionRestrictor.hasPermissions(...permissions)
        : route?.negatePermissionsValidation
        ? !authUserUIPermissionRestrictor.hasPermission(...permissions)
        : authUserUIPermissionRestrictor.hasPermission(...permissions);
    }
  }

  const routes = useRoutes(
    routeUIRestrictorFilter([
      {
        path: "/*",
        index: true,
        element: <Navigate to={RouteEnum.DASHBOARD} replace />,
      },
      ...ROUTES,
    ])
  );

  return (
    <LoadingContent
      loading={authUserProfileQueryResult.isLoading}
      error={authUserProfileQueryResult.isError}
      onReload={authUserProfileQueryResult.refetch}
    >
      {() => (
        <>
          <AppProtectedHeader />
          <AppProtectedSideMenu />
          <div
            className="h-full"
            style={{
              marginLeft:
                islg && !isDocumentPreviewSideMenu ? APP_SIDE_MENU_WIDTH : 0,
              marginRight:
                islg && isDocumentPreviewSideMenu
                  ? DOCUMENT_PREVIEW_SIDE_MENU_WIDTH
                  : 0,
              paddingTop: ismd ? 64 : 56,
            }}
          >
            <Container maxWidth="xl" className="h-full">
              <Suspense>{routes}</Suspense>
            </Container>
          </div>
        </>
      )}
    </LoadingContent>
  );
}

export default AppProtected;

const ROUTES = configureRoutes([
  {
    path: RouteEnum.DASHBOARD,
    element: lazy(() => import("dashboard/Dashboard")),
  },
  {
    path: RouteEnum.CRM_CLIENTS,
    element: lazy(() => import("crm-client/CRMClient")),
    permissions: [UIPermissionEnum.READ_CLIENT],
    children: [
      {
        index: true,
        element: lazy(() => import("crm-client/CRMClientList")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_DETAILS,
        element: lazy(() => import("crm-client/CRMClientDetails")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_ADD,
        element: lazy(() => import("crm-client/CRMClientAddEditForm")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_ADD_INSTANCE,
        element: lazy(() => import("crm-client/CRMClientAddEditForm")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_ADD_FROM_LEAD,
        element: lazy(() => import("crm-client/CRMClientAddEditForm")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_EDIT,
        element: lazy(() => import("crm-client/CRMClientAddEditForm")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_LOAN_ADD,
        element: lazy(() => import("crm-client/CRMClientLoanAddEdit")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_LOAN_EDIT,
        element: lazy(() => import("crm-client/CRMClientLoanAddEdit")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_LOAN_DETAILS,
        element: lazy(() => import("crm-client/CRMClientDetailsLoan")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_FIXED_DEPOSIT_DETAILS,
        element: lazy(() => import("crm-client/CRMClientDetailsFixedDeposit")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_WALLET_DETAILS,
        element: lazy(() => import("crm-client/CRMClientDetailsWallet")),
      },
      {
        path: RouteEnum.CRM_CLIENT_FIXED_DEPOSIT_ADD,
        element: lazy(() => import("crm-client/CRMClientFixedDepositAddEdit")),
      },
      {
        path: RouteEnum.CRM_CLIENT_FIXED_DEPOSIT_EDIT,
        element: lazy(() => import("crm-client/CRMClientFixedDepositAddEdit")),
      },
      {
        path: RouteEnum.CRM_CLIENT_REOCCURRING_FIXED_DEPOSIT_ADD,
        element: lazy(() => import("crm-client/CRMClientFixedDepositAddEdit")),
      },
      {
        path: RouteEnum.CRM_CLIENT_REOCCURRING_FIXED_DEPOSIT_EDIT,
        element: lazy(() => import("crm-client/CRMClientFixedDepositAddEdit")),
      },
      {
        path: RouteEnum.CRM_CLIENTS_REOCCURRING_FIXED_DEPOSIT_DETAILS,
        element: lazy(() => import("crm-client/CRMClientDetailsFixedDeposit")),
      },
      {
        path: RouteEnum.CRM_LEADS_LOAN_DETAILS_PENDING_VALIDATION,
        element: lazy(() =>
          import("crm-client/CRMClientDetailsLoanPendingValidation")
        ),
      },
    ],
  },
  {
    path: RouteEnum.ACCOUNTING,
    element: lazy(() => import("accounting/Accounting")),
  },
  {
    path: RouteEnum.CHARTOFACCOUNTS,
    element: lazy(() => import("accounting/ChartOfAccount")),
  },
  {
    path: RouteEnum.CHARTOFACCOUNTS_ADD,
    element: lazy(() => import("accounting/AddChartOfAccount")),
  },
  {
    path: RouteEnum.CHARTOFACCOUNTS_ADD_SUBLEDGER,
    element: lazy(() => import("accounting/AddChartOfAccount")),
  },
  {
    path: RouteEnum.CHARTOFACCOUNTS_EDIT,
    element: lazy(() => import("accounting/AddChartOfAccount")),
  },
  {
    path: RouteEnum.CHARTOFACCOUNTS_DETAILS,
    element: lazy(() => import("accounting/ChartOfAccountDetails")),
  },
  {
    path: RouteEnum.ACCOUNTING_JOURNAL_ENTRIES_SEARCH,
    element: lazy(() => import("journal-entries/SearchJournalEntries")),
  },
  {
    path: RouteEnum.ACCOUNTING_JOURNAL_ENTRIES_ADD,
    element: lazy(() => import("journal-entries/JournalEntryCreate")),
  },
  {
    path: RouteEnum.ACCOUNTING_JOURNAL_ENTRIES_DETAILS,
    element: lazy(() => import("journal-entries/JournalEntryDetails")),
  },
  {
    path: RouteEnum.REPORT,
    element: lazy(() => import("reports/ReportList")),
  },
  {
    path: RouteEnum.REPORT_DETAILS,
    element: lazy(() => import("reports/ReportDetails")),
  },
  // {
  //   path: RouteEnum.REPORT,
  //   element: lazy(() => import("reports/Report")),
  //   children: [
  //     {
  //       index: true,
  //       element: lazy(() => import("reports/ReportList")),
  //     },
  //     {
  //       path: RouteEnum.REPORT_DETAILS,
  //       element: lazy(() => import("reports/ReportDetails")),
  //     },
  //   ],
  // },
  {
    path: RouteEnum.ADMINISTRATION_PRODUCTS,
    element: lazy(() => import("product/Product")),
    permissions: [
      UIPermissionEnum.READ_CDL_CONFIGURATION,
      UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT,
      UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT_CHECKER,
      UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT,
      UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT_CHECKER,
      UIPermissionEnum.UPDATE_PRODUCTMIX,
      UIPermissionEnum.CREATE_SAVINGSPRODUCT_CHECKER,
      UIPermissionEnum.UPDATE_LOANPRODUCT,
      UIPermissionEnum.UPDATE_LOANPRODUCT_CHECKER,
      UIPermissionEnum.CREATE_SAVINGSPRODUCT,
      UIPermissionEnum.UPDATE_SAVINGSPRODUCT,
    ],
    children: [
      {
        index: true,
        element: lazy(() => import("product/ProductList")),
        permissions: [
          UIPermissionEnum.READ_CDL_CONFIGURATION,
          UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT,
          UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT_CHECKER,
          UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT,
          UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT_CHECKER,
          UIPermissionEnum.UPDATE_PRODUCTMIX,
          UIPermissionEnum.CREATE_SAVINGSPRODUCT_CHECKER,
          UIPermissionEnum.UPDATE_LOANPRODUCT,
          UIPermissionEnum.UPDATE_LOANPRODUCT_CHECKER,
          UIPermissionEnum.CREATE_SAVINGSPRODUCT,
          UIPermissionEnum.UPDATE_SAVINGSPRODUCT,
          UIPermissionEnum.CREATE_DIVIDEND_SHAREPRODUCT_CHECKER,
          UIPermissionEnum.CREATE_DIVIDEND_SHAREPRODUCT,
        ],
      },
      {
        path: RouteEnum.ADMINISTRATION_PRODUCTS_LOANS,
        element: lazy(() => import("loan-product/LoanProduct")),
        permissions: [
          UIPermissionEnum.UPDATE_FIXEDDEPOSITACCOUNT,
          UIPermissionEnum.CREATE_DIVIDEND_SHAREPRODUCT_CHECKER,
        ],
        children: [
          {
            index: true,
            element: lazy(() => import("loan-product/LoanProductList")),
          },
          {
            path: RouteEnum.ADMINISTRATION_LOAN_PRODUCT_ADD,
            element: lazy(() => import("loan-product/LoanProductCreateEdit")),
            permissions: [UIPermissionEnum.CREATE_DIVIDEND_SHAREPRODUCT],
          },
          {
            path: RouteEnum.ADMINISTRATION_LOAN_PRODUCT_EDIT,
            element: lazy(() => import("loan-product/LoanProductCreateEdit")),
            permissions: [UIPermissionEnum.CREATE_DIVIDEND_SHAREPRODUCT],
          },
        ],
      },
      {
        path: RouteEnum.ADMINISTRATION_PRODUCTS_LOAN_DECIDER,
        element: lazy(() => import("loan-decider/LoanDecider")),
        permissions: [],
        children: [
          {
            index: true,
            element: lazy(() => import("loan-decider/LoanDeciderList")),
          },
          // {
          //   path: RouteEnum.ADMINISTRATION_PRODUCTS_LOAN_DECIDER_DETAILS,
          //   element: lazy(() => import("loan-decider/LoanDeciderDetails")),
          //   permissions: [],
          // },
        ],
      },
      {
        path: RouteEnum.ADMINISTRATION_PRODUCTS_RATES,
        element: lazy(() => import("rate-product/RateProduct")),
        permissions: [UIPermissionEnum.UPDATE_LOANPRODUCT_CHECKER],
        children: [
          {
            index: true,
            element: lazy(() => import("rate-product/RateProductList")),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_RATES_ADD,
            element: lazy(() => import("rate-product/RateProductCreateEdit")),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_RATES_EDIT,
            element: lazy(() => import("rate-product/RateProductCreateEdit")),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_RATES_DETAILS,
            element: lazy(() => import("rate-product/RateProductDetails")),
          },
        ],
      },
      {
        path: RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES,
        element: lazy(() => import("charge-product/ChargeProduct")),
        permissions: [UIPermissionEnum.UPDATE_FIXEDDEPOSITPRODUCT_CHECKER],
        children: [
          {
            index: true,
            element: lazy(() => import("charge-product/ChargeProductList")),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES_ADD,
            element: lazy(() =>
              import("charge-product/ChargeProductCreateEdit")
            ),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES_EDIT,
            element: lazy(() =>
              import("charge-product/ChargeProductCreateEdit")
            ),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES_DETAILS,
            element: lazy(() => import("charge-product/ChargeProductDetails")),
          },
        ],
      },
      {
        path: RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES,
        element: lazy(() => import("floating-rate/FloatingRate")),
        permissions: [UIPermissionEnum.CREATE_SAVINGSPRODUCT],
        children: [
          {
            index: true,
            element: lazy(() => import("floating-rate/FloatingRateList")),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES_ADD,
            element: lazy(() => import("floating-rate/FloatingRateCreateEdit")),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES_EDIT,
            element: lazy(() => import("floating-rate/FloatingRateCreateEdit")),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES_DETAILS,
            element: lazy(() => import("floating-rate/FloatingRateDetails")),
          },
        ],
      },
      {
        path: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_COMPONENT_GROUPS,
        element: lazy(() => import("tax-configuration/TaxConfigurationList")),
        permissions: [UIPermissionEnum.UPDATE_SAVINGSPRODUCT],
      },
      {
        path: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_GROUPS,
        element: lazy(() => import("tax-configuration/TaxConfigurationGroup")),
        children: [
          {
            index: true,
            element: lazy(() =>
              import("tax-configuration/TaxConfigurationGroupList")
            ),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_GROUPS_ADD,
            element: lazy(() =>
              import("tax-configuration/TaxConfigurationGroupCreateEdit")
            ),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_GROUPS_EDIT,
            element: lazy(() =>
              import("tax-configuration/TaxConfigurationGroupCreateEdit")
            ),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_GROUPS_DETAILS,
            element: lazy(() =>
              import("tax-configuration/TaxConfigurationGroupDetails")
            ),
          },
        ],
      },
      {
        path: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_COMPONENTS,
        element: lazy(() =>
          import("tax-configuration/TaxConfigurationComponent")
        ),
        children: [
          {
            index: true,
            element: lazy(() =>
              import("tax-configuration/TaxConfigurationComponentList")
            ),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_COMPONENTS_ADD,
            element: lazy(() =>
              import("tax-configuration/TaxConfigurationComponentCreateEdit")
            ),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_COMPONENTS_EDIT,
            element: lazy(() =>
              import("tax-configuration/TaxConfigurationComponentCreateEdit")
            ),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_COMPONENTS_DETAILS,
            element: lazy(() =>
              import("tax-configuration/TaxConfigurationComponentDetails")
            ),
          },
        ],
      },
      {
        path: RouteEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX,
        element: lazy(() => import("product-mix/ProductMix")),
        permissions: [UIPermissionEnum.UPDATE_PRODUCTMIX],
        children: [
          {
            index: true,
            element: lazy(() => import("product-mix/ProductMixList")),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX_ADD,
            element: lazy(() => import("product-mix/ProductMixCreateEdit")),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX_EDIT,
            element: lazy(() => import("product-mix/ProductMixCreateEdit")),
          },
        ],
      },
      {
        path: RouteEnum.ADMINISTRATION_PRODUCTS_USSD_PREQUALIFICATION,
        element: lazy(() => import("ussdPrequalification/UssdPrequalification")),
        children: [
          {
            index: true,
            element: lazy(() => import("ussdPrequalification/UssdPrequalificationList")),
          },
          {
            path: RouteEnum.ADMINISTRATION_PRODUCTS_USSD_PREQUALIFICATION_HISTORY,
            element: lazy(() => import("ussdPrequalification/UssdPrequalificationHistory")),
          },
        ],
      },
      {
        path: RouteEnum.FIXED_DEPOSIT_PRODUCT,
        element: lazy(() =>
          import("fixed-deposit-product/FixedDepositProduct")
        ),
        permissions: [UIPermissionEnum.CREATE_SAVINGSPRODUCT_CHECKER],
        children: [
          {
            index: true,
            element: lazy(() =>
              import("fixed-deposit-product/FixedDepositProductList")
            ),
          },
          {
            path: RouteEnum.FIXED_DEPOSIT_PRODUCT_ADD,
            element: lazy(() =>
              import("fixed-deposit-product/FixedDepositProductCreateEdit")
            ),
          },
          {
            path: RouteEnum.FIXED_DEPOSIT_PRODUCT_EDIT,
            element: lazy(() =>
              import("fixed-deposit-product/FixedDepositProductCreateEdit")
            ),
          },
        ],
      },
    ],
  },
  {
    path: RouteEnum.CRM_LEADS,
    element: lazy(() => import("crm-lead/CRMLead")),
    permissions: [UIPermissionEnum.READ_LEAD, UIPermissionEnum.CREATE_LEAD],
    children: [
      {
        index: true,
        element: lazy(() => import("crm-lead/CRMLeadList")),
        permissions: [UIPermissionEnum.READ_LEAD],
      },
      {
        path: RouteEnum.CRM_LEADS_DETAILS,
        element: lazy(() => import("crm-lead/CRMLeadDetails")),
        permissions: [UIPermissionEnum.READ_LEAD],
      },
      {
        path: RouteEnum.CRM_LEADS_ADD,
        element: lazy(() => import("crm-lead/CRMLeadAddEditForm")),
        permissions: [UIPermissionEnum.CREATE_LEAD],
      },
      {
        path: RouteEnum.CRM_LEADS_UPLOAD,
        element: lazy(() => import("crm-lead/CRMLeadUploadForm")),
        permissions: [UIPermissionEnum.CREATE_LEAD],
      },
      {
        path: RouteEnum.CRM_LEADS_ADD_INSTANCE,
        element: lazy(() => import("crm-lead/CRMLeadAddEditForm")),
        permissions: [UIPermissionEnum.CREATE_LEAD],
      },
      {
        path: RouteEnum.CRM_LEADS_EDIT,
        element: lazy(() => import("crm-lead/CRMLeadAddEditForm")),
        permissions: [UIPermissionEnum.CREATE_LEAD],
      },
    ],
  },
  {
    path: RouteEnum.CRM_EMPLOYER,
    element: lazy(() => import("crm-employer/CRMEmployer")),
    children: [
      {
        index: true,
        element: lazy(() => import("crm-employer/CRMEmployerList")),
      },
      {
        path: RouteEnum.CRM_EMPLOYER_DETAILS,
        element: lazy(() => import("crm-employer/CRMEmployerDetails")),
      },
      {
        path: RouteEnum.CRM_EMPLOYER_ADD,
        element: lazy(() => import("crm-employer/CRMEmployerAddEdit")),
      },
      {
        path: RouteEnum.CRM_EMPLOYER_ADD_BRANCH,
        element: lazy(() => import("crm-employer/CRMEmployerAddEdit")),
      },
      // {
      //   path: RouteEnum.CRM_LEADS_ADD_INSTANCE,
      //   element: lazy(() => import("crm-lead/CRMLeadAddEditForm")),
      // },
      {
        path: RouteEnum.CRM_EMPLOYER_EDIT,
        element: lazy(() => import("crm-employer/CRMEmployerAddEdit")),
      },
    ],
  },
  {
    path: RouteEnum.CRM_VENDOR,
    element: lazy(() => import("crm-vendor/CRMVendor")),
    children: [
      {
        index: true,
        element: lazy(() => import("crm-vendor/CRMVendorList")),
      },
      {
        path: RouteEnum.CRM_VENDOR_DETAILS,
        element: lazy(() => import("crm-vendor/CRMVendorDetails")),
      },
      {
        path: RouteEnum.CRM_VENDOR_ADD,
        element: lazy(() => import("crm-vendor/CRMVendorAddEdit")),
      },
      // {
      //   path: RouteEnum.CRM_LEADS_ADD_INSTANCE,
      //   element: lazy(() => import("crm-lead/CRMLeadAddEditForm")),
      // },
      {
        path: RouteEnum.CRM_VENDOR_EDIT,
        element: lazy(() => import("crm-vendor/CRMVendorAddEdit")),
      },
    ],
  },
  {
    path: RouteEnum.SEQUEST_REQUEST,
    element: lazy(() => import("./request/Request")),
    children: [
      {
        index: true,
        element: lazy(() => import("./request/RequestList")),
      },
      {
        path: RouteEnum.SEQUEST_REQUEST_DETAILS,
        element: lazy(() => import("./request/RequestDetails")),
      },
    ],
  },
  {
    path: RouteEnum.SEQUEST_EXCEPTION,
    element: lazy(() => import("./exception/Exception")),
    children: [
      {
        index: true,
        element: lazy(() => import("./exception/ExceptionList")),
      },
      {
        path: RouteEnum.SEQUEST_EXCEPTION_DETAILS,
        element: lazy(() => import("./exception/ExceptionDetails")),
      },
    ],
  },
  {
    path: RouteEnum.RECOVERY_MANAGEMENT,
    element: lazy(() => import("./recovery-management/RecoveryManagement")),
    permissions: [
      UIPermissionEnum.RECOVERYPAYMENT_LOAN,
      UIPermissionEnum.READ_RESCHEDULELOAN,
      UIPermissionEnum.APPROVE_RESCHEDULELOAN,
    ],
    children: [
      {
        index: true,
        element: lazy(() => import("./recovery/RecoveryList")),
      },
      {
        path: RouteEnum.RECOVERY,
        element: lazy(() => import("./recovery/RecoveryList")),
        permissions: [UIPermissionEnum.RECOVERYPAYMENT_LOAN],
      },
      {
        path: RouteEnum.RECOVERY_DETAILS,
        element: lazy(() => import("./recovery/RecoveryDetails")),
        permissions: [UIPermissionEnum.RECOVERYPAYMENT_LOAN],
      },
      {
        path: RouteEnum.RESCHEDULE_LOAN,
        element: lazy(() =>
          import("./recovery-management/RecoveryManageRescheduleLoan")
        ),
      },
      {
        path: RouteEnum.RESCHEDULE_LOAN_DETAIL,
        element: lazy(() =>
          import("./recovery-management/RecoveryManageRescheduleLoanDetails")
        ),
      },
    ],
  },
  {
    path: RouteEnum.TELESALES,
    element: lazy(() => import("./telesales/Telesales")),
    permissions: [UIPermissionEnum.READ_TELESALES],
    children: [
      {
        index: true,
        element: lazy(() => import("./telesales/TelesalesList")),
        permissions: [UIPermissionEnum.READ_TELESALES],
      },
      {
        path: RouteEnum.TELESALES_DETAILS,
        element: lazy(() => import("./telesales/TelesalesDetails")),
        permissions: [UIPermissionEnum.READ_TELESALES],
      },
    ],
  },
  {
    path: RouteEnum.TELESALES_DROPOFF_LOANS,
    element: lazy(() => import("./drop-off/DropOff")),
    permissions: [UIPermissionEnum.READ_TELESALES],
    children: [
      {
        index: true,
        element: lazy(() => import("./drop-off/DropOffList")),
        permissions: [UIPermissionEnum.READ_TELESALES],
      },
      {
        path: RouteEnum.TELESALES_DROPOFF_LOANS_DETAILS,
        element: lazy(() => import("./drop-off/DropOffDetails")),
        permissions: [UIPermissionEnum.READ_TELESALES],
      },
    ],
  },
  {
    path: RouteEnum.TELESALES_HOT_LEADS,
    element: lazy(() => import("./hot-lead/HotLead")),
    permissions: [
      UIPermissionEnum.READ_TELESALES,
      UIPermissionEnum.READ_SCHEDULER,
      UIPermissionEnum.READ_SMS,
      UIPermissionEnum.READ_SMSCAMPAIGN,
    ],
    children: [
      {
        index: true,
        element: lazy(() => import("./hot-lead/HotLeadList")),
      },
      {
        path: RouteEnum.TELESALES_HOT_LEADS_DETAILS,
        element: lazy(() => import("./hot-lead/HotLeadDetails")),
      },
    ],
  },
  {
    path: RouteEnum.EDR.concat("/*"),
    element: lazy(() => import("edr/EDR")),
    permissions: [UIPermissionEnum.READ_OFFICETRANSACTION],
  },
  {
    path: RouteEnum.LOAN_UNDER_WRITING,
    element: lazy(() => import("./loan-underwriting/LoanUnderwriting")),
    children: [
      {
        index: true,
        element: lazy(() =>
          import("./loan-underwriting/LoanUnderwritingPending")
        ),
      },
      {
        path: RouteEnum.LOAN_UNDER_WRITING_PENDING,
        element: lazy(() =>
          import("./loan-underwriting/LoanUnderwritingPending")
        ),
      },
    ],
  },
  {
    path: RouteEnum.CLIENT_APPROVAL,
    element: lazy(() => import("client-approval/ClientApproval")),
    permissions: [
      UIPermissionEnum.TRANSFERCLIENTS_GROUP,
      UIPermissionEnum.TRANSFERCLIENTS_GROUP_CHECKER,
    ],
  },
  {
    path: RouteEnum.USER,
    element: lazy(() => import("user-management/UserManagement")),
    permissions: [
      UIPermissionEnum.READ_USER,
      UIPermissionEnum.CREATE_USER_CHECKER,
    ],
    children: [
      {
        index: true,
        element: lazy(() => import("user-management/UserManagementList")),
        permissions: [
          UIPermissionEnum.READ_USER,
          UIPermissionEnum.CREATE_USER_CHECKER,
        ],
      },
    ],
  },
  {
    path: RouteEnum.USER_ADD,
    element: lazy(() => import("user-management/UserManagementCreateEdit")),
    permissions: [UIPermissionEnum.CREATE_USER],
  },
  {
    path: RouteEnum.USER_EDIT,
    element: lazy(() => import("user-management/UserManagementCreateEdit")),
    permissions: [UIPermissionEnum.UPDATE_USER],
  },
  {
    path: RouteEnum.USER_DETAILS,
    element: lazy(() => import("user-management/UserManagementDetails")),
    permissions: [UIPermissionEnum.READ_USER],
  },
  {
    path: RouteEnum.STAFF_EDIT,
    element: lazy(() => import("user-management/StaffManagementCreateEdit")),
    permissions: [UIPermissionEnum.UPDATE_USER],
  },
  {
    path: RouteEnum.STAFF_DETAILS,
    element: lazy(() => import("user-management/StaffManagementDetails")),
    permissions: [UIPermissionEnum.CREATE_USER_CHECKER],
  },
  {
    path: RouteEnum.SYSTEM,
    element: lazy(() => import("system/System")),
    children: [
      {
        index: true,
        element: lazy(() => import("system/SystemList")),
      },
      {
        path: RouteEnum.DOCUMENT_CONFIGURATIONS,
        element: lazy(() =>
          import("document-configuration/DocumentConfiguration")
        ),
        children: [
          {
            index: true,
            element: lazy(() =>
              import("document-configuration/DocumentConfigurationList")
            ),
          },
          {
            path: RouteEnum.DOCUMENT_CONFIGURATIONS_ADD,
            element: lazy(() =>
              import("document-configuration/DocumentConfigurationAddEdit")
            ),
          },
          {
            path: RouteEnum.DOCUMENT_CONFIGURATIONS_EDIT,
            element: lazy(() =>
              import("document-configuration/DocumentConfigurationAddEdit")
            ),
          },
          {
            path: RouteEnum.DOCUMENT_CONFIGURATIONS_SETTINGS,
            element: lazy(() =>
              import("document-configuration/DocumentConfigurationSettings")
            ),
          },
        ],
      },
      {
        path: RouteEnum.SURVEYS,
        element: lazy(() => import("system-survey/SystemSurveys")),
        children: [
          {
            index: true,
            element: lazy(() => import("system-survey/SystemSurveyList")),
          },
          {
            path: RouteEnum.SURVEYS_ADD,
            element: lazy(() => import("system-survey/SystemSurveyCreateEdit")),
          },
          {
            path: RouteEnum.SURVEYS_EDIT,
            element: lazy(() => import("system-survey/SystemSurveyCreateEdit")),
          },
        ],
      },
      {
        path: RouteEnum.ROLES,
        element: lazy(() => import("role/Role")),
        children: [
          {
            index: true,
            element: lazy(() => import("role/RoleList")),
          },
          {
            path: RouteEnum.ROLES_ADD,
            element: lazy(() => import("role/RoleCreateEdit")),
          },
          {
            path: RouteEnum.ROLES_EDIT,
            element: lazy(() => import("role/RoleCreateEdit")),
          },
          {
            path: RouteEnum.ROLES_PERMISSIONS_ADD,
            element: lazy(() => import("role/RolePermissionsEdit")),
          },
        ],
      },
    ],
  },
  {
    path: RouteEnum.ADMINISTRATION_ORGANISATION,
    element: lazy(() => import("organization/Organization")),
    children: [
      {
        index: true,
        element: lazy(() => import("organization/OrganizationList")),
      },
      // {
      //   path: RouteEnum.ADMINISTRATION_ORGANISATION_EMPLOYEES,
      //   element: lazy(() =>
      //     import("organization-employee/OrganizationEmployee")
      //   ),
      //   children: [
      //     {
      //       index: true,
      //       element: lazy(() =>
      //         import("organization-employee/OrganizationEmployeeList")
      //       ),
      //     },
      //     {
      //       path: RouteEnum.ADMINISTRATION_ORGANISATION_EMPLOYEES_ADD,
      //       element: lazy(() =>
      //         import("organization-employee/OrganizationEmployeeCreateEdit")
      //       ),
      //     },
      //     {
      //       path: RouteEnum.ADMINISTRATION_ORGANISATION_EMPLOYEES_EDIT,
      //       element: lazy(() =>
      //         import("organization-employee/OrganizationEmployeeCreateEdit")
      //       ),
      //     },
      //   ],
      // },
    ],
  },
  {
    path: RouteEnum.RECURRING_DEPOSIT_PRODUCT.concat("/*"),
    element: lazy(() =>
      import("recurring-deposit-product/RecurringDepositProduct")
    ),
    permissions: [UIPermissionEnum.UPDATE_LOANPRODUCT],
  },
  {
    path: RouteEnum.BANK_SCHEDULE,
    element: lazy(() => import("./bank-schedule/BankSchedule")),
    children: [
      {
        index: true,
        element: lazy(() => import("./bank-schedule/BankScheduleList")),
      },
      {
        path: RouteEnum.BANK_SCHEDULE_DETAILS,
        element: lazy(() => import("./bank-schedule/BankScheduleDetails")),
      },
    ],
  },
  {
    path: RouteEnum.DISBURSEMENTS.concat("/*"),
    element: lazy(() => import("disbursement/Disbursement")),
  },
]);
