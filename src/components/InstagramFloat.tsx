import { useContent } from "../content/i18n";
import { instagramHref } from "../content/site";
import { InstagramGlyph } from "./ui/Glyph";

/** "@handle" from the profile URL, e.g. https://www.instagram.com/foo/ → @foo */
const handle = "@" + instagramHref.replace(/\/+$/, "").split("/").pop();

/** Floating Instagram promo, pinned to the bottom right on every scroll position. */
export function InstagramFloat() {
  const { instaPromo } = useContent();
  return (
    <aside aria-label={instaPromo.region} className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      <a
        href={instagramHref}
        className="group flex -rotate-2 items-center gap-3 rounded-full border-2 border-ink bg-ink py-2 pr-5 pl-2 text-paper shadow-[4px_4px_0_0_var(--color-lime)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-snap)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-lime)] active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-lime text-ink transition-transform duration-300 ease-[var(--ease-snap)] group-hover:rotate-12 sm:size-12">
          <InstagramGlyph className="size-6" />
        </span>
        <span className="grid leading-tight">
          <span className="font-display text-base font-bold tracking-tight sm:text-sm sm:font-medium sm:text-paper/70">
            {instaPromo.label}
          </span>
          <span className="hidden font-display text-lg font-bold tracking-tight text-lime sm:block">{handle}</span>
        </span>
      </a>
    </aside>
  );
}
