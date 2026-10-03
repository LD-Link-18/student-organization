import { isExternal, useContent } from "../content/i18n";
import type { AvatarVariant } from "../content/site";
import { Avatar } from "./Avatar";

/** First and last name initials: "Samet Mert Dik" → "SD". */
export const initialsOf = (name: string) => {
  const words = name.trim().split(/\s+/);
  return words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0][0];
};

/**
 * Person card shared by the homepage team and the project pages. With `href` the whole card is the
 * link (new tab), marked by a corner arrow.
 */
export function MemberCard({
  name,
  avatar,
  role,
  note,
  href,
}: {
  name: string;
  avatar: AvatarVariant;
  /** Lime pill above the name. */
  role?: string;
  /** Small line under the name (e.g. interests). */
  note?: string;
  href?: string;
}) {
  const { common } = useContent();
  return (
    <article className="card-brut lift group relative h-full rounded-[1.25rem] p-2 focus-within:outline-3 focus-within:outline-offset-4 focus-within:outline-lime sm:rounded-[1.75rem] sm:p-3">
      <Avatar variant={avatar} initials={initialsOf(name)} />
      {href && (
        // corner sticker, outside the artwork: marks the card as a link
        <span
          aria-hidden="true"
          className="absolute -top-3 -right-3 grid size-8 place-items-center rounded-full border-2 border-ink bg-lime text-ink shadow-[2px_2px_0_0_var(--color-ink)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 sm:size-9"
        >
          <svg viewBox="0 0 24 24" className="size-4 sm:size-[1.1rem]" fill="none">
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      <div className="px-1 pt-4 pb-2 sm:px-2 sm:pt-5 sm:pb-3">
        {role && <p className="pill mb-3 border-ink bg-lime text-xs leading-tight whitespace-normal sm:text-[0.8125rem]">{role}</p>}
        <h3 className="text-lg leading-tight font-bold tracking-tight sm:text-2xl xl:text-xl">
          {href ? (
            // the link stretches over the whole card
            <a
              href={href}
              {...(isExternal(href) ? { target: "_blank", rel: "noreferrer" } : {})}
              className="outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:shadow-none"
            >
              {name}
              {isExternal(href) && <span className="sr-only">{common.newTab}</span>}
            </a>
          ) : (
            name
          )}
        </h3>
        {note && <p className="mt-1 text-sm text-ink/70 sm:text-base">{note}</p>}
      </div>
    </article>
  );
}
