import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppShell from "./components/AppShell";

import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppShell />
  </StrictMode>
);
