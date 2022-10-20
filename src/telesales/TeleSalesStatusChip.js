import { Chip } from "@mui/material";
import { TelesalesStatusColorEnum } from "./TelesalesConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function TelesalesStatusChip(props) {
  const { status } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={TelesalesStatusColorEnum[status?.toLowerCase()] || "error"}
      label={status}
    />
  );
}

export default TelesalesStatusChip;