# Database Migrations

Scripts SQL para el schema y datos de Supabase. Todos los archivos aquí están trackeados en git.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `001_initial_schema.sql` | Schema completo: todas las tablas para cv, neil y elportugues |
| `002_seed_initial_data.sql` | Datos iniciales para todas las tablas |
| `003_migrate_ai_models_feb2026.sql` | Actualización de precios de modelos de IA a Feb 2026 |
| `004_migrate_ai_models_apr2026.sql` | Actualización de modelos de IA a Abr 2026 (GPT-4.1, Claude Sonnet 4.6, Gemini 2.5, Grok 3) |
| `012_update_frontier_ai_models_aug2026.sql` | Modelos frontier y precios API estándar verificados al 7 Ago 2026 |
| `013_harden_assistant_data_access.sql` | Activa RLS y restringe a servidor `assistant_logs`/`knowledge`; fija funciones y mueve `vector` fuera de `public` |

## Cómo ejecutar

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard) → proyecto → SQL Editor
2. Copiar el contenido del archivo y ejecutarlo
3. Siempre ejecutar en orden numérico

### Requisitos previos de `013_harden_assistant_data_access.sql`

Antes de aplicar la migración, configurar y probar estos secretos exclusivamente del lado servidor:

- En n8n: vincular el nodo HTTP `Search Knowledge Supabase` con la credencial cifrada `Supabase account` de tipo `Supabase API`; no agregar la clave como variable ni como header manual. Los workflows exportados bajo `automation/n8n/` ya incluyen esta configuración.
- Para `npm run sync-knowledge --workspace=cv`: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `HUGGINGFACE_TOKEN` en `apps/web/.env.local`.

La service-role key omite RLS y no debe copiarse a variables `NEXT_PUBLIC_*`, al navegador, a logs ni al repositorio. Aplicar `013` sólo después de actualizar los workflows activos de n8n; de lo contrario, la búsqueda RAG dejará de tener acceso. Después de aplicar, volver a ejecutar Security Advisor y verificar que no queden los avisos incluidos en la migración.

## Convención de nombres

```
NNN_descripcion_breve.sql
```

Donde `NNN` es un número secuencial de 3 dígitos. Al agregar una nueva migración, usar el siguiente número disponible.

## Diferencia con tasks/supabase-migration/

La carpeta `tasks/` está gitignoreada (notas de trabajo, borradores).  
Esta carpeta `infra/supabase/migrations/` está trackeada en git y es la fuente de verdad para reproducir el schema de Supabase.
