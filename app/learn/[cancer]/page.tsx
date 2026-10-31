import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { AgeChips } from "@/components/features/AgeChips";
import { DadaChat } from "@/components/features/DadaChat";
import { FactSheet } from "@/components/features/FactSheet";
import { MythCardFlip } from "@/components/features/MythCardFlip";
import { Quiz } from "@/components/features/Quiz";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { cancerIcon } from "@/lib/cancerIcons";
import { getCancer, getMythsForCancer, getQuiz, parseAge } from "@/lib/learn";
import { t } from "@/lib/i18n";

type CancerPageProps = {
  params: Promise<{ cancer: string }>;
  searchParams: Promise<{ age?: string }>;
};

export default async function CancerLearnPage({ params, searchParams }: CancerPageProps) {
  const { cancer: slug } = await params;
  const query = await searchParams;
  const age = parseAge(query.age);
  const cancer = getCancer(slug);

  if (!cancer) {
    return (
      <PageShell>
        <Card>
          <h1 className="font-headline-lg text-headline-lg text-text">{t("learn.notFoundTitle")}</h1>
          <p className="font-body-md text-body-md text-muted mt-4 max-w-[65ch]">{t("learn.notFoundBody")}</p>
          <Button href="/learn" className="mt-6 max-w-xs">
            {t("learn.notFoundCta")}
          </Button>
        </Card>
      </PageShell>
    );
  }

  const { items: myths, usedFallback } = getMythsForCancer(cancer.slug, age);
  const questions = getQuiz(cancer.slug);

  return (
    <PageShell>
        <Link
          href={`/learn?age=${age}`}
          className="inline-flex items-center gap-2 min-h-11 font-label-md text-label-md text-primary duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
        >
          <Icon icon={ArrowLeft} />
          {t("learn.back")}
        </Link>

        <header className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <Icon icon={cancerIcon(cancer.slug)} size="xl" />
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-text">{cancer.name}</h1>
            <p className="font-body-md text-body-md text-muted mt-2 max-w-[65ch]">{cancer.summary}</p>
          </div>
        </header>

        <Suspense fallback={<p className="font-body-sm text-body-sm text-muted">{t("learn.loading")}</p>}>
          <AgeChips />
        </Suspense>

        <FactSheet signs={cancer.signs} prevention={cancer.prevention} />

        <section className="flex flex-col gap-4">
          <h2 className="font-headline-md text-headline-md text-text">{t("learn.mythsTitle")}</h2>
          {usedFallback && myths.length > 0 ? (
            <p className="font-body-sm text-body-sm text-muted">{t("learn.mythsAllAges")}</p>
          ) : null}
          {myths.length === 0 ? (
            <Card>
              <p className="font-body-md text-body-md text-muted">{t("learn.mythsEmpty")}</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {myths.map((myth) => (
                <MythCardFlip key={myth.id} myth={myth} />
              ))}
            </div>
          )}
        </section>

        <DadaChat cancer={cancer} />
        <Quiz questions={questions} cancerName={cancer.name} />
    </PageShell>
  );
}
