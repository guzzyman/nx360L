import { Chip } from "@mui/material";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 */
function DisbursementStatusChip(props) {
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

export default DisbursementStatusChip;

const StatusColorEnum = {
  UNRECONCILED: "error",
  PENDING: "warning",
  RECONCILED: "success",
};
