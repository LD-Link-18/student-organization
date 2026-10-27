import { useEffect, useMemo, useState } from "react";
import { inputClass } from "./fields";
import { supabase } from "./supabase";

/** A row of `applications` (supabase/migrations/0003_applications.sql), sent from the form at /basvuru/. */
interface Application {
  id: number;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  student_no: string;
  phone: string;
  department: string;
  grade: string;
  lang: "tr" | "en";
}

const columns = "id, created_at, email, first_name, last_name, student_no, phone, department, grade, lang";
/** The API returns at most this many rows per request. */
const page = 1000;

/** 5321234567 → +90 532 123 45 67 */
const formatPhone = (p: string) => `+90 ${p.slice(0, 3)} ${p.slice(3, 6)} ${p.slice(6, 8)} ${p.slice(8)}`;

async function fetchAll() {
  const rows: Application[] = [];
  for (let from = 0; ; from += page) {
    const { data, error } = await supabase!
      .from("applications")
      .select(columns)
      .order("created_at", { ascending: false })
      .range(from, from + page - 1);
    if (error) throw error;
    rows.push(...(data as Application[]));
    if (data.length < page) return rows;
  }
}

/**
 * Opens in Excel with Turkish characters intact (UTF-8 with BOM). Anyone can send the form, so a value that
 * starts like a formula (=, +, -, @) gets a leading ' to stay text instead of running in the spreadsheet.
 */
function downloadCsv(rows: Application[]) {
  const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replaceAll('"', '""')}"`;
  const lines = [
    ["Date", "First name", "Last name", "Email", "Phone", "Student number", "Department", "Year", "Form"],
    ...rows.map((a) => [
      new Date(a.created_at).toLocaleString(),
      a.first_name,
      a.last_name,
      a.email,
      `0${formatPhone(a.phone).slice(4)}`,
      a.student_no,
      a.department,
      a.grade,
      a.lang.toUpperCase(),
    ]),
  ].map((r) => r.map(cell).join(","));
  const url = URL.createObjectURL(new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/** Membership applications, newest first: search, download as CSV, delete on request (KVKK). */
export function Applications() {
  const [rows, setRows] = useState<Application[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAll()
      .then(setRows)
      .catch((e: Error) => setError(e.message));
  }, []);

  /** How often each student number applied: repeats are flagged, not merged. */
  const counts = useMemo(() => {
    const c = new Map<string, number>();
    for (const a of rows ?? []) c.set(a.student_no, (c.get(a.student_no) ?? 0) + 1);
    return c;
  }, [rows]);

  const shown = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q || !rows) return rows;
    return rows.filter((a) =>
      [a.first_name, a.last_name, a.email, a.student_no, a.phone, a.department].some((v) => v.toLocaleLowerCase("tr").includes(q)),
    );
  }, [rows, query]);

  async function remove(a: Application) {
    if (!confirm(`Delete the application from ${a.first_name} ${a.last_name} (${a.student_no})? This can't be undone.`)) return;
    const { error } = await supabase!.from("applications").delete().eq("id", a.id);
    if (error) return setError(error.message);
    setRows((r) => r?.filter((x) => x.id !== a.id) ?? null);
  }

  return (
    <section className="rounded-3xl border-2 border-ink bg-paper p-4 shadow-[var(--shadow-brut-sm)] md:p-6">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-tight">Applications</h2>
          <p className="mt-1 text-sm text-ink/65">
            Sent from the form at <a href="/basvuru/" target="_blank" rel="noreferrer" className="font-semibold text-violet hover:underline">/basvuru/</a>, newest first.
            Personal data: download only what you need, and delete an application when its sender asks.
          </p>
        </div>
        {rows && rows.length > 0 && (
          <button type="button" onClick={() => downloadCsv(shown ?? rows)} className="btn btn-paper min-h-10 px-4 text-sm">
            Download CSV{query.trim() ? " (filtered)" : ""}
          </button>
        )}
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      {!rows && !error && <p className="mt-4 text-ink/60">Loading…</p>}
      {rows?.length === 0 && <p className="mt-4 text-ink/60">No applications yet.</p>}

      {rows && rows.length > 0 && (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, student number, department…"
              aria-label="Search applications"
              className={`${inputClass()} max-w-md`}
            />
            <p className="text-sm text-ink/65">
              {shown!.length === rows.length ? `${rows.length} in total` : `${shown!.length} of ${rows.length}`}
            </p>
          </div>
          <div className="-mx-4 mt-4 overflow-x-auto px-4 md:-mx-6 md:px-6">
            <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink">
                  {["Date", "Name", "Student no.", "Department", "Year", "Email", "Phone", ""].map((h, i) => (
                    <th key={i} scope="col" className="px-2 py-2 font-display font-semibold tracking-tight">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown!.map((a) => (
                  <tr key={a.id} className="border-b border-ink/10 align-top">
                    <td className="whitespace-nowrap px-2 py-2 text-ink/65">{new Date(a.created_at).toLocaleString()}</td>
                    <td className="px-2 py-2 font-semibold">
                      {a.first_name} {a.last_name}
                      {a.lang === "en" && <span className="ml-2 pill border-ink/30 px-1.5 py-0 text-[11px]">EN</span>}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2">
                      {a.student_no}
                      {counts.get(a.student_no)! > 1 && (
                        <span className="ml-2 pill border-ink bg-lime px-1.5 py-0 text-[11px]" title="This student number applied more than once">
                          ×{counts.get(a.student_no)}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2">{a.department}</td>
                    <td className="whitespace-nowrap px-2 py-2">{a.grade}</td>
                    <td className="px-2 py-2">
                      <a href={`mailto:${a.email}`} className="break-all hover:underline">
                        {a.email}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-2 py-2">
                      <a href={`tel:+90${a.phone}`} className="hover:underline">
                        {formatPhone(a.phone)}
                      </a>
                    </td>
                    <td className="px-2 py-2 text-right">
                      <button type="button" onClick={() => remove(a)} className="text-sm font-semibold text-red-700 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
