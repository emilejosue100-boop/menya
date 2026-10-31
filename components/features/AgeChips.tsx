"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Chip } from "@/components/ui/Chip";
import { AGE_LEVELS, type AgeLevel, parseAge } from "@/lib/learn";
import { t } from "@/lib/i18n";

const labels: Record<AgeLevel, string> = {
  kids: "learn.ageKids",
  teens: "learn.ageTeens",
  adults: "learn.ageAdults",
  elders: "learn.ageElders",
};

export function AgeChips() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = parseAge(searchParams.get("age") ?? undefined);

  function select(age: AgeLevel) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("age", age);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t("learn.ageLabel")}>
      {AGE_LEVELS.map((age) => {
        const active = age === selected;
        return (
          <Chip
            key={age}
            onClick={() => select(age)}
            aria-pressed={active}
            className={`min-h-11 ${active ? "!bg-primary !text-surface !border-primary hover:!bg-primary" : ""}`}
          >
            {t(labels[age])}
          </Chip>
        );
      })}
    </div>
  );
}
