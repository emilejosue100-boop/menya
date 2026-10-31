"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/i18n";

function initialFromUser(email?: string, name?: string, anonymous?: boolean) {
  if (anonymous) return "G";
  const source = name?.trim() || email?.trim() || "M";
  return source[0]?.toUpperCase() ?? "M";
}

export function UserMenu() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState("M");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    function applyUser(user: { email?: string; is_anonymous?: boolean; user_metadata?: { name?: string } } | null) {
      setInitial(initialFromUser(user?.email, user?.user_metadata?.name, user?.is_anonymous));
      setReady(true);
    }

    supabase.auth.getUser().then(({ data }) => applyUser(data.user)).catch(() => applyUser(null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label={t("login.signOut")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="w-9 h-9 rounded-full bg-primary-soft text-primary font-label-md text-label-md font-bold flex items-center justify-center shrink-0 duration-200 ease-out hover:bg-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {ready ? initial : "M"}
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 min-w-40 rounded-xl border border-border bg-surface p-2 z-50">
          <button
            type="button"
            onClick={() => void signOut()}
            className="w-full min-h-11 px-3 rounded-xl text-left font-label-md text-label-md text-text hover:bg-primary-soft duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("login.signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
