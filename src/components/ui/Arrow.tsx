type Variant = "curl" | "zig" | "swoop";

const paths: Record<Variant, { line: string; head: string }> = {
  curl: {
    line: "M8 96 C40 96 60 70 70 50 C82 24 58 10 48 30 C36 54 80 70 118 58 C146 49 168 34 184 18",
    head: "M164 19 L185 17 L183 38",
  },
  zig: {
    line: "M6 20 C30 60 50 0 74 40 C96 78 116 10 140 52 C152 74 168 80 190 76",
    head: "M176 63 L191 76 L175 89",
  },
  swoop: {
    line: "M10 10 C20 80 90 110 180 90",
    head: "M163 77 L181 90 L166 104",
  },
};

type Props = {
  variant?: Variant;
  className?: string;
  strokeWidth?: number;
  /** Stagger index for the draw-on animation (hero only). */
  drawIndex?: number;
};

/** Hand-drawn style arrow. Decorative, hidden from assistive tech. */
export function Arrow({ variant = "curl", className = "", strokeWidth = 6, drawIndex }: Props) {
  const p = paths[variant];
  const animated = drawIndex !== undefined;
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      aria-hidden="true"
      className={`${animated ? "draw" : ""} ${className}`}
      style={animated ? ({ "--i": drawIndex } as React.CSSProperties) : undefined}
    >
      <path d={p.line} pathLength={1} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d={p.head} pathLength={1} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
