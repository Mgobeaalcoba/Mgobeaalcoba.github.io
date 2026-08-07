# System architecture

The repository is an npm-workspaces monorepo with three independent Next.js static exports. `apps/web` is mounted at the domain root; the Neil and El Portugués exports are assembled below their stable base paths.

```text
apps/web/out             -> /
apps/neil/out            -> /neil-site/
apps/el-portugues/out    -> /elportugues-site/
```

Supabase provides optional content data. Each application must remain buildable with documented public placeholders and retain its local fallback behavior. n8n workflows are operational assets, not runtime dependencies of the static build.

GitHub Actions builds workspaces independently and assembles artifacts for GitHub Pages. `scripts/build-deploy.sh` produces the equivalent `_site/` directory for Cloudflare Pages.
