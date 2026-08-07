import { spawn } from 'node:child_process';

const workspaces = {
  cv: { name: 'cv', needsPublicPlaceholders: false },
  neil: { name: 'neil-landing', needsPublicPlaceholders: true },
  'el-portugues': { name: 'elportugues-landing', needsPublicPlaceholders: true },
};

const requestedWorkspace = process.argv[2];
const workspace = workspaces[requestedWorkspace];
const npmCliPath = process.env.npm_execpath;

if (!workspace) {
  console.error(`Unknown workspace: ${requestedWorkspace ?? '(missing)'}`);
  process.exit(1);
}

if (!npmCliPath) {
  console.error('Run workspace builds through an npm script so npm_execpath is available.');
  process.exit(1);
}

const env = { ...process.env };
if (workspace.needsPublicPlaceholders) {
  env.NEXT_PUBLIC_SUPABASE_URL ||= 'https://example.supabase.co';
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'local-public-placeholder';
}

const child = spawn(
  process.execPath,
  [npmCliPath, 'run', 'build', `--workspace=${workspace.name}`],
  { env, shell: false, stdio: 'inherit' }
);

child.on('error', () => {
  console.error('Unable to start the workspace build.');
  process.exit(1);
});

child.on('exit', (code) => process.exit(code ?? 1));
