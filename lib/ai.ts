const MODEL = "gemma-4-26b-a4b-it";
const TIMEOUT_MS = 20_000;

const DADA_RULES = `You are Dada, the calm AI guide inside Menya.
Use the Menya facts first (the verified data passed in). For other general cancer and health questions, answer with well-established, widely accepted health information, in simple words.
Never diagnose. Never say someone has or does not have cancer. Never give drug doses. Never promise cures.
When someone describes symptoms, gently say to see a health worker.
Say "I'm not sure about that. Please ask a health worker." only for questions outside cancer and health, or when you are truly unsure.
Use simple, kind words. Never scary. Reply in English.
Keep answers to 3 to 5 short sentences.
If someone mentions wanting to harm themselves, show a gentle message and a local helpline. Do not continue normal chat.`;

export const DADA_UNSURE = "I'm not sure about that. Please ask a health worker.";

export const DADA_HELPLINE =
  "If you are thinking of hurting yourself, please talk to someone now. Go to the nearest hospital or call a local helpline. In Rwanda you can start with a health worker at the nearest clinic. You are not alone.";

export type GemmaResult = { text: string | null; error: string | null };

export function mentionsSelfHarm(text: string): boolean {
  return /suicid|kill myself|hurt myself|harm myself|want to die|end my life|end it all/i.test(text);
}

function redact(text: string): string {
  return text
    .replace(/key=[^&\s"]+/gi, "key=[redacted]")
    .replace(/AIza[0-9A-Za-z_-]+/g, "[redacted]");
}

async function generateOnce(prompt: string, apiKey: string): Promise<GemmaResult> {
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
          maxOutputTokens: 700,
          thinkingConfig: { thinkingLevel: "minimal" },
        },
      }),
    });

    if (!response.ok) {
      const body = redact((await response.text()).slice(0, 240));
      return { text: null, error: `http ${response.status} ${body}` };
    }

    const payload = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
    };
    const candidate = payload.candidates?.[0];
    const text = candidate?.content?.parts
      ?.filter((part) => !part.thought)
      .map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) {
      return { text: null, error: `empty visible text (${candidate?.finishReason ?? "no candidate"})` };
    }
    return { text, error: null };
  } catch (error) {
    const name = error instanceof Error ? error.name : "error";
    const message = error instanceof Error ? error.message : "unknown";
    if (name === "AbortError" || message.toLowerCase().includes("abort")) {
      return { text: null, error: `timeout after ${TIMEOUT_MS}ms` };
    }
    return { text: null, error: redact(`${name}: ${message}`) };
  } finally {
    clearTimeout(timer);
  }
}

export async function askGemma(prompt: string): Promise<GemmaResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return { text: null, error: "missing GOOGLE_AI_API_KEY" };

  const first = await generateOnce(prompt, apiKey);
  if (first.text) return first;
  if (first.error?.includes("http 500") || first.error?.includes("INTERNAL")) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return generateOnce(prompt, apiKey);
  }
  return first;
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
