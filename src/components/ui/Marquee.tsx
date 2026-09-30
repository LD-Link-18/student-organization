import type { CSSProperties, ReactNode } from "react";

type Props = {
  items: { key: string; node: ReactNode }[];
  className?: string;
  /** Classes for each item. Use padding (not gap) for spacing so the loop stays seamless. */
  itemClassName?: string;
  reverse?: boolean;
  /** Seconds for one full loop. */
  duration?: number;
  /** Repeat short lists until one copy has at least this many items, so they still fill wide screens. */
  minItems?: number;
  /** Pause while hovered or while something inside has keyboard focus. */
  pauseOnHover?: boolean;
  /** With reduced motion, show the list once as a wrapping row instead of a clipped strip. */
  wrapWhenStill?: boolean;
};

/**
 * Infinite horizontal ticker. The list is rendered twice and shifted by -50%.
 * Everything except the first pass is aria-hidden and inert, so screen readers
 * and keyboard users meet each item exactly once.
 */
export function Marquee({
  items,
  className = "",
  itemClassName = "",
  reverse = false,
  duration = 38,
  minItems = 0,
  pauseOnHover = false,
  wrapWhenStill = false,
}: Props) {
  const repeats = Math.max(1, Math.ceil(minItems / Math.max(items.length, 1)));

  const pass = (half: number) =>
    Array.from({ length: repeats }).flatMap((_, r) =>
      items.map((item) => {
        const copy = half > 0 || r > 0;
        return (
          <li
            key={`${half}-${r}-${item.key}`}
            className={`${itemClassName} ${copy && wrapWhenStill ? "motion-reduce:hidden" : ""}`}
            aria-hidden={copy || undefined}
            inert={copy || undefined}
          >
            {item.node}
          </li>
        );
      }),
    );

  return (
    <div className={`group/marquee overflow-hidden ${className}`}>
      <ul
        className={`flex w-max animate-marquee motion-reduce:animate-none ${
          wrapWhenStill ? "motion-reduce:w-auto motion-reduce:flex-wrap" : ""
        } ${
          pauseOnHover
            ? "group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused]"
            : ""
        }`}
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" } as CSSProperties}
      >
        {pass(0)}
        {pass(1)}
      </ul>
    </div>
  );
}
