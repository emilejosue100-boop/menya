import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type FeatureCardProps = {
  icon: ReactNode;
  iconWrapperClassName: string;
  badge: ReactNode;
  title: string;
  description: string;
  checklist: { icon: ReactNode; text: string }[];
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "primary" | "coral" | "teal";
};

export function FeatureCard({
  icon,
  iconWrapperClassName,
  badge,
  title,
  description,
  checklist,
  ctaLabel,
  ctaHref,
  ctaVariant,
}: FeatureCardProps) {
  return (
    <div className="group h-full bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between duration-200 ease-out hover:border-lavender">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconWrapperClassName}`}>{icon}</div>
          {badge}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-headline-md text-headline-md text-text">{title}</h2>
          <p className="font-body-md text-body-md text-muted max-w-[65ch]">{description}</p>
        </div>
        <div className="bg-primary-soft rounded-xl p-4 flex flex-col gap-2 text-muted font-body-sm text-body-sm">
          {checklist.map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-6">
        <Button href={ctaHref} variant={ctaVariant} className="w-full">
          {ctaLabel}
          <Icon icon={ArrowRight} />
        </Button>
      </div>
    </div>
  );
}
