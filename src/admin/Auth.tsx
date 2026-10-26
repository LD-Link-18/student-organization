import { useState, type FormEvent, type ReactNode } from "react";
import { inputClass } from "./fields";
import { supabase } from "./supabase";

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-violet p-4">
      <div className="w-full max-w-md rounded-3xl border-2 border-ink bg-paper p-6 shadow-[var(--shadow-brut)] md:p-8">
        <p className="meta text-ink/60">Site admin</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">{title}</h1>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}

function Message({ text, error }: { text: string; error?: boolean }) {
  return text ? <p className={`mt-4 text-sm font-medium ${error ? "text-red-700" : "text-ink/75"}`}>{text}</p> : null;
}

const fieldLabel = "mb-1.5 block font-display text-[15px] font-semibold tracking-tight";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMessage({ text: error.message, error: true });
  }

  async function reset() {
    if (!email) return setMessage({ text: "Type your email first.", error: true });
    setBusy(true);
    const { error } = await supabase!.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/` });
    setBusy(false);
    setMessage(error ? { text: error.message, error: true } : { text: "If that address has an account, a reset link is on its way.", error: false });
  }

  return (
    <Card title="Sign in">
      <form onSubmit={signIn} className="grid gap-4">
        <div>
          <label htmlFor="email" className={fieldLabel}>
            Email
          </label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass()} />
        </div>
        <div>
          <label htmlFor="password" className={fieldLabel}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass()}
          />
        </div>
        <button type="submit" disabled={busy} className="btn btn-lime mt-2">
          Sign in
        </button>
      </form>
      <button type="button" onClick={reset} disabled={busy} className="mt-4 text-sm font-semibold text-violet hover:underline">
        Forgot your password?
      </button>
      <Message {...message} />
    </Card>
  );
}

/** After an invitation or password-reset link: choose a password before going on. */
export function SetPassword({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("At least 8 characters.");
    setBusy(true);
    const { error } = await supabase!.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else onDone();
  }

  return (
    <Card title="Choose a password">
      <form onSubmit={save} className="grid gap-4">
        <div>
          <label htmlFor="new-password" className={fieldLabel}>
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass()}
          />
        </div>
        <button type="submit" disabled={busy} className="btn btn-lime mt-2">
          Save password
        </button>
      </form>
      <Message text={error} error />
    </Card>
  );
}

export function NoAccess({ email }: { email?: string }) {
  return (
    <Card title="No access">
      <p className="leading-relaxed text-ink/75">
        {email} can sign in but isn't an admin. Ask an existing admin to add you (see the README, "Adding an admin").
      </p>
      <button type="button" onClick={() => supabase!.auth.signOut()} className="btn btn-paper mt-6">
        Sign out
      </button>
    </Card>
  );
}

export function NotConfigured() {
  return (
    <Card title="Not set up yet">
      <p className="leading-relaxed text-ink/75">
        Set <code className="font-semibold">VITE_SUPABASE_URL</code> and <code className="font-semibold">VITE_SUPABASE_PUBLISHABLE_KEY</code> (in{" "}
        <code>.env.local</code> for the dev server, in Vercel's environment variables for the live site). The README's "Admin panel" section walks
        through it.
      </p>
    </Card>
  );
}

export function Loading() {
  return <main className="grid min-h-dvh place-items-center bg-fog font-display text-lg text-ink/60">Loading…</main>;
}
