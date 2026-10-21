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
const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
const leaf = "#9FC53A";
const leafDark = "#74941F";
const leafSoft = "rgba(159, 197, 58, 0.16)";
const focusRing = "0 0 0 3px rgba(159, 197, 58, 0.28)";
const ink = "#0A0A0A";
const muted = "#515151";
const border = "#E8E8E8";
const canvas = "#F5F9EB";

const Theme = createTheme({
  status: {
    success: {
      color: leafSoft,
      textContrast: leafDark,
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
      main: leaf,
      dark: leafDark,
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: "#BCD675",
      main: leaf,
      dark: leafDark,
      contrastText: "#FFFFFF",
    },
    success: {
      main: leafDark,
      light: leafSoft,
      dark: leafDark,
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
      primary: ink,
      secondary: muted,
    },
    divider: border,
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
  shape: { borderRadius: 12 },
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
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          border: `1px solid ${border}`,
          boxShadow: "0 12px 32px rgba(10, 10, 10, 0.12)",
          marginTop: 6,
          padding: "6px 0",
          overflow: "hidden",
        },
        list: { padding: "4px 0" },
      },
    },
    MuiMenuItem: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: "2px 8px",
          fontSize: 14,
          minHeight: 40,
          transition: `background-color 140ms ${ease}`,
          "&:hover": { backgroundColor: "var(--color-leaf-soft)" },
          "&.Mui-selected": {
            backgroundColor: "rgba(159, 197, 58, 0.18)",
            fontWeight: 600,
            "&:hover": { backgroundColor: "rgba(159, 197, 58, 0.28)" },
          },
          "&.Mui-focusVisible": {
            backgroundColor: "rgba(159, 197, 58, 0.14)",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 20px",
          minHeight: 44,
          fontFamily: sans,
          fontWeight: 600,
          letterSpacing: 0,
          transition: `background-color 160ms ${ease}, box-shadow 160ms ${ease}, border-color 160ms ${ease}, transform 160ms ${ease}, color 160ms ${ease}`,
          "&:active": { transform: "translateY(1px)" },
          "&.Mui-disabled": {
            opacity: 0.55,
          },
        },
        sizeSmall: {
          minHeight: 36,
          padding: "6px 14px",
          borderRadius: 10,
          fontSize: "0.8125rem",
        },
        sizeLarge: {
          minHeight: 52,
          padding: "12px 24px",
          borderRadius: 14,
          fontSize: "0.9375rem",
        },
        contained: {
          color: "#fff",
          boxShadow: "0 1px 2px rgba(10, 10, 10, 0.06), 0 4px 12px rgba(159, 197, 58, 0.18)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(159, 197, 58, 0.32)",
          },
        },
        containedPrimary: {
          background: `linear-gradient(180deg, #A9CF4A 0%, ${leaf} 55%, ${leafDark} 100%)`,
          "&:hover": {
            background: `linear-gradient(180deg, ${leaf} 0%, ${leafDark} 100%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(180deg, #A9CF4A 0%, ${leaf} 55%, ${leafDark} 100%)`,
          "&:hover": {
            background: `linear-gradient(180deg, ${leaf} 0%, ${leafDark} 100%)`,
          },
        },
        containedError: {
          background: "linear-gradient(180deg, #FF3347 0%, #FF001B 100%)",
          boxShadow: "0 4px 12px rgba(255, 0, 27, 0.2)",
          "&:hover": {
            background: "linear-gradient(180deg, #E00018 0%, #CB0919 100%)",
          },
        },
        outlined: {
          borderWidth: 1.5,
          borderColor: "#D0D0D0",
          backgroundColor: "#fff",
          color: ink,
          "&:hover": {
            borderColor: leaf,
            backgroundColor: leafSoft,
            borderWidth: 1.5,
          },
        },
        outlinedPrimary: {
          borderColor: "rgba(159, 197, 58, 0.55)",
          color: leafDark,
          "&:hover": {
            borderColor: leafDark,
            backgroundColor: leafSoft,
          },
        },
        text: {
          color: muted,
          "&:hover": {
            backgroundColor: canvas,
            color: ink,
          },
        },
        textPrimary: {
          color: leafDark,
          "&:hover": { backgroundColor: leafSoft },
        },
        textError: {
          color: "#CB0919",
          "&:hover": { backgroundColor: "rgba(255, 0, 27, 0.08)" },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: `background-color 140ms ${ease}, color 140ms ${ease}`,
          "&:hover": {
            backgroundColor: canvas,
          },
        },
        colorError: {
          "&:hover": { backgroundColor: "rgba(255, 0, 27, 0.08)" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", backgroundColor: "var(--color-paper)" },
        rounded: { borderRadius: 12 },
        elevation1: {
          boxShadow: "0 1px 2px rgba(10, 10, 10, 0.04), 0 4px 16px rgba(10, 10, 10, 0.04)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--color-paper)",
          boxShadow: "0 1px 2px rgba(10, 10, 10, 0.04), 0 8px 24px rgba(10, 10, 10, 0.04)",
          border: `1px solid ${border}`,
          borderRadius: 14,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: `1px solid ${border}`,
          boxShadow: "0 16px 48px rgba(10, 10, 10, 0.16)",
          maxHeight: "var(--fluid-modal-max-h)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: ink,
          fontSize: 12,
          lineHeight: 1.4,
          borderRadius: 8,
          padding: "6px 10px",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontFamily: sans,
          fontWeight: 600,
          minWidth: 36,
          height: 36,
          transition: `background-color 140ms ${ease}, color 140ms ${ease}`,
        },
        outlined: {
          borderColor: border,
          "&:hover": {
            backgroundColor: canvas,
            borderColor: leaf,
          },
        },
        selected: {
          background: `linear-gradient(180deg, ${leaf} 0%, ${leafDark} 100%) !important`,
          color: "#FFFFFF !important",
          borderColor: "transparent !important",
          boxShadow: "0 2px 8px rgba(159, 197, 58, 0.35)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          fontFamily: sans,
          height: 28,
        },
        filled: {
          backgroundColor: canvas,
          color: ink,
        },
        colorPrimary: {
          backgroundColor: leafSoft,
          color: leafDark,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 600,
          color: muted,
          "&.Mui-focused": { color: leafDark },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 600,
          "&.Mui-focused": { color: leafDark },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          minHeight: "var(--fluid-control-h)",
          fontSize: "0.875rem",
          transition: `box-shadow 160ms ${ease}, background-color 160ms ${ease}`,
          "&:hover": {
            backgroundColor: "#FCFDF9",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(159, 197, 58, 0.55)",
          },
          "&.Mui-focused": {
            backgroundColor: "#FFFFFF",
            boxShadow: focusRing,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: leaf,
            borderWidth: 1.5,
          },
          "&.Mui-error.Mui-focused": {
            boxShadow: "0 0 0 3px rgba(255, 0, 27, 0.18)",
          },
          "&.Mui-disabled": {
            backgroundColor: canvas,
          },
        },
        notchedOutline: {
          borderColor: "#D6D6D6",
          transition: `border-color 160ms ${ease}`,
        },
        input: {
          padding: "11px 14px",
        },
        adornedStart: {
          paddingLeft: 10,
        },
        adornedEnd: {
          paddingRight: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "medium",
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          paddingTop: 11,
          paddingBottom: 11,
        },
        icon: {
          color: muted,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            background: `linear-gradient(180deg, ${canvas} 0%, #EEF4E0 100%)`,
            color: muted,
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontFamily: sans,
            borderBottom: `1px solid ${border}`,
            whiteSpace: "nowrap",
            paddingTop: 14,
            paddingBottom: 14,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: `background-color 140ms ${ease}`,
          "&:hover": {
            backgroundColor: "rgba(245, 249, 235, 0.72)",
          },
          "&.MuiTableRow-hover:hover": {
            backgroundColor: "rgba(245, 249, 235, 0.85)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          borderBottom: `1px solid ${border}`,
          padding: "14px 16px",
          color: ink,
        },
        body: {
          verticalAlign: "middle",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          height: 3,
          borderRadius: "3px 3px 0 0",
          backgroundColor: leaf,
        },
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
          color: muted,
          transition: `color 140ms ${ease}`,
          "&.Mui-selected": {
            color: leafDark,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
        paper: {
          borderRadius: 14,
          border: `1px solid ${border}`,
          boxShadow: "0 12px 32px rgba(10, 10, 10, 0.12)",
          marginTop: 6,
          overflow: "hidden",
        },
        listbox: {
          padding: "6px 0",
        },
        option: {
          fontSize: 14,
          minHeight: 40,
          margin: "2px 8px",
          borderRadius: 10,
          transition: `background-color 120ms ${ease}`,
          '&[aria-selected="true"]': {
            backgroundColor: "rgba(159, 197, 58, 0.18)",
            fontWeight: 600,
          },
          "&.Mui-focused": {
            backgroundColor: "var(--color-leaf-soft) !important",
          },
        },
        tag: {
          margin: 3,
        },
        endAdornment: {
          right: 8,
        },
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
        root: { borderRadius: 12, fontFamily: sans },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: leaf,
          },
          "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: leaf,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#C7C7C7",
          "&.Mui-checked": { color: leaf },
        },
      },
    },
  },
});

export default Theme;
