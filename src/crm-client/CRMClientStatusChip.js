import { Chip } from "@mui/material";
import { CRMClientStatusColorEnum } from "./CRMClientConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function CRMClientStatusChip(props) {
  const { status, ...rest } = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={CRMClientStatusColorEnum[status?.id]}
      label={status?.value}
      {...rest}
    />
  );
}

export default CRMClientStatusChip;
