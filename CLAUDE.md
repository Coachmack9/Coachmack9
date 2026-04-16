# CLAUDE.md — ProBot Solutions (Coachmack9)

Guidelines for AI assistants working in this repository.

---

## Project Overview

**ProBot Solutions** is a static marketing website and interactive tool for AI voice agent services targeting home service businesses — based in Boston, MA, serving Massachusetts and New England. There is no build step, no package manager, and no framework — just plain HTML, CSS, and JavaScript deployed via GitHub Pages.

**Live site:** `https://probotma.boston` (custom domain, verified 2026-04-11)
**GitHub Pages fallback:** `https://coachmack9.github.io/Coachmack9/`

---

## Repository Structure

```
/
├── index.html                              Landing page (redesigned 2026-04-08)
├── script.js                               Landing page interactions + voice demo player
├── styles.css                              Landing page styles (clean/professional theme)
├── playbook.html                           AI Receptionist Playbook page
├── playbook.js                             Playbook logic — 25 industry scripts, modal, clipboard
├── playbook.css                            Playbook styles
├── pricing.html                            Pricing page — 3 tiers, ROI calculator, FAQ (added 2026-04-11)
├── ai-receptionist-contractors.html        Service page — AI for contractors (w/ FAQ schema)
├── ai-voice-agent-hvac.html                Service page — AI for HVAC (w/ FAQ schema)
├── ai-voice-agent-plumbers.html            Service page — AI for plumbers, emergency focus (added 2026-04-11)
├── ai-receptionist-24-7-emergency.html     Service page — 24/7 emergency AI for all trades (added 2026-04-11)
├── replace-answering-service-with-ai.html  Comparison page — AI vs answering service
├── ai-answering-service-massachusetts.html Local SEO page — MA/New England geo targeting (added 2026-04-11)
├── sell.html                               Digital product sales page — 25-Industry Playbook $97 (added 2026-04-12)
├── BingSiteAuth.xml                        Bing Webmaster Tools XML verification file (added 2026-04-16)
├── agency.html                             Agency/reseller partner program page (added 2026-04-12)
├── service-page.css                        Shared styles for all service pages
├── sitemap.xml                             All 11 pages listed with probotma.boston URLs
├── robots.txt                              Crawler directives
├── 404.html                                Custom 404 page
├── CNAME                                   Custom domain: probotma.boston
├── logo.svg                                ProBot Solutions text wordmark (SVG)
├── favicon.svg                             Favicon
└── .nojekyll                               GitHub Pages — disables Jekyll processing
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
| Deployment | GitHub Pages + custom domain `probotma.boston` |

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

**Important:** There is no `master` or `main` branch. GitHub Pages serves from the branch `claude/create-landing-page-Knwwo`. All feature work goes on `claude/setup-new-project-We1kS`, then merged into the live branch.

- Feature branch: `claude/setup-new-project-We1kS`
- Live branch: `claude/create-landing-page-Knwwo`
- Merge pattern: `git checkout claude/create-landing-page-Knwwo && git merge claude/setup-new-project-We1kS --no-edit && git push`

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
- **Animated counters:** `IntersectionObserver` triggers count-up on `.hero__trust` stat section
- **Scroll reveal:** `IntersectionObserver` adds `.visible` class to elements with `.reveal`
- **Active nav highlight:** Highlights nav link matching the current visible section
- **Contact form:** Client-side validation → `fetch()` to formsubmit.co AJAX → booking calendar redirect
- **Voice demo player:** `DEMO_SCRIPT` array drives animated call transcript with typing indicators and live timer. `runDemo()` / `resetDemo()`. Auto-starts when `a[href="#demo"]` links are clicked.

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

### `pricing.html`

Pricing page (added 2026-04-11):
- **3 plan tiers:** Starter $97/mo (500 calls), Growth $197/mo (1,500 calls, SMS dispatch), Pro $297/mo (unlimited)
- **ROI calculator:** JavaScript sliders — missed calls/week × job value × booking rate → live revenue loss + payback math
- **Feature comparison table:** Full side-by-side across all 3 tiers
- **30-day money-back guarantee** section
- **FAQPage JSON-LD** schema (5 questions)

### `ai-answering-service-massachusetts.html`

Local SEO page for Massachusetts (added 2026-04-11):
- **LocalBusiness schema** with 15 MA city `containsPlace` entries + all 6 New England states
- **FAQPage schema** with 4 MA-specific questions
- **8 service area region cards** (Greater Boston, North Shore, South Shore, MetroWest, Central MA, Pioneer Valley, Cape Cod, Merrimack Valley)
- Nor'easter / winter storm content for MA seasonal search intent
- Priority 0.95 in sitemap (highest after homepage)

### `sell.html`

Digital product sales page (added 2026-04-12):
- Standalone page — uses its own inline `<style>` block (does NOT use service-page.css)
- **Buy CTA:** Points to `https://probotmaestro.gumroad.com/l/omofdf` — update this URL if Gumroad product link changes
- **Pricing displayed:** $97 one-time (crossed-out $197 "was" price)
- **Sections:** hero → stats strip → what's inside (6 cards) → HVAC prompt preview → 25-industry grid → 3 persona cards → platform compatibility → guarantee → FAQ accordion → CTA band
- No geo meta tags (not a local SEO page — intentionally broad/national audience)
- Has `Product` JSON-LD schema with `offers` price $97

### `agency.html`

Agency partner program page (added 2026-04-12):
- Uses `styles.css` + `service-page.css` + inline `<style>` for agency-specific components
- **3 partner tiers:** Referral (20% monthly commission), Reseller (wholesale pricing, keep margin), White-Label (full brand)
- **Revenue calculator:** JS sliders for clients × rate − wholesale cost → gross / net / annual output
- **Application form:** `formsubmit.co` → `rob@probotsolutions.com`, subject "New ProBot Partner Application"
- Has geo meta tags (targets MA agencies as well as national)

### `service-page.css`

Shared styles for all service/landing pages. Key classes:
- `.quick-answer` — blue-bordered answer box for AI citation optimization
- `.service-hero` — dark navy hero with badge, title, sub, actions
- `.stat-row` / `.stat-box` — 4-stat horizontal grid
- `.feature-card` — icon + h3 + p card
- `.compare-table` — comparison table with `.win` / `.lose` cells
- `.faq-list` / `.faq-item` / `.faq-item__q` / `.faq-item__a` — accordion FAQ
- `.cta-band` — blue gradient CTA section (overrides dark navy from `styles.css` on service pages)
- `.breadcrumb` — breadcrumb nav

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

**Note:** `.badge` and `.btn--ghost` are preserved as aliases in `styles.css` for backward compatibility with older service pages. New pages use `.eyebrow` and `.btn--outline`.

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

## Adding a New Service Page

Use `ai-voice-agent-plumbers.html` or `ai-receptionist-24-7-emergency.html` as the template. Required elements:

1. **Head:** title, description, geo meta tags (all 4), canonical, og tags, favicon, styles.css + service-page.css, fonts
2. **Schemas:** `Service` + `FAQPage` JSON-LD blocks. Set `areaServed` to the full New England array (MA/CT/RI/VT/NH/ME + US)
3. **Navbar:** links to `index.html#services`, `pricing.html`, `playbook.html`, `index.html#contact` CTA
4. **Breadcrumb:** Home › Services › [Page Name]
5. **Sections:** service-hero, quick-answer box, stat-row (4 stats), features-grid, optional compare-table, faq-list, internal links grid, cta-band
6. **Footer:** full nav with all 9 pages including Pricing and Massachusetts
7. **Inline JS:** navbar scroll, burger menu, FAQ accordion
8. **Update:** `sitemap.xml` + all other page footers + index.html footer/contact links

---

## Geo Meta Tags (add to every page)

```html
<meta name="geo.region" content="US-MA" />
<meta name="geo.placename" content="Boston, Massachusetts" />
<meta name="geo.position" content="42.3601;-71.0589" />
<meta name="ICBM" content="42.3601, -71.0589" />
```

---

## LocalBusiness Schema Pattern (index.html / MA page)

```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "name": "ProBot Solutions",
  "url": "https://probotma.boston/",
  "telephone": "+17813073117",
  "email": "rob@probotsolutions.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Boston",
    "addressRegion": "MA",
    "postalCode": "02101",
    "addressCountry": "US"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 42.3601, "longitude": -71.0589 },
  "areaServed": [
    { "@type": "State", "name": "Massachusetts" },
    { "@type": "State", "name": "Connecticut" },
    { "@type": "State", "name": "Rhode Island" },
    { "@type": "State", "name": "Vermont" },
    { "@type": "State", "name": "New Hampshire" },
    { "@type": "State", "name": "Maine" },
    { "@type": "Country", "name": "United States" }
  ]
}
```

---

## Modifying the Script Template

All 25 industries share the same 8-step script structure in `buildScriptHtml()` and `buildScriptText()` in `playbook.js`. Industry-specific variation is controlled only by the `serviceQ` field.

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
- **Location:** Boston, MA — serving Massachusetts & New England (always mention in local context)

---

## SEO & Indexing Status (as of 2026-04-11)

| Signal | Status | Notes |
|--------|--------|-------|
| Custom domain | Live | `probotma.boston` — DNS verified, HTTPS enforcing |
| All canonical URLs | Updated | All pages point to `probotma.boston/` |
| Bing Webmaster Tools | Tag live, needs verify click | `msvalidate.01` in `<head>` of index.html |
| Sitemap | 11 pages, ready to submit | `probotma.boston/sitemap.xml` |
| LocalBusiness schema | Live | index.html + MA page — full geo + areaServed |
| Organization schema | Live (as LocalBusiness) | index.html |
| FAQPage schema | Live | All service pages + pricing + MA page |
| Service schema | Live | All service pages |
| Geo meta tags | Live | All 9 pages — geo.region, geo.placename, geo.position, ICBM |
| New England areaServed | Live | All service page schemas — 6 states |
| Google Search Console | NOT set up | Need Rob to get HTML tag from search.google.com/search-console |
| Google Business Profile | NOT claimed | After Search Console |

**Verification tag placeholders in index.html:**
```html
<meta name="msvalidate.01" content="16B870FF6B74C9F4B6264A65284781CC" />
<!-- <meta name="google-site-verification" content="PASTE_YOUR_CODE_HERE" /> -->
```

**Key contact/booking info:**
- Email: `rob@probotsolutions.com`
- Phone: `(781) 307-3117`
- Booking calendar: `https://api.leadconnectorhq.com/widget/booking/fyAxqrvzu6wILHjAFZfW`

---

## EOD Build Summary — 2026-04-16

### Changes

**Pricing updated sitewide** — all 11 pages + cloudflare-worker.js updated:
- Starter: $97/mo → **$297/mo**
- Growth: $197/mo → **$497/mo**
- Pro: $297/mo → **$697/mo**

**Logo fixed** — `logo.svg` updated to single-line wordmark: `ProBot Solutions` (lowercase "o" in Bot, darker blue tspan on "ot")

**Harvey ElevenLabs voice widget** — live conversational AI embedded in the voice demo section on `index.html`
- Agent: Harvey · Agent ID: `agent_0901kmjs00zgf61r0g63b5n6a5dt`
- Voice: Mark · Voice ID: `UgBBYS2sOqTuMpoF3BR0`
- Widget script: `https://elevenlabs.io/convai-widget/index.js`
- Replaces the old simulated text transcript demo player

**Bing Webmaster Tools** — `BingSiteAuth.xml` added at site root for XML file verification method (meta tag `16B870FF6B74C9F4B6264A65284781CC` already in `index.html`)

**Chat widget** — `chat-widget.js` Cloudflare Worker proxy fully working; all 5 widget tests green

### Files added/changed
- `logo.svg` — single-line ProBot wordmark, lowercase o
- `index.html` — Harvey ElevenLabs widget in demo section
- `BingSiteAuth.xml` — Bing XML verification file
- `pricing.html`, `index.html`, `agency.html`, `sell.html`, `cloudflare-worker.js`, all 6 service pages — pricing updated to $297/$497/$697

### Pending (requires Rob's action)
- **Bing Webmaster Tools** — switch to XML file method and click Verify at bing.com/webmasters
- **Google Search Console** — get HTML meta tag from search.google.com/search-console → paste to Claude → deploy in 60 seconds
- **ElevenLabs Harvey** — confirm "Allow embedding on external websites" is enabled in Harvey's Security/Widget settings

---

## EOD Build Summary — 2026-04-12

### Site structure (11 live pages at probotma.boston)

| Page | URL | Added |
|------|-----|-------|
| Landing page | `/` | 2026-04-08 (redesigned) |
| Pricing | `/pricing.html` | 2026-04-11 |
| AI for Contractors | `/ai-receptionist-contractors.html` | 2026-04-08 |
| AI for HVAC | `/ai-voice-agent-hvac.html` | 2026-04-08 |
| AI for Plumbers | `/ai-voice-agent-plumbers.html` | 2026-04-11 |
| 24/7 Emergency AI | `/ai-receptionist-24-7-emergency.html` | 2026-04-11 |
| AI vs Answering Service | `/replace-answering-service-with-ai.html` | 2026-04-08 |
| Massachusetts Local | `/ai-answering-service-massachusetts.html` | 2026-04-11 |
| AI Playbook | `/playbook.html` | 2026-04-08 |
| Playbook Sales Page | `/sell.html` | 2026-04-12 |
| Agency Partner Program | `/agency.html` | 2026-04-12 |

### What was built on 2026-04-12

**New revenue assets:**
- `sell.html` — Digital product sales page for the 25-Industry AI Voice Agent Playbook at $97 one-time. Includes: product preview with live HVAC prompt excerpt, 25-industry grid, 3 buyer persona cards, platform compatibility list (Vapi/ElevenLabs/Bland AI/Retell etc.), 30-day guarantee, FAQ accordion (6 Qs), and buy CTA linked to Gumroad `probotmaestro.gumroad.com/l/omofdf`
- `agency.html` — White-label/reseller partner program page. Includes: revenue math strip, interactive JS revenue calculator (clients × rate − wholesale = margin), 4-step how-it-works, 3 partner tiers (Referral 20% commission / Reseller keep margin / White-Label full brand), 6-item resource grid, partner application form via formsubmit.co

**Source asset:**
- `ProBot-25-Industry-Voice-Agent-Playbook.html` — Rob's standalone HTML file containing 25 complete deploy-ready AI voice agent system prompts (one per industry). Gumroad product live. This is the product being sold on sell.html.

**Infrastructure:**
- `sitemap.xml` updated from 9 → 11 pages; sell.html and agency.html added at priority 0.85
- Both pages merged to live branch `claude/create-landing-page-Knwwo` and deployed

### Pending (requires Rob's action)
1. **Bing Webmaster Tools** — click "Verify" at bing.com/webmasters
2. **Google Search Console** — get HTML meta tag → paste to Claude → live in 60 seconds
3. **Gumroad** — product already live at `probotmaestro.gumroad.com/l/omofdf`; confirm product name, price ($97), and file upload are correct

---

## EOD Build Summary — 2026-04-11

### Site structure (9 live pages at probotma.boston)

| Page | URL | Added |
|------|-----|-------|
| Landing page | `/` | 2026-04-08 (redesigned) |
| Pricing | `/pricing.html` | 2026-04-11 |
| AI for Contractors | `/ai-receptionist-contractors.html` | 2026-04-08 |
| AI for HVAC | `/ai-voice-agent-hvac.html` | 2026-04-08 |
| AI for Plumbers | `/ai-voice-agent-plumbers.html` | 2026-04-11 |
| 24/7 Emergency AI | `/ai-receptionist-24-7-emergency.html` | 2026-04-11 |
| AI vs Answering Service | `/replace-answering-service-with-ai.html` | 2026-04-08 |
| Massachusetts Local | `/ai-answering-service-massachusetts.html` | 2026-04-11 |
| AI Playbook | `/playbook.html` | 2026-04-08 |

### What was built on 2026-04-11

**New pages:**
- `pricing.html` — 3-tier pricing ($97/$197/$297), interactive JS ROI calculator, full feature comparison table, 30-day guarantee, FAQ schema
- `ai-voice-agent-plumbers.html` — Emergency plumbing AI page with before/after comparison, 6-step dispatch protocol, schemas
- `ai-receptionist-24-7-emergency.html` — 24/7 emergency coverage for all trades, comparison table vs live answering + voicemail, schemas
- `ai-answering-service-massachusetts.html` — Local SEO page, 8 MA regional service area cards, nor'easter content, LocalBusiness schema with 15 MA cities

**Infrastructure:**
- Custom domain `probotma.boston` verified and live; CNAME file in repo
- All canonical URLs, og:url, JSON-LD `url` fields updated from `coachmack9.github.io/Coachmack9/` → `probotma.boston/`
- Geo meta tags added to all 9 pages
- LocalBusiness schema (replaces plain Organization) on index.html and MA page
- Full 6-state New England `areaServed` array in all service page schemas
- All navbars updated: Pricing link added, old About/Testimonials links removed
- All footers updated: full 9-page nav on every page
- Sitemap updated: 9 pages, all at `probotma.boston/`, lastmod 2026-04-11
- Footer copy updated: "Boston, MA · Serving Massachusetts & New England"
- Service page CTA bands: secondary button changed to "See Pricing →"

### Pending (requires Rob's action)
1. **Bing Webmaster Tools** — click "Verify" button at bing.com/webmasters
2. **Google Search Console** — go to search.google.com/search-console → Add property → URL prefix → `https://probotma.boston/` → get HTML meta tag → paste to Claude → deploy in 60 seconds
3. **Namecheap DNS** — if not already done: 4 A records (185.199.108-111.153) + CNAME www → coachmack9.github.io

---

## Landing Page Sections (redesign 2026-04-08)

1. **Navbar** — white always-visible, Pricing + Playbook + Hear the AI + Contact links
2. **Hero** — two-column: text left, floating AI chat card right
3. **Voice Demo** — dark navy section, animated call transcript player
4. **How It Works** — 3-step process (step cards with connectors)
5. **Services** — 6 cards, 3-column grid
6. **Playbook Banner** — dark, links to playbook.html
7. **About** — image placeholder + Rob's bio
8. **Testimonials** — 4 cards, 2-column grid
9. **CTA Band** — dark navy, "Book Free Demo" + "For Contractors"
10. **Contact/Form** — light background, 2-column layout with service page links

---

## What to Avoid

- Do not add npm, a bundler, or a framework — the zero-dependency constraint is intentional
- Do not add TypeScript — keep plain JS
- Do not use `innerHTML` with raw user input
- Do not hardcode hex colors or pixel values — use CSS custom properties
- Do not add `console.log` statements to production files
- Do not push directly to the live branch — always merge from feature branch
- Do not change canonical URLs back to `coachmack9.github.io` — domain is `probotma.boston`
- Do not remove geo meta tags — required for local SEO
