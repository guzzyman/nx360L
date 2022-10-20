import { Chip } from "@mui/material";
import { RequestStatusColorEnum } from "./RequestConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function RequestStatusChip(props) {
  const { status } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={RequestStatusColorEnum[status?.toLowerCase()] || "error"}
      label={status}
    />
  );
}

export default RequestStatusChip;
