/**
 * Language-independent club data: contact details, links and sponsors.
 * All visible copy (in both languages) lives in tr.ts and en.ts.
 *
 * `siteDefaults` is what the site shows when the admin panel (/admin/) hasn't saved anything; saved
 * changes from the database are merged over it at load time (see load.ts). Components read the
 * merged data with `useSite()` from i18n.tsx, never `siteDefaults` directly.
 */

/** Channels a placeholder link can come from; the coming-soon page tailors its message to each. */
export const linkSources = ["instagram", "whatsapp", "discord", "linkedin", "github"] as const;
export type LinkSource = (typeof linkSources)[number];

/** Homepage sections the nav links to (nav labels are editable, the targets aren't). */
export const navHrefs = ["#about", "#areas", "#projects", "#events", "#team", "#sponsors"] as const;
export type NavHref = (typeof navHrefs)[number];

export const areaKeys = ["ai", "ml", "robotics", "vision", "embedded", "automation"] as const;
export type AreaKey = (typeof areaKeys)[number];
/** Project states: finished, being worked on, or an early prototype. */
export const projectStatuses = ["done", "progress", "prototype"] as const;
export type ProjectStatus = (typeof projectStatuses)[number];
/** Drawn cover per project, see components/ProjectArt.tsx. */
export const projectVisuals = ["koubot", "scribble", "traffic", "quill"] as const;
export type ProjectVisual = (typeof projectVisuals)[number];
export const avatarVariants = [0, 1, 2, 3, 4, 5] as const;
export type AvatarVariant = (typeof avatarVariants)[number];
export const sponsorTiers = ["core", "partner", "supporter"] as const;
export type SponsorTier = (typeof sponsorTiers)[number];

export interface SiteData {
  club: {
    short: string;
    email: string;
    /** Membership form: every "Join the club" button points here. */
    joinUrl: string;
    /** Project proposal form: the "Pitch a project" button points here. */
    projectUrl: string;
    /**
     * Leave `href` empty ("") for channels that don't exist yet: links to them go to the
     * "coming soon" page instead. Fill in the real address and they link out automatically.
     */
    socials: { label: string; source: LinkSource; href: string }[];
  };
  /** Shows the sponsors section ("Laba güç ver") and its nav links. */
  showSponsors: boolean;
  /** No Discord server yet, so event RSVPs go to the "coming soon" page. Put its invite link here once it exists. */
  discordHref: string;
  sponsorship: {
    /** Each lane is padded with "your logo here" slots until it has this many cards. */
    minPerTier: number;
    /** Link to a sponsorship deck (PDF). The button is hidden while this is empty. */
    deckUrl: string;
  };
  /**
   * e.g. { name: "Acme Robotics", tier: "core", href: "https://acme.example", logo: "/sponsors/acme.svg" }
   * Logos are uploaded in the admin panel, or put in public/sponsors/ (SVG preferred). Without a logo,
   * the name is shown as text.
   */
  sponsors: { name: string; tier: SponsorTier; href: string; logo?: string }[];
}

export const siteDefaults: SiteData = {
  club: {
    short: "ISC",
    email: "kou.akillisistemler@gmail.com",
    joinUrl: "https://kouakillisistemler.org/basvuru",
    projectUrl: "https://forms.gle/FF1eCvrVfPww6fzPA",
    socials: [
      { label: "Instagram", source: "instagram", href: "https://www.instagram.com/kou.akillisistemlerkulubu/" },
      { label: "WhatsApp", source: "whatsapp", href: "https://chat.whatsapp.com/Bbk7WDlYipaDkPL6XjJfB3" },
      { label: "LinkedIn", source: "linkedin", href: "" },
      { label: "GitHub", source: "github", href: "" },
    ],
  },
  showSponsors: false,
  discordHref: "",
  sponsorship: { minPerTier: 3, deckUrl: "" },
  sponsors: [],
};

/** A channel's address from `club.socials`, "" when it isn't listed or set up yet. */
export const socialHref = (site: SiteData, source: LinkSource) => site.club.socials.find((s) => s.source === source)?.href ?? "";

/** Project pages: the list lives here and each project at `<path><slug>/` (see vercel.json rewrites). */
export const projectsPath: Record<"tr" | "en", string> = { tr: "/projeler/", en: "/en/projects/" };
export const projectHref = (locale: "tr" | "en", slug: string) => `${projectsPath[locale]}${slug}/`;

/** The "coming soon" page per language (separate HTML entries, see vite.config.ts). */
export const comingSoonPath: Record<"tr" | "en", string> = { tr: "/yakinda/", en: "/en/coming-soon/" };

/** Site languages, in switcher order. `name` is written in its own language (used as the link's accessible name). */
export const languages: { code: "tr" | "en"; label: string; name: string; href: string }[] = [
  { code: "tr", label: "TR", name: "Türkçe", href: "/" },
  { code: "en", label: "EN", name: "English", href: "/en/" },
];
