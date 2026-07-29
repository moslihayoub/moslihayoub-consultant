import { findBestMatch } from './chatbotEngine';
import { knowledgeBase } from '../data/knowledgeBase';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export function getDevModeOverride() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('m84_dev_mode_override');
}

export function setDevModeOverride(mode) {
  if (typeof window === 'undefined') return;
  if (!mode) {
    localStorage.removeItem('m84_dev_mode_override');
  } else {
    localStorage.setItem('m84_dev_mode_override', mode);
  }
}

import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

async function getSystemInstruction(lang = 'fr') {
  const publicProjects = knowledgeBase.getPublicProjects()
    .map(p => `- ${p.title} (${p.category} • ${p.client}): ${p.shortDesc?.[lang] || p.shortDesc?.fr || ''} [Image: ${p.image}] [Lien: ${p.url}]`)
    .join('\n');

  const services = knowledgeBase.services
    .map(s => `- ${s.title[lang] || s.title.fr}: ${s.desc[lang] || s.desc.fr}`)
    .join('\n');

  const topCertifs = knowledgeBase.topCertifications
    .map(c => `- ${c.title} (${c.issuer}, ${c.year}, ${c.category})`)
    .join('\n');

  let dynamicPrompt = `
Tu es l'Agent M84, l'agent virtuel intelligent d'Ayoub MOSLIH (Consultant en Transformation Digitale & IA).
Ton rôle est d'agir comme un GUIDE D'ORIENTATION interactif dans le portfolio d'Ayoub Moslih.

RÈGLE D'OR 1 - HORS SUJET :
Tu réponds EXCLUSIVEMENT aux questions liées au site, à Ayoub Moslih, ses services, projets et compétences.
Si la question est hors sujet (recette de cuisine, blague, météo, actualités générales, code externe, etc.) :
Explique en UNE SEULE PHRASE que tu es un agent dédié uniquement au portfolio et aux services d'Ayoub Moslih, puis propose de le guider vers ses compétences ou projets.

RÈGLE D'OR 2 - FILTRAGE STRICT PAR CATÉGORIE :
Lorsque l'utilisateur demande des projets ou certifications d'une catégorie spécifique (ex: Motion Graphics, UX/UI, MVP AI, Certifications IA, Google, Anthropic) :
Tu dois ABSOLUMENT sélectionner et retourner UNIQUEMENT les cartes correspondant à cette catégorie exacte !
Par exemple : si la question mentionne "motion graphic", filtre et retourne uniquement des projets de la catégorie "Motion Graphics".

RÈGLE D'OR 3 - FORMAT & CONCISION :
- Sois très synthétique : 35 mots maximum par réponse texte.
- Privilégie TOUJOURS les cartes et boutons CTAs de redirection vers les pages du site.
- Ne génère AUCUN projet sous mot de passe / restreint.
`;

  try {
    if (db) {
      const docRef = doc(db, 'config', 'agent');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().systemPrompt) {
        dynamicPrompt = docSnap.data().systemPrompt;
      }
    }
  } catch (error) {
    console.error("Erreur lecture prompt dynamique", error);
  }

  return `${dynamicPrompt}

GESTION DES INTENTIONS PRÉCISES :
1. Intent "spécialité / qui est Ayoub" ("qui est ayoub", "profil", "spécialité", "présente-toi") :
   - Texte : Synthèse en 1 sentence de son profil (Consultant Transformation Digitale & IA, 19 ans d'expérience).
   - CTAs obligatoires : 
     1. "Voir ses services" (navigate: /about#expertise)
     2. "Voir ses projets" (navigate: /work)
     3. "Ouvrir le CV" (external: ${knowledgeBase.profile.cvUrl})

2. Intent "services" ("quels sont tes services", "les services d'ayoub", "voir ses services", "que proposes-tu", "comment tu peux m'aider", "offres") :
   - Texte : Énumère brièvement sous forme de puces les 4 axes clés, puis demande à l'utilisateur s'il souhaite explorer les détails.
   - CTAs obligatoires :
     1. "Voir les services en détail" (navigate: /about#expertise)
     2. "Demander une consultation digitale" (action: start_lead_capture)

3. Intent "projets / SaaS / portfolio" :
   - Texte : 1 phrase présentant les réalisations filtrées par la catégorie demandée.
   - Cards (Max 3 projets publics non-protégés correspondant EXACTEMENT à la catégorie) : title, subtitle (category), desc, image, url.
   - CTAs obligatoires : "Voir plus de projets" (navigate: /work)

4. Intent "CV uniquement" :
   - CTAs obligatoires : "Ouvrir le CV" (external: ${knowledgeBase.profile.cvUrl})

5. Intent "parcours / timeline" :
   - CTAs obligatoires : "Voir la timeline" (navigate: /about#timeline)

6. Intent "certifications / formations" :
   - Cards (Max 3 certifs) : title, subtitle (issuer), desc (year), url (/about#certifications).

7. Intent "contact / devis / collaboration" :
   - CTAs obligatoires :
     1. "Discuter sur WhatsApp" (external: ${knowledgeBase.profile.whatsapp})
     2. "Laisser vos coordonnées" (action: start_lead_capture)
     3. "Demander un rendez-vous" (external: mailto:${knowledgeBase.profile.email})

BASE DE CONNAISSANCES :
- Profil : Ayoub MOSLIH, ${knowledgeBase.profile.role}, ${knowledgeBase.profile.experienceYears} ans d'expérience.
- Localisation : ${knowledgeBase.profile.location}
- Clients Phares : ${knowledgeBase.clients.join(', ')}
- Services :
${services}
- Top Certifications :
${topCertifs}
- Projets Publics Disponibles :
${publicProjects}

FORMAT JSON STRICT DE RÉPONSE OBLIGATOIRE :
{
  "text": "La réponse texte courte en markdown...",
  "ctas": [
    { "text": "Intitulé du bouton", "action": "navigate|external|start_lead_capture", "target": "/route-ou-url" }
  ],
  "cards": [
    { "title": "Titre", "subtitle": "Sous-titre/Type", "desc": "Courte description", "image": "Chemin image si projet", "url": "Lien ou route", "type": "project|certif" }
  ],
  "intent": "specialite|services|projets|cv|timeline|certifications|contact|offtopic|general"
}
`;
}

export const MAX_AI_QUOTA_PER_HOUR = 5;
const ONE_HOUR_MS = 3600000;

export function getQuotaInfo() {
  try {
    const devOverride = (import.meta.env.DEV && typeof window !== 'undefined') ? getDevModeOverride() : null;
    const raw = localStorage.getItem('m84_ai_quota');
    const now = Date.now();
    let quota = raw ? JSON.parse(raw) : { count: 0, resetAt: now + ONE_HOUR_MS };

    if (now > quota.resetAt) {
      quota = { count: 0, resetAt: now + ONE_HOUR_MS };
      localStorage.setItem('m84_ai_quota', JSON.stringify(quota));
    }

    const currentCount = Math.min(quota.count, MAX_AI_QUOTA_PER_HOUR);
    let mode = (GEMINI_API_KEY && currentCount < MAX_AI_QUOTA_PER_HOUR) ? 'ai' : 'local';
    
    if (devOverride) {
      mode = devOverride;
    }

    const remaining = MAX_AI_QUOTA_PER_HOUR - currentCount;

    return {
      count: currentCount,
      max: MAX_AI_QUOTA_PER_HOUR,
      remaining,
      mode,
      devOverride,
      isWarning: currentCount === MAX_AI_QUOTA_PER_HOUR - 1
    };
  } catch (e) {
    return { count: 0, max: MAX_AI_QUOTA_PER_HOUR, remaining: MAX_AI_QUOTA_PER_HOUR, mode: 'local', devOverride: null, isWarning: false };
  }
}

function checkAndIncrementQuota() {
  try {
    const raw = localStorage.getItem('m84_ai_quota');
    const now = Date.now();
    let quota = raw ? JSON.parse(raw) : { count: 0, resetAt: now + ONE_HOUR_MS };

    if (now > quota.resetAt) {
      quota = { count: 1, resetAt: now + ONE_HOUR_MS };
    } else if (quota.count >= MAX_AI_QUOTA_PER_HOUR) {
      return false;
    } else {
      quota.count += 1;
    }

    localStorage.setItem('m84_ai_quota', JSON.stringify(quota));
    return true;
  } catch (e) {
    return true;
  }
}

export async function queryM84Chatbot(userQuery, messagesHistory = [], lang = 'fr') {
  const trimmedQuery = userQuery ? userQuery.trim() : '';

  if (trimmedQuery === "Laissez vos coordonnées" || trimmedQuery === "Leave your details" || trimmedQuery === "Laisser vos coordonnées") {
    return {
      matched: true,
      action: "START_LEAD_CAPTURE",
      category: "lead_trigger",
      quota: getQuotaInfo()
    };
  }

  const devOverride = (import.meta.env.DEV && typeof window !== 'undefined') ? getDevModeOverride() : null;
  const hasQuota = checkAndIncrementQuota();
  const quotaInfo = getQuotaInfo();

  const shouldTryAi = devOverride ? (devOverride === 'ai') : (GEMINI_API_KEY && hasQuota);

  if (shouldTryAi && GEMINI_API_KEY) {
    try {
      const formattedContents = [
        {
          role: 'user',
          parts: [{ text: await getSystemInstruction(lang) }]
        },
        {
          role: 'model',
          parts: [{ text: JSON.stringify({ 
            text: lang === 'en' ? "Understood! I am Agent M84, Ayoub MOSLIH's guide agent. How may I assist you?" : "Bien reçu ! Je suis l'Agent M84, le guide virtuel d'Ayoub MOSLIH. Comment puis-je vous guider ?",
            ctas: [
              { text: lang === 'en' ? "Explore Services" : "Voir ses services", action: "navigate", target: "/about#expertise" },
              { text: lang === 'en' ? "View Projects" : "Voir ses projets", action: "navigate", target: "/work" }
            ],
            intent: "general"
          }) }]
        }
      ];

      const rawHistory = messagesHistory
        .filter(m => m.role === 'user' || m.role === 'model')
        .slice(-6); // Prenons un peu plus d'historique pour être sûr

      rawHistory.push({ role: 'user', text: trimmedQuery });

      // Normalisation pour Gemini : Les rôles doivent alterner strictement (user -> model -> user)
      const normalizedHistory = [];
      for (const msg of rawHistory) {
        if (normalizedHistory.length > 0 && normalizedHistory[normalizedHistory.length - 1].role === msg.role) {
          // Si même rôle consécutif, on fusionne le texte
          normalizedHistory[normalizedHistory.length - 1].parts[0].text += '\n' + msg.text;
        } else {
          normalizedHistory.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      }

      // Vérification vitale : Le formattedContents commence par [user, model]
      // Il FAUT que le premier message de l'historique soit "user". 
      // S'il est "model", on fusionne avec la réponse "model" d'introduction pour éviter un crash 400 Bad Request
      if (normalizedHistory.length > 0 && normalizedHistory[0].role === 'model') {
        formattedContents[1].parts[0].text += '\n' + normalizedHistory[0].parts[0].text;
        normalizedHistory.shift(); // On l'enlève car fusionné
      }

      formattedContents.push(...normalizedHistory);

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({ 
          contents: formattedContents,
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText && candidateText.trim()) {
          try {
            const parsed = JSON.parse(candidateText.trim());
            const cleanText = typeof parsed.text === 'string' ? parsed.text : (typeof parsed.text === 'object' ? JSON.stringify(parsed.text) : "Voici les informations demandées :");
            const cleanCtas = Array.isArray(parsed.ctas) ? parsed.ctas : [];
            const cleanCards = Array.isArray(parsed.cards) ? parsed.cards : [];

            return {
              matched: true,
              text: cleanText,
              ctas: cleanCtas,
              cards: cleanCards,
              intent: parsed.intent || 'general',
              category: 'ai_agent',
              quota: quotaInfo
            };
          } catch (jsonError) {
            console.warn("Erreur de parsing JSON depuis Gemini Agent M84", jsonError, candidateText);
          }
        }
      } else {
        console.warn("Réponse Gemini non-200 (Erreur API / Quota Token Gemini):", response.status);
      }
    } catch (error) {
      console.warn("Erreur réseau/technique lors de l'appel Gemini Agent M84 :", error);
    }

    // SI PROBLÈME TECHNIQUE OU QUOTA TOKEN ERREUR DANS L'IA :
    // Bascule automatique transparente vers l'Agent Local avec message d'explication clair au user !
    const localMatch = findBestMatch(trimmedQuery, lang);
    const techNotice = lang === 'en'
      ? "⚙️ A temporary technical issue occurred with the AI agent. You have been automatically switched to the Local Agent to continue your consultation.\n\n"
      : "⚙️ Un problème technique temporaire est survenu avec l'agent IA. Vous avez été automatiquement basculé vers l'Agent Local pour continuer votre consultation.\n\n";

    return {
      ...localMatch,
      text: techNotice + (localMatch.text || ''),
      isTechnicalFallback: true,
      quota: {
        ...quotaInfo,
        mode: 'local'
      }
    };
  }

  const localMatch = findBestMatch(trimmedQuery, lang);
  return {
    ...localMatch,
    quota: quotaInfo
  };
}
