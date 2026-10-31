"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, MapPin, Users, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { t } from "@/lib/i18n";

const items: { href: string; labelKey: string; icon: LucideIcon }[] = [
  { href: "/", labelKey: "nav.home", icon: Home },
  { href: "/learn", labelKey: "nav.learn", icon: BookOpen },
  { href: "/share", labelKey: "nav.share", icon: Users },
  { href: "/help", labelKey: "nav.help", icon: MapPin },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-border">
      <ul className="grid grid-cols-4 max-w-[1200px] mx-auto">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 h-16 min-h-11 font-label-sm text-label-sm duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active ? "text-primary" : "text-muted hover:text-text"
                }`}
              >
                <Icon icon={item.icon} size="lg" />
                <span>{t(item.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
