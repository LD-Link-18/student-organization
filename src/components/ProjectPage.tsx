import { useEffect, type CSSProperties } from "react";
import { useContent, useResolveLink } from "../content/i18n";
import { club, projectHref, projectsPath, type AvatarVariant } from "../content/site";
import type { Project } from "../content/types";
import { MemberCard } from "./MemberCard";
import { NotFound } from "./NotFound";
import { ProjectArt } from "./ProjectArt";
import { StatusBadge } from "./ProjectCard";
import { Projects } from "./Projects";
import { useHomeHref } from "./StandalonePage";
import { SubpageLayout } from "./SubpageLayout";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

/** Headline-number cards cycle through these surfaces, like the stats on the homepage. */
const HIGHLIGHT_LOOKS = [
  { card: "bg-lime text-ink -rotate-2", label: "text-ink/80" },
  { card: "bg-paper text-ink rotate-1", label: "text-ink/75" },
  { card: "bg-ink text-lime -rotate-1", label: "text-paper/80" },
  { card: "bg-violet text-paper rotate-2", label: "text-paper/80" },
];
const HIGHLIGHT_COLS: Record<number, string> = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="meta text-paper/65">{label}</dt>
      <dd className="mt-1 font-display text-lg font-semibold tracking-tight">{value}</dd>
    </div>
  );
}

function ProjectDetail({ project: p, next }: { project: Project; next: Project }) {
  const t = useContent();
  const pp = t.projectPage;
  const home = useHomeHref();
  const resolve = useResolveLink();
  const repo = p.repo === undefined ? undefined : resolve(p.repo, "github");
  const demo = p.demo || undefined;
  const team = p.team?.length ? p.team : undefined;
  const lastStep = p.timeline.length - 1;

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden bg-violet pt-32 pb-28 text-paper md:pt-40 md:pb-36">
        <div className="grid-lines grid-fade absolute inset-0 -z-10" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 -left-40 -z-10 h-[34rem] w-[34rem] bg-violet-deep"
          style={{ borderRadius: "58% 42% 63% 37% / 45% 55% 45% 55%" }}
        />
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
            <nav aria-label={pp.breadcrumb} className="rise" style={{ "--i": 0 } as CSSProperties}>
              <ol className="meta flex flex-wrap items-center gap-2 text-paper/70">
                <li>
                  <a href={home} className="hover:text-lime">
                    {pp.home}
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <a href={projectsPath[t.locale]} className="hover:text-lime">
                    {pp.breadcrumb}
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-paper">
                  {p.name}
                </li>
              </ol>
            </nav>
            <div className="rise mt-8 flex flex-wrap items-center gap-2" style={{ "--i": 1 } as CSSProperties}>
              <StatusBadge status={p.status} />
              <span className="pill glass px-3 py-1.5 text-paper">{p.category}</span>
            </div>
            {/* names stay as written: Turkish uppercasing would turn "VisionCore" into "VİSİONCORE" */}
            <h1
              className="rise display-xl mt-5 tracking-[-0.035em] normal-case [overflow-wrap:anywhere]"
              style={{ fontSize: "clamp(3.25rem, 12vw, 8.5rem)", "--i": 2 } as CSSProperties}
            >
              {p.name}
            </h1>
            <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-paper/90 md:text-xl" style={{ "--i": 3 } as CSSProperties}>
              {p.overview}
            </p>
            <dl className="rise mt-8 flex flex-wrap gap-x-10 gap-y-4" style={{ "--i": 4 } as CSSProperties}>
              <Fact label={pp.started} value={p.started} />
              <Fact label={pp.statusLabel} value={t.projects.status[p.status]} />
              {team && <Fact label={pp.team} value={pp.teamSize(team.length)} />}
            </dl>
            {(repo || demo) && (
              <div className="rise mt-8 flex flex-wrap gap-3" style={{ "--i": 5 } as CSSProperties}>
                {repo && (
                  <ButtonLink href={repo} className="md:btn-lg">
                    {pp.repo}
                  </ButtonLink>
                )}
                {demo && (
                  <ButtonLink href={demo} variant="glass" className="md:btn-lg">
                    {pp.demo}
                  </ButtonLink>
                )}
              </div>
            )}
          </div>

          <div aria-hidden="true" className="relative mx-auto w-full max-w-lg lg:col-span-5 lg:max-w-none">
            <div className="land absolute -top-10 -right-4 size-48 rounded-full bg-lime sm:size-64" />
            <div className="land relative" style={{ "--i": 1 } as CSSProperties}>
              <div
                className="relative aspect-[4/3] rotate-2 overflow-hidden rounded-[2rem] border-2 border-ink bg-violet-night"
                style={{ boxShadow: "10px 10px 0 0 var(--color-ink)" }}
              >
                <div className="dot-grid absolute inset-0 text-paper/10" />
                <div className="relative h-full">
                  <ProjectArt visual={p.visual} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* headline numbers, overlapping the hero's edge */}
      <section aria-label={pp.highlights} className="relative z-10 -mt-16 md:-mt-20">
        <ul className={`container-x grid gap-4 sm:gap-6 ${HIGHLIGHT_COLS[p.highlights.length] ?? "sm:grid-cols-3"}`}>
          {p.highlights.map((h, i) => {
            const look = HIGHLIGHT_LOOKS[i % HIGHLIGHT_LOOKS.length];
            return (
              <Reveal
                as="li"
                key={h.label}
                i={i}
                className={`flex flex-col gap-3 rounded-[1.5rem] border-2 border-ink p-5 transition-[rotate] hover:rotate-0 sm:p-6 ${look.card}`}
                style={{ boxShadow: "var(--shadow-brut)" }}
              >
                <span className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-none font-bold tracking-[-0.04em]">{h.value}</span>
                <span className={`text-sm leading-snug font-medium sm:text-base ${look.label}`}>{h.label}</span>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* story */}
      <section className="bg-paper pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="container-x">
          <div className="border-b-2 border-ink">
            {p.sections.map((s) => (
              <Reveal key={s.title} className="grid gap-4 border-t-2 border-ink py-10 md:py-14 lg:grid-cols-12 lg:gap-10">
                <h2 className="display-md lg:col-span-4">{s.title}</h2>
                <p className="max-w-2xl text-lg leading-relaxed text-ink/80 md:text-xl lg:col-span-7 lg:col-start-6">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* stack + timeline */}
      <section className="section-y relative overflow-hidden bg-fog">
        <div className="grid-lines grid-lines-dark absolute inset-0" aria-hidden="true" />
        <div className="container-x relative grid gap-16 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <h2 className="display-md">{pp.stack}</h2>
            <ul className="mt-8 flex flex-wrap gap-3">
              {p.stack.map((s) => (
                <li key={s} className="pill border-2 border-ink bg-paper px-4 py-2 text-lg text-ink" style={{ boxShadow: "var(--shadow-brut-sm)" }}>
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal i={1} className="lg:col-span-6 lg:col-start-7">
            <h2 className="display-md">{pp.timeline}</h2>
            <ol className="mt-8 ml-2 border-l-2 border-ink">
              {p.timeline.map((m, i) => (
                <li key={m.date + m.text} className="relative pb-8 pl-8 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute top-1 -left-[9px] size-4 rounded-full border-2 border-ink ${i === lastStep ? "bg-lime" : "bg-paper"}`}
                  />
                  <p className="meta text-violet">{m.date}</p>
                  <p className="mt-1 font-display text-xl leading-snug font-semibold tracking-tight">{m.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* team (optional) */}
      {team && (
        <section className="section-y bg-paper" aria-labelledby="team-title">
          <div className="container-x">
            <Reveal as="h2" id="team-title" className="display-md">
              {pp.team}
            </Reveal>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-8 lg:grid-cols-5">
              {team.map((m, i) => {
                // members who are also on the club team keep their avatar and link
                const known = t.team.people.find((c) => c.name === m.name);
                return (
                  <Reveal as="li" key={m.name} i={i}>
                    <MemberCard
                      name={m.name}
                      role={m.role}
                      avatar={known?.avatar ?? ((i + 2) % 6) as AvatarVariant}
                      href={known?.href}
                    />
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* join + next project */}
      <section className="relative isolate overflow-hidden bg-lime py-20 text-ink md:py-28">
        <div className="grid-lines grid-lines-dark absolute inset-0 -z-10" aria-hidden="true" />
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6">
            <h2 className="display-md">{pp.join.title}</h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed font-medium">{pp.join.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={club.joinUrl} variant="violet" className="md:btn-lg">
                {pp.join.cta}
              </ButtonLink>
              <ButtonLink href={club.projectUrl} variant="paper" className="md:btn-lg">
                {pp.join.pitch}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal i={1} className="lg:col-span-5 lg:col-start-8">
            <a
              href={projectHref(t.locale, next.slug)}
              className="lift group block rounded-[2rem] border-2 border-ink bg-violet p-5 text-paper sm:p-6"
            >
              <span className="meta text-lime">{pp.next}</span>
              <span className="mt-2 block font-display text-4xl font-bold tracking-tight md:text-5xl">{next.name}</span>
              <span className="mt-1 block text-paper/80">{next.category}</span>
              <span
                aria-hidden="true"
                className="relative mt-6 block aspect-[16/9] overflow-hidden rounded-[1.2rem] border-2 border-ink bg-violet-night"
              >
                <span className="dot-grid absolute inset-0 text-paper/10" />
                <span className="relative block h-full transition-transform duration-500 group-hover:scale-[1.04]">
                  <ProjectArt visual={next.visual} />
                </span>
              </span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** Slug from /projeler/<slug>/ (/en/projects/<slug>/); undefined on the list page itself. */
function slugFromPath(listPath: string) {
  const { pathname } = window.location;
  if (!pathname.startsWith(listPath)) return undefined;
  return decodeURIComponent(pathname.slice(listPath.length)).replace(/\/+$/, "") || undefined;
}

/**
 * /projeler/ lists every project; /projeler/<slug>/ is that project's page (same HTML, rewritten by
 * vercel.json). Projects come from `projects.items` in tr.ts / en.ts; an unknown slug shows the 404 page.
 */
export function ProjectPage() {
  const t = useContent();
  const slug = slugFromPath(projectsPath[t.locale]);
  const index = t.projects.items.findIndex((p) => p.slug === slug);
  const project = index >= 0 ? t.projects.items[index] : undefined;
  const missing = !!slug && !project;

  useEffect(() => {
    if (missing) return; // NotFound sets its own title
    document.title = project ? t.projectPage.docTitle(project.name) : t.projectPage.listDocTitle;
  }, [missing, project, t.projectPage]);

  if (missing) return <NotFound />;

  if (!project) {
    return (
      <SubpageLayout hrefFor={(code) => projectsPath[code]}>
        <Projects standalone />
      </SubpageLayout>
    );
  }

  const next = t.projects.items[(index + 1) % t.projects.items.length];
  return (
    <SubpageLayout hrefFor={(code) => projectHref(code, project.slug)}>
      <ProjectDetail project={project} next={next} />
    </SubpageLayout>
  );
}
