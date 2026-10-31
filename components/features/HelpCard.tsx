"use client";

import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { type HelpPlace } from "@/lib/help";
import { t } from "@/lib/i18n";

type HelpCardProps = {
  place: HelpPlace;
  selected?: boolean;
  matched?: boolean;
  onSelect: (id: string) => void;
};

export function HelpCard({ place, selected = false, matched = false, onSelect }: HelpCardProps) {
  const offers = place.kind === "group" ? t("help.groupOffer") : place.offers.join(", ");
  const qualifies = place.kind === "group" ? t("help.groupQualify") : place.whoQualifies;
  const apply = place.kind === "group" ? t("help.groupApply") : place.howToApply;

  return (
    <button
      type="button"
      id={`help-card-${place.id}`}
      onClick={() => onSelect(place.id)}
      className="text-left w-full"
    >
      <Card
        className={`${selected ? "border-primary" : matched ? "border-lavender" : ""} ${matched ? "ring-2 ring-lavender/40" : ""}`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-headline-sm text-headline-sm text-text">{place.name}</h3>
          {place.verified ? (
            <Badge tone="teal">
              <Icon icon={BadgeCheck} size="sm" />
              {t("common.verified")}
            </Badge>
          ) : null}
        </div>
        <p className="font-label-sm text-label-sm text-muted mt-4">{t("help.offersLabel")}</p>
        <p className="font-body-md text-body-md text-text">{offers}</p>
        <p className="font-label-sm text-label-sm text-muted mt-3">{t("help.qualifiesLabel")}</p>
        <p className="font-body-sm text-body-sm text-text">{qualifies}</p>
        <p className="font-label-sm text-label-sm text-muted mt-3">{t("help.applyLabel")}</p>
        <p className="font-body-sm text-body-sm text-text">{apply}</p>
      </Card>
    </button>
  );
}
