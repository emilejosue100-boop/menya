"use client";

import { useMemo, useState } from "react";
import { HelpCard } from "@/components/features/HelpCard";
import { HelpMap } from "@/components/features/HelpMap";
import { InternationalCard } from "@/components/features/InternationalCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import {
  HELP_FILTERS,
  INTL_FILTERS,
  filterInternational,
  filterPlaces,
  matchInternationalIds,
  matchPlaceIds,
  type HelpFilter,
  type HelpPlace,
  type InternationalOrg,
  type IntlFilter,
} from "@/lib/help";
import { t } from "@/lib/i18n";

const FILTER_LABEL: Record<HelpFilter, string> = {
  screening: "help.filterScreening",
  drugs: "help.filterDrugs",
  vaccines: "help.filterVaccines",
  treatment: "help.filterTreatment",
  groups: "help.filterGroups",
};

const INTL_FILTER_LABEL: Record<IntlFilter, string> = {
  medicines: "help.filterMedicines",
  vaccines: "help.filterVaccines",
  equipment: "help.filterEquipment",
  network: "help.filterNetworks",
};

const EXAMPLE_CHIPS = ["help.chipMother", "help.chipScreening", "help.chipVaccine"] as const;

const selectedChip = "!bg-primary !text-surface !border-primary hover:!bg-primary min-h-11";
const idleChip = "min-h-11";

type HelpTab = "near" | "international";

type HelpSearchProps = {
  places: HelpPlace[];
  international: InternationalOrg[];
};

export function HelpSearch({ places, international }: HelpSearchProps) {
  const allPlaces = useMemo(() => places, [places]);
  const allIntl = useMemo(() => international, [international]);
  const [tab, setTab] = useState<HelpTab>("near");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [filters, setFilters] = useState<HelpFilter[]>([]);
  const [intlFilters, setIntlFilters] = useState<IntlFilter[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchedIntlIds, setMatchedIntlIds] = useState<string[]>([]);

  const visible = filterPlaces(allPlaces, filters);
  const visibleMatched = matchedIds.filter((id) => visible.some((place) => place.id === id));
  const ordered = [...visible].sort((a, b) => Number(visibleMatched.includes(b.id)) - Number(visibleMatched.includes(a.id)));

  const visibleIntl = filterInternational(allIntl, intlFilters);
  const matchedIntl = allIntl.filter((org) => matchedIntlIds.includes(org.id));
  const orderedIntl = [...visibleIntl].sort(
    (a, b) => Number(matchedIntlIds.includes(b.id)) - Number(matchedIntlIds.includes(a.id)),
  );

  const hasLocalMatch = visibleMatched.length > 0;
  const hasIntlMatch = matchedIntl.length > 0;
  const noMatch = Boolean(submitted) && !hasLocalMatch && !hasIntlMatch;

  function toggle(filter: HelpFilter) {
    setFilters((current) => (current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]));
  }

  function toggleIntl(filter: IntlFilter) {
    setIntlFilters((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter],
    );
  }

  async function search(text: string) {
    const trimmed = text.trim();
    setSubmitted(trimmed);
    if (!trimmed) {
      setMatchedIds([]);
      setMatchedIntlIds([]);
      return;
    }

    const localIds = matchPlaceIds(visible, trimmed);
    const intlIds = matchInternationalIds(allIntl, trimmed);
    setMatchedIds(localIds);
    setMatchedIntlIds(intlIds);

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: trimmed }),
        signal: AbortSignal.timeout(12_000),
      });
      if (response.ok) {
        const payload = (await response.json()) as { ids?: string[] };
        if (Array.isArray(payload.ids) && payload.ids.length > 0) {
          const apiLocal = payload.ids.filter((id) => allPlaces.some((place) => place.id === id));
          const apiIntl = payload.ids.filter((id) => allIntl.some((org) => org.id === id));
          if (apiLocal.length > 0) setMatchedIds(apiLocal);
          if (apiIntl.length > 0) setMatchedIntlIds(apiIntl);
        }
      }
    } catch {
      setMatchedIds(localIds);
      setMatchedIntlIds(intlIds);
    }
  }

  function selectPlace(id: string) {
    setSelectedId(id);
    document.getElementById(`help-card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("help.tabsLabel")}>
        <Chip
          className={tab === "near" ? selectedChip : idleChip}
          aria-pressed={tab === "near"}
          onClick={() => setTab("near")}
        >
          {t("help.tabNear")}
        </Chip>
        <Chip
          className={tab === "international" ? selectedChip : idleChip}
          aria-pressed={tab === "international"}
          onClick={() => setTab("international")}
        >
          {t("help.tabInternational")}
        </Chip>
      </div>

      <Card>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            search(query);
          }}
        >
          <Input
            label={t("help.searchLabel")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("help.searchPlaceholder")}
            leadingIcon={<Icon icon={Search} />}
          />
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_CHIPS.map((key) => (
              <Chip
                key={key}
                className="min-h-11 max-w-full whitespace-normal h-auto py-2"
                onClick={() => {
                  const text = t(key);
                  setQuery(text);
                  search(text);
                }}
              >
                {t(key)}
              </Chip>
            ))}
          </div>
          <Button type="submit">{t("help.search")}</Button>
        </form>
      </Card>

      {tab === "near" ? (
        <>
          <div>
            <p className="font-label-md text-label-md text-text mb-3">{t("help.filterLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {HELP_FILTERS.map((filter) => (
                <Chip
                  key={filter}
                  className={filters.includes(filter) ? selectedChip : idleChip}
                  aria-pressed={filters.includes(filter)}
                  onClick={() => toggle(filter)}
                >
                  {t(FILTER_LABEL[filter])}
                </Chip>
              ))}
            </div>
          </div>

          {noMatch ? <p className="font-body-md text-body-md text-muted">{t("help.noMatch")}</p> : null}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <HelpMap places={visible} matchedIds={visibleMatched} selectedId={selectedId} onSelect={selectPlace} />
            <section className="flex flex-col gap-4">
              <h2 className="font-headline-md text-headline-md text-text">{t("help.placesTitle")}</h2>
              {ordered.length === 0 ? (
                <Card>
                  <p className="font-body-md text-body-md text-muted">{t("help.listEmpty")}</p>
                </Card>
              ) : (
                ordered.map((place) => (
                  <HelpCard
                    key={place.id}
                    place={place}
                    selected={selectedId === place.id}
                    matched={visibleMatched.includes(place.id)}
                    onSelect={selectPlace}
                  />
                ))
              )}
            </section>
          </div>

          {hasIntlMatch ? (
            <section className="flex flex-col gap-4">
              <h2 className="font-headline-md text-headline-md text-text">{t("help.internationalMatchesTitle")}</h2>
              {matchedIntl.map((org) => (
                <InternationalCard key={org.id} org={org} matched />
              ))}
            </section>
          ) : null}
        </>
      ) : (
        <>
          <p className="font-body-sm text-body-sm text-muted max-w-[65ch]">{t("help.internationalNote")}</p>
          <div>
            <p className="font-label-md text-label-md text-text mb-3">{t("help.filterLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {INTL_FILTERS.map((filter) => (
                <Chip
                  key={filter}
                  className={intlFilters.includes(filter) ? selectedChip : idleChip}
                  aria-pressed={intlFilters.includes(filter)}
                  onClick={() => toggleIntl(filter)}
                >
                  {t(INTL_FILTER_LABEL[filter])}
                </Chip>
              ))}
            </div>
          </div>
          {noMatch ? <p className="font-body-md text-body-md text-muted">{t("help.noMatch")}</p> : null}
          <section className="flex flex-col gap-4">
            <h2 className="font-headline-md text-headline-md text-text">{t("help.internationalTitle")}</h2>
            {orderedIntl.length === 0 ? (
              <Card>
                <p className="font-body-md text-body-md text-muted">{t("help.internationalEmpty")}</p>
              </Card>
            ) : (
              orderedIntl.map((org) => (
                <InternationalCard key={org.id} org={org} matched={matchedIntlIds.includes(org.id)} />
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}
