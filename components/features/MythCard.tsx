import { ArrowRight, CircleCheck, CircleX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { t } from "@/lib/i18n";
import type { Myth } from "@/lib/learn";

type MythCardProps = {
  myth: Myth;
};

export function MythCard({ myth }: MythCardProps) {
  return (
    <section className="w-full bg-surface rounded-2xl p-6 border border-border flex flex-col md:flex-row items-stretch gap-6">
      <div className="flex md:flex-col items-center justify-center p-4 rounded-xl bg-myth-red/15 shrink-0 text-center gap-2 md:w-48">
        <span className="w-14 h-14 rounded-full bg-myth-red/20 flex items-center justify-center text-myth-red">
          <Icon icon={CircleX} size="xl" />
        </span>
        <div className="flex flex-col text-left md:text-center">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-myth-red font-bold">
            {t("home.mythEyebrow")}
          </span>
          <span className="font-body-sm text-body-sm text-muted">{t("home.mythNumber")}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-muted">{t("home.mythHeard")}</span>
          <h3 className="font-headline-sm text-headline-sm text-text italic">“{myth.myth}”</h3>
        </div>
        <div className="p-4 rounded-xl bg-teal/10 flex items-start gap-2">
          <Icon icon={CircleCheck} className="text-teal mt-0.5" />
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-teal font-bold">{t("home.mythTruth")}</span>
            <p className="font-body-md text-body-md text-text max-w-[65ch]">{myth.fact}</p>
          </div>
        </div>
      </div>
      <div className="flex md:flex-col items-center justify-center shrink-0">
        <Button href="/learn" variant="ghost" className="w-full md:w-auto px-6">
          {t("home.seeTheTruth")}
          <Icon icon={ArrowRight} />
        </Button>
      </div>
    </section>
  );
}
