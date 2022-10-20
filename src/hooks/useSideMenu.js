import { useSelector, useDispatch } from "react-redux";
import { toggleSideMenuAction } from "common/StoreSlice";

function useSideMenu() {
  const dispatch = useDispatch();
  const isSideMenu = useSelector((state) => state.global.isSideMenu);

  function toggleSideMenu(payload) {
    dispatch(
      toggleSideMenuAction(typeof payload === "boolean" ? payload : undefined)
    );
  }

  return { isSideMenu, toggleSideMenu };
}

export default useSideMenu;
