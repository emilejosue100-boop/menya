# Menya

Learn it. Share it. Find help. No one should face cancer in silence.

Menya is a calm cancer-awareness app for families in Africa, starting in Rwanda. It helps people learn verified facts, meet demo survivor circles, and find local help.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- Supabase for data and auth
- Gemma via Google AI Studio for Ask Dada, survivor matching, and Find help
- Leaflet + OpenStreetMap for the map

## Run locally

1. Copy keys into `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `GOOGLE_AI_API_KEY`).
2. `npm install`
3. `npm run dev`

The demo falls back to `/data` JSON and keyword matching if Supabase or Gemma is unavailable.
