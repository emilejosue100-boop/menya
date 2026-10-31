import { NextResponse } from "next/server";
import { loadOrganisations, loadSupportGroups } from "@/lib/data";
import { askGemini, parseJsonObject } from "@/lib/gemini";
import { buildHelpPlaces, matchPlaceIds } from "@/lib/help";

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

    const generated = await askGemini(prompt, { json: true });
    const parsed = generated ? parseJsonObject(generated) : null;
    const rawIds = Array.isArray(parsed?.ids) ? parsed.ids : [];
    const ids = rawIds.filter((id): id is string => typeof id === "string" && allowedIds.has(id));

    if (ids.length > 0) {
      return NextResponse.json({ ids, source: "gemini" });
    }

    return NextResponse.json({ ids: fallbackIds, source: "fallback" });
  } catch {
    return NextResponse.json({ ids: [], source: "fallback" });
  }
}
