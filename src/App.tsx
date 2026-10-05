import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import RegisterAppDispatch from "@core/basic-components/RegisterAppDispatch";
import ErrorBoundary from "@core/basic-components/ErrorBoundary";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Toaster from "@core/basic-components/Toaster";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import AppModal from "@core/templates/AppModal";
import { CacheProvider } from "@emotion/react";
import { LicenseInfo } from "@mui/x-license";
import { SnackbarProvider } from "notistack";
import { CssBaseline } from "@mui/material";
import AppRoutes from "routes/AppRoutes";
import createCache from "@emotion/cache";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { config } from "config";
import theme from "./theme";
import "./App.css";
import { useEffect } from "react";

const cache = createCache({ key: "css", prepend: true });
LicenseInfo.setLicenseKey(config.MUI_LICENSE_KEY as string);

export default function App() {
  useEffect(() => {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", "en");
  }, []);

  return (
    <ErrorBoundary>
      <SnackbarProvider
        maxSnack={5}
        hideIconVariant
        preventDuplicate
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        iconVariant={{
          success: "✅",
          error: "✖️",
          warning: "⚠️",
          info: "ℹ️",
        }}
      >
        <Toaster />
        <ErrorBoundary>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CacheProvider value={cache}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Provider store={store}>
                  <RegisterAppDispatch />
                  <BrowserRouter>
                    <ErrorBoundary>
                      <AppModal />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <AppRoutes />
                    </ErrorBoundary>
                  </BrowserRouter>
                </Provider>
              </ThemeProvider>
            </CacheProvider>
          </LocalizationProvider>
        </ErrorBoundary>
      </SnackbarProvider>
    </ErrorBoundary>
  );
}
