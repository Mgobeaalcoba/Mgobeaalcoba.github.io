import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const durableEntries = new Set([
  '.github',
  '.gitignore',
  '.nvmrc',
  '.prettierignore',
  '.prettierrc',
  'AGENTS.md',
  'README.md',
  'apps',
  'automation',
  'build-cloudflare.sh',
  'docs',
  'eslint.config.mjs',
  'infra',
  'package-lock.json',
  'package.json',
  'scripts',
  'tsconfig.base.json',
]);

const localOnlyEntries = new Set([
  '.git',
  '.work',
  '_site',
  'node_modules',
  'output',
  'tmp',
]);

const entries = await readdir(repositoryRoot);
const unexpected = entries.filter(
  (entry) => !durableEntries.has(entry) && !localOnlyEntries.has(entry)
);
const missing = [...durableEntries].filter((entry) => !entries.includes(entry));

if (unexpected.length || missing.length) {
  if (unexpected.length) console.error(`Unexpected root entries: ${unexpected.join(', ')}`);
  if (missing.length) console.error(`Missing root entries: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Repository root structure passed.');
