import { ToggleButton, ToggleButtonGroup, Icon } from "@mui/material";

/**
 *
 * @param {import('@mui/material').ToggleButtonGroupProps} props
 * @returns
 */
function TableViewToggleButton(props) {
  return (
    <ToggleButtonGroup exclusive {...props}>
      <ToggleButton value="list">
        <Icon>list</Icon>
      </ToggleButton>
      <ToggleButton value="grid">
        <Icon>grid_view</Icon>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default TableViewToggleButton;
