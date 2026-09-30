import { useContent } from "../content/i18n";
import { club } from "../content/site";
import { Logo } from "./Logo";

export function Footer() {
  const t = useContent();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-violet-night text-paper">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm leading-relaxed text-paper/70">
              {t.footer.blurb}
            </p>
            <a
              href={`mailto:${club.email}`}
              className="mt-6 inline-block font-display text-2xl font-bold tracking-tight text-lime underline decoration-2 underline-offset-[6px] hover:decoration-paper md:text-3xl"
            >
              {club.email}
            </a>
          </div>

          <nav aria-label={t.common.footerNav} className="md:col-span-3 md:col-start-7">
            <h2 className="meta text-paper/60">{t.footer.explore}</h2>
            <ul className="mt-4 grid gap-2">
              {t.nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-display text-lg font-medium hover:text-lime">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="meta text-paper/60">{t.footer.follow}</h2>
            <ul className="mt-4 grid gap-2">
              {club.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="font-display text-lg font-medium hover:text-lime">
                    {s.label}
                    <span className="sr-only">{t.common.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-paper/15 pt-6 text-sm text-paper/60 sm:flex-row">
          <p>{t.footer.rights(year)}</p>
          <a href="#top" className="hover:text-lime">
            {t.common.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
