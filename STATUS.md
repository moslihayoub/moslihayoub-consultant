# 📌 État du Projet - Ayoub MOSLIH Portfolio

## 🚀 Présentation & Stack Technique
- **Nom du site** : Ayoub MOSLIH - Consultant en transformation digitale & AI
- **Stack** : React (Vite), Framer Motion, Vanilla CSS, Lucide React, Crypto-JS.
- **PWA & Hosting** : PWA (Vite PWA Plugin) hébergé sur Vercel (`https://moslih84.vercel.app/`).
- **Analytics** : Google Analytics 4 (`G-PTQB4BHQHW`) & Google Tag Manager.

---

## 🛠️ Dernières Fonctionnalités & Optimisations Réalisées

### 1. 🖼️ Performance & Images (WebP)
- Toutes les images dans `public/assets/galerie/` et `public/assets/works/` (UX/UI, Motion) ont été optimisées et converties au format `.webp` (largeur max 1000px).
- Utilisation d'un script Node.js dédié : `scripts/optimize-images.js`.
- Suppression complète des anciens fichiers `.png` / `.jpg` lourds.

### 2. 🔐 Sécurisation des Projets Confidentiels (Cryptage AES)
- Utilisation de `crypto-js` avec l'algorithme **AES**.
- Les URLs protégées dans `src/data/projects.js` sont chiffrées.
- `ProtectedProjectModal.jsx` déchiffre l'URL dynamiquement lors de la saisie du code correct.

### 3. 📱 PWA & Toaster d'Installation
- Toaster PWA réactif et centré sur mobile (`src/components/PwaInstallPrompt.jsx`).
- Message optimisé pour inciter le téléchargement.

### 4. 📁 Projets Récents Ajoutés & Ajustements
- **QuickToken UI** dans la catégorie **MVP Ai** (`public/assets/works/ux-ui/quicktoken.webp`).
- Ajout de la nouvelle catégorie **AI Filmmaking** dans `Work.jsx`.
- Ajout de la page de détail dynamique pour **The Factory** (`/project/the-factory`), sécurisée par mot de passe et illustrant le making-of (storyboard, character sheet, vidéos AI).
  - Intégration de vidéos YouTube (autoplay, loop, mute) avec un overlay de protection (anti-clic droit).
  - Optimisations mobiles : centrage du fil d'Ariane, empilement des vidéos en colonne, désactivation du chat sur les pages de détails.
  - Fusion d'image principale via `mix-blend-mode: multiply` pour cacher le fond.
- **Correctif d'erreur de navigation** : Ajout d'un `ErrorBoundary` global pour gérer automatiquement le rechargement de page si le cache (Vite PWA / ChunkLoadError) provoque un écran blanc lors de la navigation (notamment après un déploiement Vercel).

### 5. 🔍 SEO & Accessibilité (A11y)
- Méta-titre, description, Open Graph et balises sémantiques HTML5 configurés.
- Données structurées JSON-LD (`Person`).
- Attributs `aria-label` et correction des contrastes pour l'accessibilité W3C.

### 6. 🎨 Mises à jour UI & Interactions Récentes
- **Page d'Accueil (Hero)** : Ajout d'une fonctionnalité de pause au survol et d'une popup (Lightbox) sur les images de la galerie défilante.
- **Page À Propos** : Intégration du flux X (Twitter) via widget officiel et ajout du lien MTBL avec logo détouré (transparent) et fond harmonisé.
- **Détail Projet (The Factory)** : 
  - Ajout d'une fonctionnalité de Lightbox au clic sur les images (version desktop).
  - Réorganisation de la grille d'images (1 image par ligne au début, puis 2 par ligne pour le storyboard).
- **ChatWidget** : Amélioration du glisser-déposer sur mobile avec contraintes de bord d'écran strictes pour éviter sa disparition, tout en conservant la fluidité.

---

## 📋 Tâches / Prochaines Étapes
- [x] Ajouter des projets dans la catégorie **AI Filmmaking** si disponible (Ajout de *The Factory*).
- [x] Vérifier la bonne intégration globale après les ajouts de projets.
- [x] Mises à jour UI (Hero, About, Project Detail, ChatWidget).
- [x] Pousser les changements récents sur Git (`git push origin main`).
