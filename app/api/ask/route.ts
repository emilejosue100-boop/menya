import { NextResponse } from "next/server";
import { askGemini, DADA_HELPLINE, DADA_UNSURE, mentionsSelfHarm } from "@/lib/gemini";
import { getCancer, matchDadaReply, type Myth } from "@/lib/learn";
import mythsJson from "@/data/myths.json";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string; cancerSlug?: string };
    const question = String(body.question ?? "").trim();
    const cancerSlug = String(body.cancerSlug ?? "").trim();

    if (!question) {
      return NextResponse.json({ answer: DADA_UNSURE, source: "fallback" });
    }

    if (mentionsSelfHarm(question)) {
      return NextResponse.json({ answer: DADA_HELPLINE, source: "safety" });
    }

    const cancer = getCancer(cancerSlug);
    const myths = (mythsJson as Myth[]).filter((item) => item.cancer === cancerSlug || item.cancer === "general");

    if (!cancer) {
      return NextResponse.json({ answer: DADA_UNSURE, source: "fallback" });
    }

    const context = [
      `Cancer: ${cancer.name}`,
      `Summary: ${cancer.summary}`,
      `Signs: ${cancer.signs.join("; ")}`,
      `How to lower risk: ${cancer.prevention.join("; ")}`,
      "Myths and facts:",
      ...myths.map(
        (myth) =>
          `- Myth: ${myth.myth} Fact: ${myth.fact} What to do: ${myth.what_to_do}`,
      ),
    ].join("\n");

    const prompt = `Verified data:\n${context}\n\nUser question: ${question}\n\nReply as Dada in 3 to 5 short kind sentences.`;
    const generated = await askGemini(prompt);
    if (generated) {
      return NextResponse.json({ answer: generated, source: "gemini" });
    }

    const fallback = matchDadaReply(question, cancer, myths);
    return NextResponse.json({ answer: fallback ?? DADA_UNSURE, source: "fallback" });
  } catch {
    return NextResponse.json({ answer: DADA_UNSURE, source: "fallback" });
  }
}
