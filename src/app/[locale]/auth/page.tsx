'use client'
import { useRouter } from "@/src/i18n/routing";
import { supabase } from "@/src/lovable/client";
import { lovable } from "@/src/lovable/index";
import { Eye, EyeOff } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Auth');
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function redirectIfAuthenticated() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/account", { locale });
      }
    }

    redirectIfAuthenticated();
  }, [router, locale]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const trimmedEmail = email.trim();
    const trimmedPassword = password;

    if (!trimmedEmail || !trimmedPassword) {
      toast.error(t('missingCredentials'));
      setLoading(false);
      return;
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password: trimmedPassword });
        if (error) throw error;
        toast.success(t("welcomeBack"));
        router.push("/account", { locale });
      } else {
        const { error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success(t("signupSuccess"));
        router.push("/account", { locale });
      }
    } catch (err) {
      let message = t('unknownError');
      if (err instanceof Error) {
        if (err.message.includes('Invalid login credentials') || err.message.includes('invalid login credentials')) {
          message = t('invalidCredentials');
        } else {
          message = err.message;
        }
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(res.error instanceof Error ? res.error.message : t("error"));
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-2xl uppercase tracking-widest">
        {mode === "login" ? t("login") : t("signup")}
      </h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder={t("email")} className="w-full rounded border px-3 py-2" />
        <div className="relative">
          <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={t("password")} className="w-full rounded border px-3 py-2 pr-10" />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <button disabled={loading} className="w-full rounded bg-[#1D1D24] py-2 font-display uppercase tracking-widest text-white disabled:opacity-60">
          {loading ? "…" : mode === "login" ? t("signIn") : t("signUp")}
        </button>
      </form>
      <button onClick={google} className="mt-3 w-full rounded border py-2 text-sm">
        {t("signInWithGoogle")}
      </button>
      <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 w-full text-sm text-primary">
        {mode === "login" ? t("needAccount") : t("haveAccount")}
      </button>
    </div>
  );
}