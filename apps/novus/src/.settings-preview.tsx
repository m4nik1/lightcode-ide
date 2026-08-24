import ReactDOM from "react-dom/client";
import "./index.css";
import SettingsPage from "./components/settings/SettingsPage";
import SettingsSidebar from "./components/sidebar/SettingsSidebar";
import { ViewProvider } from "./context/useView";
import { aiTheme } from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ViewProvider>
    <main className="flex h-screen overflow-hidden">
      <SettingsSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className="h-9.5 shrink-0 border-b"
          style={{ background: aiTheme.background, borderColor: aiTheme.border }}
        />
        <SettingsPage />
      </div>
    </main>
  </ViewProvider>,
);
