import type { ReactNode } from "react";
import type { ProjectVisual } from "../content/site";

/*
 * Project covers: one drawn scene per project, in the site's visual language (thick black outlines,
 * hard shadows, lime accents on the violet-night backdrop). No words in them, so both languages share
 * the same art. To use a real screenshot instead: <img className="h-full w-full object-cover" … />
 */

const INK = "#000";
const SPARK = "M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z";

const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
    {children}
  </svg>
);

/** Hard-shadowed shape: the same path drawn in black, offset, then the real one on top. */
function Hard({ d, fill, shadow = 4, sw = 2.5 }: { d: string; fill: string; shadow?: number; sw?: number }) {
  return (
    <>
      <path d={d} fill={INK} transform={`translate(${shadow} ${shadow})`} />
      <path d={d} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
    </>
  );
}

/** Rounded rect path with an optional smaller corner (chat-bubble tail): r = radius, t = tail radius. */
const bubble = (x: number, y: number, w: number, h: number, r: number, tail: "bl" | "br", t = 4) => {
  const [tl, tr, br, bl] = [r, r, tail === "br" ? t : r, tail === "bl" ? t : r];
  return (
    `M${x + tl} ${y}H${x + w - tr}A${tr} ${tr} 0 0 1 ${x + w} ${y + tr}V${y + h - br}` +
    `A${br} ${br} 0 0 1 ${x + w - br} ${y + h}H${x + bl}A${bl} ${bl} 0 0 1 ${x} ${y + h - bl}` +
    `V${y + tl}A${tl} ${tl} 0 0 1 ${x + tl} ${y}Z`
  );
};

/** Wavy handwriting-like line: one quadratic wave per amplitude (sign sets the direction). */
const scribble = (x: number, y: number, amps: number[]) => amps.reduce((d, a) => `${d}q8 ${a} 16 0`, `M${x} ${y}`);

/* ------------------------------------------------------------------ KOUBOT: retrieval-augmented chat */
function Koubot() {
  return (
    <Svg>
      {/* source documents, the top page has the passage that gets retrieved */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <rect x="14" y="62" width="68" height="90" rx="6" fill="var(--color-violet)" />
        <rect x="22" y="53" width="68" height="90" rx="6" fill="var(--color-fog)" />
        <rect x="30" y="44" width="68" height="90" rx="6" fill="var(--color-paper)" />
      </g>
      <g stroke={INK} strokeWidth="3.5" strokeLinecap="round" opacity="0.75">
        <path d="M40 60h46M40 70h38M40 80h44M40 112h44M40 122h30" />
      </g>
      <rect x="37" y="87" width="54" height="12" rx="3" fill="var(--color-lime)" stroke={INK} strokeWidth="2" />
      <path d="M44 93h40" stroke={INK} strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />

      {/* retrieval: passage → answer */}
      <path d="M93 93C124 93 118 126 144 126" stroke="var(--color-lime)" strokeWidth="3" strokeDasharray="1 7" strokeLinecap="round" fill="none" />
      <path d="M138 119l8 7-8 7" stroke="var(--color-lime)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* the question */}
      <Hard d={bubble(164, 18, 134, 36, 14, "br")} fill="var(--color-paper)" />
      <g stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.85">
        <path d="M178 31h92M178 42h58" />
      </g>

      {/* the answer, with the sources it relied on */}
      <Hard d={bubble(150, 72, 154, 98, 16, "bl")} fill="var(--color-lime)" />
      <g stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.85">
        <path d="M166 90h114M166 102h98M166 114h106M166 126h62" />
      </g>
      {[1, 2].map((n, i) => (
        <g key={n}>
          <rect x={166 + i * 24} y="140" width="19" height="15" rx="4" fill={INK} />
          <text
            x={166 + i * 24 + 9.5}
            y="151"
            textAnchor="middle"
            className="font-display"
            fontSize="10.5"
            fontWeight="700"
            fill="var(--color-lime)"
          >
            {n}
          </text>
        </g>
      ))}
      <path d={SPARK} transform="translate(262 134) scale(0.7)" fill={INK} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ ScribbleMind: who wrote this? */
function Scribble() {
  const person = (cx: number, cy: number) => (
    <g fill={INK} opacity="0.85">
      <circle cx={cx} cy={cy - 5} r="4.5" />
      <path d={`M${cx - 10} ${cy + 11}a10 10 0 0 1 20 0z`} />
    </g>
  );
  return (
    <Svg>
      {/* the screenshot */}
      <rect x="30" y="36" width="190" height="144" rx="10" fill={INK} />
      <rect x="22" y="28" width="190" height="144" rx="10" fill="var(--color-paper)" />
      <path d="M22 38a10 10 0 0 1 10-10h170a10 10 0 0 1 10 10v10H22z" fill="var(--color-fog)" />
      <path d="M22 48h190" stroke={INK} strokeWidth="2.5" />
      <rect x="22" y="28" width="190" height="144" rx="10" fill="none" stroke={INK} strokeWidth="2.5" />
      {[36, 47, 58].map((cx, i) => (
        <circle key={cx} cx={cx} cy="38" r="3.5" fill={["var(--color-lime)", "var(--color-violet)", "var(--color-paper)"][i]} stroke={INK} strokeWidth="1.5" />
      ))}

      {/* handwriting */}
      <g fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d={scribble(38, 72, [-13, 10, -15, 12, -8, 14, -12, 10])} />
        <path d={scribble(38, 106, [-10, 14, -12, 8, -16, 12, -10, 14, -6])} />
        <path d={scribble(38, 140, [-12, 10, -8, 14, -10])} />
      </g>

      {/* detection */}
      <rect x="32" y="88" width="154" height="36" rx="3" fill="var(--color-violet)" fillOpacity="0.08" stroke="var(--color-violet)" strokeWidth="3" strokeDasharray="7 5" />
      <rect x="136" y="122" width="52" height="17" rx="3" fill="var(--color-violet)" />
      <text x="162" y="134.5" textAnchor="middle" className="font-display" fontSize="11" fontWeight="700" fill="var(--color-lime)">
        0.94
      </text>

      {/* who wrote it: candidates, one matched */}
      <path d="M212 100H232" stroke="var(--color-lime)" strokeWidth="3" strokeDasharray="1 6" strokeLinecap="round" />
      <circle cx="254" cy="50" r="19" fill="var(--color-fog)" stroke={INK} strokeWidth="2.5" opacity="0.85" />
      {person(254, 50)}
      <circle cx="254" cy="150" r="19" fill="var(--color-fog)" stroke={INK} strokeWidth="2.5" opacity="0.85" />
      {person(254, 150)}
      <circle cx="254" cy="100" r="27" fill="none" stroke="var(--color-paper)" strokeWidth="2" strokeDasharray="3 5" opacity="0.7" />
      <circle cx="257" cy="103" r="19" fill={INK} />
      <circle cx="254" cy="100" r="19" fill="var(--color-lime)" stroke={INK} strokeWidth="2.5" />
      {person(254, 100)}
      <circle cx="270" cy="115" r="8.5" fill={INK} stroke="var(--color-lime)" strokeWidth="2" />
      <path d="m266 115 3 3 5-6" stroke="var(--color-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ Traffic simulation: roads, cars, a sensor */
function Traffic() {
  const roads = "M-10 62H330M-10 138H330M96-10V210M224-10V210";
  const car = (x: number, y: number, w: number, h: number, fill: string) => (
    <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="4" fill={fill} stroke={INK} strokeWidth="2" />
  );
  return (
    <Svg>
      <path d={roads} stroke="var(--color-violet-deep)" strokeWidth="26" fill="none" />
      <path d={roads} stroke="var(--color-paper)" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.4" />

      {/* motion trails */}
      <g stroke="var(--color-paper)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6" opacity="0.55">
        <path d="M6 70h26M128 55h20M240 70h20M6 131h22M128 145h20" />
        <path d="M89 66v20M231 66v20" />
      </g>

      {/* cars */}
      {car(36, 64, 22, 11, "var(--color-lime)")}
      {car(152, 49, 22, 11, "var(--color-paper)")}
      {car(264, 64, 22, 11, "var(--color-fog)")}
      {car(32, 125, 22, 11, "var(--color-paper)")}
      {car(152, 139, 22, 11, "var(--color-lime)")}
      {car(84, 90, 11, 22, "var(--color-paper)")}
      {car(225, 90, 11, 22, "var(--color-lime)")}
      {car(84, 10, 11, 22, "var(--color-fog)")}
      {car(225, 160, 11, 22, "var(--color-paper)")}

      {/* traffic light */}
      <rect x="113" y="14" width="13" height="32" rx="4" fill={INK} stroke="var(--color-paper)" strokeWidth="1.5" />
      <circle cx="119.5" cy="22" r="3.4" fill="var(--color-paper)" opacity="0.3" />
      <circle cx="119.5" cy="30" r="3.4" fill="var(--color-paper)" opacity="0.3" />
      <circle cx="119.5" cy="38" r="3.4" fill="var(--color-lime)" />

      {/* a sensor that records the junction */}
      <g fill="none" stroke="var(--color-lime)" strokeDasharray="3 5" strokeLinecap="round">
        <circle cx="224" cy="62" r="17" strokeWidth="2.5" />
        <circle cx="224" cy="62" r="28" strokeWidth="2" opacity="0.6" />
      </g>
      <circle cx="224" cy="62" r="4" fill="var(--color-lime)" stroke={INK} strokeWidth="1.5" />
      <path d="M244 46L254 40" stroke="var(--color-lime)" strokeWidth="3" strokeDasharray="1 6" strokeLinecap="round" />

      {/* the record it produces */}
      <Hard d="M252 8h56a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6h-56a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6Z" fill="var(--color-paper)" shadow={3} />
      <circle cx="260" cy="18" r="3.5" fill="var(--color-lime)" stroke={INK} strokeWidth="1.5" />
      <g stroke={INK} strokeWidth="3.5" strokeLinecap="round" opacity="0.8">
        <path d="M268 18h30M258 28h40M258 37h24" />
      </g>
    </Svg>
  );
}

/* ------------------------------------------------------------------ Quill: read vs. spoiler-protected */
function Quill() {
  const left = (x: number) => 52 + (x - 36) * (8 / 122); // top edge of the left page
  const right = (x: number) => 60 - (x - 162) * (8 / 122); // top edge of the right page
  const line = (top: (x: number) => number, x1: number, x2: number, i: number) =>
    `M${x1} ${top(x1) + 24 + i * 14}L${x2} ${top(x2) + 24 + i * 14}`;
  const leftPage = "M36 52L158 60V162L36 154Z";
  const rightPage = "M162 60L284 52V154L162 162Z";
  const hidden = { stroke: "var(--color-violet)", strokeWidth: 8, strokeLinecap: "round" as const, opacity: 0.28 };

  return (
    <Svg>
      <Hard d={leftPage} fill="var(--color-paper)" shadow={5} />
      <Hard d={rightPage} fill="var(--color-paper)" shadow={5} />

      {/* already read */}
      <g stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.85">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={line(left, 50, i === 4 ? 112 : 146, i)} />
        ))}
        <path d={line(right, 174, 270, 0)} />
        <path d={line(right, 174, 252, 1)} />
        <path d={line(right, 174, 214, 2)} />
      </g>

      {/* where the reader stopped */}
      <path d={`M217 ${right(217) + 17}v16`} stroke="var(--color-violet)" strokeWidth="3" strokeLinecap="round" />

      {/* protected: nothing past this point is shown to the model */}
      <g fill="none" {...hidden}>
        <path d={line(right, 224, 270, 2)} />
        <path d={line(right, 174, 270, 3)} />
        <path d={line(right, 174, 258, 4)} />
      </g>

      {/* bookmark */}
      <path d="M272 53.5L284 52.7V88L278 82L272 88Z" fill="var(--color-lime)" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />

      {/* lock */}
      <circle cx="224" cy="139" r="15" fill={INK} transform="translate(2.5 2.5)" />
      <circle cx="224" cy="139" r="15" fill="var(--color-lime)" stroke={INK} strokeWidth="2.5" />
      <rect x="217" y="139" width="14" height="10.5" rx="2.5" fill={INK} />
      <path d="M220 139v-4.5a4 4 0 0 1 8 0V139" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />

      {/* the quill, resting across the corner of the book */}
      <g transform="translate(16 195) rotate(-9) scale(0.7)">
        <path d="M10 -5C16 -40 50 -66 96 -68C88 -32 54 -8 10 -5Z" fill={INK} transform="translate(3.5 3.5)" />
        <path d="M10 -5C16 -40 50 -66 96 -68C88 -32 54 -8 10 -5Z" fill="var(--color-lime)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        {/* barbs, on both sides of the shaft */}
        <path
          d="M30 -17l7 -9M43 -27l9 -10M56 -37l9 -10M70 -47l8 -10M26 -22l-2 -10M38 -33l-3 -10M51 -43l-3 -10M64 -52l-2 -10"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path d="M0 0L92 -66" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        {/* nib */}
        <path d="M-9 8L4 -3L9 4Z" fill={INK} />
      </g>
    </Svg>
  );
}

/** Cover for a project card or page header; `visual` comes from the project's data. */
export function ProjectArt({ visual }: { visual: ProjectVisual }) {
  switch (visual) {
    case "koubot":
      return <Koubot />;
    case "scribble":
      return <Scribble />;
    case "traffic":
      return <Traffic />;
    case "quill":
      return <Quill />;
  }
}
