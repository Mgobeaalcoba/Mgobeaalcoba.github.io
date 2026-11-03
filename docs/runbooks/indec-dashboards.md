# Argentina en datos

## Páginas y componentes

Las rutas `/recursos/poder-adquisitivo/`, `/recursos/actividad-argentina/` y `/recursos/comercio-exterior/` son exports estáticos independientes de `apps/web`. Los accesos se ubican en una sección «Argentina en datos» antes del laboratorio de Recursos. Son herramientas argentinas en español, sin rutas localizadas en inglés, igual que las calculadoras financieras existentes.

Los componentes están en `apps/web/src/components/recursos/indec/`, las fórmulas puras en `src/lib/indec/math.ts` y los estilos aislados en `src/app/recursos/indec.css`. Usan los tokens Signal de la home, temas claro/oscuro y Chart.js con `react-chartjs-2`. Cada dashboard tiene controles, KPIs, gráficos, tabla accesible paginada, CSV de la selección e informe descriptivo descargable en texto.

## Datos y credenciales

`scripts/sync-indec-data.mjs` lee `INDEC_API_TOKEN` de `apps/web/.env.local` o del entorno. La variable se documenta vacía en `.env.example`; nunca debe llamarse `NEXT_PUBLIC_*`. El workflow de despliegue pasa `${{ secrets.INDEC_API_TOKEN }}` al build de `cv`. El token no aparece en el código cliente, snapshots ni logs.

```bash
# Desde el root. Refresco automático en prebuild; fuerza un refresco manual:
node scripts/sync-indec-data.mjs --force
# Validación offline de fórmulas, reservas, duplicados y snapshots:
node --test scripts/tests/indec.test.mjs
npm run build
npm run check
# Si el entorno impide que Turbopack abra su puerto interno:
NEXT_BUILD_ENGINE=webpack npm run check
```

La sincronización diaria usa REST/JSON de `https://api.indec.gob.ar/v1/`, Bearer token, paginación de 1.000 filas, orden por clave primaria completa y verificación del total `Content-Range`. Se rechazan duplicados y paginaciones incompletas o con cambios de cantidad. Cada conjunto se escribe atómicamente tras normalizarlo. Las revisiones que cambien valores sin alterar el conteo durante la paginación no pueden detectarse sin un mecanismo de versionado de la fuente.

Las descargas de menos de 23 horas se reutilizan, salvo `--force`. Actions restaura el último snapshot mediante una caché del directorio público; así se conserva el último dato válido entre ejecuciones y no se repite la descarga completa en cada build. El despliegue programado existente vuelve a ejecutar prebuild; con el secreto configurado renueva los datos. Si falta el token o falla la API, se conservan los archivos incluidos, mostrando siempre descarga y período disponible. Los JSON de `public/data/indec/` son datos públicos normalizados y se versionan como fallback, no son output generado de Next.js. El resto del build no depende de que INDEC responda.

En la primera implementación, los tres snapshots fueron descargados y validados con consultas autenticadas el 2026-11-03. No se usaron números de demostración como datos del INDEC. Los ingresos inicial/final de ejemplo pertenecen al simulador y se identifican como editables.

## Cobertura y cálculos

### Poder adquisitivo

- IPC nivel general (`codigo=0`, `tipo_de_indicador=Indice`), siete regiones; salarios por sector con índices, no salarios medios en pesos.
- Comparación limitada a meses observados en ambas series; IPC desde diciembre de 2016. Al 2026-11-03 el IPC llega a septiembre de 2026 y salarios a agosto de 2026, por lo que el último mes común es agosto.
- Cambio real: `((ingreso_final / ingreso_inicial) / (IPC_final / IPC_inicial) - 1) * 100`. Ingreso equivalente: `ingreso_inicial * IPC_final / IPC_inicial`.
- Los ingresos se procesan en memoria del navegador, sin persistirlos ni incluirlos en URLs o eventos de analítica. Los meses intermedios sin ingreso ingresado permanecen sin dato; no hay interpolación. El índice de salarios nacional puede compararse con el IPC regional seleccionado, con esa referencia explícita.

### Actividad

- EMAE general y 15 sectores desde enero de 2004. Se excluyen impuestos netos de subsidios del conteo de sectores.
- Sectorial: serie original, nivel o variación respecto al mismo mes del año anterior. Comparación mensual únicamente para el agregado desestacionalizado. Las trayectorias rebasadas conservan la estacionalidad de la serie original.
- Amplitud: cantidad de sectores seleccionados con variación interanual positiva / sectores seleccionados con comparación disponible. No hay ponderación ni estimación de contribución al PIB.

### Comercio exterior

- Exportaciones FOB e importaciones CIF desde enero de 2024 para limitar el tamaño de descarga y mantener navegación local fluida. La API ofrece historia anterior, fuera de la cobertura de este tablero.
- Nomenclaturas del servicio oficial. Agregación de hojas (subrubro/categoría) a país, rubro/uso económico y mes, sin sumar subtotales con detalles.
- Dólares corrientes; no se infiere volumen a partir de montos o del peso de bienes heterogéneos. Los dos flujos conservan clasificaciones y valuaciones separadas.
- `null` y signos reservados permanecen faltantes. Un grupo parcialmente publicado conserva la suma conocida y el conteo de observaciones reservadas. Todos los totales, rankings y participaciones se rotulan como montos publicados. Las categorías confidenciales y destinos indeterminados permanecen explícitos.
- El cambio del rango frente al desplazado doce meses requiere todos los meses y ausencia de reservas en ambos rangos. Una ausencia de filas no se convierte en cero. El acumulado se interrumpe ante meses sin observaciones.

## Continuidad

Estado de implementación: las tres páginas, ingestión autenticada, integración en Recursos y pruebas offline están completas. La exploración anterior permanece en `docs/research/indec-api/`.

Registro 2026-11-03 · Codex: se implementaron los tres productos solicitados; se descargaron snapshots reales con el token local del usuario, preservando cambios ajenos del checkout. Se corrigió la allowlist del root para reconocer `GEMINI.md` (ya versionado) y las carpetas locales `.agents`/`.codex`, que bloqueaban `doctor` antes de esta tarea. El resto de la allowlist sigue vigente. Se reinstalaron las dependencias con `npm ci` para alinear la instalación con el lockfile. Se verificó por nombre la existencia de `INDEC_API_TOKEN` en GitHub Actions, sin leer su valor.

Verificaciones de entrega:

- Siete pruebas offline de cálculo real, comparación por mes calendario, reservas/faltantes, duplicados, CSV seguro y snapshots.
- App principal y las siete pruebas verificados también con Node.js 20.20.2, usando snapshots existentes durante el build de compatibilidad.
- TypeScript y ESLint de los componentes y scripts nuevos, sin errores.
- `NEXT_BUILD_ENGINE=webpack npm run check`: las tres aplicaciones compilan y el smoke check encuentra las tres páginas nuevas. Turbopack no puede abrir su puerto interno en este entorno; el motor por defecto de CI no se modifica.
- Navegador sobre el export estático: ingresos/región/sector salarial modifican métricas e informe; descarga TXT contiene selección, metodología y fuente; selección de 15 sectores, selección vacía y reset; importaciones de Brasil por uso económico, acumulados y fuente del flujo activo.
- Temas claro y oscuro; sin desbordamiento horizontal de la página a 390 y 1280 px. Se ajustaron las tarjetas monetarias en pantallas pequeñas. Los tres accesos y el ancla de retorno de Recursos funcionan.
- El token configurado no aparece en los 1.189 archivos revisados del export público y las fuentes/datos nuevos.

Revisión de riesgo (`review-pr`): sin cambios en legacy, sin secretos en fuente, contenido y fórmulas revisados, sin cambios propios en migraciones, builds y controles estáticos verificados con el motor alternativo documentado. Los cambios preexistentes de Supabase y agentes quedan fuera del commit de esta tarea. La publicación sigue el proceso habitual de GitHub Actions; esta sesión prepara el cambio local.
