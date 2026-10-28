import { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { dateParts, localizeEvents, splitEvents } from "../content/events";
import { emptyForm, eventRowSchema, type EventExtras, type EventPhoto, type EventRow } from "../content/schema";
import { eventHref } from "../content/site";
import { ErrorText, Label, LangTag, TextInput, inputClass } from "./fields";
import { FormBuilder, formProblems } from "./FormBuilder";
import { SignupList } from "./SignupList";
import { ASSET_BUCKET, supabase } from "./supabase";

/**
 * The `events` table (supabase/migrations/0005_events.sql to 0007_event_signups.sql): add, change and delete
 * events, their photos and sign-up forms, and see who signed up. Unlike the other sections, each change is
 * saved on its own, right away; the site sorts the events by date.
 */

/** A row as the panel reads it: everything, including the write-up and photos. */
type Row = EventRow & EventExtras;
/** What the event form edits; photos are managed (and saved) separately. */
type Values = Omit<EventRow, "id"> & Pick<EventExtras, "details_tr" | "details_en" | "form" | "capacity">;
type Errors = Map<string, string>;

const DETAILS_MAX = 10000;
const photoCount = (n: number) => `${n} ${n === 1 ? "photo" : "photos"}`;

const blank: Values = {
  starts_on: "",
  ends_on: null,
  title_tr: "",
  title_en: "",
  category_tr: "",
  category_en: "",
  place_tr: "",
  place_en: "",
  description_tr: "",
  description_en: "",
  details_tr: "",
  details_en: "",
  rsvp_open: false,
  form: emptyForm,
  capacity: null,
};

/** Just the editable fields of a row (not its id or save stamps, which the database sets). */
const toValues = (row: Row): Values => Object.fromEntries(Object.keys(blank).map((k) => [k, row[k as keyof Values]])) as Values;

function check(values: Values): Errors {
  const errors: Errors = new Map();
  const result = eventRowSchema.safeParse({ ...values, id: 0 });
  if (!result.success) for (const issue of result.error.issues) if (!errors.has(String(issue.path[0]))) errors.set(String(issue.path[0]), issue.message);
  for (const key of ["details_tr", "details_en"] as const) if (values[key].length > DETAILS_MAX) errors.set(key, `At most ${DETAILS_MAX} characters`);
  if (formProblems(values.form, values.capacity).length) errors.set("form", "See the sign-up form");
  return errors;
}

/** One text in Turkish and English, side by side, like `BiText` in the content sections. */
function BiField({
  name,
  label,
  hint,
  multiline,
  values,
  errors,
  set,
}: {
  name: "title" | "category" | "place" | "description" | "details";
  label: string;
  hint?: string;
  multiline?: boolean;
  values: Values;
  errors: Errors;
  set: (change: Partial<Values>) => void;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={`${id}-tr`} label={label} hint={hint} />
      <div className="grid gap-2 md:grid-cols-2 md:gap-3">
        {(["tr", "en"] as const).map((lang) => {
          const key = `${name}_${lang}` as const;
          return (
            <div key={lang} className="flex items-start">
              <span className="pt-2.5">
                <LangTag label={lang.toUpperCase()} />
              </span>
              <div className="min-w-0 flex-1">
                <TextInput id={`${id}-${lang}`} value={values[key]} onChange={(v) => set({ [key]: v })} multiline={multiline} error={errors.get(key)} />
                <ErrorText error={errors.get(key)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The event's fields; `photos` is the photo manager, only for an event that's already saved. */
function EventForm({
  initial,
  photos,
  signups,
  onSave,
  onCancel,
}: {
  initial: Values;
  photos?: ReactNode;
  /** How many have signed up (undefined for a new event). */
  signups?: number;
  onSave: (values: Values) => Promise<string | null>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const errors = useMemo(() => (showErrors ? check(values) : new Map<string, string>()), [values, showErrors]);
  const set = (change: Partial<Values>) => setValues((v) => ({ ...v, ...change }));
  const id = useId();

  async function save() {
    if (check(values).size) return setShowErrors(true);
    setSaving(true);
    const trimmed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])) as Values;
    trimmed.form = {
      ...values.form,
      questions: values.form.questions.map((q) => ({
        ...q,
        label_tr: q.label_tr.trim(),
        label_en: q.label_en.trim(),
        options: q.type === "one" || q.type === "many" ? q.options?.map((o) => ({ ...o, tr: o.tr.trim(), en: o.en.trim() })) : undefined,
      })),
    };
    setError((await onSave(trimmed)) ?? "");
    setSaving(false);
  }

  return (
    <div className="grid gap-5 rounded-2xl border-2 border-violet bg-paper p-4 md:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${id}-start`} label="Date" hint="The day it takes place, or its first day." />
          <input id={`${id}-start`} type="date" value={values.starts_on} onChange={(e) => set({ starts_on: e.target.value })} className={inputClass(errors.get("starts_on"))} />
          <ErrorText error={errors.get("starts_on")} />
        </div>
        <div>
          <Label htmlFor={`${id}-end`} label="Last day" hint="Only for events over several days." />
          <input
            id={`${id}-end`}
            type="date"
            value={values.ends_on ?? ""}
            min={values.starts_on || undefined}
            onChange={(e) => set({ ends_on: e.target.value || null })}
            className={inputClass(errors.get("ends_on"))}
          />
          <ErrorText error={errors.get("ends_on")} />
        </div>
      </div>
      <BiField name="title" label="Title" values={values} errors={errors} set={set} />
      <BiField name="category" label="Category" hint="A word or two: Workshop, Talk, Booth…" values={values} errors={errors} set={set} />
      <BiField name="place" label="Place" values={values} errors={errors} set={set} />
      <BiField name="description" label="Short description" hint="A sentence or two, for the lists." multiline values={values} errors={errors} set={set} />
      <BiField
        name="details"
        label="Full details (optional)"
        hint="For the event's own page: agenda, what to bring, who it's for. A blank line starts a new paragraph. Empty: the page shows the short description."
        multiline
        values={values}
        errors={errors}
        set={set}
      />
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={values.rsvp_open} onChange={(e) => set({ rsvp_open: e.target.checked })} className="mt-1 size-5 accent-violet" />
        <span>
          <span className="font-display text-[15px] font-semibold tracking-tight">RSVP open</span>
          <span className="block text-sm text-ink/60">Off: the button is shown disabled. Past events never show it.</span>
        </span>
      </label>
      <FormBuilder
        form={values.form}
        capacity={values.capacity}
        signups={signups}
        problems={showErrors ? formProblems(values.form, values.capacity) : []}
        onForm={(form) => set({ form })}
        onCapacity={(capacity) => set({ capacity })}
      />
      {photos ?? <p className="text-sm text-ink/60">Photos: save the event first, then edit it to add them.</p>}
      {errors.size > 0 && <p className="text-sm font-medium text-red-700">Fix the highlighted fields first.</p>}
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={save} disabled={saving} className="btn btn-lime min-h-10 px-5 text-sm">
          {saving ? "Saving…" : "Save event"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="btn btn-paper min-h-10 px-4 text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}

/** Bucket limit (0001_admin.sql): photos are scaled down and compressed below it before uploading. */
const UPLOAD_MAX_BYTES = 2 * 1024 * 1024;
const MAX_PHOTOS = 100;

/** Draws `file` at most `size` px on its long side; WebP where the browser can write it, else JPEG. */
async function shrink(file: File, size: number, quality: number) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, size / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  let blob = await encode("image/webp");
  if (blob?.type !== "image/webp") blob = await encode("image/jpeg"); // Safari can't write WebP
  if (!blob) throw new Error("couldn't encode");
  return { blob, w: canvas.width, h: canvas.height, ext: blob.type === "image/webp" ? "webp" : "jpg" };
}

/** A full-size photo (at most 2000 px, smaller if needed to fit the limit) and a 600 px one for the grid. */
async function prepare(file: File) {
  for (const [size, quality] of [[2000, 0.82], [1600, 0.75], [1280, 0.7]]) {
    const full = await shrink(file, size, quality);
    if (full.blob.size <= UPLOAD_MAX_BYTES) return { full, thumb: await shrink(file, 600, 0.75) };
  }
  throw new Error("too large even when scaled down");
}

/**
 * Photos from the event, shown on its page in this order. Each upload or removal is saved at once (no need to
 * press "Save event"); files live in the site-assets bucket under events/<id>/.
 */
function PhotoManager({ row, onChange }: { row: Row; onChange: () => Promise<void> }) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const id = useId();
  const storage = supabase!.storage.from(ASSET_BUCKET);
  const url = (path: string) => storage.getPublicUrl(path).data.publicUrl;
  const savePhotos = (photos: EventPhoto[]) => supabase!.from("events").update({ photos }).eq("id", row.id);

  async function upload(files: File[]) {
    setError("");
    const room = MAX_PHOTOS - row.photos.length;
    if (files.length > room) return setError(`At most ${MAX_PHOTOS} photos per event: ${room} more fit.`);
    const added: EventPhoto[] = [];
    const failed: string[] = [];
    for (const [i, file] of files.entries()) {
      setBusy(`Uploading ${i + 1} of ${files.length}…`);
      try {
        const { full, thumb } = await prepare(file);
        const base = `events/${row.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const photo = { src: `${base}.${full.ext}`, thumb: `${base}-thumb.${thumb.ext}`, w: full.w, h: full.h };
        for (const [path, blob] of [[photo.src, full.blob], [photo.thumb, thumb.blob]] as const) {
          const { error } = await storage.upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
          if (error) throw error;
        }
        added.push(photo);
      } catch (e) {
        failed.push(`${file.name} (${(e as Error).message})`);
      }
    }
    if (added.length) {
      setBusy("Saving…");
      const { error } = await savePhotos([...row.photos, ...added]);
      if (error) {
        await storage.remove(added.flatMap((p) => [p.src, p.thumb]));
        failed.push(`saving the list: ${error.message}`);
      }
    }
    setBusy("");
    if (failed.length) setError(`Not added: ${failed.join(", ")}. Photos must be JPG, PNG or WebP (iPhone HEIC: export as JPG).`);
    await onChange();
  }

  async function remove(photo: EventPhoto) {
    if (!confirm("Remove this photo from the event? This can't be undone.")) return;
    setBusy("Removing…");
    const { error } = await savePhotos(row.photos.filter((p) => p.src !== photo.src));
    if (error) setError(error.message);
    else await storage.remove([photo.src, photo.thumb]);
    setBusy("");
    await onChange();
  }

  async function move(index: number, by: -1 | 1) {
    const photos = [...row.photos];
    [photos[index], photos[index + by]] = [photos[index + by], photos[index]];
    setBusy("Saving…");
    const { error } = await savePhotos(photos);
    if (error) setError(error.message);
    setBusy("");
    await onChange();
  }

  return (
    <div>
      <Label
        htmlFor={id}
        label={`Photos (${row.photos.length})`}
        hint="Shown on the event's page in this order. Saved as soon as you add or remove one. Large photos are scaled down before uploading."
      />
      {row.photos.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
          {row.photos.map((p, i) => (
            <li key={p.src} className="overflow-hidden rounded-xl border-2 border-ink/15">
              <img src={url(p.thumb)} alt={`Photo ${i + 1}`} className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between px-1.5 py-1 text-sm font-semibold">
                <span className="flex gap-1">
                  <button type="button" disabled={!!busy || i === 0} onClick={() => move(i, -1)} aria-label="Move earlier" className="px-1 disabled:opacity-30">
                    ←
                  </button>
                  <button type="button" disabled={!!busy || i === row.photos.length - 1} onClick={() => move(i, 1)} aria-label="Move later" className="px-1 disabled:opacity-30">
                    →
                  </button>
                </span>
                <button type="button" disabled={!!busy} onClick={() => remove(p)} className="text-red-700 hover:underline disabled:opacity-30">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={!!busy}
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = "";
          if (files.length) upload(files);
        }}
        className="block text-sm file:mr-3 file:rounded-full file:border-2 file:border-ink file:bg-paper file:px-4 file:py-1.5 file:font-display file:font-semibold"
      />
      {busy && <p className="mt-2 text-sm text-ink/70">{busy}</p>}
      <ErrorText error={error} />
    </div>
  );
}

export function EventList() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  /** The event being edited: its id, "new", or nothing. */
  const [editing, setEditing] = useState<number | "new" | null>(null);
  /** The event whose sign-ups are open below it. */
  const [showing, setShowing] = useState<number | null>(null);
  /** Sign-ups per event: confirmed and waitlist. */
  const [counts, setCounts] = useState<Map<number, { confirmed: number; waitlist: number }>>(new Map());

  const loadCounts = useCallback(async () => {
    const { data } = await supabase!.from("event_signups").select("event_id, status");
    const next = new Map<number, { confirmed: number; waitlist: number }>();
    for (const s of (data ?? []) as { event_id: number; status: "confirmed" | "waitlist" }[]) {
      const c = next.get(s.event_id) ?? { confirmed: 0, waitlist: 0 };
      c[s.status]++;
      next.set(s.event_id, c);
    }
    setCounts(next);
  }, []);

  const load = useCallback(async () => {
    const { data, error } = await supabase!.from("events").select("*");
    if (error) return setError(error.message);
    setRows(data as Row[]);
    loadCounts();
  }, [loadCounts]);

  useEffect(() => {
    load();
  }, [load]);

  /** Turkish titles and dates, sorted the way the site sorts them. */
  const lists = useMemo(() => splitEvents(localizeEvents(rows ?? [], "tr")), [rows]);
  const byId = useMemo(() => new Map((rows ?? []).map((r) => [r.id, r])), [rows]);

  async function save(values: Values, id: number | "new") {
    const { error } = id === "new" ? await supabase!.from("events").insert(values) : await supabase!.from("events").update(values).eq("id", id);
    if (error) return `Not saved: ${error.message}`;
    setEditing(null);
    setStatus(`Saved "${values.title_en}". Visitors see it on their next page load.`);
    await load();
    return null;
  }

  async function remove(row: Row) {
    const c = counts.get(row.id);
    const signups = (c?.confirmed ?? 0) + (c?.waitlist ?? 0);
    const also = [row.photos.length && photoCount(row.photos.length), signups && `${signups} ${signups === 1 ? "sign-up" : "sign-ups"}`].filter(Boolean);
    const extra = also.length ? ` and its ${also.join(" and ")}` : "";
    if (!confirm(`Delete "${row.title_en}"${extra}? It disappears from the site, past events included. This can't be undone.`)) return;
    const { error } = await supabase!.from("events").delete().eq("id", row.id);
    if (error) return setError(error.message);
    if (row.photos.length) await supabase!.storage.from(ASSET_BUCKET).remove(row.photos.flatMap((p) => [p.src, p.thumb]));
    setStatus(`Deleted "${row.title_en}".`);
    await load();
  }

  const list = (title: string, events: typeof lists.upcoming, past: boolean) => (
    <div>
      <h3 className="font-display text-lg font-bold tracking-tight">
        {title} <span className="font-medium text-ink/50">({events.length})</span>
      </h3>
      {events.length === 0 && <p className="mt-2 text-sm text-ink/60">None.</p>}
      <ol className="mt-3 grid gap-2">
        {events.map((e) => {
          const row = byId.get(e.id)!;
          const { day, month } = dateParts(e, "tr", true);
          return (
            <li key={e.id} className="rounded-2xl border-2 border-ink/15">
              {editing === e.id ? (
                <EventForm
                  initial={toValues(row)}
                  signups={(counts.get(row.id)?.confirmed ?? 0) + (counts.get(row.id)?.waitlist ?? 0)}
                  photos={<PhotoManager row={row} onChange={load} />}
                  onSave={(v) => save(v, e.id)}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                    <p className="w-24 shrink-0 font-display leading-tight">
                      <span className="block text-xl font-bold">{day}</span>
                      <span className="text-sm font-semibold text-ink/65">{month}</span>
                    </p>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-semibold tracking-tight">
                        {row.title_tr} <span className="font-normal text-ink/50">/ {row.title_en}</span>
                      </p>
                      <p className="text-sm text-ink/65">
                        {row.category_tr} · {row.place_tr}
                        {!past && (row.rsvp_open ? " · RSVP open" : " · RSVP closed")}
                        {row.photos.length > 0 && ` · ${photoCount(row.photos.length)}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                      <button type="button" onClick={() => setShowing(showing === row.id ? null : row.id)} aria-expanded={showing === row.id} className="hover:underline">
                        Sign-ups ({counts.get(row.id)?.confirmed ?? 0}
                        {row.capacity ? `/${row.capacity}` : ""}
                        {counts.get(row.id)?.waitlist ? ` +${counts.get(row.id)!.waitlist} waiting` : ""})
                      </button>
                      <a href={eventHref("tr", { id: row.id, title: row.title_tr })} target="_blank" rel="noreferrer" className="hover:underline">
                        View page
                      </a>
                      <button type="button" onClick={() => setEditing(e.id)} disabled={editing !== null} className="text-violet hover:underline disabled:opacity-40">
                        Edit
                      </button>
                      <button type="button" onClick={() => remove(row)} disabled={editing !== null} className="text-red-700 hover:underline disabled:opacity-40">
                        Delete
                      </button>
                    </div>
                  </div>
                  {showing === row.id && <SignupList event={row} onChange={loadCounts} />}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );

  return (
    <section className="rounded-3xl border-2 border-ink bg-paper p-4 shadow-[var(--shadow-brut-sm)] md:p-6">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-tight">Event list</h2>
          <p className="mt-1 text-sm text-ink/65">
            Each change here is saved at once (the Save button at the bottom is for the other sections). The site sorts events by date: the
            homepage shows the next few, and{" "}
            <a href="/etkinlikler/" target="_blank" rel="noreferrer" className="font-semibold text-violet hover:underline">
              /etkinlikler/
            </a>{" "}
            lists them all, past ones included. Each event also has its own page with its full details and photos ("View page"). The
            texts around them are in the Events section.
          </p>
        </div>
        <button type="button" onClick={() => setEditing("new")} disabled={editing !== null} className="btn btn-lime min-h-10 px-4 text-sm">
          Add event
        </button>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      {status && (
        <p role="status" className="mt-4 text-sm text-ink/75">
          {status}
        </p>
      )}
      {!rows && !error && <p className="mt-4 text-ink/60">Loading…</p>}

      {editing === "new" && (
        <div className="mt-5">
          <EventForm initial={blank} onSave={(v) => save(v, "new")} onCancel={() => setEditing(null)} />
        </div>
      )}

      {rows && (
        <div className="mt-6 grid gap-8">
          {list("Upcoming", lists.upcoming, false)}
          {list("Past", lists.past, true)}
        </div>
      )}
    </section>
  );
}
