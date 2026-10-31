import { type HTMLAttributes, type ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: "md" | "lg";
  tone?: "surface" | "soft";
};

const toneClasses = {
  surface: "bg-surface border border-border",
  soft: "bg-primary-soft border border-border",
};

export function Card({
  children,
  className = "",
  padding: _padding = "lg",
  tone = "surface",
  ...rest
}: CardProps) {
  return (
    <div className={`rounded-2xl p-6 ${toneClasses[tone]} duration-200 ease-out ${className}`} {...rest}>
      {children}
    </div>
  );
}
