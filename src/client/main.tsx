import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { ErrorBoundary } from "react-error-boundary";
import Fallback from "./Fallback";
import Header from "./Header";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Header />
    <ErrorBoundary FallbackComponent={Fallback}>
      <App />
    </ErrorBoundary>
    <footer className="p-2 flex justify-center">
      <p className="text-sm">eja-lebah 2025 | Oleh Najmunda</p>
    </footer>
  </React.StrictMode>,
);
