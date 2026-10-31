import survivors from "@/data/survivors.json";
import groups from "@/data/support_groups.json";

export type Survivor = (typeof survivors)[number];
export type SupportGroup = (typeof groups)[number];

export type MatchQuery = {
  cancer: string;
  country: string;
  city: string;
};

export type RankedSurvivor = Survivor & { score: number; matchReason?: string };

function norm(value: string): string {
  return value.trim().toLowerCase();
}

export function getSurvivors(list: Survivor[] = survivors): Survivor[] {
  return list;
}

export function getSupportGroups(list: SupportGroup[] = groups): SupportGroup[] {
  return list;
}

export function rankSurvivors(query: MatchQuery, people: Survivor[] = survivors): RankedSurvivor[] {
  const cancer = norm(query.cancer);
  const city = norm(query.city);
  const country = norm(query.country);

  return people
    .map((person) => {
      let score = 0;
      if (norm(person.cancer) === cancer) score += 3;
      if (city && norm(person.city) === city) score += 2;
      if (country && norm(person.country) === country) score += 1;
      return { ...person, score };
    })
    .sort((a, b) => b.score - a.score);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
