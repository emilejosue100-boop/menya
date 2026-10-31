import cancers from "@/data/cancers.json";
import myths from "@/data/myths.json";
import quiz from "@/data/quiz.json";

export const AGE_LEVELS = ["kids", "teens", "adults", "elders"] as const;
export type AgeLevel = (typeof AGE_LEVELS)[number];

export type Cancer = (typeof cancers)[number];
export type Myth = (typeof myths)[number];
export type QuizQuestion = (typeof quiz)[number];

const STOP = new Set([
  "about",
  "that",
  "this",
  "with",
  "from",
  "have",
  "what",
  "when",
  "does",
  "your",
  "should",
  "would",
  "could",
  "there",
  "their",
  "which",
  "where",
  "into",
  "just",
  "like",
  "them",
  "then",
  "than",
  "also",
  "some",
  "more",
  "very",
]);

export function parseAge(value?: string): AgeLevel {
  return AGE_LEVELS.includes(value as AgeLevel) ? (value as AgeLevel) : "adults";
}

export function getCancers(list: Cancer[] = cancers): Cancer[] {
  return list;
}

export function getCancer(slug: string, list: Cancer[] = cancers): Cancer | undefined {
  return list.find((item) => item.slug === slug);
}

export function getMythsForCancer(
  slug: string,
  age: AgeLevel,
  list: Myth[] = myths,
): { items: Myth[]; usedFallback: boolean } {
  const matched = list.filter((item) => item.cancer === slug && item.age_level === age);
  if (matched.length > 0) {
    return { items: matched, usedFallback: false };
  }
  return {
    items: list.filter((item) => item.cancer === slug),
    usedFallback: true,
  };
}

export function getMythOfTheDay(age: AgeLevel, list: Myth[] = myths): { item: Myth; usedFallback: boolean } | undefined {
  const matched = list.find((item) => item.cancer === "general" && item.age_level === age);
  if (matched) return { item: matched, usedFallback: false };
  const general = list.find((item) => item.cancer === "general");
  if (general) return { item: general, usedFallback: true };
  const anyForAge = list.find((item) => item.age_level === age);
  if (anyForAge) return { item: anyForAge, usedFallback: true };
  return list[0] ? { item: list[0], usedFallback: true } : undefined;
}

export function getQuiz(slug: string, list: QuizQuestion[] = quiz): QuizQuestion[] {
  return list.filter((item) => item.cancer === slug).slice(0, 3);
}

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3 && !STOP.has(word));
}

export function matchDadaReply(question: string, cancer: Cancer, cancerMyths: Myth[]): string | null {
  const words = tokens(question);
  if (words.length === 0) return null;

  const candidates: { score: number; text: string }[] = [
    { score: 0, text: cancer.summary },
    ...cancer.signs.map((line) => ({ score: 0, text: line })),
    ...cancer.prevention.map((line) => ({ score: 0, text: line })),
    ...cancerMyths.flatMap((myth) => [
      { score: 0, text: myth.fact },
      { score: 0, text: myth.what_to_do },
    ]),
  ];

  for (const candidate of candidates) {
    const hay = tokens(`${candidate.text} ${cancer.name} ${cancer.summary}`).join(" ");
    candidate.score = words.filter((word) => hay.includes(word) || candidate.text.toLowerCase().includes(word)).length;
  }

  const extra = question.toLowerCase();
  if (extra.includes("sign") || extra.includes("symptom") || extra.includes("watch")) {
    candidates.unshift({ score: 99, text: cancer.signs.join(" ") });
  }
  if (extra.includes("risk") || extra.includes("prevent") || extra.includes("lower")) {
    candidates.unshift({ score: 99, text: cancer.prevention.join(" ") });
  }
  if (extra.includes("myth") || extra.includes("true") || extra.includes("believe")) {
    const first = cancerMyths[0];
    if (first) candidates.unshift({ score: 99, text: first.fact });
  }

  const best = candidates.sort((a, b) => b.score - a.score)[0];
  if (!best || best.score < 1) return null;
  return best.text;
}
