# Smart Systems Club (Akıllı Sistemler Kulübü) — website

Landing page for the Kocaeli University Smart Systems Club (Akıllı Sistemler Kulübü). React + TypeScript + Vite + Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

## Languages

The site ships in two languages as two HTML entries:

| URL                | Entry                       | Page                         |
| ------------------ | --------------------------- | ---------------------------- |
| `/`                | `index.html`                | Turkish site (default)       |
| `/en/`             | `en/index.html`             | English site                 |
| `/projeler/…`      | `projeler/index.html`       | Turkish project list + pages |
| `/en/projects/…`   | `en/projects/index.html`    | English project list + pages |
| `/yakinda/`        | `yakinda/index.html`        | Turkish "coming soon" page   |
| `/en/coming-soon/` | `en/coming-soon/index.html` | English "coming soon" page   |
| any unknown URL    | `404.html`                  | 404 page (EN under `/en/…`)  |

All load `src/main.tsx`, which picks the copy from `<html lang>` and the page from `<html data-page>`.
The 404 page is a single file that static hosts (Netlify, Cloudflare Pages, GitHub Pages, Vercel) serve for
every unknown URL, so it reads its language from the path instead. The TR/EN button in the navbar links
between the two. Page titles and meta descriptions live in the HTML files.

## Editing content

- [`src/content/tr.ts`](src/content/tr.ts) and [`src/content/en.ts`](src/content/en.ts) hold all visible copy:
  club name, hero, stats, areas, projects, events, team, sponsor tiers, footer. Both must match the
  `Content` type in `src/content/types.ts`, so the build fails if one language is missing a field.
  Lists (team, events, projects) are per language: add a new member or event to **both** files.
- [`src/content/site.ts`](src/content/site.ts) holds language-independent data: email, sign-up link
  (`club.joinUrl`), social links, the sponsor list and sponsorship settings.

Other notes:

- Events (`events.items` in both language files): `day` takes one day (`"14"`) or a range (`"13–15"`, en dash).
  The "Join" button is shown disabled until you add `rsvpOpen: true` to the event; then it links to Discord.
- Team cards: add `href: "…"` to a member in **both** `tr.ts` and `en.ts` and the whole card links there (new
  tab). Leave it out and the card is a plain, non-clickable card. Adding `role: "…"` shows a role pill.
- Team avatars are geometric placeholders (`src/components/Avatar.tsx`); swap for `<img>` when photos exist.
- Project previews are drawn in `src/components/ProjectArt.tsx`; swap for screenshots the same way.
- Sponsors: add entries to `sponsors` in `site.ts`, logos go in `public/sponsors/`.
- Channels that don't exist yet: leave their `href` empty in `club.socials` (`site.ts`). Every link to them
  (footer, event RSVPs, "Say hi on Discord") then goes to the "coming soon" page in the visitor's language,
  with `?l=discord` / `linkedin` / `github` so the page names the channel. Fill in the real URL and the links
  point there automatically.
- Once the site has a domain, add `<link rel="alternate" hreflang="…">` tags with **absolute** URLs to both
  HTML files so search engines pair the two languages.

## Project pages

Every project gets its own page from one template (`src/components/ProjectPage.tsx`):
`/projeler/<slug>/` and `/en/projects/<slug>/`. `/projeler/` lists them all. The homepage cards link to
these pages automatically.

**To add a project**, append an entry to `projects.items` in **both** `src/content/tr.ts` and
`src/content/en.ts`, with the same `slug` in both. No HTML file or route is needed: `vercel.json`
rewrites every `/projeler/<slug>/` to the shared page, and the dev server reads the same rules.

| Field | Shown as |
| --- | --- |
| `slug` | URL part (`visioncore` → `/projeler/visioncore/`); lowercase, no spaces |
| `name`, `category`, `description`, `stack` | Homepage card (and page header) |
| `status` | `"done"` (Tamamlandı), `"progress"` (Devam ediyor) or `"prototype"`; the badge on card and page |
| `visual` | Cover drawing: `"koubot"`, `"scribble"`, `"traffic"` or `"quill"` |
| `started`, `overview` | Page header |
| `highlights` | 2–4 headline numbers under the header |
| `sections` | Story blocks (Problem / How it works / What's next …) |
| `timeline` | Milestones, oldest first; the last one is highlighted |
| `team` *(optional)* | Team cards (name, optional `role`); a member who is also on the club team gets their avatar and link; hidden when missing or empty |
| `repo` *(optional)* | "Source code" button; `""` links to the coming-soon page, omit to hide |
| `demo` *(optional)* | "Live demo" button; hidden when missing or empty |

Each `visual` is a small SVG scene in `src/components/ProjectArt.tsx` (no text in them, so both languages share
it). For a new project, add a case there with a new name (and to `ProjectVisual` in `site.ts`), or swap in a
screenshot. An unknown slug shows the 404 page (with HTTP status 200, since the shared HTML exists).

The text under each project's `items` comment in `tr.ts` / `en.ts` (stack, dates, highlights, sections and
timeline) is drafted placeholder content around the real name, description, team and status: replace it with the
project's real details.

## Link previews (OG image)

When a page is shared (WhatsApp, Instagram DM, X, LinkedIn, Discord …) the preview card shows
`public/og/og-tr.png` or `public/og/og-en.png` (1200×630), depending on the page's language. The `socialMeta`
plugin in `vite.config.ts` adds the Open Graph / Twitter tags to every page at build time, using the page's
own `<title>` and description. Project pages share the `/projeler/` preview, since crawlers don't run JavaScript.

Image URLs must be absolute. On Vercel the plugin uses `VERCEL_PROJECT_PRODUCTION_URL` (the production domain,
so previews from preview deployments also work); keep **Settings → Environment Variables → Automatically
expose System Environment Variables** turned on (the default). On another host, set `SITE_URL`
(e.g. `SITE_URL=https://example.com npm run build`).

**To regenerate the images** after changing the headline, name or colors: the card is a React page built from
the site's own components (`src/og/OgImage.tsx`), so run `npm run dev`, open
`http://localhost:5173/tools/og/` (Turkish) and `http://localhost:5173/tools/og/?lang=en`, and save a
1200×630 screenshot of each over the files in `public/og/` (in Chrome DevTools: device toolbar at
1200×630, then ⋮ → *Capture screenshot*). `tools/og/` is not part of the build.

## Design system

Tokens (colors, fonts, hard shadows, easing, animations) are defined in the `@theme` block of
[`src/index.css`](src/index.css), followed by reusable classes: `.btn` + variants, `.glass`, `.card-brut`,
`.lift` (hard-shadow hover; set `--sc` to recolor the shadow), `.pill`, `.tag`, `.grid-lines`,
`.display-xl/lg/md`, `.text-outline`, `.highlight`.

| Token          | Value     | Use                                  |
| -------------- | --------- | ------------------------------------ |
| `violet`       | `#621FE9` | Dominant brand color                 |
| `lime`         | `#B7E90A` | Accents, CTAs, highlights            |
| `paper`        | `#FEFEFE` | Main white                           |
| `fog`          | `#E7E7E7` | Off-white section backgrounds        |
| `ink`          | `#000000` | Borders, hard shadows, text          |
| `violet-deep`  | `#4A12BF` | Depth shade of the brand violet      |
| `violet-night` | `#22075C` | Footer, project art backgrounds      |

Motion respects `prefers-reduced-motion`.
