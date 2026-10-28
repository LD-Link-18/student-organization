import { useContent, useEvents } from "../content/i18n";
import { dateParts, isOngoing, splitEvents, type ClubEvent } from "../content/events";
import { eventHref, eventsPath } from "../content/site";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

/** Grid placement shared by the active and the disabled RSVP button. */
const RSVP_PLACEMENT =
  "col-span-2 w-full md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1 md:w-auto lg:col-start-4 lg:row-span-1";

/** How many upcoming events the homepage lists; the rest are on the events page. */
const HOMEPAGE_LIMIT = 4;

/**
 * One event in a list; the whole row links to the event's own page. `badge` sits on its top edge ("next up",
 * "happening now"); a `past` event shows its year and no RSVP button.
 */
export function EventRow({ event: e, i, badge, past = false, headingLevel = 3 }: { event: ClubEvent; i: number; badge?: string; past?: boolean; headingLevel?: 2 | 3 }) {
  const { events, locale } = useContent();
  const { day, month } = dateParts(e, locale, past);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Reveal as="li" i={i % 3} className="group relative border-t-2 border-ink">
      {/* lime wipe on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-lime transition-transform duration-500 ease-[var(--ease-out-expo)] group-focus-within:scale-x-100 group-hover:scale-x-100"
      />
      <article
        className={`relative grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-4 py-7 sm:gap-x-8 md:items-center md:py-9 lg:gap-x-8 xl:gap-x-10 ${
          past ? "md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_11rem] xl:grid-cols-[auto_1fr_15rem]" : "md:grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_11rem_auto] xl:grid-cols-[auto_1fr_15rem_auto]"
        }`}
      >
        {/* min widths keep single-day dates aligned; a range ("13–15") is set smaller and widens its column */}
        <p className="font-display leading-none transition-transform duration-500 group-hover:translate-x-2 md:min-w-[8.5rem] lg:min-w-[9rem] xl:min-w-[10rem]">
          <time dateTime={e.start}>
            <span className={`block font-bold tracking-[-0.06em] ${day.length > 2 ? "text-5xl md:text-6xl lg:text-7xl" : "text-6xl md:text-7xl lg:text-8xl"}`}>
              {day}
            </span>
            <span className="mt-1 block text-lg font-semibold">{month}</span>
          </time>
        </p>

        <div>
          <Heading className="text-2xl leading-[1.05] font-bold tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl">
            {/* stretched over the row; the RSVP button sits above it */}
            <a href={eventHref(locale, e)} className="outline-none after:absolute after:inset-0">
              {e.title}
            </a>
          </Heading>
          <p className="mt-3 max-w-xl leading-relaxed text-ink/75">{e.description}</p>
        </div>

        <div className="col-span-2 flex flex-wrap items-center gap-2 md:col-span-1 md:col-start-2 lg:col-start-auto lg:flex-col lg:items-start">
          <span className="pill border-ink bg-paper">{e.category}</span>
          <span className="meta text-ink/70">{e.place}</span>
        </div>

        {!past &&
          (e.rsvpOpen ? (
            <a href={`${eventHref(locale, e)}#signup`} className={`btn btn-paper relative z-10 ${RSVP_PLACEMENT}`}>
              {events.rsvp}
              <span className="sr-only">{events.rsvpFor(e.title)}</span>
            </a>
          ) : (
            <button type="button" disabled className={`btn btn-paper relative z-10 ${RSVP_PLACEMENT}`}>
              {events.rsvp}
              <span className="sr-only">
                {events.rsvpFor(e.title)}
                {events.rsvpClosed}
              </span>
            </button>
          ))}
      </article>
      {badge && (
        <span
          className="pill absolute -top-4 right-4 rotate-3 border-2 border-ink bg-violet px-3 py-1.5 text-paper md:right-auto md:left-[7rem]"
          style={{ boxShadow: "var(--shadow-brut-sm)" }}
        >
          {badge}
        </span>
      )}
    </Reveal>
  );
}

/** Badge for the first upcoming event: "happening now" once it has started, "next up" before. */
export const firstBadge = (e: ClubEvent, texts: { nextUp: string; ongoing: string }) => (isOngoing(e) ? texts.ongoing : texts.nextUp);

/** Homepage section: the next few events, soonest first, and a link to all of them. */
export function Events() {
  const { events, locale } = useContent();
  const upcoming = splitEvents(useEvents()).upcoming.slice(0, HOMEPAGE_LIMIT);

  return (
    <section id="events" aria-labelledby="events-title" className="section-y relative bg-paper">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal as="h2" id="events-title" className="display-lg">
            {events.title}
            <span className="text-violet">.</span>
          </Reveal>
          <Reveal i={1} className="pill mb-2 border-2 border-ink bg-lime px-4 py-2 text-base text-ink" style={{ boxShadow: "var(--shadow-brut-sm)" }}>
            {events.calendar}
          </Reveal>
        </div>

        {upcoming.length > 0 ? (
          <ol className="mt-12 border-b-2 border-ink md:mt-16">
            {upcoming.map((e, i) => (
              <EventRow key={e.id} event={e} i={i} badge={i === 0 ? firstBadge(e, events) : undefined} />
            ))}
          </ol>
        ) : (
          <Reveal as="p" className="mt-12 max-w-xl border-y-2 border-ink py-9 text-lg leading-relaxed text-ink/75 md:mt-16">
            {events.empty}
          </Reveal>
        )}

        <Reveal className="mt-10">
          <ButtonLink href={eventsPath[locale]} variant="violet">
            {events.seeAll}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
