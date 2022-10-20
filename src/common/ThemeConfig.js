import { createTheme, alpha } from "@mui/material/styles";
import { DateConfig } from "./Constants";

const defaultTheme = createTheme({});

export const theme = customizeComponents({
  palette: {
    primary: {
      main: "#177EB9",
    },
    secondary: {
      main: "#161B2E",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
  },
  typography: {
    fontFamily: ["Nunito Sans", "sans-serif"].join(),
    fontSize: 12,
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiDatePicker: {
      defaultProps: {
        inputFormat: DateConfig.FORMAT,
      },
    },
    MuiDesktopDatePicker: {
      defaultProps: {
        inputFormat: DateConfig.FORMAT,
      },
    },
    MuiMobileDatePicker: {
      defaultProps: {
        inputFormat: DateConfig.FORMAT,
      },
    },
    MuiTabs: {
      defaultProps: {
        variant: "scrollable",
        scrollButtons: "auto",
        allowScrollButtonsMobile: true,
      },
    },
    MuiLoadingButton: {
      defaultProps: {
        variant: "contained",
      },
      variants: [
        {
          props: { variant: "contained", color: "primary", opaque: true },
          style: { backgroundColor: "#d0e6f6" },
        },
        {
          props: { variant: "outlined", color: "primary", opaque: true },
          style: {
            backgroundColor: "#d0e6f6",
            ":hover": {
              backgroundColor: "#d0e6f6",
            },
          },
        },
        {
          props: { variant: "text", color: "primary", opaque: true },
          style: {
            backgroundColor: "#d0e6f6",
            paddingLeft: 15,
            paddingRight: 15,
            ":hover": {
              backgroundColor: "#d0e6f6",
            },
          },
        },
      ],
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      variants: [
        {
          props: { variant: "contained", color: "primary", opaque: true },
          style: { backgroundColor: "#d0e6f6" },
        },
        {
          props: { variant: "outlined", color: "primary", opaque: true },
          style: { backgroundColor: "#d0e6f6" },
        },
        {
          props: { variant: "text", color: "primary", opaque: true },
          style: {
            backgroundColor: "#d0e6f6",
            paddingLeft: 15,
            paddingRight: 15,
            ":hover": {
              backgroundColor: "#d0e6f6",
            },
          },
        },
      ],
    },
    MuiChip: {
      variants: [
        {
          props: { variant: "outlined-opaque", color: "primary" },
          style: {
            backgroundColor: "#d0e6f6",
          },
        },
        {
          props: { variant: "outlined-opaque", color: "success" },
          style: {
            backgroundColor: alpha(defaultTheme.palette.success.main, 0.1),
            color: defaultTheme.palette.success.main,
          },
        },
        {
          props: { variant: "outlined-opaque", color: "error" },
          style: {
            backgroundColor: alpha(defaultTheme.palette.error.main, 0.1),
            color: defaultTheme.palette.error.main,
          },
        },
        {
          props: { variant: "outlined-opaque", color: "warning" },
          style: {
            backgroundColor: alpha(defaultTheme.palette.warning.main, 0.1),
            color: defaultTheme.palette.warning.main,
          },
        },
        {
          props: { variant: "outlined-opaque", color: "info" },
          style: {
            backgroundColor: alpha(defaultTheme.palette.info.main, 0.1),
            color: defaultTheme.palette.info.main,
          },
        },
      ],
    },
  },
});

export default theme;

/**
 *
 * @param {import("@mui/material").Theme} theme
 */
function customizeComponents(theme) {
  return createTheme({
    ...theme,
  });
}

[
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "error",
  "common",
  "text",
  "background",
  "action",
].forEach((palatteKey) => {
  Object.keys(theme.palette[palatteKey]).forEach((palatteKeyColor) => {
    document.documentElement.style.setProperty(
      `--color-${palatteKey}-${palatteKeyColor}`,
      theme.palette[palatteKey][palatteKeyColor]
    );
  });
});
