"use client";

import { useRef, useState } from "react";
import { ArrowRight, Mic, Search } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { t } from "@/lib/i18n";

export function HomeHeroSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultPlaceholder = t("home.searchPlaceholder");
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);

  const prompts = [
    { text: t("home.promptBreast"), dot: "bg-coral", value: t("home.promptBreast") },
    { text: t("home.promptScreening"), dot: "bg-teal", value: t("home.promptScreening") },
    { text: t("home.promptSurvivor"), dot: "bg-primary", value: t("home.promptSurvivor") },
    { text: t("home.promptHpv"), dot: "bg-lavender", value: t("home.promptHpv"), hiddenOnMobile: true },
  ];

  function fillPrompt(value: string) {
    if (inputRef.current) {
      inputRef.current.value = value;
      inputRef.current.focus();
    }
  }

  return (
    <div className="flex flex-col gap-2 pt-1">
      <form
        className="w-full relative flex items-center gap-2 bg-surface rounded-xl border border-border duration-200 ease-out focus-within:ring-2 focus-within:ring-primary pl-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <Icon icon={Search} className="text-muted" />
        <input
          ref={inputRef}
          className="w-full h-12 pr-4 bg-transparent text-text placeholder:text-muted focus:outline-none font-body-md text-body-md min-w-0"
          placeholder={placeholder}
          type="text"
        />
        <div className="flex items-center gap-2 pr-2 shrink-0">
          <button
            aria-label={t("home.voiceInput")}
            type="button"
            className="w-11 h-11 rounded-full flex items-center justify-center text-primary hover:bg-primary-soft duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => {
              setPlaceholder(t("home.searchListening"));
              window.setTimeout(() => setPlaceholder(defaultPlaceholder), 4000);
            }}
          >
            <Icon icon={Mic} />
          </button>
          <button
            type="submit"
            className="h-11 min-w-11 px-3 sm:px-4 rounded-xl bg-primary text-surface font-label-md text-label-md flex items-center gap-2 duration-200 ease-out hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="hidden sm:inline">{t("home.ask")}</span>
            <Icon icon={ArrowRight} />
          </button>
        </div>
      </form>
      <div className="flex items-center gap-1 flex-wrap pt-1">
        <span className="font-label-sm text-label-sm text-muted mr-1">{t("home.tryAsking")}</span>
        {prompts.map((prompt) => (
          <Chip
            key={prompt.text}
            dotClassName={prompt.dot}
            className={prompt.hiddenOnMobile ? "hidden sm:inline-flex" : undefined}
            onClick={() => fillPrompt(prompt.value)}
          >
            {prompt.text}
          </Chip>
        ))}
      </div>
    </div>
  );
}
