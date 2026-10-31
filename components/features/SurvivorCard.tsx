"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { getCancer } from "@/lib/learn";
import { initials, type RankedSurvivor } from "@/lib/share";
import { t, tReplace } from "@/lib/i18n";

type SurvivorCardProps = {
  survivor: RankedSurvivor;
  compact?: boolean;
};

export function SurvivorCard({ survivor, compact = false }: SurvivorCardProps) {
  const [voiceNote, setVoiceNote] = useState(false);
  const [chatNote, setChatNote] = useState(false);
  const cancerName = (getCancer(survivor.cancer)?.name ?? survivor.cancer).toLowerCase();
  const reason =
    survivor.matchReason ||
    tReplace("share.reason", {
      name: survivor.name,
      cancer: cancerName,
      city: survivor.city,
    });

  return (
    <Card padding={compact ? "md" : "lg"} className={compact ? "" : "border-lavender"}>
      <div className={`flex gap-4 ${compact ? "items-center" : "items-start"}`}>
        <div
          className={`${compact ? "w-12 h-12" : "w-16 h-16"} rounded-full bg-primary-soft text-primary flex items-center justify-center font-headline-sm text-headline-sm shrink-0`}
        >
          {initials(survivor.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-headline-sm text-headline-sm text-text">{survivor.name}</h3>
            {survivor.is_demo ? <Badge tone="coral">{t("common.demoProfile")}</Badge> : null}
          </div>
          <p className="font-body-sm text-body-sm text-muted mt-1">
            {getCancer(survivor.cancer)?.name ?? survivor.cancer} · {survivor.city}
          </p>
        </div>
      </div>
      {compact ? (
        <p className="font-body-sm text-body-sm text-muted mt-4">{reason}</p>
      ) : (
        <>
          <p className="font-body-md text-body-md text-text mt-4">{survivor.story}</p>
          <p className="font-body-sm text-body-sm text-primary mt-4">{reason}</p>
          {voiceNote ? <p className="font-body-sm text-body-sm text-muted mt-3">{t("share.voiceSoon")}</p> : null}
          {chatNote ? (
            <Card tone="soft" padding="md" className="mt-4">
              <p className="font-body-sm text-body-sm text-text">{t("share.chatSoon")}</p>
            </Card>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button
              type="button"
              variant="surface"
              className="sm:w-auto px-6"
              onClick={() => setVoiceNote(true)}
              aria-label={t("share.playVoice")}
            >
              <Icon icon={PlayCircle} />
              {t("share.playVoice")}
            </Button>
            <Button type="button" className="sm:w-auto px-6" onClick={() => setChatNote(true)}>
              {t("share.sendMessage")}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
