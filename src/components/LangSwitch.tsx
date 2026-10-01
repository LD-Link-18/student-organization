import { useContent } from "../content/i18n";
import { languages } from "../content/site";
import type { Locale } from "../content/types";

/**
 * TR | EN segmented switch: the active language is highlighted, the other one links to its page.
 * `hrefFor` overrides the target per language (e.g. the other language's coming-soon page).
 */
export function LangSwitch({ hrefFor }: { hrefFor?: (code: Locale) => string }) {
  const { locale, switcher } = useContent();
  const segment = "grid size-9 place-items-center rounded-full font-display text-sm font-bold sm:size-10";
  return (
    <div
      role="group"
      aria-label={switcher.groupLabel}
      className="flex items-center gap-0.5 rounded-full border border-paper/35 bg-paper/10 p-1"
    >
      {languages.map((l) =>
        l.code === locale ? (
          <span key={l.code} lang={l.code} aria-current="true" className={`${segment} bg-lime text-ink ring-2 ring-ink`}>
            <span aria-hidden="true">{l.label}</span>
            <span className="sr-only">{l.name}</span>
          </span>
        ) : (
          <a
            key={l.code}
            href={hrefFor ? hrefFor(l.code) : l.href}
            hrefLang={l.code}
            lang={l.code}
            className={`${segment} text-paper/80 transition-colors hover:bg-paper/15 hover:text-paper`}
          >
            <span aria-hidden="true">{l.label}</span>
            <span className="sr-only">{l.name}</span>
          </a>
        ),
      )}
    </div>
  );
}
