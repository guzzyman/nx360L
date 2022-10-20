import {
  Drawer,
  Icon,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import {
  DOCUMENT_PREVIEW_SIDE_MENU_WIDTH,
  MediaQueryBreakpointEnum,
} from "./Constants";

export default function DocumentPreviewDrawer(props) {
  const { title, open, onClose, children, ...rest } = props;
  const islg = useMediaQuery(MediaQueryBreakpointEnum.lg);
  const isMd = useMediaQuery(MediaQueryBreakpointEnum.md);

  return (
    <div>
      <Drawer
        open={Boolean(open)}
        onClose={onClose}
        variant={islg ? "permanent" : "temporary"}
        PaperProps={{
          style: {
            width: `${isMd ? DOCUMENT_PREVIEW_SIDE_MENU_WIDTH + "px" : "100%"}`,
          },
        }}
        {...rest}
        className="relative"
      >
        <div className="sticky py-2 px-3 top-0 z-30 w-full shadow-md bg-white">
          <div className=" flex justify-between items-center flex-row">
            <Typography variant="h6" className="capitalize">
              {title}
            </Typography>

            <IconButton title="Close" color="warning" onClick={onClose}>
              <Icon>close</Icon>
            </IconButton>
          </div>
        </div>

        <div>{children}</div>
      </Drawer>
    </div>
  );
}
