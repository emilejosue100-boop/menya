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

function authMessage(error: { message?: string; code?: string }, isSignUp: boolean) {
  const lower = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();
  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    lower.includes("already registered") ||
    lower.includes("already been registered") ||
    lower.includes("user already")
  ) {
    return t("login.signUpExists");
  }
  if (code === "invalid_credentials" || lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return t("login.authError");
  }
  if (lower.includes("anonymous")) return t("login.guestError");
  if (code === "email_not_confirmed" || lower.includes("confirm")) return t("login.confirmEmail");
  return isSignUp ? t("login.signUpError") : t("login.authError");
}

function isExistingAccount(user: { identities?: { id?: string }[] | null } | null | undefined) {
  return Boolean(user && Array.isArray(user.identities) && user.identities.length === 0);
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
          setError(authMessage(signUpError, true));
          return;
        }
        if (isExistingAccount(data.user)) {
          setError(t("login.signUpExists"));
          return;
        }
        if (!data.session) {
          setError(t("login.confirmEmail"));
          return;
        }
        await goHome();
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (signInError) {
        setError(authMessage(signInError, false));
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
        <div className="mt-6 flex flex-col gap-2">
          <Button variant="surface" type="button" disabled={working} onClick={continueAsGuest}>
            <Icon icon={Unlock} />
            {t("login.guest")}
          </Button>
          <p className="font-body-sm text-body-sm text-muted text-center">{t("login.guestHint")}</p>
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
