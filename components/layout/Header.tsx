"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { UserMenu } from "@/components/layout/UserMenu";
import { navLinks } from "@/components/layout/navLinks";
import { Icon } from "@/components/ui/Icon";
import { t } from "@/lib/i18n";

const labelByHref: Record<string, string> = {
  "/learn": "nav.learn",
  "/share": "nav.share",
  "/help": "nav.help",
};

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface border-b border-border">
      <div className="h-[72px] max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 lg:gap-4">
        <BrandMark size="header" />
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 min-w-0" aria-label={t("tagline")}>
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 xl:px-4 py-3 font-label-lg text-label-lg rounded-xl duration-200 ease-out min-h-11 flex items-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active ? "bg-primary text-surface" : "text-muted hover:text-text hover:bg-primary-soft"
                }`}
              >
                {t(labelByHref[link.href])}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center justify-end gap-1 lg:gap-2 shrink-0">
          <LanguageSelector compact />
          <button
            aria-label={t("common.notifications")}
            type="button"
            className="relative p-2 rounded-full hover:bg-primary-soft text-muted hover:text-text min-h-11 min-w-11 flex items-center justify-center duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon icon={Bell} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-coral" />
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
