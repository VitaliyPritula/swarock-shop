import { Link } from '@/src/i18n/routing';
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Вхід — SVAROCK" }] }),
  component: AuthPage,
});

function AuthPage() {
  // const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("З поверненням!");
        nav({ to: "/account" });
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Реєстрація успішна");
        nav({ to: "/account" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(res.error.message);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-2xl uppercase tracking-widest">
        {mode === "login" ? "Вхід" : "Реєстрація"}
      </h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" className="w-full rounded border px-3 py-2" />
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль" className="w-full rounded border px-3 py-2" />
        <button disabled={loading} className="w-full rounded bg-[color:var(--brand)] py-2 font-display uppercase tracking-widest text-white disabled:opacity-60">
          {loading ? "…" : mode === "login" ? "Увійти" : "Зареєструватися"}
        </button>
      </form>
      <button onClick={google} className="mt-3 w-full rounded border py-2 text-sm">
        Увійти через Google
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 w-full text-sm text-muted-foreground"
      >
        {mode === "login" ? "Немає акаунту? Реєстрація" : "Вже маю акаунт — увійти"}
      </button>
    </div>
  );
}
