import { useContent } from "../content/i18n";
import { club, sponsors, sponsorship, type SponsorTier } from "../content/site";
import type { Content } from "../content/types";
import { ButtonLink } from "./ui/Button";
import { Marquee } from "./ui/Marquee";
import { Reveal } from "./ui/Reveal";

type Tier = Content["sponsors"]["tiers"][number];
type Sponsor = (typeof sponsors)[number];

/** Higher tiers get bigger cards and a slower lane; lanes alternate direction. */
const lane: Record<SponsorTier, { card: string; duration: number; reverse: boolean }> = {
  core: { card: "h-28 w-64 md:h-36 md:w-80", duration: 60, reverse: false },
  partner: { card: "h-24 w-52 md:h-28 md:w-64", duration: 50, reverse: true },
  supporter: { card: "h-20 w-44 md:h-24 md:w-52", duration: 42, reverse: false },
};

const mailto = (subject: string) => `mailto:${club.email}?subject=${encodeURIComponent(subject)}`;

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

function OpenSlot({ tier, size }: { tier: Tier; size: string }) {
  const { sponsors: s } = useContent();
  return (
    <a
      href={mailto(s.tierSubject(tier.name))}
      className={`group/slot flex flex-col items-center justify-center gap-2 rounded-2xl hatch border-2 border-dashed border-ink/45 bg-paper text-ink/70 transition-colors duration-300 hover:border-solid hover:border-ink hover:bg-lime hover:text-ink ${size}`}
    >
      <span aria-hidden="true" className="grid size-9 place-items-center rounded-full border-2 border-current font-display text-xl leading-none">
        +
      </span>
      <span className="rounded-full bg-paper px-2 font-display transition-colors group-hover/slot:bg-transparent text-base font-semibold">{s.yourLogo}</span>
      <span className="sr-only">{s.becomeTier(tier.name)}</span>
    </a>
  );
}

function SponsorLane({ tier }: { tier: Tier }) {
  const t = useContent();
  const { card, duration, reverse } = lane[tier.key];
  const list = sponsors.filter((s) => s.tier === tier.key);
  const open = Math.max(0, sponsorship.minPerTier - list.length);

  const items = [
    ...list.map((s) => ({ key: s.name, node: <SponsorCard sponsor={s} size={card} /> })),
    ...Array.from({ length: open }, (_, i) => ({ key: `open-${i}`, node: <OpenSlot tier={tier} size={card} /> })),
  ];

  return (
    <div className="border-t-2 border-ink pt-6 pb-4 md:pt-8 md:pb-6">
      <div className="container-x mb-3 flex items-center gap-3">
        <h3 className="pill border-2 border-ink bg-lime px-4 py-1.5 text-base text-ink" style={{ boxShadow: "var(--shadow-brut-sm)" }}>
          {tier.name}
        </h3>
        <p className="meta text-ink/60">{t.sponsors.count(list.length, open)}</p>
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

      <div className="container-x mt-16 md:mt-20">
        <Reveal className="relative overflow-hidden rounded-[2rem] border-2 border-ink bg-violet p-6 text-paper sm:p-10 md:rounded-[2.5rem] lg:p-14">
          <div className="grid-lines absolute inset-0" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="absolute -right-24 -bottom-24 size-80 bg-violet-deep"
            style={{ borderRadius: "46% 54% 38% 62% / 55% 44% 56% 45%" }}
          />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <h3 className="display-md">{s.cta.title}</h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/85">{s.cta.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={mailto(s.generalSubject)}>{s.cta.button}</ButtonLink>
                {sponsorship.deckUrl && (
                  <ButtonLink href={sponsorship.deckUrl} variant="glass" target="_blank" rel="noreferrer">
                    {s.cta.deck}
                  </ButtonLink>
                )}
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
              {s.tiers.map((tier) => (
                <li key={tier.key} className="glass rounded-[1.4rem] p-5">
                  <p className="font-display text-xl font-bold tracking-tight">{tier.name}</p>
                  <ul className="mt-3 grid gap-2 text-sm leading-snug text-paper/85">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex gap-2">
                        <span aria-hidden="true" className="mt-[0.4em] size-2 shrink-0 rotate-45 bg-lime" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
