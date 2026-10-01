import { useEffect, type CSSProperties } from "react";
import { useContent } from "../content/i18n";
import { StandalonePage, useHomeHref } from "./StandalonePage";
import { ButtonLink } from "./ui/Button";

/** Decorative camera feed that scans an empty scene: the vision card from the hero, finding nothing. */
function EmptyCamera() {
  const { notFound } = useContent();
  const c = notFound.camera;
  return (
    <div className="rounded-[1.6rem] border border-paper/25 bg-violet-deep/80 p-3 text-paper shadow-[inset_0_1px_0_0_rgb(254_254_254/0.18)] backdrop-blur-xl">
      <div className="flex items-center justify-between px-2 pb-3 font-display text-sm font-medium text-paper/75">
        <span>{c.feed}</span>
        <span className="flex items-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-lime" />
          {c.scanning}
        </span>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-violet-night">
        <div className="dot-grid absolute inset-0 text-paper/15" />
        <div className="absolute inset-x-0 bottom-[28%] h-px bg-paper/25" />
        {/* scan line */}
        <div className="absolute inset-x-0 top-[6%] h-0.5 animate-scan bg-lime shadow-[0_0_18px_4px_rgb(183_233_10/0.45)]" />
        {/* empty detection */}
        <div className="absolute top-[22%] left-[24%] h-[52%] w-[52%] rounded-sm border-2 border-dashed border-lime">
          <span className="absolute -top-0.5 -left-0.5 -translate-y-full rounded-t-sm bg-lime px-2 py-0.5 font-display text-xs font-bold whitespace-nowrap text-ink">
            {c.box}
          </span>
          <span className="absolute inset-0 grid place-items-center font-display text-sm font-medium text-paper/70">{c.empty}</span>
        </div>
      </div>
    </div>
  );
}

export function NotFound() {
  const t = useContent();
  const nf = t.notFound;
  const home = useHomeHref();

  useEffect(() => {
    document.title = nf.title;
  }, [nf.title]);

  return (
    <StandalonePage
      aside={
        <>
          <div className="land absolute top-0 right-[4%] size-52 rounded-full bg-lime sm:size-60 lg:top-4 lg:size-72" />
          <div className="land absolute top-12 left-0 w-[90%] max-w-sm lg:top-16 lg:left-[2%] lg:max-w-md" style={{ "--i": 1 } as CSSProperties}>
            <div className="rotate-2">
              <div className="animate-float">
                <EmptyCamera />
              </div>
            </div>
          </div>
          <div className="land absolute right-[6%] bottom-6 lg:right-[10%] lg:bottom-10" style={{ "--i": 2 } as CSSProperties}>
            <span className="pill -rotate-6 border-2 border-ink bg-paper px-5 py-2.5 text-lg text-ink" style={{ boxShadow: "var(--shadow-brut-sm)" }}>
              {nf.camera.chip}
            </span>
          </div>
        </>
      }
    >
      <h1 className="display-xl" style={{ fontSize: "clamp(7rem, 40vw, 17rem)" }}>
        <span className="sr-only">404: {nf.lead}</span>
        {/* the hero's three treatments, one per digit */}
        <span aria-hidden="true" className="flex items-end gap-[0.06em]">
          <span className="rise" style={{ "--i": 0 } as CSSProperties}>
            4
          </span>
          <span className="rise text-outline-white italic" style={{ "--i": 1 } as CSSProperties}>
            0
          </span>
          <span className="rise" style={{ "--i": 2 } as CSSProperties}>
            <span
              className="inline-block -rotate-3 rounded-[0.1em] border-[3px] border-ink bg-lime px-[0.08em] text-ink md:border-4"
              style={{ boxShadow: "0.045em 0.045em 0 0 var(--color-ink)" }}
            >
              4
            </span>
          </span>
        </span>
      </h1>

      <div className="rise mt-8 max-w-xl" style={{ "--i": 3 } as CSSProperties}>
        <p className="font-display text-2xl leading-tight font-bold tracking-tight md:text-3xl" aria-hidden="true">
          {nf.lead}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-paper/85">{nf.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={home} className="md:btn-lg">
            {nf.home}
          </ButtonLink>
          <ButtonLink href={`${home}#projects`} variant="glass" className="md:btn-lg">
            {nf.projects}
          </ButtonLink>
        </div>
        <nav aria-label={nf.quickLinks} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="meta text-paper/70">{nf.quickLinks}</span>
          {t.nav
            .filter((l) => l.href !== "#projects")
            .map((l) => (
              <a key={l.href} href={`${home}${l.href}`} className="text-link">
                {l.label}
              </a>
            ))}
        </nav>
      </div>
    </StandalonePage>
  );
}
