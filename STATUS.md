# 📌 État du Projet - Ayoub MOSLIH Portfolio

## 🚀 Présentation & Stack Technique
- **Nom du site** : Ayoub MOSLIH - Consultant en transformation digitale & AI
- **Stack** : React (Vite), Framer Motion, Vanilla CSS, Lucide React, Crypto-JS.
- **PWA & Hosting** : PWA (Vite PWA Plugin) hébergé sur Vercel (`https://moslih84.vercel.app/`).
- **Analytics** : Google Analytics 4 (`G-PTQB4BHQHW`), Google Tag Manager (`GTM-T5W5ZMS7`) & Microsoft Clarity (`xtiy932jnh`).
- **Tests** : Playwright E2E (`tests/`) & Oxlint.

---

## 🛠️ Dernières Fonctionnalités & Optimisations Réalisées

### 1. 🖼️ Performance & Optimisations Lighthouse Mobile
- toutes les images dans `public/assets/galerie/` et `public/assets/works/` au format `.webp` (largeur max 1000px).
- **Optimisations Mobile (Score PageSpeed 77 -> 90+)** :
  - Preload de la 1ère image Hero (`20230517_184215.webp`) dans `index.html`.
  - Chargement asynchrone différé de GTM & GA4 (1.5s après `onload`) pour libérer le thread principal JS (TBT < 100ms).
  - Chunking isolé de la dépendance lourde `Three.js` dans `vite.config.js` (`manualChunks`), allégeant le bundle initial de ~930 KB.
  - Correctif du Marquee Hero : suppression du `loading="lazy"` problématique dans les animations CSS et renommage des fichiers médias en noms d'URL web-safe.
  - Désactivation des écouteurs `CustomCursor` sur appareils tactiles (`pointer: coarse`).

### 2. 🔐 Sécurisation & Uniformisation des Projets Confidentiels (AES)
- Chiffrement symétrique **AES** via `crypto-js`.
- Re-chiffrement uniforme de **100% des projets restreints** avec le mot de passe **`031984`** (*Autocash, Nexastay, Agence Urbaine, Foodeals, YDG, Laval, Bab Moulay Driss, The Factory*).
- `ProtectedProjectModal.jsx` déchiffre l'URL dynamiquement lors de la saisie du code correct.

### 3. 📹 Protection Globale des Vidéos (Anti-Clic Droit & Mobile)
- Neutralisation de l'événement `contextmenu` (`onContextMenu={(e) => e.preventDefault()}`) sur l'ensemble des vidéos.
- Ajout d'une superposition transparente de protection (`overlay`) au-dessus des lecteurs pour empêcher la pression longue sur iOS Safari et Android Chrome.
- Masquage des options de téléchargement (`controlsList="nodownload noremoteplayback"` + `disablePictureInPicture`) et CSS `-webkit-touch-callout: none !important;`.

### 4. 🎨 UI & Ergonomie : Refonte Épurée du ScrollSpy
- **Transparence du contenu** : Suppression complète du pavé de flou d'arrière-plan (`backdrop-filter`) qui masquait les visuels de la page.
- **Rendu épuré** : Affichage par défaut limité à la ligne verticale et aux points d'étapes.
- **Micro-interaction Hover** : Affichage du badge avec le nom de l'étape uniquement lors du survol de l'élément (`hoveredIndex`).

### 5. 🧠 Skill de Méthodologie & Architecture (`skills/portfolio-methodology/SKILL.md`)
- Création et versionnage d'un Skill complet documentant :
  - La carte du codebase et l'architecture du projet.
  - Le protocole pas à pas pour créer une nouvelle page sans casser le routage ou la PWA.
  - Les standards de performance, de sécurité et le workflow de test/déploiement.

### 7. 🤖 Intégration Firebase AI Logic & Gemini API (Chatbot M84)
- Création du projet Firebase **`moslih84-consultant`** (App Web `moslih84-web`) et activation du service **Firebase AI Logic**.
- Module `src/utils/firebaseAi.js` configuré avec `gemini-2.0-flash`.
- **RAG & Base de Connaissances Dynamique** : Le prompt injecte dynamiquement les données du site (`src/data/projects.js`) pour garantir que l'IA a toujours les informations en temps réel.
- **Structured Output (JSON)** : Configuration de Gemini pour répondre avec un format JSON strict, permettant d'inclure des "Call To Action" (CTA) intelligents pour guider l'utilisateur.
- **Routage & UI** :
  - Interception des CTA pour déclencher une navigation sans rechargement (ex: `/work` ou URLs externes).
  - Indication de frappe (typing indicator) avec animation de 3 points.
  - Uniformisation du Markdown (forçage de taille `0.85rem` et interdiction des balises titres).
  - Mode Agrandir (Maximize) +30% largeur / 80vh hauteur, avec transition fluide (Framer Motion).
- Architecture hybride avec fallback automatique vers le moteur FAQ local en cas de problème réseau.

### 8. 🤖 Refonte & Alignement de l'Agent M84 (Mode IA & Mode Local)
- **Positionnement & Rebranding** : Évolution de "chatbot" vers **Agent M84** (*Agent IA* et *Agent Local*).
- **Base de Connaissances Unifiée (`src/data/knowledgeBase.js`)** : Centralisation des profils, 19 ans d'expérience, clients phares (CGI, OCP, Crédit du Maroc, Carrefour...), top 3 certifs et projets publics.
- **Bannière de Transition de Quota 💡** :
  - Message explicite lors de la bascule automatique du mode IA vers le mode Local :
    > *💡 Le crédit de l’agent IA est temporairement épuisé. Il se réinitialise dans environ 1 heure et le mode IA complet reviendra automatiquement. En attendant, vous êtes accompagné par l’agent local pour continuer votre consultation digitale, parler de votre projet ou explorer des pistes de collaboration.*
- **Gestion Stricte des 6 Intentions** :
  1. *Spécialité / Profil* (Synthèse + 3 CTAs)
  2. *Services* (4 axes + 3 CTAs)
  3. *Projets / SaaS* (Cartes UI des projets publics + CTA global "Voir plus de projets", **exclusion absolue des projets protégés AES**)
  4. *CV / Parcours* (Résumé + CTAs Ouvrir/Télécharger/Timeline)
  5. *Certifications* (Max 3 cartes certifs + CTA global)
  6. *Contact / Devis / Collaboration* (Orientation consultation & RDV + 3 CTAs)
- **Recadrage Hors-Sujet & Fallback** :
  - Recadrage poli en 1 phrase pour les questions non liées au site/services.
  - Reformulation et suggestions interactives au lieu de réponses d'erreur génériques.
- **Bouton & Interrupteur Toggle Switch (Dev Only)** :
  - Intégration d'un **toggle switch visuel interactif** `[IA | Local]` dans le header de l'Agent M84 sur localhost pour basculer instantanément entre l'Agent IA et l'Agent Local lors de vos tests.
  - Totalement exclu et masqué du bundle de production via `import.meta.env.DEV`.

---

## 📋 Tâches / Prochaines Étapes
- [x] Refonte & alignement de l'Agent M84 (Mode IA & Mode Local).
- [x] Interrupteur Toggle Switch visuel pour les tests en dev.
- [x] Intégration des images dans les cartes projets UI du chat.
- [x] Alignement UX pour "Voir ses services" (résumé puces + guidage vers la page).
- [x] Conditionnement strict de la CTA "Voir la timeline".
- [x] Validation par tests E2E Playwright (6/6 PASSED).
- [x] Vérification Build Vite & Oxlint (0 erreur).

