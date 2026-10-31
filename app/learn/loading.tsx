import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";

export default function LearnLoading() {
  return (
    <main className="w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-4">
        <Card>
          <p className="font-body-md text-body-md text-muted animate-pulse">{t("learn.loading")}</p>
        </Card>
      </div>
    </main>
  );
}
