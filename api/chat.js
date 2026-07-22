import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `Tu es Moslih84 Assistant AI, un assistant IA exclusif pour le portfolio d'Ayoub MOSLIH. 
Ton rôle est de répondre poliment aux questions des visiteurs concernant les expériences, les projets, et les compétences d'Ayoub.
Ayoub est un Lead Product Designer & AI Product Strategy Manager. Ses meilleurs clients/projets incluent: autocash.ma, CGI, OCP, CDM Bank.
Sois concis, professionnel et poli. Ne réponds à aucune question hors sujet.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e){}
    }
    const { message, history } = body;
    
    // La clé API est maintenant sécurisée côté serveur
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY manquant");
      return res.status(500).json({ error: "Configuration API manquante" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const chat = model.startChat({ history: history || [] });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return res.status(200).json({ text: responseText });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
