import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "../index.css";
import { ContentProvider } from "../content/i18n";
import { OgImage } from "./OgImage";

// /tools/og/?lang=en renders the English card; anything else is Turkish.
const locale = new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "tr";
document.documentElement.lang = locale; // Turkish capitals (İ) need lang="tr"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContentProvider locale={locale}>
      <OgImage />
    </ContentProvider>
  </StrictMode>,
);
