import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { logoutAction } from "common/StoreActions";
import { nimbleX360Api } from "common/StoreQuerySlice";

function useLogout(props) {
  const dispatch = useDispatch();
  const [logoutMutation, logoutMutationResult] =
    nimbleX360Api.useLogoutMutation();

  const logout = useCallback(
    function logout() {
      return dispatch(logoutAction());
    },
    [dispatch]
  );

  return { logout, logoutMutation, logoutMutationResult };
}

export default useLogout;
