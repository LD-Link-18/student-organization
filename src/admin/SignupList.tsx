import { useCallback, useEffect, useState } from "react";
import type { EventForm } from "../content/schema";
import { downloadCsv, formatPhone } from "./csv";
import { supabase } from "./supabase";

/** A row of `event_signups` (supabase/migrations/0007_event_signups.sql). */
interface Signup {
  id: number;
  created_at: string;
  status: "confirmed" | "waitlist";
  name: string;
  email: string;
  student_no: string | null;
  phone: string | null;
  answers: Record<string, unknown>;
}

/** An answer as text, with option codes turned back into their Turkish wording (codes of removed options stay). */
function answerText(form: EventForm, questionId: string, value: unknown) {
  const q = form.questions.find((x) => x.id === questionId);
  const option = (id: unknown) => q?.options?.find((o) => o.id === id)?.tr ?? String(id);
  if (value === true) return "Yes";
  if (Array.isArray(value)) return value.map(option).join("; ");
  if (q?.type === "one") return option(value);
  return String(value);
}

/**
 * Who signed up for an event: the list in sign-up order, then the waitlist. Admins move people between the two
 * (a place opened up) and delete sign-ups (on request, or all of them after the event, as the privacy notice
 * promises).
 */
export function SignupList({ event, onChange }: { event: { id: number; title_tr: string; form: EventForm; capacity: number | null }; onChange: () => void }) {
  const [rows, setRows] = useState<Signup[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase!
      .from("event_signups")
      .select("id, created_at, status, name, email, student_no, phone, answers")
      .eq("event_id", event.id)
      .order("created_at");
    if (error) return setError(error.message);
    setRows(data as Signup[]);
  }, [event.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function run(action: PromiseLike<{ error: { message: string } | null }>) {
    setBusy(true);
    const { error } = await action;
    if (error) setError(error.message);
    await load();
    onChange();
    setBusy(false);
  }

  if (!rows) return <p className="px-4 py-3 text-sm text-ink/60">{error || "Loading sign-ups…"}</p>;

  const confirmed = rows.filter((r) => r.status === "confirmed");
  const waitlist = rows.filter((r) => r.status === "waitlist");
  const extraKeys = [...new Set(rows.flatMap((r) => Object.keys(r.answers)))].filter((k) => !event.form.questions.some((q) => q.id === k));
  const columns = [...event.form.questions.map((q) => ({ id: q.id, label: q.label_tr })), ...extraKeys.map((k) => ({ id: k, label: k }))];

  function download() {
    downloadCsv(`signups-${event.id}`, [
      ["Status", "Signed up", "Name", "Email", "Student number", "Phone", ...columns.map((c) => c.label)],
      ...[...confirmed, ...waitlist].map((r) => [
        r.status === "confirmed" ? "Confirmed" : "Waitlist",
        new Date(r.created_at).toLocaleString(),
        r.name,
        r.email,
        r.student_no ?? "",
        r.phone ? `0${formatPhone(r.phone).slice(4)}` : "",
        ...columns.map((c) => (r.answers[c.id] === undefined ? "" : answerText(event.form, c.id, r.answers[c.id]))),
      ]),
    ]);
  }

  const list = (title: string, people: Signup[], status: Signup["status"]) =>
    people.length > 0 && (
      <div>
        <p className="font-display font-semibold tracking-tight">
          {title} ({people.length})
        </p>
        <ol className="mt-2 grid gap-2">
          {people.map((r, i) => (
            <li key={r.id} className="rounded-xl border-2 border-ink/10 bg-paper px-3 py-2 text-sm">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-ink/50">{i + 1}.</span>
                <span className="font-semibold">{r.name}</span>
                <a href={`mailto:${r.email}`} className="break-all hover:underline">
                  {r.email}
                </a>
                {r.student_no && <span>{r.student_no}</span>}
                {r.phone && (
                  <a href={`tel:+90${r.phone}`} className="hover:underline">
                    {formatPhone(r.phone)}
                  </a>
                )}
                <span className="text-ink/50">{new Date(r.created_at).toLocaleString()}</span>
                <span className="ml-auto flex gap-3 font-semibold">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      run(supabase!.from("event_signups").update({ status: status === "confirmed" ? "waitlist" : "confirmed" }).eq("id", r.id))
                    }
                    className="text-violet hover:underline disabled:opacity-40"
                  >
                    {status === "confirmed" ? "Move to waitlist" : "Give a place"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => confirm(`Delete ${r.name}'s sign-up? This can't be undone.`) && run(supabase!.from("event_signups").delete().eq("id", r.id))}
                    className="text-red-700 hover:underline disabled:opacity-40"
                  >
                    Delete
                  </button>
                </span>
              </div>
              {columns.some((c) => r.answers[c.id] !== undefined) && (
                <dl className="mt-1.5 grid gap-x-4 gap-y-0.5 text-ink/80 sm:grid-cols-[auto_1fr]">
                  {columns
                    .filter((c) => r.answers[c.id] !== undefined)
                    .map((c) => (
                      <div key={c.id} className="contents">
                        <dt className="text-ink/55">{c.label}</dt>
                        <dd className="whitespace-pre-line break-words">{answerText(event.form, c.id, r.answers[c.id])}</dd>
                      </div>
                    ))}
                </dl>
              )}
            </li>
          ))}
        </ol>
      </div>
    );

  return (
    <div className="grid gap-4 border-t-2 border-ink/10 bg-fog/60 px-4 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 text-sm">
          <span className="font-semibold">
            {confirmed.length}
            {event.capacity ? ` of ${event.capacity} places` : " signed up"}
          </span>
          {waitlist.length > 0 && ` · ${waitlist.length} on the waitlist`}
          {event.capacity !== null && confirmed.length < event.capacity && waitlist.length > 0 && (
            <span className="font-semibold text-violet"> · places are free: give them to the first on the waitlist</span>
          )}
        </p>
        {rows.length > 0 && (
          <>
            <button type="button" onClick={download} className="btn btn-paper min-h-9 px-3 text-sm">
              Download CSV
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                confirm(`Delete all ${rows.length} sign-ups for "${event.title_tr}"? Do this after the event (the privacy notice promises it). This can't be undone.`) &&
                run(supabase!.from("event_signups").delete().eq("event_id", event.id))
              }
              className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-40"
            >
              Delete all
            </button>
          </>
        )}
      </div>
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
      {rows.length === 0 && <p className="text-sm text-ink/60">No sign-ups yet.</p>}
      {list("On the list", confirmed, "confirmed")}
      {list("Waitlist", waitlist, "waitlist")}
    </div>
  );
}
