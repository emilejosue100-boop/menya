import { HelpSearch } from "@/components/features/HelpSearch";
import { PageShell } from "@/components/layout/PageShell";
import { loadOrganisations, loadSupportGroups } from "@/lib/data";
import { buildHelpPlaces } from "@/lib/help";
import { t } from "@/lib/i18n";

export default async function HelpPage() {
  const [organisations, groups] = await Promise.all([loadOrganisations(), loadSupportGroups()]);

  return (
    <PageShell>
      <header className="flex flex-col gap-4">
        <h1 className="font-headline-lg text-headline-lg text-text">{t("help.title")}</h1>
        <p className="font-body-md text-body-md text-muted max-w-[65ch]">{t("help.subtitle")}</p>
      </header>
      <HelpSearch places={buildHelpPlaces(organisations, groups)} />
    </PageShell>
  );
}
