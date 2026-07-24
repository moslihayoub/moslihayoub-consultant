import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/assets/galerie');
const outputDir = inputDir;

const MAX_WIDTH = 600;

async function optimizeImages() {
  try {
    const files = fs.readdirSync(inputDir);
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(inputDir, file);
        const parsedPath = path.parse(file);
        const outputPath = path.join(outputDir, `${parsedPath.name}.webp`);
        
        console.log(`Optimizing: ${file}`);
        
        await sharp(inputPath)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);
          
        console.log(`Saved optimized image: ${parsedPath.name}.webp`);
      }
    }
    console.log('All images optimized successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
