Menya

Learn it. Share it. Find help. No one should face cancer in silence.

Menya ("know" in Kinyarwanda) is an open-source cancer awareness platform for everyone across Africa, from kids to elders. It starts in Rwanda and is built to grow country by country.

1. The problem

In Africa, cancer kills because of silence.

Late diagnosis. About 1.2 million new cases and 700,000 deaths a year. Most people reach a doctor at a late stage, because of low awareness, fear, myths, and going to traditional healers first.
Emotional isolation. About 43% of cancer patients in African studies live with serious distress, and almost half have support needs nobody meets.
The information gap. Free drugs, vaccines, screening, and treatment programmes exist, but families rarely hear about them.

Figures are approximate. Check them against the original studies before quoting.

2. The three features
Learn it
Cards for the 5 most common cancers: breast, cervical, prostate, liver, colorectal
Each card opens a fact sheet: signs to watch for, how to lower your risk, myth or fact
Myth-Buster cards that flip from a real local myth to the fact, with "What to do" and a "Verified" badge
Ask Dada: a chat with Dada, the friendly AI guide, who answers only from verified data
Age levels: Kids, Teens, Adults, Elders
Short quiz with a badge at the end
Audio: myth cards can be read aloud
Share it
A short form: who you are helping, cancer type, language, country and city
Dada matches the user with a survivor who had the same cancer and speaks the same language, and explains why
Survivor profile card with a short story and a voice message
Support groups shown with a "Join on WhatsApp" button
Find help
A map of Africa that zooms to the user's city
Pins for verified organisations and support groups
The user describes their situation, Dada picks the matching pins, and they glow
Help cards: who they are, what they give, who qualifies, how to apply
3. Tech stack
Part	Tool
Frontend	Next.js (App Router), TypeScript, Tailwind CSS
UI design	Google Stitch (exports kept in /design)
Database	Supabase (Postgres)
AI guide (chat, matching, help picking)	Gemini via Google AI Studio API
Multilingual dataset (myths, lessons)	Adaption (Adaptive Data + Blueprint rules)
Voice	ElevenLabs (English, Swahili; Kinyarwanda to be tested)
SMS for basic phones	Africa's Talking
Map	Leaflet + OpenStreetMap
Hosting	Vercel
4. Languages

English only for now; Kinyarwanda and Swahili come later.

5. Folder structure
/design            original Stitch exports (HTML + screenshots), never edited
/app
  page.tsx         Home
  login/page.tsx
  learn/page.tsx
  learn/[cancer]/page.tsx   fact sheet for one cancer
  share/page.tsx
  help/page.tsx
  api/ask/route.ts       Ask Dada chat
  api/match/route.ts     survivor matching
  api/help/route.ts      find help
  api/sms/route.ts       Africa's Talking webhook
  layout.tsx
/components
  /layout          Header, MobileNav, Footer
  /ui              Button, Card, Input, Chip, Badge
  /features        FeatureCard, MythCard, SurvivorCard, HelpCard, HelpMap, DadaChat
/data              seed JSON files
/locales           en.json, rw.json, sw.json
/lib               supabase/, data.ts, gemini.ts, i18n.ts, helpers
/supabase          schema.sql and seed.sql for the SQL editor
/public/images     logo, illustrations, icons
6. Data (Supabase tables)

cancers { slug, name: {en, rw, sw}, summary, signs[], prevention[], icon }

myths { id, cancer (slug or "general"), myth: {en, rw, sw}, why_people_believe, fact, what_to_do, source, age_level, audio_url }

survivors (demo data, clearly marked) { id, name, cancer, language[], country, city, story, voice_url, is_demo: true }

support_groups { id, name, cancer, language, city, country, whatsapp_link, lat, lng, moderator }

organisations { id, name, offers[] (screening, drugs, vaccines, treatment, support), who_qualifies, how_to_apply, country, city, lat, lng, website, verified: true }

7. Environment variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
GOOGLE_AI_API_KEY=
ELEVENLABS_API_KEY=
AFRICASTALKING_USERNAME=
AFRICASTALKING_API_KEY=
8. Demo flow (3 minutes)
30s Amina's story: she found a lump, her family called it a curse, she waited two years
30s Three numbers: late diagnosis, distress, unknown help
90s Live demo following Amina:
Learn it: open the breast cancer card, flip the "curse" myth, ask Dada a question
Share it: get matched with a survivor and play her voice message
Find help: type her situation, watch the Kigali pins light up
30s The tech: Gemini + Adaption for African languages, SMS for basic phones
End: "Learn it. Share it. Find help."

Record a backup video as soon as the demo works.

9. What comes next
Oncologists and nurses review every lesson
Partner with hospitals and survivor associations for real survivors and trained moderators
Grow across Africa, country by country, with local languages and organisations
Train a small model so Dada works fully offline
Keep Menya open source