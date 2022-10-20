import { Chip } from "@mui/material";
import { RequestStatusColorEnum } from "./ClientXLeadXRequestConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function ClientXLeadXRequestStatusChip(props) {
  const { status } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={RequestStatusColorEnum[status?.toLowerCase()] || "error"}
      label={status}
    />
  );
}

export default ClientXLeadXRequestStatusChip;
