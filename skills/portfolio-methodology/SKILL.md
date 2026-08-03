---
name: portfolio-methodology
description: Directives d'architecture, protocole de création de pages, normes de performance, sécurité et règles de développement pour le portfolio d'Ayoub MOSLIH.
---

# 📌 Méthodologie & Architecture du Portfolio — Ayoub MOSLIH

Ce Skill définit l'architecture complète, la structure des dossiers, le protocole de création de pages et les règles d'optimisation pour le site [Ayoub MOSLIH Portfolio](https://moslih84.vercel.app/).

---

## 🏛️ 1. Architecture Globale & Carte du Codebase

### Point d'entrée & Routage
- **`index.html`** : Contient le loader squelette initial, les méta-tags SEO/OG, le JSON-LD (`Person`), et le script analytique différé (GTM & GA4).
- **`src/main.jsx`** : Instancie le `createRoot`, la feuille de style globale `./index.css` et Vercel Analytics (`@vercel/analytics/react`).
- **`src/App.jsx`** : Déclare le `BrowserRouter`, la gestion de langue (`LanguageProvider`), les composants d'infrastructure (`Navbar`, `Footer`, `CustomCursor`, `ScrollSpy`, `CookieBanner`, `PwaInstallPrompt`, `ChatWidget`) et l'animation de routes (`AnimatePresence` + `ErrorBoundary`).

### Arborescence des Dossiers
```text
src/
├── components/          # Composants UI réutilisables
│   ├── AnimatedPage.jsx        # Enveloppe obligatoire pour chaque page (Transitions)
│   ├── CustomCursor.jsx        # Curseurs personnalisés (Désactivé sur tactile)
│   ├── ErrorBoundary.jsx       # Gestionnaire d'erreurs de chunk & rechargement PWA
│   ├── Navbar.jsx              # Barre de navigation principale avec menu mobile
│   ├── Footer.jsx              # Pied de page avec liens sociaux
│   ├── ProjectCard.jsx         # Carte d'affichage d'un projet
│   ├── ProtectedProjectModal.jsx # Popup de déchiffrement AES
│   ├── ScrollSpy.jsx           # Indicateur dynamique de section
│   └── TiltWrapper.jsx         # Effet parallaxe 3D sur carte au survol
├── contexts/            # Contextes React globaux
│   └── LanguageContext.jsx     # Système i18n (FR / EN) & traductions
├── data/                # Sources de données
│   └── projects.js             # Catalogue officiel des projets & URLs chiffrées AES
├── pages/               # Pages principales de l'application
│   ├── Home.jsx                # Page d'accueil (Hero Marquee, Recent Work, Timeline)
│   ├── Work.jsx                # Galerie filtrable par catégorie
│   ├── About.jsx               # Parcours, compétences, widget X/Twitter
│   ├── ProjectDetail.jsx       # Page de détail dynamique (/project/:id)
│   └── Admin/                  # Back-office et Tableaux de bord
│       ├── AdminDashboard.jsx  # Hub principal d'administration
│       ├── ProjectsManager.jsx # Gestion CMS des projets
│       └── CrmLeadsManager.jsx # Boîte de réception CRM / Leads
├── index.css            # Design System, variables CSS (oklch) et styles globaux
public/
└── assets/              # Médias statiques (Galerie Hero & Projets en WebP)
```

---

## 🛠️ 2. Protocole de Création d'une Nouvelle Page

Pour ajouter une nouvelle page sans se perdre ni casser le routage, la PWA ou la fluidité des animations :

### Étape 1 : Créer le composant Page
Créer le fichier dans `src/pages/MaNouvellePage.jsx`. **Obligation** : Envelopper le contenu avec `<AnimatedPage>`.

```jsx
import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { useLanguage } from '../contexts/LanguageContext';

export default function MaNouvellePage() {
  const { t } = useLanguage();

  return (
    <AnimatedPage>
      <section id="ma-section" data-scrollspy={t('nav_ma_page')} className="section-padding">
        <div className="container">
          <h1>{t('titre_ma_page')}</h1>
          {/* Contenu de la page */}
        </div>
      </section>
    </AnimatedPage>
  );
}
```

### Étape 2 : Déclarer la route avec Lazy Loading dans `src/App.jsx`
1. Importer la page via `React.lazy()` au début de `src/App.jsx` :
   ```jsx
   const MaNouvellePage = lazy(() => import('./pages/MaNouvellePage'));
   ```
2. Ajouter la route dans le composant `AnimatedRoutes` de `src/App.jsx` :
   ```jsx
   <Route path="/ma-nouvelle-page" element={<MaNouvellePage />} />
   ```

### Étape 3 : Ajouter les clés de traduction dans `src/contexts/LanguageContext.jsx`
Ajouter les textes en Français et en Anglais dans l'objet `translations` :
```javascript
fr: {
  nav_ma_page: 'Ma Page',
  titre_ma_page: 'Bienvenue sur ma nouvelle page'
},
en: {
  nav_ma_page: 'My Page',
  titre_ma_page: 'Welcome to my new page'
}
```

### Étape 4 : Mettre à jour la Navigation (`Navbar.jsx`)
Si la page doit figurer dans le menu haut/mobile, ajouter l'élément dans `src/components/Navbar.jsx`.

---

## ⚡ 3. Normes de Performance & Médias

1. **Format des Images** :
   - Toutes les images **doivent être au format `.webp`** (largeur max 1000px).
   - Emplacements : `public/assets/galerie/` et `public/assets/works/`.
   - Utiliser `scripts/optimize-images.js` pour la conversion automatique.
2. **Priorités de Chargement LCP & Marquee** :
   - L'image principale au-dessus de la ligne de flottaison (LCP) dans `Home.jsx` a `fetchPriority="high"` et un `<link rel="preload">` dans `index.html`.
   - Toutes les autres images ont `loading="lazy"` et `fetchPriority="low"`.
3. **Optimisation JS & Bundling** :
   - Les scripts lourds (`Three.js`, `GTM`, `GA4`) sont séparés ou différés.
   - Ne pas charger Three.js sur la page d'accueil.
4. **Appareils Mobiles** :
   - Le `CustomCursor` et les écouteurs d'événements lourds doivent rester désactivés sur écran tactile (`pointer: coarse`).

---

## 🔐 4. Sécurité & Projets Confidentiels (AES)

1. **Chiffrement des URLs** :
   - Dans `src/data/projects.js`, les URLs confidentielles sont chiffrées avec `crypto-js` (AES).
2. **Déchiffrement** :
   - `ProtectedProjectModal.jsx` prend le mot de passe utilisateur et déchiffre l'URL dynamiquement.
3. **Protection des Vidéos / Making-Of** :
   - Les vidéos YouTube intégrées utilisent un overlay CSS transparent pour empêcher le clic droit / extraction directe.
4. **Firebase Security Rules & Fallback Data Extensif** :
   - Les lectures Firestore (Admin) sont protégées. L'application (`AdminDashboard`, `CrmLeadsManager`) implémente un pattern de fallback (`try/catch` ET contrôle de collection vide `leadsData.length === 0`) : si les règles bloquent la requête (absence de Firebase Auth) ou si la base est totalement vierge, les composants injectent statiquement les données par défaut (issues du parsing CSV `src/data/fallbackLeads.js`) pour garantir que l'UI, les graphiques et le tableau de bord affichent toujours des statistiques et informations concrètes.

---

## 📱 5. PWA (Progressive Web App) & Expérience Mobile

1. **Prompt d'Installation Personnalisé** :
   - Le toaster PWA attend l'événement natif `beforeinstallprompt` envoyé par le navigateur.
   - Afin d'éviter les pop-ups abusifs sur PC (où le navigateur gère nativement le bouton d'installation dans la barre d'adresse), aucun timer de forçage (`setTimeout`) n'est utilisé.
   - Si le navigateur bloque l'installation via la fonction `prompt()` ou s'il s'agit d'iOS sans support natif fluide, un fallback UI affiche les instructions ("Appuyez sur l'icône de partage..."), sans jamais recourir à des popups système (`alert()`).
2. **Double Détection** :
   - Toujours vérifier le statut `window.matchMedia('(display-mode: standalone)').matches` et `window.navigator.standalone` au montage pour ne pas ennuyer un utilisateur ayant déjà installé la PWA.
3. **Séparation Logique** :
   - Les contextes d'installation doivent rester indépendants selon le périmètre (Portfolio Front vs Backoffice Admin). On utilise des clés de localStorage distinctes (`m84_pwa_dismissed_portfolio` et `m84_pwa_dismissed_admin`).

---

## 🤖 6. Architecture IA & Agent M84

1. **Base de connaissances (Knowledge Base)** :
   - Gérée dans `src/data/knowledgeBase.js`, elle centralise toutes les instructions, l'expérience découpée par type de métier (Product Design, Graphic Design, Motion) et les clients phares, afin d'optimiser le contexte envoyé au LLM.
2. **Configuration Dynamique via Backoffice** :
   - L'Agent utilise un *System Prompt* configurable via l'UI d'administration (`AiConfigManager.jsx`).
   - Le prompt est stocké de manière sécurisée dans la base de données Firestore (collection `config`, document `agent`). S'il est présent, il a la priorité absolue sur le fallback de l'application.
3. **Historique CRM & UI** :
   - Le pipeline d'acquisition sauvegarde l'historique complet des échanges. `CrmLeadsManager.jsx` parse intelligemment ce bloc textuel (`--- Historique ---`) pour restituer une interface conversationnelle fluide (bulles de discussion) dans le profil du lead.

---

## 🚫 7. Architecture des Pages d'Erreurs & Mode Hors-Ligne

1. **Pages d'erreurs unifiées** :
   - Toutes les pages d'erreurs (404, 401, 403, 500, 503) utilisent un composant central réutilisable `ErrorPage.jsx`.
   - Elles s'appuient sur `LanguageContext` pour traduire automatiquement les titres et descriptions selon la langue du visiteur.
2. **Détecteur Hors-Ligne (OfflineDetector)** :
   - L'application est enveloppée par un composant `OfflineDetector.jsx` qui écoute les événements de fenêtre (`online` / `offline`).
   - En cas de coupure réseau, l'interface est immédiatement remplacée par l'écran de déconnexion.
3. **Animations Lottie** :
   - Les encarts d'erreurs sont prévus pour accueillir des animations `.json` fluides (`lottie-react`). L'affichage visuel du composant Lottie peut être activé ou désactivé via le flag interne `showLottie` dans `ErrorPage.jsx` selon la stratégie UX souhaitée.

---

## 🧪 8. Protocole de Test & Déploiement Strict

Après chaque modification ou ajout de page :

1. **Build Check** : Exécuter `npm run build` (détecte toute erreur de bundling ou d'import).
2. **Linter Check** : Exécuter `npm run lint` (vérifie la qualité et l'absence d'erreurs de syntaxe).
3. **Test Visuel** : Exécuter `npm run preview` pour valider le rendu sur `http://localhost:4173/`.
4. **Accord Déploiement** : Ne **JAMAIS** pousser sur Git (`git push origin main`) ou déployer sur Vercel sans la validation explicite de l'utilisateur.
