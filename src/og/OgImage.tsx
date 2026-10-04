import type { CSSProperties } from "react";
import { VisionCard } from "../components/HeroInstruments";
import { ClubMark } from "../components/ui/ClubMark";
import { Spark } from "../components/ui/Glyph";
import { useContent } from "../content/i18n";

/**
 * The social preview card (Open Graph image), 1200 × 630, drawn with the site's own components.
 * Rendered at /tools/og/?lang=tr|en and screenshotted to public/og/og-<lang>.png (see README).
 */
export function OgImage() {
  const t = useContent();
  const tape = [...t.areas.items.map((a) => a.title), ...t.tapeExtras];

  return (
    <div className="relative isolate h-[630px] w-[1200px] overflow-hidden bg-violet text-paper">
      <div className="grid-lines grid-fade absolute inset-0 -z-10" />
      <div
        className="absolute -bottom-56 -left-40 -z-10 size-[34rem] bg-violet-deep"
        style={{ borderRadius: "58% 42% 63% 37% / 45% 55% 45% 55%" }}
      />

      {/* who */}
      <div className="absolute top-12 left-14 flex items-center gap-4">
        <ClubMark className="size-[76px] text-lime" />
        <p className="font-display text-[36px] leading-[0.95] font-bold tracking-tight">
          {t.club.wordmark[0]}
          <br />
          {t.club.wordmark[1]}
        </p>
      </div>
      <p
        className="pill absolute top-[58px] right-14 rotate-[-2deg] border-2 border-ink bg-paper px-5 py-2.5 text-[22px] text-ink"
        style={{ boxShadow: "var(--shadow-brut-sm)" }}
      >
        {t.club.university}
      </p>

      {/* the loop */}
      <h1 className="display-xl absolute top-[164px] left-14" style={{ fontSize: 112 }}>
        <span className="block">{t.hero.words[0]}</span>
        <span className="block pl-[0.3em]">
          <span className="text-outline-white italic">{t.hero.words[1]}</span>
        </span>
        <span className="mt-[0.08em] block [:lang(tr)_&]:mt-[0.16em]">
          <span
            className="inline-block -rotate-2 rounded-[0.1em] border-4 border-ink bg-lime px-[0.07em] text-ink"
            style={{ boxShadow: "0.045em 0.045em 0 0 var(--color-ink)" } as CSSProperties}
          >
            {t.hero.words[2]}
          </span>
        </span>
      </h1>

      {/* the instrument: glass camera card over a lime glow */}
      <div className="absolute top-[150px] right-[86px] size-[290px] rounded-full bg-lime" />
      <div className="absolute top-[178px] right-[60px] w-[400px] -rotate-3">
        <VisionCard />
      </div>
      <span
        className="pill absolute top-[122px] right-[444px] rotate-6 border-2 border-ink bg-paper px-4 py-2 text-[20px] text-ink"
        style={{ boxShadow: "var(--shadow-brut-sm)" }}
      >
        {t.hero.chips.robotics}
      </span>
      <span
        className="pill absolute top-[452px] right-[330px] rotate-[-6deg] border-2 border-ink bg-lime px-4 py-2 text-[20px] text-ink"
        style={{ boxShadow: "var(--shadow-brut-sm)" }}
      >
        {t.hero.chips.ai}
      </span>

      {/* tape */}
      <div className="absolute -inset-x-8 bottom-[26px] flex -rotate-2 items-center gap-7 border-y-[3px] border-ink bg-lime py-3 pl-14 font-display text-[30px] font-bold tracking-tight whitespace-nowrap text-ink">
        {tape.map((item) => (
          <span key={item} className="flex items-center gap-7">
            {item}
            <Spark className="size-6 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
