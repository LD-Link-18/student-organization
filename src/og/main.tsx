import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "../index.css";
import { ContentProvider } from "../content/i18n";
import { fetchSaved, resolve } from "../content/load";
import { OgImage } from "./OgImage";

// /tools/og/?lang=en renders the English card; anything else is Turkish.
const locale = new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "tr";
document.documentElement.lang = locale; // Turkish capitals (İ) need lang="tr"

fetchSaved().then((saved) => {
  const { content, site, events } = resolve(locale, saved);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ContentProvider content={content} site={site} events={events}>
        <OgImage />
      </ContentProvider>
    </StrictMode>,
  );
});
