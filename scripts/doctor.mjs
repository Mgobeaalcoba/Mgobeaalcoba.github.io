import { existsSync, readFileSync } from 'node:fs';

const minimumNodeMajor = 20;
const nodeMajor = Number.parseInt(process.versions.node.split('.')[0], 10);
const requiredFiles = [
  'package.json',
  'apps/web/package.json',
  'apps/web/.env.example',
  'apps/neil/package.json',
  'apps/neil/.env.example',
  'apps/el-portugues/package.json',
  'apps/el-portugues/.env.example',
  '.github/workflows/deploy.yml',
];

const errors = [];

if (nodeMajor < minimumNodeMajor) {
  errors.push(`Node.js ${minimumNodeMajor}+ is required; found ${process.versions.node}.`);
}

for (const file of requiredFiles) {
  if (!existsSync(file)) errors.push(`Missing required file: ${file}`);
}

for (const app of ['apps/web', 'apps/neil', 'apps/el-portugues']) {
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
