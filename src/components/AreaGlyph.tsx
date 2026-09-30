import type { AreaKey } from "../content/site";

/**
 * One small diagram per area. Each uses `currentColor` for strokes and
 * `--accent` for the highlighted element, so a card can recolor it.
 */
export function AreaGlyph({ area, className = "" }: { area: AreaKey; className?: string }) {
  const common = {
    viewBox: "0 0 160 120",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  const accent = "var(--accent, var(--color-lime))";

  switch (area) {
    case "ai": {
      // reasoning graph — one path through it is chosen
      const nodes: [number, number][] = [[16, 60], [60, 22], [60, 60], [60, 98], [104, 40], [104, 80], [146, 60]];
      const edges = [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [2, 5], [3, 5], [4, 6], [5, 6]];
      const chosen = new Set(["0-2", "2-4", "4-6"]);
      return (
        <svg {...common}>
          {edges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
              stroke={chosen.has(`${a}-${b}`) ? accent : "currentColor"}
              strokeWidth={chosen.has(`${a}-${b}`) ? 5 : 2}
              opacity={chosen.has(`${a}-${b}`) ? 1 : 0.55}
            />
          ))}
          {nodes.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={[0, 2, 4, 6].includes(i) ? 9 : 7} fill={[0, 2, 4, 6].includes(i) ? accent : "var(--card-bg)"} stroke="currentColor" />
          ))}
        </svg>
      );
    }
    case "ml":
      // classifier: two classes split by a learned boundary
      return (
        <svg {...common}>
          <path d="M20 108 C60 90 70 30 146 14" strokeWidth={4} strokeDasharray="2 9" />
          {[[24, 30], [44, 52], [30, 72], [58, 24], [70, 44], [22, 50]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={6} fill="currentColor" stroke="none" />
          ))}
          {[[100, 70], [126, 52], [118, 92], [140, 78], [92, 100], [138, 104]].map(([x, y]) => (
            <rect key={`${x}${y}`} x={x - 6} y={y - 6} width={12} height={12} rx={2} fill="var(--card-bg)" />
          ))}
        </svg>
      );
    case "robotics":
      // two-link arm with gripper
      return (
        <svg {...common}>
          <rect x="18" y="98" width="46" height="14" rx="3" fill="currentColor" />
          <path d="M41 98 L58 56 L112 34" strokeWidth={10} />
          <circle cx="41" cy="96" r="7" fill={accent} />
          <circle cx="58" cy="56" r="7" fill={accent} />
          <circle cx="112" cy="34" r="7" fill={accent} />
          <path d="M116 30 L136 18 M118 40 L140 40" strokeWidth={5} />
          <rect x="128" y="78" width="22" height="22" rx="3" strokeDasharray="4 5" />
        </svg>
      );
    case "vision":
      // aperture inside focus brackets
      return (
        <svg {...common}>
          <path d="M40 22 H28 V34 M120 22 H132 V34 M40 98 H28 V86 M120 98 H132 V86" strokeWidth={4} />
          <circle cx="80" cy="60" r="30" />
          <circle cx="80" cy="60" r="16" fill={accent} stroke="none" />
          <circle cx="86" cy="54" r="5" fill="currentColor" stroke="none" />
          <path d="M50 60 H38 M122 60 H110" strokeWidth={2} />
        </svg>
      );
    case "embedded":
      // microcontroller with pins
      return (
        <svg {...common}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <line x1={54 + i * 13} y1="10" x2={54 + i * 13} y2="24" />
              <line x1={54 + i * 13} y1="96" x2={54 + i * 13} y2="110" />
            </g>
          ))}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <line x1="30" y1={40 + i * 13} x2="44" y2={40 + i * 13} />
              <line x1="116" y1={40 + i * 13} x2="130" y2={40 + i * 13} />
            </g>
          ))}
          <rect x="44" y="24" width="72" height="72" rx="8" fill="currentColor" />
          <rect x="62" y="42" width="36" height="36" rx="4" fill={accent} stroke="none" />
          <circle cx="54" cy="34" r="3" fill="var(--card-bg)" stroke="none" />
        </svg>
      );
    case "automation":
      // pipeline that loops back on itself
      return (
        <svg {...common}>
          <rect x="8" y="42" width="30" height="30" rx="6" fill={accent} />
          <rect x="65" y="42" width="30" height="30" rx="15" />
          <rect x="122" y="42" width="30" height="30" rx="4" fill="currentColor" />
          <path d="M40 57 H60 M54 51 L60 57 L54 63 M97 57 H117 M111 51 L117 57 L111 63" />
          <path d="M137 40 C137 8 23 8 23 38 M17 32 L23 39 L29 32" strokeDasharray="0" />
          <path d="M23 76 C23 108 137 108 137 76" strokeDasharray="3 7" opacity={0.6} />
        </svg>
      );
  }
}
