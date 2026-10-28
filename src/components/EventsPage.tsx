import { useEffect } from "react";
import { useContent, useEvents } from "../content/i18n";
import { splitEvents } from "../content/events";
import { eventHref, eventIdFromSlug, eventsPath, slugFromPath } from "../content/site";
import { EventDetail } from "./EventDetail";
import { EventRow, firstBadge } from "./Events";
import { NotFound } from "./NotFound";
import { SubpageLayout } from "./SubpageLayout";
import { Reveal } from "./ui/Reveal";

/** /etkinlikler/ (/en/events/): every event, upcoming soonest first, then past ones most recent first. */
function EventList() {
  const { events } = useContent();
  const { upcoming, past } = splitEvents(useEvents());

  return (
    <section aria-labelledby="events-title" className="section-y relative bg-paper pt-36 md:pt-44">
      <div className="container-x">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <Reveal as="h1" id="events-title" className="display-lg lg:col-span-7">
            {events.page.title}
            <span className="text-violet">.</span>
          </Reveal>
          <Reveal i={1} className="lg:col-span-5 lg:pb-3">
            <p className="max-w-md text-lg leading-relaxed text-ink/75">{events.page.intro}</p>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 md:mt-24">
          <Reveal as="h2" className="display-md">
            {events.page.upcoming}
          </Reveal>
          <Reveal i={1} className="pill mb-1 border-2 border-ink bg-lime px-4 py-2 text-base text-ink" style={{ boxShadow: "var(--shadow-brut-sm)" }}>
            {events.calendar}
          </Reveal>
        </div>
        {upcoming.length > 0 ? (
          <ol className="mt-10 border-b-2 border-ink">
            {upcoming.map((e, i) => (
              <EventRow key={e.id} event={e} i={i} badge={i === 0 ? firstBadge(e, events) : undefined} />
            ))}
          </ol>
        ) : (
          <Reveal as="p" className="mt-10 max-w-xl border-y-2 border-ink py-9 text-lg leading-relaxed text-ink/75">
            {events.empty}
          </Reveal>
        )}

        {past.length > 0 && (
          <>
            <Reveal as="h2" className="display-md mt-24 md:mt-32">
              {events.page.past}
            </Reveal>
            <ol className="mt-10 border-b-2 border-ink text-ink/80">
              {past.map((e, i) => (
                <EventRow key={e.id} event={e} i={i} past />
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}

/**
 * /etkinlikler/ lists every event; /etkinlikler/<id>-<title>/ is one event's page (same HTML, rewritten by
 * vercel.json). An unknown number shows the 404 page.
 */
export function EventsPage() {
  const { locale } = useContent();
  const slug = slugFromPath(eventsPath[locale]);
  const id = slug === undefined ? undefined : eventIdFromSlug(slug);
  const event = useEvents().find((e) => e.id === id);

  // The title part of the address follows the event's current title (and language).
  useEffect(() => {
    if (!event) return;
    const canonical = eventHref(locale, event);
    if (window.location.pathname !== canonical) window.history.replaceState(null, "", canonical + window.location.search + window.location.hash);
  }, [event, locale]);

  if (slug !== undefined && !event) return <NotFound />;

  return (
    <SubpageLayout hrefFor={(code) => (event ? `${eventsPath[code]}${event.id}/` : eventsPath[code])}>
      {event ? <EventDetail key={event.id} event={event} /> : <EventList />}
    </SubpageLayout>
  );
}
