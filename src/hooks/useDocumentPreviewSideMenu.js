import {useSelector, useDispatch} from 'react-redux';
import {toggleDocumentPreviewSideMenuAction} from 'common/StoreSlice';

function useDocumentPreviewSideMenu () {
  const dispatch = useDispatch ();
  const isDocumentPreviewSideMenu = useSelector (
    state => state.global.isDocumentPreviewSideMenu
  );

  function toggleDocumentPreviewSideMenu (payload) {
    dispatch (
      toggleDocumentPreviewSideMenuAction (
        typeof payload === 'boolean' ? payload : undefined
      )
    );
  }

  return {isDocumentPreviewSideMenu, toggleDocumentPreviewSideMenu};
}

export default useDocumentPreviewSideMenu;
