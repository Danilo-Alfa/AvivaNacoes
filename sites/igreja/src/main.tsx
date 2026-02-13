import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

// Register service worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    // Força a atualização imediata sem perguntar ao usuário
    updateSW(true);
  },
  onOfflineReady() {},
});

createRoot(document.getElementById("root")!).render(<App />);
