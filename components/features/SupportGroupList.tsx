import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { getCancer } from "@/lib/learn";
import { type SupportGroup } from "@/lib/share";
import { t } from "@/lib/i18n";

type SupportGroupListProps = {
  groups: SupportGroup[];
};

export function SupportGroupList({ groups }: SupportGroupListProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-headline-md text-headline-md text-text">{t("share.groupsTitle")}</h2>
      {groups.length === 0 ? (
        <Card>
          <p className="font-body-md text-body-md text-muted">{t("share.groupsEmpty")}</p>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groups.map((group) => (
            <li key={group.id}>
              <Card className="h-full flex flex-col gap-4">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-text">{group.name}</h3>
                  <p className="font-body-sm text-body-sm text-muted mt-2">
                    {group.cancer === "general" ? t("share.allCancers") : (getCancer(group.cancer)?.name ?? group.cancer)} · {group.city}
                  </p>
                </div>
                <div className="mt-auto flex flex-col gap-2">
                  <Button href="#" variant="teal">
                    <Icon icon={MessageCircle} />
                    {t("share.joinWhatsApp")}
                  </Button>
                  <Badge tone="coral" className="self-start">
                    {t("share.demoLink")}
                  </Badge>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
