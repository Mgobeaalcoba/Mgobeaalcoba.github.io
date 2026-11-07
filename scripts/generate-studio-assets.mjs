import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";

// Authored brand assets, independent of the Next.js build output.
const root = fileURLToPath(new URL("../apps/web", import.meta.url));
const mark =
  '<path d="m4 13 16-9 16 9-16 9L4 13Z" fill="#a3e635"/><path d="m4 21 16 9 16-9M4 29l16 9 16-9" stroke="#a3e635" stroke-width="3.5" stroke-linejoin="round" fill="none"/>';
const icon = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="104" fill="#05070c"/><g transform="translate(112 96) scale(7.2)">${mark}</g></svg>`
);
await Promise.all(
  [
    [192, "public/images/app-icon-192.png"],
    [512, "public/images/app-icon-512.png"],
    [192, "public/images/favicon-192.png"],
    [192, "src/app/icon.png"],
    [180, "src/app/apple-icon.png"],
  ].map(([size, path]) =>
    sharp(icon).resize(size, size).png().toFile(`${root}/${path}`)
  )
);
const faviconSizes = await Promise.all(
  [16, 32, 48].map((size) => sharp(icon).resize(size, size).png().toBuffer())
);
await writeFile(`${root}/public/favicon.ico`, await pngToIco(faviconSizes));
const og = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#05070c"/><g transform="translate(62 48) scale(1.2)">${mark}</g><text x="124" y="88" fill="#eef0f4" font-family="Arial, sans-serif" font-size="53" font-weight="700" letter-spacing="-4">mga.</text><text x="64" y="193" fill="#9aa8ba" font-family="Arial, sans-serif" font-size="17" letter-spacing="3">ESTUDIO DE TECNOLOGÍA APLICADA</text><text x="58" y="318" fill="#eef0f4" font-family="Arial, sans-serif" font-size="97" font-weight="600" letter-spacing="-6">Menos tareas.</text><text x="58" y="428" fill="#a3e635" font-family="Arial, sans-serif" font-size="97" font-weight="600" letter-spacing="-6">Más posibilidades.</text><path d="M64 504h1072" stroke="#283342"/><text x="64" y="555" fill="#9aa8ba" font-family="Arial, sans-serif" font-size="21">Agentes de IA · Automatización · Software · Datos</text><text x="1010" y="555" fill="#6fb6ff" font-family="Arial, sans-serif" font-size="21">mgatc.com ↗</text></svg>`
);
await sharp(og).png().toFile(`${root}/public/og.png`);
await sharp(
  fileURLToPath(
    new URL("../apps/neil/public/images/hdk-2200-v2.png", import.meta.url)
  )
)
  .resize({ width: 850, withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile(`${root}/public/images/work-neil.webp`);
console.log("Brand icons, project image and 1200×630 social cover generated.");
