import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import {
  normalizeIncome,
  normalizeActivity,
  normalizeTrade,
} from "./lib/indec-normalize.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, "apps/web/.env.local"), quiet: true });
const output = path.join(root, "apps/web/public/data/indec");
const base = "https://api.indec.gob.ar/v1/";
const orders = {
  ipc_nacional:
    "clasificador,nivel,codigo,descripcion,periodo,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida",
  indice_salarios:
    "clasificador,nivel,codigo,descripcion,periodo,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,unidad_de_medida",
  "estimador-mensual-de-actividad-economica-sectores":
    "anio,mes,codigo,descripcion,periodo,tipo_de_indicador",
  "estimador-mensual-de-actividad-economica-nivel-general":
    "tipo_de_indicador_descripcion,anio,mes,periodo,tipo_de_indicador",
  comercio_exterior_nomenclaturas: "nombre_columna,codigo",
  comercio_exterior_exportacion_bienes:
    "Anio,Mes,Periodo,rubro_cod,subrubro_cod,pais_cod",
  comercio_exterior_importacion_bienes:
    "Anio,Mes,Periodo,uso_economico_cod,gce_cod,pais_cod",
};
const token = process.env.INDEC_API_TOKEN;
const force = process.argv.includes("--force");

async function fetchPage(endpoint, params) {
  const url = new URL(endpoint, base);
  url.search = new URLSearchParams(params).toString();
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, Prefer: "count=exact" },
        signal: AbortSignal.timeout(30000),
      });
      if (response.status === 429 || response.status >= 500) {
        if (attempt < 2) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1))
          );
          continue;
        }
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const rows = await response.json();
      if (!Array.isArray(rows)) throw new Error("Expected an array");
      const total = Number(
        response.headers.get("content-range")?.split("/")[1]
      );
      return { rows, total: Number.isFinite(total) ? total : null };
    } catch (error) {
      if (attempt === 2 || /^HTTP (401|403)/.test(error.message)) throw error;
    }
  }
  throw new Error("Request failed");
}
export async function fetchAll(endpoint, filters = {}) {
  const result = [];
  let expected = null;
  for (let offset = 0; offset < 500000; offset += 1000) {
    const page = await fetchPage(endpoint, {
      ...filters,
      order: orders[endpoint],
      limit: "1000",
      offset: String(offset),
    });
    if (page.total != null) {
      if (expected != null && expected !== page.total)
        throw new Error(
          "Dataset changed during pagination; preserving previous snapshot"
        );
      expected = page.total;
    }
    result.push(...page.rows);
    if (
      page.rows.length < 1000 ||
      (expected != null && result.length >= expected)
    ) {
      if (expected != null && result.length !== expected)
        throw new Error("Incomplete pagination");
      console.log(`indec: ${endpoint}: ${result.length} observations`);
      return result;
    }
  }
  throw new Error("Pagination safety limit exceeded");
}
async function sync(name, source, get) {
  const target = path.join(output, `${name}.json`);
  let previous;
  try {
    previous = JSON.parse(await readFile(target, "utf8"));
  } catch {
    /* first sync */
  }
  if (
    !force &&
    previous &&
    Date.now() - Date.parse(previous.updatedAt) < 23 * 3600000
  ) {
    console.log(`indec: ${name}: existing snapshot is less than 23 hours old`);
    return;
  }
  try {
    const data = await get();
    const snapshot = {
      source: "INDEC",
      sourceUrl: new URL(source, base).href,
      method: "api",
      updatedAt: new Date().toISOString(),
      ...data,
    };
    await writeFile(`${target}.tmp`, JSON.stringify(snapshot) + "\n");
    await rename(`${target}.tmp`, target);
    console.log(`indec: ${name}: snapshot updated`);
  } catch (error) {
    // Never log headers, token, upstream bodies or environment variables.
    console.warn(
      `indec: ${name}: ${error.message}; ${previous ? "keeping last valid snapshot" : "no snapshot available"}`
    );
    if (!previous) process.exitCode = 1;
  }
}
async function main() {
  await mkdir(output, { recursive: true });
  if (!token) {
    console.log(
      "indec: INDEC_API_TOKEN not configured; using included snapshots"
    );
    return;
  }
  await sync("income", "ipc_nacional", async () =>
    normalizeIncome(
      await fetchAll("ipc_nacional", {
        codigo: "eq.0",
        tipo_de_indicador: "eq.Indice",
      }),
      await fetchAll("indice_salarios", { tipo_de_indicador: "eq.Indice" })
    )
  );
  await sync(
    "activity",
    "estimador-mensual-de-actividad-economica-sectores",
    async () =>
      normalizeActivity(
        await fetchAll("estimador-mensual-de-actividad-economica-sectores", {
          tipo_de_indicador: "eq.Índice base 2004=100",
        }),
        await fetchAll(
          "estimador-mensual-de-actividad-economica-nivel-general",
          { tipo_de_indicador: "eq.Índice base 2004=100" }
        )
      )
  );
  await sync("trade", "comercio_exterior_exportacion_bienes", async () =>
    normalizeTrade(
      await fetchAll("comercio_exterior_exportacion_bienes", {
        Anio: "gte.2024",
      }),
      await fetchAll("comercio_exterior_importacion_bienes", {
        Anio: "gte.2024",
      }),
      await fetchAll("comercio_exterior_nomenclaturas")
    )
  );
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch(() => {
    console.warn("indec: sync failed; no credentials were logged");
    process.exitCode = 1;
  });
