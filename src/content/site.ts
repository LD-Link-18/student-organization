/**
 * Language-independent club data: contact details, links and sponsors.
 * All visible copy (in both languages) lives in tr.ts and en.ts.
 */

export const club = {
  short: "ISC",
  email: "hello@isclub.dev",
  /** Membership form: every "Join the club" button points here. */
  joinUrl: "https://forms.gle/KdrEV5KYtnu5nBre9",
  /** Project proposal form: the "Pitch a project" button points here. */
  projectUrl: "https://forms.gle/FF1eCvrVfPww6fzPA",
  /**
   * Leave `href` empty ("") for channels that don't exist yet: links to them go to the
   * "coming soon" page instead. Fill in the real address and they link out automatically.
   */
  socials: [
    { label: "Instagram", source: "instagram", href: "https://www.instagram.com/kou.akillisistemlerkulubu/" },
    { label: "Discord", source: "discord", href: "" },
    { label: "LinkedIn", source: "linkedin", href: "" },
    { label: "GitHub", source: "github", href: "" },
  ] as { label: string; source: LinkSource; href: string }[],
};

/** Channels a placeholder link can come from; the coming-soon page tailors its message to each. */
export type LinkSource = "instagram" | "discord" | "linkedin" | "github";

/** The "coming soon" page per language (separate HTML entries, see vite.config.ts). */
export const comingSoonPath: Record<"tr" | "en", string> = { tr: "/yakinda/", en: "/en/coming-soon/" };

/** Site languages, in switcher order. `name` is written in its own language (used as the link's accessible name). */
export const languages: { code: "tr" | "en"; label: string; name: string; href: string }[] = [
  { code: "tr", label: "TR", name: "Türkçe", href: "/" },
  { code: "en", label: "EN", name: "English", href: "/en/" },
];

const social = (source: LinkSource) => club.socials.find((s) => s.source === source)!;
export const discordHref = social("discord").href;
export const instagramHref = social("instagram").href;

export type AreaKey = "ai" | "ml" | "robotics" | "vision" | "embedded" | "automation";
export type ProjectStatus = "live" | "progress" | "prototype";
export type ProjectVisual = "vision" | "rover" | "neural" | "gesture";
export type AvatarVariant = 0 | 1 | 2 | 3 | 4 | 5;
export type SponsorTier = "core" | "partner" | "supporter";

export const sponsorship = {
  /** Each lane is padded with "your logo here" slots until it has this many cards. */
  minPerTier: 3,
  /** Link to a sponsorship deck (PDF). The button is hidden while this is empty. */
  deckUrl: "",
};

/**
 * Add sponsors here, e.g.
 *   { name: "Acme Robotics", tier: "core", href: "https://acme.example", logo: "/sponsors/acme.svg" }
 * Put logo files in public/sponsors/ (SVG preferred). Without a logo, the name is shown as text.
 */
export const sponsors: { name: string; tier: SponsorTier; href: string; logo?: string }[] = [];
