"use client";

import { useMemo, useState } from "react";
import type { IncomeData } from "@/lib/indec/types";
import {
  change,
  indexed,
  money,
  monthLabel,
  monthsBetween,
  percent,
  realChange,
  shiftMonth,
  valueAt,
} from "@/lib/indec/math";
import {
  Controls,
  DateRange,
  DataTable,
  Empty,
  Field,
  Metric,
  Plot,
  Report,
  Source,
  type Insight,
} from "./Shared";

export default function IncomeDashboard({ data }: { data: IncomeData }) {
  const [region, setRegion] = useState(
    data.prices.find((s) => s.name === "Nacional")?.id ?? data.prices[0].id
  );
  const [wageId, setWageId] = useState(
    data.wages.find((s) => s.id === "000")?.id ?? data.wages[0].id
  );
  const prices = data.prices.find((s) => s.id === region) ?? data.prices[0];
  const wages = data.wages.find((s) => s.id === wageId) ?? data.wages[0];
  // Comparisons always use the intersection: no carrying a lagging wage index forward.
  const dates = useMemo(
    () =>
      prices.points
        .filter((p) => p.value != null && valueAt(wages.points, p.date) != null)
        .map((p) => p.date),
    [prices, wages]
  );
  const last = dates[dates.length - 1];
  const firstDefault =
    dates.find((d) => d >= shiftMonth(last, -12)) ?? dates[0];
  const [from, setFrom] = useState(firstDefault);
  const [to, setTo] = useState(last);
  const [start, setStart] = useState("1000000");
  const [end, setEnd] = useState("1200000");
  const [history, setHistory] = useState<Record<string, string>>({});
  const [view, setView] = useState("real");
  const [chart, setChart] = useState<"line" | "bar">("line");
  const validDates = dates.includes(from) && dates.includes(to) && from <= to;
  const selected = validDates ? monthsBetween(from, to) : [];
  const initial = start.trim() ? Number(start) : NaN,
    final = end.trim() ? Number(end) : NaN;
  const valid =
    validDates &&
    Number.isFinite(initial) &&
    initial > 0 &&
    Number.isFinite(final) &&
    final >= 0;
  const p0 = valueAt(prices.points, from),
    p1 = valueAt(prices.points, to);
  const inflation = change(p1, p0);
  const actual = valid ? realChange(initial, final, p0, p1) : null;
  const equivalent =
    valid && p0 != null && p0 > 0 && p1 != null ? (initial * p1) / p0 : null;
  const salaryChange = change(
    valueAt(wages.points, to),
    valueAt(wages.points, from)
  );
  const salaryReal =
    validDates && salaryChange != null && inflation != null
      ? ((1 + salaryChange / 100) / (1 + inflation / 100) - 1) * 100
      : null;
  const ownAt = (date: string) => {
    if (!valid) return null;
    if (date === from) return initial;
    if (date === to) return final;
    const raw = history[date];
    return raw?.trim() && Number.isFinite(Number(raw)) && Number(raw) >= 0
      ? Number(raw)
      : null;
  };
  const ownReal = selected.map((d) => {
    const v = ownAt(d),
      p = valueAt(prices.points, d);
    return v != null && p != null && p0 != null && p > 0
      ? (v / initial / (p / p0)) * 100
      : null;
  });
  const salarySeries = selected.map((d) => {
    const w = indexed(wages.points, d, from),
      p = indexed(prices.points, d, from);
    return view === "real"
      ? w != null && p != null && p > 0
        ? (w / p) * 100
        : null
      : w;
  });
  const rows = selected.map((d) => [
    d,
    valueAt(prices.points, d),
    valueAt(wages.points, d),
    ownAt(d),
    ownReal[selected.indexOf(d)],
  ]);
  const context = `${monthLabel(from)} → ${monthLabel(to)} · IPC ${prices.name} · referencia salarial: ${wages.name}.`;
  const insights: Insight[] =
    actual != null && equivalent != null
      ? [
          {
            title:
              actual > 0
                ? "Tu ingreso ganó capacidad de compra"
                : actual < 0
                  ? "Tu ingreso perdió capacidad de compra"
                  : "Conservaste tu capacidad de compra",
            text: `La variación real entre ambos meses fue ${percent(actual)}. El ingreso nominal cambió ${percent(change(final, initial))}, frente a una variación de precios de ${percent(inflation)}.`,
          },
          {
            title: "El ingreso que mantiene el punto de partida",
            text: `Para comprar el equivalente de ${money(initial)} de ${monthLabel(from)}, necesitabas ${money(equivalent)} en ${monthLabel(to)}. La diferencia con tu ingreso final es ${money(final - equivalent)}.`,
          },
          {
            title: "Una referencia para ponerlo en contexto",
            text:
              salaryReal == null
                ? "No hay un par de observaciones salariales comparables en este período."
                : `El índice de ${wages.name.toLowerCase()} cambió ${percent(salaryReal)} en términos reales en el mismo período. Es una referencia estadística; no representa un salario promedio en pesos.`,
          },
        ]
      : [
          {
            title: "Completá una comparación válida",
            text: "Ingresá un monto inicial mayor a cero, un monto final no negativo y dos meses con observaciones de precios y salarios.",
          },
        ];
  function reset() {
    setRegion(
      data.prices.find((s) => s.name === "Nacional")?.id ?? data.prices[0].id
    );
    setWageId(data.wages.find((s) => s.id === "000")?.id ?? data.wages[0].id);
    setFrom(firstDefault);
    setTo(last);
    setStart("1000000");
    setEnd("1200000");
    setHistory({});
    setView("real");
    setChart("line");
  }
  function selectDimension(nextRegion: string, nextWage: string) {
    const p = data.prices.find((s) => s.id === nextRegion)!,
      w = data.wages.find((s) => s.id === nextWage)!;
    const available = p.points
      .filter((x) => x.value != null && valueAt(w.points, x.date) != null)
      .map((x) => x.date);
    setRegion(nextRegion);
    setWageId(nextWage);
    if (!available.includes(from)) setFrom(available[0]);
    if (!available.includes(to)) setTo(available[available.length - 1]);
  }
  return (
    <>
      <Source data={data} through={last} />
      <Controls onReset={reset}>
        <Field label="Región del IPC">
          <select
            value={region}
            onChange={(e) => selectDimension(e.target.value, wageId)}
          >
            {data.prices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Referencia salarial">
          <select
            value={wageId}
            onChange={(e) => selectDimension(region, e.target.value)}
          >
            {data.wages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <DateRange
          dates={dates}
          from={from}
          to={to}
          onChange={(f, t) => {
            setFrom(f);
            setTo(t);
          }}
        />
        <Field
          label="Ingreso inicial · ARS"
          hint="Monto de ejemplo editable. Usá neto con neto o bruto con bruto."
        >
          <input
            type="number"
            min="1"
            step="1000"
            inputMode="decimal"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </Field>
        <Field
          label="Ingreso final · ARS"
          hint="Los montos se procesan sólo en tu navegador."
        >
          <input
            type="number"
            min="0"
            step="1000"
            inputMode="decimal"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </Field>
        <Field label="Lectura del gráfico">
          <select value={view} onChange={(e) => setView(e.target.value)}>
            <option value="real">Poder adquisitivo · base 100</option>
            <option value="nominal">Ingresos y precios · base 100</option>
          </select>
        </Field>
        <Field label="Tipo de gráfico">
          <select
            value={chart}
            onChange={(e) => setChart(e.target.value as "line" | "bar")}
          >
            <option value="line">Líneas</option>
            <option value="bar">Barras</option>
          </select>
        </Field>
      </Controls>
      {!valid && (
        <Empty>
          Completá montos válidos y un rango con datos. Los resultados se
          actualizarán automáticamente.
        </Empty>
      )}
      <div className="indec-metrics">
        <Metric
          label="Variación real de tu ingreso"
          value={percent(actual)}
          detail="Cambio en la capacidad de compra entre los dos meses"
          tone={
            actual == null ? undefined : actual >= 0 ? "positive" : "negative"
          }
        />
        <Metric
          label="Inflación del período"
          value={percent(validDates ? inflation : null)}
          detail={`IPC ${prices.name} · acumulada entre fechas`}
        />
        <Metric
          label="Ingreso equivalente al final"
          value={money(equivalent)}
          detail="Monto necesario para mantener tu poder adquisitivo inicial"
        />
        <Metric
          label="Diferencia frente al equivalente"
          value={money(valid && equivalent != null ? final - equivalent : null)}
          detail="Ingreso final menos ingreso necesario"
          tone={
            !valid || equivalent == null
              ? undefined
              : final >= equivalent
                ? "positive"
                : "negative"
          }
        />
      </div>
      <Plot
        title={
          view === "real"
            ? "La evolución de tu capacidad de compra"
            : "Ingresos y precios, en una misma escala"
        }
        subtitle={`Base ${monthLabel(from)} = 100. Los ingresos propios muestran sólo los meses que completaste.`}
        labels={selected.map(monthLabel)}
        mode={chart}
        unit="índice"
        series={
          view === "real"
            ? [
                { label: "Tu ingreso real", data: ownReal },
                { label: `${wages.name} · real`, data: salarySeries },
                {
                  label: "Poder adquisitivo inicial",
                  data: selected.map(() => 100),
                  color: "var(--chart-8)",
                },
              ]
            : [
                {
                  label: "Tu ingreso nominal",
                  data: selected.map((d) => {
                    const v = ownAt(d);
                    return v == null ? null : (v / initial) * 100;
                  }),
                },
                {
                  label: "IPC",
                  data: selected.map((d) => indexed(prices.points, d, from)),
                },
                { label: wages.name, data: salarySeries },
              ]
        }
      />
      <details className="indec-history">
        <summary>
          Completar ingresos por mes{" "}
          <span>Opcional · sin interpolar ni inventar datos</span>
        </summary>
        <p>
          Completá los meses intermedios para ver tu trayectoria. Los casilleros
          vacíos permanecen sin dato. Los extremos se editan en los controles de
          arriba.
        </p>
        <div className="indec-history__grid">
          {selected
            .filter((d) => d !== from && d !== to)
            .map((d) => (
              <Field key={d} label={`Ingreso · ${monthLabel(d)}`}>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1000"
                  placeholder="Sin dato"
                  value={history[d] ?? ""}
                  onChange={(e) =>
                    setHistory({ ...history, [d]: e.target.value })
                  }
                />
              </Field>
            ))}
        </div>
      </details>
      <Report
        title="Informe de poder adquisitivo"
        filename="mga-poder-adquisitivo"
        provenance={data}
        context={context}
        insights={insights}
        methodology={
          <>
            <p>
              Variación real = [(ingreso final / ingreso inicial) / (IPC final /
              IPC inicial) − 1] × 100. Ingreso equivalente = ingreso inicial ×
              IPC final / IPC inicial. Se comparan niveles mensuales del IPC,
              sin sumar tasas de inflación.
            </p>
            <p>
              El IPC mide la evolución de una canasta representativa de cada
              región; no mide tu inflación personal ni permite comparar costos
              de vida absolutos entre regiones. Los índices salariales
              nacionales se rebasan al mismo mes inicial. La serie usada llega
              hasta el último mes común a ambas fuentes.
            </p>
            <p>
              Si elegís el mismo mes para ambos extremos, el cálculo compara los
              dos montos a iguales precios; el gráfico sólo puede representar un
              punto temporal. No se almacenan ni envían tus ingresos.
            </p>
            <a
              href="https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_ipc_nacional_2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Metodología IPC · INDEC ↗
            </a>
          </>
        }
      />
      <DataTable
        headers={[
          "Período",
          "IPC · índice",
          "Salarios · índice",
          "Ingreso propio · ARS",
          "Ingreso real · base 100",
        ]}
        rows={rows}
        filename="mga-poder-adquisitivo"
      />
    </>
  );
}
