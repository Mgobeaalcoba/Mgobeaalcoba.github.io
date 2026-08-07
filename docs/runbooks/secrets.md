# Secrets and configuration

- Never commit `.env.local`, API tokens, service-role keys or webhook credentials.
- Keep safe placeholders and variable names in each app's `.env.example`.
- Treat every `NEXT_PUBLIC_*` value as public because Next.js embeds it in browser bundles.
- Store CI values in GitHub Actions secrets and deployment-platform environment settings.
- Scrub n8n exports before committing; credentials must be referenced by connection name or placeholder, never embedded.
- Rotate a credential immediately if it appears in git history; deleting the current file is not sufficient.
