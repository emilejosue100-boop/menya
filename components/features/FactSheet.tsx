import { CircleCheck, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { t } from "@/lib/i18n";

type FactSheetProps = {
  signs: string[];
  prevention: string[];
};

export function FactSheet({ signs, prevention }: FactSheetProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <h2 className="font-headline-sm text-headline-sm text-text mb-4">{t("learn.signsTitle")}</h2>
        <ul className="flex flex-col gap-3">
          {signs.map((item) => (
            <li key={item} className="flex items-center gap-2 font-body-md text-body-md text-text">
              <Icon icon={CircleCheck} className="text-teal" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-headline-sm text-headline-sm text-text mb-4">{t("learn.riskTitle")}</h2>
        <ul className="flex flex-col gap-3">
          {prevention.map((item) => (
            <li key={item} className="flex items-center gap-2 font-body-md text-body-md text-text">
              <Icon icon={Heart} className="text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
