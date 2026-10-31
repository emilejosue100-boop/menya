"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Unlock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/i18n";

function authMessage(message: string, isSignUp: boolean) {
  const lower = message.toLowerCase();
  if (lower.includes("already") || lower.includes("registered")) return t("login.signUpError");
  if (lower.includes("anonymous")) return t("login.guestError");
  if (lower.includes("confirm")) return t("login.confirmEmail");
  return isSignUp ? t("login.signUpError") : t("login.authError");
}

export function LoginSignInForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotMessage, setShowForgotMessage] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  const isSignUp = mode === "signup";

  async function goHome() {
    router.replace("/");
    router.refresh();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError(t("login.emailRequired"));
      return;
    }
    if (!password) {
      setError(t("login.passwordRequired"));
      return;
    }

    setWorking(true);
    setError("");
    const supabase = createClient();

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: { data: { name: name.trim() } },
        });
        if (signUpError) {
          setError(authMessage(signUpError.message, true));
          return;
        }
        if (!data.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });
          if (signInError) {
            setError(t("login.confirmEmail"));
            return;
          }
        }
        await goHome();
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (signInError) {
        setError(authMessage(signInError.message, false));
        return;
      }
      await goHome();
    } catch {
      setError(isSignUp ? t("login.signUpError") : t("login.authError"));
    } finally {
      setWorking(false);
    }
  }

  function continueAsGuest() {
    router.push("/learn");
  }

  return (
    <Card className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8">
      <div>
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="font-headline-lg text-headline-lg text-text">
            {isSignUp ? t("login.signUpTitle") : t("login.signInTitle")}
          </h2>
          <p className="font-body-md text-body-md text-muted">
            {isSignUp ? t("login.signUpSubtitle") : t("login.signInSubtitle")}
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {isSignUp ? (
            <Input
              id="signup-name"
              name="name"
              label={t("login.name")}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("login.namePlaceholder")}
              leadingIcon={<Icon icon={User} />}
            />
          ) : null}
          <Input
            id="login-identifier"
            name="email"
            label={t("login.identifier")}
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("login.identifierPlaceholder")}
            leadingIcon={<Icon icon={Mail} />}
          />
          <Input
            id="login-password"
            name="password"
            label={t("login.password")}
            required
            autoComplete={isSignUp ? "new-password" : "current-password"}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••••••"
            labelExtra={
              isSignUp ? null : (
                <button
                  type="button"
                  className="font-label-md text-label-md text-primary hover:underline font-semibold"
                  onClick={() => setShowForgotMessage(true)}
                >
                  {t("login.forgotPassword")}
                </button>
              )
            }
            leadingIcon={<Icon icon={Lock} />}
            trailing={
              <button
                aria-label={t("login.togglePassword")}
                type="button"
                className="text-muted hover:text-text p-1 flex items-center"
                onClick={() => setShowPassword((value) => !value)}
              >
                <Icon icon={showPassword ? EyeOff : Eye} />
              </button>
            }
          />
          {showForgotMessage && !isSignUp ? (
            <p className="font-body-sm text-body-sm text-muted bg-primary-soft rounded-xl px-4 py-3">
              {t("login.forgotPasswordSoon")}
            </p>
          ) : null}
          {error ? (
            <p className="font-body-sm text-body-sm text-myth-red bg-myth-red/10 rounded-xl px-4 py-3" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" variant="primary" className="mt-2" disabled={working}>
            {working ? t("login.working") : isSignUp ? t("login.createAccount") : t("login.signIn")}
            <Icon icon={ArrowRight} />
          </Button>
        </form>
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full h-px bg-border" />
          <span className="absolute px-3 bg-surface font-label-sm text-label-sm text-muted uppercase tracking-wider">
            {t("common.or")}
          </span>
        </div>
        <Button variant="surface" className="gap-3" type="button">
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              fill="#4285F4"
            />
            <path
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              fill="#34A853"
            />
            <path
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              fill="#FBBC05"
            />
            <path
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              fill="#EA4335"
            />
          </svg>
          {t("login.google")}
        </Button>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={continueAsGuest}
            className="group px-4 py-2 bg-primary-soft hover:bg-lavender transition-colors rounded-full flex items-center gap-2 text-teal font-label-md text-label-md min-h-11 disabled:opacity-60"
          >
            <Icon icon={Unlock} />
            <span className="font-semibold underline underline-offset-4">{t("login.guest")}</span>
          </button>
        </div>
      </div>
      <div className="mt-8 text-center">
        {isSignUp ? (
          <p className="font-body-md text-body-md text-muted">
            {t("login.alreadyHaveAccount")}
            <button
              type="button"
              className="text-primary font-bold hover:underline ml-1"
              onClick={() => {
                setMode("signin");
                setError("");
              }}
            >
              {t("login.signInLink")}
            </button>
          </p>
        ) : (
          <p className="font-body-md text-body-md text-muted">
            {t("login.newHere")}
            <button
              type="button"
              className="text-primary font-bold hover:underline ml-1"
              onClick={() => {
                setMode("signup");
                setShowForgotMessage(false);
                setError("");
              }}
            >
              {t("login.createAccountLink")}
            </button>
          </p>
        )}
      </div>
    </Card>
  );
}
