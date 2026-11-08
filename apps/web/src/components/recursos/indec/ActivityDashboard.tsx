"use client";

import { useMemo, useState } from "react";
import type { ActivityData } from "@/lib/indec/types";
import {
  change,
  indexed,
  monthLabel,
  monthsBetween,
  number,
  percent,
  shiftMonth,
  valueAt,
  yoy,
} from "@/lib/indec/math";
import {
  COLORS,
  Controls,
  DataTable,
  DateRange,
  Empty,
  Field,
  Metric,
  Plot,
  Report,
  Source,
  type Insight,
} from "./Shared";

export default function ActivityDashboard({ data }: { data: ActivityData }) {
  const dates = data.original.points
    .filter((p) => p.value != null)
    .map((p) => p.date);
  const last = dates[dates.length - 1];
  const initial = dates.find((d) => d >= shiftMonth(last, -23)) ?? dates[0];
  const defaults = ["C", "D", "F", "G"].filter((id) =>
    data.sectors.some((s) => s.id === id)
  );
  const [from, setFrom] = useState(initial),
    [to, setTo] = useState(last);
  const [ids, setIds] = useState<string[]>(defaults);
  const [view, setView] = useState("yoy");
  const [mode, setMode] = useState<"line" | "bar">("line");
  const [search, setSearch] = useState("");
  const [heatMonths, setHeatMonths] = useState(12);
  const sectors = data.sectors.filter((s) => ids.includes(s.id));
  const selected = useMemo(() => monthsBetween(from, to), [from, to]);
  const ranked = sectors
    .map((s) => ({ ...s, rate: yoy(s.points, to) }))
    .filter((s): s is typeof s & { rate: number } => s.rate != null)
    .sort((a, b) => b.rate - a.rate);
  const growing = ranked.filter((s) => s.rate > 0).length;
  const breadth = ranked.length ? (growing / ranked.length) * 100 : null;
  const general = yoy(data.original.points, to);
  const monthly = change(
    valueAt(data.adjusted.points, to),
    valueAt(data.adjusted.points, shiftMonth(to, -1))
  );
  const best = ranked[0],
    worst = ranked[ranked.length - 1];
  const values = (s: ActivityData["sectors"][number]) =>
    selected.map((d) =>
      view === "yoy"
        ? yoy(s.points, d)
        : view === "indexed"
          ? indexed(s.points, d, from)
          : valueAt(s.points, d)
    );
  const context = `${monthLabel(from)} → ${monthLabel(to)} · ${sectors.length} sectores seleccionados · referencia interanual: ${monthLabel(to)}.`;
  const insights: Insight[] = [
    {
      title: "El contexto de la economía",
      text: `El EMAE general registró ${percent(general)} interanual en ${monthLabel(to)}. La variación mensual del agregado desestacionalizado fue ${percent(monthly)}. Son dos comparaciones distintas: un año atrás y el mes anterior.`,
    },
    {
      title: "Qué tan extendido está el crecimiento",
      text:
        breadth == null
          ? "No hay sectores seleccionados con observaciones interanuales comparables."
          : `${growing} de ${ranked.length} sectores comparables de tu selección tuvieron crecimiento interanual (${number(breadth)}%). Es un conteo sin ponderar: no mide su aporte al PIB ni su peso en la economía.`,
    },
    {
      title: "Los extremos de la selección",
      text: best
        ? `${best.name} tuvo la mayor variación interanual (${percent(best.rate)}). ${ranked.length > 1 && worst ? `${worst.name} registró la menor (${percent(worst.rate)}). La dispersión entre ambos fue ${number(best.rate - worst.rate)} puntos porcentuales.` : "Seleccioná más sectores para comparar la dispersión."}`
        : "Elegí al menos un sector con datos comparables en el mes de cierre.",
    },
  ];
  function reset() {
    setFrom(initial);
    setTo(last);
    setIds(defaults);
    setView("yoy");
    setMode("line");
    setSearch("");
    setHeatMonths(12);
  }
  const heatDates = selected.slice(-heatMonths);
  return (
    <>
      <Source data={data} through={last} />
      <Controls onReset={reset}>
        <DateRange
          dates={dates}
          from={from}
          to={to}
          onChange={(f, t) => {
            setFrom(f);
            setTo(t);
          }}
        />
        <Field label="Medida del gráfico">
          <select value={view} onChange={(e) => setView(e.target.value)}>
            <option value="yoy">Variación interanual · %</option>
            <option value="indexed">Trayectorias · inicio = 100</option>
            <option value="original">Nivel de actividad · 2004 = 100</option>
          </select>
        </Field>
        <Field label="Tipo de gráfico">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "line" | "bar")}
          >
            <option value="line">Líneas</option>
            <option value="bar">Barras</option>
          </select>
        </Field>
        <Field label="Meses en la matriz">
          <select
            value={heatMonths}
            onChange={(e) => setHeatMonths(Number(e.target.value))}
          >
            <option value={6}>Últimos 6 del rango</option>
            <option value={12}>Últimos 12 del rango</option>
            <option value={24}>Últimos 24 del rango</option>
          </select>
        </Field>
      </Controls>
      <fieldset className="indec-sector-picker">
        <legend>Sectores a comparar</legend>
        <div className="indec-sector-picker__tools">
          <input
            type="search"
            aria-label="Buscar sector"
            placeholder="Buscar una actividad…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="indec-button"
            onClick={() => setIds(data.sectors.map((s) => s.id))}
          >
            Todos
          </button>
          <button
            type="button"
            className="indec-button"
            onClick={() => setIds([])}
          >
            Ninguno
          </button>
        </div>
        <div className="indec-sector-picker__items">
          {data.sectors
            .filter((s) =>
              s.name
                .toLocaleLowerCase("es")
                .includes(search.toLocaleLowerCase("es"))
            )
            .map((s) => (
              <label
                key={s.id}
                className={ids.includes(s.id) ? "is-selected" : ""}
              >
                <input
                  type="checkbox"
                  checked={ids.includes(s.id)}
                  onChange={() =>
                    setIds(
                      ids.includes(s.id)
                        ? ids.filter((id) => id !== s.id)
                        : [...ids, s.id]
                    )
                  }
                />
                <i
                  style={{
                    background: COLORS[data.sectors.indexOf(s) % COLORS.length],
                  }}
                />
                <span>{s.name}</span>
              </label>
            ))}
        </div>
      </fieldset>
      <div className="indec-metrics">
        <Metric
          label="EMAE general · interanual"
          value={percent(general)}
          detail={`${monthLabel(to)} frente al mismo mes del año anterior`}
          tone={
            general == null ? undefined : general >= 0 ? "positive" : "negative"
          }
        />
        <Metric
          label="EMAE general · mensual"
          value={percent(monthly)}
          detail="Serie desestacionalizada · frente al mes anterior"
          tone={
            monthly == null ? undefined : monthly >= 0 ? "positive" : "negative"
          }
        />
        <Metric
          label="Sectores de tu selección en alza"
          value={ranked.length ? `${growing} / ${ranked.length}` : "—"}
          detail={`${number(breadth)}% de los sectores con datos comparables`}
        />
        <Metric
          label="Mayor variación de la selección"
          value={best ? percent(best.rate) : "—"}
          detail={best?.name ?? "Seleccioná sectores para comparar"}
        />
      </div>
      {!sectors.length ? (
        <Empty>
          Seleccioná actividades en el panel de sectores para ver sus gráficos y
          resultados.
        </Empty>
      ) : (
        <>
          <Plot
            title="Trayectorias que cuentan historias distintas"
            subtitle={
              view === "yoy"
                ? "Comparación con el mismo mes del año anterior. Activá y desactivá series en la leyenda."
                : view === "indexed"
                  ? `Series originales rebasadas a ${monthLabel(from)} = 100; incluyen estacionalidad.`
                  : "Índices originales, base 2004 = 100; incluyen estacionalidad."
            }
            labels={selected.map(monthLabel)}
            series={sectors.map((s) => ({
              label: s.name,
              data: values(s),
              color: COLORS[data.sectors.indexOf(s) % COLORS.length],
            }))}
            mode={mode}
            unit={view === "yoy" ? "%" : "índice"}
          />
          <section className="indec-panel">
            <div className="indec-panel__head">
              <div>
                <h2>La actividad, sector por sector</h2>
                <p>
                  Variación interanual · verde: crecimiento; rojo: caída. Los
                  guiones indican falta de comparación.
                </p>
              </div>
            </div>
            <div
              className="indec-table-scroll"
              role="region"
              aria-label="Matriz de actividad interanual"
              tabIndex={0}
            >
              <table className="indec-heatmap">
                <caption className="sr-only">
                  Variaciones interanuales de los sectores seleccionados. Hacé
                  clic en el nombre para aislar un sector.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Actividad</th>
                    {heatDates.map((d) => (
                      <th scope="col" key={d}>
                        {monthLabel(d)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sectors.map((s) => (
                    <tr key={s.id}>
                      <th scope="row">
                        <button
                          type="button"
                          onClick={() => setIds([s.id])}
                          title="Ver sólo este sector"
                        >
                          {s.name}
                        </button>
                      </th>
                      {heatDates.map((d) => {
                        const v = yoy(s.points, d);
                        const alpha =
                          v == null
                            ? 0
                            : Math.min(0.42, 0.06 + Math.abs(v) / 60);
                        return (
                          <td
                            key={d}
                            style={{
                              backgroundColor:
                                v == null
                                  ? "transparent"
                                  : `rgba(${v >= 0 ? "52,211,153" : "251,113,133"},${alpha})`,
                            }}
                          >
                            {percent(v)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
      <Plot
        title="La señal mensual de la economía"
        subtitle="Sólo nivel general desestacionalizado. No se aplica ajuste propio a las series sectoriales."
        labels={selected.map(monthLabel)}
        series={[
          {
            label: "EMAE desestacionalizado",
            data: selected.map((d) => valueAt(data.adjusted.points, d)),
            color: "var(--chart-3)",
          },
        ]}
        unit="2004 = 100"
      />
      <Report
        title="Informe de actividad económica"
        filename="mga-actividad-argentina"
        provenance={data}
        context={context}
        insights={insights}
        methodology={
          <>
            <p>
              Las variaciones interanuales se calculan como (índice del mes /
              índice del mismo mes del año anterior − 1) × 100. La comparación
              mensual usa únicamente el EMAE general desestacionalizado. Las
              series sectoriales originales incluyen estacionalidad.
            </p>
            <p>
              La amplitud se calcula sobre los sectores seleccionados con datos
              interanuales disponibles. No pondera el tamaño de las actividades
              ni mide contribuciones al PIB. Se excluye «Impuestos netos de
              subsidios» del conjunto de sectores. Las revisiones del INDEC
              pueden modificar la historia.
            </p>
            <p>
              Al rebasar una serie a 100, comparamos trayectorias, no el tamaño
              absoluto de cada sector. Los resultados son descriptivos y no
              identifican causas ni predicen actividad futura.
            </p>
            <a
              href="https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_emae_ago_16.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Metodología EMAE · INDEC ↗
            </a>
          </>
        }
      />
      <DataTable
        headers={[
          "Período",
          "Sector",
          "Índice original · 2004=100",
          "Variación interanual · %",
          "Base inicio=100",
        ]}
        rows={selected.flatMap((d) =>
          sectors.map((s) => [
            d,
            s.name,
            valueAt(s.points, d),
            yoy(s.points, d),
            indexed(s.points, d, from),
          ])
        )}
        filename="mga-actividad-argentina"
      />
    </>
  );
}
