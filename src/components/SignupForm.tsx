import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import type { ClubEvent } from "../content/events";
import { useContent } from "../content/i18n";
import { fetchPlacesLeft, signUp, type Signup } from "../content/load";
import type { EventForm, FormQuestion } from "../content/schema";

type Answer = string | string[] | boolean;
type Errors = Map<string, string>;

/** Same limits as sign_up_for_event() in supabase/migrations/0007_event_signups.sql. */
const TEXT_MAX = { text: 300, textarea: 2000 } as const;

const inputClass = (error?: string) =>
  `w-full rounded-xl border-2 bg-paper px-4 py-3 text-base text-ink outline-none transition-[border-color,box-shadow] focus:border-violet focus:shadow-[3px_3px_0_0_var(--color-violet)] ${
    error ? "border-red-600" : "border-ink"
  }`;

/** Digits of a Turkish mobile number without +90 / 0: "0532 123 45 67" → "5321234567". */
const phoneDigits = (v: string) => {
  let d = v.replace(/\D/g, "");
  if (d.length > 10 && d.startsWith("90")) d = d.slice(2);
  return d.replace(/^0+/, "");
};

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-display text-[15px] font-semibold tracking-tight">
        {label}
        {optional && <span className="ml-1.5 font-sans text-sm font-normal text-ink/55">({optional})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

/** One of the event's own questions, in the page's language. */
function Question({ q, value, error, onChange }: { q: FormQuestion; value: Answer | undefined; error?: string; onChange: (v: Answer) => void }) {
  const { events, locale } = useContent();
  const t = events.signup;
  const id = useId();
  const label = q[`label_${locale}`];
  const described = error ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};
  const errorText = error && (
    <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-700">
      {error}
    </p>
  );

  if (q.type === "yesno") {
    return (
      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-violet" {...described} />
          <span className="font-medium">
            {label}
            {!q.required && <span className="ml-1.5 text-sm font-normal text-ink/55">({t.optional})</span>}
          </span>
        </label>
        {errorText}
      </div>
    );
  }

  if (q.type === "one" || q.type === "many") {
    const picked = q.type === "many" ? ((value as string[] | undefined) ?? []) : [value as string | undefined];
    return (
      <fieldset {...described}>
        <legend className="mb-2 font-display text-[15px] font-semibold tracking-tight">
          {label}
          {!q.required && <span className="ml-1.5 font-sans text-sm font-normal text-ink/55">({t.optional})</span>}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options?.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-ink/20 px-4 py-3 has-checked:border-violet has-checked:bg-violet/5">
              <input
                type={q.type === "one" ? "radio" : "checkbox"}
                name={id}
                checked={picked.includes(o.id)}
                onChange={(e) =>
                  onChange(q.type === "one" ? o.id : e.target.checked ? [...picked.filter(Boolean), o.id] as string[] : (picked as string[]).filter((p) => p !== o.id))
                }
                className="size-5 shrink-0 accent-violet"
              />
              <span>{o[locale]}</span>
            </label>
          ))}
        </div>
        {errorText}
      </fieldset>
    );
  }

  return (
    <Field id={id} label={label} optional={q.required ? undefined : t.optional} error={error}>
      {q.type === "textarea" ? (
        <textarea id={id} rows={4} maxLength={TEXT_MAX.textarea} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className={`${inputClass(error)} resize-y`} {...described} />
      ) : (
        <input id={id} maxLength={TEXT_MAX.text} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className={inputClass(error)} {...described} />
      )}
    </Field>
  );
}

/**
 * An event's sign-up form, built from the questions set for it in the admin panel. Sends through
 * sign_up_for_event(), which checks everything again and answers with a place or the waitlist.
 */
export function SignupForm({ event: e, form, after }: { event: ClubEvent; form: EventForm; /** Shown under the confirmation. */ after?: ReactNode }) {
  const { events } = useContent();
  const t = events.signup;
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentNo, setStudentNo] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof signUp>>>();
  const [placesLeft, setPlacesLeft] = useState<number | null>();

  useEffect(() => {
    fetchPlacesLeft(e.id).then(setPlacesLeft);
  }, [e.id, result]);

  function check(): Errors {
    const errors: Errors = new Map();
    if (name.trim().length < 2) errors.set("name", t.required);
    if (!email.trim()) errors.set("email", t.required);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.set("email", t.invalidEmail);
    if (form.ask_student_no && !/^\d{9}$/.test(studentNo.trim())) errors.set("studentNo", studentNo.trim() ? t.invalidStudentNo : t.required);
    if (form.ask_phone && !/^5\d{9}$/.test(phoneDigits(phone))) errors.set("phone", phone.trim() ? t.invalidPhone : t.required);
    for (const q of form.questions) {
      const a = answers[q.id];
      const empty = a === undefined || a === false || (typeof a === "string" && !a.trim()) || (Array.isArray(a) && !a.length);
      if (q.required && empty) errors.set(q.id, t.required);
      else if ((q.type === "text" || q.type === "textarea") && typeof a === "string" && a.trim().length > TEXT_MAX[q.type]) errors.set(q.id, t.tooLong);
    }
    if (!consent) errors.set("consent", t.required);
    return errors;
  }
  const errors = showErrors ? check() : new Map<string, string>();

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    const found = check();
    if (found.size) {
      setShowErrors(true);
      // Focus the first field with a problem
      requestAnimationFrame(() => document.querySelector<HTMLElement>(`#signup [aria-invalid="true"], #signup [aria-invalid="true"] input`)?.focus());
      return;
    }
    // A field only bots fill in: act as if it worked, send nothing.
    if (honeypot) return setResult("confirmed");
    setSending(true);
    const clean: Signup["answers"] = {};
    for (const q of form.questions) {
      const a = answers[q.id];
      if (typeof a === "string" && a.trim()) clean[q.id] = a.trim();
      else if (Array.isArray(a) && a.length) clean[q.id] = a;
      else if (a === true) clean[q.id] = true;
    }
    setResult(
      await signUp(e.id, {
        name: name.trim(),
        email: email.trim(),
        studentNo: form.ask_student_no ? studentNo.trim() : null,
        phone: form.ask_phone ? phoneDigits(phone) : null,
        answers: clean,
        consent,
      }),
    );
    setSending(false);
  }

  if (result === "confirmed" || result === "waitlist") {
    return (
      <div className="grid gap-6">
        <div role="status" className="rounded-3xl border-2 border-ink bg-lime p-6 shadow-[var(--shadow-brut-sm)] md:p-8">
          <p className="font-display text-2xl font-bold tracking-tight">{result === "confirmed" ? t.done : t.waitlisted}</p>
        </div>
        {after}
      </div>
    );
  }

  const invalid = (key: string) => (errors.has(key) ? { "aria-invalid": true, "aria-describedby": `${id}-${key}-error` } : {});

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-6 rounded-3xl border-2 border-ink bg-paper p-5 shadow-[var(--shadow-brut)] md:p-8">
      {placesLeft !== undefined && placesLeft !== null && (
        <p className={`pill w-fit border-2 border-ink px-3 py-1.5 ${placesLeft > 0 ? "bg-lime" : "bg-paper"}`}>{placesLeft > 0 ? t.placesLeft(placesLeft) : t.full}</p>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <Field id={`${id}-name`} label={t.name} error={errors.get("name")}>
          <input id={`${id}-name`} autoComplete="name" maxLength={120} value={name} onChange={(v) => setName(v.target.value)} className={inputClass(errors.get("name"))} {...invalid("name")} />
        </Field>
        <Field id={`${id}-email`} label={t.email} error={errors.get("email")}>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(v) => setEmail(v.target.value)}
            className={inputClass(errors.get("email"))}
            {...invalid("email")}
          />
        </Field>
        {form.ask_student_no && (
          <Field id={`${id}-studentNo`} label={t.studentNo} error={errors.get("studentNo")}>
            <input
              id={`${id}-studentNo`}
              inputMode="numeric"
              maxLength={9}
              value={studentNo}
              onChange={(v) => setStudentNo(v.target.value.replace(/\D/g, ""))}
              className={inputClass(errors.get("studentNo"))}
              {...invalid("studentNo")}
            />
          </Field>
        )}
        {form.ask_phone && (
          <Field id={`${id}-phone`} label={t.phone} error={errors.get("phone")}>
            <input
              id={`${id}-phone`}
              type="tel"
              autoComplete="tel-national"
              placeholder="5XX XXX XX XX"
              maxLength={20}
              value={phone}
              onChange={(v) => setPhone(v.target.value)}
              className={inputClass(errors.get("phone"))}
              {...invalid("phone")}
            />
          </Field>
        )}
      </div>

      {form.questions.map((q) => (
        <Question key={q.id} q={q} value={answers[q.id]} error={errors.get(q.id)} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
      ))}

      <div className="grid gap-3">
        <details className="rounded-xl border-2 border-ink/20 bg-fog px-4 py-3 text-sm leading-relaxed">
          <summary className="cursor-pointer font-display font-semibold">{t.noticeTitle}</summary>
          <p className="mt-3 whitespace-pre-line text-ink/80">{t.notice}</p>
        </details>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={consent} onChange={(v) => setConsent(v.target.checked)} className="mt-0.5 size-5 shrink-0 accent-violet" {...invalid("consent")} />
          <span className="text-sm leading-relaxed">{t.consent}</span>
        </label>
        {errors.get("consent") && (
          <p id={`${id}-consent-error`} className="text-sm font-medium text-red-700">
            {errors.get("consent")}
          </p>
        )}
      </div>

      {/* Left empty by people; bots that fill every field get a fake success */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={honeypot} onChange={(v) => setHoneypot(v.target.value)} />
      </div>

      {result && (
        <p role="alert" className="font-medium text-red-700">
          {t[result]}
        </p>
      )}
      <button type="submit" disabled={sending} className="btn btn-lime w-fit md:btn-lg">
        {sending ? t.sending : t.submit}
      </button>
    </form>
  );
}
