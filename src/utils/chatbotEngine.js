import faqData from '../data/chatbot_faq.json';
import { projectsData } from '../data/projects';
import { certificationsData } from '../data/certifications';

const STOP_WORDS = new Set([
  'le', 'la', 'les', 'du', 'de', 'des', 'un', 'une', 'et', 'en', 'au', 'aux',
  'est', 'je', 'tu', 'il', 'nous', 'vous', 'ils', 'a', 'ce', 'cet', 'cette',
  'sur', 'pour', 'dans', 'par', 'avec', 'sans', 'mon', 'ma', 'mes', 'ton', 'ta',
  'tes', 'son', 'sa', 'ses', 'nos', 'vos', 'leurs', 'the', 'a', 'an', 'and', 'or',
  'to', 'in', 'on', 'is', 'of', 'for', 'with', 'by', 'at', 'from', 'as', 'it',
  'qui', 'que', 'quoi', 'donne', 'moi', 'me', 'montre', 'voir'
]);

const OFF_TOPIC_KEYWORDS = new Set([
  'météo', 'meteo', 'recette', 'cuisine', 'manger', 'pizza', 'blague', 'raconte',
  'humour', 'football', 'foot', 'film', 'cinema', 'chanson', 'musique', 'politique',
  'president', 'bourse', 'crypto', 'bitcoin', 'blagues', 'recettes', 'weather'
]);

const SYNONYM_MAP = {
  // Contact & Lead
  'tarif': 'contact', 'tarifs': 'contact', 'prix': 'contact', 'devis': 'contact', 'combien': 'contact',
  'cout': 'contact', 'couts': 'contact', 'tjm': 'contact', 'facture': 'contact',
  'taman': 'contact', 'thaman': 'contact', 'bchhal': 'contact', 'bch7al': 'contact', 'chehal': 'contact',
  'contact': 'contact', 'contacter': 'contact', 'email': 'contact', 'mail': 'contact',
  'telephone': 'contact', 'phone': 'contact', 'whatsapp': 'contact', 'linkedin': 'contact',
  'rdv': 'contact', 'joindre': 'contact', 'appel': 'contact', 'rappeler': 'contact', 'collaboration': 'contact',
  'consultation': 'contact', 'discuter': 'contact',

  // Projects & Categories
  'projet': 'projets', 'projets': 'projets', 'realisation': 'projets', 'realisations': 'projets',
  'portfolio': 'projets', 'saas': 'projets', 'app': 'projets', 'application': 'projets',
  'machoari3': 'projets', 'mashari3': 'projets', 'mchari3': 'projets', 'a3mal': 'projets',
  'motion': 'motion', 'graphics': 'motion', 'graphic': 'motion', 'animation': 'motion', 'video': 'motion',
  'ux': 'uxui', 'ui': 'uxui', 'figma': 'uxui', 'design': 'uxui',

  // Services
  'service': 'services', 'services': 'services', 'prestation': 'services', 'prestations': 'services',
  'expertise': 'services', 'expertises': 'services', 'offre': 'services', 'offres': 'services',
  'khadamat': 'services', 'khedma': 'services', 'chkatdir': 'services', 'katdir': 'services',

  // CV & Timeline
  'cv': 'cv', 'curriculum': 'cv', 'resume': 'cv',
  'parcours': 'timeline', 'carriere': 'timeline', 'timeline': 'timeline', 'experience': 'timeline',
  'experiences': 'timeline', 'tajriba': 'timeline', 'khibra': 'timeline', 'khdam': 'timeline',

  // Certifications
  'certification': 'certifications', 'certifications': 'certifications', 'certif': 'certifications',
  'certifs': 'certifications', 'diplome': 'certifications', 'diplomes': 'certifications', 'formation': 'certifications',

  // Bio
  'ayoub': 'specialite', 'moslih': 'specialite', 'bio': 'specialite', 'profil': 'specialite', 'qui': 'specialite',
  'chkon': 'specialite', 'chkun': 'specialite'
};

export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
}

function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
  for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function tokenizeAndMap(text) {
  const normalized = normalizeText(text);
  const rawTokens = normalized.split(/\s+/).filter(Boolean);
  const synonymKeys = Object.keys(SYNONYM_MAP);
  
  const tokens = [];
  for (const token of rawTokens) {
    if (token.length > 1 && (!STOP_WORDS.has(token) || rawTokens.length <= 2)) {
      let mapped = token;
      if (SYNONYM_MAP[token]) {
        mapped = SYNONYM_MAP[token];
      } else {
        for (const key of synonymKeys) {
          const distance = levenshteinDistance(token, key);
          const threshold = key.length >= 6 ? 2 : 1; 
          if (distance <= threshold && Math.abs(token.length - key.length) <= threshold) {
            mapped = SYNONYM_MAP[key];
            break;
          }
        }
      }
      tokens.push(mapped);
    }
  }
  return tokens;
}

function getProjectsForQuery(normQuery, currentLang) {
  const isMotion = normQuery.includes('motion') || normQuery.includes('animation') || normQuery.includes('video') || normQuery.includes('graphic');
  const isUxUi = normQuery.includes('ux') || normQuery.includes('ui') || normQuery.includes('figma') || normQuery.includes('web') || normQuery.includes('design');
  const isAiMvp = normQuery.includes('ai') || normQuery.includes('ia') || normQuery.includes('mvp') || normQuery.includes('llm') || normQuery.includes('saas');
  const isFilmmaking = normQuery.includes('film') || normQuery.includes('movie') || normQuery.includes('2d') || normQuery.includes('serie');

  const publicProjects = projectsData.filter(p => !p.isProtected);
  let matchedProjects = [];
  let categoryLabel = "";

  if (isMotion) {
    matchedProjects = publicProjects.filter(p => p.category === 'Motion Graphics');
    categoryLabel = "Motion Graphics";
  } else if (isUxUi) {
    matchedProjects = publicProjects.filter(p => p.category === 'UX/UI');
    categoryLabel = "UX/UI Design";
  } else if (isAiMvp) {
    matchedProjects = publicProjects.filter(p => p.category === 'MVP Ai');
    categoryLabel = "MVP AI & SaaS";
  } else if (isFilmmaking) {
    matchedProjects = publicProjects.filter(p => p.category === 'AI Filmmaking');
    categoryLabel = "AI Filmmaking";
  }

  if (!matchedProjects.length) {
    matchedProjects = publicProjects.slice(0, 3);
    categoryLabel = currentLang === 'en' ? 'recent' : 'récents';
  } else {
    matchedProjects = matchedProjects.slice(0, 3);
  }

  const cards = matchedProjects.map(p => ({
    title: p.title || '',
    subtitle: `${p.category} • ${p.client}`,
    desc: (typeof p.shortDesc === 'object' ? (p.shortDesc[currentLang] || p.shortDesc.fr) : p.shortDesc) || '',
    image: p.image || '',
    url: (p.url && p.url.startsWith('http')) ? p.url : `/project/${p.id}`,
    type: 'project'
  }));

  const introText = currentLang === 'en'
    ? `Here are Ayoub's **${categoryLabel}** projects:`
    : `Voici les projets **${categoryLabel}** réalisés par Ayoub :`;

  return {
    matched: true,
    text: introText,
    cards,
    ctas: [
      { text: currentLang === 'en' ? 'See all projects' : 'Voir plus de projets', action: 'navigate', target: '/work' }
    ],
    intent: 'projets',
    category: 'local_agent'
  };
}

function getCertificationsForQuery(normQuery, currentLang) {
  const isIa = normQuery.includes('ia') || normQuery.includes('ai') || normQuery.includes('anthropic') || normQuery.includes('ibm') || normQuery.includes('llm');
  const isUxUi = normQuery.includes('ux') || normQuery.includes('ui') || normQuery.includes('google') || normQuery.includes('domestika') || normQuery.includes('webflow');
  const isDesignMotion = normQuery.includes('motion') || normQuery.includes('udemy') || normQuery.includes('design');

  let matchedCerts = [];
  let categoryLabel = "";

  if (isIa) {
    matchedCerts = certificationsData.filter(c => c.category === 'IA' || (c.issuer && (c.issuer.toLowerCase().includes('anthropic') || c.issuer.toLowerCase().includes('ibm'))));
    categoryLabel = "IA & LLM";
  } else if (isUxUi) {
    matchedCerts = certificationsData.filter(c => c.category === 'UX/UI' || (c.issuer && (c.issuer.toLowerCase().includes('google') || c.issuer.toLowerCase().includes('domestika'))));
    categoryLabel = "UX/UI Design";
  } else if (isDesignMotion) {
    matchedCerts = certificationsData.filter(c => c.category === 'Design & Motion' || (c.issuer && c.issuer.toLowerCase().includes('udemy')));
    categoryLabel = "Design & Motion";
  }

  if (!matchedCerts.length) {
    matchedCerts = certificationsData.slice(0, 3);
    categoryLabel = currentLang === 'en' ? 'international' : 'internationales';
  } else {
    matchedCerts = matchedCerts.slice(0, 3);
  }

  const cards = matchedCerts.map(c => ({
    title: c.title || '',
    subtitle: c.issuer || '',
    desc: `Certificat ${c.year} - ${c.category}`,
    url: '/about#certifications',
    type: 'certif'
  }));

  const introText = currentLang === 'en'
    ? `Here are Ayoub's **${categoryLabel}** certifications:`
    : `Voici les certifications **${categoryLabel}** d'Ayoub :`;

  return {
    matched: true,
    text: introText,
    cards,
    ctas: [
      { text: currentLang === 'en' ? 'View all certifications' : 'Voir toutes les certifications', action: 'navigate', target: '/about#certifications' }
    ],
    intent: 'certifications',
    category: 'local_agent'
  };
}

export function findBestMatch(userQuery, lang = 'fr') {
  const currentLang = (lang && lang.toLowerCase().startsWith('en')) ? 'en' : 'fr';
  const normQuery = normalizeText(userQuery);

  if (userQuery === "Laissez vos coordonnées" || userQuery === "Leave your details" || userQuery === "Laisser vos coordonnées") {
    return {
      matched: true,
      action: "START_LEAD_CAPTURE",
      category: "lead_trigger"
    };
  }

  if (!userQuery || !userQuery.trim()) {
    return buildFallbackResponse(currentLang);
  }

  // 1. Détection Hors-Sujet
  const words = normQuery.split(/\s+/);
  for (const w of words) {
    if (OFF_TOPIC_KEYWORDS.has(w)) {
      return {
        matched: true,
        text: currentLang === 'en'
          ? "I am Agent M84, dedicated solely to Ayoub MOSLIH's portfolio and services. How can I guide you regarding his projects or expertise?"
          : "Je suis l'Agent M84, dédié uniquement au portfolio et aux services d'Ayoub MOSLIH. Comment puis-je vous guider concernant ses projets ou expertises ?",
        ctas: [
          { text: currentLang === 'en' ? "View Services" : "Voir ses services", action: "navigate", target: "/about#expertise" },
          { text: currentLang === 'en' ? "View Projects" : "Voir ses projets", action: "navigate", target: "/work" }
        ],
        intent: "offtopic",
        category: "local_agent"
      };
    }
  }

  // 2. Détection dynamique pour les SERVICES (ex: "les services d'ayoub", "quels sont tes services")
  if (normQuery.includes('service') || normQuery.includes('services') || normQuery.includes('prestation') || normQuery.includes('khadamat')) {
    const serviceEntry = faqData.entries.find(e => e.id === 'services_overview');
    if (serviceEntry) {
      const ctas = (serviceEntry.ctas || []).map(cta => ({
        text: typeof cta.text === 'object' ? (cta.text[currentLang] || cta.text.fr) : cta.text,
        action: cta.action,
        target: cta.target
      }));
      return {
        matched: true,
        score: 0.99,
        text: serviceEntry.answer[currentLang] || serviceEntry.answer.fr,
        ctas,
        cards: [],
        intent: 'services',
        category: 'local_agent'
      };
    }
  }

  // 3. Détection dynamique pour les PROJETS
  const isProjectQuery = normQuery.includes('projet') || normQuery.includes('projets') || normQuery.includes('realisation') || normQuery.includes('work') || normQuery.includes('portfolio') || normQuery.includes('saas') || normQuery.includes('motion') || normQuery.includes('graphic');
  if (isProjectQuery) {
    return getProjectsForQuery(normQuery, currentLang);
  }

  // 4. Détection dynamique pour les CERTIFICATIONS
  const isCertifQuery = normQuery.includes('certif') || normQuery.includes('diplome') || normQuery.includes('formation');
  if (isCertifQuery) {
    return getCertificationsForQuery(normQuery, currentLang);
  }

  // 5. Matching général de la FAQ avec calcul du score sur TOUTES les entrées
  const queryTokens = tokenizeAndMap(userQuery);
  let bestEntry = null;
  let highestScore = 0;

  for (const entry of faqData.entries) {
    let score = 0;
    const normQList = (entry.questions || []).map(normalizeText);

    for (const nq of normQList) {
      if (normQuery === nq || normQuery.includes(nq) || nq.includes(normQuery)) {
        score = 0.95;
        break;
      }
    }

    if (score === 0) {
      const entryKeywords = (entry.keywords || []).map(normalizeText);
      const keywordScore = jaccardSimilarity(queryTokens, entryKeywords);
      const intentMatch = (entry.intent && queryTokens.includes(entry.intent)) ? 0.4 : 0;
      score = (keywordScore * 0.6) + intentMatch;
    }

    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  const THRESHOLD = 0.20;

  if (bestEntry && highestScore >= THRESHOLD) {
    const ctas = (bestEntry.ctas || []).map(cta => ({
      text: typeof cta.text === 'object' ? (cta.text[currentLang] || cta.text.fr) : cta.text,
      action: cta.action,
      target: cta.target
    }));

    return {
      matched: true,
      score: highestScore,
      text: bestEntry.answer[currentLang] || bestEntry.answer.fr,
      ctas,
      cards: bestEntry.cards || [],
      intent: bestEntry.intent || 'general',
      category: 'local_agent'
    };
  }

  return buildFallbackResponse(currentLang);
}

function buildFallbackResponse(currentLang) {
  const fallbackCtas = (faqData.fallback.ctas || []).map(cta => ({
    text: typeof cta.text === 'object' ? (cta.text[currentLang] || cta.text.fr) : cta.text,
    action: cta.action,
    target: cta.target
  }));

  return {
    matched: false,
    text: faqData.fallback[currentLang] || faqData.fallback.fr,
    ctas: fallbackCtas,
    cards: [],
    intent: 'fallback',
    category: 'local_agent'
  };
}
