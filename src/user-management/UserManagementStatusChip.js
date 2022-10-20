import { Chip } from "@mui/material";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function UserManagementStatusChip(props) {
  const { status, ...rest } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={status ? "success" : "error"}
      label={status ? "True" : "False"}
      {...rest}
    />
  );
}

export default UserManagementStatusChip;