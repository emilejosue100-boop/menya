import { NextResponse } from "next/server";
import { askGemma, DADA_HELPLINE, DADA_UNSURE, mentionsSelfHarm, polishDadaAnswer } from "@/lib/ai";
import { loadCancers, loadMyths, loadQuiz } from "@/lib/data";
import { dadaSuggestions, matchDadaReply, shouldFocusCurrentCancer } from "@/lib/learn";

function quizLine(question: { question: string; choices: string[]; answer: number }): string {
  const correct = question.choices[question.answer] ?? "";
  return `- Q: ${question.question} Explanation: ${correct}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string; cancerSlug?: string };
    const question = String(body.question ?? "").trim();
    const cancerSlug = String(body.cancerSlug ?? "").trim();

    if (!question) {
      console.info("[dada] source=fallback error=empty question");
      return NextResponse.json({ answer: DADA_UNSURE, source: "fallback", suggestions: dadaSuggestions() });
    }

    if (mentionsSelfHarm(question)) {
      console.info("[dada] source=safety");
      return NextResponse.json({ answer: DADA_HELPLINE, source: "safety", suggestions: [] });
    }

    const [cancers, myths, quiz] = await Promise.all([loadCancers(), loadMyths(), loadQuiz()]);
    const cancer = cancers.find((item) => item.slug === cancerSlug);
    const cancerMyths = myths.filter((item) => item.cancer === cancerSlug || item.cancer === "general");
    const generalMyths = myths.filter((item) => item.cancer === "general");
    const cancerQuiz = quiz.filter((item) => item.cancer === cancerSlug);

    const focusCurrent = shouldFocusCurrentCancer(question, cancer);
    const contextParts = [];
    if (cancer && focusCurrent) {
      contextParts.push(
        `The question is about this cancer: ${cancer.name}. Answer about ${cancer.name}.`,
        `Summary: ${cancer.summary}`,
        `Signs: ${cancer.signs.join("; ")}`,
        `How to lower risk: ${cancer.prevention.join("; ")}`,
        "Myths and facts for this cancer:",
        ...cancerMyths.map(
          (myth) => `- Myth: ${myth.myth} Fact: ${myth.fact} What to do: ${myth.what_to_do}`,
        ),
      );
      if (cancerQuiz.length > 0) {
        contextParts.push("Quiz explanations:", ...cancerQuiz.map(quizLine));
      }
    } else {
      contextParts.push(
        "The question is about cancer in general. Answer for cancer in general. Do not make this about one cancer type unless the user named it.",
        `Cancers in Menya: ${cancers.map((item) => item.name).join(", ")}.`,
      );
      if (generalMyths.length > 0) {
        contextParts.push(
          "General myths and facts:",
          ...generalMyths.map((myth) => `- Myth: ${myth.myth} Fact: ${myth.fact} What to do: ${myth.what_to_do}`),
        );
      }
      if (cancer) {
        contextParts.push(
          `The reader is on the ${cancer.name} page, but do not switch the answer to ${cancer.name} unless they asked about it.`,
        );
      }
    }

    const prompt = `Menya verified data:\n${contextParts.join("\n")}\n\nUser question: ${question}\n\nReply as Dada in 3 to 5 short kind sentences. Finish every sentence. Mention seeing a health worker once, at the end. If the question is about cancer in general, answer for cancer in general. Only focus on one cancer if the question is about it.`;
    const generated = await askGemma(prompt);
    const gemmaText = polishDadaAnswer(generated.text ?? "");
    const gemmaUnsure = gemmaText.toLowerCase().startsWith("i'm not sure about that");
    if (gemmaText && !gemmaUnsure) {
      console.info("[dada] source=gemma");
      return NextResponse.json({ answer: gemmaText, source: "gemma", suggestions: [] });
    }

    const fallback = matchDadaReply(question, cancer, myths, cancers, quiz);
    const gemmaError = generated.error ?? (gemmaUnsure ? "gemma was unsure" : "no gemma text");
    console.info("[dada] source=fallback error=" + gemmaError);
    return NextResponse.json({
      answer: polishDadaAnswer(fallback.answer) || fallback.answer,
      source: "fallback",
      suggestions: fallback.suggestions,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.info("[dada] source=fallback error=" + message);
    return NextResponse.json({
      answer: DADA_UNSURE,
      source: "fallback",
      suggestions: dadaSuggestions(),
    });
  }
}
