/**
 * Floating "instrument panels" in the hero — tiny fake UIs that show
 * what an intelligent system does: see something, learn something.
 * Purely decorative (aria-hidden on the parent).
 */

export function VisionCard() {
  return (
    <div className="glass w-full rounded-[1.6rem] p-3 text-paper">
      <div className="flex items-center justify-between px-1 pb-2.5 font-display text-[0.7rem] font-medium">
        <span>cam_01 / courtyard</span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 animate-pulse rounded-full bg-lime" />
          live
        </span>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-violet-night/70">
        <div className="dot-grid absolute inset-0 text-paper/15" />
        {/* horizon */}
        <div className="absolute inset-x-0 bottom-[28%] h-px bg-paper/25" />
        {/* person */}
        <div className="absolute bottom-[22%] left-[20%] flex w-[20%] flex-col items-center gap-[6%]">
          <div className="aspect-square w-[55%] rounded-full bg-paper" />
          <div className="aspect-[3/4] w-full rounded-t-[40%] rounded-b-md bg-paper" />
        </div>
        {/* robot */}
        <div className="absolute right-[14%] bottom-[20%] w-[28%]">
          <div className="mx-auto mb-[6%] h-[10px] w-[3px] bg-fog" />
          <div className="aspect-[5/3] w-full rounded-md bg-fog" />
          <div className="mt-[4%] flex justify-between px-[8%]">
            <div className="aspect-square w-[28%] rounded-full bg-ink ring-2 ring-fog" />
            <div className="aspect-square w-[28%] rounded-full bg-ink ring-2 ring-fog" />
          </div>
        </div>
        {/* detections */}
        <div className="absolute bottom-[18%] left-[14%] h-[66%] w-[32%] rounded-sm border-2 border-lime">
          <span className="absolute -top-[2px] left-[-2px] -translate-y-full rounded-t-sm bg-lime px-1.5 py-0.5 font-display text-[0.62rem] font-bold whitespace-nowrap text-ink">
            person 0.97
          </span>
        </div>
        <div className="absolute right-[9%] bottom-[14%] h-[44%] w-[38%] rounded-sm border-2 border-dashed border-paper/80">
          <span className="absolute -top-[2px] right-[-2px] -translate-y-full rounded-t-sm bg-paper px-1.5 py-0.5 font-display text-[0.62rem] font-bold whitespace-nowrap text-ink">
            rover 0.88
          </span>
        </div>
      </div>
    </div>
  );
}

const lossPoints = [
  [0, 8], [8, 34], [16, 52], [24, 60], [32, 71], [40, 74], [48, 81], [56, 83],
  [64, 86], [72, 88], [80, 89], [88, 91], [96, 91.5], [104, 92.5], [112, 93], [120, 93.5],
];

export function LossCard() {
  const line = lossPoints.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <div className="glass w-full rounded-[1.4rem] p-4 text-paper">
      <div className="flex items-baseline justify-between font-display">
        <span className="text-[0.7rem] font-medium text-paper/75">train / loss</span>
        <span className="text-[0.7rem] font-medium text-paper/75">epoch 42</span>
      </div>
      <div className="mt-1 font-display text-3xl font-bold tracking-tight">0.031</div>
      <svg viewBox="0 0 120 100" preserveAspectRatio="none" className="mt-2 h-16 w-full overflow-visible">
        <polyline points={`0,100 ${line} 120,100`} fill="rgb(183 233 10 / 0.16)" stroke="none" />
        <polyline points={line} fill="none" stroke="var(--color-lime)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <div className="mt-2 flex gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i < 10 ? "bg-lime" : "bg-paper/25"}`} />
        ))}
      </div>
    </div>
  );
}
