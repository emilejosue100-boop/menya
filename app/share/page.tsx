import { SurvivorMatchForm } from "@/components/features/SurvivorMatchForm";
import { PageShell } from "@/components/layout/PageShell";
import { loadCancers, loadSupportGroups, loadSurvivors } from "@/lib/data";
import { t } from "@/lib/i18n";

export default async function SharePage() {
  const [cancers, groups, survivors] = await Promise.all([loadCancers(), loadSupportGroups(), loadSurvivors()]);

  return (
    <PageShell>
      <header className="flex flex-col gap-4">
        <h1 className="font-headline-lg text-headline-lg text-text">{t("share.title")}</h1>
        <p className="font-body-md text-body-md text-muted max-w-[65ch]">{t("share.subtitle")}</p>
      </header>
      <SurvivorMatchForm cancers={cancers} groups={groups} survivors={survivors} />
    </PageShell>
  );
}
