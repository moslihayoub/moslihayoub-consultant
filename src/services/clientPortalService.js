/**
 * Service de gestion de l'Espace Client & CRA (Portail Collaborateur / Missions)
 * Architecture "Localhost First" 100% découplée, prête pour migration Supabase.
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const STORAGE_KEY = 'm84_client_portal_data';
const SESSION_KEY = 'm84_portal_session';

// Consultant Profile Info (Ayoub MOSLIH)
export const CONSULTANT_PROFILE = {
  name: "Ayoub MOSLIH",
  role: "Consultant Senior en Transformation Digitale & IA",
  title: "Product Designer & Architecte Solutions IA",
  email: "moslihayoub@gmail.com",
  phone: "+212 6 63 03 19 84",
  whatsapp: "212663031984",
  location: "Casablanca, Maroc / Paris, France (Disponible Mobilité & Remote)",
  tjm: "Mode Régie Journalier",
  calendly: "https://calendly.com/ayoubmoslih",
  portfolioUrl: "https://moslih84.vercel.app",
  avatar: "/assets/galerie/20250419_155833.webp"
};

// Seed initial data for immediate frictionless testing
function getInitialData() {
  const camMissionId = 'mission-cam-2026';
  return {
    missions: [
      {
        id: camMissionId,
        // Mandatory fields
        companyName: "CAM (Crédit Agricole du Maroc)",
        managerName: "Karim Tazi",
        phone: "+212 6 61 23 45 67",
        email: "collab.cam@creditagricole.ma",
        // Optional fields
        cabinetConseil: {
          name: "Devoteam Consulting",
          manager: "Sarah Benjelloun",
          email: "s.benjelloun@devoteam.com",
          phone: "+212 5 22 11 22 33",
          logo: ""
        },
        cabinetPortage: {
          name: "Ad'Missions Portage",
          manager: "Marc Lambert",
          email: "gestion@admissions-portage.fr",
          phone: "+33 1 44 55 66 77",
          logo: ""
        },
        dateStart: "2026-09-01",
        dateEnd: "2026-12-31",
        totalDaysQuota: 65,
        workMode: "Régie",
        remoteMode: "Hybride (3j présentiel / 2j remote)",
        isFullTime: true,
        schedule: {
          morningStart: "09:00",
          morningEnd: "12:30",
          lunchBreakStart: "12:30",
          lunchBreakEnd: "13:30",
          afternoonStart: "13:30",
          afternoonEnd: "18:00",
          hoursPerDay: 8
        },
        logoUrl: "/assets/clients/bank-e.png",
        status: "active",
        createdAt: "2026-09-01T09:00:00Z"
      }
    ],
    users: [
      {
        id: 'user-cam-collab',
        username: "collab.cam",
        email: "collab.cam@creditagricole.ma",
        password: "CAM@2026", // Mot de passe par défaut
        companyName: "CAM (Crédit Agricole du Maroc)",
        managerName: "Karim Tazi",
        role: "collaborator",
        missionId: camMissionId,
        createdAt: "2026-09-01T09:00:00Z"
      }
    ],
    timesheets: [
      {
        id: 'ts-2026-10',
        missionId: camMissionId,
        month: "2026-10",
        monthLabel: "Octobre 2026",
        daysImputed: 21.5,
        totalWorkingDays: 22,
        totalHours: 172,
        status: "submitted", // draft | submitted | approved | rejected
        content: "Pilotage sprint 4 & 5 du portail digital, cadrage UX des parcours d'octroi de crédit, ateliers Design Sprint avec les équipes métier et intégration IA.",
        attachment: {
          name: "CRA_Octobre_2026_Signe_Consultant.pdf",
          size: "245 KB",
          uploadedAt: "2026-10-31T17:00:00Z",
          url: "#"
        },
        remarks: [
          {
            id: 'rem-ts-1',
            author: "Karim Tazi (CAM)",
            date: "2026-10-31T18:15:00Z",
            text: "CRA globalement conforme. Merci de confirmer la demi-journée du 14 octobre.",
            enhancedText: "Le relevé d'activité d'octobre est validé dans son ensemble. Nous sollicitons une simple confirmation d'émargement pour la demi-journée d'absence autorisée du 14 octobre avant visa définitif pour portage.",
            isAiEnhanced: true
          }
        ]
      },
      {
        id: 'ts-2026-09',
        missionId: camMissionId,
        month: "2026-09",
        monthLabel: "Septembre 2026",
        daysImputed: 20,
        totalWorkingDays: 20,
        totalHours: 160,
        status: "approved",
        content: "Cadrage initial de la mission, audit des flux bancaires existants, mise en place des rituels agiles et initialisation du backlog produit.",
        attachment: {
          name: "CRA_Septembre_2026_Valide.pdf",
          size: "188 KB",
          uploadedAt: "2026-09-30T16:30:00Z",
          url: "#"
        },
        remarks: []
      },
      {
        id: 'ts-2026-08',
        missionId: camMissionId,
        month: "2026-08",
        monthLabel: "Août 2026",
        daysImputed: 21,
        totalWorkingDays: 21,
        totalHours: 168,
        status: "approved",
        content: "Initialisation contractuelle et ateliers exploratoires préliminaires Bank-e.",
        attachment: {
          name: "CRA_Aout_2026_Valide.pdf",
          size: "175 KB",
          uploadedAt: "2026-08-31T17:00:00Z",
          url: "#"
        },
        remarks: []
      }
    ],
    absences: [
      {
        id: 'abs-1',
        missionId: camMissionId,
        type: "Congé exceptionnel",
        dateStart: "2026-10-14",
        dateEnd: "2026-10-14",
        durationDays: 0.5,
        status: "justifiée",
        content: "Participation et intervention en table ronde lors de la conférence FinTech & IA Casablanca.",
        attachment: {
          name: "Justificatif_Conference_Fintech.pdf",
          size: "142 KB",
          uploadedAt: "2026-10-10T11:00:00Z",
          url: "#"
        }
      }
    ],
    reports: [
      {
        id: 'rep-4',
        code: 'CR-04',
        status: 'Livré',
        missionId: camMissionId,
        weekNumber: 4,
        weekLabel: "Semaine 4",
        title: "S4 : Tests Utilisateurs en Agence & Spécifications Dev Handoff",
        date: "2026-10-28",
        project: "Design System & App Mobile Bank-e",
        attendees: ["Ayoub MOSLIH (Consultant)", "Karim Tazi (CAM)", "Sarah Benjelloun (Devoteam)"],
        summary: "Restitution des tests d'utilisabilité menés auprès de 18 clients en agence sur le prototype Bank-e v2.0. Taux de succès des tâches à 94%. Finalisation du fichier de spécifications Handoff Figma Tokens pour les développeurs React Native.",
        decisions: [
          "Validation finale de l'architecture des composants Design System sous Figma Tokens Studio.",
          "Arbitrage UX : simplification du sélecteur de compte et intégration du FaceID natif.",
          "Handoff officiel livré à l'équipe de dev Devoteam pour le sprint 6."
        ],
        nextSteps: [
          "Accompagnement QA Design lors de l'intégration front-end.",
          "Mise à jour de la documentation Storybook partagée.",
          "Préparation du cadrage Sprint 7 (module crédit express)."
        ],
        attachment: {
          name: "CR_Semaine4_Tests_Utilisateurs_Handoff.pdf",
          size: "2.4 MB",
          uploadedAt: "2026-10-28T16:00:00Z",
          url: "#"
        },
        remarks: [
          {
            id: 'rem-rep-4',
            author: "Karim Tazi (CAM)",
            date: "2026-10-29T10:00:00Z",
            text: "Très bon travail sur les retours agence. Prioriser le handoff pour le sprint dev.",
            enhancedText: "Excellente dynamique de livraison. Les enseignements des tests terrain confortent nos choix ergonomiques. Priorité absolue au handoff technique pour sécuriser le démarrage du sprint de dev.",
            isAiEnhanced: true
          }
        ]
      },
      {
        id: 'rep-3',
        code: 'CR-03',
        status: 'Validé',
        missionId: camMissionId,
        weekNumber: 3,
        weekLabel: "Semaine 3",
        title: "S3 : Prototypage Haute Fidélité, Micro-interactions & Assistant IA",
        date: "2026-10-21",
        project: "Assistant Virtuel IA & Navigation",
        attendees: ["Ayoub MOSLIH (Consultant)", "Équipe Métier Risques", "Équipe UX"],
        summary: "Conception du parcours conversationnel de l'Assistant IA Bank-e sous Figma. Définition des micro-interactions de saisie prédictive et des états de chargement génératif pour fluidifier l'attente utilisateur.",
        decisions: [
          "Adoption d'un tiroir modal adaptatif (BottomSheet) pour l'interface de chat IA.",
          "Validation des prompts d'accueil et des garde-fous éthiques / conformité bancaire."
        ],
        nextSteps: [
          "Prototype interactif cliquable pour la session de tests utilisateurs de la semaine 4.",
          "Alignement avec l'architecte IA sur les temps de réponse de l'API de streaming."
        ],
        attachment: {
          name: "CR_Semaine3_Prototypes_Figma_IA.pdf",
          size: "1.8 MB",
          uploadedAt: "2026-10-21T17:30:00Z",
          url: "#"
        },
        remarks: []
      },
      {
        id: 'rep-2',
        code: 'CR-02',
        status: 'Validé',
        missionId: camMissionId,
        weekNumber: 2,
        weekLabel: "Semaine 2",
        title: "S2 : Cadrage Design System, Tokens Figma & Parcours d'Octroi",
        date: "2026-10-14",
        project: "Refonte Expérience Octroi de Crédit",
        attendees: ["Ayoub MOSLIH (Consultant)", "Karim Tazi (CAM)", "Product Owners Métier"],
        summary: "Atelier de Design Sprint : refonte de bout en bout du parcours de simulation de crédit immobilier et consommation. Réduction du tunnel de souscription de 9 étapes à 4 étapes immersives avec estimation en temps réel.",
        decisions: [
          "Suppression de 5 champs de formulaire redondants avec l'authentification préalable.",
          "Mise en place d'une jauge interactive de mensualité avec calcul instantané."
        ],
        nextSteps: [
          "Déclinaison responsive mobile-first et tablette agence.",
          "Validation juridique des mentions légales dynamiques."
        ],
        attachment: {
          name: "CR_Semaine2_DesignSprint_Credit.pdf",
          size: "3.1 MB",
          uploadedAt: "2026-10-14T18:00:00Z",
          url: "#"
        },
        remarks: []
      },
      {
        id: 'rep-1',
        code: 'CR-01',
        status: 'Terminé',
        missionId: camMissionId,
        weekNumber: 1,
        weekLabel: "Semaine 1",
        title: "S1 : Audit UX Heuristique & Benchmark Apps Bancaires",
        date: "2026-10-07",
        project: "Audit Ergonomique Bank-e",
        attendees: ["Ayoub MOSLIH (Consultant)", "Direction Digitale CAM"],
        summary: "Audit ergonomique complet de l'application Bank-e existante basé sur les 10 critères heuristiques de Nielsen et les standards WCAG 2.1 AA. Benchmark concurrentiel international (Revolut, N26, Attijari Mobile, CIH Mobile).",
        decisions: [
          "Priorisation de 14 points de friction critiques identifiés sur le login et les virements.",
          "Création d'une bibliothèque de composants unifiée pour remplacer les styles disparates."
        ],
        nextSteps: [
          "Lancement de la phase de cadrage du Design System v2.0.",
          "Planification des ateliers de co-conception avec les équipes métier."
        ],
        attachment: {
          name: "CR_Semaine1_Audit_UX_Benchmark.pdf",
          size: "4.5 MB",
          uploadedAt: "2026-10-07T16:45:00Z",
          url: "#"
        },
        remarks: []
      }
    ],
    projects: [
      {
        id: 'proj-1',
        missionId: camMissionId,
        tag: "OCTROI",
        title: "Refonte Expérience Octroi de Crédit & Souscription",
        category: "Product Design & FinTech",
        status: "En cours",
        progress: 80,
        desc: "Parcours de souscription simplifié pour les particuliers et professionnels avec estimation temps réel et KYC instantané.",
        tasks: [
          { id: 't-101', title: "Audit UX & Heuristiques du tunnel existant", status: "Terminé", priority: "Haute", deliverable: "Rapport d'audit (32 pages)" },
          { id: 't-102', title: "Wireframes Low-Fi & Architecture de l'information", status: "Terminé", priority: "Haute", deliverable: "User flows Figma (12 écrans)" },
          { id: 't-103', title: "Prototypage Haute Fidélité & Jauges interactives", status: "En cours", priority: "Haute", deliverable: "Prototype cliquable Figma v2" },
          { id: 't-104', title: "Spécifications Handoff & Tokens pour dev React Native", status: "En cours", priority: "Moyenne", deliverable: "Guide de specs Handoff" },
          { id: 't-105', title: "Recette visuelle QA & tests de conformité WCAG 2.1", status: "À faire", priority: "Moyenne", deliverable: "Grille de conformité AA" }
        ]
      },
      {
        id: 'proj-2',
        missionId: camMissionId,
        tag: "DESIGN",
        title: "Design System Global Bank-e v2.0 & Tokens",
        category: "Design System & UI Ops",
        status: "Livré",
        progress: 100,
        desc: "Bibliothèque de composants UI cross-plateformes (Figma + Tokens Studio + Storybook) pour harmoniser les interfaces web & mobiles CAM.",
        tasks: [
          { id: 't-201', title: "Définition de la palette colorimétrique & typographies", status: "Terminé", priority: "Haute", deliverable: "Tokens fondamentaux JSON" },
          { id: 't-202', title: "Composants Atomiques (Buttons, Inputs, Cards, Modals)", status: "Terminé", priority: "Haute", deliverable: "Composants Figma 45 variants" },
          { id: 't-203', title: "Composants Molécules bancaires (Sélecteur compte, RIB)", status: "Terminé", priority: "Haute", deliverable: "Figma Library Auto-Layout" },
          { id: 't-204', title: "Documentation Storybook & guidelines d'accessibilité", status: "Terminé", priority: "Moyenne", deliverable: "Portail Storybook" }
        ]
      },
      {
        id: 'proj-3',
        missionId: camMissionId,
        tag: "IA",
        title: "Assistant IA Conversationnel & Pré-qualification",
        category: "IA Générative & RAG",
        status: "En cours",
        progress: 70,
        desc: "Agent virtuel intelligent intégré à l'application mobile pour guider les sociétaires, pré-remplir les demandes et répondre aux questions bancaires.",
        tasks: [
          { id: 't-301', title: "Parcours UX conversationnel & micro-copies", status: "Terminé", priority: "Haute", deliverable: "User Journey & Dialogue Tree" },
          { id: 't-302', title: "UI Chatbot adaptative (BottomSheet & Streaming text)", status: "Terminé", priority: "Haute", deliverable: "Composant UI interactif" },
          { id: 't-303', title: "Validation des garde-fous conformité & erreurs d'IA", status: "En cours", priority: "Haute", deliverable: "Guide de gestion des erreurs IA" },
          { id: 't-304', title: "Tests utilisateurs pilote (échantillon 50 sociétaires)", status: "À faire", priority: "Moyenne", deliverable: "Rapport de tests d'adoption" }
        ]
      },
      {
        id: 'proj-4',
        missionId: camMissionId,
        tag: "TRÉSORERIE",
        title: "Module Gestion de Trésorerie Pro & Virements",
        category: "Corporate Banking",
        status: "Stand-by",
        progress: 30,
        desc: "Cadrage préliminaire des virements internationaux de gros montants et validation multi-signataires.",
        tasks: [
          { id: 't-401', title: "Benchmarking sécurité bancaire SWIFT / ISO 20022", status: "Terminé", priority: "Moyenne", deliverable: "Matrice de comparaison" },
          { id: 't-402', title: "Wireframes circuit de signature multi-niveaux", status: "En cours", priority: "Haute", deliverable: "Workflow Figma" },
          { id: 't-403', title: "Atelier de cadrage juridique conformité change", status: "À faire", priority: "Haute", deliverable: "Compte rendu légal" }
        ]
      },
      {
        id: 'proj-5',
        missionId: camMissionId,
        tag: "AUDIT",
        title: "Audit Ergonomique & Benchmark Concurrentiel",
        category: "UX Research",
        status: "Terminé",
        progress: 100,
        desc: "Évaluation heuristique Nielsen et benchmark des applications bancaires leaders au Maroc et à l'international.",
        tasks: [
          { id: 't-501', title: "Audit heuristique 10 critères Nielsen sur Bank-e v1", status: "Terminé", priority: "Haute", deliverable: "Livre blanc audit UX (40p)" },
          { id: 't-502', title: "Benchmark concurrentiel Revolut, CIH, Attijari", status: "Terminé", priority: "Moyenne", deliverable: "Figma Benchmark board" }
        ]
      }
    ]
  };
}

// Low-level storage helpers
export function loadPortalData() {
  if (typeof window === 'undefined') return getInitialData();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = getInitialData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(raw);
    // Auto-upgrade legacy cache
    let needsSave = false;
    if (parsed.missions?.[0] && (!parsed.missions[0].logoUrl || parsed.missions[0].logoUrl.includes('placeholder'))) {
      parsed.missions[0].logoUrl = "/assets/clients/bank-e.png";
      needsSave = true;
    }
    if (parsed.users?.[0] && !parsed.users[0].username) {
      parsed.users[0].username = "collab.cam";
      needsSave = true;
    }
    if (parsed.projects?.[0] && !parsed.projects[0].tasks) {
      parsed.projects = getInitialData().projects;
      needsSave = true;
    }
    if (!parsed.reports || parsed.reports.length < 4 || !parsed.reports[0].weekNumber) {
      parsed.reports = getInitialData().reports;
      needsSave = true;
    }
    if (needsSave) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error("Erreur de lecture portal data, fallback seed :", e);
    return getInitialData();
  }
}

export function savePortalData(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Synchronisation asynchrone bidirectionnelle vers Supabase
  syncToSupabase(data).catch((err) => console.warn("Supabase background sync notice:", err?.message || err));
}

export async function syncToSupabase(data) {
  if (!isSupabaseConfigured || !supabase || !data) return;
  try {
    // 1. Missions
    if (data.missions?.length) {
      for (const m of data.missions) {
        await supabase.from('missions').upsert({
          id: m.id,
          company_name: m.companyName || '',
          manager_name: m.managerName || '',
          phone: m.phone || '',
          email: m.email || '',
          cabinet_conseil: m.cabinetConseil || {},
          cabinet_portage: m.cabinetPortage || {},
          date_start: m.dateStart || null,
          date_end: m.dateEnd || null,
          total_days_quota: m.totalDaysQuota || 65,
          work_mode: m.workMode || 'Régie',
          remote_mode: m.remoteMode || 'Hybride',
          schedule: m.schedule || {},
          logo_url: m.logoUrl || '',
          status: m.status || 'active'
        }).catch(() => {});
      }
    }

    // 2. CRAs / Timesheets
    if (data.timesheets?.length) {
      for (const ts of data.timesheets) {
        await supabase.from('cras').upsert({
          id: ts.id,
          mission_id: ts.missionId,
          month: ts.month,
          month_label: ts.monthLabel || '',
          days_imputed: ts.daysImputed || 0,
          total_working_days: ts.totalWorkingDays || 22,
          total_hours: ts.totalHours || 172,
          status: ts.status || 'submitted',
          content: ts.content || '',
          attachment: ts.attachment || {},
          remarks: ts.remarks || []
        }).catch(() => {});
      }
    }

    // 3. Absences
    if (data.absences?.length) {
      for (const abs of data.absences) {
        await supabase.from('absences').upsert({
          id: abs.id,
          mission_id: abs.missionId,
          type: abs.type || 'Congé',
          date_start: abs.dateStart,
          date_end: abs.dateEnd,
          duration_days: abs.durationDays || 1,
          status: abs.status || 'justifiée',
          content: abs.content || '',
          attachment: abs.attachment || {}
        }).catch(() => {});
      }
    }

    // 4. Mission Reports
    if (data.reports?.length) {
      for (const rep of data.reports) {
        await supabase.from('mission_reports').upsert({
          id: rep.id,
          code: rep.code || 'CR',
          status: rep.status || 'Livré',
          mission_id: rep.missionId,
          week_number: rep.weekNumber || 1,
          week_label: rep.weekLabel || '',
          title: rep.title || '',
          date: rep.date || null,
          project: rep.project || '',
          attendees: rep.attendees || [],
          summary: rep.summary || '',
          decisions: rep.decisions || [],
          next_steps: rep.nextSteps || [],
          attachment: rep.attachment || {},
          remarks: rep.remarks || []
        }).catch(() => {});
      }
    }

    // 5. Portal Users
    if (data.users?.length) {
      for (const u of data.users) {
        await supabase.from('portal_users').upsert({
          id: u.id,
          username: u.username || u.email,
          email: u.email,
          password: u.password || 'CAM@2026',
          company_name: u.companyName || '',
          manager_name: u.managerName || '',
          role: u.role || 'collaborator',
          mission_id: u.missionId || null
        }).catch(() => {});
      }
    }
  } catch (e) {
    console.warn("Erreur globale sync Supabase :", e);
  }
}

/**
 * Charge les données depuis Supabase si connecté, avec mise en cache locale transparente
 */
export async function pullLatestFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data: missions } = await supabase.from('missions').select('*');
    if (missions && missions.length > 0) {
      const current = loadPortalData();
      const updated = {
        ...current,
        missions: missions.map(m => ({
          id: m.id,
          companyName: m.company_name,
          managerName: m.manager_name,
          phone: m.phone,
          email: m.email,
          cabinetConseil: m.cabinet_conseil,
          cabinetPortage: m.cabinet_portage,
          dateStart: m.date_start,
          dateEnd: m.date_end,
          totalDaysQuota: Number(m.total_days_quota),
          workMode: m.work_mode,
          remoteMode: m.remote_mode,
          schedule: m.schedule,
          logoUrl: m.logo_url,
          status: m.status,
          createdAt: m.created_at
        }))
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
  } catch (err) {
    console.warn("Pull Supabase skipped:", err);
  }
  return null;
}

// -------------------------------------------------------------
// Missions CRUD
// -------------------------------------------------------------
export function getAllMissions() {
  const data = loadPortalData();
  return data.missions || [];
}

export function getMissionById(id) {
  const missions = getAllMissions();
  return missions.find(m => m.id === id) || null;
}

export function createMission(missionPayload) {
  const data = loadPortalData();
  const missionId = `mission-${Date.now()}`;
  
  // Calculate total hours per day if times provided
  const schedule = missionPayload.schedule || {
    morningStart: "09:00",
    morningEnd: "12:30",
    lunchBreakStart: "12:30",
    lunchBreakEnd: "13:30",
    afternoonStart: "13:30",
    afternoonEnd: "18:00",
    hoursPerDay: 8
  };

  const newMission = {
    id: missionId,
    // Obligatoires
    companyName: missionPayload.companyName?.trim() || "Entreprise Cliente",
    managerName: missionPayload.managerName?.trim() || "Responsable",
    phone: missionPayload.phone?.trim() || "",
    email: missionPayload.email?.trim().toLowerCase() || "",
    // Optionnels
    cabinetConseil: missionPayload.cabinetConseil || { name: "", manager: "", email: "", phone: "", logo: "" },
    cabinetPortage: missionPayload.cabinetPortage || { name: "", manager: "", email: "", phone: "", logo: "" },
    dateStart: missionPayload.dateStart || "",
    dateEnd: missionPayload.dateEnd || "",
    totalDaysQuota: Number(missionPayload.totalDaysQuota) || 60,
    workMode: missionPayload.workMode || "Régie",
    remoteMode: missionPayload.remoteMode || "Hybride",
    isFullTime: missionPayload.isFullTime !== undefined ? missionPayload.isFullTime : true,
    schedule,
    logoUrl: missionPayload.logoUrl || "",
    status: "active",
    createdAt: new Date().toISOString()
  };

  data.missions.unshift(newMission);

  // Auto-create or link collaborator account
  const rawPassword = missionPayload.collaboratorPassword || `${newMission.companyName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}@${new Date().getFullYear()}`;
  const newUser = {
    id: `user-${Date.now()}`,
    email: newMission.email,
    password: rawPassword,
    companyName: newMission.companyName,
    managerName: newMission.managerName,
    role: "collaborator",
    missionId: newMission.id,
    createdAt: new Date().toISOString()
  };

  // Upsert user by email
  const existingUserIdx = (data.users || []).findIndex(u => u.email === newMission.email);
  if (existingUserIdx >= 0) {
    data.users[existingUserIdx] = { ...data.users[existingUserIdx], ...newUser };
  } else {
    data.users = data.users || [];
    data.users.push(newUser);
  }

  savePortalData(data);
  return { mission: newMission, user: newUser, generatedPassword: rawPassword };
}

export function updateMission(id, updates) {
  const data = loadPortalData();
  const index = data.missions.findIndex(m => m.id === id);
  if (index >= 0) {
    data.missions[index] = { ...data.missions[index], ...updates, updatedAt: new Date().toISOString() };
    savePortalData(data);
    return data.missions[index];
  }
  return null;
}

export function deleteMission(id) {
  const data = loadPortalData();
  data.missions = data.missions.filter(m => m.id !== id);
  data.timesheets = data.timesheets.filter(t => t.missionId !== id);
  data.absences = data.absences.filter(a => a.missionId !== id);
  data.reports = data.reports.filter(r => r.missionId !== id);
  data.projects = data.projects.filter(p => p.missionId !== id);
  data.users = data.users.filter(u => u.missionId !== id);
  savePortalData(data);
  return true;
}

// -------------------------------------------------------------
// Timesheets / CRA Management
// -------------------------------------------------------------
export function getTimesheetsByMission(missionId) {
  const data = loadPortalData();
  return (data.timesheets || []).filter(t => t.missionId === missionId);
}

export function saveTimesheet(missionId, timesheetData) {
  const data = loadPortalData();
  const tsId = timesheetData.id || `ts-${Date.now()}`;
  const existingIdx = data.timesheets.findIndex(t => t.id === tsId);

  const entry = {
    id: tsId,
    missionId,
    month: timesheetData.month || new Date().toISOString().slice(0, 7),
    monthLabel: timesheetData.monthLabel || timesheetData.month,
    daysImputed: Number(timesheetData.daysImputed) || 0,
    totalWorkingDays: Number(timesheetData.totalWorkingDays) || 22,
    totalHours: Number(timesheetData.totalHours) || 0,
    status: timesheetData.status || "submitted",
    content: timesheetData.content || "",
    attachment: timesheetData.attachment || null,
    remarks: timesheetData.remarks || [],
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    data.timesheets[existingIdx] = entry;
  } else {
    data.timesheets.unshift(entry);
  }

  savePortalData(data);
  return entry;
}

export function updateTimesheetStatus(missionId, timesheetId, newStatus) {
  const data = loadPortalData();
  const ts = data.timesheets.find(t => t.id === timesheetId && t.missionId === missionId);
  if (ts) {
    ts.status = newStatus;
    ts.updatedAt = new Date().toISOString();
    savePortalData(data);
    return ts;
  }
  return null;
}

export function addTimesheetRemark(missionId, timesheetId, rawText, enhancedText = "") {
  const data = loadPortalData();
  const ts = data.timesheets.find(t => t.id === timesheetId && t.missionId === missionId);
  if (!ts) return null;

  const session = getPortalSession();
  const author = session?.managerName ? `${session.managerName} (${session.companyName})` : "Collaborateur Client";

  const newRemark = {
    id: `rem-ts-${Date.now()}`,
    author,
    date: new Date().toISOString(),
    text: rawText,
    enhancedText: enhancedText || rawText,
    isAiEnhanced: !!enhancedText && enhancedText !== rawText
  };

  ts.remarks = ts.remarks || [];
  ts.remarks.push(newRemark);
  savePortalData(data);
  return newRemark;
}

// -------------------------------------------------------------
// Absences Management
// -------------------------------------------------------------
export function getAbsencesByMission(missionId) {
  const data = loadPortalData();
  return (data.absences || []).filter(a => a.missionId === missionId);
}

export function saveAbsence(missionId, absencePayload) {
  const data = loadPortalData();
  const absenceId = absencePayload.id || `abs-${Date.now()}`;
  const existingIdx = data.absences.findIndex(a => a.id === absenceId);

  const entry = {
    id: absenceId,
    missionId,
    type: absencePayload.type || "Congé",
    dateStart: absencePayload.dateStart || new Date().toISOString().slice(0, 10),
    dateEnd: absencePayload.dateEnd || absencePayload.dateStart,
    durationDays: Number(absencePayload.durationDays) || 1,
    status: absencePayload.status || "justifiée",
    content: absencePayload.content || "",
    attachment: absencePayload.attachment || null, // { name, size, type, dataUrl }
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    data.absences[existingIdx] = entry;
  } else {
    data.absences.unshift(entry);
  }

  savePortalData(data);
  return entry;
}

export function deleteAbsence(missionId, absenceId) {
  const data = loadPortalData();
  data.absences = data.absences.filter(a => !(a.id === absenceId && a.missionId === missionId));
  savePortalData(data);
  return true;
}

// -------------------------------------------------------------
// Comptes Rendus (Reports) Management
// -------------------------------------------------------------
export function getReportsByMission(missionId) {
  const data = loadPortalData();
  return (data.reports || []).filter(r => r.missionId === missionId);
}

export function saveReport(missionId, reportPayload) {
  const data = loadPortalData();
  const reportId = reportPayload.id || `rep-${Date.now()}`;
  const existingIdx = data.reports.findIndex(r => r.id === reportId);

  const entry = {
    id: reportId,
    missionId,
    title: reportPayload.title?.trim() || "Compte Rendu de Suivi",
    date: reportPayload.date || new Date().toISOString().slice(0, 10),
    project: reportPayload.project || "Général",
    attendees: Array.isArray(reportPayload.attendees) ? reportPayload.attendees : [reportPayload.attendees || CONSULTANT_PROFILE.name],
    summary: reportPayload.summary || "",
    decisions: Array.isArray(reportPayload.decisions) ? reportPayload.decisions : [],
    nextSteps: Array.isArray(reportPayload.nextSteps) ? reportPayload.nextSteps : [],
    attachment: reportPayload.attachment || null,
    remarks: reportPayload.remarks || [],
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    data.reports[existingIdx] = entry;
  } else {
    data.reports.unshift(entry);
  }

  savePortalData(data);
  return entry;
}

export function deleteReport(missionId, reportId) {
  const data = loadPortalData();
  data.reports = data.reports.filter(r => !(r.id === reportId && r.missionId === missionId));
  savePortalData(data);
  return true;
}

export function addReportRemark(missionId, reportId, rawText, enhancedText = "") {
  const data = loadPortalData();
  const report = data.reports.find(r => r.id === reportId && r.missionId === missionId);
  if (!report) return null;

  const session = getPortalSession();
  const author = session?.managerName ? `${session.managerName} (${session.companyName})` : "Collaborateur Client";

  const newRemark = {
    id: `rem-rep-${Date.now()}`,
    author,
    date: new Date().toISOString(),
    text: rawText,
    enhancedText: enhancedText || rawText,
    isAiEnhanced: !!enhancedText && enhancedText !== rawText
  };

  report.remarks = report.remarks || [];
  report.remarks.push(newRemark);
  savePortalData(data);
  return newRemark;
}

// -------------------------------------------------------------
// Projects Management (Scoped to Mission)
// -------------------------------------------------------------
export function getProjectsByMission(missionId) {
  const data = loadPortalData();
  return (data.projects || []).filter(p => p.missionId === missionId);
}

// -------------------------------------------------------------
// Authentication & Session (Collaborator Portal)
// -------------------------------------------------------------
export function portalLogin(identifier, password) {
  const data = loadPortalData();
  const cleanId = (identifier || '').trim().toLowerCase();
  const user = (data.users || []).find(u => {
    const username = (u.username || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const emailPrefix = email.split('@')[0];
    const matchId = cleanId === username || cleanId === email || cleanId === emailPrefix;
    return matchId && u.password === password;
  });

  if (!user) {
    throw new Error("Identifiant ou mot de passe incorrect. (Ex: collab.cam / CAM@2026)");
  }

  const mission = (data.missions || []).find(m => m.id === user.missionId);

  const session = {
    id: user.id,
    username: user.username || cleanId,
    email: user.email,
    companyName: user.companyName,
    managerName: user.managerName,
    role: user.role || "collaborator",
    missionId: user.missionId,
    logoUrl: mission?.logoUrl || "/assets/clients/bank-e.png",
    loginAt: new Date().toISOString()
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function portalLogout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function getPortalSession() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Fast Dev Switch (to test CAM immediately without typing)
export function devLoginAsCollaborator(missionId = 'mission-cam-2026') {
  const data = loadPortalData();
  const mission = data.missions.find(m => m.id === missionId) || data.missions[0];
  const user = data.users.find(u => u.missionId === mission?.id) || data.users[0];

  const session = {
    id: user?.id || 'dev-collab',
    username: user?.username || 'collab.cam',
    email: user?.email || mission?.email || 'collab.cam@creditagricole.ma',
    companyName: mission?.companyName || 'CAM',
    managerName: mission?.managerName || 'Karim Tazi',
    role: 'collaborator',
    missionId: mission?.id || 'mission-cam-2026',
    logoUrl: mission?.logoUrl || '/assets/clients/bank-e.png',
    loginAt: new Date().toISOString()
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

// -------------------------------------------------------------
// AI Engine : Remark Enhancer & Scoped Mission Assistant
// -------------------------------------------------------------
const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_KEY = (rawApiKey && rawApiKey !== 'your_gemini_api_key') ? rawApiKey.trim() : '';

/**
 * Rehausse la remarque brute du collaborateur avec Gemini pour lui donner
 * une formulation professionnelle, constructive et orientée décision.
 */
export async function enhanceRemarkWithAi(rawRemark, contextType = "compte_rendu") {
  if (!rawRemark || !rawRemark.trim()) return rawRemark;

  const fallbackEnhance = (text) => {
    // Intelligent local fallback
    const trimmed = text.trim();
    if (trimmed.length < 10) return `${trimmed} — Validé sous réserve de finalisation convenue.`;
    return `Remarque client : « ${trimmed} » — Formulation consolidée : Nous confirmons la bonne prise en compte de ces éléments et sollicitons l'alignement sur ce point lors du prochain point d'étape.`;
  };

  if (!GEMINI_API_KEY) {
    return fallbackEnhance(rawRemark);
  }

  const prompt = `Tu es un expert en communication de direction et en pilotage de projets IT / consulting.
Un client / collaborateur a rédigé la remarque brute suivante concernant un ${contextType === 'timesheet' ? 'relevé d\'activité (CRA / Timesheet)' : 'compte rendu de réunion'} :
"${rawRemark}"

TÂCHE :
Reformule et rehausse cette remarque pour lui donner une tonalité :
1. Ultra-professionnelle, élégante, constructive et bienveillante.
2. Claire, orientée décision et plan d'action.
3. Synthétique (2 à 3 phrases maximum).
4. Sans formule creuse d'introduction. Renvoie UNIQUEMENT le texte reformulé direct.`;

  try {
    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.6-flash'];
    for (const model of candidateModels) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate && candidate.trim()) {
          return candidate.trim();
        }
      }
    }
    return fallbackEnhance(rawRemark);
  } catch (err) {
    console.warn("Erreur AI Enhance, utilisation fallback local :", err);
    return fallbackEnhance(rawRemark);
  }
}

/**
 * Assistant IA M84 dédié et strictement cloîtré aux données de la mission en cours
 */
export async function queryMissionAi(missionId, userQuestion, history = []) {
  const mission = getMissionById(missionId);
  const timesheets = getTimesheetsByMission(missionId);
  const absences = getAbsencesByMission(missionId);
  const reports = getReportsByMission(missionId);
  const projects = getProjectsByMission(missionId);

  // Calculate mission metrics
  const totalDaysQuota = mission?.totalDaysQuota || 60;
  const daysConsumed = timesheets.reduce((acc, t) => acc + (t.daysImputed || 0), 0);
  const daysRemaining = Math.max(0, totalDaysQuota - daysConsumed);

  const contextData = `
INFORMATIONS SUR LA MISSION :
- Client : ${mission?.companyName}
- Responsable Client : ${mission?.managerName} (${mission?.email}, ${mission?.phone})
- Cabinet de Conseil Intermédiaire : ${mission?.cabinetConseil?.name || 'Non spécifié'} (Contact: ${mission?.cabinetConseil?.manager || 'N/A'})
- Société de Portage Salarial : ${mission?.cabinetPortage?.name || 'Non spécifié'}
- Consultant Référent : Ayoub MOSLIH (Tél: +212 6 63 03 19 84, Email: moslihayoub@gmail.com)
- Mode d'intervention : ${mission?.workMode} (${mission?.remoteMode})
- Forfait total de jours vendus : ${totalDaysQuota} jours
- Jours déjà consommés/imputés : ${daysConsumed} jours
- Jours restants sur le contrat : ${daysRemaining} jours

HISTORIQUE DES CRA / TIMESHEETS :
${timesheets.map(t => `- Mois: ${t.monthLabel} | Jours imputés: ${t.daysImputed}j | Statut: ${t.status} | Livrables: ${t.content}`).join('\n')}

ABSENCES & CONGÉS DU CONSULTANT :
${absences.map(a => `- Du ${a.dateStart} au ${a.dateEnd} (${a.durationDays}j) | Motif: ${a.content} | Statut: ${a.status}`).join('\n')}

COMPTES RENDUS DE SUIVI & RÉUNIONS :
${reports.map(r => `- [${r.date}] ${r.title} : ${r.summary} | Décisions: ${r.decisions.join(' ; ')}`).join('\n')}

PROJETS & CHANTIERS EN COURS :
${projects.map(p => `- ${p.title} (${p.category}) : ${p.desc} [Avancement: ${p.progress}%]`).join('\n')}
`;

  const systemInstruction = `Tu es l'Agent M84 dédié à l'Espace Collaborateur Client d'Ayoub MOSLIH.
Tu t'adresses directement au client ou à son équipe (${mission?.companyName}).
Ton objectif est de répondre avec clarté, rigueur et concision aux questions sur l'avancement des projets, les CRA, les absences d'Ayoub, le calendrier et les décisions d'étape.

RÈGLES STRICTES :
1. Réponds UNIQUEMENT sur la base du contexte fourni ci-dessus. N'invente aucun projet ni chiffre hors contexte.
2. Si une question est hors sujet (météo, code externe, etc.), rappelle poliment que tu es dédié au pilotage de cette mission pour ${mission?.companyName}.
3. Ton style : Professionnel, orienté produit/livrable, synthétique (moins de 70 mots par réponse).
4. Si le client souhaite planifier un point d'étape ou joindre Ayoub, propose directement ses coordonnées directes (WhatsApp: +212 6 63 03 19 84 ou email: moslihayoub@gmail.com).`;

  if (!GEMINI_API_KEY) {
    // Intelligent local response
    const qLower = userQuestion.toLowerCase();
    if (qLower.includes('cra') || qLower.includes('timesheet') || qLower.includes('heure') || qLower.includes('jour')) {
      return `À ce jour, ${daysConsumed} jours ont été imputés sur le quota contractuel de ${totalDaysQuota} jours (reste ${daysRemaining} jours). Le dernier CRA du mois de ${timesheets[0]?.monthLabel || 'en cours'} est au statut « ${timesheets[0]?.status} ».`;
    }
    if (qLower.includes('absence') || qLower.includes('conge') || qLower.includes('dispo')) {
      return absences.length > 0
        ? `Ayoub a déclaré ${absences.length} absence(s) justifiée(s) : du ${absences[0].dateStart} au ${absences[0].dateEnd} (${absences[0].durationDays}j - ${absences[0].content}). Toutes les pièces justificatives sont consultables dans l'onglet Absences.`
        : "Aucune absence n'est actuellement déclarée pour cette période. Ayoub est à 100% disponible selon le rythme convenu.";
    }
    if (qLower.includes('compte rendu') || qLower.includes('cr') || qLower.includes('decision') || qLower.includes('reunion')) {
      return `Le dernier compte rendu publié date du ${reports[0]?.date} : « ${reports[0]?.title} ». Vous pouvez le consulter, exporter en PDF/Word ou y apposer vos remarques directement dans l'onglet Compte rendu.`;
    }
    return `Je suis l'Agent M84 dédié à votre mission avec Ayoub MOSLIH. Vous avez ${daysRemaining} jours restants sur votre contrat. Je peux vous renseigner sur les comptes rendus, les timesheets, les livrables ou les absences.`;
  }

  try {
    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.6-flash'];
    const contents = [
      { role: 'user', parts: [{ text: `${systemInstruction}\n\nCONTEXTE :\n${contextData}\n\nQuestion du client : ${userQuestion}` }] }
    ];

    for (const model of candidateModels) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return text.trim();
        }
      }
    }
    return `Je suis l'assistant dédié à votre mission avec Ayoub MOSLIH. Jours imputés : ${daysConsumed}/${totalDaysQuota} jours. N'hésitez pas à consulter les onglets ou à contacter Ayoub au +212 6 63 03 19 84.`;
  } catch (err) {
    console.error("Erreur Mission AI :", err);
    return `Jours consommés : ${daysConsumed}/${totalDaysQuota}j. Le dernier CRA est au statut « ${timesheets[0]?.status || 'en cours'} ». Pour joindre directement Ayoub : +212 6 63 03 19 84.`;
  }
}

// -------------------------------------------------------------
// Exports & Share System (PDF, DOCX, CSV, GDoc, WhatsApp, Email)
// -------------------------------------------------------------
export function exportReportToPdf(report, mission) {
  const doc = new jsPDF();
  const primaryColor = [0, 98, 83]; // M84 Emerald Green #006253

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("COMPTE RENDU DE SUIVI DE MISSION", 14, 16);

  // Subtitle & Client details
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Mission : ${mission?.companyName || 'Client'}`, 14, 34);
  doc.text(`Consultant : ${CONSULTANT_PROFILE.name} (${CONSULTANT_PROFILE.role})`, 14, 40);
  doc.text(`Date du compte rendu : ${report.date}`, 14, 46);
  doc.text(`Projet rattaché : ${report.project || 'Général'}`, 14, 52);

  // Attendees
  doc.setFont("helvetica", "bold");
  doc.text("Participants :", 14, 62);
  doc.setFont("helvetica", "normal");
  doc.text((report.attendees || []).join(', '), 42, 62);

  // Summary Table / Box
  autoTable(doc, {
    startY: 70,
    head: [['Section', 'Détails']],
    body: [
      ['Titre', report.title],
      ['Synthèse & Contexte', report.summary],
      ['Décisions Actées', (report.decisions || []).map((d, i) => `${i + 1}. ${d}`).join('\n')],
      ['Prochaines Actions', (report.nextSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')]
    ],
    headStyles: { fillColor: primaryColor, textColor: 255 },
    styles: { cellPadding: 4, fontSize: 9 }
  });

  // Remarks if any
  let currentY = doc.lastAutoTable.finalY + 12;
  if (report.remarks && report.remarks.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Remarques & Observations du Collaborateur :", 14, currentY);
    currentY += 6;
    report.remarks.forEach(rem => {
      doc.setFont("helvetica", "italic");
      doc.text(`• ${rem.author} (${rem.date.slice(0, 10)}) :`, 14, currentY);
      currentY += 5;
      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(rem.enhancedText || rem.text, 180);
      doc.text(splitText, 18, currentY);
      currentY += splitText.length * 5 + 4;
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Document officiel généré via le Portail Collaborateur Ayoub MOSLIH - ${new Date().toLocaleDateString('fr-FR')}`, 14, 285);

  doc.save(`CR_${(report.title || 'Mission').replace(/[^a-zA-Z0-9]/g, '_')}_${report.date}.pdf`);
}

export function exportTimesheetToPdf(timesheet, mission) {
  const doc = new jsPDF();
  const primaryColor = [0, 98, 83];

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("RELEVÉ D'ACTIVITÉ MENSUEL (CRA)", 14, 16);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Client Donneur d'Ordre : ${mission?.companyName || 'Client'}`, 14, 34);
  doc.text(`Cabinet de Conseil : ${mission?.cabinetConseil?.name || 'N/A'}`, 14, 40);
  doc.text(`Société de Portage : ${mission?.cabinetPortage?.name || 'N/A'}`, 14, 46);
  doc.text(`Consultant : ${CONSULTANT_PROFILE.name}`, 14, 52);

  autoTable(doc, {
    startY: 60,
    head: [['Période', 'Jours Ouvrés', 'Jours Imputés', 'Total Heures', 'Statut Validation']],
    body: [
      [
        timesheet.monthLabel || timesheet.month,
        `${timesheet.totalWorkingDays} jours`,
        `${timesheet.daysImputed} jours`,
        `${timesheet.totalHours} heures`,
        timesheet.status === 'approved' ? 'VALIDÉ' : (timesheet.status === 'submitted' ? 'SOUMIS' : 'BROUILLON')
      ]
    ],
    headStyles: { fillColor: primaryColor, textColor: 255 },
    styles: { cellPadding: 5, fontSize: 10, halign: 'center' }
  });

  let currentY = doc.lastAutoTable.finalY + 12;
  doc.setFont("helvetica", "bold");
  doc.text("Détail des Activités & Livrables Réalisés :", 14, currentY);
  currentY += 8;
  doc.setFont("helvetica", "normal");
  const splitContent = doc.splitTextToSize(timesheet.content || "Prestation de conseil et réalisation des livrables selon le plan de charge.", 180);
  doc.text(splitContent, 14, currentY);
  currentY += splitContent.length * 6 + 10;

  // Signatures blocks
  doc.setDrawColor(200, 200, 200);
  doc.rect(14, currentY, 85, 35);
  doc.rect(110, currentY, 85, 35);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Visa & Signature Consultant :", 18, currentY + 8);
  doc.text("Visa & Signature Client / Portage :", 114, currentY + 8);
  doc.setFont("helvetica", "normal");
  doc.text(`Ayoub MOSLIH (Signé le ${timesheet.month}-28)`, 18, currentY + 28);
  doc.text(`${mission?.managerName || 'Responsable'} (${timesheet.status === 'approved' ? 'Approuvé' : 'En attente'})`, 114, currentY + 28);

  doc.save(`CRA_${(mission?.companyName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}_${timesheet.month}.pdf`);
}

export function exportReportToDocx(report, mission) {
  // Generate HTML formatted content that MS Word opens natively as .doc / .docx
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${report.title}</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; line-height: 1.6; color: #333; margin: 40px; }
      h1 { color: #006253; border-bottom: 2px solid #006253; padding-bottom: 8px; }
      h2 { color: #2c3e50; margin-top: 24px; }
      .meta { background: #f4f6f8; padding: 16px; border-left: 4px solid #006253; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      th { background-color: #006253; color: white; }
    </style>
    </head>
    <body>
      <h1>COMPTE RENDU DE SUIVI : ${report.title}</h1>
      <div class="meta">
        <p><strong>Mission :</strong> ${mission?.companyName} | <strong>Date :</strong> ${report.date}</p>
        <p><strong>Consultant :</strong> ${CONSULTANT_PROFILE.name} (${CONSULTANT_PROFILE.role})</p>
        <p><strong>Participants :</strong> ${(report.attendees || []).join(', ')}</p>
      </div>
      <h2>1. Synthèse de la séance</h2>
      <p>${report.summary}</p>
      <h2>2. Décisions Actées</h2>
      <ul>
        ${(report.decisions || []).map(d => `<li>${d}</li>`).join('')}
      </ul>
      <h2>3. Prochaines Étapes</h2>
      <ul>
        ${(report.nextSteps || []).map(s => `<li>${s}</li>`).join('')}
      </ul>
      ${report.remarks?.length ? `
        <h2>4. Observations & Remarques</h2>
        ${report.remarks.map(r => `<p><strong>${r.author} :</strong> ${r.enhancedText || r.text}</p>`).join('')}
      ` : ''}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CR_${(report.title || 'Mission').replace(/[^a-zA-Z0-9]/g, '_')}_${report.date}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportTimesheetToCsv(timesheet, mission) {
  const headers = ["Mois", "Client", "Consultant", "Jours Imputes", "Jours Ouvrés", "Total Heures", "Statut", "Activites"];
  const row = [
    timesheet.monthLabel || timesheet.month,
    mission?.companyName || "Client",
    CONSULTANT_PROFILE.name,
    timesheet.daysImputed,
    timesheet.totalWorkingDays,
    timesheet.totalHours,
    timesheet.status,
    `"${(timesheet.content || '').replace(/"/g, '""')}"`
  ];

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), row.join(',')].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `CRA_${(mission?.companyName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}_${timesheet.month}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function openGoogleDocExport(report, mission) {
  // Opens Google Docs with prefilled formatted content or clipboard copy
  const textSummary = `COMPTE RENDU : ${report.title} (${report.date})\nClient : ${mission?.companyName}\nConsultant : ${CONSULTANT_PROFILE.name}\n\nSYNTHÈSE :\n${report.summary}\n\nDÉCISIONS :\n${(report.decisions || []).map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nPROCHAINES ACTIONS :\n${(report.nextSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
  
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(textSummary);
  }
  // Open blank Google Doc in new tab
  window.open('https://docs.google.com/document/create', '_blank');
}

export function formatWhatsAppShare(reportOrTs, mission, type = 'report') {
  let message = "";
  if (type === 'timesheet') {
    message = `Bonjour ${mission?.managerName || ''},
Voici le relevé d'activité (CRA) pour ${reportOrTs.monthLabel || reportOrTs.month} de la mission *${mission?.companyName}*.
Jours imputés : *${reportOrTs.daysImputed} jours* (${reportOrTs.totalHours}h).
Statut : *${reportOrTs.status === 'approved' ? 'Validé' : 'En attente de validation'}*.
Consultable directement sur votre espace client : ${window.location.origin}/portal/timesheet
Bien cordialement,
Ayoub MOSLIH`;
  } else {
    message = `Bonjour ${mission?.managerName || ''},
Voici le compte rendu *"${reportOrTs.title}"* (${reportOrTs.date}) pour la mission *${mission?.companyName}*.
Synthèse : ${reportOrTs.summary}
Consultable avec export et remarques sur votre espace dédié : ${window.location.origin}/portal/reports
Bien cordialement,
Ayoub MOSLIH`;
  }

  const phone = (mission?.phone || '').replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function formatEmailShare(reportOrTs, mission, type = 'report') {
  const recipient = mission?.email || '';
  let subject = "";
  let body = "";

  if (type === 'timesheet') {
    subject = `[CRA] Relevé d'activité ${reportOrTs.monthLabel || reportOrTs.month} - ${mission?.companyName}`;
    body = `Bonjour ${mission?.managerName},\n\nVeuillez trouver ci-joint le relevé d'activité pour le mois de ${reportOrTs.monthLabel || reportOrTs.month}.\nJours imputés : ${reportOrTs.daysImputed} jours (${reportOrTs.totalHours}h).\n\nVous pouvez valider ce CRA ou ajouter vos remarques directement depuis votre espace client :\n${window.location.origin}/portal/timesheet\n\nRestant à votre entière disposition.\n\nBien cordialement,\nAyoub MOSLIH\nConsultant en Transformation Digitale & IA`;
  } else {
    subject = `[Compte Rendu] ${reportOrTs.title} - ${mission?.companyName}`;
    body = `Bonjour ${mission?.managerName},\n\nVeuillez trouver ci-joint le compte rendu de notre séance du ${reportOrTs.date} : "${reportOrTs.title}".\n\nSynthèse :\n${reportOrTs.summary}\n\nVous pouvez consulter le document complet, l'exporter ou y ajouter vos observations ici :\n${window.location.origin}/portal/reports\n\nBien cordialement,\nAyoub MOSLIH\nConsultant en Transformation Digitale & IA`;
  }

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
