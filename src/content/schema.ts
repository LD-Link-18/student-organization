import * as z from "zod/mini";
import { areaKeys, avatarVariants, linkSources, navHrefs, projectStatuses, projectVisuals, sponsorTiers, type SiteData } from "./site";
import type { Content } from "./types";

/**
 * What the admin panel may change, and the rules it must follow. The panel refuses to save anything that
 * fails these checks, and the site ignores any saved section that fails them (keeping the default from
 * tr.ts / en.ts / site.ts instead), so a bad edit can't break a page.
 *
 * Must describe exactly the data fields of `Content` and `SiteData`: the checks at the bottom fail the
 * build otherwise. When adding a field to `Content`, make it optional here (and in types.ts) or add it to
 * both language files, so content saved before the change still passes.
 */

/** Any non-blank text. Not trimmed: some labels start with a space on purpose (" (opens in a new tab)"). */
const text = z.string().check(z.refine((s) => s.trim() !== "", "Required"));
const pair = z.tuple([text, text]);
const triple = z.tuple([text, text, text]);
/** Empty, or an address starting with https://, / or mailto:. */
const linkPattern = z.regex(/^(https?:\/\/\S+|\/\S*|mailto:\S+)?$/, "Must start with https://, / or mailto:");
const link = z.string().check(linkPattern);
const requiredLink = z.string().check(linkPattern, z.refine((s) => s !== "", "Required"));

const unique =
  <T,>(by: (item: T) => string, what: string) =>
  (items: T[], ctx: z.core.$RefinementCtx<T[]>) => {
    const seen = new Set<string>();
    items.forEach((item, i) => {
      if (seen.has(by(item))) ctx.addIssue({ code: "custom", message: `Duplicate ${what}`, path: [i] });
      seen.add(by(item));
    });
  };

const project = z.object({
  slug: z.string().check(z.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters, digits and dashes only (e.g. traffic-sim)")),
  name: text,
  category: text,
  status: z.enum(projectStatuses),
  description: text,
  stack: z.array(text),
  visual: z.enum(projectVisuals),
  started: text,
  overview: text,
  highlights: z.array(z.object({ value: text, label: text })).check(z.maxLength(4, "At most 4")),
  sections: z.array(z.object({ title: text, body: text })),
  timeline: z.array(z.object({ date: text, text: text })),
  team: z.optional(z.array(z.object({ name: text, role: z.optional(z.string()), href: z.optional(link) }))),
  repo: z.optional(link),
  demo: z.optional(link),
});

export const contentSchema = z.object({
  switcher: z.object({ groupLabel: text }),
  club: z.object({ name: text, wordmark: pair, university: text, semester: text }),
  common: z.object({
    joinClub: text,
    skipToContent: text,
    backToTop: text,
    logoLabel: text,
    newTab: text,
    openMenu: text,
    closeMenu: text,
    mainNav: text,
    footerNav: text,
    homeLabel: text,
  }),
  nav: z.array(z.object({ label: text, href: z.enum(navHrefs) })),
  socialFloat: z.object({
    region: text,
    whatsapp: z.object({ label: text, title: text }),
    instagram: z.object({ label: text }),
  }),
  hero: z.object({
    intakeOpen: text,
    tagline: text,
    words: triple,
    notes: pair,
    scale: z.number().check(z.gte(0.5, "Between 0.5 and 1.2"), z.lte(1.2, "Between 0.5 and 1.2")),
    intro: text,
    primaryCta: text,
    secondaryCta: text,
    chips: z.object({ robotics: text, ml: text, ai: text, automation: text }),
    sticker: text,
  }),
  tapeExtras: z.array(text),
  about: z.object({ title: pair, body: text, principles: z.array(text) }),
  stats: z.array(z.object({ value: text, label: text })),
  areas: z.object({
    title: text,
    intro: text,
    toolsLabel: text,
    items: z
      .array(z.object({ key: z.enum(areaKeys), title: text, blurb: text, tools: z.array(text) }))
      .check(z.superRefine(unique((a) => a.key, "icon"))),
  }),
  projects: z.object({
    title: pair,
    intro: text,
    pitch: text,
    stackLabel: text,
    statusLabel: text,
    status: z.object({ done: text, progress: text, prototype: text }),
    view: text,
    items: z.array(project).check(z.minLength(1, "Keep at least one project"), z.superRefine(unique((p) => p.slug, "slug"))),
  }),
  projectPage: z.object({
    home: text,
    breadcrumb: text,
    started: text,
    statusLabel: text,
    repo: text,
    demo: text,
    highlights: text,
    stack: text,
    timeline: text,
    team: text,
    join: z.object({ title: text, body: text, cta: text, pitch: text }),
    next: text,
    listDocTitle: text,
  }),
  events: z.object({
    title: text,
    calendar: text,
    nextUp: text,
    rsvp: text,
    rsvpClosed: text,
    ongoing: text,
    empty: text,
    seeAll: text,
    page: z.object({ title: text, intro: text, upcoming: text, past: text }),
    detail: z.object({ pastBadge: text, photos: text, close: text, previous: text, next: text }),
    signup: z.object({
      title: text,
      intro: text,
      full: text,
      name: text,
      email: text,
      studentNo: text,
      phone: text,
      optional: text,
      required: text,
      invalidEmail: text,
      invalidStudentNo: text,
      invalidPhone: text,
      tooLong: text,
      noticeTitle: text,
      notice: text,
      consent: text,
      submit: text,
      sending: text,
      done: text,
      waitlisted: text,
      closed: text,
      duplicate: text,
      busy: text,
      failed: text,
    }),
  }),
  team: z.object({
    title: pair,
    intro: text,
    members: text,
    takeSeat: text,
    people: z.array(
      z.object({ name: text, role: z.optional(z.string()), focus: text, avatar: z.literal(avatarVariants), href: z.optional(link) }),
    ),
  }),
  sponsors: z.object({
    title: text,
    intro: text,
    tiers: z
      .array(z.object({ key: z.enum(sponsorTiers), name: text, perks: z.array(text) }))
      .check(z.superRefine(unique((t) => t.key, "tier"))),
    yourLogo: text,
    cta: z.object({ title: text, body: text, deck: text }),
  }),
  join: z.object({
    words: triple,
    body: text,
    primary: text,
    secondary: text,
    memberName: text,
    memberSince: text,
    sticker: text,
  }),
  footer: z.object({ blurb: text, explore: text, follow: text }),
  soon: z.object({
    headline: pair,
    lead: z.object({ default: text, ...Object.fromEntries(linkSources.map((s) => [s, text])) } as Record<"default" | (typeof linkSources)[number], typeof text>),
    body: text,
    instagram: text,
    join: text,
    home: text,
    status: z.object({ title: text, steps: z.array(pair) }),
    sticker: text,
  }),
  notFound: z.object({
    title: text,
    lead: text,
    body: text,
    home: text,
    projects: text,
    quickLinks: text,
    camera: z.object({ feed: text, scanning: text, box: text, empty: text, chip: text }),
  }),
});

export const siteSchema = z.object({
  club: z.object({
    short: text,
    email: z.email("Not an email address"),
    joinUrl: requiredLink,
    projectUrl: requiredLink,
    socials: z.array(z.object({ label: text, source: z.enum(linkSources), href: link })),
  }),
  showSponsors: z.boolean(),
  discordHref: link,
  sponsorship: z.object({ minPerTier: z.int().check(z.gte(0, "0 to 12"), z.lte(12, "0 to 12")), deckUrl: link }),
  sponsors: z
    .array(z.object({ name: text, tier: z.enum(sponsorTiers), href: requiredLink, logo: z.optional(link) }))
    .check(z.superRefine(unique((s) => s.name, "sponsor name"))),
});

/** A calendar day, as Postgres sends a `date`: 2026-10-20. */
const day = z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"));

const upTo = (max: number) => z.string().check(z.refine((s) => s.trim() !== "", "Required"), z.maxLength(max, `At most ${max} characters`));

/**
 * A row of the `events` table (supabase/migrations/0005_events.sql), in both languages. Rows come from the
 * database, which has the same rules; the site still checks them and leaves out any row that fails, and the
 * panel checks an event with them before saving it.
 */
export const eventRowSchema = z
  .object({
    id: z.number(),
    starts_on: day,
    ends_on: z.nullable(day),
    title_tr: upTo(120),
    title_en: upTo(120),
    category_tr: upTo(40),
    category_en: upTo(40),
    place_tr: upTo(80),
    place_en: upTo(80),
    description_tr: upTo(1000),
    description_en: upTo(1000),
    rsvp_open: z.boolean(),
  })
  .check(z.refine((e) => !e.ends_on || e.ends_on >= e.starts_on, { message: "Can't end before it starts", path: ["ends_on"] }));
export type EventRow = z.infer<typeof eventRowSchema>;

/** A photo file in the site-assets bucket, as 0006_event_pages.sql allows it. */
const photoPath = z.string().check(z.regex(/^events\/\d+\/[A-Za-z0-9_-]+\.(webp|jpg)$/));
export const eventPhotoSchema = z.object({ src: photoPath, thumb: photoPath, w: z.number(), h: z.number() });
export type EventPhoto = z.infer<typeof eventPhotoSchema>;

/** Short, fixed ids for questions and options, so renaming one keeps the answers given before. */
const formId = z.string().check(z.regex(/^[a-z0-9]{1,16}$/));
export const questionTypes = ["text", "textarea", "one", "many", "yesno"] as const;

/**
 * An event's sign-up form (supabase/migrations/0007_event_signups.sql, `event_form_valid` there has the same
 * rules): name, email and consent are always asked; student number and phone when switched on; then the
 * questions. "one" and "many" questions have 2 to 30 options.
 */
export const eventFormSchema = z.object({
  ask_student_no: z.boolean(),
  ask_phone: z.boolean(),
  questions: z
    .array(
      z.object({
        id: formId,
        type: z.enum(questionTypes),
        label_tr: upTo(300),
        label_en: upTo(300),
        required: z.boolean(),
        options: z.optional(z.array(z.object({ id: formId, tr: upTo(120), en: upTo(120) }))),
      }),
    )
    .check(z.maxLength(30, "At most 30 questions")),
});
export type EventForm = z.infer<typeof eventFormSchema>;
export type FormQuestion = EventForm["questions"][number];
export const emptyForm: EventForm = { ask_student_no: false, ask_phone: false, questions: [] };

/**
 * What only an event's own page needs (supabase/migrations/0006_event_pages.sql, 0007_event_signups.sql): the
 * long write-up in both languages (empty: the short description instead), the photos, and the sign-up form with
 * its number of places (null: no limit). Loaded by that page alone, so the lists stay light.
 */
export const eventExtrasSchema = z.object({
  details_tr: z.string().check(z.maxLength(10000, "At most 10000 characters")),
  details_en: z.string().check(z.maxLength(10000, "At most 10000 characters")),
  photos: z.array(eventPhotoSchema).check(z.maxLength(100, "At most 100 photos")),
  form: eventFormSchema,
  capacity: z.nullable(z.number()),
});
export type EventExtras = z.infer<typeof eventExtrasSchema>;

/** `T` without its function-valued fields (the copy that needs code, like plural rules). */
type Data<T> = T extends (...args: never[]) => unknown
  ? never
  : T extends readonly unknown[]
    ? { [K in keyof T]: Data<T[K]> }
    : T extends object
      ? { [K in keyof T as T[K] extends (...args: never[]) => unknown ? never : K]: Data<T[K]> }
      : T;

/** The part of `Content` the admin panel edits: everything but the functions and `locale`. */
export type EditableContent = Omit<Data<Content>, "locale">;

// Fail the type-check when the schemas drift from types.ts / site.ts (each must fit the other).
({}) as z.infer<typeof contentSchema> satisfies EditableContent;
({}) as EditableContent satisfies z.infer<typeof contentSchema>;
({}) as z.infer<typeof siteSchema> satisfies SiteData;
({}) as SiteData satisfies z.infer<typeof siteSchema>;
