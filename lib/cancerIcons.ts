import { Activity, HeartHandshake, HeartPulse, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";

const BY_SLUG: Record<string, LucideIcon> = {
  breast: HeartHandshake,
  cervical: ShieldCheck,
  prostate: UserRound,
  liver: HeartPulse,
  colorectal: Activity,
};

export function cancerIcon(slug: string): LucideIcon {
  return BY_SLUG[slug] ?? HeartHandshake;
}
