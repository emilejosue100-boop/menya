---
name: Menya Design System
colors:
  surface: '#fdf7ff'
  surface-dim: '#dfd6f2'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f1ff'
  surface-container: '#f3eaff'
  surface-container-high: '#ede4ff'
  surface-container-highest: '#e8defa'
  on-surface: '#1d182c'
  on-surface-variant: '#494552'
  inverse-surface: '#332d42'
  inverse-on-surface: '#f5eeff'
  outline: '#7a7584'
  outline-variant: '#cac4d4'
  surface-tint: '#6749bc'
  primary: '#5435a8'
  on-primary: '#ffffff'
  primary-container: '#6d4fc2'
  on-primary-container: '#e7dcff'
  inverse-primary: '#cebdff'
  secondary: '#9d422f'
  on-secondary: '#ffffff'
  secondary-container: '#fd8c73'
  on-secondary-container: '#742413'
  tertiary: '#005648'
  on-tertiary: '#ffffff'
  tertiary-container: '#00715f'
  on-tertiary-container: '#85f5d9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e8ddff'
  primary-fixed-dim: '#cebdff'
  on-primary-fixed: '#21005e'
  on-primary-fixed-variant: '#4f2ea2'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#3e0500'
  on-secondary-fixed-variant: '#7e2b1a'
  tertiary-fixed: '#87f6db'
  tertiary-fixed-dim: '#69dabf'
  on-tertiary-fixed: '#00201a'
  on-tertiary-fixed-variant: '#005143'
  background: '#fdf7ff'
  on-background: '#1d182c'
  surface-variant: '#e8defa'
typography:
  display:
    fontFamily: Nunito Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Nunito Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: 0em
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Nunito Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  title-md:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 25.6px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for cancer awareness, survivor community building, and patient advocacy across African communities. The visual narrative balances clinical trustworthiness with emotional warmth, rejecting sterile white walls and intimidating medical semantics in favor of restorative, community-oriented digital spaces.

### Aesthetic Foundation
- **Tone & Persona:** Compassionate, empowering, clear, culturally grounded, and uplifting. The interface avoids cold fear-based metaphors, leaning into optimism, mutual aid, and demystification of medical realities.
- **Style Direction:** Soft Humanist Modernism. Built upon gentle structural curves, tactile surfaces, airy spacing, and intentional micro-affirmations.
- **Iconography & Visual Assets:** Monoline soft-stroked icons with rounded terminals (stroke-width: 1.75px–2px). Illustrations prioritize diverse African skin tones, active communal solidarity, and warm sunshine palettes rather than generic clinical equipment.

## Colors

The palette establishes an emotional sanctuary. Lavender serves as the grounding anchor of restorative calm and dignity, balanced by an energizing coral of hope and dedicated functional signifiers for truth-seeking and debunking.

### Palette Architecture
- **Primary Lavender:** `#6D4FC2` — Main interactive triggers, primary focus states, hero calls-to-action.
  - *Lavender Soft:* `#EDE7FB` — Calming card tints, active navigation pills, primary pill backgrounds.
  - *Lavender Mid:* `#B9A7E8` — Decorative dividers, active border outlines, supportive accents.
- **Hope Coral (Secondary):** `#F2836B` — Community milestones, survivor victory highlights, donor badges, emotional prompts.
- **Fact Teal (Tertiary):** `#1F9E86` — Medically verified facts, clinical partner badges, trusted resource confirmations.
- **Myth Red (Semantic Alert):** `#D9534F` — Strictly reserved for flagging cancer misconceptions, medical myths, and immediate urgency states. Must never be used decoratively.
- **Canvas & Surfaces:**
  - *App Background:* `#FAF8FE` (A warm, tinted lavender-white ensuring low optical fatigue).
  - *Surface / Elevated Container:* `#FFFFFF` (Pure white for legible medical content cards).
- **Typography & Boundaries:**
  - *Base Text (High Contrast):* `#1F1A2E` (Deep plum charcoal, softer than pure black).
  - *Muted Text:* `#6B6580` (Legible secondary descriptions, metadata, helper text).
  - *Borders & Dividers:* `#E6E1F2` (Soft lavender-tinted stroke for quiet hierarchy).

## Typography

Typography unifies clarity with an empathetic, friendly cadence:
- **Headlines (Nunito Sans, Weight 700 & 800):** Rounded terminals convey safety, warmth, and peer solidarity. Prevents anxiety when users encounter sensitive topics.
- **Body & Labels (Inter, Weight 400 & 600):** Optimized for continuous readability. Body-md uses a generous line-height of 1.6 (`25.6px`) to ensure reading comprehension across low-bandwidth devices, mobile viewports, and emotionally distressed states.

## Layout & Spacing

An 8-point spatial model creates rhythm and predictable vertical cadence:
- **Grid System:** A responsive 12-column grid on desktop (max content container: 1200px), 8-column on tablet, and 4-column on mobile.
- **Rhythm Scale:** `4px` (space-xs), `8px` (space-sm), `16px` (space-md), `24px` (space-lg), `32px` (space-xl), alongside expansive layouts using `48px` and `64px` for structural section dividers.
- **Fluid Adaptation:** On mobile devices, side margins compress to `16px` (`1rem`) to maximize touch target viability and readable paragraph widths.

## Elevation & Depth

Visual hierarchy employs low-opacity ambient drop shadows tinted with deep lavender, avoiding stark grey cast shadows.

- **Level 0 (Flat):** Surface `#FFFFFF` layered over canvas `#FAF8FE` bounded by a 1px `#E6E1F2` border.
- **Level 1 (Card & List Elevation):** `box-shadow: 0px 4px 16px rgba(109, 79, 194, 0.06);` with a 1px border of `#E6E1F2`. Used for default community story cards and verified resource summaries.
- **Level 2 (Interactive Floating & Hover):** `box-shadow: 0px 8px 24px rgba(109, 79, 194, 0.12);` paired with border `#B9A7E8`. Applied to active popovers, survivor search drawers, and mobile floating support actions.
- **Level 3 (Modals & Overlays):** `box-shadow: 0px 16px 36px rgba(31, 26, 46, 0.16);`.

## Shapes

The interface embraces organic, comforting curvatures that eliminate clinical sharpness:
- **Cards & Structured Containers:** Consistent `16px` (rounded-lg) radius.
- **Buttons, Form Inputs & Select Triggers:** Standardized `12px` radius to maintain a balanced, tactile feel.
- **Badges, Tags & Chips:** Full pill radius (`9999px`) for easy parsing and friendly recognition.

## Components

### Buttons
- **Height & Touch Target:** Strict `48px` height for all interactive primary, secondary, and tertiary buttons, honoring accessible motor-function standards on handheld devices.
- **Primary Button:** Background `#6D4FC2`, text `#FFFFFF`, border-radius `12px`, typography `label-lg`. Hover: `#5C40A8`. Active: scale `0.98`. Focus ring: 3px `#EDE7FB` with `#6D4FC2` outline.
- **Secondary Button:** Background `#EDE7FB`, text `#6D4FC2`, 1px border `#B9A7E8`.
- **Coral CTA (Action & Support):** Background `#F2836B`, text `#FFFFFF`. Used for "Join Support Circle" and community donation prompts.

### Form Inputs & Textareas
- **Height:** Single-line inputs fixed at `48px`.
- **Styling:** Surface `#FFFFFF`, 1.5px border `#E6E1F2`, border-radius `12px`, padding `0 16px`. Body font `16px` with color `#1F1A2E`. Placeholder `#6B6580`. Focus state: border `#6D4FC2` with a 3px outer halo tinted in `#EDE7FB`.

### Fact vs. Myth Badges & Chips
- **Fact Tag (Verified Knowledge):** Background `rgba(31, 158, 134, 0.12)`, text `#1F9E86`, 1px border `rgba(31, 158, 134, 0.3)`. Prefixed by a gentle checkmark badge.
- **Myth Tag (Debunking Card):** Background `rgba(217, 83, 79, 0.12)`, text `#D9534F`, 1px border `rgba(217, 83, 79, 0.3)`. Paired with a soft dismiss/info icon.
- **Hope & Survivor Badge:** Background `rgba(242, 131, 107, 0.12)`, text `#F2836B`, border `rgba(242, 131, 107, 0.3)`.

### Cards
- **Survivor Story & Educational Cards:** Background `#FFFFFF`, border-radius `16px`, border 1px `#E6E1F2`, padding `24px` (desktop) and `16px` (mobile). Includes gentle transition on hover to Level 2 elevation.
- **Myth vs. Fact Pair Card:** A dual-pane card split with a soft dotted border `#E6E1F2`, visually categorizing common cultural myths directly beside certified medical facts.

### Checkboxes & Radio Controls
- **Size:** 20px x 20px container with rounded corners (4px for checkboxes, 50% for radios).
- **Active State:** Background `#6D4FC2` with crisp white checkmark/dot indicator. Inactive: 2px stroke of `#B9A7E8`.

### Community Connection Ribbon (Specialty Component)
- A conversational banner container with `#EDE7FB` background, `16px` border-radius, and an accent bar of `#F2836B` providing reassurance, survivor count metrics, and regional language toggles.