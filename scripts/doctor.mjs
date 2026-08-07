import { existsSync, readFileSync } from 'node:fs';

const minimumNodeMajor = 20;
const nodeMajor = Number.parseInt(process.versions.node.split('.')[0], 10);
const requiredFiles = [
  'package.json',
  'cv/package.json',
  'cv/.env.example',
  'neil/package.json',
  'neil/.env.example',
  'elportugues/package.json',
  'elportugues/.env.example',
  '.github/workflows/deploy.yml',
];

const errors = [];

if (nodeMajor < minimumNodeMajor) {
  errors.push(`Node.js ${minimumNodeMajor}+ is required; found ${process.versions.node}.`);
}

for (const file of requiredFiles) {
  if (!existsSync(file)) errors.push(`Missing required file: ${file}`);
}

for (const app of ['cv', 'neil', 'elportugues']) {
  const packagePath = `${app}/package.json`;
  if (!existsSync(packagePath)) continue;
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  for (const script of ['dev', 'build']) {
    if (!packageJson.scripts?.[script]) errors.push(`${packagePath} is missing the ${script} script.`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Repository doctor passed.');
