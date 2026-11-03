import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  normalizeTrade,
  series,
  numeric,
  period,
} from "../lib/indec-normalize.mjs";
import ts from "typescript";

// Exercise the browser's actual pure calculations without adding a test runtime.
const source = await readFile(
  new URL("../../apps/web/src/lib/indec/math.ts", import.meta.url),
  "utf8"
);
const js = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const math = await import(
  `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`
);

test("purchasing power divides growth factors, rather than subtracting percentage changes", () => {
  assert.ok(Math.abs(math.realChange(100, 150, 100, 125) - 20) < 1e-9);
  assert.equal(math.realChange(100, 0, 100, 125), -100);
  assert.equal(math.realChange(0, 150, 100, 125), null);
  assert.equal(math.realChange(100, 150, null, 125), null);
});
test("year-on-year comparisons use calendar months and preserve gaps", () => {
  const points = [
    { date: "2024-02", value: 100 },
    { date: "2025-02", value: 110 },
    { date: "2025-03", value: 120 },
  ];
  assert.ok(Math.abs(math.yoy(points, "2025-02") - 10) < 1e-9);
  assert.equal(math.yoy(points, "2025-03"), null);
  assert.equal(math.shiftMonth("2025-01", -1), "2024-12");
  assert.deepEqual(math.monthsBetween("2024-12", "2025-02"), [
    "2024-12",
    "2025-01",
    "2025-02",
  ]);
  assert.deepEqual(math.monthsBetween("2025-02", "2024-12"), []);
});
test("missing trade months prevent a misleading comparable total or cumulative curve", () => {
  assert.equal(
    math.completeTotal(
      [
        { date: "2025-01", value: 10 },
        { date: "2025-03", value: 20 },
      ],
      "2025-01",
      "2025-03"
    ),
    null
  );
  assert.equal(
    math.completeTotal([{ date: "2025-01", value: 0 }], "2025-01", "2025-01"),
    0
  );
  assert.deepEqual(math.cumulativeValues([10, null, 20]), [10, null, null]);
});
test("confidential and missing amounts stay unknown; published zero remains zero", () => {
  assert.equal(numeric("s"), null);
  assert.equal(numeric(null), null);
  assert.equal(numeric(""), null);
  assert.equal(numeric(0), 0);
  const common = {
    Anio: 2025,
    Mes: 1,
    Periodo: "202501",
    pais_cod: "BR",
    rubro_cod: "1",
  };
  const trade = normalizeTrade(
    [
      { ...common, subrubro_cod: "101", valor_FOB: 10 },
      { ...common, subrubro_cod: "102", valor_FOB: null, valor_FOB_null: "s" },
    ],
    [
      {
        Periodo: "202501",
        pais_cod: "BR",
        uso_economico_cod: "1",
        gce_cod: "111",
        valor_CIF: 0,
      },
    ],
    []
  );
  const exp = trade.rows.find((r) => r.flow === "exports");
  assert.equal(exp.value, 10);
  assert.equal(exp.suppressed, 1);
  assert.equal(trade.rows.find((r) => r.flow === "imports").value, 0);
});
test("duplicate observations abort instead of silently doubling totals", () => {
  const row = {
    Periodo: "202501",
    pais_cod: "BR",
    rubro_cod: "1",
    subrubro_cod: "101",
    valor_FOB: 10,
  };
  assert.throws(
    () =>
      normalizeTrade(
        [row, row],
        [
          {
            Periodo: "202501",
            pais_cod: "BR",
            uso_economico_cod: "1",
            gce_cod: "111",
            valor_CIF: 1,
          },
        ],
        []
      ),
    /Duplicate/
  );
  assert.throws(
    () =>
      series(
        [
          { periodo: "202501", valor: 1 },
          { periodo: "202501", valor: 2 },
        ],
        "a",
        "A"
      ),
    /Ambiguous/
  );
  assert.throws(() => period("202513"), /Invalid/);
});
test("CSV export quotes delimiters and prevents spreadsheet formula execution", () => {
  const csv = math.toCsv(
    ["País", "Valor"],
    [
      ['=HYPERLINK("bad")', -12],
      ["Brasil; Argentina", null],
    ]
  );
  assert.ok(csv.includes('"\'=HYPERLINK(""bad"")"'));
  assert.ok(csv.includes('"-12"'));
  assert.ok(csv.includes('"Brasil; Argentina"'));
});
test("included snapshots have authentic provenance, sorted periods and complete calendar coverage", async () => {
  for (const name of ["income", "activity", "trade"]) {
    const snapshot = JSON.parse(
      await readFile(
        new URL(
          `../../apps/web/public/data/indec/${name}.json`,
          import.meta.url
        ),
        "utf8"
      )
    );
    assert.equal(snapshot.source, "INDEC");
    assert.ok(snapshot.sourceUrl.startsWith("https://api.indec.gob.ar/v1/"));
    assert.ok(Number.isFinite(Date.parse(snapshot.updatedAt)));
    if (name === "income") {
      assert.ok(snapshot.prices.some((s) => s.name === "Nacional"));
      for (const s of [...snapshot.prices, ...snapshot.wages])
        assert.equal(
          new Set(s.points.map((p) => p.date)).size,
          s.points.length
        );
    }
    if (name === "activity") assert.equal(snapshot.sectors.length, 15);
    if (name === "trade") {
      const dates = [...new Set(snapshot.rows.map((r) => r.date))].sort();
      assert.deepEqual(dates, math.monthsBetween(dates[0], dates.at(-1)));
      assert.ok(snapshot.rows.some((r) => r.suppressed > 0));
      assert.ok(
        snapshot.rows.every((r) => r.value == null || Number.isFinite(r.value))
      );
    }
  }
});
