import type { AreaKey, AvatarVariant, LinkSource, ProjectStatus, ProjectVisual, SponsorTier } from "./site";

export type Locale = "tr" | "en";

/** Every piece of visible copy. tr.ts and en.ts must both satisfy this shape. */
export interface Content {
  locale: Locale;
  /** Accessible name of the TR | EN language switcher. */
  switcher: { groupLabel: string };

  club: {
    name: string;
    /** Two-line wordmark next to the logo. */
    wordmark: [string, string];
    university: string;
    semester: string;
  };

  common: {
    joinClub: string;
    skipToContent: string;
    backToTop: string;
    logoLabel: string;
    newTab: string;
    openMenu: string;
    closeMenu: string;
    mainNav: string;
    footerNav: string;
    /** Logo link label on standalone pages, where it goes to the homepage. */
    homeLabel: string;
  };

  nav: { label: string; href: string }[];

  hero: {
    intakeOpen: string;
    tagline: string;
    /** SENSE / THINK / ACT — the third word sits on the lime block. */
    words: [string, string, string];
    /** Step notes next to the first two words (wide screens only). */
    notes: [string, string];
    /** Multiplier for the headline size — lower it if the words are long. */
    scale: number;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    chips: { robotics: string; ml: string; ai: string; automation: string };
    sticker: string;
  };

  /** Extra items for the lime tape after the area titles. */
  tapeExtras: string[];

  about: { title: [string, string]; body: string; principles: string[] };

  stats: { value: string; label: string }[];

  areas: {
    title: string;
    intro: string;
    toolsLabel: string;
    items: { key: AreaKey; title: string; blurb: string; tools: string[] }[];
  };

  projects: {
    title: [string, string];
    intro: string;
    pitch: string;
    stackLabel: string;
    statusLabel: string;
    status: Record<ProjectStatus, string>;
    seatsFree: string;
    items: {
      name: string;
      category: string;
      status: ProjectStatus;
      description: string;
      stack: string[];
      visual: ProjectVisual;
    }[];
  };

  events: {
    title: string;
    calendar: string;
    nextUp: string;
    rsvp: string;
    /** Screen-reader-only text appended to the RSVP button. */
    rsvpFor: (title: string) => string;
    items: { day: string; month: string; title: string; category: string; description: string; place: string }[];
  };

  team: {
    title: [string, string];
    intro: string;
    focus: (focus: string) => string;
    members: string;
    takeSeat: string;
    /** `role` is optional: the role pill is only shown when it is set. */
    people: { name: string; role?: string; focus: string; avatar: AvatarVariant }[];
  };

  sponsors: {
    title: string;
    intro: string;
    tiers: { key: SponsorTier; name: string; perks: string[] }[];
    count: (sponsors: number, open: number) => string;
    yourLogo: string;
    cta: { title: string; body: string; deck: string };
  };

  join: {
    words: [string, string, string];
    body: string;
    primary: string;
    secondary: string;
    details: { k: string; v: string }[];
    memberName: string;
    memberSince: string;
    sticker: string;
  };

  footer: { blurb: string; explore: string; follow: string; rights: (year: number) => string };

  /** "Coming soon" page that placeholder links point to. */
  soon: {
    /** Two-line headline; the second word sits on the lime block. */
    headline: [string, string];
    /** Lead sentence, tailored to where the visitor came from (`?l=…`). */
    lead: Record<LinkSource | "default", string>;
    body: string;
    instagram: string;
    join: string;
    home: string;
    /** Decorative status card. */
    status: { title: string; steps: [string, string][] };
    sticker: string;
  };

  /** 404 page (one 404.html for every unknown URL; language comes from the path). */
  notFound: {
    /** Document title and the heading's accessible name. */
    title: string;
    lead: string;
    body: string;
    home: string;
    projects: string;
    /** Label before the quick links to homepage sections. */
    quickLinks: string;
    /** Decorative "camera found nothing" card. */
    camera: { feed: string; scanning: string; box: string; empty: string; chip: string };
  };
}
