/** Normalizers for the public INDEC v1 contract. No credentials enter the output. */
export function period(value) {
  const digits = String(value).replace(/\D/g, "");
  const date = `${digits.slice(0, 4)}-${digits.slice(4, 6)}`;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(date))
    throw new Error("Invalid INDEC period");
  return date;
}
export function numeric(value) {
  if (
    value == null ||
    (typeof value === "string" && !value.trim()) ||
    typeof value === "boolean"
  )
    return null;
  const n =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
export function series(rows, id, name) {
  const map = new Map();
  for (const row of rows) {
    const date = period(row.periodo);
    if (map.has(date))
      throw new Error(`Ambiguous observations for ${id}/${date}`);
    const value = numeric(row.valor);
    map.set(date, {
      date,
      value,
      ...(row.observaciones || row.valor_null
        ? { note: String(row.observaciones || row.valor_null) }
        : {}),
    });
  }
  const points = [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (points.filter((p) => p.value != null).length < 2)
    throw new Error(`Insufficient observations for ${id}`);
  return { id, name, points };
}
export function normalizeIncome(prices, wages) {
  const regions = [...new Set(prices.map((r) => r.region))].sort();
  const codes = [...new Set(wages.map((r) => r.codigo))].sort();
  const result = {
    prices: regions.map((region) =>
      series(
        prices.filter((r) => r.region === region),
        region,
        region
      )
    ),
    wages: codes.map((code) => {
      const rows = wages.filter((r) => r.codigo === code);
      return series(rows, code, rows[0].descripcion);
    }),
  };
  if (!result.prices.some((s) => s.name === "Nacional") || !result.wages.length)
    throw new Error("Missing income dimensions");
  return result;
}
export function normalizeActivity(sectors, general) {
  const codes = [...new Set(sectors.map((r) => r.codigo))].sort();
  return {
    // Taxes are not an activity sector and do not enter the breadth denominator.
    sectors: codes
      .filter((code) => /^[A-O]$/.test(code))
      .map((code) => {
        const rows = sectors.filter((r) => r.codigo === code);
        return series(rows, code, rows[0].descripcion);
      }),
    original: series(
      general.filter(
        (r) => r.tipo_de_indicador_descripcion === "Índice serie original"
      ),
      "general",
      "EMAE · nivel general"
    ),
    adjusted: series(
      general.filter(
        (r) =>
          r.tipo_de_indicador_descripcion === "Índice serie desestacionalizada"
      ),
      "adjusted",
      "EMAE · desestacionalizado"
    ),
  };
}
export function normalizeTrade(exports, imports, nomenclatures) {
  const dict = (name) =>
    Object.fromEntries(
      nomenclatures
        .filter((r) => r.nombre_columna === name)
        .map((r) => [r.codigo, r.codigo_descripcion])
    );
  const groups = new Map();
  const seen = new Set();
  for (const [flow, rows] of [
    ["exports", exports],
    ["imports", imports],
  ]) {
    for (const row of rows) {
      const date = period(row.Periodo);
      const country = String(row.pais_cod);
      const category = String(
        flow === "exports" ? row.rubro_cod : row.uso_economico_cod
      );
      const detail = String(
        flow === "exports" ? row.subrubro_cod : row.gce_cod
      );
      const primary = [date, flow, country, category, detail].join("|");
      if (seen.has(primary))
        throw new Error(
          "Duplicate trade observation: aborting to avoid double counting"
        );
      seen.add(primary);
      const key = [date, flow, country, category].join("|");
      const group = groups.get(key) ?? {
        date,
        flow,
        country,
        category,
        value: null,
        suppressed: 0,
      };
      const value = numeric(flow === "exports" ? row.valor_FOB : row.valor_CIF);
      if (value == null) group.suppressed++;
      else group.value = (group.value ?? 0) + value;
      groups.set(key, group);
    }
  }
  const rows = [...groups.values()].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.flow.localeCompare(b.flow) ||
      a.country.localeCompare(b.country) ||
      a.category.localeCompare(b.category)
  );
  if (!exports.length || !imports.length || !rows.length)
    throw new Error("Missing trade flow");
  return {
    rows,
    countries: dict("pais_cod"),
    exportCategories: dict("rubro_cod"),
    importCategories: dict("uso_economico_cod"),
  };
}
