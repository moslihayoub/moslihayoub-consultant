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
    
    // La clé API NVIDIA depuis Vercel
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.error("NVIDIA_API_KEY manquant");
      return res.status(500).json({ error: "Configuration API manquante" });
    }

    // Convertir l'historique (format Gemini) en format OpenAI (Llama)
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.parts ? msg.parts[0].text : ''
    }));

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-1b-instruct",
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          ...formattedHistory,
          { role: "user", content: message }
        ],
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1024,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API Error:', errorText);
      return res.status(500).json({ error: 'Erreur lors de la communication avec l\'API NVIDIA' });
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";

    return res.status(200).json({ text: responseText });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
