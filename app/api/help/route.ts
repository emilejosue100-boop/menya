import { NextResponse } from "next/server";
import { askGemma, parseJsonFromText } from "@/lib/ai";
import { loadInternational, loadOrganisations, loadSupportGroups } from "@/lib/data";
import { buildHelpPlaces, matchInternationalIds, matchPlaceIds } from "@/lib/help";

function extractIds(parsed: unknown): string[] {
  if (Array.isArray(parsed)) {
    return parsed.filter((id): id is string => typeof id === "string");
  }
  if (parsed && typeof parsed === "object" && Array.isArray((parsed as { ids?: unknown }).ids)) {
    return (parsed as { ids: unknown[] }).ids.filter((id): id is string => typeof id === "string");
  }
  return [];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { situation?: string; query?: string };
    const situation = String(body.situation ?? body.query ?? "").trim();

    const [organisations, groups, international] = await Promise.all([
      loadOrganisations(),
      loadSupportGroups(),
      loadInternational(),
    ]);
    const places = buildHelpPlaces(organisations, groups);
    const allowedIds = new Set([...places.map((place) => place.id), ...international.map((org) => org.id)]);
    const fallbackIds = situation
      ? [...matchPlaceIds(places, situation), ...matchInternationalIds(international, situation)]
      : [];

    if (!situation) {
      return NextResponse.json({ ids: [], source: "fallback" });
    }

    const compactPlaces = places.map((place) => ({
      id: place.id,
      kind: place.kind,
      name: place.name,
      offers: place.offers,
      cancer: place.cancer ?? null,
      city: place.city,
    }));
    const compactIntl = international.map((org) => ({
      id: org.id,
      name: org.name,
      type: org.type,
      what_they_do: org.what_they_do,
      who_can_ask: org.who_can_ask,
    }));

    const prompt = `Pick matching local places and international programmes for this person's situation. Reply with JSON only: {"ids":["id1","id2"]}.
Only use ids from these lists. Never invent ids, names, phone numbers, or organisations. If nothing fits, return {"ids":[]}.
Situation: ${situation}
Local places: ${JSON.stringify(compactPlaces)}
International programmes: ${JSON.stringify(compactIntl)}`;

    const generated = await askGemma(prompt);
    const parsed = generated.text ? parseJsonFromText(generated.text) : null;
    const ids = extractIds(parsed).filter((id) => allowedIds.has(id));

    if (ids.length > 0) {
      return NextResponse.json({ ids, source: "gemma" });
    }

    return NextResponse.json({ ids: fallbackIds, source: "fallback" });
  } catch {
    return NextResponse.json({ ids: [], source: "fallback" });
  }
}
