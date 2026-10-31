"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { t } from "@/lib/i18n";

type LanguageSelectorProps = {
  compact?: boolean;
};

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("language.english")}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="h-10 min-h-11 min-w-11 px-2 lg:px-3 bg-surface hover:bg-primary-soft duration-200 ease-out rounded-xl border border-border flex items-center justify-center gap-2 text-text font-label-md text-label-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Icon icon={Globe} className="text-primary" />
        <span className={compact ? "hidden xl:inline whitespace-nowrap" : "whitespace-nowrap"}>{t("language.english")}</span>
        <span className={compact ? "hidden xl:flex items-center" : "flex items-center"}>
          <Icon icon={ChevronDown} className="text-muted" />
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-52 bg-surface rounded-2xl border border-border p-4 z-30">
          <p className="font-label-md text-label-md text-text">{t("language.english")}</p>
          <p className="font-body-sm text-body-sm text-muted mt-1 max-w-[65ch]">{t("language.comingSoon")}</p>
        </div>
      ) : null}
    </div>
  );
}
