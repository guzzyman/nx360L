import { Button, Paper, Typography, Icon } from "@mui/material";
import clsx from "clsx";
// import OopsImg from "assets/images/oops.png";
import "./Oops.css";
import useLogout from "hooks/useLogout";

/**
 *
 * @param {OopsProps} props
 */
function Oops(props) {
  const { title, description, className, onTryAgain, ...rest } = props;

  const { logout } = useLogout();

  return (
    <Paper className={clsx("Oops", className)} {...rest}>
      <Typography variant="h6" className="font-bold text-center">
        {title}
      </Typography>
      <div>
        <Icon fontSize="100px" className={clsx("Oops__icon")}>
          sentiment_dissatisfied
        </Icon>
        {/* <img src={OopsImg} alt="Oops" width={100} /> */}
      </div>
      <Typography
        variant="body2"
        // color="secondary"
        className="text-center mb-4 font-bold"
      >
        {description}
      </Typography>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outlined" onClick={() => logout()}>
          Send Report
        </Button>
        <Button onClick={onTryAgain}>Try Again</Button>
      </div>
    </Paper>
  );
}

Oops.defaultProps = {
  title: "Something went wrong",
  description: "We're quite sorry about this!",
  elevation: 0,
};

export default Oops;

/**
 * @typedef {{
 * onTryAgain: Function
 * } & import("@mui/material").PaperProps} OopsProps
 */
