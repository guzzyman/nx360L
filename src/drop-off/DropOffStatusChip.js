import { Chip } from "@mui/material";
import { DropOffStatusColorEnum } from "./DropOffConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function DropOffStatusChip(props) {
  const { status } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={DropOffStatusColorEnum[status?.toLowerCase()] || "error"}
      label={status}
    />
  );
}

export default DropOffStatusChip;