# DESIGN.md

## Design Intent

Crypto Incident Intel should feel like a forensic reading room, not a startup landing page and not a generic security dashboard.

The visual target is:
- editorial enough to feel thoughtful and trustworthy
- precise enough to handle dense incident data
- restrained enough to avoid "AI slop"
- serious enough to earn credibility with researchers, auditors, and investors

This product is for people making decisions under uncertainty. The UI should communicate: calm, rigor, traceability, and control.

## Reference Blend

This design system is synthesized from the local `awesome-design-md` library, not copied from any one site.

Primary references:
- `claude`: warm editorial trust, serif-led hierarchy, parchment-toned atmosphere
- `stripe`: precise fintech density, tabular number handling, careful chrome around dense information
- `coinbase`: crypto trust language, restrained blue used functionally rather than decoratively
- `ollama`: ruthless subtraction, minimal ornament, flat containment where possible

## 1. Visual Theme & Atmosphere

The product should feel like:
- a research dossier laid out on a high-quality desk
- a serious institutional memo with live data
- a security terminal softened by editorial pacing

Avoid:
- neon cyberpunk
- purple AI gradients
- glossy glassmorphism dashboards
- consumer social card-grid aesthetics

The site should alternate between:
- warm light research surfaces for reading
- deep dark evidence/data bands for contrast and focus

The overall emotional tone is "forensic calm."

## 2. Color Palette & Roles

### Core Surfaces
- **Parchment** `#f3efe6`
  Primary page background. Warm, paper-like, not yellow.
- **Ivory Panel** `#fbf8f2`
  Main card and panel surface on light sections.
- **Archive Line** `#d9d1c5`
  Standard border and table divider color.
- **Dust Text** `#75685c`
  Secondary body copy and metadata on light surfaces.
- **Ink** `#1f1a17`
  Primary text color. Warm near-black.

### Dark Surfaces
- **Evidence Black** `#151618`
  Primary dark band background.
- **Dark Panel** `#202328`
  Nested dark cards and code/evidence containers.
- **Slate Line** `#343944`
  Borders on dark surfaces.
- **Fog Text** `#c7cbd3`
  Secondary text on dark surfaces.

### Functional Accent
- **Trust Blue** `#1859d1`
  Primary interactive accent. Links, active states, focus, selected filters.
- **Trust Blue Hover** `#0f4ab5`
  Hover state for primary accent.
- **Trust Blue Tint** `#e8f0ff`
  Background tint for selected chips, info callouts, and active rows.

### Supporting Accent
- **Terracotta Signal** `#b85f3d`
  Rare editorial accent for key highlights, section markers, and empty-state illustrations.
- **Recovery Green** `#1b8f52`
  Recovered/safe status only.
- **Loss Red** `#b33a3a`
  Severe loss/error state only.
- **Warning Amber** `#9b6a1a`
  Unresolved or partial-confidence state.

## 3. Color Rules

- Blue is functional, not decorative.
- Terracotta is atmospheric, not operational.
- Red and green are semantic only.
- Purple is banned.
- Gradients should be subtle background atmosphere only, never CTA styling.

## 4. Typography Rules

### Font Stack
- **Display / Editorial**: `Iowan Old Style`, `Georgia`, serif
- **UI / Body**: `Inter`, `ui-sans-serif`, system-ui, sans-serif
- **Mono / Data**: `IBM Plex Mono`, `ui-monospace`, monospace

### Typography Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|------|--------|-------------|----------------|------|
| Hero Display | Serif | 56-68px | 500 | 0.98-1.05 | -0.02em | Homepage hero and major section openers |
| Page Title | Serif | 40-48px | 500 | 1.05 | -0.02em | Incident titles, search page titles |
| Section Title | Serif | 28-32px | 500 | 1.10 | -0.01em | Main content modules |
| Card Title | Sans | 20-24px | 600 | 1.20 | -0.01em | Result cards, side panels |
| Body Large | Sans | 18px | 400 | 1.60 | normal | Lead text and summaries |
| Body | Sans | 16px | 400 | 1.60 | normal | Standard body copy |
| Label | Sans | 13px | 600 | 1.35 | 0.04em | Metadata labels, chips, field names |
| Meta | Sans | 12px | 500 | 1.40 | 0.06em | Statuses, taxonomies, overlines |
| Data | Mono | 13px | 500 | 1.45 | normal | IDs, evidence refs, tx hashes |
| Numeric | Mono | 14px | 500 | 1.30 | normal | Loss numbers, counts, dense metrics |

### Typography Principles

- Serif is for meaning and narrative.
- Sans is for navigation and interpretation.
- Mono is for proof, evidence, and numbers.
- Do not use serif in filters, tables, chips, or buttons.
- Use tabular-looking mono or disciplined sans styling for money amounts and counts.

## 5. Layout Principles

### Overall Structure
- Desktop-first research experience.
- Max width: `1200px`
- Reading width for dense text blocks: `68ch`
- Standard content shell: wide central column with optional sticky side rail

### Page Patterns

#### Home
- Hero statement
- Product wedge summary
- Key entry points
- Seed incidents / recent intelligence

#### Search / Explore
- Sticky left filter rail on desktop
- Dense result stack on right
- Each result must explain why it matched

#### Incident Detail
- Strong opening summary
- Snapshot rail
- Attack path as ordered narrative
- Evidence section as proof table
- Similar incidents below fold

#### Protocol Risk
- Input at top
- Architecture summary first
- Historical analogs second
- Controls checklist third

### Spacing Scale
- `4, 8, 12, 16, 20, 24, 32, 40, 56, 72`
- Tight spacing inside dense data modules
- Generous spacing between major reading sections

## 6. Shape Language

- Main panels: `18px-24px` radius
- Small panels: `14px-18px` radius
- Buttons: `12px-16px` radius
- Chips: `999px` pill only when truly compact
- Avoid giant pill buttons as a default

This is not Coinbase-style giant-pill fintech chrome. Our buttons should feel deliberate and compact.

## 7. Depth & Elevation

Depth should come from:
- surface contrast
- border containment
- occasional soft shadows

Standard shadow:
- `0 18px 40px rgba(20, 16, 12, 0.06)`

Dark panel shadow:
- `0 14px 32px rgba(0, 0, 0, 0.18)`

Rules:
- No floating toy-like cards.
- No heavy blur glass panels.
- No excessive layered shadow stacks.

## 8. Component Styling

### Navigation
- Slim, quiet, sticky top nav
- Light parchment or translucent ivory background
- Serif wordmark or restrained sans wordmark
- Blue only for current location or key action

### Buttons

#### Primary
- Background: Trust Blue
- Text: white
- Radius: 14px
- Padding: `10px 16px`
- Strong but not loud

#### Secondary
- Background: Ivory Panel
- Text: Ink
- Border: `1px solid #d9d1c5`
- Radius: 14px

#### Dark Surface Button
- Background: Dark Panel
- Text: white
- Border: `1px solid #343944`

### Inputs
- Background: `#fffdf9`
- Border: `1px solid #d9d1c5`
- Radius: 14px
- Focus ring: `0 0 0 3px rgba(24, 89, 209, 0.14)`
- Placeholder text should stay readable and warm, never pale gray mush

### Result Cards
- Not generic SaaS cards
- Dense and horizontally structured
- Title, loss, attack type, root cause, and match rationale visible without opening the page
- Hover should tighten focus with border/emphasis, not jump with huge motion

### Evidence Blocks
- Dark surface allowed here
- Mono labels for source type and IDs
- Each evidence item needs strong visual traceability
- Citations should feel audit-ready, not blog-like

### Snapshot Rail
- Compact metric cells
- Numeric data aligned carefully
- Use mono or tightly set sans for amounts and timestamps

### Similar Incident Rows
- Prefer compact comparison rows over decorative cards
- Show similarity dimension, not just title

## 9. Information Density Rules

- Dense where the user is comparing facts
- Relaxed where the user is reading summaries
- Never make users choose between readability and rigor

Good density:
- result lists
- evidence tables
- snapshot metrics
- taxonomy chips

Lower density:
- hero copy
- summary paragraphs
- empty states

## 10. Motion

- Keep motion minimal and meaningful
- Use subtle fade/slide reveals on load
- Use quick hover transitions on interactive containment
- Avoid springy dashboard motion
- Avoid decorative parallax or floating gradients

Recommended timing:
- hover: `120ms-160ms`
- panel enter: `180ms-240ms`
- no bounce easing

## 11. Imagery & Graphic Motifs

Primary visual motifs:
- dossier lines
- archival dividers
- subtle grid or ledger references
- restrained diagrammatic icons

Avoid:
- stock photos of hackers
- shields, locks, and generic cybersecurity cliches
- glowing chain graphics
- 3D token renders

If illustration is needed, it should feel like:
- annotated diagrams
- stamped research materials
- systems thinking, not marketing illustration

## 12. Empty States

Empty states must feel useful, not dead.

### Search Empty
- Explain why nothing matched
- Offer three ways to broaden the query
- Suggest one example query

### Protocol Risk Empty
- Explain accepted input shapes
- Show one example protocol input and one example architecture memo

### Similar Incidents Empty
- Explain that the record is under-normalized or lacks enough comparable structure

## 13. Accessibility

- Minimum 4.5:1 contrast for body text
- Visible focus ring on every interactive element
- Color cannot be the only signal for confidence level
- Touch targets minimum `44px`
- Ordered attack paths should be semantically correct lists
- Tables and evidence blocks must remain navigable on keyboard and screen reader

## 14. Responsive Behavior

### Mobile
- Search filter rail becomes top drawer
- Result cards stack into labeled rows
- Snapshot rail becomes 2-column metric grid
- Evidence blocks stay compact but scroll safely if needed

### Tablet
- Preserve information density
- Collapse only secondary rails

### Desktop
- Sticky filters
- Wide reading layout
- Split zones where comparison matters

## 15. Do's and Don'ts

### Do
- Use warm neutrals for trust and reading comfort
- Use blue sparingly and functionally
- Let serif headlines carry intellectual weight
- Make evidence and data feel precise
- Build layouts that reward expert scanning

### Don't
- Don't design this like a consumer crypto app
- Don't use purple, neon cyan, or hacker green
- Don't use oversized hero buttons and empty marketing sections
- Don't turn every content block into a floating card
- Don't hide important taxonomies below the fold

## 16. Prompt Guide For Future UI Work

When generating UI for this repo, use prompts like:

- "Design this page as a forensic research product: warm parchment background, serif-led hierarchy, blue used only for interaction, dense evidence-forward result rows."
- "Build a security incident detail page that feels like an institutional memo plus a data terminal, not a SaaS dashboard."
- "Use editorial warmth from Claude, data precision from Stripe, crypto trust cues from Coinbase, and minimal restraint from Ollama."

## 17. Initial Implementation Notes For This Repo

Immediate adjustments the current UI should move toward:
- Replace the current generic panel/card repetition with stronger search/result row layouts
- Tighten numeric presentation with mono styles for money and metadata
- Introduce a dark evidence band for citations and proof-heavy modules
- Add a quiet top navigation and clearer taxonomy/filter visual language
- Make the homepage less like a starter template and more like an intelligence front page
