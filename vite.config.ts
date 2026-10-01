import fs from "node:fs";
import path from "node:path";
import type { Connect } from "vite";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** Rewrites from vercel.json ("/projeler/:slug" → "/projeler/index.html"), compiled to regexes. */
const rewrites: { pattern: RegExp; destination: string }[] = (
  JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, "vercel.json"), "utf-8")).rewrites ?? []
).map((r: { source: string; destination: string }) => ({
  pattern: new RegExp(`^${r.source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/:\w+/g, "[^/]+")}$`),
  destination: r.destination,
}));

/**
 * Makes `npm run dev` and `npm run preview` route pages the way Vercel does (see vercel.json):
 * - a folder URL without its trailing slash (/yakinda) redirects to /yakinda/
 * - vercel.json rewrites apply (project pages share one HTML file per language)
 * - any other unknown page URL gets 404.html with status 404
 * Vite's default would quietly serve the homepage instead.
 */
function vercelLikeRouting(): Plugin {
  const middleware =
    (roots: string[], pageRoot: string, render: (html: string, url: string) => Promise<string>): Connect.NextHandleFunction =>
    (req, res, next) => {
      // Only page navigations; leave module, asset and HMR requests to Vite.
      if (req.method !== "GET" || !req.headers.accept?.includes("text/html")) return next();
      const url = new URL(req.url ?? "/", "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      const isFile = (p: string) => roots.some((r) => fs.statSync(path.join(r, p), { throwIfNoEntry: false })?.isFile());

      if (isFile(pathname) || (pathname.endsWith("/") && isFile(path.join(pathname, "index.html")))) return next();
      const rewrite = rewrites.find((r) => r.pattern.test(pathname));
      if (!pathname.endsWith("/") && (isFile(path.join(pathname, "index.html")) || rewrite)) {
        res.writeHead(308, { Location: `${pathname}/${url.search}` });
        return res.end();
      }
      if (rewrite) {
        req.url = rewrite.destination + url.search;
        return next();
      }
      render(fs.readFileSync(path.join(pageRoot, "404.html"), "utf-8"), req.originalUrl ?? "/404.html")
        .then((html) => {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(html);
        })
        .catch(next);
    };

  return {
    name: "vercel-like-routing",
    configureServer(server) {
      const { root, publicDir } = server.config;
      server.middlewares.use(middleware([root, publicDir], root, (html, url) => server.transformIndexHtml(url, html)));
    },
    configurePreviewServer(server) {
      const dist = path.resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use(middleware([dist], dist, async (html) => html));
    },
  };
}

// Turkish at / (default) and English at /en/, project pages (/projeler/, /en/projects/), a
// "coming soon" page per language for links that aren't set up yet, and a shared 404 page.
// All load src/main.tsx, which picks the language from <html lang> and the page from
// <html data-page>.
export default defineConfig({
  appType: "mpa",
  plugins: [react(), tailwindcss(), vercelLikeRouting()],
  build: {
    rollupOptions: {
      input: {
        tr: path.resolve(import.meta.dirname, "index.html"),
        en: path.resolve(import.meta.dirname, "en/index.html"),
        soonTr: path.resolve(import.meta.dirname, "yakinda/index.html"),
        soonEn: path.resolve(import.meta.dirname, "en/coming-soon/index.html"),
        projectsTr: path.resolve(import.meta.dirname, "projeler/index.html"),
        projectsEn: path.resolve(import.meta.dirname, "en/projects/index.html"),
        // Served by Vercel (and most static hosts) for unknown URLs.
        notFound: path.resolve(import.meta.dirname, "404.html"),
      },
    },
  },
});
