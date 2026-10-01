import type { CSSProperties } from "react";
import { useContent } from "../content/i18n";
import { club, type ProjectStatus } from "../content/site";
import { ProjectArt } from "./ProjectArt";
import { Arrow } from "./ui/Arrow";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

const statusStyle: Record<ProjectStatus, string> = {
  live: "border-ink bg-lime text-ink",
  progress: "border-ink bg-paper text-ink",
  prototype: "border-dashed border-paper bg-violet-night text-paper",
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  const { projects } = useContent();
  return (
    <span className={`pill border-2 px-3 py-1.5 ${statusStyle[status]}`}>
      {status === "live" && <span className="size-2 animate-pulse-dot rounded-full bg-ink" aria-hidden="true" />}
      <span className="sr-only">{projects.statusLabel}</span>
      {projects.status[status]}
    </span>
  );
}

export function Projects() {
  const { projects } = useContent();

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-y relative overflow-hidden bg-violet text-paper">
      <div className="grid-lines grid-fade absolute inset-0" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <Reveal as="h2" id="projects-title" className="display-lg lg:col-span-7">
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
            <Reveal as="li" key={p.name} i={i % 2} className={i % 2 === 1 ? "lg:translate-y-24" : ""}>
              <article
                className="lift glass group flex h-full flex-col rounded-[2rem] border-2 border-paper/35 p-3 sm:p-4"
                style={{ "--sc": "var(--color-lime)" } as CSSProperties}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] border-2 border-ink bg-violet-night">
                  <div className="dot-grid absolute inset-0 text-paper/10" aria-hidden="true" />
                  <div className="relative h-full transition-transform duration-500 group-hover:scale-[1.04]" aria-hidden="true">
                    <ProjectArt visual={p.visual} />
                  </div>
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col px-2 pt-6 pb-3 sm:px-4">
                  <p className="meta text-lime">{p.category}</p>
                  <h3 className="display-md mt-2">{p.name}</h3>
                  <p className="mt-4 max-w-lg leading-relaxed text-paper/85">{p.description}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-6" aria-label={projects.stackLabel}>
                    {p.stack.map((t) => (
                      <li key={t} className="tag border-paper/50 text-paper">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
