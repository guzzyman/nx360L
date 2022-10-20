import {
  useTable as useReactTable,
  usePagination,
  useFlexLayout,
  useRowSelect,
  useGlobalFilter,
} from "react-table";
import { useSticky } from "react-table-sticky";
import { Typography } from "@mui/material";
import useTableRowCheckbox from "./useTableRowCheckbox";

const initialData = [];

/**
 * @type {typeof useReactTable}
 */
function useTable(options, ...plugins) {
  return useReactTable(
    {
      ...options,
      data: options?.data || initialData,
      defaultColumn: Object.assign(
        {
          Cell: ({ value }) => (
            <Typography className="overflow-ellipsis text-left">{value}</Typography>
          ),
        },
        options?.defaultColumn
      ),
    },
    (hook) => {
      hook.prepareRow.push((row) => {
        row.normalizedCells = row.cells.reduce((acc, cell) => {
          acc[cell.column.id] = cell;
          return acc;
        }, {});
      });
      hook.visibleColumns.push((visibleColumns, { instance }) => {
        if (instance.hideRowCounter) {
          return visibleColumns;
        }

        return [
          {
            sticky: "left",
            Header: "#",
            width: 60,
            Cell: (instance) => instance.row.index + 1,
          },
          ...visibleColumns,
        ];
      });
    },
    useFlexLayout,
    useGlobalFilter,
    usePagination,
    useRowSelect,
    useSticky,
    useTableRowCheckbox,
    ...plugins
  );
}

export default useTable;
