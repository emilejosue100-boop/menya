import { NextResponse } from "next/server";
import { askGemma, parseJsonFromText } from "@/lib/ai";
import { loadOrganisations, loadSupportGroups } from "@/lib/data";
import { buildHelpPlaces, matchPlaceIds } from "@/lib/help";

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

    const organisations = await loadOrganisations();
    const groups = await loadSupportGroups();
    const places = buildHelpPlaces(organisations, groups);
    const allowedIds = new Set(places.map((place) => place.id));
    const fallbackIds = situation ? matchPlaceIds(places, situation) : [];

    if (!situation) {
      return NextResponse.json({ ids: [], source: "fallback" });
    }

    const compact = places.map((place) => ({
      id: place.id,
      kind: place.kind,
      name: place.name,
      offers: place.offers,
      cancer: place.cancer ?? null,
      city: place.city,
    }));

    const prompt = `Pick matching help places for this person's situation. Reply with JSON only: {"ids":["id1","id2"]}.
Only use ids from this list. Never invent ids, names, or phone numbers. If nothing fits, return {"ids":[]}.
Situation: ${situation}
Places: ${JSON.stringify(compact)}`;

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
