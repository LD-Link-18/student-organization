import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = {
  as?: ElementType;
  /** Stagger index — multiplies the transition delay. */
  i?: number;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>;

/** Fades content up the first time it enters the viewport. No-op with reduced motion. */
export function Reveal({ as: Tag = "div", i = 0, className = "", children, style, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--i": i, ...(style as object) }} {...rest}>
      {children}
    </Tag>
  );
}
