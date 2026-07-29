import fs from 'fs';
import path from 'path';

// Parse .env
let envConfig = {};
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line && line.includes('=')) {
      const [k, v] = line.split('=');
      envConfig[k.trim()] = v.trim();
    }
  });
} catch(e) {}

const GEMINI_API_KEY = envConfig.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function extractCV() {
  const dir = 'public/cv-ayoub-moslih.pdf';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();
  
  const parts = [];
  for (const file of files) {
    const p = path.join(dir, file);
    const data = fs.readFileSync(p).toString('base64');
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: data
      }
    });
  }
  
  parts.unshift({
    text: "You are reading Ayoub MOSLIH's CV. Extract ALL his professional experiences in chronological order. Pay special attention to his roles as 'Consultant'. For each experience, extract: Role, Company, Period (Dates), Description/Missions. Output as strict JSON array of objects."
  });

  const response = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }]
    })
  });
  
  const result = await response.json();
  console.log(JSON.stringify(result, null, 2));
}

extractCV().catch(console.error);
