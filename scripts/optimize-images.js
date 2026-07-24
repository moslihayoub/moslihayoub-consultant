import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/assets/works');
const MAX_WIDTH = 1000;

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const parsedPath = path.parse(file);
      const outputPath = path.join(dir, `${parsedPath.name}.webp`);
      
      console.log(`Optimizing: ${fullPath}`);
      
      await sharp(fullPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
        
      console.log(`Saved optimized image: ${outputPath}`);
    }
  }
}

async function optimizeImages() {
  try {
    await processDirectory(inputDir);
    console.log('All images optimized successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
