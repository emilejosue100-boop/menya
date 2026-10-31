import { NextResponse } from "next/server";
import { loadSurvivors } from "@/lib/data";
import { askGemini, parseJsonObject } from "@/lib/gemini";
import { rankSurvivors, type MatchQuery } from "@/lib/share";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      who?: string;
      cancer?: string;
      language?: string;
      country?: string;
      city?: string;
    };

    const query: MatchQuery = {
      cancer: String(body.cancer ?? "").trim(),
      country: String(body.country ?? "").trim(),
      city: String(body.city ?? "").trim(),
    };

    const survivors = await loadSurvivors();
    const ranked = rankSurvivors(query, survivors);
    const allowedIds = new Set(survivors.map((person) => person.id));
    const scored = ranked[0];

    const compact = survivors.map((person) => ({
      id: person.id,
      cancer: person.cancer,
      city: person.city,
      country: person.country,
      language: person.language,
    }));

    const prompt = `Pick the best matching survivor for this form. Reply with JSON only: {"id":"survivor-id","reason":"one kind sentence"}.
Only use an id from this list. Never invent an id.
Form: who=${body.who ?? "myself"}, cancer=${query.cancer}, language=${body.language ?? "English"}, country=${query.country}, city=${query.city}
Survivors: ${JSON.stringify(compact)}`;

    const generated = await askGemini(prompt, { json: true });
    const parsed = generated ? parseJsonObject(generated) : null;
    const geminiId = typeof parsed?.id === "string" ? parsed.id : "";
    const geminiReason = typeof parsed?.reason === "string" ? parsed.reason.trim() : "";

    const best = allowedIds.has(geminiId)
      ? (survivors.find((person) => person.id === geminiId) ?? scored)
      : scored;

    if (!best) {
      return NextResponse.json({ id: null, reason: "", otherIds: [] });
    }

    const otherIds = ranked.filter((person) => person.id !== best.id).slice(0, 2).map((person) => person.id);

    return NextResponse.json({
      id: best.id,
      reason: geminiReason,
      otherIds,
      source: allowedIds.has(geminiId) && geminiReason ? "gemini" : "fallback",
    });
  } catch {
    return NextResponse.json({ id: null, reason: "", otherIds: [], source: "fallback" });
  }
}
