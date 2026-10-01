import type { CSSProperties } from "react";
import { useContent } from "../content/i18n";
import { club, comingSoonPath, instagramHref, type LinkSource } from "../content/site";
import { StandalonePage, useHomeHref } from "./StandalonePage";
import { Arrow } from "./ui/Arrow";
import { ButtonLink } from "./ui/Button";
import { Loop } from "./ui/Glyph";
import { Sticker } from "./ui/Sticker";

const SOURCES: LinkSource[] = ["discord", "linkedin", "github", "instagram"];

/** done / in progress / next: solid chips stay legible over the lime glow behind the card. */
const STATE_STYLE = ["bg-lime text-ink", "bg-paper text-ink", "border border-paper/50 text-paper"];

/** Decorative progress card: the channel is being set up. */
function StatusCard({ source }: { source?: LinkSource }) {
  const { soon } = useContent();
  return (
    <div className="rounded-[1.6rem] border border-paper/25 bg-violet-deep/80 p-5 text-paper shadow-[inset_0_1px_0_0_rgb(254_254_254/0.18)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between font-display text-sm font-medium text-paper/75">
        <span>{soon.status.title}</span>
        {source && <span>{source}</span>}
      </div>
      <ul className="mt-4 grid gap-3 font-display">
        {soon.status.steps.map(([label, state], i) => (
          <li key={label} className="flex items-center justify-between gap-4 border-t border-paper/20 pt-3 text-lg font-semibold">
            <span className="flex items-center gap-3">
              <span
                className={`size-3 rounded-full ${
                  i === 0 ? "bg-lime" : i === 1 ? "animate-pulse bg-lime" : "border-2 border-paper/50"
                }`}
              />
              {label}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${STATE_STYLE[i]}`}>{state}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full ${i < 7 ? "bg-lime" : i === 7 ? "animate-pulse bg-lime" : "bg-paper/25"}`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Where links to channels that don't exist yet land (see `useResolveLink`).
 * `?l=discord` etc. picks the lead sentence; the language switch keeps it.
 */
export function ComingSoon() {
  const { soon } = useContent();
  const home = useHomeHref();
  const raw = new URLSearchParams(window.location.search).get("l");
  const source = SOURCES.find((s) => s === raw);
  const query = source ? `?l=${source}` : "";

  return (
    <StandalonePage
      hrefFor={(code) => comingSoonPath[code] + query}
      aside={
        <>
          <div className="land absolute top-2 right-[6%] size-52 rounded-full bg-lime sm:size-60 lg:top-6 lg:size-72" />
          <div className="land absolute top-14 left-0 w-[88%] max-w-sm lg:top-20 lg:left-[4%]" style={{ "--i": 1 } as CSSProperties}>
            <div className="-rotate-3">
              <div className="animate-float">
                <StatusCard source={source} />
              </div>
            </div>
          </div>
          <div className="land absolute right-0 bottom-0 w-28 sm:w-32 lg:right-[4%] lg:w-36" style={{ "--i": 2 } as CSSProperties}>
            <Sticker text={soon.sticker} tone="bg-ink text-lime" className="w-full">
              <Loop className="w-full" />
            </Sticker>
          </div>
          <Arrow variant="zig" drawIndex={0} className="absolute bottom-6 left-[6%] hidden w-36 rotate-[160deg] text-lime lg:block" />
        </>
      }
    >
      <h1 className="display-xl" style={{ fontSize: "clamp(3.5rem, 19vw, 10.5rem)" }}>
        <span className="rise block" style={{ "--i": 0 } as CSSProperties}>
          {soon.headline[0]}
        </span>
        <span className="rise mt-[0.08em] block [:lang(tr)_&]:mt-[0.16em]" style={{ "--i": 1 } as CSSProperties}>
          <span
            className="inline-block -rotate-2 rounded-[0.1em] border-[3px] border-ink bg-lime px-[0.07em] text-ink md:border-4"
            style={{ boxShadow: "0.045em 0.045em 0 0 var(--color-ink)" }}
          >
            {soon.headline[1]}
          </span>
        </span>
      </h1>

      <div className="rise mt-10 max-w-xl" style={{ "--i": 2 } as CSSProperties}>
        <p className="font-display text-2xl leading-tight font-bold tracking-tight md:text-3xl">{soon.lead[source ?? "default"]}</p>
        <p className="mt-4 text-lg leading-relaxed text-paper/85">{soon.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={instagramHref} className="md:btn-lg">
            {soon.instagram}
          </ButtonLink>
          <ButtonLink href={club.joinUrl} variant="glass" className="md:btn-lg">
            {soon.join}
          </ButtonLink>
        </div>
        <a href={home} className="text-link mt-8 inline-block">
          {soon.home}
        </a>
      </div>
    </StandalonePage>
  );
}
