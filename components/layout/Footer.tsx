import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";
import { t } from "@/lib/i18n";

export function Footer() {
  return (
    <footer className="w-full bg-primary-soft border-t border-border py-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <div className="flex items-start md:items-center gap-4">
            <BrandMark size="footer" />
            <p className="font-body-sm text-body-sm text-muted max-w-[65ch]">{t("footerDisclaimer")}</p>
          </div>
          <nav className="flex items-center gap-6 whitespace-nowrap">
            <Link
              href="/learn"
              className="font-label-sm text-label-sm text-muted hover:text-text duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              {t("nav.knowledgeHub")}
            </Link>
            <Link
              href="/share"
              className="font-label-sm text-label-sm text-muted hover:text-text duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              {t("nav.stories")}
            </Link>
            <Link
              href="/help"
              className="font-label-sm text-label-sm text-muted hover:text-text duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              {t("nav.localCenters")}
            </Link>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4 border-t border-border text-muted font-label-sm text-label-sm">
          <p>{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <span>{t("footer.place")}</span>
            <span>•</span>
            <span>{t("footer.region")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
