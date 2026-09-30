import { useContent } from "../content/i18n";
import { club } from "../content/site";
import { Avatar } from "./Avatar";
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

/** First and last name initials: "Samet Mert Dik" → "SD". */
const initialsOf = (name: string) => {
  const words = name.trim().split(/\s+/);
  return words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0][0];
};

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
              <article className="card-brut lift group h-full rounded-[1.25rem] p-2 sm:rounded-[1.75rem] sm:p-3">
                <Avatar variant={m.avatar} initials={initialsOf(m.name)} />
                <div className="px-1 pt-4 pb-2 sm:px-2 sm:pt-5 sm:pb-3">
                  {m.role && (
                    <p className="pill mb-3 border-ink bg-lime leading-tight whitespace-normal text-xs sm:text-[0.8125rem]">{m.role}</p>
                  )}
                  <h3 className="text-lg leading-tight font-bold tracking-tight sm:text-2xl xl:text-xl">{m.name}</h3>
                  <p className="mt-1 text-sm text-ink/70 sm:text-base">{team.focus(m.focus)}</p>
                </div>
              </article>
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
            <a href={club.joinUrl} className="btn btn-violet">
              {team.takeSeat}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
