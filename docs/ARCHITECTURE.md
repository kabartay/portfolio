# Architecture

How this portfolio is put together and why. The site is intentionally a
**plain static site** — no framework, no bundler, no build step — so the whole
thing can be understood by reading a handful of files.

- [Goals & constraints](#goals--constraints)
- [The dual-page model](#the-dual-page-model)
- [The aggregate loader](#the-aggregate-loader)
- [Theming: two independent axes](#theming-two-independent-axes)
- [File responsibilities](#file-responsibilities)
- [Page lifecycle](#page-lifecycle)
- [Routing & pretty URLs](#routing--pretty-urls)
- [Known quirks & gotchas](#known-quirks--gotchas)

---

## Goals & constraints

| Goal | Consequence |
| --- | --- |
| Fast first paint, no JS framework cost | Hand-written HTML/CSS/JS, served as-is |
| Zero backend | Contact form posts to **Formspree**; no server code |
| Good SEO & shareability | Every page is a real, crawlable HTML file with its own `<title>`, canonical tag, and Open Graph metadata |
| Single-page feel on the homepage | A small loader stitches the section pages into one scrolling page |
| No build step | Source files in `public/` are exactly what ships |

The tension between "every page is a standalone document" (good for SEO) and
"the homepage should feel like one continuous page" is resolved by the
**dual-page model** below.

---

## The dual-page model

Every content area exists as a **standalone HTML file** in `public/`:

```
about.html  experience.html  education.html  blog.html  contact.html
```

Each one:

- is fully self-contained (own `<head>`, navbar, footer, metadata),
- is reachable directly at a pretty URL (`/about`, `/experience`, …),
- wraps its real content in a single `<main><section>…</section></main>`.

The homepage [index.html](../public/index.html) is a thin **shell**. Instead of
duplicating content, it contains an empty mount point:

```html
<main id="main">
  <div class="loading" id="loading-indicator">Loading</div>
  <div id="all-sections"></div>
</main>
<script src="/src/js/aggregate.js"></script>
```

At runtime, [aggregate.js](../public/src/js/aggregate.js) fetches each standalone
page, extracts its `<main section>`, and appends it to `#all-sections` — turning
six separate documents into one long scrolling homepage.

```
                       ┌── fetch about.html ──► extract <main section> ─┐
index.html (shell) ────┼── fetch experience.html ──► …                  ├──► #all-sections
  + aggregate.js       ├── fetch education.html ──► …                   │     (one page)
                       ├── fetch blog.html ──► …                        │
                       └── fetch contact.html ──► …                     ┘
```

The same HTML therefore serves two audiences:

- **Crawlers / direct links** → the standalone page (`/about`).
- **Homepage visitors** → the aggregated single-page experience (`/#about`).

The sub-pages load [main.js](../public/src/js/main.js); the homepage shell loads
[aggregate.js](../public/src/js/aggregate.js). Both share the same CSS and the
same theme bootstrap.

---

## The aggregate loader

[aggregate.js](../public/src/js/aggregate.js) drives the homepage. Key pieces:

**1. The page manifest** — the ordered list of sections to stitch together:

```js
const pages = [
  { id: 'home',       url: 'index.html',      title: 'Home' },
  { id: 'about',      url: 'about.html',      title: 'About' },
  { id: 'experience', url: 'experience.html', title: 'Experience' },
  { id: 'education',  url: 'education.html',   title: 'Education' },
  { id: 'blog',       url: 'blog.html',        title: 'Blog' },
  { id: 'contact',    url: 'contact.html',     title: 'Contact' },
];
```

**2. `fetchSection()`** — fetches a page, parses it with `DOMParser`, and pulls
out the meaningful content:

- `home` → the `.hero` block (with a hard-coded fallback if missing).
- everything else → `main section` (falls back to the first `section`, then to
  `main` with inline styles stripped).
- on failure → a visible error card, so a broken page never blanks the site.

**3. Progressive load** — the hero loads first and the loading indicator is
hidden immediately; the remaining sections stream in sequentially so the page is
interactive fast.

**4. `setupSmoothScrolling()`** — an `IntersectionObserver` highlights the active
nav link as you scroll; nav clicks smooth-scroll and update the hash with
`history.replaceState` (not `pushState`), so the back button isn't polluted with
one entry per section.

**5. `setupInteractions()`** — wires up the post-load UI: fade-in animations,
the navbar scroll effect, the mobile menu, the back-to-top button, and the blog
"Read more / Show less" toggles.

**6. Toggles** — `setupThemeToggle()` and `setupPaletteToggle()` wire the navbar
🌙 dark-mode button and the colour swatch (see [Theming](#theming-two-independent-axes)).

> Because the homepage content is injected **after** load, anything that touches
> it (event handlers, the contact form) is bound with **event delegation** or
> re-run inside `setupInteractions()`. A handler bound only on `DOMContentLoaded`
> to a specific element would miss the injected markup.

---

## Theming: two independent axes

Appearance is controlled by **two orthogonal attributes** on the root `<html>`
element, each persisted to `localStorage` and applied **before first paint** to
avoid a flash of the wrong colours.

| Axis | Attribute | Values | Toggle |
| --- | --- | --- | --- |
| Light / dark | `data-theme` | `dark` (absent = light) | 🌙 navbar button |
| Colour palette | `data-palette` | `alt` (Castleton Green), absent = `:root` Indigo | colour swatch |

**Where the values live:**

- [public/src/css/theme.css](../public/src/css/theme.css) — **colour values only**.
  One block per palette (`:root`, `[data-palette="alt"]`, plus commented-out
  experimental greens), and per-palette dark-mode overrides
  (`[data-theme="dark"][data-palette="alt"]`). All gradients/tints auto-derive
  from a small set of `--*-rgb` channel tokens, so a palette only needs to
  redefine ~10 variables.
- [public/src/js/theme-config.js](../public/src/js/theme-config.js) — **behaviour
  only**: which palettes exist (`window.SITE_THEME.palettes`), the default, and
  whether the swatch is shown (`enablePaletteToggle`). It exposes
  `__applyPalette()`, `__cyclePalette()`, and `__paletteLabel()` for the toggle.

**Pre-paint bootstrap** — every page's `<head>` contains, in order:

```html
<!-- 1. dark/light, inline so it runs before CSS applies -->
<script>!function(){var t=localStorage.getItem('theme');t?document.documentElement.setAttribute('data-theme',t):window.matchMedia('(prefers-color-scheme: dark)').matches&&document.documentElement.setAttribute('data-theme','dark')}();</script>
<!-- 2. palette, sets data-palette before <body> paints -->
<script src="/src/js/theme-config.js"></script>
```

This is why there's no colour flicker on reload: the attributes are set before
the browser renders the first frame.

See the **Theming** section of the [root README](../README.md) for the
copy-paste config and instructions to add or lock a palette.

---

## File responsibilities

| File | Responsibility |
| --- | --- |
| [public/index.html](../public/index.html) | Homepage **shell** — empty mount + `aggregate.js` |
| `public/{about,experience,education,blog,contact,privacy}.html` | Standalone pages; content lives in `<main><section>` |
| [public/404.html](../public/404.html) | Custom not-found page (`noindex`) |
| [public/src/css/style.css](../public/src/css/style.css) | Layout + component styles; `@import`s `theme.css` first |
| [public/src/css/theme.css](../public/src/css/theme.css) | All colour values; one block per palette |
| [public/src/js/aggregate.js](../public/src/js/aggregate.js) | Homepage loader + all homepage interactions |
| [public/src/js/main.js](../public/src/js/main.js) | Sub-page UI + delegated contact-form handler |
| [public/src/js/theme-config.js](../public/src/js/theme-config.js) | Palette list, default, toggle behaviour |
| [render.yml](../render.yml) | Render blueprint: rewrites, security + cache headers |
| [serve.json](../serve.json) | Local `npx serve` config (optional) |

---

## Page lifecycle

**Direct visit to a sub-page (`/about`)**

```
Render rewrite /about → /about.html
  └─ <head> inline IIFE sets data-theme        (no flash)
  └─ theme-config.js sets data-palette         (no flash)
  └─ style.css + theme.css paint
  └─ main.js wires nav, toggles, blog/contact handlers
```

**Visit to the homepage (`/`)**

```
index.html shell paints (theme set in <head>, same as above)
  └─ aggregate.js runs
       ├─ strips any stale #hash (fresh loads start at top)
       ├─ fetch index.html → mount .hero, hide loader
       ├─ fetch about/experience/education/blog/contact → mount <section>s
       ├─ setupSmoothScrolling()  (scroll-spy nav, replaceState hash)
       ├─ setupInteractions()     (fade-in, mobile menu, back-to-top, blog toggles)
       ├─ setupPaletteToggle()    (colour swatch)
       └─ setupThemeToggle()      (🌙 dark mode)
```

---

## Routing & pretty URLs

Pages are plain files but served at clean paths via **Render rewrites** in
[render.yml](../render.yml):

```yaml
routes:
  - { type: rewrite, source: /about,   destination: /about.html }
  - { type: rewrite, source: /education, destination: /education.html }
  - { type: rewrite, source: /privacy, destination: /privacy.html }
  # …one per page
```

Always use **root-relative** links in HTML (`/about`, not `about.html`) so links
work identically from any path. The same `render.yml` also sets security headers
(HSTS, `X-Frame-Options`, `nosniff`, referrer policy) and caching — long/immutable
for `/src/**` and `/assets/**`, short for `*.html`.

---

## Known quirks & gotchas

- **Injected homepage content needs delegated handlers.** The contact form is
  injected by the loader, so its submit handler is bound globally via delegation
  in `main.js` (guarded by `window.__contactDelegatedBound`). Don't rebind it to
  the element directly.
- **Two JS entry points.** `main.js` (sub-pages) and `aggregate.js` (homepage)
  duplicate a little logic on purpose (e.g. both have a theme toggle). If you
  change a global behaviour, check **both** files — this is exactly why the dark
  mode toggle once worked on sub-pages but not the homepage.
- **Open Graph image path.** Pages reference `assets/og-card.png` while the file
  in the repo is `og-card.svg`. Some scrapers don't render SVG OG images — add a
  PNG (or update the `og:image` paths) if social previews matter.
- **Adding a section to the homepage** means adding it to the `pages` array in
  `aggregate.js` **and** creating the standalone page — the standalone file alone
  won't appear on the homepage.
