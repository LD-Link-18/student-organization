import { useContent } from "../content/i18n";
import { club } from "../content/site";
import { ProjectCard } from "./ProjectCard";
import { Arrow } from "./ui/Arrow";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

/** Homepage section; `standalone` turns it into the /projeler/ page (h1 title, room for the fixed navbar). */
export function Projects({ standalone = false }: { standalone?: boolean }) {
  const { projects } = useContent();

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className={`section-y relative overflow-hidden bg-violet text-paper ${standalone ? "pt-36 md:pt-44" : ""}`}
    >
      <div className="grid-lines grid-fade absolute inset-0" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <Reveal as={standalone ? "h1" : "h2"} id="projects-title" className="display-lg lg:col-span-7">
            {projects.title[0]}
            <br />
            <span className="text-outline-white">{projects.title[1]}</span>
          </Reveal>
          <Reveal i={1} className="relative lg:col-span-5 lg:pb-3">
            <p className="max-w-md text-lg leading-relaxed text-paper/85">{projects.intro}</p>
            <ButtonLink href={club.projectUrl} variant="lime" className="mt-6">
              {projects.pitch}
            </ButtonLink>
            <Arrow variant="zig" className="absolute -bottom-20 left-48 hidden w-32 rotate-[40deg] text-lime lg:block" />
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-6 lg:pb-24">
          {projects.items.map((p, i) => (
            <Reveal as="li" key={p.slug} i={i % 2} className={i % 2 === 1 ? "lg:translate-y-24" : ""}>
              <ProjectCard project={p} headingLevel={standalone ? 2 : 3} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
