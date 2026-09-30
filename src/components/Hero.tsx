import { useRef, type CSSProperties, type ReactNode } from "react";
import { useContent } from "../content/i18n";
import { club } from "../content/site";
import { usePointerParallax } from "../hooks/usePointerParallax";
import { Arrow } from "./ui/Arrow";
import { ButtonLink } from "./ui/Button";
import { Loop } from "./ui/Glyph";
import { Sticker } from "./ui/Sticker";
import { LossCard, VisionCard } from "./HeroInstruments";

/** Absolutely positioned layer that drifts with the pointer, lands on load and idles with a float. */
function Floating({
  depth,
  i,
  alt = false,
  className = "",
  children,
}: {
  depth: number;
  i: number;
  alt?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth * 0.7}px), 0)`,
        transition: "transform 700ms var(--ease-out-expo)",
      }}
    >
      <div className="land" style={{ "--i": i } as CSSProperties}>
        <div className={alt ? "animate-float-alt" : "animate-float"} style={{ animationDelay: `${i * -1.3}s` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Tiny step label next to each headline word — the loop is a real sequence. */
function StepNote({ n, children }: { n: string; children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="ml-[0.12em] hidden align-top font-display text-base leading-tight font-semibold tracking-tight normal-case text-lime xl:inline-block"
      style={{ marginTop: "0.14em" }}
    >
      {n}
      <br />
      <span className="font-medium text-paper/80">{children}</span>
    </span>
  );
}

export function Hero() {
  const t = useContent();
  const { hero } = t;
  const k = hero.scale;
  const ref = useRef<HTMLElement>(null);
  usePointerParallax(ref);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate overflow-hidden bg-violet text-paper"
      style={{ "--hero-fs": `clamp(${4.4 * k}rem, min(${28 * k}vw, ${24 * k}svh), ${14.5 * k}rem)` } as CSSProperties}
    >
      {/* backdrop */}
      <div className="grid-lines grid-fade absolute inset-0 -z-10" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-32 -z-10 h-[34rem] w-[34rem] bg-violet-deep"
        style={{ borderRadius: "58% 42% 63% 37% / 45% 55% 45% 55%" }}
      />

      <div className="container-x relative pt-32 pb-40 md:pt-36 md:pb-48">
        {/* meta row */}
        <div className="rise flex flex-wrap items-center gap-x-5 gap-y-3" style={{ "--i": 0 } as CSSProperties}>
          <span className="pill glass border-paper/25 text-paper">
            <span className="size-2 animate-pulse-dot rounded-full bg-lime" />
            {hero.intakeOpen}
          </span>
          <span className="meta hidden text-paper/75 md:block">{hero.tagline}</span>
        </div>

        <div className="relative">
        {/* headline */}
        <h1 className="display-xl relative z-10 mt-10 md:mt-12" style={{ fontSize: "var(--hero-fs)" }}>
          <span className="sr-only">{t.club.name}: </span>
          <span className="rise block" style={{ "--i": 1 } as CSSProperties}>
            {hero.words[0]}
            <StepNote n="01">{hero.notes[0]}</StepNote>
          </span>
          <span className="rise block pl-[0.3em] lg:pl-[0.6em]" style={{ "--i": 2 } as CSSProperties}>
            <span className="text-outline-white italic">{hero.words[1]}</span>
            <StepNote n="02">{hero.notes[1]}</StepNote>
          </span>
          <span className="rise mt-[0.08em] block [:lang(tr)_&]:mt-[0.18em]" style={{ "--i": 3 } as CSSProperties}>
            <span
              className="inline-block -rotate-2 rounded-[0.1em] border-[3px] border-ink bg-lime px-[0.07em] text-ink md:border-4"
              style={{ boxShadow: "0.045em 0.045em 0 0 var(--color-ink)" }}
            >
              {hero.words[2]}
            </span>
          </span>
        </h1>

        {/* intro + actions */}
        <div
          className="rise relative z-10 mt-10 max-w-md lg:max-w-sm xl:absolute xl:bottom-0 xl:left-[calc(var(--hero-fs)*2.5)] xl:mt-0 xl:max-w-[24rem]"
          style={{ "--i": 4 } as CSSProperties}
        >
          <p className="text-lg leading-relaxed text-paper/90">
            {hero.intro}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={club.joinUrl} className="md:btn-lg xl:min-h-12 xl:px-6 xl:text-base">
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink href="#projects" variant="glass" className="md:btn-lg xl:min-h-12 xl:px-6 xl:text-base">
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>
        </div>

        {/* floating instruments — decorative */}
        <div
          aria-hidden="true"
          className="relative mt-16 h-[21rem] sm:h-[25rem] lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:h-auto"
        >
          {/* lime disc behind the glass so the blur has something to bend */}
          <div className="land absolute top-6 left-[18%] size-40 rounded-full bg-lime sm:size-52 lg:top-[10rem] lg:right-[3%] lg:left-auto lg:size-60" />

          <Floating depth={-18} i={0} className="top-0 left-0 w-[64%] max-w-[20rem] lg:top-[11rem] lg:right-[6%] lg:left-auto lg:w-[19rem] xl:w-[21rem]">
            <div className="-rotate-3">
              <VisionCard />
            </div>
          </Floating>

          <Floating depth={-28} i={1} alt className="top-[9.5rem] right-0 w-[52%] max-w-[16rem] sm:top-[11rem] lg:top-auto lg:right-[3%] lg:bottom-[12rem] lg:w-[13rem] xl:w-[14rem]">
            <div className="rotate-[5deg]">
              <LossCard />
            </div>
          </Floating>

          <Floating depth={12} i={2} className="top-[1.5rem] right-[2%] lg:hidden xl:top-[8.5rem] xl:right-[29%] xl:block">
            <span className="pill rotate-6 border-ink bg-paper px-4 py-2 text-base text-ink" style={{ boxShadow: "var(--shadow-brut-sm)" }}>
              {hero.chips.robotics}
            </span>
          </Floating>

          <Floating depth={20} i={3} alt className="hidden xl:top-[29rem] xl:right-[20%] xl:bottom-auto xl:left-auto xl:block">
            <span className="pill glass -rotate-3 px-4 py-2 text-base text-paper">{hero.chips.ml}</span>
          </Floating>

          <Floating depth={-10} i={4} className="hidden xl:top-auto xl:right-[21%] xl:bottom-[13rem] xl:block">
            <span className="pill rotate-[-8deg] border-ink bg-lime px-4 py-2 text-base text-ink" style={{ boxShadow: "var(--shadow-brut-sm)" }}>
              {hero.chips.ai}
            </span>
          </Floating>

          <Floating depth={8} i={5} alt className="hidden">
            <span className="pill rotate-2 border-paper bg-violet-deep px-4 py-2 text-base text-paper">{hero.chips.automation}</span>
          </Floating>

          <div className="absolute bottom-0 left-[3%] w-24 sm:w-28 lg:top-[26rem] lg:right-[1%] lg:bottom-auto lg:left-auto lg:w-32">
            <div className="land" style={{ "--i": 3 } as CSSProperties}>
              <Sticker text={hero.sticker} className="w-full">
                <Loop className="w-full" />
              </Sticker>
            </div>
          </div>

          {/* arrows */}
          <Arrow
            variant="curl"
            drawIndex={0}
            className="absolute top-[6rem] right-[36%] hidden w-48 rotate-[190deg] text-lime xl:block"
          />
          <Arrow variant="zig" drawIndex={1} className="absolute bottom-4 left-[32%] w-24 -rotate-12 text-lime sm:w-32 lg:hidden" />
        </div>

      </div>
    </section>
  );
}
