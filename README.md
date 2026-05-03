# Willship International — Clone Local

Clone pixel-perfect du site [willship.com.au](https://willship.com.au) — livrable en production locale, HTML/CSS/JS pur, aucune dépendance de build.

---

## 🗺️ Pages clonées

| Page | Fichier | Statut |
|------|---------|--------|
| Accueil | `index.html` | ✅ |
| About Us | `pages/about.html` | ✅ |
| What We Ship | `pages/what-we-ship.html` | ✅ |
| RoRo Shipping Schedule | `pages/roro-schedule.html` | ✅ |
| Gallery (60 images) | `pages/gallery.html` | ✅ |
| Contact Us | `pages/contact.html` | ✅ |
| Freight Forwarder | `pages/freight-forwarder.html` | ✅ |
| Services | `pages/services.html` | ✅ |
| Import Vehicle | `pages/import-vehicle.html` | ✅ |
| Import Car | `pages/import-car.html` | ✅ |
| Import Boat | `pages/import-boat.html` | ✅ |
| Import Motorcycle | `pages/import-motorcycle.html` | ✅ |
| Import Caravan | `pages/import-caravan.html` | ✅ |
| Import Motorhome | `pages/import-motorhome.html` | ✅ |
| Import Machinery | `pages/import-machinery.html` | ✅ |
| Importing Into Australia | `pages/importing.html` | ✅ |
| Exporting From Australia | `pages/exporting.html` | ✅ |
| China To Australia | `pages/china-to-australia.html` | ✅ |
| Custom Services & Clearances | `pages/customs.html` | ✅ |
| Warehousing & Transport | `pages/warehousing.html` | ✅ |
| Project Logistics & Management | `pages/project-logistics.html` | ✅ |
| FAQ | `pages/faq.html` | ✅ |
| Privacy Policy | `pages/privacy.html` | ✅ |
| Terms & Conditions | `pages/terms.html` | ✅ |

---

## 🎨 Palette de couleurs

| Variable CSS | HEX | Usage |
|---|---|---|
| `--color-primary` | `#1a5f9e` | Boutons CTA, liens actifs, accents ⚠️ |
| `--color-primary-dark` | `#134a7c` | Hover boutons |
| `--color-primary-light` | `#2a7abf` | Accents secondaires |
| `--color-secondary` | `#e8702a` | Orange highlight ⚠️ |
| `--color-bg` | `#ffffff` | Fond principal |
| `--color-bg-alt` | `#f5f7fa` | Fond sections alternées |
| `--color-bg-dark` | `#1a2b3c` | Footer, sections sombres ⚠️ |
| `--color-bg-hero` | `#0d1f31` | Fond hero |
| `--color-text` | `#2c3e50` | Texte principal |
| `--color-text-muted` | `#6c7a89` | Texte secondaire |
| `--color-heading` | `#1a2b3c` | Titres |
| `--color-border` | `#e0e4ea` | Bordures |

> ⚠️ **Couleurs estimées** — le WebFetch ne livrant pas les CSS bruts, les codes HEX exacts doivent être vérifiés avec les DevTools du navigateur sur le site original.

---

## 🔤 Typographies

| Usage | Famille | Poids | Taille approx. |
|---|---|---|---|
| Titres H1 | Montserrat | 700–800 | 48px / 3rem |
| Titres H2 | Montserrat | 700 | 36px / 2.25rem |
| Titres H3 | Montserrat | 700 | 30px / 1.875rem |
| Corps | Open Sans | 400 | 16px / 1rem |
| Labels boutons | Montserrat | 700 | 13px / 0.8rem |
| Navigation | Montserrat | 600 | 14px / 0.875rem |

> ⚠️ Familles **estimées** — vérifier sur le site original via DevTools (onglet Computed → font-family).

---

## 📁 Structure du projet

```
willship-clone/
│
├── index.html                    ← Page d'accueil
│
├── pages/                        ← Toutes les pages secondaires
│   ├── about.html
│   ├── services.html
│   ├── contact.html
│   ├── gallery.html
│   ├── roro-schedule.html
│   ├── faq.html
│   ├── privacy.html
│   ├── terms.html
│   ├── freight-forwarder.html
│   ├── import-vehicle.html
│   ├── import-car.html
│   ├── import-boat.html
│   ├── import-motorcycle.html
│   ├── import-caravan.html
│   ├── import-motorhome.html
│   ├── import-machinery.html
│   ├── what-we-ship.html
│   ├── importing.html
│   ├── exporting.html
│   ├── china-to-australia.html
│   ├── customs.html
│   ├── warehousing.html
│   └── project-logistics.html
│
├── assets/
│   ├── css/
│   │   ├── variables.css         ← Variables CSS globales
│   │   ├── reset.css             ← Reset + utilitaires
│   │   ├── typography.css        ← Styles texte globaux
│   │   ├── buttons.css           ← Tous les boutons
│   │   ├── navbar.css            ← Navigation
│   │   ├── hero.css              ← Sections hero
│   │   ├── cards.css             ← Cards, grilles
│   │   ├── forms.css             ← Formulaires
│   │   ├── footer.css            ← Footer
│   │   ├── animations.css        ← Animations scroll
│   │   └── responsive.css        ← Media queries
│   │
│   ├── js/
│   │   ├── navbar.js             ← Sticky, burger, dropdowns
│   │   ├── animations.js         ← Scroll animations, accordéons
│   │   ├── forms.js              ← Validation formulaires
│   │   └── main.js               ← Initialisation globale
│   │
│   └── images/
│       ├── logo.svg              ← Logo SVG (approximé ⚠️)
│       └── placeholders/         ← Dossier pour images réelles
│
└── components/
    ├── navbar.html               ← Snippet navbar réutilisable
    └── footer.html               ← Snippet footer réutilisable
```

---

## 🚀 Lancer en local

### Option 1 — VS Code Live Server (recommandé)
1. Ouvrir le dossier `willship-clone/` dans VS Code
2. Installer l'extension **Live Server**
3. Clic droit sur `index.html` → **Open with Live Server**
4. Ouvrir `http://localhost:5500` dans le navigateur

### Option 2 — Python
```bash
cd willship-clone
python -m http.server 8000
# Ouvrir http://localhost:8000
```

### Option 3 — Node.js
```bash
cd willship-clone
npx serve .
```

---

## ✏️ Guide d'édition rapide

| Que modifier | Où |
|---|---|
| Couleurs globales | `assets/css/variables.css` → variables `--color-*` |
| Polices | `assets/css/variables.css` → `--font-heading`, `--font-body` |
| Textes d'une page | `pages/[page].html` → chercher la section concernée |
| Logo | `assets/images/logo.svg` |
| Navbar (liens, CTA) | Chaque `[page].html` → bloc `<header class="navbar">` |
| Footer (liens, adresse) | Chaque `[page].html` → bloc `<footer class="footer">` |
| Hero homepage | `index.html` → section `.hero` |
| Animations scroll | `assets/css/animations.css` + `assets/js/animations.js` |
| Validation formulaires | `assets/js/forms.js` |
| Tableau RoRo | `pages/roro-schedule.html` → sections `.route-section` |
| Galerie photos | `pages/gallery.html` → `.gallery-grid` (remplacer URLs placehold.co) |

---

## ⚠️ Points d'attention

### Éléments approximés (à vérifier sur l'original)

1. **Couleurs HEX exactes** — Le site original utilise probablement un bleu légèrement différent de `#1a5f9e`. Vérifier avec DevTools → Inspect → Computed → color.

2. **Familles de polices** — Montserrat/Open Sans sont des estimations. Vérifier via DevTools → Network → Fonts pour voir les fonts Google réellement chargées.

3. **Logo** — Le SVG est une approximation. Remplacer par le vrai logo (disponible en right-clic → "Save image as" sur le site original, ou via DevTools Network → Images).

4. **Images** — Toutes les images sont remplacées par des placeholders `placehold.co` aux dimensions approximatives. Remplacer par les vraies images en les téléchargeant depuis l'original.

5. **Tableau RoRo** — Les dates du tableau de programmation sont des exemples basés sur les données extraites. Vérifier et mettre à jour avec les données actuelles.

6. **Comportement sticky navbar** — Le scroll threshold (60px) est estimé. Ajuster dans `assets/js/navbar.js` si nécessaire.

### Fonctionnalités non clonées
- **Formulaires** : validation frontend uniquement — pas de backend/API. Connecter à un service (Formspree, Netlify Forms, etc.) pour la soumission réelle.
- **Tracking en temps réel** : référencé dans le contenu mais sans backend, non implémenté.
- **Système de quote automatique** : le site original dispose d'un système de devis automatisé — remplacé par le formulaire de contact standard.

---

## 🔧 Personnalisation avancée

### Remplacer les placeholders images
Les images utilisent le service `placehold.co`. Pour les remplacer :
1. Télécharger les vraies images depuis le site original
2. Les placer dans `assets/images/placeholders/`
3. Remplacer les URLs `placehold.co/...` dans les fichiers HTML correspondants

Format de nommage recommandé : `hero-banner-1920x800.jpg`, `team-nick-400x400.jpg`, etc.

### Connecter les formulaires
Remplacer la simulation dans `assets/js/forms.js` par un appel API réel :
```js
// Exemple avec Formspree
fetch('https://formspree.io/f/VOTRE_ID', {
  method: 'POST',
  body: new FormData(form),
  headers: { 'Accept': 'application/json' }
})
```
