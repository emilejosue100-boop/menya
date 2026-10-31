import organisations from "@/data/organisations.json";
import groups from "@/data/support_groups.json";
import { getCancer } from "@/lib/learn";

export type Organisation = (typeof organisations)[number];
export type HelpGroup = (typeof groups)[number];

export const HELP_FILTERS = ["screening", "drugs", "vaccines", "treatment", "groups"] as const;
export type HelpFilter = (typeof HELP_FILTERS)[number];

export const INTL_FILTERS = ["medicines", "vaccines", "equipment", "network"] as const;
export type IntlFilter = (typeof INTL_FILTERS)[number];

export type InternationalOrg = {
  id: string;
  name: string;
  what_they_do: string;
  how_it_reaches_you: string;
  who_can_ask: string[];
  website: string;
  type: IntlFilter;
  review_note: string;
};

export type HelpPlace = {
  id: string;
  kind: "org" | "group";
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  offers: string[];
  cancer?: string;
  whoQualifies: string;
  howToApply: string;
  verified: boolean;
};

const STOP = new Set(["about", "that", "this", "with", "from", "have", "what", "when", "your", "there", "their", "into", "just", "like", "them", "then", "also", "some", "more", "very", "cant", "cannot"]);

export function buildHelpPlaces(orgsList: Organisation[] = organisations, groupsList: HelpGroup[] = groups): HelpPlace[] {
  const orgs: HelpPlace[] = orgsList.map((org) => ({
    id: org.id,
    kind: "org",
    name: org.name,
    city: org.city,
    country: org.country,
    lat: org.lat,
    lng: org.lng,
    offers: org.offers,
    whoQualifies: org.who_qualifies,
    howToApply: org.how_to_apply,
    verified: org.verified,
  }));

  const circles: HelpPlace[] = groupsList.map((group) => ({
    id: group.id,
    kind: "group",
    name: group.name,
    city: group.city,
    country: group.country,
    lat: group.lat,
    lng: group.lng,
    offers: ["support"],
    cancer: group.cancer,
    whoQualifies: "",
    howToApply: "",
    verified: true,
  }));

  return [...orgs, ...circles];
}

export function getHelpPlaces(): HelpPlace[] {
  return buildHelpPlaces();
}

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3 && !STOP.has(word));
}

function offerMatchesFilter(offers: string[], cancer: string | undefined, filter: HelpFilter): boolean {
  if (filter === "screening") return offers.includes("screening");
  if (filter === "drugs") return offers.includes("free drugs");
  if (filter === "vaccines") return offers.includes("vaccines");
  if (filter === "treatment") return offers.includes("treatment");
  return offers.includes("support") || Boolean(cancer);
}

export function filterPlaces(places: HelpPlace[], filters: HelpFilter[]): HelpPlace[] {
  if (filters.length === 0) return places;
  return places.filter((place) => filters.some((filter) => offerMatchesFilter(place.offers, place.cancer, filter)));
}

export function matchPlaceIds(places: HelpPlace[], query: string): string[] {
  const words = tokens(query);
  if (words.length === 0) return [];

  return places
    .filter((place) => {
      const cancerName = place.cancer ? (getCancer(place.cancer)?.name ?? place.cancer) : "";
      const hay = `${place.name} ${place.offers.join(" ")} ${place.cancer ?? ""} ${cancerName} ${place.whoQualifies} ${place.howToApply} ${place.city}`.toLowerCase();
      return words.some((word) => hay.includes(word));
    })
    .map((place) => place.id);
}

export function filterInternational(orgs: InternationalOrg[], filters: IntlFilter[]): InternationalOrg[] {
  if (filters.length === 0) return orgs;
  return orgs.filter((org) => filters.includes(org.type));
}

function extraIntlTerms(query: string): string[] {
  const q = query.toLowerCase();
  const extra: string[] = [];
  if (/\bhpv\b/.test(q) || /\bvaccine/.test(q)) extra.push("vaccines", "hpv");
  if (/\b(afford|medicine|medicines|drug|drugs|treatment)\b/.test(q)) extra.push("medicines");
  if (/\b(radiotherapy|equipment|radiation|machine)\b/.test(q)) extra.push("equipment");
  if (/\b(network|africa|african)\b/.test(q)) extra.push("network");
  return extra;
}

export function matchInternationalIds(orgs: InternationalOrg[], query: string): string[] {
  const words = tokens(query);
  const extras = extraIntlTerms(query);
  if (words.length === 0 && extras.length === 0) return [];

  return orgs
    .filter((org) => {
      const hay = `${org.name} ${org.what_they_do} ${org.how_it_reaches_you} ${org.who_can_ask.join(" ")} ${org.type}`.toLowerCase();
      const wordHit = words.some((word) => hay.includes(word));
      const typeHit = extras.includes(org.type) || extras.some((term) => hay.includes(term));
      return wordHit || typeHit;
    })
    .map((org) => org.id);
}

export const KIGALI_CENTER: [number, number] = [-1.9441, 30.0619];
