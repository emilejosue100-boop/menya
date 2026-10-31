"use client";

import Image from "next/image";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { type Cancer, matchDadaReply } from "@/lib/learn";
import { t } from "@/lib/i18n";
import { images } from "@/lib/images";

type Message = {
  role: "user" | "dada";
  text: string;
  credit?: boolean;
  suggestions?: string[];
};

type DadaChatProps = {
  cancer: Cancer;
};

export function DadaChat({ cancer }: DadaChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "dada", text: t("learn.dadaIntro") }]);
  const [typing, setTyping] = useState(false);

  const chips = [t("learn.dadaChipSigns"), t("learn.dadaChipRisk"), t("learn.dadaChipMyth")];

  async function replyTo(question: string) {
    const trimmed = question.trim();
    if (!trimmed || typing) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    const local = matchDadaReply(trimmed, cancer);
    let answer = local.answer;
    let credit = false;
    let suggestions = local.suggestions;

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, cancerSlug: cancer.slug }),
        signal: AbortSignal.timeout(22_000),
      });
      if (response.ok) {
        const payload = (await response.json()) as {
          answer?: string;
          source?: string;
          suggestions?: string[];
        };
        if (payload.answer) answer = payload.answer;
        credit = payload.source === "gemma";
        if (Array.isArray(payload.suggestions) && payload.suggestions.length > 0) {
          suggestions = payload.suggestions;
        } else if (payload.source === "gemma") {
          suggestions = [];
        }
      }
    } catch {
      // Keep the local match so the demo never goes quiet.
    }

    setMessages((current) => [
      ...current,
      { role: "dada", text: answer, credit, suggestions: suggestions.length > 0 ? suggestions : undefined },
    ]);
    setTyping(false);
  }

  return (
    <Card id="ask-dada" className="scroll-mt-[88px]">
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={images.dadaAvatar}
          alt={t("home.dadaAlt")}
          width={48}
          height={48}
          unoptimized
          className="w-12 h-12 rounded-full object-cover aspect-square"
        />
        <div>
          <h2 className="font-headline-sm text-headline-sm text-text">{t("learn.askDada")}</h2>
          <p className="font-body-sm text-body-sm text-muted">{t("home.dadaBadge")}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 max-h-80 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-xl px-4 py-3 font-body-sm text-body-sm whitespace-pre-wrap break-words ${
              message.role === "dada" ? "bg-primary-soft text-text self-start" : "bg-surface border border-border text-text self-end"
            }`}
          >
            {message.text}
            {message.credit ? (
              <p className="font-label-sm text-label-sm text-muted mt-2">{t("learn.dadaByGemma")}</p>
            ) : null}
            {message.suggestions && message.suggestions.length > 0 ? (
              <div className="mt-3 flex flex-col gap-2">
                <p className="font-label-sm text-label-sm text-muted">{t("learn.dadaTryThese")}</p>
                <div className="flex flex-wrap gap-2">
                  {message.suggestions.map((chip) => (
                    <Chip key={chip} onClick={() => replyTo(chip)}>
                      {chip}
                    </Chip>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}
        {typing ? (
          <p className="font-label-sm text-label-sm text-muted animate-pulse">{t("learn.dadaTyping")}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map((chip) => (
          <Chip key={chip} onClick={() => replyTo(chip)}>
            {chip}
          </Chip>
        ))}
      </div>
      <form
        className="flex flex-col sm:flex-row gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          replyTo(input);
        }}
      >
        <div className="flex-1">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("learn.dadaPlaceholder")}
            aria-label={t("learn.dadaPlaceholder")}
          />
        </div>
        <Button type="submit" className="sm:w-auto px-6">
          {t("learn.dadaSend")}
          <Icon icon={Send} />
        </Button>
      </form>
    </Card>
  );
}
