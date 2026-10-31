import cancersJson from "@/data/cancers.json";
import mythsJson from "@/data/myths.json";
import internationalJson from "@/data/international.json";
import organisationsJson from "@/data/organisations.json";
import quizJson from "@/data/quiz.json";
import supportGroupsJson from "@/data/support_groups.json";
import survivorsJson from "@/data/survivors.json";
import { createClient } from "@/lib/supabase/server";
import type { Cancer, Myth, QuizQuestion } from "@/lib/learn";
import type { SupportGroup, Survivor } from "@/lib/share";
import type { InternationalOrg, Organisation } from "@/lib/help";

function hasSupabase() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

async function loadTable<T>(table: string, fallback: T[]): Promise<T[]> {
  if (!hasSupabase()) return fallback;
  try {
    const supabase = await createClient();
    const query = supabase.from(table).select("*");
    const result = await Promise.race([
      query,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
    ]);
    if (!result || result.error || !result.data || result.data.length === 0) return fallback;
    return result.data as T[];
  } catch {
    return fallback;
  }
}

export async function loadCancers(): Promise<Cancer[]> {
  return loadTable<Cancer>("cancers", cancersJson);
}

export async function loadMyths(): Promise<Myth[]> {
  return loadTable<Myth>("myths", mythsJson);
}

export async function loadQuiz(): Promise<QuizQuestion[]> {
  return loadTable<QuizQuestion>("quiz_questions", quizJson);
}

export async function loadSurvivors(): Promise<Survivor[]> {
  return loadTable<Survivor>("survivors", survivorsJson);
}

export async function loadSupportGroups(): Promise<SupportGroup[]> {
  return loadTable<SupportGroup>("support_groups", supportGroupsJson);
}

export async function loadOrganisations(): Promise<Organisation[]> {
  return loadTable<Organisation>("organisations", organisationsJson);
}

export async function loadInternational(): Promise<InternationalOrg[]> {
  return internationalJson as InternationalOrg[];
}

export async function loadCancer(slug: string): Promise<Cancer | undefined> {
  const cancers = await loadCancers();
  return cancers.find((item) => item.slug === slug);
}
