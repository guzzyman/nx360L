import { useMemo } from "react";
import useTable from "./useTable";
import { urlSearchParamsExtractor } from "common/Utils";
import { useSearchParams } from "react-router-dom";
import useDataRef from "./useDataRef";
import { TABLE_PAGINATION_DEFAULT } from "common/Constants";
import useUpdateEffect from "./useUpdateEffect";

/**
 *
 * @param {PaginationTableHookOptions} options
 * @param {...import('react-table').PluginHook} plugins
 */
function usePaginationSearchParamsTable(options, ...plugins) {
  const { defaultSearchParams, ...restOptions } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const { offset, limit } = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        ...TABLE_PAGINATION_DEFAULT,
        ...defaultSearchParams,
      }),
    [defaultSearchParams, searchParams]
  );

  const parsedOffset = parseInt(offset);
  const parsedLimit = parseInt(limit);

  const instance = useTable(
    {
      // manualPagination: true,
      pageCount:
        restOptions?.dataCount > parsedLimit
          ? Math.ceil(restOptions?.dataCount / parsedLimit)
          : 1,
      ...restOptions,
      initialState: {
        pageSize: parsedLimit,
        pageIndex: parsedOffset / parsedLimit,
        ...restOptions?.initialState,
      },
    },
    ...plugins
  );

  const dataRef = useDataRef({ searchParams, setSearchParams });

  useUpdateEffect(() => {
    const searchParams = new URLSearchParams(dataRef.current.searchParams);
    searchParams.set("offset", instance.state.pageIndex * parsedLimit);
    searchParams.set("limit", instance.state.pageSize);
    dataRef.current.setSearchParams(searchParams);
  }, [dataRef, instance.state.pageIndex, instance.state.pageSize, parsedLimit]);

  return instance;
}

export default usePaginationSearchParamsTable;

/**
 * @typedef {{
 * filterInstance:
 * } & import('react-table').TableOptions} PaginationTableHookOptions
 */
