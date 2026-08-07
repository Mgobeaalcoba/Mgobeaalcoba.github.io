# Local development

1. Use Node.js 20 (`nvm use`).
2. Install exactly from the root lockfile with `npm ci`.
3. Run `npm run doctor`.
4. Copy only the required app `.env.example` to `.env.local`.
5. Start the relevant `npm run dev*` command.
6. Before handoff, run `npm run check` and inspect the worktree for generated files.

Build outputs, local environment files, `output/` and `tmp/` are intentionally ignored.
