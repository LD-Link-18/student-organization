import { useId } from "react";

type Props = {
  text: string;
  className?: string;
  /** Tailwind classes for the disc (background + text color). */
  tone?: string;
  children?: React.ReactNode;
};

/** Circular badge with rotating text around the rim. */
export function Sticker({ text, className = "", tone = "bg-lime text-ink", children }: Props) {
  const id = useId();
  return (
    <div
      className={`relative grid aspect-square place-items-center rounded-full border-2 border-ink ${tone} ${className}`}
      style={{ boxShadow: "var(--shadow-brut-sm)" }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden="true">
        <defs>
          <path id={id} d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <text className="fill-current font-display text-[19px] font-bold uppercase" >
          <textPath href={`#${id}`} textLength={477} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="sr-only">{text}</span>
      <div className="relative w-[38%]" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
