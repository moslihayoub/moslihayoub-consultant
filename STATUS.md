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

### 9. 📱 UI/UX & Responsive Design (Admin Dashboard)
- **Refonte Mobile-First** : Optimisation des layouts sur `AdminDashboard`, `ProjectsManager`, `CrmLeadsManager` et `AiConfigManager`.
- **Composants Dynamiques (Drawers)** : Remplacement des menus déroulants d'actions et d'export par des tiroirs animés en bas d'écran (`slideUp`) pour une ergonomie fluide sur mobile.
- **Floating Action Button (FAB)** : Ajout d'un bouton flottant pour ajouter des projets rapidement sur smartphone.
- **Fluidité & Animations** : Intégration de micro-interactions (`fadeIn`, `slideInRight`) pour adoucir l'apparition des modales et arrière-plans.
- **Correction de l'Espace Vide** : Réajustement des `padding` (14px) et retrait de la restriction de hauteur sur les grilles mobiles pour utiliser l'intégralité de l'écran.
- **Identité Visuelle** : Titres principaux en vert (`#006253`), et tableaux gardés lisibles avec leurs en-têtes neutres.

### 10. 🔌 Synchronisation des Données, CRM & PWA
- **Fallback CSV Complet (Dashboard & CRM)** : Injection automatique des données de leads depuis le fichier CSV lorsque les règles de sécurité Firestore bloquent la lecture ou que la base est vide. Le dashboard affiche toujours des statistiques concrètes (graphiques par mois) et le CRM liste les contacts.
- **Modale CRM Historique de Conversation** : En cliquant sur un lead dans le Back-office, une modale affiche l'historique complet de la discussion entre l'utilisateur et le Chatbot avant la capture de l'email, avec une UI de bulles de chat (type WhatsApp/Messenger).
- **Toaster PWA Intelligent** :
  - Déclencheur de secours (timer de 3.5s) pour afficher l'invite d'installation sur les navigateurs sans `beforeinstallprompt` (iOS Safari).
  - Suppression de l'alerte native `alert()` sur iOS, remplacée par des instructions d'installation UI (`Appuyez sur l'icône de partage...`) qui s'affichent directement à l'intérieur du toaster.
  - Tracking d'installation séparé via clés `localStorage` distinctes pour le Portfolio (`m84_pwa_dismissed_portfolio`) et le Backoffice (`m84_pwa_dismissed_admin`), afin que l'un ne masque pas l'autre.
  - Détection automatique du mode `standalone` pour masquer définitivement l'invite si l'app est déjà installée.

### 11. ⚙️ Tableau de bord, Filtres et Optimisations UX (Admin)
- **Filtres par dates ("Du/Au")** : Implémentation du composant natif de calendrier sur les pages `Vue d'ensemble` et `CRM Leads`. Les données (Trafic, Nouveaux Leads) sont filtrées dynamiquement en fonction de la plage de dates sélectionnée.
- **Détails CRM (Historique de Chat)** : Développement d'un parseur robuste basé sur des expressions régulières (Regex : `/(Utilisateur|Agent) : /g`) pour découper proprement la chaîne de texte de l'historique complet, gérant ainsi les messages multi-lignes sans erreur. L'interface génère dynamiquement des bulles de chat (bleues pour l'Utilisateur, vertes pour l'Agent) à l'intérieur de la modale de détails CRM.
- **Toaster PWA** : Suppression du `setTimeout` forçant l'affichage du toaster iOS/Fallback sur ordinateur. Le toaster n'apparaît désormais que sur mobile lors du déclenchement natif de l'événement `beforeinstallprompt`, garantissant une installation `prompt()` 100% native.
- **Gestion Configuration IA** : L'interface `AiConfigManager` permet la sauvegarde d'un *system prompt* personnalisé directement dans Firestore (collection `config`, document `agent`). Ce prompt est utilisé en priorité par l'Agent M84 s'il existe, écrasant le prompt par défaut de l'application.

### 12. 🚫 Pages d'Erreurs Unifiées (404, 401, 403, 500, 503, Offline)
- **Design Unifié** : Création d'un composant `ErrorPage` générique (Titre, Description, Animation Lottie, Bouton d'action).
- **Gestion Hors-Ligne** : Intégration du composant `OfflineDetector` qui enveloppe toute l'application et affiche la page d'erreur de connexion si l'utilisateur perd internet.
- **Support Multilingue** : Les pages d'erreurs s'adaptent dynamiquement (FR/EN) selon la langue de navigation du visiteur via `LanguageContext`.
- **Intégration Lottie** : Architecture prête pour l'intégration de fichiers JSON animés (`public/assets/lottie/`). Temporairement désactivée selon la demande du client pour afficher uniquement du texte épuré.
### 13. 🖼️ Meta Tags Open Graph & Aperçus Réseaux Sociaux (WhatsApp, LinkedIn, Twitter & SEO)
- **Image d'aperçu d'URL (`og:image`)** : Configuration de l'image officielle `https://moslih84.vercel.app/assets/galerie/20250419_155833.webp` dans `index.html`.
- **Compatibilité WhatsApp & Réseaux** : Déclaration des balises `og:image:secure_url`, `og:image:type` (`image/webp`), `og:image:width` (600), `og:image:height` (849) et `og:url` permettant d'afficher automatiquement l'aperçu visuel de haute qualité lors du partage du lien sur WhatsApp, LinkedIn, Facebook et Twitter.
- **Données Structurées JSON-LD** : Enrichissement du schéma `Person` avec le lien direct vers l'image du profil pour l'indexation Google Search.

### 14. 💳 Nouvelle Référence Projet MVP : Fluxo Finance
- **Intégration du projet** : Ajout de **Fluxo — Gestion & Trésorerie** (`https://fluxofinance.vercel.app/`) dans la catégorie **MVP Ai** de `src/data/projects.js`.
- **Mockup & Optimisation WebP** : Conversion optimisée du visuel responsive (MacBook Pro + iPhone) au format `.webp` (32 KB, max 1000px) dans `public/assets/works/ux-ui/fluxo.webp`.
- **RAG & Chatbot M84** : Synchronisation de `knowledgeBase.js` et `chatbot_faq.json` pour intégrer la carte interactive Fluxo, son lien direct et sa description bilingue.
- **Marquee Clients** : Ajout de Fluxo dans la bannière défilante des clients (`Work.jsx`).

### 15. 🔄 Synchronisation CI/CD & GitHub
- **Récupération Token GitHub** : Récupération et application des identifiants d'accès valides pour le compte `moslihayoub`.
- **Push & Déploiement** : Branche `main` synchronisée sur GitHub (`moslihayoub/moslihayoub-consultant`) et pipeline de production Vercel validé sur `https://moslih84.vercel.app/`.

### 16. 🧠 Évolution de la Méthodologie (Spec-Driven Development & Protocole QA / Tests)
- **Mise à jour du processus de développement** : Intégration du Spec-Driven Development (SDD) dans `skills/portfolio-methodology/SKILL.md`.
- **Qualité & Sécurité** : Ajout de règles strictes pour la validation des données, les standards d'accessibilité (Mobile-first, WCAG, ARIA), et l'anonymisation / Guardrails de l'Agent IA.
- **Pyramide de Tests & Protocole QA** : Formalisation des tests E2E automatisés Playwright, des smoke tests DevTools (0 erreur console tolérée), de la matrice responsive (375px/1440px) et des audits Lighthouse.
- **Continuité technique** : Zéro impact sur le code source existant (React/Vite).

### 17. 🤖 Résolution de l'Agent IA & Correctif 404 du CV
- **Mise à niveau Gemini API** : Bascule vers le modèle `gemini-3.6-flash` avec transmission sécurisée de la clé d'API, résolvant le crash 404 de l'ancien modèle déprécié.
- **Correction du lien CV** : Fichier PDF servi directement depuis la racine publique (`/moslihayoub-cv.pdf`) avec règle de réécriture Vercel (`vercel.json`), garantissant un téléchargement immédiat (HTTP 200) depuis l'Agent IA et la page About.
- **Design des pages d'erreur (404, 401, 403, 500, Offline)** : Stylisation du grand numéro d'erreur en vert transparent (`rgba(0, 98, 83, 0.18)`) pour une lisibilité optimale et un rendu moderne.

### 18. 🔐 Authentification Hybride Admin Firebase (Google Sign-In & Email/Password)
- **Double Fournisseur de Connexion** :
  1. *Option 1* : Connexion 1-clic native avec Google (`signInWithPopup`).
  2. *Option 2* : Connexion par Email et Mot de passe (`moslihayoub@gmail.com` / `M@slih031984`).
- **Contrôle d'accès strict (Whitelist)** : Seule l'adresse `moslihayoub@gmail.com` est autorisée à accéder au Back-office. Les autres comptes sont automatiquement révoqués (`signOut`).
- **Gestion des erreurs OAuth & Domaines autorisés** : Messages d'erreur explicites guidant l'ajout des domaines (`localhost`, `moslih84.vercel.app`) dans la console Firebase Authentication.
- **Validation E2E Playwright** : Suite complète de 10 tests de non-régression exécutés avec 100% de succès.

---

## 📋 Tâches / Prochaines Étapes
- [x] Refonte & alignement de l'Agent M84 (Mode IA & Mode Local).
- [x] Interrupteur Toggle Switch visuel pour les tests en dev.
- [x] Intégration des images dans les cartes projets UI du chat.
- [x] Optimisation de l'Admin Dashboard (Responsive Mobile, Tiroirs, FAB, Animations).
- [x] Affichage de l'historique complet de discussion Chatbot (UI Bulles de chat robustes via Regex) dans la modale CRM Lead.
- [x] Refonte de l'installation PWA (Custom UI iOS, Détection standalone, Séparation Portfolio/Admin).
- [x] Validation PWA sur Vercel Prod et Desktop Chrome.
- [x] Implémentation filtre de dates Dashboard et CRM Leads.
- [x] Importation de l'historique CSV des anciens leads.
- [x] Création des pages d'erreur unifiées (404, 401, Offline...) avec support FR/EN et numéro vert transparent lisible.
- [x] Configuration des balises Open Graph (`og:image`) et Twitter pour les aperçus WhatsApp & SEO avec `20250419_155833.webp`.
- [x] Ajout de la référence MVP Fluxo Finance (`fluxofinance.vercel.app`) avec visuel WebP optimisé.
- [x] Mise à jour du modèle d'IA vers `gemini-3.6-flash` et fiabilisation de l'Agent M84.
- [x] Résolution de l'URL 404 du CV et routing Vercel (`/moslihayoub-cv.pdf`).
- [x] Intégration du Spec-Driven Development (SDD) et du protocole QA dans le fichier SKILL.
- [x] Intégration Firebase Auth (Google Sign-In & Email/Mot de passe sécurisé) sur l'Admin.
- [x] Validation complète par suite de 10 tests automatisés E2E Playwright (10/10 réussis).
- [x] Vérification Build Vite & Oxlint.
- [x] Synchronisation GitHub & Déploiement Vercel Production.


