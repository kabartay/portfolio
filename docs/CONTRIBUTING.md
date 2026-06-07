# Contributing

A practical guide to working on this site. It's a static HTML/CSS/JS project —
**no build step** — so the loop is fast: edit a file, refresh the browser.

- [Prerequisites](#prerequisites)
- [Local development](#local-development)
- [Branch & PR workflow](#branch--pr-workflow)
- [Commit conventions](#commit-conventions)
- [Common tasks](#common-tasks)
  - [Add a new page](#add-a-new-page)
  - [Add a blog post](#add-a-blog-post)
  - [Add or change a colour palette](#add-or-change-a-colour-palette)
  - [Edit content that appears on the homepage](#edit-content-that-appears-on-the-homepage)
- [Pre-merge checklist](#pre-merge-checklist)

If you haven't yet, skim [ARCHITECTURE.md](ARCHITECTURE.md) first — most tasks
below make more sense once you know the dual-page / aggregate-loader model.

---

## Prerequisites

- **Node 18+** (only used to run a static file server)
- `git` and the **GitHub CLI** (`gh`) if you want the one-line PR flow below

---

## Local development

```bash
npm ci                    # install the single dev dep (serve)
npm run dev               # serve public/ at http://localhost:3000
```

Any static server works just as well:

```bash
npx serve public -l 3000
python -m http.server -d public 3000
```

There is no compile step — what's in `public/` is exactly what ships. Edit and
hard-refresh (⌘⇧R) to bypass the long cache headers during development.

---

## Branch & PR workflow

Work on a short-lived branch and merge via a squashed PR (keeps `main` linear).

```bash
git checkout main && git pull
git checkout -b <type>/<short-description>      # e.g. fix/education-dark-borders

# …make changes…

git add -A
git commit -m "<type>(<scope>): <summary>"
git push -u origin HEAD

gh pr create --fill --base main                 # or pass --title/--body
gh pr merge --squash --delete-branch
```

> **Heads-up on squash merges.** Because PRs are squash-merged, a feature branch's
> individual commits won't exist on `main`. If you keep working on an old branch
> after its PR merged, git history diverges and GitHub reports phantom conflicts.
> The fix is to start fresh: `git checkout main && git pull && git checkout -b new/branch`.

---

## Commit conventions

[Conventional Commits](https://www.conventionalcommits.org/) — `<type>(<scope>): <summary>`:

| Type | Use for |
| --- | --- |
| `feat` | a new user-facing capability |
| `fix` | a bug fix |
| `docs` | documentation only |
| `style` | formatting / CSS-only visual tweaks |
| `refactor` | code change that neither fixes a bug nor adds a feature |
| `chore` | tooling, deps, housekeeping |

Examples from this repo: `fix(dark): hide education card separator lines in dark mode`,
`feat(theme): 7-palette cycler, live swatch, per-palette dark mode`.

---

## Common tasks

### Add a new page

1. **Create the file** `public/<name>.html`. Copy an existing page (e.g.
   [about.html](../public/about.html)) so you inherit the `<head>` boilerplate:
   charset/viewport, Open Graph + Twitter meta, `canonical`, favicon,
   `theme-color`, the stylesheet link, the dark-mode IIFE, and `theme-config.js`.
2. Put the real content inside a single `<main><section>…</section></main>` —
   the aggregate loader extracts exactly this.
3. **Add a Render rewrite** in [render.yml](../render.yml):

   ```yaml
   - { type: rewrite, source: /<name>, destination: /<name>.html }
   ```

4. **Link it** from the navbar (`.nav-links`) and footer on the other pages,
   using a root-relative href: `<a href="/<name>">Name</a>`.
5. If it should appear in search results, add it to
   [public/sitemap.xml](../public/sitemap.xml).
6. To make it part of the **homepage** scroll, also add it to the `pages` array
   in [aggregate.js](../public/src/js/aggregate.js) (see
   [the note below](#edit-content-that-appears-on-the-homepage)).

### Add a blog post

Posts live as cards in [blog.html](../public/blog.html). Copy an existing
`.blog-card` and edit it. The "Read more / Show less" behaviour is automatic for
any card whose excerpt uses the `blog-excerpt` + `clamp` classes followed by a
`.toggle-excerpt` button — both `main.js` and `aggregate.js` wire these up.

### Add or change a colour palette

Two files, in this order:

1. **Colours** — in [theme.css](../public/src/css/theme.css), copy the
   `[data-palette="alt"]` block, rename the selector (e.g. `[data-palette="ocean"]`),
   and edit the tokens. You mainly need the `--*-rgb` channel triples; gradients
   and tints derive from them. Add a matching
   `[data-theme="dark"][data-palette="ocean"]` block for dark-mode backgrounds.
2. **Behaviour** — in [theme-config.js](../public/src/js/theme-config.js), add an
   entry to `window.SITE_THEME.palettes`:

   ```js
   { key: 'ocean', label: 'Ocean', attr: 'ocean' },   // attr = the data-palette value; null = :root
   ```

To **lock the site to one colour**, set `enablePaletteToggle: false`. To set the
default for new visitors, change `defaultPalette`.

### Edit content that appears on the homepage

Remember the [dual-page model](ARCHITECTURE.md#the-dual-page-model): the homepage
is assembled from the standalone pages at runtime. So:

- Editing `about.html` updates **both** `/about` and the About section of `/`.
- A **new** section won't show on the homepage until it's in the `pages` array in
  [aggregate.js](../public/src/js/aggregate.js).
- Content injected into the homepage is added **after** load — any new JS that
  manipulates it must use event delegation or run inside `setupInteractions()`,
  otherwise it won't see the injected markup.

---

## Pre-merge checklist

- [ ] Page works **standalone** (`/about`) **and** on the **homepage** (`/#about`).
- [ ] **Light and dark** mode both look right (toggle the 🌙 button).
- [ ] **Both palettes** look right (click the colour swatch).
- [ ] **Mobile** layout works (narrow the window; check the ☰ menu).
- [ ] No new console errors; the network tab shows each section fetched `200`.
- [ ] New colours use **CSS variables**, not hard-coded hex (so they theme correctly).
- [ ] If you touched a global behaviour, you updated **both** `main.js` and
      `aggregate.js`.
- [ ] New/changed routes added to [render.yml](../render.yml) and, if public, to
      [sitemap.xml](../public/sitemap.xml).
