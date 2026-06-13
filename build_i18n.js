const fs = require('fs');
const path = require('path');

const langs = ['fr', 'en', 'zh', 'es', 'de', 'ar'];
const allData = {};
langs.forEach(lang => {
  const p = path.join('locales', lang, 'common.json');
  allData[lang] = JSON.parse(fs.readFileSync(p, 'utf8'));
});

const bundle = JSON.stringify(allData, null, 0);

const i18nJs = `/**
 * i18n.js — IdrisMans Transit
 * ALL translations embedded inline — works with file:// protocol (no fetch needed)
 * 6 languages: fr, en, zh, es, de, ar
 */
(function () {
  'use strict';

  var SUPPORTED_LANGS = ['fr', 'en', 'zh', 'es', 'de', 'ar'];
  var DEFAULT_LANG = 'fr';
  var currentLang = DEFAULT_LANG;

  // ── ALL TRANSLATIONS EMBEDDED ──────────────────────────────────────────
  var ALL_TRANSLATIONS = ${bundle};
  // ───────────────────────────────────────────────────────────────────────

  var translations = ALL_TRANSLATIONS[DEFAULT_LANG] || {};

  /* Résolution d'une clé i18n (ex: "nav.home") */
  function t(key) {
    if (!key) return '';
    var val = key.split('.').reduce(function (obj, k) {
      return (obj && obj[k] !== undefined) ? obj[k] : undefined;
    }, translations);
    return (val !== undefined && val !== '') ? val : key;
  }

  /* Application des traductions au DOM */
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      if (val && val !== key) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var val = t(key);
      if (val && val !== key) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = t(key);
      if (val && val !== key) el.placeholder = val;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      var val = t(key);
      if (val && val !== key) el.setAttribute('aria-label', val);
    });
  }

  /* RTL */
  function setRTL(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  /* Détection automatique */
  function detectLang() {
    var saved = localStorage.getItem('idm_lang');
    if (saved && SUPPORTED_LANGS.indexOf(saved) !== -1) return saved;
    var browserLangs = navigator.languages || [navigator.language || 'fr'];
    for (var i = 0; i < browserLangs.length; i++) {
      var code = (browserLangs[i] || '').slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGS.indexOf(code) !== -1) return code;
    }
    return DEFAULT_LANG;
  }

  /* Changement de langue */
  function setLang(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;
    currentLang = lang;
    localStorage.setItem('idm_lang', lang);
    translations = ALL_TRANSLATIONS[lang] || {};
    applyTranslations();
    setRTL(lang);
    updateSwitcherUI(lang);
  }

  /* UI du sélecteur */
  var langMeta = {
    fr: { flag: '🇫🇷', code: 'FR' },
    en: { flag: '🇬🇧', code: 'EN' },
    zh: { flag: '🇨🇳', code: 'ZH' },
    es: { flag: '🇪🇸', code: 'ES' },
    de: { flag: '🇩🇪', code: 'DE' },
    ar: { flag: '🇸🇦', code: 'AR' }
  };

  function updateSwitcherUI(lang) {
    var flagEl = document.getElementById('i18nCurrentFlag');
    var codeEl = document.getElementById('i18nCurrentCode');
    if (flagEl) flagEl.textContent = langMeta[lang].flag;
    if (codeEl) codeEl.textContent = langMeta[lang].code;
    document.querySelectorAll('.i18n-dropdown__item').forEach(function (li) {
      li.classList.toggle('active', li.getAttribute('data-lang') === lang);
    });
  }

  function injectSwitcher() {
    if (document.getElementById('i18nSwitcher')) return;
    var switcher = document.createElement('div');
    switcher.className = 'i18n-switcher';
    switcher.id = 'i18nSwitcher';
    switcher.innerHTML = [
      '<button class="i18n-current" id="i18nToggleBtn" aria-label="Changer de langue" aria-expanded="false">',
      '  <span id="i18nCurrentFlag">🇫🇷</span>',
      '  <span id="i18nCurrentCode">FR</span>',
      '  <span class="i18n-arrow" aria-hidden="true">▼</span>',
      '</button>',
      '<ul class="i18n-dropdown" id="i18nDropdown" role="listbox">',
      '  <li class="i18n-dropdown__item" data-lang="fr" role="option" tabindex="0">🇫🇷 Français</li>',
      '  <li class="i18n-dropdown__item" data-lang="en" role="option" tabindex="0">🇬🇧 English</li>',
      '  <li class="i18n-dropdown__item" data-lang="zh" role="option" tabindex="0">🇨🇳 中文</li>',
      '  <li class="i18n-dropdown__item" data-lang="es" role="option" tabindex="0">🇪🇸 Español</li>',
      '  <li class="i18n-dropdown__item" data-lang="de" role="option" tabindex="0">🇩🇪 Deutsch</li>',
      '  <li class="i18n-dropdown__item" data-lang="ar" role="option" tabindex="0">🇸🇦 العربية</li>',
      '</ul>'
    ].join('');

    switcher.querySelector('#i18nToggleBtn').addEventListener('click', function (e) {
      e.stopPropagation();
      var d = document.getElementById('i18nDropdown');
      if (d) d.classList.toggle('open');
    });
    switcher.querySelectorAll('.i18n-dropdown__item').forEach(function (item) {
      item.addEventListener('click', function () {
        setLang(this.getAttribute('data-lang'));
        var d = document.getElementById('i18nDropdown');
        if (d) d.classList.remove('open');
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setLang(this.getAttribute('data-lang'));
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('#i18nSwitcher')) {
        var d = document.getElementById('i18nDropdown');
        if (d) d.classList.remove('open');
      }
    });

    var navCta = document.querySelector('.navbar__cta');
    var burger  = document.querySelector('.navbar__burger');
    if (navCta) {
      navCta.insertBefore(switcher, navCta.firstChild);
    } else if (burger) {
      burger.parentNode.insertBefore(switcher, burger);
    } else {
      var inner = document.querySelector('.navbar__inner');
      if (inner) inner.appendChild(switcher);
    }
  }

  /* Initialisation */
  function init() {
    injectSwitcher();
    var lang = detectLang();
    setLang(lang);
  }

  window.IdrisMansI18n = {
    setLang: setLang,
    t: t,
    getCurrentLang: function () { return currentLang; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;

fs.writeFileSync(path.join('js', 'i18n.js'), i18nJs);
const size = (Buffer.byteLength(i18nJs) / 1024).toFixed(1);
console.log('i18n.js rebuilt with embedded translations. Size: ' + size + ' KB');
