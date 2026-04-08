# CLAUDE.md — ProBot Solutions (Coachmack9)

Guidelines for AI assistants working in this repository.

---

## Project Overview

**ProBot Solutions** is a static marketing website and interactive tool for AI voice agent services targeting home service businesses. There is no build step, no package manager, and no framework — just plain HTML, CSS, and JavaScript deployed via GitHub Pages.

**Live site:** GitHub Pages (`.nojekyll` present to disable Jekyll)

---

## Repository Structure

```
/
├── index.html                          Landing page (redesigned 2026-04-08)
├── script.js                           Landing page interactions + voice demo player
├── styles.css                          Landing page styles (clean/professional theme)
├── playbook.html                       AI Receptionist Playbook page
├── playbook.js                         Playbook logic — 25 industry scripts, modal, clipboard
├── playbook.css                        Playbook styles
├── ai-receptionist-contractors.html    Service page — AI for contractors (w/ FAQ schema)
├── ai-voice-agent-hvac.html            Service page — AI for HVAC (w/ FAQ schema)
├── replace-answering-service-with-ai.html  Comparison page — AI vs answering service
├── service-page.css                    Shared styles for all 3 service pages
├── sitemap.xml                         All 5 pages listed with lastmod dates
├── robots.txt                          Crawler directives
├── 404.html                            Custom 404 page
├── logo.svg                            ProBot Solutions text wordmark (SVG)
├── favicon.svg                         Favicon
└── .nojekyll                           GitHub Pages — disables Jekyll processing
```

No subdirectories, no node_modules, no build artifacts.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 — custom properties, Grid, Flexbox, `clamp()` |
| Scripting | Vanilla JavaScript ES6+ (no frameworks) |
| Fonts | Google Fonts — Inter (400, 500, 600, 700, 800) |
| Build | None — files served as-is |
| Package manager | None — no `package.json` |
| Deployment | GitHub Pages |

---

## Development Workflow

### Editing

Open files directly in any editor. There is no build, compile, or transpile step. Changes are visible immediately when the HTML file is opened in a browser.

### Testing

There is no automated test suite. Verify changes by:
1. Opening `index.html` or `playbook.html` in a browser
2. Testing interactive features manually (mobile menu, counters, modals, copy-to-clipboard)
3. Checking responsiveness at multiple viewport widths

### Deploying

**Important:** There is no `master` or `main` branch. GitHub Pages serves from the branch `claude/create-landing-page-Knwwo`. All feature work goes on `claude/setup-new-project-We1kS`, merged via PR into the base branch.

- Feature branch: `claude/setup-new-project-We1kS`
- Live branch: `claude/create-landing-page-Knwwo`
- Do NOT push directly to the live branch — always create a PR and merge

### Contact Form

The contact form uses **formsubmit.co** (no account required):
- Endpoint: `https://formsubmit.co/ajax/rob@probotsolutions.com`
- On success: redirects to `https://api.leadconnectorhq.com/widget/booking/fyAxqrvzu6wILHjAFZfW`
- JS handles validation and submission via `fetch()` with `FormData`
- The HTML form `action` attribute is a fallback only (JS always intercepts)

---

## Coding Conventions

### JavaScript

- **Pattern:** IIFE (`(function() { 'use strict'; ... })()`) for scope isolation — preserve this pattern on both `script.js` and `playbook.js`
- **Naming:** `camelCase` for variables and functions
- **Constants:** `const` preferred; `let` for mutable; never `var`
- **Section comments:** Visual separators using `─` and `═` characters mark logical sections
- **No console output** in production code
- **No external libraries** — keep the zero-dependency constraint
- **DOM queries:** `document.querySelector` / `querySelectorAll`; cache references where reused

### CSS

- **Design tokens:** All colors, spacing, shadows, and radii are defined as CSS custom properties on `:root` in each stylesheet — always use variables, never hardcode values
- **Naming:** BEM-inspired (`.navbar__inner`, `.card--active`) but not strictly enforced
- **Utility classes:** `.container`, `.section`, `.reveal` are shared patterns
- **Responsive:** Mobile-first; media queries add desktop enhancements
- **Typography:** Use `clamp()` for fluid font sizes

### HTML

- **Semantic elements:** `<header>`, `<nav>`, `<section>`, `<footer>`, `<main>`
- **ARIA:** All interactive elements need `aria-label`, `aria-expanded`, `aria-hidden`, or `aria-modal` as appropriate
- **Data attributes:** Use `data-*` for JS hooks (`data-var`, `data-delay`, `data-target`) — do not mix behavioral state into class names
- **Forms:** Every `<input>` must have an associated `<label>`

### Security

- Never use `innerHTML` with unescaped user input — use `escHtml()` (defined in `playbook.js`) when rendering user-supplied values into HTML
- Template variable substitution must go through `vHtml()` / `vTxt()` — these handle fallbacks and escaping

---

## Key Files — Detailed Notes

### `script.js`

Handles all landing page interactivity:
- **Sticky navbar:** Adds `.scrolled` class on scroll
- **Mobile menu:** Burger button toggles nav; closes on outside click or nav-link click
- **Animated counters:** `IntersectionObserver` triggers count-up animation when stat section enters viewport
- **Scroll reveal:** `IntersectionObserver` adds `.visible` class to elements with `.reveal`; CSS handles the fade-in transition
- **Active nav highlight:** Highlights the nav link matching the current visible section
- **Contact form:** Client-side validation → submits via `fetch()` to formsubmit.co AJAX → redirects to booking calendar on success
- **Voice demo player:** `DEMO_SCRIPT` array drives animated call transcript with typing indicators and a live timer. Play/Reset buttons wired to `runDemo()` / `resetDemo()`.

### `playbook.js`

Core logic for the AI Receptionist Playbook (745 lines):

**Data:**
- `INDUSTRIES` array — 25 objects, each with `{ id, name, icon, tagline, examples, priceRange, serviceQ }`
- `vars` object — 6 customization fields: `agentName`, `businessName`, `ownerName`, `cityArea`, `openHour`, `closeHour`

**Key functions:**
- `renderGrid()` — Builds the 25-card industry selector grid
- `openModal(industryId)` — Opens script preview modal for a given industry
- `buildScriptHtml(industry, vars)` — Returns HTML for the modal display
- `buildScriptText(industry, vars)` — Returns plain text for clipboard export
- `vHtml(val, fallback)` — Returns escaped value or styled placeholder if empty
- `vTxt(val, fallback)` — Returns value or bracketed placeholder for plain text
- `escHtml(str)` — Escapes `&`, `<`, `>`, `"`, `'`
- `copyScript()` — Copies plain-text script to clipboard (modern API with `execCommand` fallback)

**Script structure (8 steps, consistent across all 25 industries):**
1. Greeting / agent introduction
2. Caller name capture
3. Industry-specific service question
4. Scheduling / availability
5. Address / location
6. Contact number
7. Summary / confirmation
8. Close

### `styles.css` / `playbook.css`

Design tokens (`:root` variables) — important ones:

| Variable | Value | Purpose |
|----------|-------|---------|
| `--primary` | `#0EA5E9` | Main brand cyan-blue |
| `--primary-dark` | `#0284C7` | Hover/active state |
| `--primary-light` | `#E0F2FE` | Background tints |
| `--dark` | `#0c1a2e` | Body text / headings |
| `--neutral` | `#334155` | Secondary text |
| `--muted` | `#64748b` | Tertiary / captions |
| `--radius` | `14px` | Standard border radius |
| `--radius-lg` | `22px` | Card / container radius |
| `--transition` | `0.25s ease` | Default transition speed |
| `--container` | `1160px` | Max content width |

---

## Adding a New Industry to the Playbook

1. Open `playbook.js`
2. Add a new object to the `INDUSTRIES` array following the schema:
   ```javascript
   {
     id: 'unique-id',       // kebab-case, used as HTML id
     name: 'Display Name',
     icon: '🔧',            // single emoji
     tagline: 'Short description shown on card',
     examples: 'Service A, Service B, Service C',
     priceRange: '$X–$Y per visit',
     serviceQ: 'What service do you need today?'  // opening question for this industry
   }
   ```
3. The grid and modal will render automatically — no other changes needed

---

## Modifying the Script Template

All 25 industries share the same 8-step script structure defined inside `buildScriptHtml()` and `buildScriptText()` in `playbook.js`. To change the script flow for all industries, edit those two functions. Industry-specific variation is controlled only by the `serviceQ` field.

---

## Accessibility Requirements

When adding or modifying interactive elements:
- Buttons must have `aria-label` if their visible text is ambiguous
- Modal must maintain `aria-modal="true"` and `role="dialog"` with a visible label
- ESC key must close any open modal (already wired in `playbook.js`)
- Focus must be set to the primary action button when a modal opens
- Overlay click must close the modal

---

## Brand Guidelines

- **Name:** ProBot Solutions
- **Logo:** Text wordmark only (`logo.svg`) — no icon/robot graphic
- **Primary color:** `#0EA5E9` (cyan-blue / sky-500 in Tailwind terms)
- **Font:** Inter (loaded from Google Fonts)
- **Tone:** Professional, concise, results-focused

---

## SEO & AI Citation Setup (as of 2026-04-08)

| Signal | Status | Notes |
|--------|--------|-------|
| Bing Webmaster Tools | Verification tag live | `msvalidate.01` in `<head>` — verify at bing.com/webmasters |
| Sitemap submitted | Ready to submit | `sitemap.xml` has all 5 pages |
| Organization schema | Live | In `<head>` of `index.html` |
| FAQPage schema | Live | On all 3 service pages |
| Service schema | Live | On 2 service pages |
| Google Search Console | Not yet set up | Next priority |
| Google Business Profile | Not yet claimed | Next after Search Console |

**Key contact/booking info:**
- Email: `rob@probotsolutions.com`
- Phone: `(781) 307-3117`
- Booking calendar: `https://api.leadconnectorhq.com/widget/booking/fyAxqrvzu6wILHjAFZfW`

---

## Landing Page Sections (redesign 2026-04-08)

1. **Navbar** — white always-visible, no transparent-to-white transition
2. **Hero** — two-column: text left, floating AI chat card right
3. **Voice Demo** — dark navy section, animated call transcript player
4. **How It Works** — 3-step process (step cards with connectors)
5. **Services** — 6 cards, 3-column grid
6. **Playbook Banner** — dark, links to playbook.html
7. **About** — image placeholder + Rob's bio
8. **Testimonials** — 4 cards, 2-column grid
9. **CTA Band** — dark navy, "Book Free Demo" + "For Contractors"
10. **Contact/Form** — light background, 2-column layout

---

## What to Avoid

- Do not add npm, a bundler, or a framework — the zero-dependency constraint is intentional
- Do not add TypeScript — keep plain JS
- Do not use `innerHTML` with raw user input
- Do not hardcode hex colors or pixel values — use CSS custom properties
- Do not add `console.log` statements to production files
- Do not push directly to `master` without review when working on features
