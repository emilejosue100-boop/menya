import Image from "next/image";
import { BookOpen, Heart, Hospital, Users, type LucideIcon } from "lucide-react";
import { LoginSignInForm } from "@/components/features/LoginSignInForm";
import { BrandMark } from "@/components/layout/BrandMark";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { t } from "@/lib/i18n";
import { images } from "@/lib/images";

const pillars: { icon: LucideIcon; iconBg: string; titleKey: string; hintKey: string }[] = [
  { icon: BookOpen, iconBg: "bg-primary-soft text-primary", titleKey: "login.learnChip", hintKey: "login.learnChipHint" },
  { icon: Users, iconBg: "bg-coral/20 text-coral", titleKey: "login.shareChip", hintKey: "login.shareChipHint" },
  { icon: Hospital, iconBg: "bg-teal/20 text-teal", titleKey: "login.helpChip", hintKey: "login.helpChipHint" },
];

export default function LoginPage() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center p-4 md:p-8 bg-background">
      <div className="flex flex-col w-full items-center justify-center py-6">
        <div className="relative w-full max-w-[1020px] flex flex-col gap-6">
          <div className="absolute -top-14 -left-12 w-80 h-80 rounded-full bg-lavender/40 blur-3xl pointer-events-none -z-10" />
          <div className="absolute -bottom-16 -right-10 w-96 h-96 rounded-full bg-coral/20 blur-3xl pointer-events-none -z-10" />

          <header className="w-full flex items-center justify-between gap-4 py-2">
            <BrandMark size="login" />
            <LanguageSelector />
          </header>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <Card tone="soft" className="lg:col-span-6 flex flex-col justify-between relative overflow-hidden">
              <div className="flex flex-col gap-5 relative z-10">
                <div className="w-full aspect-[16/9] max-h-56 rounded-xl overflow-hidden relative bg-primary-soft">
                  <Image
                    src={images.loginHero}
                    alt={t("login.heroAlt")}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-3 left-3 bg-surface/90 px-3 py-1 rounded-full flex items-center gap-2">
                    <Icon icon={Heart} size="sm" className="text-coral" />
                    <span className="text-text font-label-sm text-label-sm font-semibold">{t("login.careCircle")}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h1 className="font-headline-lg text-headline-lg text-text tracking-tight">{t("login.welcomeTitle")}</h1>
                  <p className="font-headline-sm text-headline-sm text-primary leading-snug">“{t("motto")}”</p>
                  <p className="font-body-md text-body-md text-muted mt-1 leading-relaxed max-w-[65ch]">{t("login.intro")}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 bg-surface/60 rounded-xl p-3">
                {pillars.map((pillar) => (
                  <div key={pillar.titleKey} className="bg-surface rounded-xl p-3 flex flex-col items-center text-center border border-border">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${pillar.iconBg}`}>
                      <Icon icon={pillar.icon} size="lg" />
                    </div>
                    <span className="font-label-md text-label-md text-text font-bold">{t(pillar.titleKey)}</span>
                    <span className="font-label-sm text-label-sm text-muted mt-0.5 line-clamp-2">{t(pillar.hintKey)}</span>
                  </div>
                ))}
              </div>
            </Card>

            <LoginSignInForm />
          </div>
        </div>
      </div>
    </main>
  );
}
