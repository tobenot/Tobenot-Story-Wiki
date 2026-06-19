# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tobenot-Story-Wiki is a Vue 3 + TypeScript + Vite single-page app that serves as a story/worldbuilding wiki. Content is authored as Markdown files with YAML frontmatter under `src/content/`, loaded at build/runtime by `contentService.js`, and rendered through Vue views. Search is powered by a Lunr index (with Chinese tokenization) generated at build time.

## Common Commands

```bash
npm run dev        # Build the search index, then start the Vite dev server
npm run build      # Build search index, type-check (vue-tsc), then vite build
npm run preview    # Preview the production build
npm run deploy     # Build, then force-push dist/ to gh-pages branch on GitHub
npm run build:index # Only (re)generate public/search-index.json + search-map.json
```

- There is no test runner or linter configured. Type errors surface via `vue-tsc -b` in `npm run build`.
- `commit-and-deploy.bat` (Windows) is a one-shot: prompts for a commit message, commits, pushes, then runs `npm run deploy`. Production site: https://wiki.tobenot.top/
- `postinstall` runs `patch-package`, which applies `patches/lunr-languages+1.14.0.patch` — needed for Chinese search support. Never delete the patch.

## Architecture

### Content pipeline (the core mental model)

Content lives as Markdown in `src/content/` and is consumed two ways:

1. **Runtime (in-browser):** `src/services/contentService.js` uses Vite's `import.meta.glob('/src/content/**/*.md', { as: 'raw' })` to pull every `.md` file as raw text, parses frontmatter with `front-matter`, and renders bodies with `marked`. It builds a single in-memory index on first access (`buildContentIndex()`, cached in `contentIndexCache`) with these maps:
   - `canonicalIndex`: `canonicalId` → canonical global entry (the dedup/identity key, e.g. `character.robert`)
   - `typeIndex`: `type` → `Map<key, aggregated entry>`; dedups across scopes, preferring the global canonical, and tracks `appearances` (which works/parts reference it)
   - `workIndex` / `partIndex`: work & part metadata + their entry listings
   - `themes`: theme config + body
2. **Build time (search):** `scripts/build-search-index.js` walks `src/content/`, strips Markdown via `remark`/`strip-markdown`, and emits `public/search-index.json` (Lunr) + `public/search-map.json` (id→metadata). The search index must be regenerated whenever content changes — `npm run dev` and `npm run build` both do this automatically via the `build:index` prerequisite.

`contentService.js` recognizes three content layouts through `parsePathForEntry()`:
- **Legacy:** `src/content/<type>/<slug>.md` (still supported, migrate away)
- **Global canonical:** `src/content/globals/<type>/<slug>.md`
- **Work/part entry:** `src/content/works/<workId>/parts/<partId>/<type>/<slug>.md`
- Plus non-entry index files: `works/<workId>/index.md`, `works/<workId>/parts/<partId>/index.md`, and `themes/<themeId>.md`

When adding new content layout conventions, update path parsing in **both** `contentService.js` (`parsePathForEntry`) and `scripts/build-search-index.js` (`deriveTypeAndFullId`) — they must agree on how a path maps to `{type, id/routeId}`.

### Rendering & dedup rule

Global (`globals/*`) and part (`works/<workId>/parts/<partId>/<type>/*`) entries are **two independent pages on two independent routes** — `loadContentEntry()` loads the single physical file matching the route id and renders its body verbatim; there is **no overlay** of one onto the other. The intended split of content:

- **Global page** = the cross-part setting truth source: identity, appearance, personality, ability mechanics, the stable relationship net, and an "appeared in" list. Low spoiler density. Write what does *not* change between parts.
- **Part page** = what the entity *did in that part*: a full, self-contained experience page with `role` / `firstSeenAt` / `chapters` in frontmatter and the part's events (mostly inside `:::spoiler` blocks). Write the part-specific plot and any reveals about this entity uncovered in that part.

`getEntryVariants()` gathers every place a canonical entity appears (global + each part) and surfaces them as cross-links ("全局权威" / "作品·篇章" tabs), so the two pages point at each other. Note: the `localNotes` frontmatter field is **not currently read** by `EntryPage.vue` (no overlay is implemented) — do not put content you need rendered into `localNotes` alone; write it in the part page body. If you ever implement overlay, the place to wire it is `EntryPage.vue` + `loadContentEntry`.

### Routing

`src/router/index.ts` uses **hash history** (`createWebHashHistory`) — important for the static GitHub Pages deploy. Routes:
- `/` Home · `/category/:type` type aggregation
- `/entry/:type/:id(.*)` — `id` is a catch-all supporting `globals/<slug>` or `works/<workId>/parts/<partId>/<slug>`
- `/works`, `/works/:workId`, `/works/:workId/parts/:partId`
- `/themes`, `/theme/:themeId`

### Frontend layout

- `src/views/` — page components (Home, Category, Entry, Works*, Themes*)
- `src/components/` — `layout/` (Header, Footer, Sidebar), `ui/` (Button, Card, Tag, SpoilerBlock, MarkdownImage, ImageLoader), plus `GlobalSearch`, `TableOfContents`, `ThemeSwitcher`
- `src/composables/useSearch.js` — Lunr client-side search against `search-index.json`
- Styling: TailwindCSS (`tailwind.config.js`, `postcss.config.js`) with `@tailwindcss/typography`. Path alias `@` → `./src`.

### Content authoring conventions (see README.md for full spec)

- `canonicalId` is dot-form: `character.robert`, `location.silver-temple`
- `workId`/`partId`/`slug` are kebab-case
- Reused entities should have a `globals/*` canonical entry (the setting truth source: identity/ability mechanics/stable relationships, low spoilers); part entries reference it via `canonicalId` and are **full, self-contained pages** covering what the entity did in that part (the part page body is rendered verbatim — `localNotes` is not overlaid)
- Themes use `strategy: by-tags | manual` (see `themes/<themeId>.md` frontmatter)

### Known gotcha (documented in README)

The Lunr Chinese tokenizer expects `nodejieba`; the `@node-rs/jieba` import in `node_modules/lunr-languages/lunr.zh.js` may need swapping to `require('nodejieba')` if indexing breaks. The `patch-package` step is the supported fix path — patch `lunr-languages` there rather than editing `node_modules` directly.

## Notes

- The repo deploys `dist/` as a separate git repo to `gh-pages` (see the `deploy` script). Do not commit `dist/` to `main` (it is gitignored).
- Content is primarily in Chinese; commits and README are bilingual.
