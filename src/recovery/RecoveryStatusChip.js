import { Chip } from "@mui/material";
import { RecoveryStatusColorEnum } from "./RecoveryConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function RecoveryStatusChip(props) {
  const { status } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={RecoveryStatusColorEnum[status?.toLowerCase()] || "error"}
      label={status}
    />
  );
}

export default RecoveryStatusChip;