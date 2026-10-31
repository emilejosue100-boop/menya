# Menya progress

## Components

**Layout**
- `BrandMark` — `logo-mark.svg` + Nunito “Menya” text (header 32px, login 48px, footer 24px)
- `PageShell` — 1200px content, 16/32 page padding, 48/64 section gaps
- `Header` — `components/layout/Header.tsx` — Logo left, nav from 1024px, actions right; bottom nav below 1024px
- `UserMenu` — header initial + Sign out (Supabase session)
- `BottomNav` — `components/layout/BottomNav.tsx` — Mobile bar: Home, Learn, Share, Help
- `Footer` — `components/layout/Footer.tsx` — Shared medical disclaimer
- `AppLayoutShell` — `components/layout/AppLayoutShell.tsx` — Header + bottom nav off `/login`; Footer on every page
- `LanguageSelector` — `components/layout/LanguageSelector.tsx` — English only, “more languages coming soon”

**UI**
- `Button`, `Card`, `Input`, `Chip`, `Badge`, `Icon` — Menya tokens; Lucide via `Icon` (sm 16 / md 20 / lg 24 / xl 32)

**Features**
- `FeatureCard` — Home Learn/Share/Help cards
- `MythCard` — Home myth of the day from `lib/data` (Supabase, JSON fallback)
- `HomeHeroSearch` — Ask Dada search (UI only)
- `LoginSignInForm` — Email + password sign-in/sign-up; guest = anonymous; clear errors
- `AgeChips` — Kids/Teens/Adults/Elders, stores `?age=` (default adults); on `/learn` and `/learn/[cancer]`
- `CancerGrid` — 5 cancer cards
- `FactSheet` — Signs and risk lists
- `MythCardFlip` — Flip card (tap/click/keyboard); speaker shows “Audio coming soon”
- `DadaChat` — `/api/ask` then keyword fallback
- `Quiz` — 3 questions, then a badge and Try again
- `SurvivorMatchForm` — `/api/match` then scored matching
- `SurvivorCard` — Demo survivor profile, Gemma reason when present
- `SupportGroupList` — WhatsApp demo links
- `HelpSearch` — `/api/help` then keyword match; multi filters
- `HelpMap` / `HelpMapCanvas` — Leaflet OSM map of Kigali (dynamic, no SSR)
- `HelpCard` — Org/group cards synced with pins

## Pages

| Route | Status |
| --- | --- |
| `/` | done (auth gate, data from `lib/data`) |
| `/login` | done (Supabase email + guest) |
| `/learn` | done (Supabase/JSON) |
| `/learn/[cancer]` | done (Ask Dada via `/api/ask`) |
| `/share` | done (match via `/api/match`) |
| `/help` | done (help via `/api/help`) |

## Data and API

- `lib/supabase/client.ts` + `server.ts` — `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `lib/data.ts` — reads Supabase; falls back to `/data` JSON
- `supabase/schema.sql` + `seed.sql` — run in the SQL editor
- `lib/ai.ts` — Gemma `gemma-4-26b-a4b-it` via Google AI Studio, 10s timeout, rules in the user message, JSON extracted from text
- `app/api/ask/route.ts` — Dada + safety rules; keyword fallback
- `app/api/match/route.ts` — JSON survivor id + reason; scoring fallback
- `app/api/help/route.ts` — situation → place ids; keyword fallback
- `proxy.ts` — not signed in → `/login`; after sign-in → `/`

## Design polish

- Logo-mark + real Nunito wordmark; SVG favicon
- Header no longer overlaps at 375–1280; nav hidden under 1024px
- Shared hover / focus-primary / pressed states; 150–200ms ease-out; reduce-motion

## Not finished / known problems

- Ask/Match/Help use Gemma; keyword/scoring fallback if Gemma fails, times out, or returns bad JSON
- Run `schema.sql` then `seed.sql` in Supabase; enable Anonymous sign-in for guest; turn off Confirm email for a fast demo
- WhatsApp buttons are demo links
- Voice and SMS not built
- Remote Stitch images may fail if Google URLs expire
- Next.js hydration overlay often blames Footer/BrandMark; likely in-IDE `data-cursor-ref`, not copy
