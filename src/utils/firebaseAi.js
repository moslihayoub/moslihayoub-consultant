import { findBestMatch } from './chatbotEngine';
import { projectsData } from '../data/projects';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

function getSystemInstruction(lang = 'fr') {
  const dynamicProjects = projectsData.map(p => `- ${p.title} (${p.category}): ${p.shortDesc?.[lang] || p.shortDesc?.fr || ''}`).join('\n');

  return `
Tu es M84, l'assistant virtuel intelligent d'Ayoub MOSLIH (Consultant en Transformation Digitale & IA).
Ton objectif est de répondre de façon professionnelle, dynamique, claire et chaleureuse aux visiteurs du portfolio d'Ayoub Moslih.

Informations Clés sur Ayoub MOSLIH :
- Métier : Consultant en Transformation Digitale & IA, Lead Product Designer & Strategy Manager.
- Expérience : 19 ans de parcours professionnel (10+ ans Digital, 7+ ans UX/UI, 2+ ans IA Générative).
- Localisation : Basé à Casablanca, Maroc (intervient en remote et sur site en Afrique, Europe et Moyen-Orient).
- Domaines d'expertise :
  1. Transformation Digitale & Stratégie Produits
  2. Stratégie IA, LLM, Agents & Prototypage Rapide (GenAI)
  3. Product & UX Strategy (Discovery, Wireframing, User Research)
  4. Design Systems & Prototypage React / Figma
- Expériences & Clients Phares : CGI, OCP, Crédit du Maroc, Carrefour, Wiggli, Autocash.ma, eDrive.ma, Foodeals, ParcelIQ, Ville de Laval (Canada), Agence Urbaine Larache.
- Projets Récents (mis à jour en temps réel) :
${dynamicProjects}
- Tarifs & Devis : Les tarifs sont établis sur-mesure selon le périmètre (audit, stratégie UX/UI, prototypage IA, accompagnement).
- Contact :
  - Email : moslihayoub@gmail.com
  - Téléphone / WhatsApp : +212 6 63 58 50 65
  - LinkedIn : linkedin.com/in/ayoub-moslih/

Consignes de Réponse :
1. Réponds toujours dans la langue de la question (Français ou Anglais principalement).
2. Sois clair, concis et très structuré : utilise **le Markdown** (mets les mots-clés importants en **gras**, utilise des puces \`-\` pour lister des compétences ou services).
3. Ne fais jamais de blocs de texte longs : privilégie de courts paragraphes aérés (maximum 2 à 3 lignes par paragraphe).
4. Sois accueillant, précis et met en valeur l'expertise d'Ayoub Moslih avec enthousiasme.
5. Si l'utilisateur demande un devis, un contact ou un rendez-vous, propose-lui de contacter Ayoub par WhatsApp (+212 6 63 58 50 65) ou par Email de manière bien visible.

IMPORTANT : Tu dois TOUJOURS répondre au format JSON strict avec la structure suivante :
{
  "text": "La réponse formatée en markdown...",
  "cta": {
    "text": "Texte du bouton",
    "action": "external",
    "target": "https://wa.me/212663585065" // ou un lien pertinent
  } // cta est optionnel
}
Si aucun CTA n'est pertinent, tu peux omettre la propriété "cta".
`;
}

export const MAX_AI_QUOTA_PER_HOUR = 5;
const ONE_HOUR_MS = 3600000;

export function getQuotaInfo() {
  try {
    const raw = localStorage.getItem('m84_ai_quota');
    const now = Date.now();
    let quota = raw ? JSON.parse(raw) : { count: 0, resetAt: now + ONE_HOUR_MS };

    if (now > quota.resetAt) {
      quota = { count: 0, resetAt: now + ONE_HOUR_MS };
      localStorage.setItem('m84_ai_quota', JSON.stringify(quota));
    }

    const currentCount = Math.min(quota.count, MAX_AI_QUOTA_PER_HOUR);
    const mode = (GEMINI_API_KEY && currentCount < MAX_AI_QUOTA_PER_HOUR) ? 'ai' : 'local';
    const remaining = MAX_AI_QUOTA_PER_HOUR - currentCount;

    return {
      count: currentCount,
      max: MAX_AI_QUOTA_PER_HOUR,
      remaining,
      mode,
      isWarning: currentCount === MAX_AI_QUOTA_PER_HOUR - 1
    };
  } catch (e) {
    return { count: 0, max: MAX_AI_QUOTA_PER_HOUR, remaining: MAX_AI_QUOTA_PER_HOUR, mode: 'local', isWarning: false };
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
      return false; // Quota exceeded for this hour
    } else {
      quota.count += 1;
    }

    localStorage.setItem('m84_ai_quota', JSON.stringify(quota));
    return true;
  } catch (e) {
    return true;
  }
}

/**
 * Generate AI Response using Gemini API
 * with automatic fallback to local FAQ Engine and Rate Limiting.
 */
export async function queryM84Chatbot(userQuery, messagesHistory = [], lang = 'fr') {
  const trimmedQuery = userQuery ? userQuery.trim() : '';

  // Trigger lead capture if user explicitly clicks contact actions
  if (trimmedQuery === "Laissez vos coordonnées" || trimmedQuery === "Leave your details") {
    return {
      matched: true,
      action: "START_LEAD_CAPTURE",
      category: "lead_trigger",
      quota: getQuotaInfo()
    };
  }

  // Check rate limit before calling Gemini API to protect quota
  const hasQuota = checkAndIncrementQuota();
  const quotaInfo = getQuotaInfo();

  // Attempt Gemini API generation if quota is available and key is configured
  if (GEMINI_API_KEY && hasQuota) {
    try {
      // Build conversation history for Gemini API
      const formattedContents = [
        {
          role: 'user',
          parts: [{ text: getSystemInstruction(lang) }]
        },
        {
          role: 'model',
          parts: [{ text: JSON.stringify({ text: "Bien reçu ! Je suis M84, l'assistant d'Ayoub MOSLIH. Comment puis-je vous aider ?" }) }]
        }
      ];

      messagesHistory
        .filter(m => m.role === 'user' || m.role === 'model')
        .slice(-4)
        .forEach(m => {
          formattedContents.push({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          });
        });

      formattedContents.push({
        role: 'user',
        parts: [{ text: trimmedQuery }]
      });

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
            return {
              matched: true,
              text: parsed.text || "Désolé, je n'ai pas pu formuler la réponse correctement.",
              cta: parsed.cta || null,
              quickReplies: lang === 'en'
                ? ["Services offered", "Recent projects"]
                : ["Quels sont tes services ?", "Voir les projets"],
              category: 'ai_logic',
              quota: quotaInfo
            };
          } catch (jsonError) {
            console.warn("Erreur de parsing JSON depuis Gemini", jsonError, candidateText);
          }
        }
      }
    } catch (error) {
      console.warn('Gemini API fetch error, using local engine fallback:', error);
    }
  }

  // Fallback to local rule engine if AI call fails, quota exceeded, or key missing
  const localMatch = findBestMatch(trimmedQuery, lang);
  return {
    ...localMatch,
    quota: quotaInfo
  };
}
