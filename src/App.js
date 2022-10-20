import { lazy } from "react";
import Suspense from "common/Suspense";
import { IconButton, Icon } from "@mui/material";
import { useRoutes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { configureRoutes } from "common/Utils";
import AppThemeProvider from "AppThemeProvider";
import "./App.css";
import useScrollToTop from "common/useScrollToTop";
import { useLocation } from "react-router";
import useLoadingModal from "hooks/useLoadingModal";
import LoadingModal from "common/LoadingModal";
import { notistackRef } from "./common/Constants";
import ErrorBoundary from "common/ErrorBoundary";
import Oops from "common/Oops";

function App() {
  const routes = useRoutes(ROUTES);
  const location = useLocation();
  const { isLoadingModal } = useLoadingModal();

  useScrollToTop(location);

  return (
    <AppThemeProvider>
      <SnackbarProvider
        ref={notistackRef}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        preventDuplicate
        action={(key) => (
          <IconButton
            onClick={() => {
              notistackRef.current.closeSnackbar(key);
            }}
            color="inherit"
            size="small"
          >
            <Icon>close</Icon>
          </IconButton>
        )}
      >
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <Oops onTryAgain={resetErrorBoundary} />
          )}
        >
          <Suspense>{routes}</Suspense>
        </ErrorBoundary>
      </SnackbarProvider>
      <LoadingModal open={isLoadingModal} />
    </AppThemeProvider>
  );
}

export default App;

const ROUTES = configureRoutes([
  { path: "/*", element: lazy(() => import("./AppInternal")) },
  { path: "/_/*", element: lazy(() => import("./AppPublic")) },
]);
