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
| `/admin/`          | `admin/index.html`          | [Admin panel](#admin-panel)  |

All but the admin panel load `src/main.tsx`, which picks the copy from `<html lang>` and the page from `<html data-page>`.
The 404 page is a single file that static hosts (Netlify, Cloudflare Pages, GitHub Pages, Vercel) serve for
every unknown URL, so it reads its language from the path instead. The TR/EN button in the navbar links
between the two. Page titles and meta descriptions live in the HTML files.

## Editing content

Most text and links can be changed in the [admin panel](#admin-panel) at `/admin/`, live, without touching
the code. The files below are the **defaults**: what the site shows for anything that hasn't been changed in the
panel (and everything, if the panel isn't set up). Edits saved in the panel win over them.

- [`src/content/tr.ts`](src/content/tr.ts) and [`src/content/en.ts`](src/content/en.ts) hold all visible copy:
  club name, hero, stats, areas, projects, events, team, sponsor tiers, footer. Both must match the
  `Content` type in `src/content/types.ts`, so the build fails if one language is missing a field.
  Lists (team, events, projects) are per language: add a new member or event to **both** files.
- [`src/content/site.ts`](src/content/site.ts) holds language-independent data (`siteDefaults`): email, sign-up
  link (`club.joinUrl`), social links, the sponsor list and sponsorship settings, and `showSponsors`.
  Components read it with `useSite()`.

Other notes:

- Events (`events.items` in both language files): `day` takes one day (`"14"`) or a range (`"13–15"`, en dash).
  The "Join" button is shown disabled until you add `rsvpOpen: true` to the event; then it links to Discord.
- Team cards: add `href: "…"` to a member in **both** `tr.ts` and `en.ts` and the whole card links there (new
  tab). Leave it out and the card is a plain, non-clickable card. Adding `role: "…"` shows a role pill.
- Team avatars are geometric placeholders (`src/components/Avatar.tsx`); swap for `<img>` when photos exist.
- Project previews are drawn in `src/components/ProjectArt.tsx`; swap for screenshots the same way.
- Sponsors: add entries to `sponsors` in `site.ts`, logos go in `public/sponsors/`.
- Channels that don't exist yet: leave their `href` empty in `club.socials` (`site.ts` or the panel). Every link to them
  (footer, join section) then goes to the "coming soon" page in the visitor's language,
  with `?l=whatsapp` / `linkedin` / `github` so the page names the channel. Fill in the real URL and the links
  point there automatically. Event RSVPs use `discordHref` (empty for now, so "coming soon").
- Once the site has a domain, add `<link rel="alternate" hreflang="…">` tags with **absolute** URLs to both
  HTML files so search engines pair the two languages.

## Admin panel

`/admin/` is a login-protected editor for the site's text, links, projects, events, team and sponsors, in both
languages side by side. Saving publishes immediately: no commit, no rebuild. Visitors get the new version on their
next page load.

How it works:

- Saved edits live in [Supabase](https://supabase.com) (table `content`: rows `tr`, `en` and `site`). Every page
  fetches them on load and lays them over the defaults in `src/content/` (`src/content/load.ts`, `merge.ts`).
  Repeat visitors see the last version their browser fetched immediately, then the fresh one.
- [`src/content/schema.ts`](src/content/schema.ts) describes every editable field and its rules (required text,
  link format, allowed values such as a project's `status`). The panel won't save anything that breaks a rule, and
  the site ignores any saved section that does, keeping the default instead. If Supabase is down or not set up,
  the site shows the defaults.
- **Preview** (next to Save) opens the site in another tab with your unsaved changes; it updates as you type, and
  stays in preview while you click around (including TR/EN) until *Exit preview*. The draft only travels between
  tabs of your own browser (`localStorage`), so nobody else sees it.
- Every save is kept in `content_history`, with who saved it. *History* in the panel loads an older version
  back into the editor.
- Function fields (plural rules such as `teamSize`), page `<title>`/meta descriptions in the HTML files, project
  cover drawings and the application form in `public/basvuru/` stay in code.

When you add a field to `Content` (`types.ts`), add it to `schema.ts` too (the build fails otherwise) and to a
form in `src/admin/sections.tsx` if it should be editable.

### Setting it up (once)

1. Create a project at [supabase.com](https://supabase.com) (the free plan is enough).
2. In its **SQL Editor**, run [`supabase/migrations/0001_admin.sql`](supabase/migrations/0001_admin.sql), then
   [`0002_hardening.sql`](supabase/migrations/0002_hardening.sql). (Set up before 0002 existed? Run just that one,
   once.)
3. **Authentication → Sign In / Providers**: turn off **Allow new users to sign up**, so only invited people
   get accounts, and under **Email** set **Minimum password length** to at least 10 (the panel's own check is
   only a hint; Supabase's default is 6). **Authentication → URL Configuration**: set **Site URL** to
   `https://kouakillisistemler.org/admin/` and add `http://localhost:5173/admin/` under **Redirect URLs**.
4. **Project Settings → API Keys**: copy the project URL and the **publishable** key (a legacy `anon` key works
   too). Both are safe to expose: row-level security only lets admins write. Put them in `.env.local` for the dev
   server:

   ```bash
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   and in Vercel (**Settings → Environment Variables**, all environments), then redeploy. The project URL is
   also allowed by name in the `Content-Security-Policy` header in [`vercel.json`](vercel.json) (`connect-src`):
   change it there too if you move to another Supabase project, or the site can't load the saved content.

### Adding an admin

1. **Authentication → Users → Invite user** with their email. They follow the link and choose a password.
2. In the **SQL Editor**:

   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'them@example.com';
   ```

To remove someone, delete their row from `admins` (or the user itself).

Note: Supabase pauses free projects after a week without any requests. Regular visits to the site keep it awake;
if it ever pauses, the site falls back to the defaults until you restore the project in the Supabase dashboard.

## Project pages

Every project gets its own page from one template (`src/components/ProjectPage.tsx`):
`/projeler/<slug>/` and `/en/projects/<slug>/`. `/projeler/` lists them all. The homepage cards link to
these pages automatically.

**To add a project**, use *Projects* in the admin panel, or append an entry to `projects.items` in **both**
`src/content/tr.ts` and `src/content/en.ts`, with the same `slug` in both. No HTML file or route is needed: `vercel.json`
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
