import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "./index.css";
import App from "./App";
import { ComingSoon } from "./components/ComingSoon";
import { NotFound } from "./components/NotFound";
import { ProjectPage } from "./components/ProjectPage";
import { ContentProvider, detectLocale } from "./content/i18n";
import { fetchSaved, readCache, resolve, type Saved } from "./content/load";

const page = document.documentElement.dataset.page;

// Hosts serve the same 404.html for every unknown URL, so its language comes from the path.
if (page === "404") {
  document.documentElement.lang = /^\/en(\/|$)/.test(window.location.pathname) ? "en" : "tr";
}

const pages = { soon: <ComingSoon />, "404": <NotFound />, project: <ProjectPage /> } as const;

const root = createRoot(document.getElementById("root")!);
const locale = detectLocale();

function render(saved: Saved | null) {
  const { content, site } = resolve(locale, saved);
  root.render(
    <StrictMode>
      <ContentProvider content={content} site={site}>
        {pages[page as keyof typeof pages] ?? <App />}
      </ContentProvider>
    </StrictMode>,
  );
}

// Admin-panel edits: a returning visitor sees the last fetched version at once, then the fresh one if it
// changed. A first visit waits for the fetch (at most 2 s, then the bundled defaults).
const cached = readCache();
if (cached) render(cached);
fetchSaved().then((fresh) => {
  if (fresh ? JSON.stringify(fresh) !== JSON.stringify(cached) : !cached) render(fresh);
});
