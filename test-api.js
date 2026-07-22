import handler from './api/chat.js';

const req = {
  method: 'POST',
  body: {
    message: "Bonjour, qui est Ayoub ?",
    history: []
  }
};

const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log("STATUS:", this.statusCode);
    console.log("RESPONSE:", JSON.stringify(data, null, 2));
  }
};

// Injection de la clé pour le test local
process.env.GEMINI_API_KEY = "AIzaSyCJ4x4FEe_KPnsqsULXGXrNkQgxP9HwZhw";

console.log("Démarrage du test de l'API...");
handler(req, res).catch(console.error);
