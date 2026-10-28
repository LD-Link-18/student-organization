import { useId } from "react";
import type { EventForm, FormQuestion } from "../content/schema";
import { Label, LangTag, TextInput, inputClass } from "./fields";

/** An event's sign-up form in the Event list: switches, number of places, and its own questions. */

const typeNames: Record<FormQuestion["type"], string> = {
  text: "Short text",
  textarea: "Long text",
  one: "Pick one",
  many: "Pick several",
  yesno: "Yes / no",
};

/** A short id that never changes, so renaming a question or option keeps the answers already given. */
const newId = (taken: string[]) => {
  let id;
  do id = Math.random().toString(36).slice(2, 8);
  while (!/^[a-z0-9]{1,16}$/.test(id) || taken.includes(id));
  return id;
};

/** What has to be fixed before the event can be saved (the same rules as event_form_valid() in 0007). */
export function formProblems(form: EventForm, capacity: number | null): string[] {
  const problems: string[] = [];
  if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1 || capacity > 10000)) problems.push("Places: a whole number from 1 to 10000, or empty for no limit.");
  if (form.questions.length > 30) problems.push("At most 30 questions.");
  form.questions.forEach((q, i) => {
    const at = `Question ${i + 1}`;
    for (const lang of ["tr", "en"] as const) {
      const label = q[`label_${lang}`].trim();
      if (!label) problems.push(`${at}: the ${lang === "tr" ? "Turkish" : "English"} question is empty.`);
      else if (label.length > 300) problems.push(`${at}: at most 300 characters.`);
    }
    if (q.type === "one" || q.type === "many") {
      const options = q.options ?? [];
      if (options.length < 2 || options.length > 30) problems.push(`${at}: 2 to 30 options.`);
      options.forEach((o, j) => {
        if (!o.tr.trim() || !o.en.trim()) problems.push(`${at}, option ${j + 1}: fill in both languages.`);
        else if (o.tr.trim().length > 120 || o.en.trim().length > 120) problems.push(`${at}, option ${j + 1}: at most 120 characters.`);
      });
    }
  });
  return problems;
}

export function FormBuilder({
  form,
  capacity,
  signups,
  problems,
  onForm,
  onCapacity,
}: {
  form: EventForm;
  capacity: number | null;
  /** How many have signed up already (a warning when changing questions); undefined for a new event. */
  signups?: number;
  /** Shown once the admin has tried to save. */
  problems: string[];
  onForm: (form: EventForm) => void;
  onCapacity: (capacity: number | null) => void;
}) {
  const id = useId();
  const setQuestion = (i: number, change: Partial<FormQuestion>) =>
    onForm({ ...form, questions: form.questions.map((q, j) => (j === i ? { ...q, ...change } : q)) });
  const moveQuestion = (i: number, by: -1 | 1) => {
    const questions = [...form.questions];
    [questions[i], questions[i + by]] = [questions[i + by], questions[i]];
    onForm({ ...form, questions });
  };
  const addQuestion = (type: FormQuestion["type"]) => {
    const taken = form.questions.map((q) => q.id);
    const question: FormQuestion = { id: newId(taken), type, label_tr: "", label_en: "", required: false };
    if (type === "one" || type === "many") {
      const first = newId([]);
      question.options = [
        { id: first, tr: "", en: "" },
        { id: newId([first]), tr: "", en: "" },
      ];
    }
    onForm({ ...form, questions: [...form.questions, question] });
  };

  return (
    <div className="grid gap-4 rounded-2xl border-2 border-ink/15 bg-fog/60 p-4">
      <div>
        <p className="font-display text-[15px] font-semibold tracking-tight">Sign-up form</p>
        <p className="text-sm text-ink/60">
          On the event's page while "RSVP open" is on and the event hasn't ended. Name, email and the privacy consent are always asked; the
          texts around the form are in the Events section.
        </p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {(
          [
            ["ask_student_no", "Ask for the student number"],
            ["ask_phone", "Ask for a phone number"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 text-[15px] font-semibold">
            <input type="checkbox" checked={form[key]} onChange={(e) => onForm({ ...form, [key]: e.target.checked })} className="size-5 accent-violet" />
            {label}
          </label>
        ))}
      </div>

      <div className="max-w-xs">
        <Label htmlFor={`${id}-capacity`} label="Places" hint="Empty: no limit. When they're taken, new sign-ups go on the waitlist." />
        <input
          id={`${id}-capacity`}
          type="number"
          min={1}
          max={10000}
          value={capacity ?? ""}
          onChange={(e) => onCapacity(e.target.value === "" ? null : Number(e.target.value))}
          className={inputClass()}
        />
      </div>

      {signups !== undefined && signups > 0 && form.questions.length > 0 && (
        <p className="rounded-xl bg-lime/40 px-3 py-2 text-sm">
          {signups} {signups === 1 ? "person has" : "people have"} signed up already. Removing a question or an option keeps their answers, but the
          list shows them by their code instead of the text.
        </p>
      )}

      {form.questions.length > 0 && (
        <ol className="grid gap-3">
          {form.questions.map((q, i) => (
            <li key={q.id} className="grid gap-3 rounded-xl border-2 border-ink/15 bg-paper p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="meta text-ink/50">#{i + 1}</span>
                <span className="font-display font-semibold tracking-tight">{typeNames[q.type]}</span>
                <label className="ml-2 flex cursor-pointer items-center gap-1.5 text-sm font-semibold">
                  <input type="checkbox" checked={q.required} onChange={(e) => setQuestion(i, { required: e.target.checked })} className="size-4 accent-violet" />
                  Required
                </label>
                <span className="ml-auto flex gap-1 text-sm font-semibold">
                  <button type="button" disabled={i === 0} onClick={() => moveQuestion(i, -1)} aria-label="Move up" className="px-1.5 disabled:opacity-30">
                    ↑
                  </button>
                  <button type="button" disabled={i === form.questions.length - 1} onClick={() => moveQuestion(i, 1)} aria-label="Move down" className="px-1.5 disabled:opacity-30">
                    ↓
                  </button>
                  <button type="button" onClick={() => onForm({ ...form, questions: form.questions.filter((_, j) => j !== i) })} className="px-1.5 text-red-700 hover:underline">
                    Remove
                  </button>
                </span>
              </div>
              <div className="grid gap-2 md:grid-cols-2 md:gap-3">
                {(["tr", "en"] as const).map((lang) => (
                  <div key={lang} className="flex items-start">
                    <span className="pt-2.5">
                      <LangTag label={lang.toUpperCase()} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <TextInput value={q[`label_${lang}`]} onChange={(v) => setQuestion(i, { [`label_${lang}`]: v })} placeholder={lang === "tr" ? "Soru" : "Question"} />
                    </div>
                  </div>
                ))}
              </div>
              {(q.type === "one" || q.type === "many") && (
                <div className="grid gap-2 border-l-4 border-ink/10 pl-3">
                  {(q.options ?? []).map((o, j) => (
                    <div key={o.id} className="flex flex-wrap items-center gap-2 md:flex-nowrap">
                      <span className="w-6 text-sm text-ink/50">{j + 1}.</span>
                      {(["tr", "en"] as const).map((lang) => (
                        <div key={lang} className="flex min-w-0 flex-1 items-center">
                          <LangTag label={lang.toUpperCase()} />
                          <input
                            value={o[lang]}
                            onChange={(e) => setQuestion(i, { options: q.options!.map((x, k) => (k === j ? { ...x, [lang]: e.target.value } : x)) })}
                            placeholder={lang === "tr" ? "Seçenek" : "Option"}
                            className={inputClass()}
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setQuestion(i, { options: q.options!.filter((_, k) => k !== j) })}
                        aria-label={`Remove option ${j + 1}`}
                        className="px-1.5 font-semibold text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setQuestion(i, { options: [...(q.options ?? []), { id: newId((q.options ?? []).map((o) => o.id)), tr: "", en: "" }] })}
                    className="w-fit text-sm font-semibold text-violet hover:underline"
                  >
                    + Add option
                  </button>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink/70">Add a question:</span>
        {(Object.keys(typeNames) as FormQuestion["type"][]).map((type) => (
          <button key={type} type="button" onClick={() => addQuestion(type)} disabled={form.questions.length >= 30} className="btn btn-paper min-h-9 px-3 text-sm">
            {typeNames[type]}
          </button>
        ))}
      </div>

      {problems.length > 0 && (
        <ul className="grid gap-1 text-sm font-medium text-red-700">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
