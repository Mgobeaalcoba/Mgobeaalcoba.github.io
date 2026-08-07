# MGA web platform

Monorepo para la presencia digital de MGA Tech Consulting y dos sitios de clientes. Las tres aplicaciones son exports estáticos de Next.js y comparten toolchain, lockfile y controles de calidad.

## Inicio rápido

```bash
nvm use
npm ci
npm run doctor
npm run dev
```

El sitio principal queda disponible en `http://localhost:3000`. Antes de entregar un cambio ejecutá `npm run check`.

## Aplicaciones

| Workspace | Ruta | Destino |
| --- | --- | --- |
| `cv` | `apps/web/` | dominio principal |
| `neil-landing` | `apps/neil/` | `/neil-site/` |
| `elportugues-landing` | `apps/el-portugues/` | `/elportugues-site/` |

Comandos habituales:

```bash
npm run dev
npm run dev:neil
npm run dev:elportugues
npm run build:all
npm run deploy
```

## Mapa del repositorio

- `apps/`: código, contenido y assets públicos de cada sitio.
- `automation/n8n/`: workflows exportados y sus assets.
- `infra/supabase/`: schema y migraciones canónicas.
- `scripts/`: build, diagnóstico, verificaciones y utilidades.
- `docs/`: arquitectura, decisiones, runbooks, planes y material histórico.
- `.github/`: CI, deploy y convenciones de colaboración.

La guía operativa para agentes está en [AGENTS.md](AGENTS.md). La documentación durable comienza en [docs/index.md](docs/index.md).

## Configuración

Copiá el `.env.example` de la aplicación que vas a ejecutar a `.env.local`. No se versionan secretos. Las variables `NEXT_PUBLIC_*` se exponen al navegador y nunca deben contener credenciales privadas.

## Despliegue

GitHub Actions compila cada workspace, ensambla los tres exports y publica `gh-pages`. Cloudflare Pages puede usar `npm run deploy` con `_site/` como directorio de salida. Ver [docs/runbooks/deployment.md](docs/runbooks/deployment.md).
