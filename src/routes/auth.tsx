import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Leaf, Store, Users, HeartHandshake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth, type AppRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — PlateFull" },
      { name: "description", content: "Join PlateFull as a user, restaurant, or NGO." },
    ],
  }),
  component: AuthPage,
});

const roleOptions: { value: AppRole; label: string; icon: typeof Users; blurb: string }[] = [
  { value: "user", label: "Everyday user", icon: Users, blurb: "Grab discounted meals near you" },
  { value: "restaurant", label: "Restaurant", icon: Store, blurb: "Donate surplus & run flash sales" },
  { value: "ngo", label: "NGO", icon: HeartHandshake, blurb: "Claim donations & feed communities" },
];

function AuthPage() {
  const navigate = useNavigate();
  const { user, role, refreshRole } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("user");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If already authed and has role -> redirect to dashboard
  useEffect(() => {
    if (user && role) {
      navigate({ to: role === "user" ? "/dashboard/user" : role === "restaurant" ? "/dashboard/restaurant" : "/dashboard/ngo" });
    }
  }, [user, role, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName || email.split("@")[0] }, emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        const uid = data.user?.id;
        if (uid) {
          const { error: rErr } = await supabase.from("user_roles").insert({ user_id: uid, role: selectedRole });
          if (rErr && !rErr.message.includes("duplicate")) throw rErr;
        }
        await refreshRole();
        setMsg("Account created!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await refreshRole();
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setMsg(null);
    // Store desired role in localStorage so we can apply it after redirect if new user
    if (mode === "signup") localStorage.setItem("platefull:pending_role", selectedRole);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) {
      setMsg(result.error.message);
      setBusy(false);
    }
  };

  // After Google returns, assign pending role if any
  useEffect(() => {
    if (!user) return;
    const pending = localStorage.getItem("platefull:pending_role") as AppRole | null;
    if (pending && !role) {
      supabase.from("user_roles").insert({ user_id: user.id, role: pending }).then(() => {
        localStorage.removeItem("platefull:pending_role");
        refreshRole();
      });
    } else if (user && !role) {
      // Prompt role selection inline (fallthrough UI)
    }
  }, [user, role, refreshRole]);

  // If signed in but no role yet: show role picker to assign
  if (user && !role) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong w-full max-w-lg rounded-3xl p-8">
          <h1 className="font-display text-3xl">Choose your role</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick how you'll use PlateFull.</p>
          <div className="mt-6 space-y-3">
            {roleOptions.map((r) => (
              <button
                key={r.value}
                onClick={async () => {
                  setBusy(true);
                  await supabase.from("user_roles").insert({ user_id: user.id, role: r.value });
                  await refreshRole();
                }}
                disabled={busy}
                className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                  <r.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.blurb}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong w-full max-w-md rounded-3xl p-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground glow-emerald">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-display text-2xl">PlateFull</span>
        </div>
        <h1 className="font-display text-3xl">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to your PlateFull account." : "Join the rescue in under a minute."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <>
              <input
                required
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50"
              />
              <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">I am a</p>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((r) => (
                    <button
                      type="button"
                      key={r.value}
                      onClick={() => setSelectedRole(r.value)}
                      className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs transition ${
                        selectedRole === r.value
                          ? "border-primary/60 bg-primary/10 text-foreground"
                          : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                      }`}
                    >
                      <r.icon className="h-4 w-4" />
                      {r.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50"
          />
          <input
            required
            type="password"
            placeholder="Password (min 6)"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          onClick={google}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm hover:bg-white/10 disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.4-1.7 4.2-5.4 4.2-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.9 14.7 3 12 3 6.9 3 2.9 7 2.9 12s4 9 9.1 9c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1-.2-1.8H12z"/></svg>
          Continue with Google
        </button>

        {msg && <p className="mt-4 text-center text-sm text-accent">{msg}</p>}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New to PlateFull?" : "Already have an account?"}{" "}
          <button
            className="font-medium text-primary hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
