import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import SystemMapPage from "./pages/SystemMapPage";
import { useTheme } from "./hooks/useTheme";

function ThemeBoot({ children }: { children: React.ReactNode }) {
  // Ensures data-theme is applied on first paint for every route
  useTheme();
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeBoot>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="/system-map" element={<SystemMapPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeBoot>
    </BrowserRouter>
  );
}
