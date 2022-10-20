import { Chip } from "@mui/material";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 */
function EDRTransactionStatusChip(props) {
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

export default EDRTransactionStatusChip;

const StatusColorEnum = {
  FAILED: "error",
  PENDING: "warning",
  SUCCESS: "success",
  PROCCESSING: "warning",
};
