import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function load(name) {
  return JSON.parse(readFileSync(join(root, "data", name), "utf8"));
}

function sqlString(value) {
  if (value == null) return "''";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlTextArray(values) {
  if (!Array.isArray(values) || values.length === 0) return "'{}'::text[]";
  return `ARRAY[${values.map(sqlString).join(", ")}]::text[]`;
}

function sqlBool(value) {
  return value ? "true" : "false";
}

function sqlNum(value) {
  return Number(value);
}

const cancers = load("cancers.json");
const myths = load("myths.json");
const quiz = load("quiz.json");
const survivors = load("survivors.json");
const groups = load("support_groups.json");
const orgs = load("organisations.json");

const lines = [
  "-- Menya seed data from /data JSON. Run after schema.sql in the Supabase SQL editor.",
  "",
  "truncate table public.organisations, public.support_groups, public.survivors, public.quiz_questions, public.myths, public.cancers;",
  "",
  "insert into public.cancers (slug, name, summary, signs, prevention, icon, review_note) values",
  cancers
    .map(
      (row, index) =>
        `  (${sqlString(row.slug)}, ${sqlString(row.name)}, ${sqlString(row.summary)}, ${sqlTextArray(row.signs)}, ${sqlTextArray(row.prevention)}, ${sqlString(row.icon)}, ${sqlString(row.review_note)})${index === cancers.length - 1 ? ";" : ","}`,
    )
    .join("\n"),
  "",
  "insert into public.myths (id, cancer, myth, why_people_believe, fact, what_to_do, source, age_level, audio_url, review_note) values",
  myths
    .map(
      (row, index) =>
        `  (${sqlString(row.id)}, ${sqlString(row.cancer)}, ${sqlString(row.myth)}, ${sqlString(row.why_people_believe)}, ${sqlString(row.fact)}, ${sqlString(row.what_to_do)}, ${sqlString(row.source)}, ${sqlString(row.age_level)}, ${sqlString(row.audio_url)}, ${sqlString(row.review_note)})${index === myths.length - 1 ? ";" : ","}`,
    )
    .join("\n"),
  "",
  "insert into public.quiz_questions (id, cancer, question, choices, answer, review_note) values",
  quiz
    .map(
      (row, index) =>
        `  (${sqlString(row.id)}, ${sqlString(row.cancer)}, ${sqlString(row.question)}, ${sqlTextArray(row.choices)}, ${Number(row.answer)}, ${sqlString(row.review_note)})${index === quiz.length - 1 ? ";" : ","}`,
    )
    .join("\n"),
  "",
  "insert into public.survivors (id, name, cancer, language, country, city, story, voice_url, is_demo, review_note) values",
  survivors
    .map(
      (row, index) =>
        `  (${sqlString(row.id)}, ${sqlString(row.name)}, ${sqlString(row.cancer)}, ${sqlTextArray(row.language)}, ${sqlString(row.country)}, ${sqlString(row.city)}, ${sqlString(row.story)}, ${sqlString(row.voice_url)}, ${sqlBool(row.is_demo)}, ${sqlString(row.review_note)})${index === survivors.length - 1 ? ";" : ","}`,
    )
    .join("\n"),
  "",
  "insert into public.support_groups (id, name, cancer, language, city, country, whatsapp_link, lat, lng, moderator, review_note) values",
  groups
    .map(
      (row, index) =>
        `  (${sqlString(row.id)}, ${sqlString(row.name)}, ${sqlString(row.cancer)}, ${sqlString(row.language)}, ${sqlString(row.city)}, ${sqlString(row.country)}, ${sqlString(row.whatsapp_link)}, ${sqlNum(row.lat)}, ${sqlNum(row.lng)}, ${sqlString(row.moderator)}, ${sqlString(row.review_note)})${index === groups.length - 1 ? ";" : ","}`,
    )
    .join("\n"),
  "",
  "insert into public.organisations (id, name, offers, who_qualifies, how_to_apply, country, city, lat, lng, website, verified, review_note) values",
  orgs
    .map(
      (row, index) =>
        `  (${sqlString(row.id)}, ${sqlString(row.name)}, ${sqlTextArray(row.offers)}, ${sqlString(row.who_qualifies)}, ${sqlString(row.how_to_apply)}, ${sqlString(row.country)}, ${sqlString(row.city)}, ${sqlNum(row.lat)}, ${sqlNum(row.lng)}, ${sqlString(row.website)}, ${sqlBool(row.verified)}, ${sqlString(row.review_note)})${index === orgs.length - 1 ? ";" : ","}`,
    )
    .join("\n"),
  "",
];

writeFileSync(join(root, "supabase", "seed.sql"), `${lines.join("\n")}\n`);
console.log("Wrote supabase/seed.sql");
