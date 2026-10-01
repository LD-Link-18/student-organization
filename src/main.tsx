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

const page = document.documentElement.dataset.page;

// Hosts serve the same 404.html for every unknown URL, so its language comes from the path.
if (page === "404") {
  document.documentElement.lang = /^\/en(\/|$)/.test(window.location.pathname) ? "en" : "tr";
}

const pages = { soon: <ComingSoon />, "404": <NotFound />, project: <ProjectPage /> } as const;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContentProvider locale={detectLocale()}>
      {pages[page as keyof typeof pages] ?? <App />}
    </ContentProvider>
  </StrictMode>,
);
