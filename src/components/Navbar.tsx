import { useEffect, useState } from "react";
import { useContent } from "../content/i18n";
import { club, languages } from "../content/site";
import { ButtonLink } from "./ui/Button";
import { Logo } from "./Logo";

/** TR | EN segmented switch: the active language is highlighted, the other one links to its page. */
function LangSwitch() {
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
            href={l.href}
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

export function Navbar() {
  const t = useContent();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 md:top-5">
      <nav
        aria-label={t.common.mainNav}
        className={`container-x transition-[max-width] duration-500 ease-[var(--ease-out-expo)] ${scrolled ? "max-w-[74rem]" : ""}`}
      >
        <div
          className={`glass-violet flex items-center justify-between gap-4 rounded-full py-2 pr-2 pl-4 transition-shadow duration-300 ${
            scrolled ? "shadow-[0_18px_40px_-18px_rgb(34_7_92/0.7)]" : ""
          }`}
        >
          <Logo />

          <ul className="hidden items-center gap-0.5 xl:flex">
            {t.nav.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2 font-display text-[0.95rem] font-medium whitespace-nowrap text-paper/85 transition-colors hover:bg-paper/12 hover:text-paper"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <LangSwitch />
            <ButtonLink href={club.joinUrl} className="hidden sm:inline-flex">
              {t.common.joinClub}
            </ButtonLink>
            <button
              type="button"
              className="grid size-12 place-items-center rounded-full border-2 border-ink bg-paper text-ink xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? t.common.closeMenu : t.common.openMenu}</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          hidden={!open}
          className="mt-2 rounded-[1.75rem] border-2 border-ink bg-paper p-3 xl:hidden"
          style={{ boxShadow: "var(--shadow-brut)" }}
        >
          <ul className="grid gap-1">
            {t.nav.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 font-display text-2xl font-bold tracking-tight hover:bg-lime"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href={club.joinUrl} variant="violet" size="lg" className="mt-3 w-full" onClick={() => setOpen(false)}>
            {t.common.joinClub}
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
