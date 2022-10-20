import { Chip } from "@mui/material";
import { ClientXLeadStatusColorEnum } from "./ClientXLeadConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function ClientXLeadStatusChip(props) {
  const { status, ...rest } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={ClientXLeadStatusColorEnum[status?.id]}
      label={status?.value}
      {...rest}
    />
  );
}

export default ClientXLeadStatusChip;
