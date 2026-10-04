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

/**
 * Absolute site address for social previews (og:image must be an absolute URL).
 * Vercel provides VERCEL_PROJECT_PRODUCTION_URL at build time (the production domain, even on preview
 * deployments); SITE_URL overrides it on other hosts. Without either, image URLs stay relative.
 */
const siteUrl = (
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
).replace(/\/$/, "");

const ogImageAlt = {
  tr: "Akıllı Sistemler Kulübü: Algıla. Düşün. Yap. Kocaeli Üniversitesi'nde bir öğrenci topluluğu.",
  en: "Smart Systems Club: Sense. Think. Act. A student community at Kocaeli University.",
};

/**
 * Adds Open Graph and Twitter card tags to every page, built from the page's own <title>,
 * description and language, so the HTML entries only keep those. The images live in public/og/.
 */
function socialMeta(): Plugin {
  const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  return {
    name: "social-meta",
    transformIndexHtml(html, ctx) {
      if (ctx.path.startsWith("/tools/")) return html; // the OG image renderer itself
      const lang = /<html lang="en"/.test(html) ? "en" : "tr";
      const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "";
      const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
      const page = ctx.path.replace(/index\.html$/, "");
      const image = `${siteUrl}/og/og-${lang}.png`;
      const tags: [string, string, string][] = [
        ["property", "og:type", "website"],
        ["property", "og:site_name", lang === "en" ? "Smart Systems Club" : "Akıllı Sistemler Kulübü"],
        ["property", "og:locale", lang === "en" ? "en_US" : "tr_TR"],
        ["property", "og:locale:alternate", lang === "en" ? "tr_TR" : "en_US"],
        ["property", "og:title", title],
        ["property", "og:image", image],
        ["property", "og:image:width", "1200"],
        ["property", "og:image:height", "630"],
        ["property", "og:image:alt", ogImageAlt[lang]],
        ["name", "twitter:card", "summary_large_image"],
        ["name", "twitter:title", title],
        ["name", "twitter:image", image],
        ["name", "twitter:image:alt", ogImageAlt[lang]],
      ];
      if (description) tags.push(["property", "og:description", description], ["name", "twitter:description", description]);
      if (siteUrl && !page.endsWith(".html")) tags.push(["property", "og:url", siteUrl + page]);
      const meta = tags.map(([k, n, v]) => `    <meta ${k}="${n}" content="${attr(v)}" />`).join("\n");
      return html.replace("</head>", `${meta}\n  </head>`);
    },
  };
}

// Turkish at / (default) and English at /en/, project pages (/projeler/, /en/projects/), a
// "coming soon" page per language for links that aren't set up yet, and a shared 404 page.
// All load src/main.tsx, which picks the language from <html lang> and the page from
// <html data-page>.
export default defineConfig({
  appType: "mpa",
  plugins: [react(), tailwindcss(), vercelLikeRouting(), socialMeta()],
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
