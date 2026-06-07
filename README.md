# Mukharbek Organokov - Portfolio

[![Release](https://github.com/kabartay/portfolio/actions/workflows/release.yml/badge.svg?event=push)](https://github.com/kabartay/portfolio/actions/workflows/release.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/kabartay/portfolio?label=Release)](https://github.com/kabartay/portfolio/releases)

A fast, static portfolio site for AI/ML & MLOps work. Built with plain **HTML/CSS/JS**, deployed as a **Static Site** on Render with pretty URLs, SEO basics, and a no-backend contact form via **Formspree**. Helped to setup your own website? You can buy me a coffee to support my work ☕️.

- © 2025–2026 Mukharbek Organokov  
- 🌐 Website: [www.organokov.com](https://www.organokov.com)  
- 📜 License: GNU General Public License v3.0  

## Documentation

Deeper developer docs live in [`docs/`](docs/README.md):

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the site works: the dual-page model, the homepage aggregate loader, and the two-axis theming system.
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) — local dev, the branch/PR workflow, and step-by-step guides (add a page, blog post, or palette).

## Content

    ├── README.md                      # Project overview, setup, deploy, and domain setup
    ├── .github/workflows/             # GitHub Actions CI
    │  ├── release.yml                 # Creates a GitHub Release + zip on every v*.*.* tag
    │  └── sync-deployment.yml         # Fast-forwards the `deployment` branch to main on every push
    ├── docs/                          # Developer documentation
    │  ├── README.md                   # Docs index
    │  ├── ARCHITECTURE.md             # How the site works (dual-page model, loader, theming)
    │  └── CONTRIBUTING.md             # Local dev, PR workflow, how-to guides, checklist
    ├── package-lock.json              # Exact, locked dependency versions for reproducible installs
    ├── package.json                   # Project metadata + dev scripts (e.g., "dev" with `serve`)
    ├── public/                        # All files served to the browser (site root)
    │  ├── assets/                     # Images, icons, downloadable files
    │  │  ├── cv.pdf                   # Downloadable CV
    │  │  ├── favicon.svg              # Site favicon
    │  │  └── og-card.svg              # Open Graph / social share card
    │  ├── about.html                  # About page (also reachable at /about via Render rewrites)
    │  ├── experience.html             # Experience/Resume page
    │  ├── education.html              # Education page
    │  ├── blog.html                   # Blog landing page (or list of posts)
    │  ├── contact.html                # Contact page (Formspree form lives here)
    │  ├── privacy.html                # Privacy notice (linked from the contact form)
    │  ├── index.html                  # Current homepage (also used as “shell” for aggregate loader)
    │  ├── index-old.html              # Previous homepage kept for reference (not linked)
    │  ├── 404.html                    # Custom not-found page (shown on broken routes)
    │  ├── robots.txt                  # Crawler rules; points to sitemap.xml
    │  ├── sitemap.xml                 # SEO sitemap of canonical “pretty” URLs
    │  └── src/                        # Versioned static assets (cache-busted by path)
    │     ├── css/                     # Stylesheets
    │     │  ├── style.css             # Site-wide layout + component styles (imports theme.css)
    │     │  └── theme.css             # Colour palettes (single source of truth for colours)
    │     └── js/                      # JavaScript for UX and dynamic assembly
    │        ├── aggregate.js          # Fetches each page, extracts main sections, and mounts them
    │        ├── main.js               # Global UI (nav, animations) + delegated contact form handler
    │        └── theme-config.js       # Theme behaviour: default palette, toggle on/off, palette list
    ├── render.yml                     # Render Static Site blueprint (routes/rewrites + headers/caching)
    └── serve.json                     # Local dev config for `npx serve` (headers/spa/caching; optional)

## Features

- **Static, zero-backend** (served from `/public`)
- **Pretty URLs** (`/about`, `/experience`, `/blog` etc.) via Render rewrites
- **Dynamic “aggregate” loader** that assembles sections into a single page
- **Dark mode** with system-preference detection and a navbar toggle (persisted to `localStorage`, applied before first paint to avoid a flash)
- **Config-driven colour palettes** — switch between Castleton Green and Indigo from the navbar; palettes and behaviour are defined in `theme.css` + `theme-config.js`
- **Contact form** wired to **Formspree** (no server code by decision)
- **Resilient UX:** custom `404.html`, smooth scrolling, mobile nav
- **Accessibility:** semantic landmarks, `aria-label`s on controls, keyboard-friendly nav
- **SEO essentials:** `sitemap.xml`, `robots.txt`, canonical tags, Open Graph/Twitter cards
- **Security & perf headers** via `render.yml` (HSTS, caching)

## Quick Start (Local)

Requirements: **Node 18+** (any static server works)

```bash
# install deps (if needed)
npm ci

# serve /public locally at http://localhost:3000
npx serve public -l 3000
```

Any static server is fine (`python -m http.server`, VS Code Live Server, etc.).
The site is entirely static — no build step required.

## Contact Form

Used **Formspree** for simplicity - no server code.  

- Obtain you own `https://formspree.io/f/YOUR-KEY` from Formspree;
- Target Email: set in the form’s Settings → Email Notifications;
- (Optional) Project → Settings → Restrict to Domain: `organokov.com` (set your domain);
- DevTools → Network to verify: `POST https://formspree.io/f/YOUR-KEY` returns `200 {"ok":true}`;
- Check Submissions if emails don’t arrive; also inspect spam/junk.

Form action in public/contact.html:

```html
    <form id="contactForm" action="https://formspree.io/f/YOUR-KEY" method="POST">
    <!-- name / email / message fields ... -->
    </form>
    <p id="formStatus" aria-live="polite"></p>
```

Delegated JS handler is bound globally in `public/src/js/main.js`, so it works even when the form is injected by the section loader:

```js
    if (!window.__contactDelegatedBound) {
    window.__contactDelegatedBound = true;
    document.addEventListener('submit', async (e) => {
        const form = e.target;
        if (!form.matches('#contactForm')) return;
        e.preventDefault();

        const statusEl = document.getElementById('formStatus');
        if (statusEl) statusEl.textContent = 'Sending...';

        try {
        const res = await fetch(form.action, {
            method: form.method || 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        });
        const txt = await res.text();
        console.log('Formspree status:', res.status, txt);

        if (res.ok) {
            form.reset();
            statusEl && (statusEl.textContent = 'Thanks! I’ll get back to you shortly.');
        } else {
            let msg = txt; try { msg = JSON.parse(txt)?.errors?.[0]?.message || txt; } catch {}
            statusEl && (statusEl.textContent = 'Error: ' + msg);
        }
        } catch (err) {
        console.error(err);
        statusEl && (statusEl.textContent = 'Network error. Please try again.');
        }
    });
    }
```

## Pretty URLs & Routing

Pages live as separate HTML files:

- `about.html`
- `experience.html`
- `blog.html`
- `contact.html`

but are served at clean paths (`/about`, etc) using Render rewrites (see `render.yml`).

Use root-relative links in HTML:

```html
<a href="/about">About</a>
<a href="/experience">Experience</a>
<a href="/blog">Blog</a>
<a href="/contact">Contact</a>
```

## Theming (Dark Mode & Colour Palettes)

Two independent axes control appearance, both set on the root `<html>` element **before first paint** (an inline IIFE + `theme-config.js` in every `<head>`), so there's no colour flash on load:

- **Light / dark** → `data-theme="dark"` (toggled by the 🌙 button; defaults to the OS preference)
- **Colour palette** → `data-palette="…"` (toggled by the navbar colour swatch)

Colours and behaviour live in two files:

| File | Responsibility |
| --- | --- |
| `public/src/css/theme.css` | All colour **values** — one CSS block per palette (`:root` = Indigo, `[data-palette="alt"]` = Castleton Green, plus a few commented-out experimental greens). `style.css` imports it first. |
| `public/src/js/theme-config.js` | All colour **behaviour** — which palettes exist, the default, and whether the switch is shown. |

Edit the `window.SITE_THEME` object in `theme-config.js`:

```js
window.SITE_THEME = {
  palettes: [
    { key: 'green',  label: 'Castleton Green', attr: 'alt'  },
    { key: 'indigo', label: 'Indigo',          attr: null   }, // null = :root default
  ],
  defaultPalette: 'green',     // shown to first-time visitors
  enablePaletteToggle: true,   // false hides the navbar swatch entirely
};
```

To **add a palette**: copy a block in `theme.css` (e.g. `[data-palette="alt"]`), rename the selector, tweak the tokens, then add a matching `{ key, label, attr }` entry to the list above. To **lock the site to one colour**, set `enablePaletteToggle: false`.

## Deployment

Deployed on **Render** (Static Site) using `render.yml`. Render watches the
`deployment` branch — not `main`. A GitHub Actions workflow
(`.github/workflows/sync-deployment.yml`) automatically fast-forwards
`deployment` to `main` on every push, so merging a PR triggers a Render
deploy with no manual steps.

```
merge PR → main → sync-deployment.yml → deployment branch → Render auto-deploy
```

> If Render stops auto-deploying, check that the service is set to watch the
> `deployment` branch (Render dashboard → Settings → Branch).

### Local

Use `npm run dev` for local development. Be aware, that `start` is only used if you run a Node server; Render static sites don't need it but it’s handy for testing.

```json
{
  "scripts": {
    "dev": "npx serve public -l 3000",
    "start": "npx serve -s public -l $PORT"
  }
}
```

### Headers & Caching

Deployment file `render.yml` sets security + caching headers:

Security:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

Caching:

- Short cache for `*.html`
- Long cache for `/src/**` and `/assets/**`

### Domains

Custom Domain:

- For example, `www.organokov.com`→ CNAME to your Render subdomain
- `organokov.com` → A → `YOUR_IP` (or ALIAS/ANAME to the Render subdomain)
- TLS certificates are issued automatically by Render.

### SEO

Basic SEO setup, please extend by your wish.

- Each page includes a `<link rel="canonical" …>` tag (e.g., `/about`).
- `public/sitemap.xml` lists canonical, pretty URLs.
- `robots.txt` points to the sitemap.
- `404.html` should include `<meta name="robots" content="noindex">`.
