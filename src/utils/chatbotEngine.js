import faqData from '../data/chatbot_faq.json';

const STOP_WORDS = new Set([
  'le', 'la', 'les', 'du', 'de', 'des', 'un', 'une', 'et', 'en', 'au', 'aux',
  'est', 'je', 'tu', 'il', 'nous', 'vous', 'ils', 'a', 'ce', 'cet', 'cette',
  'sur', 'pour', 'dans', 'par', 'avec', 'sans', 'mon', 'ma', 'mes', 'ton', 'ta',
  'tes', 'son', 'sa', 'ses', 'nos', 'vos', 'leurs', 'the', 'a', 'an', 'and', 'or',
  'to', 'in', 'on', 'is', 'of', 'for', 'with', 'by', 'at', 'from', 'as', 'it',
  'w', 'wa', 'f', 'fi', 'fe', 'men', 'mn', 'dial', 'dyal', 'd', 'qui', 'que', 'quoi', 'donne', 'donnee', 'donnez', 'moi', 'me', 'montre', 'voir',
  'salut', 'bonjour', 'hello', 'coucou', 'salam', 'slm', 'marhaba' // Ignore greetings when they are part of a longer sentence
]);

const SYNONYM_MAP = {
  // Pricing / Devis (Darija + FR + EN)
  'tarif': 'tarif', 'tarifs': 'tarif', 'prix': 'tarif', 'devis': 'tarif', 'combien': 'tarif',
  'cout': 'tarif', 'couts': 'tarif', 'tjm': 'tarif', 'tjms': 'tarif', 'facture': 'tarif',
  'taman': 'tarif', 'thaman': 'tarif', 'bchhal': 'tarif', 'bch7al': 'tarif', 'chehal': 'tarif', 'chhal': 'tarif',

  // Projects (Darija + FR + EN)
  'projet': 'projet', 'projets': 'projet', 'realisation': 'projet', 'realisations': 'projet',
  'travail': 'projet', 'travaux': 'projet', 'portfolio': 'projet', 'cas': 'projet', 'clients': 'projet',
  'machoari3': 'projet', 'mashari3': 'projet', 'mchari3': 'projet', 'a3mal': 'projet', 'aamal': 'projet',
  'site': 'projet', 'sites': 'projet', 'web': 'projet', 'application': 'projet', 'app': 'projet', 'pertinante': 'projet', 'pertinent': 'projet', 'pertinentes': 'projet',

  // Services (Darija + FR + EN)
  'service': 'service', 'services': 'service', 'prestation': 'service', 'prestations': 'service',
  'expertise': 'service', 'expertises': 'service', 'offre': 'service', 'offres': 'service', 'conseil': 'service',
  'khadamat': 'service', 'khedma': 'service', 'khedmat': 'service', 'chkatdir': 'service', 'katdir': 'service',

  // Skills & Tech (Darija + FR + EN + Typos like uc/ui)
  'competence': 'competence', 'competences': 'competence', 'stack': 'competence', 'techno': 'competence',
  'technos': 'competence', 'technology': 'competence', 'outil': 'competence', 'outils': 'competence',
  'figma': 'competence', 'react': 'competence', 'ux': 'competence', 'ui': 'competence',
  'uxui': 'competence', 'ucui': 'competence', 'uc': 'competence', 'design': 'competence', 'designer': 'competence',
  'maharat': 'competence', 'adawat': 'competence',

  // Experience & Career (Darija + FR + EN)
  'experience': 'experience', 'experiences': 'experience', 'parcours': 'experience', 'carriere': 'experience',
  'cv': 'experience', 'poste': 'experience', 'postes': 'experience', 'timeline': 'experience',
  'tajriba': 'experience', 'khibra': 'experience', 'khdam': 'experience',

  // Contact & Lead (Darija + FR + EN)
  'contact': 'contact', 'contacter': 'contact', 'email': 'contact', 'mail': 'contact',
  'telephone': 'contact', 'phone': 'contact', 'tel': 'contact', 'whatsapp': 'contact',
  'linkedin': 'contact', 'rdv': 'contact', 'joindre': 'contact', 'ecrire': 'contact',
  'twasal': 'contact', 'ntwasel': 'contact', 'nemra': 'contact', 'nmerte': 'contact', 'num': 'contact',
  'appel': 'contact', 'rappeler': 'contact', 'appelles': 'contact', 'lead': 'contact', 'coordonnees': 'contact', 'message': 'contact',

  // AI & Tech
  'ia': 'ia', 'ai': 'ia', 'llm': 'ia', 'gpt': 'ia', 'automatisation': 'ia', 'dhakaa': 'ia',

  // Person / Bio (Darija + FR + EN)
  'ayoub': 'ayoub', 'moslih': 'ayoub', 'bio': 'ayoub', 'biographie': 'ayoub', 'profil': 'ayoub', 'qui': 'ayoub',
  'chkon': 'ayoub', 'chkun': 'ayoub', 'chkoun': 'ayoub'
};

/**
 * Clean & normalize a raw input string
 */
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics/accents
    .replace(/[^a-z0-9\s]/g, " ")     // Replace non-alphanumeric chars with spaces
    .trim();
}

/**
 * Calculate Levenshtein distance for fuzzy matching (typo tolerance)
 */
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
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insertion, deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Tokenize normalized text and resolve synonyms with Fuzzy Matching
 */
export function tokenizeAndMap(text) {
  const normalized = normalizeText(text);
  const rawTokens = normalized.split(/\s+/).filter(Boolean);
  const synonymKeys = Object.keys(SYNONYM_MAP);
  
  const tokens = [];
  for (const token of rawTokens) {
    if (token.length > 1 && (!STOP_WORDS.has(token) || rawTokens.length <= 2)) {
      let mapped = token;
      
      // 1. Match Exact
      if (SYNONYM_MAP[token]) {
        mapped = SYNONYM_MAP[token];
      } else {
        // 2. Fuzzy Match (Recherche tolérante aux fautes)
        for (const key of synonymKeys) {
          const distance = levenshteinDistance(token, key);
          // Tolérance proportionnelle à la taille du mot (1 erreur si mot court, 2 si long)
          const threshold = key.length >= 6 ? 2 : 1; 
          
          if (distance <= threshold && Math.abs(token.length - key.length) <= threshold) {
            mapped = SYNONYM_MAP[key];
            break; // Dès qu'on trouve un mot très proche, on l'adopte
          }
        }
      }
      tokens.push(mapped);
    }
  }
  return tokens;
}

/**
 * Calculate Jaccard Similarity between two arrays of tokens
 */
function jaccardSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  
  const union = new Set([...tokensA, ...tokensB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Score a single entry against normalized user query and tokens
 */
function scoreEntry(rawQuery, queryTokens, entry) {
  const normQuery = normalizeText(rawQuery);
  if (!normQuery) return 0;

  // 1. Check for exact question or variant match
  for (const q of entry.questions) {
    const normQ = normalizeText(q);
    if (normQuery === normQ) return 1.0;
    if (normQuery.includes(normQ) || normQ.includes(normQuery)) {
      if (normQuery.length > 3 && normQ.length > 3) return 0.85;
    }
  }

  // 2. Build entry tokens from keywords and questions
  const entryKeywords = entry.keywords || [];
  const entryTokens = [];
  
  for (const kw of entryKeywords) {
    entryTokens.push(...tokenizeAndMap(kw));
  }
  for (const q of entry.questions) {
    entryTokens.push(...tokenizeAndMap(q));
  }

  // 3. Compute token overlap and Jaccard similarity
  const uniqueEntryTokens = [...new Set(entryTokens)];
  const jaccardScore = jaccardSimilarity(queryTokens, uniqueEntryTokens);

  // 4. Count token matches directly
  let directMatches = 0;
  const entrySet = new Set(uniqueEntryTokens);
  for (const qt of queryTokens) {
    if (entrySet.has(qt)) {
      directMatches++;
    }
  }

  const tokenOverlapRatio = queryTokens.length > 0 ? directMatches / queryTokens.length : 0;

  // Combined score formula
  let finalScore = (jaccardScore * 0.4) + (tokenOverlapRatio * 0.6);

  // Boost if query matches the category keyword directly
  const mappedCategory = SYNONYM_MAP[entry.category] || entry.category;
  if (queryTokens.includes(mappedCategory) || queryTokens.includes(entry.id)) {
    finalScore += 0.3;
  }
  
  // Special handling for Lead Capture trigger keywords explicitly typed by user
  if (entry.id === "contact_info" && (queryTokens.includes("appel") || queryTokens.includes("rappeler") || queryTokens.includes("devis"))) {
      finalScore += 0.4;
  }

  return Math.min(finalScore, 0.99);
}

/**
 * Search the FAQ knowledge base for the best matching response
 */
export function findBestMatch(userQuery, lang = 'fr') {
  const currentLang = (lang && lang.toLowerCase().startsWith('en')) ? 'en' : 'fr';
  
  // Gestion directe du flux Lead Capture
  if (userQuery === "Laissez vos coordonnées" || userQuery === "Leave your details") {
    return {
      matched: true,
      action: "START_LEAD_CAPTURE",
      category: "lead_trigger"
    };
  }

  if (!userQuery || !userQuery.trim()) {
    return {
      matched: false,
      text: faqData.fallback[currentLang] || faqData.fallback.fr,
      quickReplies: (faqData.fallback.quickReplies || []).slice(0, 2),
      category: 'fallback'
    };
  }

  const queryTokens = tokenizeAndMap(userQuery);

  let bestEntry = null;
  let highestScore = 0;

  for (const entry of faqData.entries) {
    const score = scoreEntry(userQuery, queryTokens, entry);
    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  const THRESHOLD = 0.20;

  if (bestEntry && highestScore >= THRESHOLD) {
    if (bestEntry.action === "START_LEAD_CAPTURE") {
      return {
        matched: true,
        action: "START_LEAD_CAPTURE",
        category: bestEntry.category
      };
    }
    return {
      matched: true,
      score: highestScore,
      text: bestEntry.answer[currentLang] || bestEntry.answer.fr,
      quickReplies: (bestEntry.quickReplies || []).slice(0, 2),
      cta: bestEntry.cta ? {
        text: typeof bestEntry.cta.text === 'object' ? bestEntry.cta.text[currentLang] : bestEntry.cta.text,
        action: bestEntry.cta.action,
        target: bestEntry.cta.target
      } : null,
      category: bestEntry.category
    };
  }

  // Fallback response
  return {
    matched: false,
    text: faqData.fallback[currentLang] || faqData.fallback.fr,
    quickReplies: (faqData.fallback.quickReplies || []).slice(0, 2),
    category: 'fallback'
  };
}
