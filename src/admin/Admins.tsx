import { useCallback, useEffect, useId, useState } from "react";
import { otherAreas, type Access } from "./access";
import { inputClass } from "./fields";
import { sections } from "./sections";
import { supabase } from "./supabase";

/** A row of admin_list() (supabase/migrations/0008_admin_roles.sql). */
interface Admin {
  user_id: string;
  email: string;
  full_access: boolean;
  areas: string[];
  added_at: string;
}

const titles = new Map<string, string>([...sections.map((s) => [s.id, s.title] as const), ...otherAreas.map((a) => [a.id, a.title] as const)]);

export const summary = (a: Access) =>
  a.full ? "Full admin: everything, including admins" : a.areas.length ? a.areas.map((id) => titles.get(id) ?? id).join(", ") : "Nothing yet";

/** Full admin, or the areas ticked one by one (grouped as in the panel's menu). */
function AccessPicker({ value, onChange }: { value: Access; onChange: (a: Access) => void }) {
  const id = useId();
  const toggle = (area: string, on: boolean) => onChange({ ...value, areas: on ? [...value.areas, area] : value.areas.filter((a) => a !== area) });
  const allTexts = sections.every((s) => value.areas.includes(s.id));
  const box = (area: string, title: string, hint?: string) => (
    <label key={area} className="flex cursor-pointer items-start gap-2 text-sm" title={hint}>
      <input type="checkbox" checked={value.areas.includes(area)} onChange={(e) => toggle(area, e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-violet" />
      <span>
        {title}
        {hint && <span className="block text-xs text-ink/55">{hint}</span>}
      </span>
    </label>
  );

  return (
    <div className="grid gap-4">
      <label className="flex cursor-pointer items-start gap-2">
        <input type="checkbox" checked={value.full} onChange={(e) => onChange({ ...value, full: e.target.checked })} className="mt-0.5 size-5 accent-violet" />
        <span>
          <span className="font-display font-semibold tracking-tight">Full admin</span>
          <span className="block text-sm text-ink/60">Everything, including this page: adding admins and changing what they may do.</span>
        </span>
      </label>
      {!value.full && (
        <>
          <fieldset>
            <legend className="mb-2 flex items-center gap-3 font-display text-[15px] font-semibold tracking-tight">
              Site texts
              <label className="flex cursor-pointer items-center gap-1.5 font-sans text-sm font-normal text-violet">
                <input
                  type="checkbox"
                  id={`${id}-all`}
                  checked={allTexts}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      areas: e.target.checked ? [...new Set([...value.areas, ...sections.map((s) => s.id)])] : value.areas.filter((a) => !sections.some((s) => s.id === a)),
                    })
                  }
                  className="size-4 accent-violet"
                />
                all
              </label>
            </legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{sections.map((s) => box(s.id, s.title))}</div>
          </fieldset>
          {(["Events", "Personal data"] as const).map((group) => (
            <fieldset key={group}>
              <legend className="mb-2 font-display text-[15px] font-semibold tracking-tight">{group}</legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{otherAreas.filter((a) => a.group === group).map((a) => box(a.id, a.title, a.hint))}</div>
            </fieldset>
          ))}
        </>
      )}
    </div>
  );
}

/** One admin: what they may do, changed in place. */
function AdminRow({ admin, self, onSaved }: { admin: Admin; self: boolean; onSaved: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<Access>({ full: admin.full_access, areas: admin.areas });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setBusy(true);
    const { error } = await supabase!.rpc("admin_save", { p_email: admin.email, p_full_access: value.full, p_areas: value.full ? [] : value.areas });
    setBusy(false);
    if (error) return setError(error.message);
    setEditing(false);
    await onSaved();
  }

  async function remove() {
    if (!confirm(`Remove ${admin.email} as an admin? They can still sign in, but see nothing. (Delete the account itself in the Supabase dashboard.)`)) return;
    setBusy(true);
    const { error } = await supabase!.rpc("admin_remove", { p_user_id: admin.user_id });
    setBusy(false);
    if (error) return setError(error.message);
    await onSaved();
  }

  return (
    <li className="grid gap-3 rounded-2xl border-2 border-ink/15 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold tracking-tight">
            {admin.email}
            {self && <span className="ml-2 pill border-ink bg-lime px-2 py-0.5 text-xs">you</span>}
          </p>
          {!editing && <p className="text-sm text-ink/65">{summary({ full: admin.full_access, areas: admin.areas })}</p>}
        </div>
        {!editing && (
          <div className="flex gap-4 text-sm font-semibold">
            <button type="button" onClick={() => setEditing(true)} className="text-violet hover:underline">
              Change
            </button>
            {/* Removing yourself would lock you out mid-session; another full admin can do it. */}
            {!self && (
              <button type="button" onClick={remove} disabled={busy} className="text-red-700 hover:underline disabled:opacity-40">
                Remove
              </button>
            )}
          </div>
        )}
      </div>
      {editing && (
        <>
          <AccessPicker value={value} onChange={setValue} />
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={save} disabled={busy} className="btn btn-lime min-h-10 px-5 text-sm">
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setValue({ full: admin.full_access, areas: admin.areas });
                setError("");
              }}
              disabled={busy}
              className="btn btn-paper min-h-10 px-4 text-sm"
            >
              Cancel
            </button>
          </div>
        </>
      )}
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
    </li>
  );
}

/**
 * Who may use the panel, and for what (full admins only). New people are invited from the Supabase dashboard
 * first; once they have an account they're added here by email.
 */
export function Admins({ self }: { self: string }) {
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState<Access>({ full: false, areas: [] });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const id = useId();

  const load = useCallback(async () => {
    const { data, error } = await supabase!.rpc("admin_list");
    if (error) return setError(error.message);
    setAdmins(data as Admin[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add() {
    setAddError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setAddError("Type their email address.");
    if (!access.full && !access.areas.length) return setAddError("Tick at least one area, or make them a full admin.");
    if (admins?.some((a) => a.email.toLowerCase() === email.trim().toLowerCase())) return setAddError("Already an admin: use Change on their row.");
    setAdding(true);
    const { error } = await supabase!.rpc("admin_save", { p_email: email.trim(), p_full_access: access.full, p_areas: access.full ? [] : access.areas });
    setAdding(false);
    if (error) return setAddError(error.message);
    setEmail("");
    setAccess({ full: false, areas: [] });
    await load();
  }

  return (
    <section className="rounded-3xl border-2 border-ink bg-paper p-4 shadow-[var(--shadow-brut-sm)] md:p-6">
      <h2 className="font-display text-xl font-bold tracking-tight">Admins</h2>
      <p className="mt-1 text-sm text-ink/65">
        Who may use this panel, and for what. Someone who isn't a full admin only sees (and can only change) the parts ticked for them; the
        database enforces it too.
      </p>
      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      {!admins && !error && <p className="mt-4 text-ink/60">Loading…</p>}
      {admins && (
        <ol className="mt-5 grid gap-2">
          {admins.map((a) => (
            <AdminRow key={`${a.user_id}-${a.full_access}-${a.areas.join()}`} admin={a} self={a.user_id === self} onSaved={load} />
          ))}
        </ol>
      )}

      <div className="mt-8 grid gap-4 rounded-2xl border-2 border-violet p-4 md:p-5">
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight">Add an admin</h3>
          <p className="text-sm text-ink/65">
            First invite them in the Supabase dashboard (Authentication → Users → Invite user); they get an email to choose a password. Then add
            them here with the same address.
          </p>
        </div>
        <div className="max-w-md">
          <label htmlFor={`${id}-email`} className="mb-1.5 block font-display text-[15px] font-semibold tracking-tight">
            Email
          </label>
          <input id={`${id}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass()} />
        </div>
        <AccessPicker value={access} onChange={setAccess} />
        {addError && <p className="text-sm font-medium text-red-700">{addError}</p>}
        <button type="button" onClick={add} disabled={adding} className="btn btn-lime min-h-10 w-fit px-5 text-sm">
          {adding ? "Adding…" : "Add admin"}
        </button>
      </div>
    </section>
  );
}
