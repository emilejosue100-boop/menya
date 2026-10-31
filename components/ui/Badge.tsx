import { type ReactNode } from "react";

type BadgeTone = "primary" | "teal" | "coral" | "myth";

const toneClasses: Record<BadgeTone, string> = {
  primary: "bg-primary text-surface",
  teal: "bg-teal/15 text-teal",
  coral: "bg-coral/20 text-coral",
  myth: "text-myth-red font-bold uppercase tracking-wider",
};

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

export function Badge({ children, tone = "primary", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full font-label-sm text-label-sm ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
