import { Chip } from "@mui/material";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function AccountStatusChip(props) {
  const { status, ...rest } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={status ? "success" : "error"}
      label={status ? "Active" : "In Active"}
      {...rest}
    />
  );
}

export default AccountStatusChip;
