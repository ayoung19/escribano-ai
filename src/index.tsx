import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import { EuiProvider } from "@elastic/eui";
import { App } from "./App";

ReactDOM.render(
  <StrictMode>
    <EuiProvider colorMode="light">
      <App />
    </EuiProvider>
  </StrictMode>,
  document.getElementById("root")
);
