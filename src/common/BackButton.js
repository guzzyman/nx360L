import { Button, Icon } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 *
 * @param {import("@mui/material").ButtonProps} props
 */
function BackButton(props) {
  const navigate = useNavigate();
  return <Button onClick={() => navigate(-1)} {...props} />;
}

BackButton.defaultProps = {
  variant: "text",
  startIcon: <Icon>arrow_back_ios_new</Icon>,
  children: "Back",
  opaque: true,
};

export default BackButton;
