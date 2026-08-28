---
name: portfolio-methodology
description: Directives d'architecture, protocole Spec-Driven Development (SDD), normes de performance, sécurité IA, et règles de développement pour le portfolio d'Ayoub MOSLIH.
---

# 📌 Méthodologie & Architecture du Portfolio — Ayoub MOSLIH

Ce Skill définit l'architecture complète, le flux de travail Spec-Driven Development (SDD), le protocole de création de pages, les normes strictes de performance/UI et les garde-fous de sécurité pour le site [Ayoub MOSLIH Portfolio](https://moslih84.vercel.app/).

---

## 🚀 1. Workflow de Développement : Spec-Driven Development (SDD)

Avant toute modification majeure ou création de fonctionnalité, le principe **SDD** s'applique :
1. **Spécifications d'abord :** Valider l'UI/UX, les données nécessaires, et les règles métier avec l'utilisateur avant d'écrire du code React.
2. **Conception guidée :** L'architecture des composants découle directement des spécifications validées.
3. **Itérations contrôlées :** Ne pas coder "à l'aveugle". Chaque implémentation technique doit répondre à une exigence préalablement définie et validée.

---

## 🏛️ 2. Architecture Globale & Carte du Codebase

### Point d'entrée & Routage
- **`index.html`** : Contient le loader squelette initial, les méta-tags SEO/OG, le JSON-LD (`Person`), et le script analytique différé (GTM & GA4).
- **`src/main.jsx`** : Instancie le `createRoot`, la feuille de style globale `./index.css` et Vercel Analytics.
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
├── data/                # Sources de données statiques
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

## 🛠️ 3. Protocole de Création d'une Nouvelle Page

*Pré-requis (SDD) : Avoir défini et validé l'objectif de la page et les données nécessaires.*

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
2. Ajouter la route dans le composant `AnimatedRoutes` :
   ```jsx
   <Route path="/ma-nouvelle-page" element={<MaNouvellePage />} />
   ```

### Étape 3 : Ajouter les clés de traduction dans `src/contexts/LanguageContext.jsx`
Ajouter les textes en Français et en Anglais dans l'objet `translations`.

### Étape 4 : Mettre à jour la Navigation (`Navbar.jsx`)
Si la page doit figurer dans le menu haut/mobile, ajouter l'élément dans `src/components/Navbar.jsx`.

---

## ⚡ 4. Normes UI/UX, Accessibilité & Performance

1. **Accessibilité (A11y) & UI Mobile-First :**
   - L'interface doit être conçue en priorité pour le mobile (Mobile-First).
   - Utiliser systématiquement les attributs d'accessibilité (balises sémantiques, attributs ARIA comme `aria-label`, `aria-hidden`, `role`) pour garantir l'utilisabilité par tous.
   - Le `CustomCursor` et les écouteurs d'événements lourds doivent rester désactivés sur écran tactile (`pointer: coarse`).
2. **Format des Images :**
   - Toutes les images **doivent être au format `.webp`** (largeur max 1000px).
   - Utiliser `scripts/optimize-images.js` pour la conversion automatique.
3. **Priorités de Chargement (Web Vitals) :**
   - **LCP (Largest Contentful Paint)** : L'image principale au-dessus de la ligne de flottaison dans `Home.jsx` a `fetchPriority="high"` et un `<link rel="preload">` dans `index.html`. Objectif visé : LCP < 2.5s.
   - Toutes les autres images ont `loading="lazy"` et `fetchPriority="low"`.
4. **Optimisation JS & Bundling :**
   - Les scripts lourds (`Three.js`, `GTM`, `GA4`) sont séparés ou différés.
5. **SEO & Aperçus Réseaux Sociaux :**
   - L'image d'aperçu d'URL (`og:image`, `twitter:image`) dans `index.html` doit utiliser une URL absolue HTTPS valide et spécifier ses dimensions (`width`, `height`) pour un affichage immédiat sur WhatsApp, LinkedIn, etc.

---

## 🔐 5. Sécurité, Intégrité des Données & Projets Confidentiels

1. **Validation Stricte aux Frontières :**
   - Toute donnée entrante (formulaires CRM, interactions Chatbot, entrées utilisateur) doit être **strictement validée et assainie** avant traitement ou envoi vers la base de données, pour garantir l'intégrité absolue des données métier.
2. **Chiffrement des URLs :**
   - Dans `src/data/projects.js`, les URLs confidentielles sont chiffrées avec `crypto-js` (AES). `ProtectedProjectModal.jsx` prend le mot de passe utilisateur et déchiffre l'URL dynamiquement.
3. **Protection des Vidéos :**
   - Les vidéos YouTube intégrées utilisent un overlay CSS transparent pour empêcher le clic droit / extraction directe.
4. **Firebase Security Rules & Fallback Data Extensif :**
   - Les lectures Firestore (Admin) sont protégées. En cas de blocage (règles de sécurité) ou de base vierge, l'application injecte des données par défaut (`try/catch`) pour éviter les crashs UI.

---

## 📱 6. PWA (Progressive Web App) & Expérience Mobile

1. **Prompt d'Installation Personnalisé :**
   - Attendre l'événement natif `beforeinstallprompt`. Aucun timer de forçage (`setTimeout`) n'est autorisé.
   - Fournir un fallback UI textuel si l'installation native n'est pas supportée (ex: iOS), sans jamais recourir à des popups système (`alert()`).
2. **Double Détection :**
   - Toujours vérifier le statut `window.matchMedia('(display-mode: standalone)').matches` pour ne pas ennuyer un utilisateur ayant déjà installé la PWA.
3. **Séparation Logique :**
   - Utiliser des clés de localStorage distinctes (`m84_pwa_dismissed_portfolio` et `m84_pwa_dismissed_admin`) pour séparer les contextes d'installation.

---

## 🤖 7. Architecture IA & Sécurité (Guardrails)

1. **Base de connaissances (Knowledge Base) :**
   - Gérée dans `src/data/knowledgeBase.js`, elle centralise les instructions et l'expérience pour optimiser le contexte envoyé au LLM.
2. **Configuration Dynamique & Guardrails Stricts :**
   - L'Agent utilise un *System Prompt* sécurisé dans Firestore.
   - **Guardrails IA :** Les instructions du chatbot doivent interdire formellement les hallucinations et forcer l'IA à rester dans le périmètre du portfolio. 
3. **Anonymisation & Confidentialité :**
   - Toute donnée personnelle transitant par l'IA doit être manipulée avec précaution ; le système ne doit pas exposer de données de leads (CRM) aux utilisateurs du chat public.
4. **Historique CRM :**
   - Le pipeline d'acquisition sauvegarde l'historique complet des échanges. `CrmLeadsManager.jsx` parse intelligemment ce bloc textuel pour restituer une UI conversationnelle dans l'admin.

---

## 🚫 8. Architecture des Pages d'Erreurs & Mode Hors-Ligne

1. **Pages d'erreurs unifiées :**
   - `ErrorPage.jsx` gère dynamiquement toutes les erreurs (404, 401, 403, 500) avec traduction automatique (`LanguageContext`).
2. **Détecteur Hors-Ligne (OfflineDetector) :**
   - Écoute les événements `online` / `offline` et remplace l'UI par un écran de déconnexion si nécessaire.
3. **Animations Lottie :**
   - Les erreurs intègrent des animations `.json` fluides, activables via le flag `showLottie`.

---

## 🧪 9. Protocole de Tests, QA & Déploiement Strict

### A. La Pyramide de Tests du Portfolio (Par Défaut)
Par défaut, toutes les vérifications de routine s'effectuent via la suite de tests interne :

| Niveau | Outils / Commandes | Objectif |
| :--- | :--- | :--- |
| **1. Contrôle Statique & Linter** | `npm run lint` (Oxlint) | Détecter les erreurs de syntaxe, imports morts et règles React hooks |
| **2. Build de Production** | `npm run build` (Vite) | Valider le bundling, le tree-shaking et l'absence d'erreurs d'import |
| **3. Tests E2E Automatisés** | `npx playwright test` | Valider les parcours critiques (navigation, modales AES, CRM, filtres) |
| **4. Smoke Tests & DevTools** | Chrome DevTools / Émulation | Valider visuellement l'UI mobile (375px) / desktop (1440px) et 0 erreur console |
| **5. Audit Performance & A11y** | Lighthouse | Contrôler les Core Web Vitals (LCP < 2.5s, CLS = 0) et le score accessibilité |

---

### B. Règle d'Exécution des Tests : Standard vs TestSprite
- **Mode Standard (Par Défaut)** : Toujours exécuter la pyramide standard (`npm run lint` + `npm run build` + `npx playwright test`).
- **Mode TestSprite (Sur Demande Explicite Uniquement)** :
  - N'exécuter les tests autonomes cloud via le CLI TestSprite (`testsprite test create --plan-from ... --run --wait` ou `testsprite test run ... --wait`) **uniquement si l'utilisateur en fait la demande explicite** (ex : *"teste avec TestSprite"*, *"lance testsprite"*, *"fais un test testsprite"*).
  - Si l'utilisateur ne mentionne pas spécifiquement TestSprite, **toujours utiliser la suite de tests interne (Playwright, Oxlint, Build)** définie dans la méthodologie.

---

### C. Procédure de Smoke Test E2E & DevTools
Après chaque développement ou modification d'une vue :
1. **Lancement local :** `npm run preview` ou `npm run dev` (vérifier que l'application répond sans warning bloquant).
2. **Inspection Console :** S'assurer de l'absence totale d'erreurs rouges (`0 erreurs console tolérées`) ou d'avertissements de clé React.
3. **Parcours critiques à tester :**
   - **Navigation & Routage :** Changement de langue (FR/EN), navigation fluide entre les pages sans rechargement.
   - **Projets protégés (AES) :** Tester la modale de déverrouillage avec le code `031984`.
   - **Agent M84 (Chatbot) :** Vérifier la réponse texte, les CTAs cliquables et la transition de quota/fallback local.
   - **Capture de Leads :** Vérifier que le formulaire CRM s'enregistre ou bascule en mode fallback sans écran blanc.
4. **Matrice Responsive :**
   - **Mobile Standard (375 x 812) :** Menu hamburger, FAB, tiroirs du dashboard, cartes projets sans débordement horizontal.
   - **Desktop Standard (1440 x 900) :** Centrage des sections, effet parallaxe/tilt et animations fluides.

---

### D. Checklist de Validation & Déploiement

Avant de marquer une tâche comme terminée ou de procéder au déploiement :

- [ ] **Linter :** `npm run lint` passe avec 0 erreur.
- [ ] **Build de Production :** `npm run build` se termine avec succès (code 0).
- [ ] **Tests E2E :** `npx playwright test` valide les suites de tests sans régression.
- [ ] **TestSprite (Si demandé) :** Exécuté et validé sur l'environnement cible si requis par l'utilisateur.
- [ ] **Console propre :** Aucune exception non gérée ni crash dans la console.
- [ ] **Responsive validé :** Testé sur mobile (375px) et desktop (1440px).
- [ ] **Accord Déploiement :** Ne **JAMAIS** pousser sur Git (`git push origin main`) ou déclencher un déploiement Vercel sans la **validation explicite et finale** de l'utilisateur.

