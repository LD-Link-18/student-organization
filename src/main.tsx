import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "./index.css";
import App from "./App";
import { ComingSoon } from "./components/ComingSoon";
import { EventsPage } from "./components/EventsPage";
import { NotFound } from "./components/NotFound";
import { PreviewBanner } from "./components/PreviewBanner";
import { ProjectPage } from "./components/ProjectPage";
import { ContentProvider, detectLocale } from "./content/i18n";
import { fetchSaved, inPreview, previewKey, readCache, readPreview, resolve, type Saved } from "./content/load";

const page = document.documentElement.dataset.page;

// Hosts serve the same 404.html for every unknown URL, so its language comes from the path.
if (page === "404") {
  document.documentElement.lang = /^\/en(\/|$)/.test(window.location.pathname) ? "en" : "tr";
}

const pages = { soon: <ComingSoon />, "404": <NotFound />, project: <ProjectPage />, events: <EventsPage /> } as const;

const root = createRoot(document.getElementById("root")!);
const locale = detectLocale();

/**
 * Scrolls to the URL's #section once the page is drawn. The browser tries on load, but the page may only
 * render after the saved content arrives, when that attempt has already found nothing.
 */
function ScrollToHash() {
  useEffect(() => {
    if (window.location.hash.length <= 1) return;
    try {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
    } catch {
      // Malformed escape (e.g. "#%"): nothing to scroll to.
    }
  }, []);
  return null;
}

function render(saved: Saved | null, previewProblems?: number) {
  const { content, site, events } = resolve(locale, saved);
  root.render(
    <StrictMode>
      <ContentProvider content={content} site={site} events={events}>
        {pages[page as keyof typeof pages] ?? <App />}
        <ScrollToHash />
        {previewProblems !== undefined && <PreviewBanner problems={previewProblems} />}
      </ContentProvider>
    </StrictMode>,
  );
}

if (inPreview()) {
  // The admin panel's unsaved draft, redrawn whenever the panel (in another tab) changes it. With no draft
  // (nothing changed yet, just saved, signed out, or not an admin at all): the live site, without the banner.
  const show = () => {
    const preview = readPreview();
    // Events aren't part of the draft (the panel saves them at once): the last fetched ones.
    if (preview) return render({ events: readCache()?.events, ...preview.draft }, preview.problems);
    render(readCache());
    fetchSaved().then((fresh) => fresh && render(fresh));
  };
  show();
  window.addEventListener("storage", (e) => e.key === previewKey && show());
} else {
  // Admin-panel edits: a returning visitor sees the last fetched version at once, then the fresh one if it
  // changed. A first visit waits for the fetch (at most 2 s, then the bundled defaults).
  const cached = readCache();
  if (cached) render(cached);
  fetchSaved().then((fresh) => {
    if (fresh ? JSON.stringify(fresh) !== JSON.stringify(cached) : !cached) render(fresh);
  });
}
