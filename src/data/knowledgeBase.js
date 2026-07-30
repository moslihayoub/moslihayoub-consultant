import { projectsData } from './projects';
import { certificationsData } from './certifications';

export const knowledgeBase = {
  profile: {
    name: "Ayoub MOSLIH",
    role: "Consultant en Transformation Digitale & IA, Lead Product Designer",
    experienceYears: 19,
    breakdown: "10+ ans Digital, 7+ ans UX/UI, 2+ ans IA Générative (LLM & Agents)",
    location: "Casablanca, Maroc (Interventions sur site et en Remote : Afrique, Europe, Moyen-Orient)",
    cvUrl: "/cv-ayoub-moslih.pdf/moslihayoub-cv.pdf",
    whatsapp: "https://wa.me/212663585065",
    email: "moslihayoub@gmail.com",
    phone: "+212 6 63 58 50 65",
    linkedin: "https://www.linkedin.com/in/moslih84/",
    timeline: [
      {
        period: "2024 - Présent",
        role: "Consultant en Transformation Digitale & IA",
        context: "Missions en freelance / consulting",
        desc: "Accompagnement stratégique, audit technologique, prototypage SaaS, intégration IA (LLM, RAG) et automatisation des processus métiers."
      },
      {
        period: "2019 - 2023",
        role: "Lead UX/UI Designer & Senior Product Designer",
        context: "CGI, OCP SA, Crédit du Maroc, Wiggli",
        desc: "Pilotage de stratégies UX, conception de Design Systems complexes, recherche utilisateur et delivery B2B/B2C à forte valeur ajoutée."
      }
    ]
  },
  clients: [
    'Autocash.ma', 'CGI', 'OCP SA', 'Crédit du Maroc', 'Carrefour', 
    'Foodeals', 'ParcelIQ', 'eDrive.ma', 'Wiggli', 'Ville de Laval (Canada)', 'Agence Urbaine Larache'
  ],
  services: [
    {
      id: 'digital_transformation',
      title: { fr: 'Transformation Digitale & Stratégie', en: 'Digital Transformation & Strategy' },
      desc: { fr: 'Audit, accompagnement au changement et modèles économiques technologiques.', en: 'Audit, change management, and technology business models.' }
    },
    {
      id: 'ai_strategy',
      title: { fr: 'Stratégie IA, LLM & Prototypage Rapide', en: 'AI Strategy, LLMs & Rapid Prototyping' },
      desc: { fr: 'Automatisation des processus métiers, intégration RAG et agents IA.', en: 'Business process automation, RAG integration, and AI agents.' }
    },
    {
      id: 'product_ux',
      title: { fr: 'Product & UX Strategy', en: 'Product & UX Strategy' },
      desc: { fr: 'Discovery UX, recherche utilisateur, wireframing et ROI mesurable.', en: 'UX Discovery, user research, wireframing, and measurable ROI.' }
    },
    {
      id: 'design_systems',
      title: { fr: 'Design Systems & Scalabilité UI', en: 'Design Systems & UI Scalability' },
      desc: { fr: 'Industrialisation de la production digitale pour équipes agiles (React / Figma).', en: 'Digital production scaling for agile teams (React / Figma).' }
    }
  ],
  // Top 3 Certifications phares
  topCertifications: [
    {
      title: "Certification Anthropic Claude & LLM",
      issuer: "Anthropic",
      year: "2024",
      category: "IA",
      url: "/about#certifications"
    },
    {
      title: "Certificat Google UX Design",
      issuer: "Google",
      year: "2024",
      category: "UX/UI",
      url: "/about#certifications"
    },
    {
      title: "Certification IBM Generative AI & SkillUP",
      issuer: "IBM & SkillUP",
      year: "2024",
      category: "IA",
      url: "/about#certifications"
    }
  ],
  // Projets publics (Exclusion stricte des projets chiffrés / protégés par mot de passe)
  getPublicProjects: () => {
    return projectsData
      .filter(p => !p.isProtected)
      .map(p => ({
        id: p.id,
        title: p.title,
        client: p.client,
        category: p.category,
        year: p.year,
        shortDesc: p.shortDesc,
        image: p.image,
        url: p.url
      }));
  },
  cv_data: {
    skills: [
      "Intelligence artificielle (IA)", "Automation Audit UX/UI", "UX/UI & Heuristic Audits", "Design Systems",
      "Mobile-First Design (Figma)", "No-Code (Figma Make, Webflow)", "Architecture de solutions IA",
      "Prompt Engineering avancé", "Orchestration de workflows agentiques", "Project Management (Agile)", "Leadership d'équipe"
    ],
    experiences: [
      { title: "Product Designer / UX/UI", company: "AUTOCASH", dates: "avril 2024 - Present", desc: "AI & Digital Transformation: Architecture de l'écosystème 360° (Back-office, App Mobile Experts, Marketplace). UX Audit & Strategy. Process Automation." },
      { title: "Consultant UX/UI Designer", company: "JSEI CAPITAL MARKET", dates: "juillet 2023", desc: "App Mobile M-Commerce (YooDooGood). Audit heuristique, wireframes, Design System." },
      { title: "Consultant Digital designer", company: "HBM COMMUNICATION", dates: "février 2023", desc: "Transformation digitale, méthodes Sprint Design et Agile." },
      { title: "Consultant UX/UI Designer", company: "CGI", dates: "février 2022 - janvier 2023", desc: "Plateforme d’urbanisme Ville De Laval Canada. UX Research, stakeholders, wireframes, prototypes." },
      { title: "UX/UI Designer", company: "WIGGLI", dates: "avril 2021 - janvier 2022", desc: "UX Research plateforme ATS Wiggli.io. Design System, prototypes." },
      { title: "UX/UI Designer", company: "STIBITS", dates: "septembre 2020 - décembre 2020", desc: "App Stibits Wallet Blockchain. Design System, Atomic design." },
      { title: "Consultant UX/UI Designer", company: "OCP SA", dates: "novembre 2019 - avril 2020", desc: "UX Research Plateforme BIG DATA OCP. Tests d’utilisabilité." },
      { title: "Consultant UI Designer", company: "CREDIT DU MAROC", dates: "octobre 2019 - novembre 2019", desc: "UI Design intranet CDM. Design système Kit UI." },
      { title: "Directeur artistique", company: "TNC", dates: "2017 - 2019", desc: "Interfaces utilisateur, stratégie artistique, création vidéo 2D." },
      { title: "Graphiste / Teamleader", company: "FUTUR DIGITAL", dates: "2014 - 2017", desc: "UI pour SaaS, CRM, Web. Gestion de projets Agile." }
    ],
    certifications: [
      { title: "Claude Code in Action - CLI Automation & Software Debugging", issuer: "Anthropic" },
      { title: "Claude with the Anthropic API – Prompt Engineering, RAG", issuer: "Anthropic" },
      { title: "Google Prompting Essentials", issuer: "Google" },
      { title: "Gemini Certified Educator", issuer: "Google for Education" },
      { title: "Generative AI for Product Managers", issuer: "SkillUp" },
      { title: "Foundations of Project Management", issuer: "Google" }
    ]
  }
};
