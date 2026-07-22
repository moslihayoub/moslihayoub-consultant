const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const certDir = '../public/certif';

async function parsePdfs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await parsePdfs(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.pdf')) {
      try {
        const dataBuffer = fs.readFileSync(fullPath);
        const data = await pdfParse(dataBuffer);
        let text = data.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150);
        console.log(`FILE: ${entry.name} | TEXT: ${text}`);
      } catch (e) {
        console.log(`ERROR: ${entry.name} - ${e.message}`);
      }
    }
  }
}

parsePdfs(certDir);
