import { useContent, useResolveLink } from "../content/i18n";
import { club, discordHref } from "../content/site";
import { ButtonLink } from "./ui/Button";
import { ClubMark } from "./ui/ClubMark";
import { Reveal } from "./ui/Reveal";
import { Sticker } from "./ui/Sticker";

/** Glass membership card — the thing you get for showing up. */
function MemberCard() {
  const t = useContent();
  return (
    <div className="glass w-72 rounded-[1.6rem] p-5 text-paper sm:w-80">
      <div className="flex items-start justify-between">
        <span className="font-display text-sm font-semibold">{t.club.name}</span>
        <span className="size-8 rounded-full bg-lime ring-2 ring-ink" aria-hidden="true" />
      </div>
      <div className="mt-10 font-display text-3xl leading-none font-bold tracking-tight">{t.join.memberName}</div>
      <div className="mt-2 flex items-center justify-between font-display text-sm text-paper/80">
        <span>{t.join.memberSince}</span>
        <span>#181</span>
      </div>
      <div className="mt-5 flex h-8 items-end gap-[3px]" aria-hidden="true">
        {Array.from({ length: 34 }).map((_, i) => (
          <span key={i} className="flex-1 bg-paper/80" style={{ height: `${40 + ((i * 37) % 60)}%` }} />
        ))}
      </div>
    </div>
  );
}

export function JoinSection() {
  const { join } = useContent();
  const discord = useResolveLink()(discordHref, "discord");

  return (
    <section id="join" aria-labelledby="join-title" className="relative isolate overflow-hidden bg-lime py-24 text-ink md:py-36">
      <div className="grid-lines grid-lines-dark absolute inset-0 -z-10" aria-hidden="true" />
      {/* violet slab + glass membership card */}
      <div
        aria-hidden="true"
        className="absolute top-[-8rem] right-[-6rem] -z-10 hidden size-[34rem] rotate-12 bg-violet xl:block"
        style={{ borderRadius: "46% 54% 38% 62% / 55% 44% 56% 45%" }}
      />
      <div aria-hidden="true" className="absolute top-24 right-20 hidden rotate-6 xl:block 2xl:right-36">
        <div className="animate-float">
          <MemberCard />
        </div>
      </div>

      <div className="container-x relative">
        <h2 id="join-title" className="display-xl">
          <Reveal as="span" className="block">
            {join.words[0]}
          </Reveal>
          <Reveal as="span" i={1} className="block pl-[0.12em] italic md:pl-[0.4em]">
            <span className="text-outline">{join.words[1]}</span>
          </Reveal>
          <Reveal as="span" i={2} className="block text-violet">
            {join.words[2]}
          </Reveal>
        </h2>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6">
            <p className="max-w-lg text-xl leading-relaxed font-medium">{join.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={club.joinUrl} variant="violet" size="lg">
                {join.primary}
              </ButtonLink>
              <ButtonLink href={discord} variant="paper" size="lg">
                {join.secondary}
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div className="absolute top-[24rem] left-[52rem] hidden xl:block">
          <Sticker text={join.sticker} tone="bg-violet text-paper" className="size-28 sm:size-36">
            <ClubMark className="w-full text-lime" />
          </Sticker>
        </div>
      </div>
    </section>
  );
}
