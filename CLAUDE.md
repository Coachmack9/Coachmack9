# CLAUDE.md — CoachMack9 Codebase Guide

This file provides context for AI assistants working on the CoachMack9 repository.

---

## Project Overview

**CoachMack9** is a professional single-page landing website for a coaching service ("Coach Mack"). It is built with **pure vanilla HTML5, CSS3, and JavaScript** — zero dependencies, zero build steps.

**Purpose:** Marketing/lead generation site with sections for services, about, testimonials, and a contact form.

---

## Repository Structure

```
Coachmack9/
├── index.html    # Full page markup (281 lines)
├── script.js     # All interactivity (180 lines)
├── styles.css    # Complete styling + design system (800 lines)
└── CLAUDE.md     # This file
```

There are no subdirectories, no build tools, no package manager, and no configuration files.

---

## File Responsibilities

### `index.html`
The single HTML file. Sections in order:
- **Navbar** — fixed sticky nav with logo, links, CTA button, mobile burger menu
- **Hero** — full-viewport area with animated stat counters (500+ athletes, 12 years, 98% satisfaction) and gradient background
- **Services** — 6-card grid (Strength & Conditioning, Mental Performance, 1-on-1 Coaching, Group Programmes, Nutrition Guidance, Online Coaching)
- **About** — coach profile with image placeholder, certifications, and credentials
- **Testimonials** — 4 client cards on dark background
- **Contact** — contact info + validated form (name, email, service dropdown, message)
- **Footer** — navigation links and copyright

External dependency: Google Fonts (Inter, weights 400–800) loaded via CDN in `<head>`.

### `script.js`
All JavaScript is wrapped in an IIFE with `'use strict'`. Features:
- **Sticky navbar**: Adds `.scrolled` class at `scrollY > 60px` via passive scroll listener
- **Mobile burger menu**: Toggles `.open` class on nav + `aria-expanded` for accessibility
- **Animated counters**: `requestAnimationFrame` with cubic ease-out, targets set in HTML via `data-target`
- **Scroll reveal**: `IntersectionObserver` adds `.visible` class to cards/sections; stagger via `data-delay` attribute
- **Contact form validation**: Validates name (required), email (required + regex), service, message; shows inline errors and a success message after simulated 1.2s delay — **no actual backend submission**
- **Active nav highlight**: `IntersectionObserver` tracks which section is in viewport and applies `.active` to the matching nav link

### `styles.css`
Design system defined via CSS custom properties on `:root`:
- `--primary`: `#f97316` (orange accent)
- `--dark`: `#0f172a`
- `--container`: `1160px` max-width
- `--radius`: `14px` / `--radius-lg`: `22px`
- `--shadow-*`: Three-tier shadow scale (sm, md, lg)
- `--transition`: `0.25s ease`

Key patterns:
- BEM-style class naming: `.navbar__logo`, `.service-card`, `btn--primary`
- Fluid typography via `clamp()`
- Responsive breakpoints: `900px` (mobile nav overlay) and `640px` (typography/spacing)
- GPU-friendly animations using `transform` + `opacity` only
- Scroll-reveal via `.reveal` / `.reveal.visible` class toggle

---

## Development Workflow

### Running Locally
Open `index.html` directly in a browser — no server or build step needed.

For a local dev server (optional, e.g., for testing form behaviour in a stricter context):
```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

### Making Changes
1. Edit the relevant file (`index.html`, `script.js`, or `styles.css`)
2. Refresh the browser — no build step
3. Test across viewport widths (mobile ~375px, tablet ~768px, desktop ~1200px)

### No Tests, No Linting
There is no automated test suite or linter. Validate changes manually in-browser.

---

## Key Conventions

### HTML
- Use semantic elements (`<section>`, `<header>`, `<footer>`, `<nav>`)
- Maintain heading hierarchy (`h1` in hero only; `h2` for section titles; `h3` for cards)
- Use `aria-*` attributes for interactive controls (burger menu already has `aria-label` and `aria-expanded`)
- `data-target` on stat counters drives the animation endpoint
- `data-delay` on `.reveal` elements drives staggered animation order

### CSS
- Add new design tokens to `:root` — never hardcode repeated values inline
- Follow BEM naming: `block__element--modifier`
- Animate only `transform` and `opacity` (GPU-accelerated; never animate `width`, `height`, `top`, `left`)
- Keep responsive tweaks inside the existing `@media (max-width: 900px)` and `@media (max-width: 640px)` blocks unless a new breakpoint is clearly justified

### JavaScript
- All code must stay inside the existing IIFE — do not add globals
- Keep `'use strict'` at the top
- Use `requestAnimationFrame` for animations, `IntersectionObserver` for scroll effects — not `setInterval` or scroll event polling
- Use passive scroll listeners: `window.addEventListener('scroll', fn, { passive: true })`
- DOM queries: use `document.querySelector` / `querySelectorAll`; cache results in `const`

---

## Contact Form Notes

The contact form (`#contact-form`) currently **does not submit to a backend**. Validation runs client-side and a success message is shown after a simulated delay. To add real submission, replace the `setTimeout` block in `script.js` with a `fetch` call to an API endpoint or a form service (e.g., Formspree, Netlify Forms).

Placeholder contact details in `index.html`:
- Email: `hello@coachmack.com`
- Phone: `+1 (000) 000-0000` (placeholder — update before production)

---

## Git & Branching

- Feature branches follow the pattern: `claude/<description>-<session-id>`
- The main content was created in a single commit; keep commits descriptive
- No CI/CD is configured — deployments are manual

---

## Deployment

Drop the three files (`index.html`, `script.js`, `styles.css`) onto any static host:
- **GitHub Pages** — push to `main`, enable Pages in repo settings
- **Netlify / Vercel** — drag-and-drop or connect repo; set publish directory to `/`
- **Traditional hosting** — FTP/SFTP the files to the web root

No environment variables, secrets, or build commands are required.
