import Image from "next/image";
import Link from "next/link";
import { BookOpen, HeartHandshake, MapPin } from "lucide-react";
import { FeatureCard } from "@/components/features/FeatureCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { t } from "@/lib/i18n";
import { images } from "@/lib/images";

const inner = "w-full max-w-[1200px] mx-auto px-4 md:px-8";
const storyLink =
  "inline-flex min-h-11 items-center justify-center font-label-md text-label-md text-primary duration-200 ease-out hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl px-2";

const stats = [
  { value: "home.statDeathsValue", label: "home.statDeathsLabel" },
  { value: "home.statLateValue", label: "home.statLateLabel" },
  { value: "home.statDistressValue", label: "home.statDistressLabel" },
] as const;

export default function HomePage() {
  const storyParagraphs = t("home.storyBody").split("\n\n");

  return (
    <main className="w-full">
      <section className="w-full bg-primary-soft">
        <div className={`${inner} py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center`}>
          <div className="flex flex-col gap-6">
            <p className="font-label-sm text-label-sm text-primary">{t("home.heroLabel")}</p>
            <div className="flex flex-col gap-4">
              <h1 className="font-headline-lg text-headline-lg text-text tracking-tight max-w-[18ch]">
                {t("motto")}
              </h1>
              <p className="font-body-md text-body-md text-text max-w-[65ch]">{t("home.heroSupport")}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Button href="/learn" className="sm:w-auto sm:min-w-48">
                {t("home.learnCta")}
              </Button>
              <a href="#aminas-story" className={storyLink}>
                {t("home.readStory")}
              </a>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-lavender">
            <Image
              src={images.loginHero}
              alt={t("home.heroImageAlt")}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 560px"
              priority
            />
          </div>
        </div>
      </section>

      <div className={`${inner} py-12 md:py-16 flex flex-col gap-12 md:gap-16`}>
        <section id="aminas-story" className="scroll-mt-[88px] max-w-[640px] flex flex-col gap-6">
          <h2 className="font-headline-md text-headline-md text-text">{t("home.storyTitle")}</h2>
          <div className="flex flex-col gap-4">
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="font-body-md text-body-md text-text max-w-[65ch]">
                {paragraph}
              </p>
            ))}
          </div>
          <p className="font-body-sm text-body-sm text-muted max-w-[65ch]">{t("home.storyNote")}</p>
        </section>

        <section className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
            {stats.map((stat) => (
              <Card key={stat.value} className="h-full flex flex-col gap-3 hover:border-lavender">
                <p className="font-headline-lg text-headline-lg text-primary tabular-nums">{t(stat.value)}</p>
                <p className="font-body-md text-body-md text-text max-w-[65ch]">{t(stat.label)}</p>
              </Card>
            ))}
          </div>
          <p className="font-body-sm text-body-sm text-muted max-w-[65ch]">{t("home.statNote")}</p>
        </section>

        <section className="flex flex-col items-center text-center gap-4 max-w-[640px] mx-auto">
          <h2 className="font-headline-md text-headline-md text-text">{t("home.whyTitle")}</h2>
          <p className="font-body-md text-body-md text-text max-w-[65ch]">{t("home.whyBody")}</p>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-headline-md text-headline-md text-text">{t("home.howTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <FeatureCard
              icon={<Icon icon={BookOpen} size="lg" />}
              iconWrapperClassName="bg-primary-soft text-primary"
              title={t("home.learnTitle")}
              description={t("home.learnDescription")}
              ctaLabel={t("home.learnCta")}
              ctaHref="/learn"
              ctaVariant="primary"
            />
            <FeatureCard
              icon={<Icon icon={HeartHandshake} size="lg" />}
              iconWrapperClassName="bg-coral/20 text-coral"
              title={t("home.shareTitle")}
              description={t("home.shareDescription")}
              ctaLabel={t("home.shareCta")}
              ctaHref="/share"
              ctaVariant="coral"
            />
            <FeatureCard
              icon={<Icon icon={MapPin} size="lg" />}
              iconWrapperClassName="bg-teal/20 text-teal"
              title={t("home.helpTitle")}
              description={t("home.helpDescription")}
              ctaLabel={t("home.helpCta")}
              ctaHref="/help"
              ctaVariant="teal"
            />
          </div>
        </section>
      </div>

      <section className="w-full bg-primary-soft">
        <div className={`${inner} py-12 md:py-16 flex flex-col items-center text-center gap-6`}>
          <h2 className="font-headline-md text-headline-md text-text">{t("home.finalHeadline")}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button href="/learn" className="sm:w-auto sm:min-w-48">
              {t("home.learnCta")}
            </Button>
            <Link href="/learn/breast#ask-dada" className={storyLink}>
              {t("home.talkToDada")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
