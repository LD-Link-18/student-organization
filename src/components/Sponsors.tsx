import { useContent, useSite } from "../content/i18n";
import type { SiteData, SponsorTier } from "../content/site";
import type { Content } from "../content/types";
import { Marquee } from "./ui/Marquee";
import { Reveal } from "./ui/Reveal";

type Tier = Content["sponsors"]["tiers"][number];
type Sponsor = SiteData["sponsors"][number];

/** Higher tiers get bigger cards and a slower lane; lanes alternate direction. */
const lane: Record<SponsorTier, { card: string; duration: number; reverse: boolean }> = {
  diamond: { card: "h-28 w-64 md:h-36 md:w-80", duration: 60, reverse: false },
  platinum: { card: "h-24 w-56 md:h-32 md:w-72", duration: 54, reverse: true },
  gold: { card: "h-24 w-52 md:h-28 md:w-64", duration: 48, reverse: false },
  silver: { card: "h-20 w-44 md:h-24 md:w-52", duration: 42, reverse: true },
};

function SponsorCard({ sponsor, size }: { sponsor: Sponsor; size: string }) {
  const t = useContent();
  return (
    <a
      href={sponsor.href}
      target="_blank"
      rel="noreferrer"
      className={`lift group/card flex items-center justify-center rounded-2xl border-2 border-ink bg-paper p-5 md:p-6 ${size}`}
    >
      {sponsor.logo ? (
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="h-full w-full object-contain grayscale transition duration-300 group-hover/card:grayscale-0"
        />
      ) : (
        <span className="text-center font-display text-2xl leading-tight font-bold tracking-tight">{sponsor.name}</span>
      )}
      <span className="sr-only">{t.common.newTab}</span>
    </a>
  );
}

/** Static placeholder for an unfilled sponsor spot (not a link). */
function OpenSlot({ size }: { size: string }) {
  const { sponsors: s } = useContent();
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl hatch border-2 border-dashed border-ink/45 bg-paper text-ink/70 ${size}`}
    >
      <span aria-hidden="true" className="grid size-9 place-items-center rounded-full border-2 border-current font-display text-xl leading-none">
        +
      </span>
      <span className="rounded-full bg-paper px-2 font-display text-base font-semibold">{s.yourLogo}</span>
    </div>
  );
}

function SponsorLane({ tier }: { tier: Tier }) {
  const { sponsors, sponsorship } = useSite();
  const { card, duration, reverse } = lane[tier.key];
  const list = sponsors.filter((s) => s.tier === tier.key);
  const open = Math.max(0, sponsorship.minPerTier - list.length);

  const items = [
    ...list.map((s) => ({ key: s.name, node: <SponsorCard sponsor={s} size={card} /> })),
    ...Array.from({ length: open }, (_, i) => ({ key: `open-${i}`, node: <OpenSlot size={card} /> })),
  ];

  return (
    <div className="border-t-2 border-ink pt-6 pb-4 md:pt-8 md:pb-6">
      <div className="container-x mb-3 flex items-center gap-3">
        <h3 className="pill border-2 border-ink bg-lime px-4 py-1.5 text-base text-ink" style={{ boxShadow: "var(--shadow-brut-sm)" }}>
          {tier.name}
        </h3>
      </div>
      <Marquee
        items={items}
        itemClassName="pt-2 pr-4 pb-3 md:pr-6"
        duration={duration}
        reverse={reverse}
        minItems={8}
        pauseOnHover
        wrapWhenStill
        className="motion-safe:[mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)] motion-reduce:px-4 sm:motion-reduce:px-6 lg:motion-reduce:px-10"
      />
    </div>
  );
}

export function Sponsors() {
  const { sponsors: s } = useContent();
  return (
    <section id="sponsors" aria-labelledby="sponsors-title" className="section-y relative overflow-hidden bg-paper">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <Reveal as="h2" id="sponsors-title" className="display-lg lg:col-span-7">
            {s.title}
            <span className="text-violet">.</span>
          </Reveal>
          <Reveal as="p" i={1} className="max-w-md text-lg leading-relaxed text-ink/75 lg:col-span-5 lg:pb-3">
            {s.intro}
          </Reveal>
        </div>
      </div>

      <div className="mt-12 border-b-2 border-ink md:mt-16">
        {s.tiers.map((tier) => (
          <SponsorLane key={tier.key} tier={tier} />
        ))}
      </div>

    </section>
  );
}
