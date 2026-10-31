import { type LucideIcon } from "lucide-react";

const SIZES = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSize = keyof typeof SIZES;

type IconProps = {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
};

export function Icon({ icon: Glyph, size = "md", className = "" }: IconProps) {
  return <Glyph size={SIZES[size]} strokeWidth={2} aria-hidden className={`shrink-0 ${className}`.trim()} />;
}
