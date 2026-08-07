import { existsSync } from 'node:fs';

const expectedOutputs = [
  ['cv', ['out/index.html', 'out/portfolio/index.html', 'out/blog/index.html']],
  ['neil', ['out/index.html']],
  ['elportugues', ['out/index.html']],
];

const missing = expectedOutputs.flatMap(([app, files]) =>
  files.filter((file) => !existsSync(`${app}/${file}`)).map((file) => `${app}/${file}`)
);

if (missing.length > 0) {
  console.error(`Static smoke check failed. Missing:\n${missing.map((file) => `- ${file}`).join('\n')}`);
  process.exit(1);
}

console.log('Static smoke check passed.');
