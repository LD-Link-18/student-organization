import { useEffect, useRef, useState, type CSSProperties } from "react";
import { fullDate, isOngoing, signupOpen, today, type ClubEvent } from "../content/events";
import { useContent } from "../content/i18n";
import { assetUrl, fetchEventExtras } from "../content/load";
import type { EventExtras, EventPhoto } from "../content/schema";
import { eventHref, eventSignupHref, eventsPath } from "../content/site";
import { SignupForm } from "./SignupForm";
import { useHomeHref } from "./StandalonePage";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

/** Full-size photo over the page, with previous / next (also ← →) and close (also Esc). */
function PhotoViewer({ photos, index, title, onIndex, onClose }: { photos: EventPhoto[]; index: number; title: string; onIndex: (i: number) => void; onClose: () => void }) {
  const { detail } = useContent().events;
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = photos[index];
  const step = (by: number) => onIndex((index + by + photos.length) % photos.length);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
      }}
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
      aria-label={detail.photoAlt(title, index + 1)}
      className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-ink/90"
    >
      <figure className="flex flex-col items-center gap-3 p-4">
        <img
          src={assetUrl(photo.src)}
          width={photo.w}
          height={photo.h}
          alt={detail.photoAlt(title, index + 1)}
          className="max-h-[80dvh] w-auto max-w-[min(92vw,100rem)] rounded-2xl border-2 border-paper object-contain"
        />
        <figcaption className="flex items-center gap-3 text-paper">
          {photos.length > 1 && (
            <button type="button" onClick={() => step(-1)} className="btn btn-glass min-h-10 px-4 text-sm" aria-label={detail.previous}>
              ←
            </button>
          )}
          <span className="meta tabular-nums">
            {index + 1} / {photos.length}
          </span>
          {photos.length > 1 && (
            <button type="button" onClick={() => step(1)} className="btn btn-glass min-h-10 px-4 text-sm" aria-label={detail.next}>
              →
            </button>
          )}
          <button type="button" onClick={() => dialog.current?.close()} className="btn btn-lime min-h-10 px-4 text-sm">
            {detail.close}
          </button>
        </figcaption>
      </figure>
    </dialog>
  );
}

/** Home / Events / … above an event's pages; the last crumb is the current page. */
function Breadcrumb({ crumbs }: { crumbs: { label: string; href?: string }[] }) {
  const t = useContent();
  const home = useHomeHref();
  const all = [{ label: t.projectPage.home, href: home }, { label: t.events.page.title, href: eventsPath[t.locale] }, ...crumbs];
  return (
    <nav aria-label={t.events.page.title} className="rise" style={{ "--i": 0 } as CSSProperties}>
      <ol className="meta flex flex-wrap items-center gap-2 text-paper/70">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.href ? (
              <a href={c.href} className="hover:text-lime">
                {c.label}
              </a>
            ) : (
              <span aria-current="page" className="text-paper">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** One event's own page: date, place, the full write-up, the way to its sign-up page, and the photos. */
export function EventDetail({ event: e }: { event: ClubEvent }) {
  const t = useContent();
  const { events, locale } = t;
  /** Undefined while loading; null if it couldn't be loaded (the page still has everything else). */
  const [extras, setExtras] = useState<EventExtras | null>();
  const [viewing, setViewing] = useState<number | null>(null);

  useEffect(() => {
    setExtras(undefined);
    fetchEventExtras(e.id).then(setExtras);
  }, [e.id]);

  useEffect(() => {
    document.title = events.detail.docTitle(e.title, t.club);
  }, [e.title, events.detail, t.club]);

  const past = e.end < today();
  const badge = past ? events.detail.pastBadge : isOngoing(e) ? events.ongoing : undefined;
  const open = signupOpen(e);
  const text = extras?.[`details_${locale}`].trim() || e.description;
  const photos = extras?.photos ?? [];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-violet pt-32 pb-20 text-paper md:pt-40 md:pb-28">
        <div className="grid-lines grid-fade absolute inset-0 -z-10" aria-hidden="true" />
        <div className="container-x">
          <Breadcrumb crumbs={[{ label: e.title }]} />
          <div className="rise mt-8 flex flex-wrap items-center gap-2" style={{ "--i": 1 } as CSSProperties}>
            <span className="pill glass px-3 py-1.5 text-paper">{e.category}</span>
            {badge && <span className={`pill border-2 border-ink px-3 py-1.5 ${past ? "bg-paper text-ink" : "bg-lime text-ink"}`}>{badge}</span>}
          </div>
          <h1
            className="rise display-xl mt-5 max-w-5xl tracking-[-0.035em] normal-case [overflow-wrap:anywhere]"
            style={{ fontSize: "clamp(2.75rem, 9vw, 7rem)", "--i": 2 } as CSSProperties}
          >
            {e.title}
          </h1>
          <p className="rise mt-6 flex flex-wrap gap-x-8 gap-y-2 font-display text-xl font-semibold tracking-tight md:text-2xl" style={{ "--i": 3 } as CSSProperties}>
            <time dateTime={e.start}>{fullDate(e, locale)}</time>
            <span className="text-paper/75">{e.place}</span>
          </p>
          {!past && (
            <div className="rise mt-8" style={{ "--i": 4 } as CSSProperties}>
              {open ? (
                <ButtonLink href={eventSignupHref(locale, e)} className="md:btn-lg">
                  {events.rsvp}
                </ButtonLink>
              ) : (
                <button type="button" disabled className="btn btn-paper md:btn-lg">
                  {events.rsvp}
                  <span className="sr-only">{events.rsvpClosed}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="section-y bg-paper">
        <div className="container-x">
          <Reveal className="max-w-2xl space-y-5 text-lg leading-relaxed text-ink/85">
            {text.split(/\n\s*\n/).map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </Reveal>

          {open && (
            <Reveal className="mt-14 flex max-w-2xl flex-wrap items-center justify-between gap-6 rounded-3xl border-2 border-ink bg-lime p-6 shadow-[var(--shadow-brut-sm)] md:p-8">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight">{events.signup.title}</h2>
                <p className="mt-1 text-ink/80">{events.signup.intro}</p>
              </div>
              <ButtonLink href={eventSignupHref(locale, e)} variant="violet" className="md:btn-lg">
                {events.rsvp}
              </ButtonLink>
            </Reveal>
          )}

          {photos.length > 0 && (
            <div className="mt-20 md:mt-28">
              <Reveal as="h2" className="display-md">
                {events.detail.photos}
                <span className="text-violet">.</span>
              </Reveal>
              <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {photos.map((p, i) => (
                  <li key={p.src}>
                    <button
                      type="button"
                      onClick={() => setViewing(i)}
                      className="group block aspect-square w-full overflow-hidden rounded-2xl border-2 border-ink bg-fog shadow-[var(--shadow-brut-sm)] transition-transform hover:-translate-y-1"
                    >
                      <img
                        src={assetUrl(p.thumb)}
                        alt={events.detail.photoAlt(e.title, i + 1)}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-16 md:mt-20">
            <ButtonLink href={eventsPath[locale]} variant="violet">
              {events.seeAll}
            </ButtonLink>
          </div>
        </div>
      </section>

      {viewing !== null && <PhotoViewer photos={photos} index={viewing} title={e.title} onIndex={setViewing} onClose={() => setViewing(null)} />}
    </>
  );
}

/**
 * An event's sign-up page (/etkinlikler/<id>-<title>/kayit/): the event's name, date and place, then its form.
 * Its own page so the event page stays short and the link can be shared on its own. Once sign-ups are closed,
 * it says so and points back to the event.
 */
export function EventSignup({ event: e }: { event: ClubEvent }) {
  const t = useContent();
  const { events, locale } = t;
  const [extras, setExtras] = useState<EventExtras | null>();
  const open = signupOpen(e);

  useEffect(() => {
    if (open) fetchEventExtras(e.id).then(setExtras);
  }, [e.id, open]);

  useEffect(() => {
    document.title = events.detail.docTitle(`${events.signup.title}: ${e.title}`, t.club);
  }, [e.title, events.detail, events.signup.title, t.club]);

  const back = (
    <a href={eventHref(locale, e)} className="font-display font-semibold underline decoration-violet decoration-2 underline-offset-4 hover:text-violet">
      ← {e.title}
    </a>
  );

  return (
    <>
      <section className="relative isolate overflow-hidden bg-violet pt-32 pb-16 text-paper md:pt-40 md:pb-20">
        <div className="grid-lines grid-fade absolute inset-0 -z-10" aria-hidden="true" />
        <div className="container-x">
          <Breadcrumb crumbs={[{ label: e.title, href: eventHref(locale, e) }, { label: events.signup.title }]} />
          <h1 className="rise display-lg mt-8 [overflow-wrap:anywhere]" style={{ "--i": 1 } as CSSProperties}>
            {events.signup.title}
            <span className="text-lime">.</span>
          </h1>
          <p className="rise mt-5 font-display text-2xl font-bold tracking-tight md:text-3xl" style={{ "--i": 2 } as CSSProperties}>
            {e.title}
          </p>
          <p className="rise mt-3 flex flex-wrap gap-x-8 gap-y-1 font-display text-lg font-semibold tracking-tight text-paper/85" style={{ "--i": 3 } as CSSProperties}>
            <time dateTime={e.start}>{fullDate(e, locale)}</time>
            <span className="text-paper/75">{e.place}</span>
          </p>
        </div>
      </section>

      <section className="section-y bg-paper">
        <div className="container-x">
          <div id="signup" className="max-w-3xl">
            {!open ? (
              <div className="grid gap-6">
                <p className="text-lg font-medium">{events.signup.closed}</p>
                {back}
              </div>
            ) : extras === undefined ? (
              <p className="text-ink/60" aria-busy="true">
                …
              </p>
            ) : extras ? (
              <>
                <p className="mb-8 text-lg text-ink/75">{events.signup.intro}</p>
                <SignupForm event={e} form={extras.form} after={back} />
              </>
            ) : (
              <div className="grid gap-6">
                <p className="font-medium text-red-700">{events.signup.failed}</p>
                {back}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
