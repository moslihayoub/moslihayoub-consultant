import { projectsData } from './projects';
import { certificationsData } from './certifications';

export const knowledgeBase = {
  profile: {
    name: "Ayoub MOSLIH",
    role: "Consultant en Transformation Digitale & IA, Lead Product Designer",
    experienceYears: 19,
    breakdown: "10+ ans Digital, 7+ ans UX/UI, 2+ ans IA Générative (LLM & Agents)",
    location: "Casablanca, Maroc (Interventions sur site et en Remote : Afrique, Europe, Moyen-Orient)",
    cvUrl: "/assets/Ayoub MOSLIH UX-UI.pdf",
    whatsapp: "https://wa.me/212663585065",
    email: "moslihayoub@gmail.com",
    phone: "+212 6 63 58 50 65",
    linkedin: "https://www.linkedin.com/in/moslih84/"
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
  }
};
