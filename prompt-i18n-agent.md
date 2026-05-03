# 🌍 PROMPT AGENT — INTERNATIONALISATION COMPLÈTE DU SITE (6 LANGUES)

> **OBJECTIF UNIQUE :** Ajouter un système de traduction complet et fonctionnel au site en une seule passe, sans régression, sans erreur, sans intervention manuelle supplémentaire.  
> **LANGUES CIBLES :** Français (fr) · Anglais (en) · Chinois simplifié (zh) · Espagnol (es) · Allemand (de) · Arabe (ar)  
> **RÉSULTAT ATTENDU :** Un site 100% traduit, avec sélecteur de langue visible, détection automatique de la langue du navigateur, support RTL pour l'arabe, et persistance du choix de l'utilisateur.

---

## ⚠️ RÈGLES ABSOLUES AVANT DE COMMENCER

1. **Ne touche à aucun fichier avant d'avoir terminé l'audit complet (Phase 0).**
2. **Ne suppose rien** sur l'emplacement des textes — scan tout.
3. **Ne traduis rien à la main** — génère les fichiers de traduction complets dès le départ.
4. **Ne casse aucune fonctionnalité existante** — chaque modification de texte est isolée dans le système i18n.
5. **Teste chaque langue** après implémentation avant de marquer la tâche comme terminée.
6. **Si tu détectes une ambiguïté** (texte dans une image, texte dans un SVG inline, texte dynamique venant d'une API), signale-le mais continue — ne bloque pas.

---

## PHASE 0 — AUDIT COMPLET DU PROJET

### 0.1 — Identifier la stack exacte

Analyse les fichiers suivants s'ils existent :
- `package.json` → identifier les frameworks (React, Next.js, Vue, etc.) et les dépendances i18n déjà installées
- `index.html` → vérifier si c'est un site statique ou une SPA
- Structure des dossiers → `/src`, `/pages`, `/components`, `/public`, `/assets`

**Décision à prendre ici :**
- Si le projet contient `package.json` avec React/Next.js → utiliser `next-i18next` (Next.js) ou `react-i18next` (React standalone)
- Si le projet est HTML/JS vanilla pur → implémenter un système i18n léger custom en JS pur (pas de librairie externe)
- Si le projet est hybride (HTML + React) → adapter selon la partie dominante, ou implémenter les deux systèmes séparément

### 0.2 — Inventaire exhaustif de tous les textes

Parcours **tous** les fichiers du projet et liste chaque chaîne de texte visible par l'utilisateur :

**Fichiers à scanner :**
- Tous les `.html`
- Tous les `.jsx`, `.tsx`, `.js`, `.ts` (composants, pages)
- Tous les fichiers CSS/SCSS contenant du contenu (`content: "..."`)
- Les fichiers de configuration qui génèrent du texte affiché (ex: menu items, métadonnées SEO, balises `<title>`, `<meta description>`)

**Pour chaque texte trouvé, note :**
- Sa langue actuelle (fr ou en — le site est en mélange des deux)
- Son emplacement exact (fichier + ligne)
- Son contexte (bouton, titre, paragraphe, placeholder, aria-label, alt d'image, etc.)
- Une clé i18n proposée au format `section.element` (ex: `nav.contact`, `hero.title`, `form.placeholder.email`)

### 0.3 — Synthèse de l'audit

Avant de passer à la Phase 1, produis un résumé :
```
AUDIT TERMINÉ :
- Stack détectée : [...]
- Approche i18n choisie : [...]
- Nombre de textes à traduire : [N]
- Fichiers modifiés : [liste]
- Cas particuliers détectés : [SVG, images avec texte, texte dynamique API, etc.]
```

---

## PHASE 1 — MISE EN PLACE DE L'ARCHITECTURE I18N

### Cas A — Projet Next.js

```bash
npm install next-i18next react-i18next i18next
```

Crée `next-i18next.config.js` à la racine :
```js
module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'zh', 'es', 'de', 'ar'],
    localeDetection: true,
  },
  fallbackLng: 'fr',
};
```

Crée la structure de dossiers :
```
/public/locales/
  /fr/common.json
  /en/common.json
  /zh/common.json
  /es/common.json
  /de/common.json
  /ar/common.json
```

### Cas B — Projet React (sans Next.js)

```bash
npm install react-i18next i18next i18next-browser-languagedetector i18next-http-backend
```

Crée `src/i18n/index.js` :
```js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['fr', 'en', 'zh', 'es', 'de', 'ar'],
    fallbackLng: 'fr',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    backend: { loadPath: '/locales/{{lng}}/common.json' },
    interpolation: { escapeValue: false },
  });

export default i18n;
```

### Cas C — HTML/JS Vanilla pur

Crée `js/i18n.js` :
```js
const SUPPORTED_LANGS = ['fr', 'en', 'zh', 'es', 'de', 'ar'];
const DEFAULT_LANG = 'fr';
let translations = {};

async function loadTranslations(lang) {
  const res = await fetch(`/locales/${lang}/common.json`);
  translations = await res.json();
}

function t(key) {
  return key.split('.').reduce((obj, k) => obj?.[k], translations) || key;
}

function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  const browser = navigator.language.slice(0, 2);
  return SUPPORTED_LANGS.includes(browser) ? browser : DEFAULT_LANG;
}

async function setLang(lang) {
  localStorage.setItem('lang', lang);
  await loadTranslations(lang);
  applyTranslations();
  setRTL(lang);
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
  });
  document.title = t('meta.title');
}

function setRTL(lang) {
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
}

window.i18n = { setLang, t, detectLang };

(async () => {
  const lang = detectLang();
  await setLang(lang);
})();
```

---

## PHASE 2 — GÉNÉRATION DES FICHIERS DE TRADUCTION

À partir de l'inventaire de la Phase 0, génère les 6 fichiers JSON complets.

### Structure attendue de `common.json` (exemple) :

```json
{
  "meta": {
    "title": "...",
    "description": "..."
  },
  "nav": {
    "home": "...",
    "services": "...",
    "about": "...",
    "contact": "..."
  },
  "hero": {
    "title": "...",
    "subtitle": "...",
    "cta": "..."
  },
  "footer": {
    "rights": "...",
    "contact": "..."
  }
}
```

### Règles de traduction :

- **Français (fr)** → langue de référence, texte source de base
- **Anglais (en)** → traduction professionnelle, pas de franglais
- **Chinois simplifié (zh)** → traduction naturelle, pas de traduction littérale
- **Espagnol (es)** → espagnol neutre (pas régional), compréhensible en Amérique Latine et Espagne
- **Allemand (de)** → allemand standard (Hochdeutsch)
- **Arabe (ar)** → arabe standard moderne (MSA), sens de lecture droite → gauche géré côté CSS

**IMPORTANT :** Génère les 6 fichiers en une seule fois. Ne génère pas juste le français et l'anglais en laissant les autres vides.

---

## PHASE 3 — MODIFICATION DES FICHIERS SOURCE

### Pour HTML/JS Vanilla :

Remplace chaque texte hardcodé par un attribut `data-i18n` :

```html
<!-- AVANT -->
<h1>Bienvenue sur notre site</h1>
<button>Contactez-nous</button>
<input placeholder="Votre email">

<!-- APRÈS -->
<h1 data-i18n="hero.title"></h1>
<button data-i18n="nav.contact"></button>
<input data-i18n-placeholder="form.email">
```

### Pour React/Next.js :

```jsx
// AVANT
<h1>Bienvenue sur notre site</h1>

// APRÈS
import { useTranslation } from 'react-i18next'; // ou next-i18next
const { t } = useTranslation();
<h1>{t('hero.title')}</h1>
```

### Règle spéciale — Balises `<title>` et `<meta>` :

Pour HTML vanilla : mets à jour via JS dans `applyTranslations()`.  
Pour Next.js : utilise le composant `<Head>` avec `t('meta.title')`.

---

## PHASE 4 — SÉLECTEUR DE LANGUE (UI)

### Design du bouton :

Crée un composant/élément de sélection de langue avec ces contraintes :
- **Position :** coin supérieur droit du header (ou dans la navbar existante si elle existe)
- **Format :** un bouton principal affichant le drapeau + code langue (ex: 🇫🇷 FR), avec un dropdown au clic affichant les 6 options
- **Langues affichées dans le dropdown :**

| Code | Drapeau | Nom natif |
|------|---------|-----------|
| fr | 🇫🇷 | Français |
| en | 🇬🇧 | English |
| zh | 🇨🇳 | 中文 |
| es | 🇪🇸 | Español |
| de | 🇩🇪 | Deutsch |
| ar | 🇸🇦 | العربية |

- **Comportement :**
  - Au clic sur une langue → change immédiatement la langue de toute la page
  - La langue sélectionnée est mise en évidence (bold ou fond coloré)
  - Le choix est persisté dans `localStorage` sous la clé `"lang"`
  - Le dropdown se ferme au clic en dehors

### Code HTML du sélecteur (Vanilla) :

```html
<div class="lang-switcher" id="langSwitcher">
  <button class="lang-current" onclick="toggleLangDropdown()">
    <span id="currentFlag">🇫🇷</span>
    <span id="currentCode">FR</span>
    <span class="lang-arrow">▼</span>
  </button>
  <ul class="lang-dropdown" id="langDropdown">
    <li onclick="selectLang('fr')">🇫🇷 Français</li>
    <li onclick="selectLang('en')">🇬🇧 English</li>
    <li onclick="selectLang('zh')">🇨🇳 中文</li>
    <li onclick="selectLang('es')">🇪🇸 Español</li>
    <li onclick="selectLang('de')">🇩🇪 Deutsch</li>
    <li onclick="selectLang('ar')">🇸🇦 العربية</li>
  </ul>
</div>
```

### CSS du sélecteur :

```css
.lang-switcher {
  position: relative;
  display: inline-block;
}

.lang-current {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
}

.lang-current:hover {
  background: rgba(255,255,255,0.1);
}

.lang-dropdown {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  list-style: none;
  padding: 6px;
  min-width: 150px;
  z-index: 9999;
}

.lang-dropdown.open {
  display: block;
}

.lang-dropdown li {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #1f2937;
  transition: background 0.15s;
}

.lang-dropdown li:hover {
  background: #f3f4f6;
}

.lang-dropdown li.active {
  background: #eff6ff;
  font-weight: 700;
  color: #2563eb;
}
```

```js
const langMeta = {
  fr: { flag: '🇫🇷', code: 'FR' },
  en: { flag: '🇬🇧', code: 'EN' },
  zh: { flag: '🇨🇳', code: 'ZH' },
  es: { flag: '🇪🇸', code: 'ES' },
  de: { flag: '🇩🇪', code: 'DE' },
  ar: { flag: '🇸🇦', code: 'AR' },
};

function toggleLangDropdown() {
  document.getElementById('langDropdown').classList.toggle('open');
}

function selectLang(lang) {
  window.i18n.setLang(lang);
  document.getElementById('currentFlag').textContent = langMeta[lang].flag;
  document.getElementById('currentCode').textContent = langMeta[lang].code;
  document.querySelectorAll('.lang-dropdown li').forEach(li => li.classList.remove('active'));
  document.querySelector(`.lang-dropdown li[onclick="selectLang('${lang}')"]`).classList.add('active');
  document.getElementById('langDropdown').classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('#langSwitcher')) {
    document.getElementById('langDropdown').classList.remove('open');
  }
});
```

---

## PHASE 5 — SUPPORT RTL POUR L'ARABE

Ajoute dans le CSS global :

```css
/* Direction RTL pour l'arabe */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .nav,
[dir="rtl"] .header,
[dir="rtl"] .footer {
  flex-direction: row-reverse;
}

[dir="rtl"] .lang-switcher {
  right: auto;
  left: 0;
}

[dir="rtl"] .lang-dropdown {
  right: auto;
  left: 0;
}

/* Marges et paddings inversés en RTL */
[dir="rtl"] .ml-auto { margin-left: unset; margin-right: auto; }
[dir="rtl"] .mr-auto { margin-right: unset; margin-left: auto; }
[dir="rtl"] .pl-4 { padding-left: unset; padding-right: 1rem; }
[dir="rtl"] .pr-4 { padding-right: unset; padding-left: 1rem; }
```

La fonction `setRTL(lang)` dans `i18n.js` gère automatiquement l'attribut `dir` sur `<html>`.

---

## PHASE 6 — DÉTECTION AUTOMATIQUE DE LA LANGUE

### Logique de détection (priorité décroissante) :

1. `localStorage.getItem('lang')` → choix précédent de l'utilisateur
2. `navigator.language` ou `navigator.languages[0]` → langue du navigateur
3. Fallback → `'fr'` (français par défaut)

Cette logique est déjà intégrée dans les configurations des Phases 1A, 1B, 1C.

**Note :** Pour Next.js, la détection automatique est gérée nativement par le framework via `localeDetection: true` dans la config.

---

## PHASE 7 — VALIDATION FINALE

Avant de clore la tâche, effectue les vérifications suivantes :

### ✅ Checklist de validation :

- [ ] Chaque texte visible sur le site a une clé i18n (aucun texte hardcodé restant)
- [ ] Les 6 fichiers `common.json` existent et sont complets (aucune clé manquante)
- [ ] Changer de langue depuis le sélecteur met à jour **l'intégralité** de la page sans rechargement
- [ ] La langue est correctement persistée après rechargement de la page (tester F5)
- [ ] La langue du navigateur est bien détectée à la première visite (aucune langue en localStorage)
- [ ] L'arabe affiche le contenu de droite à gauche (dir="rtl" sur `<html>`)
- [ ] Le sélecteur de langue est visible et accessible sur mobile (taille minimale 44x44px)
- [ ] Les balises `<title>` et `<meta name="description">` changent aussi selon la langue
- [ ] Aucune erreur dans la console JavaScript
- [ ] Le site fonctionne toujours normalement en français (langue par défaut)

### 🧪 Procédure de test :

1. Ouvre le site → note la langue détectée automatiquement
2. Clique sur le sélecteur → sélectionne **Chinois** → vérifie que tout le texte change
3. Recharge la page → vérifie que le Chinois est toujours sélectionné
4. Sélectionne **Arabe** → vérifie le sens RTL du layout
5. Sélectionne **Allemand** → vérifie les traductions
6. Ouvre DevTools → onglet Console → vérifie zéro erreur

---

## LIVRABLES ATTENDUS À LA FIN

| Fichier / Action | Statut attendu |
|---|---|
| `/public/locales/fr/common.json` | ✅ Complet |
| `/public/locales/en/common.json` | ✅ Complet |
| `/public/locales/zh/common.json` | ✅ Complet |
| `/public/locales/es/common.json` | ✅ Complet |
| `/public/locales/de/common.json` | ✅ Complet |
| `/public/locales/ar/common.json` | ✅ Complet |
| Système i18n configuré | ✅ Fonctionnel |
| Sélecteur de langue intégré dans le header | ✅ Visible |
| Détection auto de la langue navigateur | ✅ Active |
| Support RTL arabe | ✅ Actif |
| Aucune régression fonctionnelle | ✅ Vérifié |

---

*Prompt conçu pour une exécution en une seule passe — aucune étape manuelle requise après exécution.*
