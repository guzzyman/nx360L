import {Chip} from '@mui/material';

/**
 *
 * @param {import("@mui/material").ChipProps} props
 * @returns
 */
function CRMEmployerStatusChip (props) {
  const {status, ...rest} = props;
  return (
    <Chip
      variant="outlined-opaque"
      color={status ? 'success' : 'warning'}
      label={status ? 'Active' : 'InActive'}
      {...rest}
    />
  );
}

export default CRMEmployerStatusChip;
