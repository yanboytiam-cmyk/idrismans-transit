#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LANGS = ['fr', 'en', 'zh', 'es', 'de', 'ar'];
const LOCAL_CSS_ORDER = [
  'variables.css',
  'reset.css',
  'typography.css',
  'buttons.css',
  'navbar.css',
  'hero.css',
  'cards.css',
  'forms.css',
  'footer.css',
  'animations.css',
  'responsive.css',
  'i18n.css'
];
const REQUIRED_JS = ['navbar.js', 'animations.js', 'main.js', 'i18n.js'];

function rel(file) {
  return file.replace(/\\/g, '/');
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function flatten(obj, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, next, out);
    } else {
      out[next] = value;
    }
  }
  return out;
}

function keyExists(obj, key) {
  return key.split('.').reduce((current, part) => {
    if (!current || typeof current !== 'object') return undefined;
    return current[part];
  }, obj) !== undefined;
}

function listHtmlFiles(root) {
  const pagesDir = path.join(root, 'pages');
  const pageFiles = fs.existsSync(pagesDir)
    ? fs.readdirSync(pagesDir).filter((file) => file.endsWith('.html')).sort().map((file) => path.join('pages', file))
    : [];
  return ['index.html', ...pageFiles].filter((file) => fs.existsSync(path.join(root, file)));
}

function extractAttrs(html) {
  const attrs = [];
  const attrRe = /\s(data-i18n(?:-[a-z]+)?)\s*=\s*["']([^"']*)["']/g;
  let match;
  while ((match = attrRe.exec(html)) !== null) {
    attrs.push({ attr: match[1], key: match[2].trim() });
  }
  return attrs;
}

function lineForOffset(text, offset) {
  return text.slice(0, offset).split(/\r?\n/).length;
}

function extractAttrLocations(html) {
  const attrs = [];
  const attrRe = /\s(data-i18n(?:-[a-z]+)?)\s*=\s*["']([^"']*)["']/g;
  let match;
  while ((match = attrRe.exec(html)) !== null) {
    attrs.push({ attr: match[1], key: match[2].trim(), line: lineForOffset(html, match.index) });
  }
  return attrs;
}

function collectLinkHrefs(html) {
  return [...html.matchAll(/<link[^>]+href=["']([^"']+\.css)["']/g)].map((match) => match[1]);
}

function collectScriptSrcs(html) {
  return [...html.matchAll(/<script[^>]+src=["']([^"']+\.js)["']/g)].map((match) => match[1]);
}

function normalizeAssetPath(value) {
  return decodeURIComponent(value).replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\.\.\//, '');
}

function runValidation(options = {}) {
  const root = options.root || process.cwd();
  const strictHtml = Boolean(options.strictHtml);
  const errors = [];
  const warnings = [];

  const translations = {};
  const flatByLang = {};

  for (const lang of LANGS) {
    const file = path.join(root, 'locales', lang, 'common.json');
    if (!fs.existsSync(file)) {
      errors.push(`Missing locale file: locales/${lang}/common.json`);
      continue;
    }
    try {
      translations[lang] = readJson(file);
      flatByLang[lang] = flatten(translations[lang]);
    } catch (error) {
      errors.push(`Invalid JSON in locales/${lang}/common.json: ${error.message}`);
    }
  }

  const allKeys = [...new Set(Object.values(flatByLang).flatMap((map) => Object.keys(map || {})))].sort();
  for (const lang of LANGS) {
    const map = flatByLang[lang] || {};
    const missing = allKeys.filter((key) => !(key in map));
    if (missing.length) {
      errors.push(`locales/${lang}/common.json is missing ${missing.length} keys: ${missing.slice(0, 20).join(', ')}`);
    }
  }

  const i18nFile = path.join(root, 'js', 'i18n.js');
  if (!fs.existsSync(i18nFile)) {
    errors.push('Missing generated bundle: js/i18n.js');
  } else if (Object.keys(translations).length === LANGS.length) {
    const i18nJs = readText(i18nFile);
    const expectedBundle = `var ALL_TRANSLATIONS = ${JSON.stringify(translations, null, 0)};`;
    if (!i18nJs.includes(expectedBundle)) {
      errors.push('js/i18n.js does not match locale JSON. Run: node build_i18n.js');
    }
    if (/\bfetch\s*\(/.test(i18nJs)) {
      errors.push('js/i18n.js contains fetch(); translations must remain embedded for file:// support.');
    }
  }

  const htmlFiles = listHtmlFiles(root);
  for (const htmlRel of htmlFiles) {
    const absolute = path.join(root, htmlRel);
    const html = readText(absolute);
    const isPage = htmlRel.startsWith('pages/');
    const expectedPrefix = isPage ? '../' : '';

    for (const { attr, key, line } of extractAttrLocations(html)) {
      if (!key) {
        errors.push(`${rel(htmlRel)}:${line} has empty ${attr}`);
        continue;
      }
      for (const lang of LANGS) {
        if (translations[lang] && !keyExists(translations[lang], key)) {
          errors.push(`${rel(htmlRel)}:${line} references missing i18n key "${key}" in ${lang}`);
          break;
        }
      }
    }

    const cssHrefs = collectLinkHrefs(html);
    const localCss = cssHrefs
      .filter((href) => normalizeAssetPath(href).startsWith('css/'))
      .map((href) => path.basename(normalizeAssetPath(href)));
    const presentExpected = LOCAL_CSS_ORDER.filter((name) => localCss.includes(name));
    const presentActual = localCss.filter((name) => LOCAL_CSS_ORDER.includes(name));
    if (presentActual.join('|') !== presentExpected.join('|')) {
      errors.push(`${rel(htmlRel)} local CSS links are out of order.`);
    }
    const missingCss = LOCAL_CSS_ORDER.filter((name) => !localCss.includes(name));
    if (missingCss.length) {
      const message = `${rel(htmlRel)} missing local CSS links: ${missingCss.join(', ')}`;
      if (strictHtml) errors.push(message);
      else warnings.push(message);
    }

    const scriptSrcs = collectScriptSrcs(html);
    const localScripts = scriptSrcs
      .filter((src) => normalizeAssetPath(src).startsWith('js/'))
      .map((src) => path.basename(normalizeAssetPath(src)));
    for (const script of REQUIRED_JS) {
      if (!localScripts.includes(script)) {
        errors.push(`${rel(htmlRel)} missing required script: ${expectedPrefix}js/${script}`);
      }
    }

    if (/assets\/(?:css|js)\//.test(html)) {
      errors.push(`${rel(htmlRel)} references stale assets/css or assets/js paths.`);
    }
  }

  const scannedForBrand = [
    'index.html',
    ...htmlFiles.filter((file) => file !== 'index.html'),
    ...['css', 'js'].flatMap((dir) => {
      const absolute = path.join(root, dir);
      if (!fs.existsSync(absolute)) return [];
      return fs.readdirSync(absolute)
        .filter((file) => /\.(css|js)$/.test(file))
        .map((file) => path.join(dir, file));
    })
  ];
  for (const file of scannedForBrand) {
    const absolute = path.join(root, file);
    if (!fs.existsSync(absolute)) continue;
    const text = readText(absolute);
    if (/Willship/i.test(text)) {
      warnings.push(`${rel(file)} contains "Willship"; verify whether this is stale branding or an asset filename.`);
    }
  }

  return { errors, warnings, htmlFiles: htmlFiles.length, localeKeys: allKeys.length };
}

function main() {
  const strictHtml = process.argv.includes('--strict-html');
  const result = runValidation({ strictHtml });

  if (result.errors.length) {
    console.error('IdrisMans static-site validation failed.');
    for (const error of result.errors) console.error(`ERROR: ${error}`);
    for (const warning of result.warnings) console.error(`WARN: ${warning}`);
    process.exit(1);
  }

  console.log(`IdrisMans static-site validation passed. HTML files: ${result.htmlFiles}. Locale keys: ${result.localeKeys}. Warnings: ${result.warnings.length}.`);
  for (const warning of result.warnings) console.log(`WARN: ${warning}`);
}

if (require.main === module) {
  main();
}

module.exports = { runValidation };
