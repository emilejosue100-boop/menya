"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { type QuizQuestion } from "@/lib/learn";
import { t, tReplace } from "@/lib/i18n";

type QuizProps = {
  questions: QuizQuestion[];
  cancerName: string;
};

export function Quiz({ questions, cancerName }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return null;
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const isCorrect = picked === question.answer;

  function reset() {
    setIndex(0);
    setPicked(null);
    setDone(false);
  }

  if (done) {
    return (
      <Card tone="soft" className="text-center">
        <Badge tone="teal" className="mb-4">
          <Icon icon={BadgeCheck} size="sm" />
          {t("common.verified")}
        </Badge>
        <h2 className="font-headline-md text-headline-md text-text mb-6">{tReplace("learn.quizBadge", { name: cancerName })}</h2>
        <Button onClick={reset} className="max-w-xs mx-auto">
          {t("learn.quizTryAgain")}
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <p className="font-label-sm text-label-sm text-muted mb-2">
        {tReplace("learn.quizProgress", { current: String(index + 1), total: String(questions.length) })}
      </p>
      <h2 className="font-headline-sm text-headline-sm text-text mb-4">{t("learn.quizTitle")}</h2>
      <p className="font-body-md text-body-md text-text mb-4">{question.question}</p>
      <div className="flex flex-col gap-2">
        {question.choices.map((choice, choiceIndex) => {
          const selected = picked === choiceIndex;
          const showMark = picked !== null && choiceIndex === question.answer;
          const showWrong = picked !== null && selected && !isCorrect;
          return (
            <button
              key={choice}
              type="button"
              disabled={picked !== null}
              onClick={() => setPicked(choiceIndex)}
              className={`min-h-12 px-4 py-3 rounded-xl border text-left font-body-md text-body-md ${
                showMark
                  ? "border-teal bg-teal/10 text-text"
                  : showWrong
                    ? "border-myth-red bg-myth-red/10 text-text"
                    : "border-border bg-surface text-text hover:bg-primary-soft"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {picked !== null ? (
        <div className="mt-4">
          <p className={`font-label-md text-label-md ${isCorrect ? "text-teal" : "text-myth-red"}`}>
            {isCorrect ? t("learn.quizCorrect") : t("learn.quizWrong")}
          </p>
          <p className="font-body-sm text-body-sm text-muted mt-1">
            {tReplace("learn.quizExplain", { answer: question.choices[question.answer] })}
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              if (isLast) {
                setDone(true);
              } else {
                setIndex((value) => value + 1);
                setPicked(null);
              }
            }}
          >
            {isLast ? t("learn.quizSeeBadge") : t("learn.quizNext")}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
