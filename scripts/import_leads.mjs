import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

// We need the config from the env or hardcoded.
// I will extract it from the local .env or firebaseConfig.js
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function parseDateString(d) {
  if (!d) return new Date().toISOString();
  const match = d.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (match) {
    return new Date(`${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}:${match[6]}Z`).toISOString();
  }
  return new Date(d).toISOString();
}

async function run() {
  const content = fs.readFileSync('/Users/fahdrahali/.gemini/antigravity/brain/930af541-8e49-46f6-8b78-cd89cda75ea4/.system_generated/steps/729/content.md', 'utf-8');
  
  // Extract CSV part from the markdown (lines after ---)
  const csvData = content.split('---')[1].trim();
  
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });

  let currentHistory = [];
  const leadsToUpload = [];

  for (const row of records) {
    const isLeadCapture = row['Lead message'] === '*** LEAD CAPTURÉ ***';
    
    if (isLeadCapture) {
      let historyStr = '--- Historique ---\n';
      currentHistory.forEach(h => {
         historyStr += `Visiteur: ${h.leadMessage}\nAgent: ${h.botMessage}\n`;
      });
      
      leadsToUpload.push({
        name: row['Lead name'] || '',
        email: row['Number'] || '', 
        source: 'Chatbot',
        type: row['Lead type'] || 'Professionnel',
        status: 'nouveau',
        createdAt: parseDateString(row['Date']),
        message: `Lead capturé via Chatbot. Type: ${row['Lead type'] || 'Professionnel'}\n\n${historyStr}`
      });
      
      currentHistory = []; // reset
    } else {
      currentHistory.push({
         date: row['Date'],
         leadMessage: row['Lead message'],
         botMessage: row['Chatbot message']
      });
    }
  }

  console.log(`Found ${leadsToUpload.length} leads to upload.`);
  
  for (const lead of leadsToUpload) {
    try {
      await addDoc(collection(db, 'leads'), lead);
      console.log(`Uploaded lead: ${lead.name}`);
    } catch (e) {
      console.error('Error uploading lead:', e);
    }
  }
  
  console.log("Import finished successfully!");
  process.exit(0);
}

run();
