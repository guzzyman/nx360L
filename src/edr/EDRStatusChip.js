import { Chip } from "@mui/material";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 */
function EDRStatusChip(props) {
  const { status, ...rest } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={StatusColorEnum[status]}
      label={status}
      {...rest}
    />
  );
}

export default EDRStatusChip;

const StatusColorEnum = {
  FAILED: "error",
  PENDING: "warning",
  SUCCESS: "success",
  PROCCESSING: "warning",
};
