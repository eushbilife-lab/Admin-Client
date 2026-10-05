import ErrorBoundary from "@core/basic-components/ErrorBoundary";
import InitializationService from "services/initialization.service";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";
import "moment/locale/es";
import "moment/locale/de";
import React from "react";
import App from "./App";
import "./i18n";
import "./index.css";

InitializationService.init();

const container: any = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
 </React.StrictMode>
);

reportWebVitals();
