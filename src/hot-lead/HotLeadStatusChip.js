import { Chip } from "@mui/material";
import { HotLeadStatusColorEnum } from "./HotLeadConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function HotLeadStatusChip(props) {
  const { status } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={HotLeadStatusColorEnum[status?.toLowerCase()] || "error"}
      label={status}
    />
  );
}

export default HotLeadStatusChip;