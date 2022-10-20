import { CircularProgress } from "@mui/material";

/**
 * 
 * @param {import("@mui/material").CircularProgressProps} props 
 */
function LoadingIndicator(props) {
  return <CircularProgress {...props} />;
}

export default LoadingIndicator;
