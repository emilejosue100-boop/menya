const MODEL = "PASTE_MODEL_ID_HERE";
const TIMEOUT_MS = 15_000;

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

type GeminiOptions = {
  json?: boolean;
};

export function mentionsSelfHarm(text: string): boolean {
  return /suicid|kill myself|hurt myself|harm myself|want to die|end my life|end it all/i.test(text);
}

export async function askGemini(prompt: string, options: GeminiOptions = {}): Promise<string | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || MODEL.includes("PASTE_MODEL")) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: DADA_RULES }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: options.json ? 0.2 : 0.3,
            maxOutputTokens: 400,
            ...(options.json ? { responseMimeType: "application/json" } : {}),
          },
        }),
      },
    );

    if (!response.ok) return null;
    const payload = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    return text || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function parseJsonObject(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
