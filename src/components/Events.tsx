import { useContent } from "../content/i18n";
import { discordUrl } from "../content/site";
import { Reveal } from "./ui/Reveal";

export function Events() {
  const { events } = useContent();

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

        <ol className="mt-12 border-b-2 border-ink md:mt-16">
          {events.items.map((e, i) => (
            <Reveal as="li" key={e.title} i={i % 3} className="group relative border-t-2 border-ink">
              {/* lime wipe on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 bg-lime transition-transform duration-500 ease-[var(--ease-out-expo)] group-focus-within:scale-x-100 group-hover:scale-x-100"
              />
              <article className="relative grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-4 py-7 sm:gap-x-8 md:grid-cols-[8.5rem_1fr_auto] md:items-center md:py-9 lg:grid-cols-[9rem_1fr_11rem_auto] lg:gap-x-8 xl:grid-cols-[10rem_1fr_15rem_auto] xl:gap-x-10">
                <p className="font-display leading-none transition-transform duration-500 group-hover:translate-x-2">
                  <span className="block text-6xl font-bold tracking-[-0.06em] md:text-7xl lg:text-8xl">{e.day}</span>
                  <span className="mt-1 block text-lg font-semibold">{e.month}</span>
                </p>

                <div>
                  <h3 className="text-2xl leading-[1.05] font-bold tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl">{e.title}</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-ink/75">{e.description}</p>
                </div>

                <div className="col-span-2 flex flex-wrap items-center gap-2 md:col-span-1 md:col-start-2 lg:col-start-auto lg:flex-col lg:items-start">
                  <span className="pill border-ink bg-paper">{e.category}</span>
                  <span className="meta text-ink/70">{e.place}</span>
                </div>

                <a
                  href={discordUrl}
                  className="btn btn-paper col-span-2 w-full md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1 md:w-auto lg:col-start-4 lg:row-span-1"
                >
                  {events.rsvp}
                  <span className="sr-only">{events.rsvpFor(e.title)}</span>
                </a>
              </article>
              {i === 0 && (
                <span
                  className="pill absolute -top-4 right-4 rotate-3 border-2 border-ink bg-violet px-3 py-1.5 text-paper md:right-auto md:left-[7rem]"
                  style={{ boxShadow: "var(--shadow-brut-sm)" }}
                >
                  {events.nextUp}
                </span>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
