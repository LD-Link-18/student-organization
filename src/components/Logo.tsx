import { useContent } from "../content/i18n";
import { ClubMark } from "./ui/ClubMark";

/** Lime club mark + wordmark. The mark has 7-fold symmetry, so a 1/7 turn on hover lands seamlessly. */
export function Logo({ className = "", href = "#top", label }: { className?: string; href?: string; label?: string }) {
  const t = useContent();
  return (
    <a href={href} className={`group flex items-center gap-2.5 rounded-full ${className}`} aria-label={label ?? t.common.logoLabel}>
      <ClubMark className="size-10 shrink-0 text-lime transition-transform duration-500 ease-[var(--ease-snap)] group-hover:rotate-[51.43deg]" />
      <span className="font-display text-[0.95rem] leading-[0.95] font-bold tracking-tight text-paper">
        {t.club.wordmark[0]}
        <br />
        {t.club.wordmark[1]}
      </span>
    </a>
  );
}
