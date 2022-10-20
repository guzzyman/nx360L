import { Paper } from "@mui/material";
import clsx from "clsx";
import "./CreditDirectPayStepPaper.css";

/**
 *
 * @param {CreditDirectPayStepPaperProps} props
 * @returns
 */
function CreditDirectPayStepPaper(props) {
  const { className, ...rest } = props;
  return (
    <Paper
      variant="outlined"
      className={clsx("CreditDirectPayStepPaper", className)}
      {...rest}
    />
  );
}

export default CreditDirectPayStepPaper;

/**
 * @typedef {{
 * } & import('@mui/material').PaperProps} CreditDirectPayStepPaperProps
 */
