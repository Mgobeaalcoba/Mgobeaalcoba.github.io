import sharp from 'sharp';
import { createRequire } from 'module';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const pngToIco = require('png-to-ico').default;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'apps/web/public/images/logo.png');

// Build a circular mask SVG
function circleMask(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`
  );
}

async function generateCircularPng(size) {
  const resized = await sharp(SRC)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .toBuffer();
  return sharp(resized)
    .composite([{ input: circleMask(size), blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function run() {
  // 1. Master PNG (512px) — used by Next.js app/icon.png and deployed as icon.png
  const png512 = await generateCircularPng(512);
  writeFileSync(join(ROOT, 'apps/web/src/app/icon.png'), png512);
  console.log('✓ icon.png (512x512)');

  // 2. Apple touch icon (192px)
  const png192 = await generateCircularPng(192);
  writeFileSync(join(ROOT, 'apps/web/public/images/favicon-192.png'), png192);
  console.log('✓ favicon-192.png (192x192)');

  // 3. Multi-resolution favicon.ico (16, 32, 48px) — browsers always request /favicon.ico
  const icoBuffers = await Promise.all([16, 32, 48].map(generateCircularPng));
  const ico = await pngToIco(icoBuffers);
  writeFileSync(join(ROOT, 'apps/web/public/favicon.ico'), ico);
  console.log('✓ favicon.ico (16+32+48px,', ico.length, 'bytes)');

  console.log('\nDone! Commit the generated files under apps/web.');
}

run().catch(err => { console.error(err); process.exit(1); });
