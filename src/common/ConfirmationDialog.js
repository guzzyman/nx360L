import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

/**
 *
 * @param {ConfirmationDialogProps} props
 */
function ConfirmationDialog(props) {
  const { title, children, onCancel, onConfirm, ...rest } = props;

  return (
    <Dialog {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {typeof children === "string" ? (
          <Typography>{children}</Typography>
        ) : (
          children
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;

/**
 * @typedef {{
 * title: string;
 * onCancel: Function;
 * onConfirm: Function
 * } & import("@mui/material").DialogProps} ConfirmationDialogProps
 */
