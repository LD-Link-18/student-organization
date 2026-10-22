import type { ReactNode } from "react";
import { useContent } from "../content/i18n";
import { instagramHref, whatsappHref } from "../content/site";
import { InstagramGlyph, WhatsAppGlyph } from "./ui/Glyph";

/** "@handle" from the profile URL, e.g. https://www.instagram.com/foo/ → @foo */
const handle = "@" + instagramHref.replace(/\/+$/, "").split("/").pop();

/**
 * One pill: lime icon disc, a small label and a bolder lime title. Phones get just the disc (the label stays
 * for screen readers) so the always-on stack doesn't cover the page.
 * `tilt` is the sticker rotation, so stacked pills don't sit perfectly in line.
 */
function FloatPill({ href, icon, label, title, tilt }: { href: string; icon: ReactNode; label: string; title: string; tilt: string }) {
  return (
    <a
      href={href}
      className={`group flex items-center gap-3 rounded-full border-2 border-ink bg-ink p-1.5 sm:py-2 sm:pr-5 sm:pl-2 text-paper shadow-[4px_4px_0_0_var(--color-lime)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-snap)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-lime)] active:translate-x-1 active:translate-y-1 active:shadow-none ${tilt}`}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-lime text-ink transition-transform duration-300 ease-[var(--ease-snap)] group-hover:rotate-12 sm:size-12">
        {icon}
      </span>
      <span className="sr-only sm:not-sr-only sm:grid sm:leading-tight">
        <span className="font-display text-sm font-medium tracking-tight text-paper/70">{label}</span>{" "}
        <span className="font-display text-lg font-bold tracking-tight text-lime">{title}</span>
      </span>
    </a>
  );
}

/** Floating WhatsApp + Instagram promos, stacked in the bottom right on every scroll position. */
export function SocialFloat() {
  const { socialFloat } = useContent();
  return (
    <aside aria-label={socialFloat.region} className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5 sm:gap-3 sm:right-6 sm:bottom-6">
      <FloatPill
        href={whatsappHref}
        icon={<WhatsAppGlyph className="size-6" />}
        label={socialFloat.whatsapp.label}
        title={socialFloat.whatsapp.title}
        tilt="rotate-1"
      />
      <FloatPill
        href={instagramHref}
        icon={<InstagramGlyph className="size-6" />}
        label={socialFloat.instagram.label}
        title={handle}
        tilt="-rotate-2"
      />
    </aside>
  );
}
