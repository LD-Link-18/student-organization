import type { CSSProperties } from "react";
import { useContent } from "../content/i18n";
import type { AreaKey } from "../content/site";
import { AreaGlyph } from "./AreaGlyph";
import { Reveal } from "./ui/Reveal";

type Look = {
  span: string;
  card: string;
  /** hard-shadow color */
  sc?: string;
  /** background color, read by the glyph for "cut-out" fills */
  bg: string;
  accent: string;
  title: string;
  wide?: boolean;
};

const looks: Record<AreaKey, Look> = {
  ai: {
    span: "md:col-span-2 lg:col-span-7",
    card: "bg-violet text-paper rounded-[2rem]",
    bg: "var(--color-violet)",
    accent: "var(--color-lime)",
    title: "display-md",
  },
  ml: {
    span: "lg:col-span-5",
    card: "bg-lime text-ink rounded-[2rem_2rem_2rem_0.4rem] lg:rotate-[1.2deg]",
    bg: "var(--color-lime)",
    accent: "var(--color-violet)",
    title: "display-md",
  },
  robotics: {
    span: "lg:col-span-4",
    card: "bg-paper text-ink rounded-xl",
    sc: "var(--color-violet)",
    bg: "var(--color-paper)",
    accent: "var(--color-lime)",
    title: "text-3xl md:text-4xl",
  },
  vision: {
    span: "lg:col-span-4 lg:translate-y-6",
    card: "bg-ink text-paper rounded-[2rem]",
    sc: "var(--color-lime)",
    bg: "var(--color-ink)",
    accent: "var(--color-lime)",
    title: "text-3xl md:text-4xl",
  },
  embedded: {
    span: "lg:col-span-4",
    card: "bg-paper text-ink rounded-[0.6rem_2.4rem_0.6rem_2.4rem] lg:-rotate-1",
    bg: "var(--color-paper)",
    accent: "var(--color-violet)",
    title: "text-3xl md:text-4xl",
  },
  automation: {
    span: "md:col-span-2 lg:col-span-12 lg:mt-6",
    card: "bg-violet-deep text-paper rounded-[2rem]",
    bg: "var(--color-violet-deep)",
    accent: "var(--color-lime)",
    title: "display-md",
    wide: true,
  },
};

export function Areas() {
  const { areas } = useContent();
  return (
    <section id="areas" aria-labelledby="areas-title" className="section-y relative overflow-hidden bg-fog">
      <div className="grid-lines grid-lines-dark absolute inset-0" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <Reveal as="h2" id="areas-title" className="display-lg lg:col-span-8">
            {areas.title}
            <span className="text-violet">.</span>
          </Reveal>
          <Reveal as="p" i={1} className="max-w-md text-lg leading-relaxed text-ink/75 lg:col-span-4 lg:pb-3">
            {areas.intro}
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8 lg:mt-20 lg:grid-cols-12">
          {areas.items.map((a, i) => {
            const l = looks[a.key];
            return (
              <Reveal as="li" key={a.key} i={i % 3} className={l.span}>
                <article
                  className={`lift group relative flex h-full border-2 border-ink p-6 md:p-8 ${l.card} ${
                    l.wide ? "flex-col gap-8 lg:flex-row lg:items-center lg:gap-12" : "flex-col"
                  }`}
                  style={{ "--sc": l.sc, "--card-bg": l.bg, "--accent": l.accent } as CSSProperties}
                >
                  <ul className={`flex flex-wrap gap-2 ${l.wide ? "lg:order-3 lg:w-56 lg:justify-end" : ""}`} aria-label={areas.toolsLabel}>
                    {a.tools.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <AreaGlyph
                    area={a.key}
                    className={`transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105 ${
                      l.wide ? "w-40 shrink-0 lg:order-1" : "my-8 w-36 self-end md:w-44"
                    }`}
                  />
                  <div className={`mt-auto ${l.wide ? "lg:order-2 lg:mt-0 lg:flex-1" : ""}`}>
                    <h3 className={`font-bold tracking-tight ${l.title}`}>{a.title}</h3>
                    <p className="mt-3 max-w-md leading-relaxed opacity-85">{a.blurb}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
