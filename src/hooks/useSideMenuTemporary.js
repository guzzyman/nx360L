import { useSelector, useDispatch } from "react-redux";
import { toggleSideMenuTemporaryAction } from "common/StoreSlice";

function useSideMenuTemporary() {
  const dispatch = useDispatch();
  const isSideMenuTemporary = useSelector(
    (state) => state.global.isSideMenuTemporary
  );

  function toggleSideMenuTemporary(payload) {
    dispatch(
      toggleSideMenuTemporaryAction(
        typeof payload === "boolean" ? payload : undefined
      )
    );
  }

  return { isSideMenuTemporary, toggleSideMenuTemporary };
}

export default useSideMenuTemporary;
