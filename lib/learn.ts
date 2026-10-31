import cancers from "@/data/cancers.json";
import myths from "@/data/myths.json";
import quiz from "@/data/quiz.json";
import { t } from "@/lib/i18n";

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
    .filter((word) => word.length > 3 && !STOP.has(word) && word !== "cancer");
}

export type DadaFallback = { answer: string; suggestions: string[] };

const SUGGEST_KEYS = [
  "learn.dadaSuggestSugar",
  "learn.dadaSuggestStress",
  "learn.dadaSuggestHeredity",
  "learn.dadaSuggestScreening",
  "learn.dadaSuggestChemo",
] as const;

export function dadaSuggestions(exclude?: string): string[] {
  const skip = (exclude ?? "").trim().toLowerCase();
  return SUGGEST_KEYS.map((key) => t(key))
    .filter((question) => question.toLowerCase() !== skip)
    .slice(0, 3);
}

const CANCER_KEYS = [
  { slug: "breast", keys: ["breast"] },
  { slug: "cervical", keys: ["cervical", "cervix", "hpv"] },
  { slug: "prostate", keys: ["prostate"] },
  { slug: "liver", keys: ["liver", "hepatitis"] },
  { slug: "colorectal", keys: ["colorectal", "bowel", "colon"] },
] as const;

export function shouldFocusCurrentCancer(question: string, cancer?: Cancer | null): boolean {
  if (!cancer) return false;
  const extra = question.toLowerCase();
  const namesThis = CANCER_KEYS.find((item) => item.slug === cancer.slug)?.keys ?? [cancer.slug];
  if (namesThis.some((key) => extra.includes(key))) return true;
  if (CANCER_KEYS.some((item) => item.slug !== cancer.slug && item.keys.some((key) => extra.includes(key)))) {
    return false;
  }
  if (
    /what is cancer|cancer in general|prevent cancer|causes? of cancer|how does cancer|define cancer/.test(extra)
  ) {
    return false;
  }
  return true;
}

function isHealthQuestion(text: string): boolean {
  return /cancer|tumor|tumour|lump|screen|chemo|radio|vaccine|hpv|hepatitis|clinic|health|symptom|treat|heredit|family|gene|stress|sugar|diet|chemo|dose|drug|pain|bleed|urine|liver|breast|cervix|prostate|bowel|colon/i.test(
    text,
  );
}

function topicAnswer(question: string, cancer?: Cancer | null): string | null {
  const extra = question.toLowerCase();
  if (/what is cancer/.test(extra) && !CANCER_KEYS.some((item) => item.keys.some((key) => extra.includes(key)))) {
    return t("learn.dadaAnswerWhatIsCancer");
  }
  if (/prevent|lower (the )?risk|avoid/.test(extra) && !shouldFocusCurrentCancer(question, cancer)) {
    return t("learn.dadaAnswerPreventCancer");
  }
  if (/sugar|sweet|feed\s+cancer/.test(extra)) return t("learn.dadaAnswerSugar");
  if (/stress|worry|anxious|anxiety/.test(extra)) return t("learn.dadaAnswerStress");
  if (/heredit|inherit|genes?|family history|genetic/.test(extra)) return t("learn.dadaAnswerHeredity");
  if (/cost|price|pay|mutuelle|expensive|how much/.test(extra) && /screen|test|clinic|care|treat/.test(extra)) {
    return t("learn.dadaAnswerScreeningCost");
  }
  if (/chemo|chemotherapy/.test(extra)) return t("learn.dadaAnswerChemo");
  return null;
}

export function matchDadaReply(
  question: string,
  preferredCancer?: Cancer | null,
  allMyths: Myth[] = myths,
  allCancers: Cancer[] = cancers,
  quizItems: QuizQuestion[] = quiz,
): DadaFallback {
  const suggestions = dadaSuggestions(question);
  const topic = topicAnswer(question, preferredCancer);
  if (topic) return { answer: topic, suggestions };

  const extra = question.toLowerCase();
  const words = tokens(question);
  const preferred = preferredCancer?.slug;
  const focusCurrent = shouldFocusCurrentCancer(question, preferredCancer);

  type Candidate = { score: number; text: string; closer?: string };
  const candidates: Candidate[] = [];

  for (const item of allCancers) {
    const boost = focusCurrent && item.slug === preferred ? 2 : 0;
    candidates.push({ score: boost, text: item.summary, closer: item.name });
    for (const line of item.signs) candidates.push({ score: boost, text: line, closer: item.name });
    for (const line of item.prevention) candidates.push({ score: boost, text: line, closer: item.name });
  }

  for (const myth of allMyths) {
    const boost = myth.cancer === "general" || (focusCurrent && myth.cancer === preferred) ? 2 : 0;
    candidates.push({
      score: boost,
      text: `${myth.fact} ${myth.what_to_do}`,
      closer: myth.cancer,
    });
  }

  for (const item of quizItems) {
    const correct = item.choices[item.answer] ?? "";
    const boost = focusCurrent && item.cancer === preferred ? 2 : 0;
    candidates.push({ score: boost, text: `${item.question} ${correct}`, closer: item.cancer });
  }

  for (const candidate of candidates) {
    const hay = tokens(candidate.text).join(" ");
    const hits = words.filter((word) => hay.includes(word) || candidate.text.toLowerCase().includes(word)).length;
    candidate.score += hits;
  }

  if (preferredCancer && focusCurrent) {
    if (extra.includes("sign") || extra.includes("symptom") || extra.includes("watch")) {
      candidates.unshift({
        score: 99,
        text: `${preferredCancer.signs.join(". ")}. ${t("learn.dadaSeeWorker")}`,
      });
    }
    if (extra.includes("risk") || extra.includes("prevent") || extra.includes("lower")) {
      candidates.unshift({
        score: 99,
        text: `${preferredCancer.prevention.join(". ")}. ${t("learn.dadaSeeWorker")}`,
      });
    }
    if (extra.includes("myth") || extra.includes("true") || extra.includes("believe")) {
      const first = allMyths.find((myth) => myth.cancer === preferred) ?? allMyths.find((myth) => myth.cancer === "general");
      if (first) {
        candidates.unshift({ score: 99, text: `${first.fact} ${first.what_to_do}` });
      }
    }
  }

  const best = candidates.sort((a, b) => b.score - a.score)[0];
  if (best && best.score >= 2) {
    const answer = /[.!?]$/.test(best.text.trim()) ? best.text.trim() : `${best.text.trim()}.`;
    return { answer, suggestions };
  }

  if (isHealthQuestion(question)) {
    return { answer: t("learn.dadaAnswerGeneralHealth"), suggestions };
  }

  return { answer: t("learn.dadaFallback"), suggestions };
}
