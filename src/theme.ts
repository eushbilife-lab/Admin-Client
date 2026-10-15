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

const sans = '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const Theme = createTheme({
  status: {
    success: {
      color: "rgba(159, 197, 58, 0.16)",
      textContrast: "#74941F",
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
      default: "#FEFEFE",
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
      main: "#74941F",
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
    h1: { fontFamily: sans, fontSize: "2.1875rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontFamily: sans, fontSize: "1.5625rem", fontWeight: 700, lineHeight: 1.2 },
    h3: { fontFamily: sans, fontSize: "1.125rem", fontWeight: 700, lineHeight: 1.2 },
    h4: { fontFamily: sans, fontSize: "1rem", fontWeight: 700, lineHeight: 1.3 },
    h5: { fontFamily: sans, fontSize: "0.875rem", fontWeight: 700, lineHeight: 1.4 },
    h6: { fontFamily: sans, fontSize: "0.8125rem", fontWeight: 700, lineHeight: 1.4 },
    subtitle1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: "0.8125rem", fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.4 },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
      textTransform: "none",
      letterSpacing: 0,
    },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "var(--bg-primary)",
          fontFamily: sans,
          lineHeight: 1.5,
          scrollbarWidth: "thin",
          scrollbarColor: "var(--scroll-thumb) transparent",
        },
      },
    },
    MuiMenuItem: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 6px",
          fontSize: 14,
          "&:hover": { backgroundColor: "var(--color-leaf-soft)" },
          "&.Mui-selected": {
            backgroundColor: "rgba(159, 197, 58, 0.18)",
            "&:hover": { backgroundColor: "rgba(159, 197, 58, 0.28)" },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 18px",
          minHeight: 44,
          fontFamily: sans,
          fontWeight: 600,
          transition: "background-color 150ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 150ms cubic-bezier(0.16, 1, 0.3, 1), transform 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        },
        contained: {
          color: "#fff",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          "&:hover": { boxShadow: "0 4px 12px rgba(159, 197, 58, 0.28)" },
        },
        containedPrimary: {
          backgroundColor: "#9FC53A",
          "&:hover": { backgroundColor: "#74941F" },
        },
        containedSecondary: {
          backgroundColor: "#9FC53A",
          "&:hover": { backgroundColor: "#74941F" },
        },
        outlined: { borderColor: "#C7C7C7" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", backgroundColor: "var(--color-paper)" },
        rounded: { borderRadius: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--color-paper)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          border: "1px solid var(--border-color)",
          borderRadius: 10,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          border: "1px solid var(--border-color)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          maxHeight: "var(--fluid-modal-max-h)",
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
        root: { borderRadius: 8, fontFamily: sans },
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "var(--color-paper)",
          minHeight: "var(--fluid-control-h)",
          fontSize: "0.875rem",
          transition: "box-shadow 150ms ease, border-color 150ms ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#929292",
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 3px rgba(159, 197, 58, 0.28)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9FC53A",
            borderWidth: 1,
          },
        },
        notchedOutline: {
          borderColor: "#C7C7C7",
        },
        input: {
          padding: "10px 14px",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            background: "var(--color-gray-50)",
            color: "var(--text-primary)",
            fontWeight: 700,
            fontSize: "0.8125rem",
            fontFamily: sans,
            borderBottom: "1px solid var(--border-color)",
            whiteSpace: "nowrap",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#fafbfc",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          borderBottom: "1px solid var(--border-color)",
          padding: "var(--fluid-row-pad-y) 1rem",
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
        root: {
          textTransform: "none",
          fontWeight: 600,
          minHeight: 48,
          fontFamily: sans,
          fontSize: 14,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          border: "1px solid var(--border-color)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        },
        option: { fontSize: 14 },
      },
    },
    MuiModal: {
      styleOverrides: {
        backdrop: {
          backgroundColor: "rgba(10, 10, 10, 0.45)",
          backdropFilter: "blur(4px)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontFamily: sans },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#9FC53A",
          },
          "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#9FC53A",
          },
        },
      },
    },
  },
});

export default Theme;
