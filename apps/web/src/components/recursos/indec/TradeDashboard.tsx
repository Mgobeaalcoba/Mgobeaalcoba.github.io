"use client";

import { useMemo, useState } from "react";
import type { TradeData } from "@/lib/indec/types";
import {
  completeTotal,
  change,
  cumulativeValues,
  groupTrade,
  monthLabel,
  monthsBetween,
  number,
  percent,
  shiftMonth,
} from "@/lib/indec/math";
import {
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

export default function TradeDashboard({ data }: { data: TradeData }) {
  const dates = useMemo(
    () => Array.from(new Set(data.rows.map((r) => r.date))).sort(),
    [data.rows]
  );
  const last = dates[dates.length - 1],
    initial = dates.find((d) => d >= shiftMonth(last, -11)) ?? dates[0];
  const [flow, setFlow] = useState<"exports" | "imports">("exports");
  const [country, setCountry] = useState("all"),
    [category, setCategory] = useState("all");
  const [from, setFrom] = useState(initial),
    [to, setTo] = useState(last);
  const [dimension, setDimension] = useState<"country" | "category">("country");
  const [top, setTop] = useState(8);
  const [scale, setScale] = useState("millions");
  const [mode, setMode] = useState<"line" | "bar">("bar");
  const [cumulative, setCumulative] = useState(false);
  const categories =
    flow === "exports" ? data.exportCategories : data.importCategories;
  const unit = scale === "millions" ? "millones USD" : "USD";
  const divisor = scale === "millions" ? 1e6 : 1;
  const valuation = flow === "exports" ? "FOB" : "CIF";
  const flowName = flow === "exports" ? "Exportaciones" : "Importaciones";
  const provenance = {
    ...data,
    sourceUrl: `https://api.indec.gob.ar/v1/comercio_exterior_${flow === "exports" ? "exportacion" : "importacion"}_bienes`,
  };
  const filtered = useMemo(
    () =>
      data.rows.filter(
        (r) =>
          r.flow === flow &&
          (country === "all" || r.country === country) &&
          (category === "all" || r.category === category)
      ),
    [data.rows, flow, country, category]
  );
  const rows = useMemo(
    () => filtered.filter((r) => r.date >= from && r.date <= to),
    [filtered, from, to]
  );
  const available = rows.filter((r) => r.value != null);
  const total = available.length
    ? available.reduce((sum, r) => sum + (r.value ?? 0), 0)
    : null;
  const suppressed = rows.reduce((sum, r) => sum + r.suppressed, 0);
  const countries = useMemo(
    () =>
      Array.from(
        new Set(data.rows.filter((r) => r.flow === flow).map((r) => r.country))
      ).sort((a, b) =>
        (data.countries[a] ?? a).localeCompare(data.countries[b] ?? b, "es")
      ),
    [data, flow]
  );
  const categoryCodes = useMemo(
    () =>
      Array.from(
        new Set(data.rows.filter((r) => r.flow === flow).map((r) => r.category))
      ).sort(),
    [data.rows, flow]
  );
  const ranked = groupTrade(rows, dimension).filter((g) => g.available > 0);
  const names = dimension === "country" ? data.countries : categories;
  const leading = ranked[0];
  const topShare =
    total != null && total > 0
      ? (ranked.slice(0, 5).reduce((sum, r) => sum + r.value, 0) / total) * 100
      : null;
  const selected = monthsBetween(from, to);
  const monthly = selected.map((date) => {
    const matches = rows.filter((r) => r.date === date && r.value != null);
    return {
      date,
      value: matches.length
        ? matches.reduce((sum, r) => sum + (r.value ?? 0), 0)
        : null,
    };
  });
  const priorFrom = shiftMonth(from, -12),
    priorTo = shiftMonth(to, -12);
  const priorRows = filtered.filter(
    (r) => r.date >= priorFrom && r.date <= priorTo
  );
  const priorSuppressed = priorRows.reduce((sum, r) => sum + r.suppressed, 0);
  const currentComplete = suppressed ? null : completeTotal(rows, from, to);
  const previousComplete = priorSuppressed
    ? null
    : completeTotal(priorRows, priorFrom, priorTo);
  const growth = change(currentComplete, previousComplete);
  const displayed = cumulative
    ? cumulativeValues(monthly.map((r) => r.value))
    : monthly.map((r) => r.value);
  const series = displayed.map((v) => (v == null ? null : v / divisor));
  const shown = ranked.slice(0, top),
    rest = ranked.slice(top).reduce((sum, r) => sum + r.value, 0);
  const composition = [
    ...shown.map((r) => ({
      name: names[r.id] ?? r.id,
      value: total ? (r.value / total) * 100 : 0,
    })),
    ...(rest > 0 && total
      ? [{ name: "Resto de la selección", value: (rest / total) * 100 }]
      : []),
  ];
  const context = `${flowName} ${valuation} · ${monthLabel(from)} → ${monthLabel(to)} · ${country === "all" ? "todos los destinos/orígenes" : (data.countries[country] ?? country)} · ${category === "all" ? "todas las categorías" : (categories[category] ?? category)}.`;
  const insights: Insight[] = [
    {
      title: "El tamaño de los montos publicados",
      text:
        total == null
          ? "No hay montos publicados para esta combinación de filtros. La ausencia de filas no se interpreta como comercio igual a cero."
          : `Tu selección reúne ${number(total / 1e6, 2)} millones de USD ${valuation} publicados. ${growth == null ? "La comparación con el mismo rango un año atrás no está disponible por cobertura incompleta o datos reservados." : `La variación frente al mismo rango un año atrás es ${percent(growth)}.`}`,
    },
    {
      title:
        dimension === "country"
          ? "Destinos y orígenes con mayor participación"
          : "La composición por categorías",
      text:
        leading && total
          ? `${names[leading.id] ?? leading.id} concentra ${number((leading.value / total) * 100)}% del monto publicado de tu selección. Los cinco mayores grupos representan ${number(topShare)}%. El denominador es la suma de valores publicados para estos filtros.`
          : "No hay suficientes montos publicados para calcular participaciones.",
    },
    {
      title: "Lo que cambia la lectura",
      text: `${suppressed ? `Hay ${number(suppressed, 0)} observaciones reservadas o no disponibles en esta selección; las sumas y participaciones describen únicamente los valores publicados. ` : "No se detectaron valores reservados en esta selección. "}Los montos están en dólares corrientes: una variación de valor no equivale a una variación del volumen. Los destinos indeterminados y la categoría confidencial se conservan con su nombre oficial.`,
    },
  ];
  function reset() {
    setFlow("exports");
    setCountry("all");
    setCategory("all");
    setFrom(initial);
    setTo(last);
    setDimension("country");
    setTop(8);
    setScale("millions");
    setMode("bar");
    setCumulative(false);
  }
  function changeFlow(value: "exports" | "imports") {
    setFlow(value);
    setCategory("all");
    if (!data.rows.some((r) => r.flow === value && r.country === country))
      setCountry("all");
  }
  return (
    <>
      <Source data={provenance} through={last} />
      <Controls onReset={reset}>
        <Field label="Flujo comercial">
          <select
            value={flow}
            onChange={(e) =>
              changeFlow(e.target.value as "exports" | "imports")
            }
          >
            <option value="exports">Exportaciones · FOB</option>
            <option value="imports">Importaciones · CIF</option>
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
        <Field label={flow === "exports" ? "País / destino" : "País / origen"}>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="all">Todos · incluye indeterminados</option>
            {countries.map((id) => (
              <option value={id} key={id}>
                {data.countries[id] ?? id}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={
            flow === "exports"
              ? "Rubro de exportación"
              : "Uso económico de importación"
          }
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Todos</option>
            {categoryCodes.map((id) => (
              <option value={id} key={id}>
                {categories[id] ?? id}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Agrupar ranking por">
          <select
            value={dimension}
            onChange={(e) =>
              setDimension(e.target.value as "country" | "category")
            }
          >
            <option value="country">País / destino / origen</option>
            <option value="category">Rubro / uso económico</option>
          </select>
        </Field>
        <Field label="Unidad monetaria">
          <select value={scale} onChange={(e) => setScale(e.target.value)}>
            <option value="millions">Millones de USD</option>
            <option value="usd">USD</option>
          </select>
        </Field>
        <Field label="Tipo de gráfico temporal">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "line" | "bar")}
          >
            <option value="bar">Barras</option>
            <option value="line">Líneas</option>
          </select>
        </Field>
        <Field label={`Grupos en el ranking: ${top}`}>
          <input
            type="range"
            min="3"
            max="15"
            value={top}
            onChange={(e) => setTop(Number(e.target.value))}
          />
        </Field>
        <Field label="Lectura temporal">
          <select
            value={String(cumulative)}
            onChange={(e) => setCumulative(e.target.value === "true")}
          >
            <option value="false">Montos mensuales</option>
            <option value="true">Acumulado desde el inicio del rango</option>
          </select>
        </Field>
      </Controls>
      {suppressed > 0 && (
        <p className="indec-data-notice">
          Esta selección contiene datos reservados o no disponibles. Los totales
          y las participaciones se calculan sobre los montos publicados; las
          reservas no se reemplazan por cero.
        </p>
      )}
      {!available.length && (
        <Empty>
          Probá otro país, categoría o período. Una selección sin observaciones
          permanece sin datos.
        </Empty>
      )}
      <div className="indec-metrics">
        <Metric
          label={`Monto publicado · ${valuation}`}
          value={
            total == null
              ? "—"
              : number(total / divisor, scale === "millions" ? 2 : 0)
          }
          detail={`${unit} corrientes · suma de la selección`}
        />
        <Metric
          label="Grupos con valores publicados"
          value={number(ranked.length, 0)}
          detail={
            dimension === "country"
              ? "Destinos/orígenes · incluye indeterminados"
              : "Rubros/usos económicos en tu selección"
          }
        />
        <Metric
          label="Participación de los 5 mayores"
          value={topShare == null ? "—" : `${number(topShare)}%`}
          detail="Sobre el monto publicado de tu selección"
        />
        <Metric
          label="Variación del rango · un año atrás"
          value={percent(growth)}
          detail={
            growth == null
              ? "Requiere ambos rangos completos y sin reservas"
              : "Mismos meses del año anterior · valor nominal"
          }
        />
      </div>
      <Plot
        title={`${flowName}, mes a mes`}
        subtitle={`${cumulative ? "Acumulado dentro del rango elegido" : "Montos mensuales publicados"} · ${valuation} · ${unit} corrientes.`}
        labels={selected.map(monthLabel)}
        series={[{ label: `${flowName} ${valuation}`, data: series }]}
        mode={mode}
        unit={unit}
      />
      <div className="indec-chart-grid">
        <Plot
          title={
            dimension === "country"
              ? "Principales destinos y orígenes"
              : "Principales categorías"
          }
          subtitle={`Hasta ${top} grupos · ordenados por monto publicado de la selección.`}
          labels={shown.map((r) => names[r.id] ?? r.id)}
          series={[
            {
              label: `${flowName} ${valuation}`,
              data: shown.map((r) => r.value / divisor),
            },
          ]}
          mode="bar"
          horizontal
          tall
          unit={unit}
        />
        <Plot
          title="Cómo se distribuye tu selección"
          subtitle="Participaciones sobre la suma de montos publicados. El resto agrupa los grupos fuera del ranking."
          labels={composition.map((r) => r.name)}
          series={[
            { label: "Participación", data: composition.map((r) => r.value) },
          ]}
          mode="doughnut"
          unit="%"
          tall
        />
      </div>
      <Report
        title="Informe de comercio exterior argentino"
        context={context}
        filename="mga-comercio-exterior"
        provenance={provenance}
        insights={insights}
        methodology={
          <>
            <p>
              Fuente: servicios de exportaciones de bienes, importaciones de
              bienes y nomenclaturas del INDEC. Este tablero incluye datos desde
              enero de 2024. Se agrupan subrubros de exportación por rubro y
              categorías de importación por uso económico, país y mes; no se
              mezclan ambas clasificaciones.
            </p>
            <p>
              Los valores están expresados en dólares estadounidenses
              corrientes. Las exportaciones se valúan FOB y las importaciones
              CIF. No se construye un índice de volumen con kilogramos de
              mercancías heterogéneas ni se infieren cantidades a partir de
              valores monetarios.
            </p>
            <p>
              Los campos reservados, confidenciales o faltantes permanecen como
              tales. Si un grupo combina cifras publicadas y reservadas, se suma
              sólo su componente publicado y se conserva el conteo de reservas.
              El porcentaje de concentración se refiere a esa suma publicada,
              sin estimar los valores ocultos. Las categorías «Confidencial» e
              «Indeterminado» se mantienen como grupos explícitos.
            </p>
            <p>
              La variación anual del rango sólo se muestra si todos los meses
              del rango actual y del desplazado doce meses están presentes y no
              tienen reservas. La ausencia de registros de un país en un mes no
              se interpreta como cero.
            </p>
            <a
              href="https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_comex.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Metodología de comercio exterior · INDEC ↗
            </a>
          </>
        }
      />
      <DataTable
        title="Detalle publicado por mes, país y categoría"
        headers={[
          "Período",
          "Flujo",
          "País / destino / origen",
          "Rubro / uso económico",
          `Monto publicado · USD ${valuation}`,
          "Observaciones reservadas / faltantes",
        ]}
        rows={rows.map((r) => [
          r.date,
          flowName,
          data.countries[r.country] ?? r.country,
          categories[r.category] ?? r.category,
          r.value,
          r.suppressed,
        ])}
        filename="mga-comercio-exterior"
      />
    </>
  );
}
