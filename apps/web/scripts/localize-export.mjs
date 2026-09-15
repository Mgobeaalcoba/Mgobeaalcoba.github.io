/**
 * Localized export post-processing.
 *
 * The root layout owns `<html lang="es">`, so every exported route — including
 * the /en subtree — ships with the default language attribute. After
 * `next build` this rewrites that attribute for the generated /en pages so the
 * served markup declares the language the URL promises (SEO and assistive tech,
 * which read the attribute before hydration).
 *
 * Wired as the workspace `postbuild` script so it also runs in CI, which builds
 * workspaces directly with `npm run build --workspace=cv`.
 */
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'out');
const LOCALIZED_DIR = path.join(OUT_DIR, 'en');
const DEFAULT_LANG_ATTRIBUTE = '<html lang="es"';
const LOCALIZED_LANG_ATTRIBUTE = '<html lang="en"';

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collectHtmlFiles(fullPath)));
    else if (entry.name.endsWith('.html')) files.push(fullPath);
  }

  return files;
}

if (!existsSync(LOCALIZED_DIR)) {
  console.log('Localized export: no /en output found, nothing to rewrite.');
  process.exit(0);
}

const files = await collectHtmlFiles(LOCALIZED_DIR);
let updated = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  if (!html.includes(DEFAULT_LANG_ATTRIBUTE)) continue;

  const localized = html.replace(DEFAULT_LANG_ATTRIBUTE, LOCALIZED_LANG_ATTRIBUTE);
  await writeFile(file, localized);
  updated += 1;
}

console.log(`Localized export: declared lang="en" in ${updated} of ${files.length} /en page(s).`);
