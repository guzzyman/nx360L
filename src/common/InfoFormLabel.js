import { Icon, Tooltip } from "@mui/material";

/**
 *
 * @param {InfoFormLabel} props
 */
function InfoFormLabel(props) {
  const { children, tooltip } = props;
  return (
    <span className="flex items-center">
      {children}
      <Tooltip title={tooltip}>
        <span>
          <Icon>help_outline</Icon>
        </span>
      </Tooltip>
    </span>
  );
}

export default InfoFormLabel;

/**
 * @typedef {{
 * tooltip: string
 * }} InfoFormLabel
 */
