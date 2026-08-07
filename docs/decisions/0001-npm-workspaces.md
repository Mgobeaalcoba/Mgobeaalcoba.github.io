# ADR 0001: npm workspaces monorepo

Status: accepted.

The three Next.js sites use a single root `package-lock.json` and npm workspaces. This removes duplicated dependency graphs, gives CI one deterministic install and allows repository-wide checks from a stable command surface.

Each application keeps its own `package.json`, Next configuration and static-export boundary. Shared compiler defaults live in `tsconfig.base.json`.
