import { Checkbox } from "@mui/material";

function useTableRowCheckbox(hooks) {
  hooks.visibleColumns.push((visibleColumns, { instance }) => {
    if (!instance.displayRowCheckbox) {
      return visibleColumns;
    }
    return [
      {
        sticky: "left",
        width: 50,
        id: "checkbox",
        Header: (instance) => (
          <Checkbox
            size="small"
            {...instance.getToggleAllPageRowsSelectedProps()}
          />
        ),
        Cell: (instance) => (
          <Checkbox
            size="small"
            {...instance.row.getToggleRowSelectedProps()}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      ...visibleColumns,
    ];
  });
  // hooks.getRowProps.push((_, { row, instance }) => {
  //   return Object.assign({}, _, {
  //     onClick: () => {
  //       if (!instance.state.hiddenColumns.includes('selection')) {
  //         row.toggleRowSelected();
  //       }
  //     },
  //   });
  // });
}

useTableRowCheckbox.pluginName = "useTableRowCheckbox";

export default useTableRowCheckbox;
