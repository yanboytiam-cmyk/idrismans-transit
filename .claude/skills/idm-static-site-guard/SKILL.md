---
name: idm-static-site-guard
description: This skill should be used when working on IdrisMans Transit static site files, editing HTML/CSS/JS, translations, navbar/footer, media paths, or any i18n-related content in this repository.
version: 0.1.0
---

# IdrisMans Static Site Guard

## Purpose

Preserve the invariants of the IdrisMans Transit static site. Treat the project as plain HTML/CSS/JS with no package manager, no build step, and no runtime fetch requirement.

## Core Rules

- Read `AGENTS.md` or `CLAUDE.md` before changing project files.
- Keep `README.md` and `prompt-i18n-agent.md` as historical/stale references unless the user explicitly asks to update docs.
- Treat `index.html` plus every `pages/*.html` file as the live site. The current repository has 30 secondary pages.
- Keep `components/navbar.html` and `components/footer.html` as reference snippets only. Do not introduce runtime component fetching.
- Preserve `file://` compatibility. Do not add runtime `fetch()` for translations, navigation, footer, or content fragments.
- Use root-relative asset paths from `index.html` and `../` paths from `pages/*.html`.

## Internationalization Workflow

1. Edit translation source files in `locales/{fr,en,zh,es,de,ar}/common.json`.
2. Keep every translation key present in all six languages.
3. Add `data-i18n`, `data-i18n-html`, `data-i18n-placeholder`, or `data-i18n-aria` for new user-visible HTML text.
4. Run `node build_i18n.js` after changing locales.
5. Do not edit `js/i18n.js` by hand. It is generated and direct edits will be overwritten.
6. Run `node .claude/scripts/validate-idm-static-site.js` before finishing i18n or HTML work.

## HTML/CSS/JS Rules

- Keep CSS links in the established local order: `variables.css`, `reset.css`, `typography.css`, `buttons.css`, `navbar.css`, `hero.css`, `cards.css`, `forms.css`, `footer.css`, `animations.css`, `responsive.css`, `i18n.css`.
- Keep `variables.css` before all other local CSS files.
- Keep common scripts available on every HTML page: `navbar.js`, `animations.js`, `main.js`, and `i18n.js`.
- Add `forms.js` only on pages with forms or form validation behavior.
- Keep comments consistent with the edited file language and style.
- Avoid introducing dependencies, bundlers, frameworks, or package metadata unless the user explicitly asks for a larger migration.

## Navbar And Footer Updates

When changing navbar or footer content:

1. Update the reference snippet in `components/`.
2. Apply the same inline HTML change to `index.html` and all relevant `pages/*.html`.
3. Add or update every translation key in all six locale files.
4. Rebuild `js/i18n.js`.
5. Run the validator.

## Media And Branding Checks

- Prefer current IdrisMans Transit branding.
- Treat remaining `Willship` references as suspect unless they are unavoidable source asset filenames.
- Keep folders with spaces referenced exactly as existing HTML expects.
- Check image and video paths mechanically after moving or renaming media.

## Validation

Run:

```bash
node .claude/scripts/validate-idm-static-site.js
```

Use strict HTML checks when intentionally auditing the full page template:

```bash
node .claude/scripts/validate-idm-static-site.js --strict-html
```

Fix all errors before claiming completion. Review warnings and mention unresolved ones when they are outside the requested scope.
