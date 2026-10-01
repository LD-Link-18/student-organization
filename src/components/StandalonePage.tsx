import type { ReactNode } from "react";
import { useContent } from "../content/i18n";
import { languages } from "../content/site";
import type { Locale } from "../content/types";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";

/** The current language's homepage ("/" or "/en/"). */
export function useHomeHref() {
  const { locale } = useContent();
  return languages.find((l) => l.code === locale)!.href;
}

/**
 * Shared shell for single-screen pages (coming soon, 404): violet hero backdrop, logo + language
 * switch bar, a text column and a decorative column, and the copyright line.
 */
export function StandalonePage({
  children,
  aside,
  hrefFor,
}: {
  children: ReactNode;
  /** Decorative illustration; hidden from assistive tech. */
  aside: ReactNode;
  /** Language switch targets; defaults to each language's homepage. */
  hrefFor?: (code: Locale) => string;
}) {
  const t = useContent();
  const home = useHomeHref();
  return (
    <div className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-violet text-paper">
      <div className="grid-lines grid-fade absolute inset-0 -z-10" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -bottom-48 -left-40 -z-10 h-[34rem] w-[34rem] bg-violet-deep"
        style={{ borderRadius: "58% 42% 63% 37% / 45% 55% 45% 55%" }}
      />

      <header className="container-x pt-3 md:pt-5">
        <div className="glass-violet flex items-center justify-between gap-4 rounded-full py-2 pr-2 pl-4">
          <Logo href={home} label={t.common.homeLabel} />
          <LangSwitch hrefFor={hrefFor} />
        </div>
      </header>

      <main id="main" className="container-x relative grid flex-1 content-center gap-14 py-16 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="relative z-10 lg:col-span-7">{children}</div>
        <div aria-hidden="true" className="relative mx-auto h-[26rem] w-full max-w-md lg:col-span-5 lg:h-[30rem] lg:max-w-none">
          {aside}
        </div>
      </main>

      <footer className="container-x pb-6 text-sm text-paper/60">{t.footer.rights(new Date().getFullYear())}</footer>
    </div>
  );
}
