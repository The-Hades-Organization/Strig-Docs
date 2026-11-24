---
name: Themis docs
description: A sober reading surface for an authorization engine, with one authored moment, the seal.
colors:
  bg: "#f1f0eb"
  panel: "#f8f7f3"
  sunk: "#eceae2"
  line: "#dad6ca"
  line-strong: "#bdb8a8"
  ink: "#16201d"
  mute: "#4e6b63"
  jade: "#1f5c51"
  jade-bg: "#dae8e1"
  gold: "#b07d1e"
  gold-ink: "#7a5410"
  gold-bg: "#f0e3c2"
  deny: "#8e3226"
  deny-bg: "#f3ded6"
  err: "#b0301f"
  comment: "#496359"
typography:
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  ui:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.84375rem"
    fontWeight: 400
    lineHeight: 1.63
  caps:
    fontFamily: "Cinzel, serif"
    fontSize: "0.78125rem"
    fontWeight: 600
    letterSpacing: "0.16em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "14px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  callout:
    backgroundColor: "{colors.jade-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  code-block:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-link:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
---

# Design system: Themis docs

## Overview

Themis decides without looking at who is asking: the blindfold, the scales, the gilt knot. The site
applies that to reading. It is a quiet, ivory page with a near-black green night mode, fixed
columns and native controls. The personality sits in a few details: the seal of a ruling, the band
tilted by 9°, the gilt knot, and the spaced Roman capitals of the labels.

The source of truth is `src/styles/tokens.css`. Every component reads those custom properties; no
component carries a colour, space, radius, font, layer or duration literal.

## Colors

Green is the colour of structure and of *allow*. Gold is ornament and focus. A clay derived from the
same warmth marks *deny*, so no red comes from another system. Deny is a decision (closed seal, the
word, a cross); error is a defect in the text (a wavy underline, an exclamation). They never share a
shape.

- **Ivory page** (`bg`) with lighter **panel** cards and a darker **sunk** well for code.
- **Jade** (`jade`, on `jade-bg`): headings of structure, links, the allow state.
- **Gold** (`gold`): focus ring, caret, active marker. Never text: it measures 3.2:1 on light.
- **Gold ink** (`gold-ink`): who, where and numbers in code, and warning text. 5.3:1 on its surface.
- **Deny** (`deny`, on `deny-bg`): the deny verdict and breaking changes.

The dark theme redeclares every colour under `[data-theme='dark']`: bg `#16201d`, panel `#1b2824`,
sunk `#131b19`, ink `#e9e2d0`, mute `#9fc0b2`, jade `#7cc3ae`, gold `#e3b04b`, deny `#f0a08d`.

### Named rules

**Colour never decides alone.** Allow and deny are read as a word, then a shape, then a colour.

**One gold for ornament, one for text.** Using `gold` as text colour is a contrast failure.

## Typography

Inter for the interface and prose, JetBrains Mono for code and data, Cinzel for labels, tab names,
table heads and the ruling word. All three are served by the site from OFL files. The wordmark is
vector lettering, not a font.

- Prose is 16/26, measure capped at 44rem.
- Interface text is 14/20; support text is 12.5.
- Labels are capitals at 12.5 px with 0.16em spacing; the ruling word uses 0.14em; the home
  headings use 0.08em (`--track-heading`).
- Code is 13.5/22 with ligatures off and tabular figures.

### Code colour follows role

A word is coloured by what it does in the decision: declares (`jade`, 600), relates (`mute`), who and
where (`gold-ink`), the question (`ink`), the grant id (`ink`, 700), allow (`jade`, 700), deny
(`deny`, 700), quoted text (`mute`, italic), comments (`comment`, italic).

## Layout

The home opens on the ruling: a gilt band tilted by 9° behind the headline, two actions, the two
install commands, then an allow seal and a deny seal that answer the same question for two
resources. Below it come six ruled sections in one wide column, each with copy on one side and code
on the other from 64rem up: the question and how a decision is made, the policy in three syntaxes
(tabs, with a short policy of one permission, one role, one assignment and one grant, so the three
fit beside the copy; the full policy stays in the panel of the language pages), what the library
gives (the first item, the fail-closed guarantee, leads at a larger size; "Decisions explain
themselves" carries a compact verdict tag with a reason), install, and the exits (docs, playground,
GitHub, crates.io, npm). Section padding varies on purpose: the question sits close under the hero,
the syntaxes and the strengths get more room, install and exits are quick stops. Headings are Cinzel capitals at
0.08em; the home never uses the 0.16em of the small labels on a sentence-length heading.

A route no page claims renders `src/pages/404.tsx`: a headline, two actions and a deny seal. The
static build writes it to `404.html` and the server answers it with status 404.

Every documentation page has the same frame: the header, a row of section tabs (the page tree in
reading order, scrolling inside its own box when it outgrows the width), and one wide content column
with breadcrumbs, the title, the body and the pager. There is no sidebar and no table of contents.
A page may open with a seal as its verdict.

The pages about the policy language add a **syntax panel**: the same policy in Blocks, Rules and
Actors, stacked in a 28rem column beside the text. From 64rem up it is pinned below the header and
scrolls on its own; below 64rem it follows the text. Long lines wrap in the panel, so it never
scrolls sideways. Reference tables scroll inside their own box, never the page.

## Elevation & Depth

Depth is quiet. Cards sit on a border first and a soft vertical shadow second. Shadows always carry
an offset (`sh-1`, `sh-2`, `sh-3`); a zero-offset halo is not used. The search dialog is the only
element on `sh-3`.

## Shapes

Radii are 4 (inline code, kbd), 8 (controls, callouts), 14 (cards, code blocks, seal) and pill
(badges, verdict tags). The seal's disc is a circle.

## Components

- **Seal**: the icon of the banner. On allow the band opens, on deny it closes, and the knot ties.
  The band tilts by −9° behind the ruling. This is the one authored moment and the only place the
  angle appears besides the mark.
- **Callout**: tinted surface with a full 1 px border, an icon and a word (note, warning, breaking).
  No side stripe.
- **Button**: a link that looks like a button, 44 px tall, outlined by default. The primary one is
  jade-filled and there is one per view. Hover swaps the fill to ink on primary and to the sunk
  surface on the default; the focus ring is the global gold one.
- **Code block**: sunk well, caption with the language label (or the title given on the fence) and a
  copy button, scroll inside.
- **Doc tabs and syntax panel**: the section row and the pinned three-syntax column described in Layout.
- **Tabs**: Roman capitals, a gold underline on the active tab, arrow-key navigation.
- **Search**: a native dialog over the static index; opens with Ctrl+K, closes with Esc, returns
  focus to the button that opened it.
- **Sidebar, table of contents (kept in the design system, unused by the doc layout), breadcrumbs, pager, card link, kbd, version badge, table.**

Browser surfaces are themed too: green selection, gold caret, thin scrollbars in the border colour,
a 2 px gold focus ring with an offset, tabular figures. Motion uses `cubic-bezier(.16, 1, .3, 1)` at
120 ms (hover), 220 ms (tab, switch) and 720 ms (seal). With `prefers-reduced-motion` everything
drops to 1 ms.

## Do's and Don'ts

- Do read every colour, space, radius, layer and duration from a token.
- Do pair a verdict colour with its word and its shape.
- Do keep the −9° band to the seal and the area behind the ruling.
- Don't put a kicker or eyebrow above a heading.
- Don't use a coloured border on one side of a card, list item or callout.
- Don't use `gold` for text.
- Don't nest cards or use same-size icon cards as the page structure.
- Don't name a third-party tool or product in site copy.
