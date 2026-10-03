import type { AreaKey, AvatarVariant, LinkSource, ProjectStatus, ProjectVisual, SponsorTier } from "./site";

export type Locale = "tr" | "en";

/**
 * One project: the card on the homepage and its own page at /projeler/<slug>/ (/en/projects/<slug>/).
 * `slug` must be the same in tr.ts and en.ts so the language switch finds the other version.
 */
export interface Project {
  slug: string;
  name: string;
  category: string;
  status: ProjectStatus;
  /** One or two sentences for the homepage card. */
  description: string;
  stack: string[];
  visual: ProjectVisual;
  /** e.g. "Eylül 2025" */
  started: string;
  /** Lead paragraph at the top of the project page. */
  overview: string;
  /** 2–4 headline numbers. */
  highlights: { value: string; label: string }[];
  /** Story blocks, e.g. Problem / How it works / What's next. */
  sections: { title: string; body: string }[];
  /** Milestones, oldest first. */
  timeline: { date: string; text: string }[];
  /**
   * Optional: hidden when empty or missing. A member who is also on the club team (`team.people`) gets
   * that member's avatar and link automatically; `role` is optional and only shown when set.
   */
  team?: { name: string; role?: string }[];
  /** Source code. "" = not public yet (links to the coming-soon page); omit to hide the button. */
  repo?: string;
  /** Live demo. Omit or leave empty to hide the button. */
  demo?: string;
}

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
    /** Card label linking to the project's own page. */
    view: string;
    items: Project[];
  };

  /** Labels used on every project page (the template). */
  projectPage: {
    home: string;
    breadcrumb: string;
    started: string;
    statusLabel: string;
    teamSize: (n: number) => string;
    repo: string;
    demo: string;
    highlights: string;
    stack: string;
    timeline: string;
    team: string;
    join: { title: string; body: string; cta: string; pitch: string };
    next: string;
    docTitle: (name: string) => string;
    listDocTitle: string;
  };

  events: {
    title: string;
    calendar: string;
    nextUp: string;
    rsvp: string;
    /** Screen-reader-only text appended to the RSVP button. */
    rsvpFor: (title: string) => string;
    /** Screen-reader-only text appended to a disabled RSVP button. */
    rsvpClosed: string;
    items: {
      /** One day ("14") or a range ("13–15", with an en dash). */
      day: string;
      month: string;
      title: string;
      category: string;
      description: string;
      place: string;
      /** Turn the RSVP button on. Left out (or false) the button is shown disabled. */
      rsvpOpen?: boolean;
    }[];
  };

  team: {
    title: [string, string];
    intro: string;
    focus: (focus: string) => string;
    members: string;
    takeSeat: string;
    /**
     * `role` is optional: the role pill is only shown when it is set.
     * `href` is optional: the whole card links to it (LinkedIn, personal site …) in a new tab.
     */
    people: { name: string; role?: string; focus: string; avatar: AvatarVariant; href?: string }[];
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
