import { Suspense } from "react";
import { AgeChips } from "@/components/features/AgeChips";
import { CancerGrid } from "@/components/features/CancerGrid";
import { MythCardFlip } from "@/components/features/MythCardFlip";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { getCancers, getMythOfTheDay, parseAge } from "@/lib/learn";
import { t } from "@/lib/i18n";

type LearnPageProps = {
  searchParams: Promise<{ age?: string }>;
};

export default async function LearnPage({ searchParams }: LearnPageProps) {
  const query = await searchParams;
  const age = parseAge(query.age);
  const cancers = getCancers();
  const mythOfDay = getMythOfTheDay(age);

  return (
    <PageShell>
      <header className="flex flex-col gap-4">
        <h1 className="font-headline-lg text-headline-lg text-text">{t("learn.title")}</h1>
        <p className="font-body-md text-body-md text-muted max-w-[65ch]">{t("learn.subtitle")}</p>
        <Suspense fallback={<p className="font-body-sm text-body-sm text-muted">{t("learn.loading")}</p>}>
          <AgeChips />
        </Suspense>
      </header>

      <CancerGrid cancers={cancers} age={age} />

      <section className="flex flex-col gap-4">
        <h2 className="font-headline-md text-headline-md text-text">{t("learn.mythOfDay")}</h2>
        {mythOfDay?.usedFallback ? (
          <p className="font-body-sm text-body-sm text-muted">{t("learn.mythsAllAges")}</p>
        ) : null}
        {mythOfDay ? (
          <MythCardFlip myth={mythOfDay.item} />
        ) : (
          <Card>
            <p className="font-body-md text-body-md text-muted">{t("learn.mythsEmpty")}</p>
          </Card>
        )}
      </section>
    </PageShell>
  );
}
