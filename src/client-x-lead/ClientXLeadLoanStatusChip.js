import { Chip } from "@mui/material";
import { ClientXLeadLoanStatusColorEnum } from "./ClientXLeadConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function ClientXLeadLoanStatusChip(props) {
  const { status, ...rest } = props;

  return (
    <Chip
      variant="outlined-opaque"
      color={ClientXLeadLoanStatusColorEnum[status?.code]}
      label={status?.value}
      {...rest}
    />
  );
}

export default ClientXLeadLoanStatusChip;
