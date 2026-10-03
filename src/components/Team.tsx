import { useContent } from "../content/i18n";
import { club } from "../content/site";
import { MemberCard } from "./MemberCard";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

/** Per-card tilt + offset. Offsets make a wave: middle column at md (3 cols), every other card at xl (6 cols). */
const tilt = [
  "-rotate-2",
  "rotate-[1.5deg] md:translate-y-8",
  "-rotate-1",
  "rotate-2 xl:translate-y-8",
  "-rotate-[1.5deg] md:translate-y-8 xl:translate-y-0",
  "rotate-1 xl:translate-y-8",
];

export function Team() {
  const { team } = useContent();
  return (
    <section id="team" aria-labelledby="team-title" className="section-y relative overflow-hidden bg-fog">
      <div className="grid-lines grid-lines-dark absolute inset-0" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <Reveal as="h2" id="team-title" className="display-lg lg:col-span-8">
            {team.title[0]}
            <br />
            <span className="text-violet italic">{team.title[1]}</span>
          </Reveal>
          <Reveal as="p" i={1} className="max-w-md text-lg leading-relaxed text-ink/75 lg:col-span-4 lg:pb-3">
            {team.intro}
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-6 md:mt-20 md:grid-cols-3 md:gap-8 md:pb-8 xl:grid-cols-6 xl:gap-6">
          {team.people.map((m, i) => (
            <Reveal as="li" key={m.name} i={i} className={`hover:rotate-0 ${tilt[i % tilt.length]}`}>
              <MemberCard name={m.name} avatar={m.avatar} role={m.role} note={team.focus(m.focus)} href={m.href} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12 lg:mt-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border-2 border-dashed border-ink p-6 sm:p-8 md:flex-row md:items-center">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex -space-x-3" aria-hidden="true">
                {["bg-violet", "bg-lime", "bg-paper", "bg-ink"].map((c) => (
                  <span key={c} className={`size-11 rounded-full border-2 border-ink ${c}`} />
                ))}
              </div>
              <p className="font-display text-2xl leading-tight font-bold tracking-tight md:text-3xl">
                {team.members}
              </p>
            </div>
            <ButtonLink href={club.joinUrl} variant="violet">
              {team.takeSeat}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
