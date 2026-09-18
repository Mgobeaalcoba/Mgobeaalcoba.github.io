# Checklist de riesgos del equipo

- [ ] No se modificó nada dentro de `legacy/`.
- [ ] No hay secretos, tokens o claves hardcodeadas en el código.
- [ ] Los textos visibles al usuario no tienen errores de tipeo evidentes.
- [ ] Si se tocó `infra/supabase/migrations/`, hay una aprobación humana explícita documentada.
- [ ] El build local corre sin errores (`npm run check`).
