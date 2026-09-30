import { useContent } from "../content/i18n";
import { Arrow } from "./ui/Arrow";
import { Reveal } from "./ui/Reveal";
import { Stats } from "./Stats";

export function About() {
  const { about } = useContent();
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative bg-paper pt-36 md:pt-44">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal as="h2" id="about-title" className="display-lg lg:col-span-7">
            {about.title[0]}
            <br />
            <span className="highlight text-violet">{about.title[1]}</span>
          </Reveal>

          <Reveal i={1} className="lg:col-span-5 lg:pt-4">
            <p className="text-lg leading-relaxed text-ink/80 md:text-xl">{about.body}</p>
            <ul className="mt-8 grid gap-3">
              {about.principles.map((p) => (
                <li key={p} className="flex items-start gap-3 border-t-2 border-ink pt-3 font-display text-lg leading-snug font-semibold tracking-tight">
                  <span aria-hidden="true" className="mt-[0.3em] size-3 shrink-0 rotate-45 border-2 border-ink bg-lime" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="relative mt-16 md:mt-24">
          <Arrow variant="swoop" className="absolute -top-20 right-[14%] hidden w-40 rotate-[-8deg] text-violet md:block" />
          <Stats />
        </div>
      </div>
    </section>
  );
}
