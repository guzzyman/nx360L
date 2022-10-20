import { Chip } from "@mui/material";
import { ExceptionStatusColorEnum } from "./ExceptionConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function ExceptionStatusChip(props) {
  const { status } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={ExceptionStatusColorEnum[status?.toLowerCase()] || "error"}
      label={status}
    />
  );
}

export default ExceptionStatusChip;
