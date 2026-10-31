import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { cancerIcon } from "@/lib/cancerIcons";
import { type AgeLevel, type Cancer } from "@/lib/learn";
import { t } from "@/lib/i18n";

type CancerGridProps = {
  cancers: Cancer[];
  age: AgeLevel;
};

export function CancerGrid({ cancers, age }: CancerGridProps) {
  if (cancers.length === 0) {
    return (
      <Card>
        <p className="font-body-md text-body-md text-muted">{t("learn.cancersEmpty")}</p>
      </Card>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      {cancers.map((cancer) => (
        <li key={cancer.slug} className="h-full">
          <Link
            href={`/learn/${cancer.slug}?age=${age}`}
            className="block h-full rounded-2xl duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Card className="h-full hover:border-lavender min-h-[120px]">
              <div className="w-14 h-14 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4">
                <Icon icon={cancerIcon(cancer.slug)} size="xl" />
              </div>
              <h2 className="font-headline-sm text-headline-sm text-text">{cancer.name}</h2>
              <p className="font-body-sm text-body-sm text-muted mt-2 line-clamp-2">{cancer.summary}</p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
