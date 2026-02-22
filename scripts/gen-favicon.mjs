import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'assets/images/logo.png');

// Build a circular mask SVG
function circleMask(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`
  );
}

async function generateFavicon(outputPath, size) {
  // Resize logo to fill the square, then apply circular mask
  const resized = await sharp(SRC)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .toBuffer();

  await sharp(resized)
    .composite([{ input: circleMask(size), blend: 'dest-in' }])
    .png()
    .toFile(outputPath);

  console.log(`✓ ${outputPath}`);
}

// Generate 512x512 master favicon
await generateFavicon(join(ROOT, 'cv/public/favicon.png'), 512);

// Also generate a 192x192 for PWA-style usage
await generateFavicon(join(ROOT, 'cv/public/images/favicon-192.png'), 192);

console.log('\nDone! Run deploy to propagate.');
