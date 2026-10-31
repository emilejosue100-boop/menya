"use client";

import { useState, type KeyboardEvent } from "react";
import { Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { type Myth } from "@/lib/learn";
import { t } from "@/lib/i18n";

type MythCardFlipProps = {
  myth: Myth;
};

export function MythCardFlip({ myth }: MythCardFlipProps) {
  const [flipped, setFlipped] = useState(false);
  const [audioNote, setAudioNote] = useState(false);

  function toggle() {
    setFlipped((value) => !value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl" style={{ perspective: "1200px" }}>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className="relative w-full min-h-[280px] cursor-pointer duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 200ms ease-out",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4"
          aria-hidden={flipped}
          style={{ backfaceVisibility: "hidden", pointerEvents: flipped ? "none" : "auto" }}
        >
          <div className="flex items-start justify-between gap-2">
            <Badge tone="myth">{t("learn.mythTag")}</Badge>
            <button
              type="button"
              aria-label={t("learn.speakerLabel")}
              className="min-h-11 min-w-11 rounded-full hover:bg-primary-soft text-muted flex items-center justify-center"
              onClick={(event) => {
                event.stopPropagation();
                setAudioNote(true);
              }}
            >
              <Icon icon={Volume2} />
            </button>
          </div>
          <p className="font-headline-md text-headline-md text-text flex-1">“{myth.myth}”</p>
          <div>
            <p className="font-label-sm text-label-sm text-muted uppercase tracking-wider">{t("learn.whyBelieve")}</p>
            <p className="font-body-sm text-body-sm text-muted mt-1">{myth.why_people_believe}</p>
          </div>
          <p className="font-label-md text-label-md text-primary">{t("learn.tapTruth")}</p>
          {audioNote ? <p className="font-body-sm text-body-sm text-muted">{t("learn.audioSoon")}</p> : null}
        </div>
        <div
          className="absolute inset-0 bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4"
          aria-hidden={!flipped}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: flipped ? "auto" : "none",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <Badge tone="teal">{t("learn.factTag")}</Badge>
            <Badge tone="teal">{t("learn.verifiedWho")}</Badge>
          </div>
          <p className="font-body-md text-body-md text-text flex-1">{myth.fact}</p>
          <div className="bg-primary-soft rounded-xl p-4">
            <p className="font-label-md text-label-md text-primary mb-1">{t("learn.whatToDo")}</p>
            <p className="font-body-sm text-body-sm text-text">{myth.what_to_do}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
