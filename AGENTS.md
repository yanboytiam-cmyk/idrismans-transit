# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What this is

**IdrisMans Transit** — a static marketing/site for an international freight & vehicle-shipping company. Pure vanilla HTML/CSS/JS, **no build system, no package.json, no framework, no dependencies**. It is served as plain files and is designed to also work over the `file://` protocol (no fetch at runtime — see i18n below).

It originated as a pixel clone of willship.com.au, so some content, the `README.md`, and parts of `prompt-i18n-agent.md` still use the old "Willship" name and French descriptions. **`README.md` is stale**: it documents an `assets/css` / `assets/js` layout that does not exist — the real directories are `css/` and `js/` at the repo root.

## Running locally

No build step. Serve the repo root with any static server, or open `index.html` directly:
```bash
python -m http.server 8000   # then http://localhost:8000
# or: npx serve .
# or: VS Code "Live Server" on index.html
```

## Structure

- `index.html` — homepage, at repo root. Links CSS/JS with **root-relative paths** (`css/…`, `js/…`).
- `pages/*.html` — all 21 secondary pages. These use **`../` relative paths** (`../css/…`, `../js/…`) because they live one level down. Match the existing page when adding a new one.
- `css/` — stylesheets split by concern (`variables.css`, `reset.css`, `typography.css`, `buttons.css`, `navbar.css`, `hero.css`, `cards.css`, `forms.css`, `footer.css`, `animations.css`, `responsive.css`, `i18n.css`). They are `<link>`ed in that **fixed order** in every HTML file; `variables.css` (CSS custom properties `--color-*`, `--font-*`) must load first. Change global colors/fonts there.
- `js/` — `navbar.js` (sticky/burger/dropdowns), `animations.js` (scroll reveal, accordions), `forms.js` (frontend validation only, no backend), `main.js` (global init), and `i18n.js` (**generated — see below, do not edit by hand**).
- `components/navbar.html`, `components/footer.html` — **reference snippets only**. They are NOT fetched at runtime; the navbar and footer are copy-pasted/inlined into each page's HTML. When changing nav links or footer, you must edit every page (or update them all consistently).
- `locales/{fr,en,zh,es,de,ar}/common.json` — translation source of truth (6 languages).
- Image/video assets live in named folders at root (`automotive/`, `gallery page/`, `crates page/`, `commercial freignt page/`, `home page image/`, `generated/`, `placeholder/`). Folder names with spaces are referenced as-is in HTML.

## Internationalization (important)

The site supports 6 languages (`fr` default, `en`, `zh`, `es`, `de`, `ar`) with automatic browser-language detection, a language switcher injected into the navbar, RTL support for Arabic, and persistence in `localStorage` under the key **`idm_lang`**.

`js/i18n.js` is **generated** by `build_i18n.js`. It embeds all translations inline (so it works without `fetch`, i.e. over `file://`). The workflow:

1. Edit the relevant `locales/<lang>/common.json` (keep all 6 in sync — every key should exist in every language).
2. Regenerate the bundle:
   ```bash
   node build_i18n.js
   ```
   This reads all 6 `common.json` files, inlines them into the `ALL_TRANSLATIONS` object, and overwrites `js/i18n.js`. **Never edit `js/i18n.js` directly — your changes will be lost on the next build.**

In HTML, translatable content is marked with attributes the runtime resolves against dot-keys (e.g. `nav.home`): `data-i18n` (textContent), `data-i18n-html` (innerHTML), `data-i18n-placeholder`, `data-i18n-aria`. When adding user-visible text, add a `data-i18n*` attribute plus the key in all 6 locale files rather than hardcoding a string.

`prompt-i18n-agent.md` is the original spec/prompt for the i18n system. Note its example code paths (`/public/locales/…`, async `fetch`) describe the generic plan, NOT this repo's final implementation (root `locales/`, inlined/generated bundle).

## Conventions

- Forms are validation-only; there is no backend. Wiring real submission (Formspree/Netlify Forms/etc.) goes in `js/forms.js`.
- Comments and some content are in French; keep code comments consistent with the file you are editing.
