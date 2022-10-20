import { Chip } from "@mui/material";
import { RequestStatusColorEnum } from "./RequestConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function RequestEscalationStatusChip(props) {
  const { status } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={RequestStatusColorEnum[status.toLowerCase()] || "error"}
      label={`Escalated: ${status}`}
    />
  );
}

export default RequestEscalationStatusChip;