import Image from "next/image";
import {
  BadgeCheck,
  BookOpen,
  CircleCheck,
  HeartHandshake,
  Hospital,
  MapPin,
  MessageCircle,
  Navigation,
  Users,
  Wallet,
} from "lucide-react";
import { FeatureCard } from "@/components/features/FeatureCard";
import { HomeHeroSearch } from "@/components/features/HomeHeroSearch";
import { MythCard } from "@/components/features/MythCard";
import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { loadMyths } from "@/lib/data";
import { t } from "@/lib/i18n";
import { images } from "@/lib/images";

export default async function HomePage() {
  const myths = await loadMyths();
  const mythOfDay = myths.find((item) => item.id === "general-myth-1") ?? myths[0];
  return (
    <PageShell>
        <section className="relative w-full bg-primary-soft rounded-2xl p-6 overflow-hidden border border-border">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-lavender/50 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-80 h-80 rounded-full bg-coral/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <Image
                    src={images.dadaAvatar}
                    alt={t("home.dadaAlt")}
                    width={80}
                    height={80}
                    unoptimized
                    className="w-20 h-20 rounded-full object-cover aspect-square"
                  />
                  <span className="absolute bottom-0 right-0 w-6 h-6 bg-teal rounded-full flex items-center justify-center">
                    <Icon icon={CircleCheck} size="sm" className="text-surface" />
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="inline-flex items-center gap-2 mb-1 flex-wrap">
                    <Badge tone="primary">{t("home.dadaBadge")}</Badge>
                    <span className="text-teal font-label-sm text-label-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal" /> {t("home.ready")}
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-text tracking-tight">{t("home.greeting")}</h1>
                  <p className="font-body-md text-body-md text-muted max-w-[65ch]">{t("home.heroLine")}</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-surface/80 rounded-xl text-muted font-label-md text-label-md">
                <Icon icon={MapPin} className="text-coral" />
                <span>{t("home.location")}</span>
              </div>
            </div>
            <HomeHeroSearch />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
          <FeatureCard
            icon={<Icon icon={BookOpen} size="xl" />}
            iconWrapperClassName="bg-primary-soft text-primary"
            badge={
              <Badge tone="teal">
                <Icon icon={BadgeCheck} size="sm" />
                {t("home.learnBadge")}
              </Badge>
            }
            title={t("home.learnTitle")}
            description={t("home.learnDescription")}
            checklist={[
              {
                icon: <Icon icon={CircleCheck} className="text-teal" />,
                text: t("home.learnItem1"),
              },
              {
                icon: <Icon icon={CircleCheck} className="text-teal" />,
                text: t("home.learnItem2"),
              },
            ]}
            ctaLabel={t("home.learnCta")}
            ctaHref="/learn"
            ctaVariant="primary"
          />
          <FeatureCard
            icon={<Icon icon={HeartHandshake} size="xl" />}
            iconWrapperClassName="bg-coral/20 text-coral"
            badge={
              <Badge tone="coral">
                <Icon icon={Users} size="sm" />
                {t("home.shareBadge")}
              </Badge>
            }
            title={t("home.shareTitle")}
            description={t("home.shareDescription")}
            checklist={[
              {
                icon: <Icon icon={MessageCircle} className="text-coral" />,
                text: t("home.shareItem1"),
              },
              {
                icon: <Icon icon={Users} className="text-coral" />,
                text: t("home.shareItem2"),
              },
            ]}
            ctaLabel={t("home.shareCta")}
            ctaHref="/share"
            ctaVariant="coral"
          />
          <FeatureCard
            icon={<Icon icon={Navigation} size="xl" />}
            iconWrapperClassName="bg-teal/20 text-teal"
            badge={
              <Badge tone="teal">
                <Icon icon={Hospital} size="sm" />
                {t("home.helpBadge")}
              </Badge>
            }
            title={t("home.helpTitle")}
            description={t("home.helpDescription")}
            checklist={[
              {
                icon: <Icon icon={MapPin} className="text-teal" />,
                text: t("home.helpItem1"),
              },
              {
                icon: <Icon icon={Wallet} className="text-teal" />,
                text: t("home.helpItem2"),
              },
            ]}
            ctaLabel={t("home.helpCta")}
            ctaHref="/help"
            ctaVariant="teal"
          />
        </section>

        {mythOfDay ? <MythCard myth={mythOfDay} /> : null}
    </PageShell>
  );
}
