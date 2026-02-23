# Database Migrations

Scripts SQL para el schema y datos de Supabase. Todos los archivos aquí están trackeados en git.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `001_initial_schema.sql` | Schema completo: todas las tablas para cv, neil y elportugues |
| `002_seed_initial_data.sql` | Datos iniciales para todas las tablas |
| `003_migrate_ai_models_feb2026.sql` | Actualización de precios de modelos de IA a Feb 2026 |

## Cómo ejecutar

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard) → proyecto → SQL Editor
2. Copiar el contenido del archivo y ejecutarlo
3. Siempre ejecutar en orden numérico

## Convención de nombres

```
NNN_descripcion_breve.sql
```

Donde `NNN` es un número secuencial de 3 dígitos. Al agregar una nueva migración, usar el siguiente número disponible.

## Diferencia con tasks/supabase-migration/

La carpeta `tasks/` está gitignoreada (notas de trabajo, borradores).  
Esta carpeta `db/migrations/` está trackeada en git y es la fuente de verdad para reproducir el schema de Supabase.
