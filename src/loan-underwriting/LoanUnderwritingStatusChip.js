import { Chip } from "@mui/material";
import { LoanUnderwritingStatusColorEnum } from "./LoanUnderwritingConstants";

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function LoanUnderwritingStatusChip(props) {
  const { status, ...rest } = props;

  return (
    <Chip
      variant="outlined-opaque"
      color={LoanUnderwritingStatusColorEnum[status?.code]}
      label={status?.value}
      {...rest}
    />
  );
}

export default LoanUnderwritingStatusChip;
