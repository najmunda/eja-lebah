import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { ErrorBoundary } from "react-error-boundary";
import Fallback from "./Fallback";
import Header from "./Header";
import Footer from "./Footer";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Header />
    <ErrorBoundary FallbackComponent={Fallback}>
      <App />
    </ErrorBoundary>
    <Footer />
  </React.StrictMode>,
);
