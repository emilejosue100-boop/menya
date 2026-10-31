import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/i18n";

type BrandMarkProps = {
  href?: string;
  size?: "header" | "login" | "footer";
};

const sizes = {
  header: {
    icon: "h-7 w-7 lg:h-8 lg:w-8",
    iconPx: 32,
    text: "text-[18px] leading-6 lg:text-[20px] lg:leading-7",
  },
  login: {
    icon: "h-12 w-12",
    iconPx: 48,
    text: "text-[20px] leading-7",
  },
  footer: {
    icon: "h-6 w-6",
    iconPx: 24,
    text: "text-[16px] leading-6",
  },
} as const;

export function BrandMark({ href = "/", size = "header" }: BrandMarkProps) {
  const { icon, iconPx, text } = sizes[size];
  const mark = (
    <span className="inline-flex items-center gap-2 min-h-11 shrink-0">
      <Image
        src="/images/logo-mark.svg"
        alt=""
        width={iconPx}
        height={iconPx}
        className={`${icon} object-contain shrink-0`}
        priority={size !== "footer"}
      />
      <span className={`font-headline-sm font-bold text-primary tracking-tight ${text}`}>{t("appName")}</span>
    </span>
  );

  if (!href) return mark;

  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-xl duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {mark}
    </Link>
  );
}
