import { initializeApp, getApps } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import firebaseConfig from '../../firebase-config.json';
import { findBestMatch } from './chatbotEngine';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase AI Logic with Google AI Backend
let aiInstance = null;
let aiModel = null;

try {
  aiInstance = getAI(app, { backend: new GoogleAIBackend() });
  aiModel = getGenerativeModel(aiInstance, {
    model: 'gemini-2.0-flash',
    systemInstruction: `
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
- Projets Clés :
  - Autocash.ma (Marketplace automobile, financement & achat/vente)
  - eDrive.ma (Gestion B2B et financement de flottes de véhicules)
  - ParcelIQ HR AI (Outil RH intelligent)
  - Foodeals (Solution anti-gaspillage alimentaire SaaS/ERP)
  - The Factory (Série d'animation & faisant appel à des workflows d'IA générative)
- Tarifs & Devis : Les tarifs sont établis sur-mesure selon le périmètre (audit, stratégie UX/UI, prototypage IA, accompagnement).
- Contact :
  - Email : moslihayoub@gmail.com
  - Téléphone / WhatsApp : +212 6 63 58 50 65
  - LinkedIn : linkedin.com/in/ayoub-moslih/

Consignes de Réponse :
1. Réponds toujours dans la langue de la question (Français ou Anglais principalement).
2. Sois synthétique (2 à 3 phrases max par réponse).
3. Sois accueillant, précis et met en valeur l'expertise d'Ayoub Moslih.
4. Si l'utilisateur demande un devis, un contact ou un rendez-vous, propose-lui de contacter Ayoub par WhatsApp (+212 6 63 58 50 65) ou par Email.
`
  });
} catch (err) {
  console.warn('Firebase AI Logic init warning:', err);
}

/**
 * Generate AI Response using Firebase AI Logic (Gemini API)
 * with automatic fallback to local FAQ Engine.
 */
export async function queryM84Chatbot(userQuery, messagesHistory = [], lang = 'fr') {
  const trimmedQuery = userQuery ? userQuery.trim() : '';

  // Trigger lead capture if user explicitly clicks contact actions
  if (trimmedQuery === "Laissez vos coordonnées" || trimmedQuery === "Leave your details") {
    return {
      matched: true,
      action: "START_LEAD_CAPTURE",
      category: "lead_trigger"
    };
  }

  // Attempt Firebase AI Logic generation
  if (aiModel) {
    try {
      // Build chat history for Gemini multi-turn conversation
      const formattedHistory = messagesHistory
        .filter(m => m.role === 'user' || m.role === 'model')
        .slice(-6) // Keep last 6 messages for context
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const chat = aiModel.startChat({
        history: formattedHistory
      });

      const result = await chat.sendMessage(trimmedQuery);
      const responseText = result.response.text();

      if (responseText && responseText.trim()) {
        return {
          matched: true,
          text: responseText.trim(),
          quickReplies: lang === 'en'
            ? ["Services offered", "Recent projects"]
            : ["Quels sont tes services ?", "Voir les projets"],
          category: 'ai_logic'
        };
      }
    } catch (error) {
      console.warn('Firebase AI Logic call error, using local engine fallback:', error);
    }
  }

  // Fallback to local rule engine if AI call fails or is unavailable
  return findBestMatch(trimmedQuery, lang);
}
