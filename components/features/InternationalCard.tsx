import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { type InternationalOrg } from "@/lib/help";
import { t } from "@/lib/i18n";

const WHO_LABEL: Record<string, string> = {
  patients: "help.whoPatients",
  hospitals: "help.whoHospitals",
  governments: "help.whoGovernments",
  health_workers: "help.whoHealthWorkers",
};

type InternationalCardProps = {
  org: InternationalOrg;
  matched?: boolean;
};

export function InternationalCard({ org, matched = false }: InternationalCardProps) {
  const who = org.who_can_ask.map((item) => t(WHO_LABEL[item] ?? item)).join(", ");

  return (
    <Card id={`help-card-${org.id}`} className={matched ? "border-lavender ring-2 ring-lavender/40" : ""}>
      <h3 className="font-headline-sm text-headline-sm text-text">{org.name}</h3>
      <p className="font-body-md text-body-md text-text mt-4">{org.what_they_do}</p>
      <div className="mt-4 rounded-xl bg-primary-soft p-4">
        <p className="font-label-sm text-label-sm text-muted">{t("help.reachesLabel")}</p>
        <p className="font-body-md text-body-md text-text mt-1">{org.how_it_reaches_you}</p>
      </div>
      <p className="font-label-sm text-label-sm text-muted mt-4">{t("help.whoCanAskLabel")}</p>
      <p className="font-body-sm text-body-sm text-text">{who}</p>
      <p className="font-label-sm text-label-sm text-muted mt-4">{t("help.checkBeforeUse")}</p>
      <div className="mt-4">
        <Button href={org.website} target="_blank">
          {t("help.visitWebsite")}
        </Button>
      </div>
    </Card>
  );
}
