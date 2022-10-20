import { useRef } from "react";

/**
 *
 * @returns {import('react').MutableRefObject<import("react-table").TableInstance<any>>}
 */
function useTableRef() {
  return useRef();
}

export default useTableRef;
