# 📌 État du Projet - Ayoub MOSLIH Portfolio

## 🚀 Présentation & Stack Technique
- **Nom du site** : Ayoub MOSLIH - Consultant en transformation digitale & AI / M84 Ops Client Portal
- **Dernière mise à jour** : 10 Novembre 2026 (Design System M84, Migration Supabase Réelle & Synchronisation Backoffice/Portal)
- **Stack** : React (Vite), Framer Motion, Vanilla CSS, Lucide React, Crypto-JS, Recharts, jsPDF, Supabase JS, Firebase.
- **PWA & Hosting** : PWA (Vite PWA Plugin) hébergé sur Vercel (`https://moslih84.vercel.app/` & `https://m84ops.vercel.app`).
- **Analytics** : Google Analytics 4 (`G-PTQB4BHQHW`), Google Tag Manager (`GTM-T5W5ZMS7`) & Microsoft Clarity (`xtiy932jnh`).
- **Tests** : Playwright E2E (17/17 tests validés à 100%), Oxlint, Vite Build.
- **Branche active & Git** : `feat/supabase-ds-sync` poussée sur origin. Production `main` préservée à 100%.

---

## 🛠️ Dernières Fonctionnalités & Optimisations Réalisées

### 1. 🎨 Bibliothèque « Design System M84 » (Architecture modulaire type shadcn)
- **Création du répertoire source [`src/design-system/`](file:///C:/Users/mosli/ant-projects/ANT2.0/1_engineering_apps/Ayoub%20MOSLIH%20-%20Portfolio/src/design-system/)** :
  - `tokens.css` : Définition des variables CSS unifiées `--m84-*` (Vert M84 `#006253`, Accent `#10b981`, Typo `Space Grotesk`, Radii 8/12/16/24px, Ombres, Status colors).
  - `Button.jsx` : Variantes (`primary`, `secondary`, `outline`, `ghost`, `danger`, `ai`), tailles, état de chargement et micro-interactions Framer Motion.
  - `StatCard.jsx` : Carte KPI haute performance pour le Backoffice et le Portail avec barres de progression et indicateurs de tendances.
  - `Card.jsx` : Composants modulaires `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
  - `Badge.jsx` : Variantes de statuts (`default`, `success`, `warning`, `danger`, `info`, `outline`, `ai`).
  - `Input.jsx`, `Textarea.jsx`, `Select.jsx` : Champs de formulaire normalisés avec focus rings `--m84-primary`.
  - `Modal.jsx` & `Drawer.jsx` : Modales et tiroirs fluides animés via Framer Motion avec capture de la touche Échap et gestion de backdrop.
  - `Table.jsx` : Tableaux modernes de données avec en-têtes stylisés, états vides et survol réactif.
  - `Tabs.jsx` : Onglets animés avec layoutId Framer Motion pour un slide fluide.
  - `Toast.jsx` : Toaster de notification statutaire auto-dismissible.
  - `Animations.js` : Presets d'animation Framer Motion réutilisables (`fadeIn`, `slideUp`, `scaleIn`, `drawerSlideUp`, `buttonTapMotion`, `cardHoverMotion`, `pulseGlowMotion`).
  - `index.js` : Export centralisé baril permettant les imports simples `import { Button, StatCard, Badge } from '../../design-system'`.
- **Showroom Interactif Backoffice ([`src/pages/Admin/DesignSystemM84.jsx`](file:///C:/Users/mosli/ant-projects/ANT2.0/1_engineering_apps/Ayoub%20MOSLIH%20-%20Portfolio/src/pages/Admin/DesignSystemM84.jsx))** :
  - Documentation vivante intégrée au Backoffice (`/admin/dashboard` onglet *Design System M84*).
  - 4 sous-onglets : Composants UI, Tokens & Couleurs, Animations & Effets (rejeu en direct), Gouvernance & Specs.
  - Couverture E2E dédiée dans [`tests/design-system.spec.js`](file:///C:/Users/mosli/ant-projects/ANT2.0/1_engineering_apps/Ayoub%20MOSLIH%20-%20Portfolio/tests/design-system.spec.js) validée.

### 2. 🗄️ Migration Supabase Réelle & Schéma SQL Relationnel (`scripts/setup_supabase.sql`)
- **Création et exécution effective des 8 tables M84 sur le projet Supabase Cloud (`ehevcsqgkrbeokprzzcp`)** :
  - `leads` : Collecte CRM et leads qualifiés du Chatbot M84.
  - `config` : Configuration du system prompt de l'Agent IA.
  - `missions` : Suivi contractuel des missions clients B2B (CAM, Devoteam, Ad'Missions).
  - `cras` : Relevés d'activité mensuels, jours imputés, visas et justificatifs.
  - `absences` : Justificatifs et motifs d'indisponibilité du consultant.
  - `mission_reports` : Comptes rendus hebdomadaires de mission (CR-01 à CR-04).
  - `portal_users` : Comptes collaborateurs avec identifiant sécurisé.
  - `projects` : Projets vitrine et confidentiels synchronisés.
- **Row Level Security (RLS) & Politiques d'accès** : RLS activée sur les 8 tables avec policies permissives adaptées aux accès portail / vitrine / admin.
- **Amorçage (Seed data)** : Données réelles CAM, comptes rendus S1 à S4, CRA Octobre 2026, prompt agent et projets injectés avec succès.

### 3. ⚙️ Câblage Supabase First & Alignement Backoffice / Portail
- **Service Client Portail (`src/services/clientPortalService.js`)** :
  - Refonte de `syncToSupabase` : Synchronisation complète et robuste des 5 entités (`missions`, `cras`, `absences`, `mission_reports`, `portal_users`).
  - Ajout de `pullLatestFromSupabase` : Récupération dynamique des missions depuis Supabase avec mise en cache locale transparente.
- **Backoffice Admin (`AdminDashboard.jsx`, `AdminLogin.jsx`, `AiConfigManager.jsx`, `ProjectsManager.jsx`)** :
  - `AdminDashboard.jsx` : Intégration de `StatCard` du Design System, récupération en temps réel des leads et missions Supabase, sidebar harmonisée en vert M84 `#006253` et fonte `Space Grotesk`.
  - `AdminLogin.jsx` : Refonte esthétique claire épurée avec les tokens M84 et suppression du dark theme disparate.
  - `AiConfigManager.jsx` : Sauvegarde et lecture directes sur la table Supabase `config` avec badges visuels M84.
  - `ProjectsManager.jsx` : Synchronisation bidirectionnelle avec la table Supabase `projects`.
- **Portail Client M84 (`PortalLayout.jsx`, `appMode.js`, `OfflineDetector.jsx`)** :
  - Normalisation typographique sur `var(--m84-font-family)` (`Space Grotesk`).
  - Correction de l'aiguillage de mode local : le mode vitrine reste par défaut sur `localhost` sans bloquer le routage vers `/portal` lorsque demandé.
  - Protection d'`OfflineDetector` contre les faux positifs réseau sous environnement de test/développement.

### 4. 🧪 Pyramide de Tests & Validation Locale
- **Oxlint** : 0 erreur de syntaxe.
- **Build Vite de production** : `built in 22.61s` (PWA 39 entries, 4527 KiB).
- **Suite Playwright E2E (16/16 tests validés - 100%)** :
  - 4 tests Admin (`tests/admin.spec.js` : 401, email non autorisé, Google sign-in, login valide).
  - 5 tests Portail Client B2B (`tests/portal.spec.js` : login Bank-e, dashboard KPIs, rapports compacts, kanban projets, timesheet & absences).
  - 5 tests E2E Portfolio (`tests/e2e/portfolio.spec.js` : hero, liens navigation, modale projet, chatbot widget, certificats PDF 200 OK).
  - 2 tests non-régression (`tests/portfolio.spec.js` : déchiffrement AES *The Factory*, `tests/e2e.spec.js` : galerie travaux).


### 1. 📊 Refonte Analytics, KPIs, Comptes Rendus & Vue Kanban Jira (`src/pages/Portal/`)
- **Dashboard Collaborateur (`PortalDashboard.jsx`)** :
  - **KPI 1 (Jours Imputés Mois)** : Suppression du texte « Week-ends & jours fériés non facturés », ajout d'une **barre de progression** dynamique du mois en cours avec calcul automatique des jours restants avant écoulement du mois.
  - **KPI 2 (Quota Consommé)** : Retiré définitivement selon la demande.
  - **KPI 2 (Statut Visa CRA Mois Précédents)** : Restreint exclusivement aux mois antérieurs (hors mois courant), affichant le total des CRA validés et en attente (`2 Validés`) avec badges par mois (Août 2026, Septembre 2026).
  - **KPI 3 (Projets de Mission)** : Intitulé passé de « Chantiers » à **« Projets de Mission »**, avec ventilation exhaustive des statuts via des pastilles concises : `Terminé`, `Livré`, `En cours`, `Stand-by`.
  - **Multi-Graphiques Analytiques (Recharts)** :
    1. *Bar Chart* : Rythme d'imputation mensuel (jours facturés TJM).
    2. *Multi-Bar Chart* : Jours travaillés vs jours ouvrés du mois.
    3. *Line Chart* : Vélocité hebdomadaire et jalons de livraison.
    4. *Donut / Pie Chart* : Ventilation de la charge par projet (%).
  - **Tableau des Comptes Rendus Hebdo** :
    - Titre raccourci à « Comptes Rendus Hebdo ».
    - Première colonne `ID` (`CR-04`, `CR-03`, `CR-02`, `CR-01`).
    - Colonne `Sujet` élargie avec troncature élégante à 2 lignes maximum avec `...`.
    - Wording court des statuts (`Livré`, `Validé`, `En cours`, `Terminé`, `Stand-by`).
- **Détail du Compte Rendu (`PortalReports.jsx`)** :
  - **Cartes listing gauche compactes** : Format 240px avec tags d'ID, date et titre court (pas de cartes larges).
  - **Suppression du Livrable joint** : Carte de téléchargement retirée du corps principal.
  - **Isolation des Observations Métier** : Section « Observations & Retours Métier » déportée en bas de page dans un bloc dédié, toujours incluse dans l'export PDF officiel.
  - **Suppression de la mention AI** : Retrait du badge « Formulation enrichie par l'IA ».
  - **Bouton Baguette Magique Rehausseur IA** : Intégration d'un bouton icône seule (`Wand2`) directement à l'intérieur du champ textarea (zéro texte superflu).
- **Projets & Vue Kanban Jira (`PortalProjects.jsx` & `PortalLayout.jsx`)** :
  - Intitulé du menu et titre de page unifiés sur **« Projets »**.
  - **Double vue au choix** : Bascule fluide entre **« Vue Tableau »** et **« Vue Kanban (Jira) »**.
  - **Tags projets 1 mot** : Préfixe court `[OCTROI]`, `[DESIGN]`, `[IA]`, `[TRÉSORERIE]`, `[AUDIT]`.
  - **Alignement UI strict** : En-têtes de blocs parfaitement alignés (Tag, Titre, Barre de progression, Statut), détails des tâches masqués par défaut et visibles uniquement à l'ouverture.
  - Colonnes Kanban Jira : `À faire`, `En cours`, `En revue / QA`, `Terminé / Livré`.

### 2. 🏦 Refonte UX & Co-Branding Portail Client Bank-e (Crédit Agricole du Maroc)
- **Résolution du Blocage Skeleton Localhost (`src/App.jsx`)** :
  - Passage en **chargement synchrone/eager** des composants du portail pour éliminer définitivement l'attente asynchrone `<Suspense fallback={<PageSkeleton />}>`.
  - Initialisation synchrone de la session et de la mission dès la déclaration du state dans `PortalLayout.jsx` (zéro délai de rendu).
  - Nettoyage automatique des anciens Service Workers PWA résiduels sur `localhost` dans `index.html`.
- **Isolation Stricte Multi-Domaines** :
  - Sur le domaine public de production (`moslih84.vercel.app`), l'accès aux routes `/portal` est verrouillé (mode portfolio pur).
  - L'Espace Client B2B est réservé exclusivement au domaine dédié Vercel (`m84ops.vercel.app` / variable `VITE_APP_MODE=portal`) et au mode test local (`localhost:5173/?mode=portal`).
- **Logo Officiel Bank-e** : Logo Bank-e épuré (`/assets/clients/bank-e.png`) affiché de manière autonome sans carte conteneur ni texte superflu en topbar.
- **Formulaire de Connexion Espace Client (`PortalLogin.jsx`)** :
  - Remplacement de l'intitulé « Email » par **« Identifiant »** (acceptant `collab.cam` ou le nom d'utilisateur sans forcer le domaine email).
  - Ajout du bouton d'affichage/masquage de mot de passe interactif avec icônes œil (`Eye` / `EyeOff`).
  - Suppression définitive du lien `[← Retour au Portfolio d'Ayoub MOSLIH]`.
- **Topbar & Navigation (`PortalLayout.jsx`)** :
  - Suppression du texte « Avatar - Profile », affichage direct de l'identité du collaborateur connecté.
  - **Sidebar rétractable avec bouton intégré** : Bascule Toolbar (76px) vs Sidebar (260px) intégrée directement en tête de la `<aside>`.
  - Suppression de la carte « Consultant Référent » de la barre latérale pour libérer l'espace visuel.
  - Fusion des entrées de menu : Timesheet et Absences unifiés dans un seul onglet `Timesheet & Activité`.
  - **Agent AI Flottant & Toaster Proactif** : Style aligné avec l'avatar portfolio (`m84-avatar.webp`), pastille verte en ligne et bulle proactive d'accueil avec fermeture `X`.
- **Dashboard Collaborateur (`PortalDashboard.jsx`)** :
  - **Hero Card épurée** : Suppression des bandeaux génériques « Espace Collaborateur » et « Karim Tazi », mise en avant directe de **Ayoub MOSLIH** (Product Designer & Solutions IA), des cabinets (**Devoteam Consulting** / **Ad'Missions Portage**) et des actions directes WhatsApp, Téléphone (+212 6 63 03 19 84) et Email.
  - **4 KPIs Métier B2B Pertinents** :
    1. *Jours Imputés (Mois)* : Calcul au TJM régie freelance (21.5j / 22j ouvrés, WE et fériés exclus).
    2. *Quota Consommé BDC* : 41.5j / 65j avec jauge de progression visuelle et jours restants.
    3. *Statut Visa CRA* : Validation en attente ou approuvé avec contrôle de pièce jointe.
    4. *Chantiers Actifs* : 3 chantiers majeurs Product Design, Design System & IA.
  - **Graphique Rythme d'Imputation** : BarChart pleine largeur en ligne unique.
  - **Tableau des Comptes Rendus Hebdomadaires** : 4 comptes rendus mensuels envoyés aux managers, avec date et statut d'envoi.
- **Détail du Compte Rendu (`PortalReports.jsx`)** :
  - Minimisation de la colonne des raccourcis à 250px et élargissement de la carte principale de détail.
  - Suppression du badge de sous-titre redondant avec la colonne de gauche.
  - Masquage des participants.
  - Deux menus déroulants d'actions : **Partager** (WhatsApp, Email manager, Copie lien) et **Exporter** (PDF officiel, Word, Google Docs).
  - Contenu adapté Product Design & IA.
- **Matrice des Projets & Tâches (`PortalProjects.jsx`)** :
  - 4 KPIs synthétiques et matrice détaillée par chantier avec priorité, livrable Figma et statut.
  - Sécurisation contre les états `null` sur chargement direct / deep-link.
- **Timesheet & Absences Unifiés (`PortalTimesheet.jsx`)** :
  - Unité simplifiée par jour (1j) ou demi-journée (0.5j), suppression du détail horaire.
  - Verrou de validation par Pièce Jointe obligatoire.

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

### 19. 🧪 Intégration Agent TestSprite & Automatisation Antigravity
- **Installation Skills Antigravity** : Intégration des compétences `.agents/skills/testsprite-verify` et `.agents/skills/testsprite-onboard` via `testsprite agent install --target antigravity`.
- **Configuration Projet TestSprite** : Création et liaison du projet `Ayoub MOSLIH Portfolio` (`d6258fed-716e-4b75-8b95-a546c869f1c8`) ciblant l'environnement déployé `https://moslih84.vercel.app/` via `.testsprite/config.json`.
- **Test E2E Cloud TestSprite** : Exécution d'un plan E2E autonome vérifiant le chargement de la page d'accueil et la navigation vers la galerie des projets. Verdict : **PASSED (6/6 étapes validées)** avec enregistrement vidéo disponible.
- **Règle de Déclenchement des Tests (Méthodologie)** : La suite de tests interne (Linter, Build, 11 tests E2E Playwright) reste la norme par défaut pour chaque développement. L'exécution des tests cloud TestSprite est déclenchée uniquement sur demande explicite de l'utilisateur.

### 20. Audit Complet & Correctifs (Certificats 404, Agent M84, Backoffice & Backend) (Nouveau)
- **Correctif 404 Certificats (`/about` & `/work`)** :
  - Ajout de `workbox: { navigateFallbackDenylist: [/^\/certif\//, /\.pdf$/i] }` dans `vite.config.js` pour empêcher le Service Worker PWA d'intercepter l'ouverture des PDF avec `index.html` (qui déclenchait la route React `<Error404 />`).
  - Exclusion explicite de `certif/`, `assets/` et `*.pdf` de la réécriture SPA dans `vercel.json`.
  - Encodage systématique `encodeURI(cert.url)` dans `About.jsx`, `Work.jsx` et `ChatWidget.jsx` pour gérer les espaces et caractères spéciaux (`&`).
- **Optimisation & Fiabilisation Agent IA (`firebaseAi.js` & `ChatWidget.jsx`)** :
  - Mise en cache mémoire (TTL 5 min + timeout 1.5s) du prompt Firestore `config/agent` avec invalidation instantanée (`invalidateAgentPromptCache`) depuis `AiConfigManager.jsx`.
  - Nettoyage de `VITE_GEMINI_API_KEY` et correction des ancres de redirection (`/about#services` et `/about#parcours` au lieu des ancres inexistantes `#expertise` et `#timeline`).
  - Libellés contextuels sur les mini-cartes du chat (`"Voir le certificat"` pour les certifications vs `"Voir le projet"`).
- **Synchronisation Backoffice & Sécurité Backend** :
  - Création du helper `getProjects()` dans `src/data/projects.js` lisant `m84_projects_mock` pour synchroniser les modifications CRUD de `ProjectsManager.jsx` avec le site public (`/work`) et la base de connaissances de l'Agent IA.
  - Amélioration du parseur Regex de l'historique de chat dans `CrmLeadsManager.jsx` (`/(Agent|Visiteur|Utilisateur)\s*:/gi`).
  - Réactivation du contrôle d'authentification `if (!context.auth)` sur la Cloud Function `getAnalyticsData` dans `functions/index.js`.
- **Tests E2E Playwright (11/11)** : Ajout d'un test automatisé vérifiant la validité et le statut HTTP `200 OK` (`application/pdf`) des certificats sur `/about`.

### 21. Correctif Critique Agent IA M84 (Résolution du "Pas de réponse") (Nouveau)
- **Cause Racine Identifiée** :
  - **Exception bloquante `ReferenceError: jaccardSimilarity is not defined`** dans [`src/utils/chatbotEngine.js`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/utils/chatbotEngine.js) : la fonction était appelée lors du scoring de mots-clés sans avoir été déclarée.
  - Lors d'une indisponibilité temporaire de l'API (HTTP 503 high demand spike sur `gemini-3.6-flash`) ou en mode local, le moteur basculait vers `findBestMatch`, qui levait cette exception non interceptée. Le `catch` de [`ChatWidget.jsx`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/components/ChatWidget.jsx) rappelait `findBestMatch`, provoquant un deuxième crash silencieux et laissant l'utilisateur sans aucune réponse dans l'interface ("pas de réponse").
- **Correctifs Appliqués** :
  - Implémentation complète de [`jaccardSimilarity(tokensA, tokensB)`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/utils/chatbotEngine.js) pour le calcul d'intersection/union des tokens.
  - Résilience multi-modèles dans [`src/utils/firebaseAi.js`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/utils/firebaseAi.js) : cascade automatique `gemini-3.6-flash` $\rightarrow$ `gemini-3-flash-preview` pour absorber les pics de charge (503/429) sans basculer prématurément en local.
  - Sécurisation du `catch` dans [`ChatWidget.jsx`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/components/ChatWidget.jsx) avec message de secours garanti et CTAs même en cas d'erreur inattendue.
- **Validation** : Build réussi, tests E2E Playwright (11/11) validés, et tests automatisés en conditions réelles (mode IA + mode fallback local simulé avec réseau coupé).

### 23. Refonte UX Switch Local & Moteur d'Auto-Apprentissage IA -> Local (Nouveau)
- **Suppression du Wording Anxiogène** :
  - Élimination définitive de l'en-tête *"⚙️ Un problème technique temporaire..."* dans le corps des bulles de chat.
  - Création d'un **Toaster / Bannière de transition ambrée/orange** ([`ChatWidget.jsx`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/components/ChatWidget.jsx)) discret, élégant et auto-dismissible (8s) avec wording positif : *« ⚡ Relais fluide : l'Agent Local prend le relais pour continuer votre consultation. »*.
- **Moteur d'Auto-Apprentissage Continu (Learning Automation IA $\rightarrow$ Local)** :
  - Intégration de [`recordLearnedKnowledge()`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/utils/chatbotEngine.js) et [`findLearnedKnowledgeMatch()`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/utils/chatbotEngine.js) : chaque réponse IA générée avec succès par Gemini est indexée en cache persistant local (`m84_learned_knowledge`).
  - L'Agent Local consulte ce cache dynamique en priorité absolue lors de futures questions similaires, garantissant des réponses de niveau IA même hors-ligne ou sous quota.
- **Enrichissement Connaissances & Secteurs d'Activités** :
  - Ajout de l'entrée `sectors_overview` dans [`src/data/chatbot_faq.json`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/data/chatbot_faq.json) et du mapping de synonymes (`secteur`, `activite`, `industrie`, `verticale`) dans [`src/utils/chatbotEngine.js`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/utils/chatbotEngine.js). Couvre les 6 secteurs clés d'Ayoub (Automotive/FinTech, Banque/Blockchain, OCP/Industrie, Smart Cities, HR Tech, Retail).

### 22. Déblocage Quota Gemini & Alignement FAQ Local (Nouveau)
- **Cause du Basculement vers l'Agent Local** :
  - `gemini-3.6-flash` en palier gratuit est bridé par Google à un quota strict de **20 requêtes par jour** (`HTTP 429: Resource Exhausted`).
- **Correctifs Appliqués** :
  - **Cascade IA prioritaire** dans [`src/utils/firebaseAi.js`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/utils/firebaseAi.js) : `gemini-3.1-flash-lite` $\rightarrow$ `gemini-3.5-flash-lite` $\rightarrow$ `gemini-3-flash-preview` $\rightarrow$ `gemini-3.6-flash`. Les modèles flash-lite disposent de quotas gratuits massifs (1500 requêtes/jour), d'une latence inférieure à 400ms et supportent le JSON structuré.
  - **Mise à niveau de [`src/data/chatbot_faq.json`](file:///Users/fahdrahali/Downloads/Ayoub%20MOSLIH%20-%20Portfolio/src/data/chatbot_faq.json)** :
    - Alignement de la présentation du profil sur la répartition détaillée (Product Design & IA ~7 ans, Direction Artistique ~7 ans, Motion Design ~5 ans).
    - Remplacement des cibles de redirection obsolètes `/about#expertise` par `/about#services`.

### 26. 🌐 Découplage Multi-Domaines Vercel & Routage Hybride M84 Ops (Nouveau)
- **Architecture Single Repo / Dual Deployment** :
  - **1 seul dépôt GitHub** partagé entre le Portfolio public et le Portail Client B2B.
  - Gestion du double domaine gratuit Vercel (`moslih84.vercel.app` & `m84ops.vercel.app`) sans duplication de code.
- **Aiguillage Conditionnel & Détection d'Hôte (`src/utils/appMode.js`)** :
  - Détection automatique du contexte via variable d'environnement Vercel `VITE_APP_MODE=portal` et filtrage de nom de domaine (`window.location.hostname.includes('m84ops')`).
  - Support de bascule instantanée sur `localhost` via paramètre URL (`?mode=portal` / `?mode=portfolio`) et persistance `localStorage`.
- **Routage Adaptatif (`src/App.jsx`)** :
  - Sur le domaine **M84 Ops** : la racine `/` redirige immédiatement vers `/portal` (et `/portal/login` si non authentifié). Le titre HTML s'ajuste dynamiquement en *"M84 Ops — Portail Collaborateur Client & CRA B2B"*.
  - Les éléments vitrine (Navbar publique, Footer public, Curseur magnétique 3D, ScrollSpy, CookieBanner) sont masqués pour offrir une application B2B épurée et sans distraction.
  - Sur le domaine **Portfolio** : maintien intégral de la vitrine, avec accès possible au portail et au backoffice.
  - Bouton interactif discret de test Dev en bas à gauche (`[Mode Portfolio ⇄ Mode M84 Ops]`) pour basculer en un clic sur `localhost` (exclu du bundle de prod).
- **Validation Build & Pyramide de Tests** :
  - **Oxlint** : 0 erreur.
  - **Build Vite de production** : validé en **7.01s** (49 chunks).
  - **Playwright E2E** : **11/11 tests validés avec succès (100%)**.

### 25. ⚡ Migration Hybride Supabase & Préparation M84 Ops (Nouveau)
- **Détection & Réactivation Supabase** :
  - Détection automatique du projet existant `moslihayoub's Project` (`ref: ehevcsqgkrbeokprzzcp`) via le token de management `SUPABASE_ACCESS_TOKEN`.
  - Réactivation réussie (`POST /restore`) depuis le statut `INACTIVE` vers `ACTIVE` sur la région `eu-central-1`.
- **Client & Fallback Zero-Downtime (`src/utils/supabaseClient.js`)** :
  - Installation du SDK `@supabase/supabase-js`.
  - Mise en place d'un client découplé avec détection de configuration (`isSupabaseConfigured`) garantissant un fallback 100% transparent vers Firebase et le stockage local en cas d'indisponibilité.
- **Migration & Schéma SQL Relationnel (`scripts/setup_supabase.mjs`)** :
  - Création des 7 tables avec Row Level Security (RLS) et politiques d'accès : `leads`, `config`, `missions`, `cras`, `absences`, `mission_reports`, `portal_users`.
  - Script d'amorçage autonome avec insertion des données réalistes CAM (Crédit Agricole du Maroc).
- **Câblage Multi-Briques de l'Application** :
  - **Auth Admin (`AdminLogin.jsx` & `AdminDashboard.jsx`)** : Intégration de Supabase Auth (Google OAuth & Email/Password) en cascade prioritaire avant le fallback Firebase et les identifiants locaux.
  - **CRM Leads (`CrmLeadsManager.jsx` & `ChatWidget.jsx`)** : Double injection automatique des prospects capturés dans Supabase `leads` et Firestore `leads`.
  - **Configuration IA (`AiConfigManager.jsx`)** : Lecture et persistance du system prompt de l'Agent M84 synchronisées dans Supabase `config`.
  - **Mini-SaaS M84 Ops (`clientPortalService.js`)** : Synchronisation en arrière-plan des missions B2B vers la table PostgreSQL Supabase `missions`.
- **Audit Smoke Test DevTools Navigateur (Niveau 4 SDD) (Nouveau)** :
  - **Exécution sous Google Chrome** : Scan automatisé des 4 vues clés (`/`, `/portal`, `/portal/login`, `/admin/login`) en double résolution Desktop (1440x900) et Mobile (375x812 iPhone X).
  - **Santé Console & Réseau** : **0 erreur console**, **0 échec réseau**, latence moyenne < 1s (800ms - 1100ms).
  - **Preuves Visuelles** : 8 captures d'écran générées et archivées dans `public/devtools-screenshots/`.
- **Validation Cloud TestSprite (`testsprite test run`) (Nouveau)** :
  - **Exécution Cloud Réussie** : Test exécuté via le CLI `@testsprite/testsprite-cli` sur l'environnement Vercel `https://moslih84.vercel.app/`.
  - **Run ID** : `33925036-0422-469e-9c80-1504e6dd3cf5` (Workspace `ayoub-moslihs-workspace-66fa818a`).
  - **Verdict** : **PASSED (4/4 étapes validées, 0 erreur)**.
  - **Dashboard & Vidéo** : Accessible en direct sur le [Dashboard TestSprite](https://www.testsprite.com/dashboard-v3/o/66fa818a-01d8-5677-a01a-25f257841269/projects/d6258fed-716e-4b75-8b95-a546c869f1c8/test-cases/a69290de-f4bc-4214-8689-064645a00a19).
  - **Linter Oxlint (`npm run lint`)** : 0 erreur de syntaxe ou d'import.
  - **Build Vite de production (`npm run build`)** : Validé en **3.98s** (49 chunks PWA générés).
  - **Suite E2E Playwright (`npx playwright test`)** : **11/11 tests validés avec succès (100%)** :
    1. Authentification & 401 Unauthorized (`admin.spec.js`)
    2. Protection email non autorisée (`admin.spec.js`)
    3. Bouton Google Sign-In actif (`admin.spec.js`)
    4. Connexion réussie credentials M84 (`admin.spec.js`)
    5. Chargement Hero & animations (`portfolio.spec.js`)
    6. Navigation & fluidité des liens (`portfolio.spec.js`)
    7. Modale projet dynamique (`portfolio.spec.js`)
    8. Chatbot Agent M84 (question/réponse) (`portfolio.spec.js`)
    9. Validité HTTP 200 des certificats PDF (`portfolio.spec.js`)
    10. Parcours galerie des travaux (`e2e.spec.js`)
    11. Déchiffrement AES projet restreint *The Factory* (`portfolio.spec.js`)
- **Architecture "Localhost First" & Découplage Supabase (`src/services/clientPortalService.js`)** :
  - Centralisation de la donnée (missions, CRA mensuels, absences, comptes rendus, utilisateurs) dans un stockage réactif persistant local, préfigurant les tables relationnelles Supabase.
  - Données d'amorçage réalistes pré-injectées pour validation immédiate : Mission CAM (Crédit Agricole du Maroc, Karim Tazi), intermédiaire Devoteam, portage Ad'Missions, 65 jours vendus en régie hybride.
- **Backoffice Consultant Ayoub (`src/pages/Admin/ClientMissionsManager.jsx`)** :
  - Nouvel onglet *"Missions Clients (CRA)"* dans [`AdminDashboard.jsx`](file:///C:/Users/Ayoub%20MOSLIH/ant-projects/ANT2.0/1_engineering_apps/Ayoub%20MOSLIH%20-%20Portfolio/src/pages/Admin/AdminDashboard.jsx).
  - **Formulaire de création de mission** :
    - *4 Champs Obligatoires stricts* : Nom de la société, Nom du responsable, Téléphone et Email (login client).
    - *Sections Optionnelles pliables en accordéon* : Cabinet Conseil/ESN, Société de Portage, Dates & quota de jours vendus, Modalités de travail (Régie/Forfait, Hybride/Remote/Présentiel), Horaires types (Matin, Aprèm, Pause déj $\rightarrow$ calcul auto 8h/j) et mot de passe personnalisé.
  - **Bannière d'accès direct** : Boutons 1-clic pour expédier les identifiants pré-formatés au client par WhatsApp ou Email.
  - **Imputation CRA & Gestion des Absences** : Modal de saisie des CRA avec attachement de PJ et déclaration d'absences justifiées avec pièces jointes.
  - **Simulateur 1-clic** : Bouton *"Simuler Espace Client"* pour ouvrir le portail collaborateur sans ressaisie d'identifiants.
- **Portail Collaborateur Client (`/portal`) — Fidélité Stricte au Wireframe** :
  - **Header Co-Brandé** : Logo Client (CAM) + Mention *"Mission Régie • Pilotage Ayoub MOSLIH"* + Avatar de profil avec menu déroulant (*"Mon profil"*, *"Se déconnecter"*).
  - **Sidebar de Navigation** :
    1. *Dashboard* : Jauge de consommation contractuelle (burndown chart Recharts), Jours imputés vs restants, Statut du CRA en cours, Absences déclarées et Fiche contact direct du consultant Ayoub (WhatsApp, Email).
    2. *Compte rendu* : Liste des CR, visualiseur détaillé (synthèse, décisions actées, prochaines actions), barre d'exportation (PDF officiel via `jspdf`, Word `.doc`, Google Docs, CSV, WhatsApp, Email).
    3. *Projets* : Suivi des chantiers (Octroi de crédit, Assistant IA, Dashboard Risques) avec jauges d'avancement (0-100%).
    4. *Timesheet* : Relevé d'activité mensuel, décompte des jours et heures, contenu détaillé, pièce jointe de validation (bon de commande/CRA signé), bouton client *"Approuver le CRA"* et historique des visas.
    5. *Absences* : Calendrier des indisponibilités justifiées du consultant avec motif textuel et téléchargement du justificatif (PJ).
- **Intelligence Artificielle M84 Scénarisée & Embarquée** :
  - **Rehaussement de Remarque ("Rehausser avec l'IA ✨")** : Sur les CRA et les Comptes Rendus, le collaborateur peut saisir une observation brute et cliquer sur l'IA pour la reformuler en une note de direction constructive, élégante et orientée action (via Gemini API ou fallback local).
  - **Widget Assistant IA Mission (Wireframe bulle "AI" flottante en bas à droite)** : Chatbot M84 strictement restreint aux données de la mission active (jours consommés, dates d'absences, décisions de copil, calendrier).
- **Page de Connexion Dédiée (`/portal/login`)** :
  - Authentification dédiée aux collaborateurs et bouton *"Connexion 1-Clic Démo CAM"* pour tester et valider le parcours instantanément en localhost.
- **Validation Build & Qualité** :
  - Build Vite de production validé (`✓ built in 9.12s`, 48 chunks PWA générés).
  - 0 erreur au linter Oxlint.

---

## 📋 Tâches / Prochaines Étapes
- [x] Mini-SaaS Portail Client & CRA B2B (Service unifié, Seed data CAM, Backoffice Admin et Portail Collaborateur).
- [x] Module Absences (Motif textuel + Pièce jointe justificative téléchargeable).
- [x] Module Timesheet (Détail des jours/heures, Contenu, PJ de validation, Approbation 1-clic).
- [x] Module Comptes Rendus & Exports (PDF, Word, GDoc, CSV, WhatsApp, Email).
- [x] Rehaussement des remarques par IA Gemini ("Rehausser avec l'IA ✨").
- [x] Widget Agent IA M84 contextuel à la mission (bulle flottante AI).
- [x] Formulaire création client simplifié (4 obligatoires : Société, Responsable, Tel, Email + accordéons optionnels).
- [x] Authentification Portail & Bouton Démo 1-clic CAM pour test localhost.
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
- [x] Validation complète par suite de 11 tests automatisés E2E Playwright (11/11 réussis).
- [x] Intégration de l'Agent TestSprite (`testsprite agent install --target antigravity`) et configuration du projet.
- [x] Exécution et validation du test cloud TestSprite sur `https://moslih84.vercel.app/` (Statut: PASSED).
- [x] Mise à jour de la méthodologie de test (Tests standards par défaut, TestSprite sur demande explicite).
- [x] Audit et correction 404 Certificats (`/about`), Cache/Ancres Agent IA, Sync Backoffice CRUD et Auth Backend.
- [x] Correction critique "Pas de réponse" Agent M84 (jaccardSimilarity + cascade multi-modèles Gemini).
- [x] Vérification Build Vite & Oxlint.
- [x] Synchronisation GitHub & Déploiement Vercel Production.



