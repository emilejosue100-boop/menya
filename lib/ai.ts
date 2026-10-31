const MODEL = "gemma-4-26b-a4b-it";
const TIMEOUT_MS = 10_000;

const DADA_RULES = `You are Dada, the calm AI guide inside Menya.
Answer only from the verified data passed in (myths, cancer facts, organisations, survivors). Never invent facts, organisations, phone numbers, or places.
Never diagnose. Never say someone has or does not have cancer.
Always suggest seeing a health worker when someone describes symptoms.
If the answer is not in the data, say: "I'm not sure about that. Please ask a health worker."
Use simple, kind words. Never scary. Reply in English.
Keep answers short: 3 to 5 sentences.
If someone mentions wanting to harm themselves, show a gentle message and a local helpline. Do not continue normal chat.`;

export const DADA_UNSURE = "I'm not sure about that. Please ask a health worker.";

export const DADA_HELPLINE =
  "If you are thinking of hurting yourself, please talk to someone now. Go to the nearest hospital or call a local helpline. In Rwanda you can start with a health worker at the nearest clinic. You are not alone.";

export function mentionsSelfHarm(text: string): boolean {
  return /suicid|kill myself|hurt myself|harm myself|want to die|end my life|end it all/i.test(text);
}

export async function askGemma(prompt: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${DADA_RULES}\n\n${prompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
          thinkingConfig: { thinkingLevel: "minimal" },
        },
      }),
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
    };
    const text = payload.candidates?.[0]?.content?.parts
      ?.filter((part) => !part.thought)
      .map((part) => part.text ?? "")
      .join("")
      .trim();
    return text || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function parseJsonFromText(text: string): unknown | null {
  const start = text.search(/[{[]/);
  if (start < 0) return null;

  const candidate = text.slice(start);
  try {
    return JSON.parse(candidate) as unknown;
  } catch {
    const lastCurly = candidate.lastIndexOf("}");
    const lastSquare = candidate.lastIndexOf("]");
    const end = Math.max(lastCurly, lastSquare);
    if (end <= 0) return null;
    try {
      return JSON.parse(candidate.slice(0, end + 1)) as unknown;
    } catch {
      return null;
    }
  }
}

export function parseJsonObject(text: string): Record<string, unknown> | null {
  const value = parseJsonFromText(text);
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}
