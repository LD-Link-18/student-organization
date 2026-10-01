import type { CSSProperties } from "react";
import { useContent } from "../content/i18n";
import { projectHref, type ProjectStatus } from "../content/site";
import type { Project } from "../content/types";
import { ProjectArt } from "./ProjectArt";

const statusStyle: Record<ProjectStatus, string> = {
  live: "border-ink bg-lime text-ink",
  progress: "border-ink bg-paper text-ink",
  prototype: "border-dashed border-paper bg-violet-night text-paper",
};

export function StatusBadge({ status, className = "" }: { status: ProjectStatus; className?: string }) {
  const { projects } = useContent();
  return (
    <span className={`pill border-2 px-3 py-1.5 ${statusStyle[status]} ${className}`}>
      {status === "live" && <span className="size-2 animate-pulse-dot rounded-full bg-ink" aria-hidden="true" />}
      <span className="sr-only">{projects.statusLabel}</span>
      {projects.status[status]}
    </span>
  );
}

/** Project card used on the homepage and the project list. The title link stretches over the whole card. */
export function ProjectCard({ project: p, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const { locale, projects } = useContent();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className="lift glass group relative flex h-full flex-col rounded-[2rem] border-2 border-paper/35 p-3 focus-within:outline-3 focus-within:outline-offset-4 focus-within:outline-lime sm:p-4"
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
        <Heading className="display-md mt-2">
          <a href={projectHref(locale, p.slug)} className="outline-none after:absolute after:inset-0 after:rounded-[2rem] focus-visible:shadow-none">
            {p.name}
          </a>
        </Heading>
        <p className="mt-4 max-w-lg leading-relaxed text-paper/85">{p.description}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
          <ul className="flex flex-wrap gap-2" aria-label={projects.stackLabel}>
            {p.stack.map((t) => (
              <li key={t} className="tag border-paper/50 text-paper">
                {t}
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="flex items-center gap-2 font-display text-sm font-semibold text-lime">
            {projects.view}
            <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none">
              <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
