import { useContent } from "../content/i18n";
import type { ProjectVisual } from "../content/site";

/** Abstract preview per project. Swap for a real screenshot later: <img className="h-full w-full object-cover" …/> */
export function ProjectArt({ visual }: { visual: ProjectVisual }) {
  const { projects } = useContent();
  switch (visual) {
    case "vision": {
      // library seat map — occupied seats glow
      const taken = new Set([1, 2, 5, 9, 10, 11, 14, 18, 20, 21, 22, 27, 29, 30, 34, 35, 38]);
      return (
        <div className="flex h-full items-center justify-center gap-6 p-6 sm:gap-10">
          <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className={`size-3.5 rounded-[3px] sm:size-5 ${taken.has(i) ? "bg-lime" : "border-[1.5px] border-paper/40"}`}
              />
            ))}
          </div>
          <div className="font-display text-paper">
            <div className="text-4xl leading-none font-bold tracking-tight sm:text-5xl">23</div>
            <div className="mt-1 text-sm text-paper/70">{projects.seatsFree}</div>
          </div>
        </div>
      );
    }
    case "rover":
      return (
        <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
          {Array.from({ length: 11 }).map((_, i) => {
            const a = (-150 + i * 12) * (Math.PI / 180);
            return (
              <line key={i} x1="150" y1="120" x2={150 + Math.cos(a) * 110} y2={120 + Math.sin(a) * 110} stroke="var(--color-lime)" strokeOpacity="0.35" strokeWidth="1.5" />
            );
          })}
          <path d="M30 180 C70 170 90 130 150 120" stroke="var(--color-paper)" strokeWidth="3" strokeDasharray="3 8" strokeLinecap="round" fill="none" />
          <rect x="54" y="26" width="58" height="34" rx="8" fill="var(--color-violet)" />
          <circle cx="238" cy="70" r="26" fill="var(--color-violet)" />
          <rect x="220" y="140" width="70" height="24" rx="12" fill="var(--color-violet)" />
          <g transform="translate(150 120) rotate(-30)">
            <rect x="-16" y="-11" width="32" height="22" rx="5" fill="var(--color-lime)" stroke="#000" strokeWidth="2.5" />
            <path d="M16 0 L24 0" stroke="#000" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "neural": {
      const layers = [3, 5, 5, 2];
      const x = (l: number) => 50 + l * 73;
      const y = (n: number, count: number) => 100 + (n - (count - 1) / 2) * 34;
      const strength = (a: number, b: number) => ((a * 7 + b * 3) % 5) / 5;
      return (
        <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
          {layers.slice(0, -1).map((count, l) =>
            Array.from({ length: count }).flatMap((_, a) =>
              Array.from({ length: layers[l + 1] }).map((__, b) => (
                <line
                  key={`${l}-${a}-${b}`}
                  x1={x(l)} y1={y(a, count)} x2={x(l + 1)} y2={y(b, layers[l + 1])}
                  stroke={strength(a, b) > 0.6 ? "var(--color-lime)" : "var(--color-paper)"}
                  strokeOpacity={0.25 + strength(a, b) * 0.6}
                  strokeWidth={1 + strength(a, b) * 2.5}
                />
              )),
            ),
          )}
          {layers.map((count, l) =>
            Array.from({ length: count }).map((_, n) => (
              <circle key={`${l}-${n}`} cx={x(l)} cy={y(n, count)} r="9" fill={(l + n) % 3 === 0 ? "var(--color-lime)" : "var(--color-paper)"} stroke="#000" strokeWidth="2" />
            )),
          )}
        </svg>
      );
    }
    case "gesture":
      return (
        <div className="relative flex h-full items-center justify-center gap-4 p-6">
          <svg viewBox="0 0 140 120" className="h-[70%] w-auto" aria-hidden="true">
            <path d="M20 90 C40 30 100 30 120 90" stroke="var(--color-lime)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="1 10" />
            <path d="M34 96 C52 50 88 50 106 96" stroke="var(--color-paper)" strokeOpacity="0.5" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="1 9" />
            <rect x="46" y="72" width="48" height="34" rx="12" fill="var(--color-paper)" stroke="#000" strokeWidth="3" />
            <rect x="58" y="80" width="24" height="18" rx="4" fill="var(--color-violet)" />
          </svg>
          <div className="flex gap-2 font-display text-lg font-bold">
            {["Ctrl", "Z"].map((k) => (
              <kbd key={k} className="rounded-lg border-2 border-ink bg-paper px-3 py-2 font-display text-ink shadow-[3px_3px_0_0_var(--color-lime)]">
                {k}
              </kbd>
            ))}
          </div>
        </div>
      );
  }
}
