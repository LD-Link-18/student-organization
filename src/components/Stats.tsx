import { useContent } from "../content/i18n";
import { Reveal } from "./ui/Reveal";

/** Each stat gets its own surface so the row reads as a collage, not a template. */
const looks = [
  { card: "border-2 border-ink bg-lime text-ink -rotate-2", shadow: "var(--shadow-brut)", num: "text-ink", label: "text-ink/80" },
  { card: "glass text-paper lg:translate-y-8", shadow: undefined, num: "text-lime", label: "text-paper/80" },
  { card: "border-2 border-ink bg-paper text-ink rotate-[1.5deg]", shadow: "var(--shadow-brut)", num: "text-violet", label: "text-ink/75" },
  { card: "glass text-paper lg:-translate-y-4", shadow: undefined, num: "text-paper", label: "text-paper/80" },
];

export function Stats() {
  const { stats } = useContent();
  return (
    <div className="relative overflow-hidden rounded-[2.25rem] bg-violet p-4 sm:p-8 md:rounded-[3rem] md:p-12">
      <div className="grid-lines absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-10 hidden size-56 bg-lime lg:block"
        style={{ borderRadius: "41% 59% 43% 57% / 58% 38% 62% 42%" }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 left-[22%] size-64 rounded-full border-[28px] border-violet-deep"
      />
      <dl className="relative grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 lg:py-6">
        {stats.map((s, i) => {
          const look = looks[i % looks.length];
          return (
            <Reveal
              key={s.label}
              i={i}
              className={`flex h-full flex-col justify-between gap-6 rounded-[1.5rem] p-4 transition-[rotate] duration-300 hover:rotate-0 sm:p-6 ${look.card}`}
              style={{ boxShadow: look.shadow }}
            >
              <dt className={`order-2 text-sm leading-snug font-medium sm:text-base ${look.label}`}>{s.label}</dt>
              <dd className={`order-1 font-display text-[clamp(2.75rem,7vw,5rem)] leading-none font-bold tracking-[-0.05em] ${look.num}`}>
                {s.value}
              </dd>
            </Reveal>
          );
        })}
      </dl>
    </div>
  );
}
