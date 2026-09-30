import type { AvatarVariant } from "../content/site";

/** Geometric placeholder portrait. Replace with <img> once real photos exist. */
export function Avatar({ variant, initials }: { variant: AvatarVariant; initials: string }) {
  const shapes: Record<AvatarVariant, { bg: string; art: React.ReactNode }> = {
    0: {
      bg: "bg-violet",
      art: (
        <>
          <circle cx="50" cy="40" r="17" fill="var(--color-lime)" stroke="#000" strokeWidth="3" />
          <path d="M16 100 C16 70 84 70 84 100 Z" fill="var(--color-paper)" stroke="#000" strokeWidth="3" />
        </>
      ),
    },
    1: {
      bg: "bg-lime",
      art: (
        <>
          <rect x="30" y="22" width="38" height="38" rx="6" transform="rotate(12 49 41)" fill="var(--color-violet)" stroke="#000" strokeWidth="3" />
          <path d="M14 100 L50 70 L86 100 Z" fill="#000" />
          <circle cx="72" cy="24" r="6" fill="var(--color-paper)" stroke="#000" strokeWidth="3" />
        </>
      ),
    },
    2: {
      bg: "bg-ink",
      art: (
        <>
          <path d="M50 18 L76 62 L24 62 Z" fill="var(--color-paper)" />
          <circle cx="50" cy="48" r="9" fill="var(--color-violet)" />
          <rect x="18" y="74" width="64" height="26" rx="13" fill="var(--color-lime)" />
        </>
      ),
    },
    4: {
      bg: "bg-fog",
      art: (
        <>
          <circle cx="40" cy="42" r="20" fill="var(--color-violet)" stroke="#000" strokeWidth="3" />
          <circle cx="62" cy="42" r="20" fill="var(--color-lime)" stroke="#000" strokeWidth="3" />
          <rect x="20" y="72" width="60" height="28" rx="4" fill="#000" />
        </>
      ),
    },
    5: {
      bg: "bg-violet-deep",
      art: (
        <>
          <rect x="14" y="70" width="24" height="32" fill="var(--color-lime)" stroke="#000" strokeWidth="3" />
          <rect x="38" y="50" width="24" height="52" fill="var(--color-paper)" stroke="#000" strokeWidth="3" />
          <rect x="62" y="30" width="24" height="72" fill="var(--color-lime)" stroke="#000" strokeWidth="3" />
          <circle cx="74" cy="17" r="7" fill="var(--color-paper)" stroke="#000" strokeWidth="3" />
        </>
      ),
    },
    3: {
      bg: "bg-paper",
      art: (
        <>
          <path d="M22 54 A28 28 0 0 1 78 54 Z" fill="var(--color-violet)" stroke="#000" strokeWidth="3" />
          <path d="M50 100 L50 64 A36 36 0 0 1 86 100 Z" fill="var(--color-lime)" stroke="#000" strokeWidth="3" />
          <circle cx="30" cy="80" r="8" fill="#000" />
        </>
      ),
    },
  };
  const { bg, art } = shapes[variant];
  return (
    <div className={`relative aspect-square overflow-hidden rounded-[1.1rem] border-2 border-ink ${bg}`}>
      {variant === 3 && <div className="dot-grid absolute inset-0 text-ink/15" />}
      <svg viewBox="0 0 100 100" className="relative h-full w-full transition-transform duration-500 group-hover:scale-110" aria-hidden="true">
        {art}
      </svg>
      <span className="absolute bottom-2 left-2 rounded-md border-2 border-ink bg-paper px-1.5 py-0.5 font-display text-xs font-bold text-ink" aria-hidden="true">
        {initials}
      </span>
    </div>
  );
}
