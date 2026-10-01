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
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/kou.akillisistemlerkulubu/" },
    { label: "Discord", href: "https://discord.gg/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "GitHub", href: "https://github.com/" },
  ],
};

/** Site languages, in switcher order. `name` is written in its own language (used as the link's accessible name). */
export const languages: { code: "tr" | "en"; label: string; name: string; href: string }[] = [
  { code: "tr", label: "TR", name: "Türkçe", href: "/" },
  { code: "en", label: "EN", name: "English", href: "/en/" },
];

export const discordUrl = club.socials.find((s) => s.label === "Discord")?.href ?? club.joinUrl;

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
