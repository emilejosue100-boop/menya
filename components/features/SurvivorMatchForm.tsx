"use client";

import { useState } from "react";
import { SupportGroupList } from "@/components/features/SupportGroupList";
import { SurvivorCard } from "@/components/features/SurvivorCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { type Cancer } from "@/lib/learn";
import { rankSurvivors, type RankedSurvivor, type SupportGroup, type Survivor } from "@/lib/share";
import { t } from "@/lib/i18n";

const WHO_KEYS = [
  { id: "myself", label: "share.whoMyself" },
  { id: "parent", label: "share.whoParent" },
  { id: "child", label: "share.whoChild" },
  { id: "partner", label: "share.whoPartner" },
  { id: "friend", label: "share.whoFriend" },
] as const;

const selectedChip = "!bg-primary !text-surface !border-primary hover:!bg-primary min-h-11";
const idleChip = "min-h-11";

type SurvivorMatchFormProps = {
  cancers: Cancer[];
  groups: SupportGroup[];
  survivors: Survivor[];
};

export function SurvivorMatchForm({ cancers, groups, survivors }: SurvivorMatchFormProps) {
  const [who, setWho] = useState<(typeof WHO_KEYS)[number]["id"]>("myself");
  const [cancer, setCancer] = useState("");
  const [country, setCountry] = useState("Rwanda");
  const [city, setCity] = useState("Kigali");
  const [error, setError] = useState(false);
  const [finding, setFinding] = useState(false);
  const [results, setResults] = useState<RankedSurvivor[] | null>(null);

  async function submit() {
    if (!cancer) {
      setError(true);
      return;
    }
    setError(false);
    setFinding(true);
    setResults(null);

    const scored = rankSurvivors({ cancer, country, city }, survivors);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ who, cancer, language: "English", country, city }),
        signal: AbortSignal.timeout(12_000),
      });
      if (response.ok) {
        const payload = (await response.json()) as { id?: string | null; reason?: string; otherIds?: string[] };
        if (payload.id) {
          const best = survivors.find((person) => person.id === payload.id);
          const others = (payload.otherIds ?? [])
            .map((id) => survivors.find((person) => person.id === id))
            .filter((person): person is Survivor => Boolean(person));
          if (best) {
            setResults([
              { ...best, score: 99, matchReason: payload.reason },
              ...others.map((person, index) => ({ ...person, score: 2 - index })),
            ]);
            setFinding(false);
            return;
          }
        }
      }
    } catch {
      // Keep scored matching so the demo never breaks.
    }

    setResults(scored);
    setFinding(false);
  }

  const best = results?.[0];
  const others = results?.slice(1, 3) ?? [];

  return (
    <div className="flex flex-col gap-12">
      <Card>
        <form
          className="flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div>
            <p className="font-label-md text-label-md text-text mb-3">{t("share.whoLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {WHO_KEYS.map((item) => (
                <Chip
                  key={item.id}
                  className={who === item.id ? selectedChip : idleChip}
                  aria-pressed={who === item.id}
                  onClick={() => setWho(item.id)}
                >
                  {t(item.label)}
                </Chip>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="font-label-md text-label-md text-text">{t("share.cancerLabel")}</span>
            <select
              value={cancer}
              onChange={(event) => {
                setCancer(event.target.value);
                setError(false);
              }}
              className="w-full h-12 px-4 bg-surface rounded-xl text-text font-body-md text-body-md border border-border duration-200 ease-out focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">{t("share.cancerPlaceholder")}</option>
              {cancers.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            {error ? <p className="font-body-sm text-body-sm text-myth-red">{t("share.cancerError")}</p> : null}
          </label>

          <div>
            <p className="font-label-md text-label-md text-text mb-3">{t("share.languageLabel")}</p>
            <Chip className={selectedChip} aria-pressed>
              {t("language.english")}
            </Chip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("share.countryLabel")}
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              placeholder={t("share.countryPlaceholder")}
            />
            <Input
              label={t("share.cityLabel")}
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder={t("share.cityPlaceholder")}
            />
          </div>

          <Button type="submit">{t("share.findMatch")}</Button>
        </form>
      </Card>

      {finding ? (
        <Card>
          <p className="font-body-md text-body-md text-muted animate-pulse">{t("share.finding")}</p>
        </Card>
      ) : null}

      {results && !best ? (
        <Card>
          <p className="font-body-md text-body-md text-muted">{t("share.noMatch")}</p>
        </Card>
      ) : null}

      {best ? (
        <section className="flex flex-col gap-4">
          <h2 className="font-headline-md text-headline-md text-text">{t("share.bestMatch")}</h2>
          <SurvivorCard survivor={best} />
          {others.length > 0 ? (
            <>
              <h3 className="font-title-md text-title-md text-text mt-4">{t("share.otherMatches")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {others.map((person) => (
                  <SurvivorCard key={person.id} survivor={person} compact />
                ))}
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      <SupportGroupList groups={groups} />
    </div>
  );
}
