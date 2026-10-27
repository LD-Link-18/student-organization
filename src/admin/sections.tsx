import { useId, useState, type ReactNode } from "react";
import { projectHref, projectsPath, sponsorTiers, type SiteData } from "../content/site";
import type { EditableContent } from "../content/schema";
import { BiNumber, BiStrings, BiText, Group, inputClass, List, Select, Subhead, Text, Toggle, useDraft, useField } from "./fields";
import type { Draft } from "./draft";
import { ASSET_BUCKET, supabase } from "./supabase";

/** One sidebar entry: which top-level fields it edits (for the error counts), its form, and where "Preview" opens. */
export interface Section {
  id: string;
  title: string;
  content: (keyof EditableContent)[];
  site: (keyof SiteData)[];
  Form: () => ReactNode;
  /** Turkish page (and section anchor) that shows this part of the site. */
  preview: (draft: Draft) => string;
}

/** A Turkish page with the draft instead of the saved content (see `inPreview` in content/load.ts). */
export const previewUrl = (path: string) => {
  const [page, hash] = path.split("#");
  return `${page}?preview${hash ? `#${hash}` : ""}`;
};

const statusOptions = [
  { value: "done", label: "Completed" },
  { value: "progress", label: "In progress" },
  { value: "prototype", label: "Prototype" },
] as const;
const visualOptions = [
  { value: "koubot", label: "Chat bubbles (KOUBOT)" },
  { value: "scribble", label: "Handwriting (ScribbleMind)" },
  { value: "traffic", label: "Roads and cars (Traffic Simulation)" },
  { value: "quill", label: "Book (Quill)" },
] as const;
const areaOptions = [
  { value: "ai", label: "Artificial intelligence" },
  { value: "ml", label: "Machine learning" },
  { value: "robotics", label: "Robotics" },
  { value: "vision", label: "Computer vision" },
  { value: "embedded", label: "Embedded systems" },
  { value: "automation", label: "Automation" },
] as const;
const avatarOptions = [0, 1, 2, 3, 4, 5].map((v) => ({ value: v, label: `Pattern ${v + 1}` }));
const tierLabels: Record<(typeof sponsorTiers)[number], string> = { core: "Core sponsor", partner: "Partner", supporter: "Supporter" };
const tierOptions = sponsorTiers.map((t) => ({ value: t, label: tierLabels[t] }));

const linkHint = "Starts with https:// (or / for a page on this site).";

function TwoLines({ path, label, hint, names = ["Line 1", "Line 2"] }: { path: (string | number)[]; label: string; hint?: string; names?: string[] }) {
  return (
    <div className="grid gap-3">
      {names.map((n, i) => (
        <BiText key={n} path={[...path, i]} label={`${label}: ${n.toLowerCase()}`} hint={i === 0 ? hint : undefined} />
      ))}
    </div>
  );
}

/** "Source code" button: hidden, pointing at the coming-soon page, or a real link. */
function RepoField({ path }: { path: (string | number)[] }) {
  const { value, set } = useField<string | undefined>("both", path);
  const [mode, setMode] = useState(value === undefined ? "hidden" : value === "" ? "soon" : "link");
  const id = useId();
  return (
    <div className="grid gap-3">
      <div>
        <label htmlFor={id} className="mb-1.5 block font-display text-[15px] font-semibold tracking-tight">
          Source code button
        </label>
        <select
          id={id}
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            set(e.target.value === "hidden" ? undefined : "");
          }}
          className={inputClass()}
        >
          <option value="hidden">Hidden</option>
          <option value="soon">Shown, links to the coming-soon page</option>
          <option value="link">Shown, links to the repository</option>
        </select>
      </div>
      {mode === "link" && <Text scope="both" path={path} label="Repository address" hint={`${linkHint} Empty: coming-soon page.`} />}
    </div>
  );
}

function ClubForm() {
  return (
    <>
      <Group title="Club">
        <BiText
          path={["club", "name"]}
          label="Club name"
          hint="Used in the footer and project page titles. Other texts that mention it (logo labels, 404 title, about text …) are edited separately."
        />
        <TwoLines path={["club", "wordmark"]} label="Logo wordmark" hint="The two lines next to the logo." />
        <BiText path={["club", "university"]} label="University" />
        <BiText path={["club", "semester"]} label="Semester" hint="Not inserted into other texts automatically: update the ones that mention it too." />
      </Group>
      <Group title="Links">
        <Text scope="site" path={["club", "joinUrl"]} label="Membership form" hint={`Every "Join the club" button. ${linkHint}`} />
        <Text scope="site" path={["club", "projectUrl"]} label="Project proposal form" hint={`The "Pitch a project" buttons. ${linkHint}`} />
        <Text scope="site" path={["club", "email"]} label="Contact email" />
        <List scope="site" path={["club", "socials"]} label="Social channels" hint="Leave a channel empty and its links go to the coming-soon page." itemTitle={useSocialTitle()} fixed>
          {(i) => <Text scope="site" path={["club", "socials", i, "href"]} label="Address" hint={linkHint} />}
        </List>
        <Text scope="site" path={["discordHref"]} label="Discord invite (event RSVPs)" hint="Empty: RSVP buttons go to the coming-soon page." />
      </Group>
    </>
  );
}

function useSocialTitle() {
  const site = useDraft().site;
  return (i: number) => site.club.socials[i]?.label ?? "";
}

function HeroForm() {
  return (
    <>
      <Group title="Hero" hint="The first screen of the homepage.">
        <BiText path={["hero", "intakeOpen"]} label="Badge above the headline" />
        <BiText path={["hero", "tagline"]} label="Tagline" />
        <TwoLines path={["hero", "words"]} label="Headline" names={["Word 1", "Word 2", "Word 3 (on the lime block)"]} />
        <TwoLines path={["hero", "notes"]} label="Notes next to the headline" names={["Note 1", "Note 2"]} hint="Wide screens only." />
        <BiNumber path={["hero", "scale"]} label="Headline size" hint="1 = normal. Lower it (e.g. 0.8) if the words are long and wrap." />
        <BiText path={["hero", "intro"]} label="Intro" multiline />
        <BiText path={["hero", "primaryCta"]} label="Main button" />
        <BiText path={["hero", "secondaryCta"]} label="Second button" />
        <BiText path={["hero", "chips", "robotics"]} label="Chip: robotics" />
        <BiText path={["hero", "chips", "ml"]} label="Chip: machine learning" />
        <BiText path={["hero", "chips", "ai"]} label="Chip: AI" />
        <BiText path={["hero", "chips", "automation"]} label="Chip: automation" />
        <BiText path={["hero", "sticker"]} label="Rotating sticker text" hint='Ends with " / " so the circle joins up.' />
      </Group>
      <Group title="Lime tape" hint="Scrolls under the hero: every area title, then these.">
        <BiStrings path={["tapeExtras"]} label="Extra items" />
      </Group>
    </>
  );
}

function AboutForm() {
  const draft = useDraft();
  return (
    <>
      <Group title="About">
        <TwoLines path={["about", "title"]} label="Heading" />
        <BiText path={["about", "body"]} label="Text" multiline />
        <BiStrings path={["about", "principles"]} label="Principles" />
      </Group>
      <Group title="Stats" hint="The numbers row (currently hidden on the site).">
        <List path={["stats"]} label="Numbers" itemTitle={(i) => draft.tr.stats[i]?.value} newItem={() => ({ value: "", label: "" })} addLabel="Add number">
          {(i) => (
            <>
              <BiText path={["stats", i, "value"]} label="Number" placeholder="180+" />
              <BiText path={["stats", i, "label"]} label="Label" />
            </>
          )}
        </List>
      </Group>
    </>
  );
}

function AreasForm() {
  const draft = useDraft();
  return (
    <Group title="Areas">
      <BiText path={["areas", "title"]} label="Heading" />
      <BiText path={["areas", "intro"]} label="Intro" multiline />
      <BiText path={["areas", "toolsLabel"]} label='"Tools" label' />
      <List
        path={["areas", "items"]}
        label="Areas"
        itemTitle={(i) => draft.tr.areas.items[i]?.title}
        newItem={() => ({ key: "ai", title: "", blurb: "", tools: [] })}
        addLabel="Add area"
        collapsed
      >
        {(i) => (
          <>
            <Select scope="both" path={["areas", "items", i, "key"]} label="Icon" options={areaOptions} hint="Each icon can be used once." />
            <BiText path={["areas", "items", i, "title"]} label="Title" />
            <BiText path={["areas", "items", i, "blurb"]} label="Text" multiline />
            <BiStrings path={["areas", "items", i, "tools"]} label="Tools" />
          </>
        )}
      </List>
    </Group>
  );
}

function ProjectsForm() {
  const draft = useDraft();
  const items = (i: number) => ["projects", "items", i];
  return (
    <>
      <Group title="Projects section">
        <TwoLines path={["projects", "title"]} label="Heading" />
        <BiText path={["projects", "intro"]} label="Intro" multiline />
        <BiText path={["projects", "pitch"]} label='"Pitch a project" button' />
        <BiText path={["projects", "view"]} label="Card link label" />
        <BiText path={["projects", "stackLabel"]} label='"Built with" label' />
        <BiText path={["projects", "statusLabel"]} label='"Status" label (screen readers)' />
        <BiText path={["projects", "status", "done"]} label="Status: completed" />
        <BiText path={["projects", "status", "progress"]} label="Status: in progress" />
        <BiText path={["projects", "status", "prototype"]} label="Status: prototype" />
      </Group>
      <Group title="Projects" hint="Each project has a card on the homepage and its own page. Click a project to edit both.">
        <List
          path={["projects", "items"]}
          label="Projects"
          itemTitle={(i) => draft.tr.projects.items[i]?.name}
          newItem={() => ({
            slug: "new-project",
            name: "",
            category: "",
            status: "progress",
            description: "",
            stack: [],
            visual: "koubot",
            started: "",
            overview: "",
            highlights: [],
            sections: [],
            timeline: [],
            team: [],
          })}
          addLabel="Add project"
          collapsed
        >
          {(i) => {
            const p = (scope: "tr" | "en") => draft[scope].projects.items[i];
            return (
              <>
                <Subhead hint="Shown on the homepage and the project list. Name, category, status, cover and stack also head the project's own page.">
                  Homepage card
                </Subhead>
                <BiText path={[...items(i), "name"]} label="Name" />
                <BiText path={[...items(i), "category"]} label="Category" />
                <Select scope="both" path={[...items(i), "status"]} label="Status" options={statusOptions} />
                <Select scope="both" path={[...items(i), "visual"]} label="Cover drawing" options={visualOptions} />
                <BiText path={[...items(i), "description"]} label="Card text" hint="One or two sentences for the homepage card." multiline />
                <BiStrings path={[...items(i), "stack"]} label="Built with" />

                <Subhead
                  hint={
                    <>
                      The project's own page:{" "}
                      {(["tr", "en"] as const).map((l, k) => (
                        <span key={l}>
                          {k > 0 && " · "}
                          <a
                            href={previewUrl(projectHref(l, p("tr")?.slug ?? ""))}
                            target="site-preview"
                            className="font-semibold text-violet underline"
                          >
                            {projectHref(l, p("tr")?.slug ?? "")}
                          </a>
                        </span>
                      ))}{" "}
                      (preview with your unsaved changes).
                    </>
                  }
                >
                  Project page
                </Subhead>
                <Text
                  scope="both"
                  path={[...items(i), "slug"]}
                  label="Address (slug)"
                  hint="The last part of the page address. Changing it breaks links shared earlier."
                />
                <BiText path={[...items(i), "started"]} label="Started" placeholder="Eylül 2025 / September 2025" />
                <BiText path={[...items(i), "overview"]} label="Page intro" multiline />
                <List
                  path={[...items(i), "highlights"]}
                  label="Highlights (up to 4)"
                  itemTitle={(j) => p("tr")?.highlights[j]?.value}
                  newItem={() => ({ value: "", label: "" })}
                  addLabel="Add highlight"
                >
                  {(j) => (
                    <>
                      <BiText path={[...items(i), "highlights", j, "value"]} label="Number or word" />
                      <BiText path={[...items(i), "highlights", j, "label"]} label="Label" />
                    </>
                  )}
                </List>
                <List
                  path={[...items(i), "sections"]}
                  label="Story blocks"
                  hint="e.g. The problem / How it works / What's next."
                  itemTitle={(j) => p("tr")?.sections[j]?.title}
                  newItem={() => ({ title: "", body: "" })}
                  addLabel="Add block"
                >
                  {(j) => (
                    <>
                      <BiText path={[...items(i), "sections", j, "title"]} label="Title" />
                      <BiText path={[...items(i), "sections", j, "body"]} label="Text" multiline />
                    </>
                  )}
                </List>
                <List
                  path={[...items(i), "timeline"]}
                  label="Timeline"
                  hint="Oldest first; the last one is highlighted."
                  itemTitle={(j) => p("tr")?.timeline[j]?.date}
                  newItem={() => ({ date: "", text: "" })}
                  addLabel="Add milestone"
                >
                  {(j) => (
                    <>
                      <BiText path={[...items(i), "timeline", j, "date"]} label="Date" />
                      <BiText path={[...items(i), "timeline", j, "text"]} label="What happened" />
                    </>
                  )}
                </List>
                <List
                  path={[...items(i), "team"]}
                  label="Project team"
                  hint="Members who are also on the club team get their avatar and link automatically."
                  itemTitle={(j) => p("tr")?.team?.[j]?.name ?? ""}
                  newItem={() => ({ name: "" })}
                  addLabel="Add member"
                >
                  {(j) => (
                    <>
                      <Text scope="both" path={[...items(i), "team", j, "name"]} label="Name" />
                      <BiText path={[...items(i), "team", j, "role"]} label="Role (optional)" optional />
                      <Text scope="both" path={[...items(i), "team", j, "href"]} label="Link (optional)" hint="Only for people not on the club team." optional />
                    </>
                  )}
                </List>
                <RepoField path={[...items(i), "repo"]} />
                <Text scope="both" path={[...items(i), "demo"]} label="Live demo (optional)" hint="Empty: no demo button." optional />
              </>
            );
          }}
        </List>
      </Group>
    </>
  );
}

function ProjectPageForm() {
  return (
    <Group title="Project page labels" hint="Headings and buttons shared by every project page. Each project's own content is under Projects.">
      <BiText path={["projectPage", "home"]} label="Breadcrumb: home" />
      <BiText path={["projectPage", "breadcrumb"]} label="Breadcrumb: projects" />
      <BiText path={["projectPage", "listDocTitle"]} label="Browser tab title of the project list" />
      <BiText path={["projectPage", "started"]} label='"Started" label' />
      <BiText path={["projectPage", "statusLabel"]} label='"Status" label' />
      <BiText path={["projectPage", "repo"]} label="Source code button" />
      <BiText path={["projectPage", "demo"]} label="Live demo button" />
      <BiText path={["projectPage", "highlights"]} label='"Highlights" heading' />
      <BiText path={["projectPage", "stack"]} label='"Built with" heading' />
      <BiText path={["projectPage", "timeline"]} label='"Timeline" heading' />
      <BiText path={["projectPage", "team"]} label='"Team" heading' />
      <BiText path={["projectPage", "join", "title"]} label="Join box: title" />
      <BiText path={["projectPage", "join", "body"]} label="Join box: text" multiline />
      <BiText path={["projectPage", "join", "cta"]} label="Join box: main button" />
      <BiText path={["projectPage", "join", "pitch"]} label="Join box: second button" />
      <BiText path={["projectPage", "next"]} label='"Next project" label' />
    </Group>
  );
}

function EventsForm() {
  const draft = useDraft();
  return (
    <Group title="Events">
      <BiText path={["events", "title"]} label="Heading" />
      <BiText path={["events", "calendar"]} label="Calendar label" />
      <BiText path={["events", "nextUp"]} label='"Next up" badge' />
      <BiText path={["events", "rsvp"]} label="RSVP button" />
      <BiText path={["events", "rsvpClosed"]} label="Closed RSVP note (screen readers)" hint="Starts with a space." />
      <List
        path={["events", "items"]}
        label="Events"
        hint="Listed in this order; the first one is marked as next up."
        itemTitle={(i) => draft.tr.events.items[i]?.title}
        newItem={() => ({ day: "", month: "", title: "", category: "", description: "", place: "" })}
        addLabel="Add event"
      >
        {(i) => (
          <>
            <BiText path={["events", "items", i, "title"]} label="Title" />
            <BiText path={["events", "items", i, "day"]} label="Day" hint='One day ("14") or a range ("13–15", with an en dash).' />
            <BiText path={["events", "items", i, "month"]} label="Month" placeholder="Eki / Oct" />
            <BiText path={["events", "items", i, "category"]} label="Category" />
            <BiText path={["events", "items", i, "place"]} label="Place" />
            <BiText path={["events", "items", i, "description"]} label="Description" multiline />
            <Toggle scope="both" path={["events", "items", i, "rsvpOpen"]} label="RSVP open" hint="Off: the button is shown disabled." />
          </>
        )}
      </List>
    </Group>
  );
}

function TeamForm() {
  const draft = useDraft();
  return (
    <Group title="Team">
      <TwoLines path={["team", "title"]} label="Heading" />
      <BiText path={["team", "intro"]} label="Intro" multiline />
      <BiText path={["team", "members"]} label="Members line" />
      <BiText path={["team", "takeSeat"]} label="Join button" />
      <List
        path={["team", "people"]}
        label="People"
        itemTitle={(i) => draft.tr.team.people[i]?.name}
        newItem={() => ({ name: "", focus: "", avatar: 0 })}
        addLabel="Add person"
      >
        {(i) => (
          <>
            <Text scope="both" path={["team", "people", i, "name"]} label="Name" />
            <BiText path={["team", "people", i, "focus"]} label="Focus" hint='Shown as "Focus: …".' />
            <BiText path={["team", "people", i, "role"]} label="Role (optional)" optional />
            <Select scope="both" path={["team", "people", i, "avatar"]} label="Avatar" options={avatarOptions} />
            <Text scope="both" path={["team", "people", i, "href"]} label="Link (optional)" hint="LinkedIn, personal site … The card opens it." optional />
          </>
        )}
      </List>
    </Group>
  );
}

/** Uploads an image to Supabase Storage and stores its public address. */
function LogoField({ i }: { i: number }) {
  const { set } = useField<string | undefined>("site", ["sponsors", i, "logo"]);
  const [status, setStatus] = useState("");
  async function upload(file: File) {
    if (!supabase) return;
    setStatus("Uploading…");
    const name = `sponsors/${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
    const { error } = await supabase.storage.from(ASSET_BUCKET).upload(name, file, { contentType: file.type });
    if (error) return setStatus(`Upload failed: ${error.message}`);
    set(supabase.storage.from(ASSET_BUCKET).getPublicUrl(name).data.publicUrl);
    setStatus("Uploaded. Save to publish it.");
  }
  return (
    <div className="grid gap-2">
      <Text scope="site" path={["sponsors", i, "logo"]} label="Logo (optional)" hint="Upload an image, or paste its address. Without a logo the name is shown." optional />
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/svg+xml,image/png,image/jpeg,image/webp"
          aria-label="Upload logo"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          className="text-sm file:mr-3 file:rounded-full file:border-2 file:border-ink file:bg-paper file:px-3 file:py-1 file:font-semibold"
        />
        {status && <span className="text-sm text-ink/70">{status}</span>}
      </div>
    </div>
  );
}

function SponsorsForm() {
  const draft = useDraft();
  return (
    <>
      <Group title="Sponsors section">
        <Toggle scope="site" path={["showSponsors"]} label="Show the sponsors section" hint="Also adds it to the menus." />
        <BiText path={["sponsors", "title"]} label="Heading" />
        <BiText path={["sponsors", "intro"]} label="Intro" multiline />
        <BiText path={["sponsors", "yourLogo"]} label="Empty slot label" />
        <Text scope="site" path={["sponsorship", "deckUrl"]} label="Sponsorship deck (PDF link)" hint="Empty: the button is hidden." />
        <BiText path={["sponsors", "cta", "deck"]} label="Deck button" />
        <BiText path={["sponsors", "cta", "title"]} label="Call-out: title" />
        <BiText path={["sponsors", "cta", "body"]} label="Call-out: text" multiline />
      </Group>
      <Group title="Tiers">
        <List path={["sponsors", "tiers"]} label="Tiers" itemTitle={(i) => draft.tr.sponsors.tiers[i]?.name} fixed>
          {(i) => (
            <>
              <BiText path={["sponsors", "tiers", i, "name"]} label="Name" />
              <BiStrings path={["sponsors", "tiers", i, "perks"]} label="Perks" />
            </>
          )}
        </List>
      </Group>
      <Group title="Sponsors">
        <List
          scope="site"
          path={["sponsors"]}
          label="Sponsors"
          hint="Each tier is filled up with empty slots to the minimum below."
          itemTitle={(i) => draft.site.sponsors[i]?.name}
          newItem={() => ({ name: "", tier: "core", href: "" })}
          addLabel="Add sponsor"
        >
          {(i) => (
            <>
              <Text scope="site" path={["sponsors", i, "name"]} label="Name" />
              <Select scope="site" path={["sponsors", i, "tier"]} label="Tier" options={tierOptions} />
              <Text scope="site" path={["sponsors", i, "href"]} label="Website" hint={linkHint} />
              <LogoField i={i} />
            </>
          )}
        </List>
        <MinPerTier />
      </Group>
    </>
  );
}

function MinPerTier() {
  const { value, set, error } = useField<number>("site", ["sponsorship", "minPerTier"]);
  return (
    <label className="grid gap-1.5">
      <span className="font-display text-[15px] font-semibold tracking-tight">Cards per tier (minimum)</span>
      <input
        type="number"
        min={0}
        max={12}
        value={value}
        onChange={(e) => set(e.target.valueAsNumber)}
        className={`${inputClass(error)} max-w-28`}
      />
      {error && <span className="text-sm text-red-700">{error}</span>}
    </label>
  );
}

function JoinForm() {
  return (
    <>
      <Group title="Join section" hint="The big call to action at the bottom of the homepage.">
        <TwoLines path={["join", "words"]} label="Headline" names={["Word 1", "Word 2", "Word 3"]} />
        <BiText path={["join", "body"]} label="Text" multiline />
        <BiText path={["join", "primary"]} label="Main button" />
        <BiText path={["join", "secondary"]} label="WhatsApp button" />
        <BiText path={["join", "memberName"]} label="Member card: name placeholder" />
        <BiText path={["join", "memberSince"]} label="Member card: since" />
        <BiText path={["join", "sticker"]} label="Rotating sticker text" hint='Ends with " / ".' />
      </Group>
      <Group title="Floating buttons" hint="WhatsApp and Instagram, bottom right.">
        <BiText path={["socialFloat", "whatsapp", "label"]} label="WhatsApp: label" />
        <BiText path={["socialFloat", "whatsapp", "title"]} label="WhatsApp: title" />
        <BiText path={["socialFloat", "instagram", "label"]} label="Instagram: label" hint="The title is the account handle, taken from the Instagram address." />
        <BiText path={["socialFloat", "region"]} label="Box name (screen readers)" />
      </Group>
      <Group title="Footer">
        <BiText path={["footer", "blurb"]} label="Text" multiline />
        <BiText path={["footer", "explore"]} label='"Explore" heading' />
        <BiText path={["footer", "follow"]} label='"Follow" heading' />
      </Group>
    </>
  );
}

function PagesForm() {
  const draft = useDraft();
  return (
    <>
      <Group title="Coming-soon page" hint="Where links to channels that don't exist yet go.">
        <TwoLines path={["soon", "headline"]} label="Headline" names={["Word 1", "Word 2 (on the lime block)"]} />
        <BiText path={["soon", "lead", "default"]} label="Lead: any other link" />
        <BiText path={["soon", "lead", "whatsapp"]} label="Lead: WhatsApp" />
        <BiText path={["soon", "lead", "discord"]} label="Lead: Discord" />
        <BiText path={["soon", "lead", "linkedin"]} label="Lead: LinkedIn" />
        <BiText path={["soon", "lead", "github"]} label="Lead: GitHub" />
        <BiText path={["soon", "lead", "instagram"]} label="Lead: Instagram" />
        <BiText path={["soon", "body"]} label="Text" multiline />
        <BiText path={["soon", "instagram"]} label="Instagram button" />
        <BiText path={["soon", "join"]} label="Join button" />
        <BiText path={["soon", "home"]} label="Home link" />
        <BiText path={["soon", "sticker"]} label="Rotating sticker text" />
        <BiText path={["soon", "status", "title"]} label="Status card: title" />
        <List path={["soon", "status", "steps"]} label="Status card: steps" itemTitle={(i) => draft.tr.soon.status.steps[i]?.[0]} fixed>
          {(i) => (
            <>
              <BiText path={["soon", "status", "steps", i, 0]} label="Step" />
              <BiText path={["soon", "status", "steps", i, 1]} label="State" />
            </>
          )}
        </List>
      </Group>
      <Group title="404 page">
        <BiText path={["notFound", "title"]} label="Browser tab title" />
        <BiText path={["notFound", "lead"]} label="Headline" />
        <BiText path={["notFound", "body"]} label="Text" multiline />
        <BiText path={["notFound", "home"]} label="Home button" />
        <BiText path={["notFound", "projects"]} label="Projects button" />
        <BiText path={["notFound", "quickLinks"]} label="Quick links label" />
        <BiText path={["notFound", "camera", "feed"]} label="Camera card: feed" />
        <BiText path={["notFound", "camera", "scanning"]} label="Camera card: scanning" />
        <BiText path={["notFound", "camera", "box"]} label="Camera card: box" />
        <BiText path={["notFound", "camera", "empty"]} label="Camera card: empty" />
        <BiText path={["notFound", "camera", "chip"]} label="Camera card: chip" />
      </Group>
    </>
  );
}

function LabelsForm() {
  const draft = useDraft();
  return (
    <>
      <Group title="Menu" hint="The menu links in the navbar and footer.">
        <List path={["nav"]} label="Links" itemTitle={(i) => `${draft.tr.nav[i]?.label} (${draft.tr.nav[i]?.href})`} fixed>
          {(i) => <BiText path={["nav", i, "label"]} label="Label" />}
        </List>
      </Group>
      <Group title="Labels" hint="Small texts, mostly for screen readers and buttons.">
        <BiText path={["common", "joinClub"]} label='"Join the club" button (navbar)' />
        <BiText path={["common", "skipToContent"]} label="Skip-to-content link" />
        <BiText path={["common", "backToTop"]} label="Back-to-top link" />
        <BiText path={["common", "logoLabel"]} label="Logo link (homepage)" />
        <BiText path={["common", "homeLabel"]} label="Logo link (other pages)" />
        <BiText path={["common", "newTab"]} label="New-tab note" hint="Starts with a space." />
        <BiText path={["common", "openMenu"]} label="Open menu" />
        <BiText path={["common", "closeMenu"]} label="Close menu" />
        <BiText path={["common", "mainNav"]} label="Main menu name" />
        <BiText path={["common", "footerNav"]} label="Footer menu name" />
        <BiText path={["switcher", "groupLabel"]} label="Language switcher name" />
      </Group>
    </>
  );
}

const home = (anchor = "") => () => `/${anchor}`;

export const sections: Section[] = [
  { id: "club", title: "Club & links", content: ["club"], site: ["club", "discordHref"], Form: ClubForm, preview: home("#join") },
  { id: "hero", title: "Hero", content: ["hero", "tapeExtras"], site: [], Form: HeroForm, preview: home() },
  { id: "about", title: "About & stats", content: ["about", "stats"], site: [], Form: AboutForm, preview: home("#about") },
  { id: "areas", title: "Areas", content: ["areas"], site: [], Form: AreasForm, preview: home("#areas") },
  { id: "projects", title: "Projects", content: ["projects"], site: [], Form: ProjectsForm, preview: () => projectsPath.tr },
  {
    id: "project-page",
    title: "Project page labels",
    content: ["projectPage"],
    site: [],
    Form: ProjectPageForm,
    preview: (d) => projectHref("tr", d.tr.projects.items[0]?.slug ?? ""),
  },
  { id: "events", title: "Events", content: ["events"], site: [], Form: EventsForm, preview: home("#events") },
  { id: "team", title: "Team", content: ["team"], site: [], Form: TeamForm, preview: home("#team") },
  {
    id: "sponsors",
    title: "Sponsors",
    content: ["sponsors"],
    site: ["showSponsors", "sponsorship", "sponsors"],
    Form: SponsorsForm,
    preview: home("#sponsors"),
  },
  { id: "join", title: "Join & footer", content: ["join", "socialFloat", "footer"], site: [], Form: JoinForm, preview: home("#join") },
  { id: "pages", title: "Coming soon & 404", content: ["soon", "notFound"], site: [], Form: PagesForm, preview: () => "/yakinda/" },
  { id: "labels", title: "Menu & labels", content: ["nav", "common", "switcher"], site: [], Form: LabelsForm, preview: home() },
];
