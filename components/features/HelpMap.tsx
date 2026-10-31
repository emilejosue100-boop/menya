"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/Card";
import { type HelpPlace } from "@/lib/help";
import { t } from "@/lib/i18n";

type HelpMapProps = {
  places: HelpPlace[];
  matchedIds: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const HelpMapCanvas = dynamic(() => import("@/components/features/HelpMapCanvas"), {
  ssr: false,
  loading: () => (
    <Card className="h-full min-h-[320px] flex items-center justify-center">
      <p className="font-body-md text-body-md text-muted animate-pulse">{t("help.loading")}</p>
    </Card>
  ),
});

export function HelpMap(props: HelpMapProps) {
  return (
    <div className="h-[328px] min-h-[328px] md:h-full md:min-h-[480px] rounded-2xl overflow-hidden border border-border bg-surface">
      <HelpMapCanvas {...props} />
    </div>
  );
}
