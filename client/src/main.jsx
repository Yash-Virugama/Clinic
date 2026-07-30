import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
import AppToaster from "./components/ui/AppToaster";

import App from "./App";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { BrandingProvider } from "./context/BrandingContext";
import { ClinicProvider } from "./context/ClinicContext";

import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <BrandingProvider>
            <ClinicProvider>
              <AppToaster />
              <App />
            </ClinicProvider>
          </BrandingProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);