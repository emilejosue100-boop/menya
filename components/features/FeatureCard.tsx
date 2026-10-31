import { type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type FeatureCardProps = {
  icon: ReactNode;
  iconWrapperClassName: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "primary" | "coral" | "teal";
};

export function FeatureCard({
  icon,
  iconWrapperClassName,
  title,
  description,
  ctaLabel,
  ctaHref,
  ctaVariant,
}: FeatureCardProps) {
  return (
    <div className="group h-full bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between duration-200 ease-out hover:border-lavender">
      <div className="flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconWrapperClassName}`}>{icon}</div>
        <div className="flex flex-col gap-2">
          <h3 className="font-headline-sm text-headline-sm text-text">{title}</h3>
          <p className="font-body-md text-body-md text-muted max-w-[65ch]">{description}</p>
        </div>
      </div>
      <div className="pt-6">
        <Button href={ctaHref} variant={ctaVariant} className="w-full">
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
