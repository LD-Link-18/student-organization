import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "./index.css";
import App from "./App";
import { ContentProvider, detectLocale } from "./content/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContentProvider locale={detectLocale()}>
      <App />
    </ContentProvider>
  </StrictMode>,
);
