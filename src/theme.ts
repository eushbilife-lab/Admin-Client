import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      success: object;
      warning: object;
    };
    customColor: {
      secondary: object;
    };
  }
  interface ThemeOptions {
    status?: {
      success?: object;
      warning?: object;
    };
    customColor: {
      secondary: object;
    };
  }
}

const sans = '"Poppins", "Segoe UI", sans-serif';

const Theme = createTheme({
  status: {
    success: {
      color: "rgba(159, 197, 58, 0.16)",
      textContrast: "#9FC53A",
    },
    warning: {
      color: "rgba(234, 179, 8, 0.16)",
      textContrast: "#CA9A07",
    },
  },
  customColor: {
    secondary: {
      color: "rgba(81, 81, 81, 0.7)",
    },
  },
  palette: {
    background: {
      default: "#F5F9EB",
      paper: "#FEFEFE",
    },
    primary: {
      light: "#BCD675",
      main: "#9FC53A",
      dark: "#74941F",
    },
    secondary: {
      light: "#BCD675",
      main: "#9FC53A",
      dark: "#74941F",
    },
    success: {
      main: "#9FC53A",
      light: "rgba(159, 197, 58, 0.16)",
      dark: "#74941F",
    },
    warning: {
      main: "#EAB308",
      light: "rgba(234, 179, 8, 0.16)",
      dark: "#CA9A07",
    },
    error: {
      main: "#FF001B",
      light: "rgba(255, 0, 27, 0.12)",
      dark: "#CB0919",
    },
    info: {
      main: "#0068F7",
      light: "rgba(0, 104, 247, 0.14)",
      dark: "#0058D4",
    },
    text: {
      primary: "#0A0A0A",
      secondary: "#515151",
    },
    divider: "#E8E8E8",
  },
  typography: {
    fontFamily: sans,
    fontSize: 14,
    htmlFontSize: 16,
    h1: { fontFamily: sans, fontSize: 36, fontWeight: 700, lineHeight: 1.4 },
    h2: { fontFamily: sans, fontSize: 30, fontWeight: 700, lineHeight: 1.4 },
    h3: { fontFamily: sans, fontSize: 24, fontWeight: 700, lineHeight: 1.4 },
    h4: { fontFamily: sans, fontSize: 20, fontWeight: 700, lineHeight: 1.4 },
    h5: { fontFamily: sans, fontSize: 16, fontWeight: 700, lineHeight: 1.4 },
    h6: { fontFamily: sans, fontSize: 14, fontWeight: 700, lineHeight: 1.4 },
    subtitle1: { fontSize: 16, fontWeight: 400, lineHeight: 1.4 },
    subtitle2: { fontSize: 14, fontWeight: 700, lineHeight: 1.4 },
    body1: { fontSize: 14, fontWeight: 400, lineHeight: 1.4 },
    body2: { fontSize: 12, fontWeight: 400, lineHeight: 1.4 },
    caption: { fontSize: 10, fontWeight: 400, lineHeight: 1.4 },
    button: { fontSize: 16, fontWeight: 700, lineHeight: 1.4, textTransform: "none" },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F5F9EB",
          fontFamily: sans,
          lineHeight: 1.4,
          scrollbarWidth: "thin",
          scrollbarColor: "#ACACAC transparent",
        },
      },
    },
    MuiMenuItem: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: "2px 6px",
          fontSize: 14,
          "&:hover": { backgroundColor: "#F5F9EB" },
          "&.Mui-selected": {
            backgroundColor: "rgba(159, 197, 58, 0.18)",
            "&:hover": { backgroundColor: "rgba(159, 197, 58, 0.28)" },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, padding: "10px 18px", minHeight: 48, fontFamily: sans, fontWeight: 700 },
        contained: {
          color: "#fff",
          boxShadow: "0 5px 7px rgba(0, 0, 0, 0.2)",
          "&:hover": { boxShadow: "0 8px 16px rgba(159, 197, 58, 0.32)" },
        },
        containedPrimary: {
          backgroundColor: "#9FC53A",
          "&:hover": { backgroundColor: "#74941F" },
        },
        containedSecondary: {
          backgroundColor: "#9FC53A",
          "&:hover": { backgroundColor: "#74941F", boxShadow: "0 8px 16px rgba(159, 197, 58, 0.32)" },
        },
        outlined: { borderColor: "#848484" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", backgroundColor: "#FEFEFE" },
        rounded: { borderRadius: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FEFEFE",
          boxShadow: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          border: "1px solid #E8E8E8",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.14)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#0A0A0A",
          fontSize: 12,
          lineHeight: 1.4,
          borderRadius: 8,
          padding: "6px 10px",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: { borderRadius: 10, fontFamily: sans },
        selected: {
          backgroundColor: "#9FC53A !important",
          color: "#FFFFFF",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600, fontFamily: sans },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            background: "#F5F9EB",
            color: "#0A0A0A",
            fontWeight: 700,
            fontSize: 12,
            fontFamily: sans,
            borderBottom: "1px solid #E8E8E8",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, borderRadius: 0, backgroundColor: "#9FC53A" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, minHeight: 48, fontFamily: sans, fontSize: 14 },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          border: "1px solid #E8E8E8",
          boxShadow: "0 5px 7px rgba(0, 0, 0, 0.12)",
        },
        option: { fontSize: 14 },
      },
    },
    MuiModal: {
      styleOverrides: {
        backdrop: { backgroundColor: "rgba(10, 10, 10, 0.55)", backdropFilter: "blur(8px)" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontFamily: sans },
      },
    },
  },
});

export default Theme;
