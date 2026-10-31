Instructions for AI agents working on Menya

Read PROJECT.md first. It explains what Menya is, the three features, the data, and the folder structure.

Who you are working for

A small team building Menya in a short hackathon (4 to 5 hours). Speed matters, but the demo must look beautiful and must not break. Prefer simple, working code over clever code.

How to work
Plan first on big tasks. Before changing more than 3 files, write a short plan and wait for "go".
One screen or one feature per task. Do not touch other pages.
Never edit files in /design. They are the original Stitch exports, for reference only.
Do not touch API, database, or .env files unless the task asks for it.
When done, say in 2 to 4 lines what you changed and which files.
If something is unclear, ask one short question instead of guessing.
Stack
Next.js App Router, TypeScript, Tailwind CSS
Supabase for data, Gemini via Google AI Studio for AI
Leaflet + OpenStreetMap for the map
English only for now; Kinyarwanda and Swahili come later.
Server components by default; add "use client" only when needed (state, events, map)
Design rules

Menya is calm, hopeful, and friendly. Never scary or clinical. Light mode only.

Colors

Token	Hex	Use
primary	
#6D4FC2	main buttons, active nav, links
primary-soft	
#EDE7FB	card tints, hero, selected chips
lavender	
#B9A7E8	icons, featured borders
coral	
#F2836B	small highlights, badges
teal	
#1F9E86	fact tags, verified badges
myth-red	
#D9534F	myth tags only
background	
#FAF8FE	page background
surface	
#FFFFFF	cards, header
text	
#1F1A2E	headings, body
muted	
#6B6580	helper text
border	
#E6E1F2	cards, inputs

Always use these as Tailwind theme tokens. Never hard-code other colors.

Type

Headings: Nunito 700 (H1 32px, H2 24px, H3 18px)
Body: Inter 400, 16px, line height 1.6; small 14px; captions 12px

Spacing and shape

8px grid only: 4, 8, 16, 24, 32, 48, 64
Page padding: 16px mobile, 32px desktop
Card: padding 24px, radius 16px, 1px border, no heavy shadows
Buttons and inputs: 48px tall, radius 12px, full width on mobile
Touch targets at least 44px

Design quality

1. Hierarchy: one clear H1 per page, one primary button per section. Everything else is quieter.
2. Rhythm: 64px between page sections on desktop, 48px on mobile. 24px inside cards. 16px between related items. Never random values.
3. Alignment: all content lines up to the same left edge and the same max width (1200px).
4. Text: max 65 characters per line for paragraphs. Muted color for helper text. No text touching card edges.
5. Cards: same radius (16px), same border, same padding everywhere. Equal heights in a row.
6. Icons: one style (outline), one size per context, always vertically centered with their text.
7. States: every button and card has hover, focus (visible ring in primary), and pressed states.
8. Motion: soft and quick only (150 to 200ms, ease-out). No bouncing. Respect "reduce motion".
9. Images: no stretched or blurry images; use object-cover and fixed aspect ratios.
10. Match Stitch: wherever a page looks worse than the Stitch screenshot, follow Stitch's layout and spacing, but with Menya colors.

Layout

Mobile-first (375px), then desktop (content max width 1200px)
Desktop header: logo left, nav center (Learn it, Share it, Find help), language + bell + avatar right
Mobile: compact header + bottom nav (Home, Learn, Share, Help)
Code conventions
Reuse components from /components. Never copy styles between pages.
All visible text comes from /locales (en.json, rw.json, sw.json). No hard-coded strings.
File names: PascalCase for components (MythCard.tsx), kebab-case for routes.
Keep components small. One component per file.
Seed data lives in /data as JSON, loaded into Supabase (JSON is the fallback if Supabase is down).
Demo survivors must have is_demo: true and show a small "Demo profile" label.
Naming
Menya is the app name.
Dada is the AI guide character inside Menya ("Ask Dada").
Tagline: "Learn it. Share it. Find help."
Motto: "No one should face cancer in silence."
AI and safety rules (Dada)

Every Gemini call must follow these rules in its system prompt:

Answer only from the verified data passed in (myths, cancer facts, organisations). Never invent facts, organisations, phone numbers, or places.
Never diagnose. Never say someone has or does not have cancer.
Always suggest seeing a health worker when someone describes symptoms.
If the answer is not in the data, say: "I'm not sure about that. Please ask a health worker."
Use simple, kind words. Never scary. Reply in the user's language (English, Kinyarwanda, or Swahili).
Keep answers short: 3 to 5 sentences.
If someone mentions wanting to harm themselves, show a gentle message and a local helpline. Do not continue normal chat.

For matching and Find help, Gemini only picks from records in Supabase and returns their ids. The frontend shows the real records.

Every page must have
The footer: "Menya shares health information, not medical advice. Always see a health worker."
Working mobile view
Loading and empty states (never a blank screen during the demo)
Before saying a task is done
The page runs with no errors in the terminal or browser console
It looks right at 375px and at desktop width
Text switches correctly between English, Kinyarwanda, and Swahili
Nothing else in the app broke