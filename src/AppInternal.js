import { lazy, useEffect } from "react";
import Suspense from "common/Suspense";
import useAuthUser from "hooks/useAuthUser";
import * as dfns from "date-fns";
import useLogout from "hooks/useLogout";
import useToggle from "hooks/useToggle";
import LoadingContent from "common/LoadingContent";
import { ConfirmDialogProvider } from "react-mui-confirm";
import "./AppInternal.css";

const AppAuth = lazy(() => import("./AppAuth"));
const AppProtected = lazy(() => import("./AppProtected"));

function AppInternal() {
  const { logout } = useLogout();
  const authUser = useAuthUser();
  const [isValidating, __, setValidating] = useToggle(true);

  useEffect(() => {
    const tfaToken = authUser?.tfaToken;
    if (tfaToken) {
      if (Date.now() > dfns.subMinutes(tfaToken?.validTo, 10).getTime()) {
        logout();
      }
    }
    setValidating(false);
  }, [authUser?.tfaToken, logout, setValidating]);

  return (
    <LoadingContent loading={isValidating}>
      {() => (
        <div className="AppInternal">
          <ConfirmDialogProvider>
            <Suspense>
              {!!authUser?.tfaToken ? <AppProtected /> : <AppAuth />}
            </Suspense>
          </ConfirmDialogProvider>
        </div>
      )}
    </LoadingContent>
  );
}

export default AppInternal;
