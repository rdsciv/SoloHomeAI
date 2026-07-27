import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Default dark theme before React paints (matches Open Design prototypes)
try {
  const stored = localStorage.getItem("solohome-theme");
  document.documentElement.setAttribute(
    "data-theme",
    stored === "light" || stored === "dark" ? stored : "dark",
  );
} catch {
  document.documentElement.setAttribute("data-theme", "dark");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
