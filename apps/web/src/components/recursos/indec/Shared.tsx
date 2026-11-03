"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  Download,
  FileText,
  RotateCcw,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { useTheme } from "@/contexts/ThemeContext";
import { monthLabel, number, shiftMonth, toCsv } from "@/lib/indec/math";
import type { Provenance } from "@/lib/indec/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);
export const COLORS = [
  "#22d3ee",
  "#a3e635",
  "#a78bfa",
  "#fbbf24",
  "#fb7185",
  "#60a5fa",
  "#34d399",
  "#fb923c",
  "#e879f9",
  "#94a3b8",
  "#2dd4bf",
  "#f472b6",
  "#818cf8",
  "#bef264",
  "#fdba74",
];

export function download(
  name: string,
  text: string,
  type = "text/plain;charset=utf-8"
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Source({
  data,
  through,
}: {
  data: Provenance;
  through: string;
}) {
  const date = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(data.updatedAt));
  const age =
    (Date.parse(data.updatedAt) - Date.parse(`${through}-01T00:00:00Z`)) /
    86400000;
  return (
    <div className="indec-source">
      <span className="indec-source__dot" />
      <span>
        Fuente:{" "}
        <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer">
          INDEC <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </span>
      <span>
        Datos hasta <b>{monthLabel(through)}</b>
      </span>
      <span>Descarga: {date}</span>
      {age > 120 && (
        <span className="indec-warning">
          Serie con rezago: revisá el período antes de comparar.
        </span>
      )}
    </div>
  );
}
export function Controls({
  children,
  onReset,
}: {
  children: ReactNode;
  onReset: () => void;
}) {
  return (
    <section className="indec-controls" aria-label="Filtros del dashboard">
      <div className="indec-section-bar">
        <span>
          <SlidersHorizontal size={15} aria-hidden="true" /> Configurá tu
          análisis
        </span>
        <button
          type="button"
          onClick={onReset}
          className="indec-button indec-button--quiet"
        >
          <RotateCcw size={14} aria-hidden="true" /> Restablecer
        </button>
      </div>
      <div className="indec-controls__grid">{children}</div>
    </section>
  );
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="indec-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function DateRange({
  dates,
  from,
  to,
  onChange,
}: {
  dates: string[];
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}) {
  return (
    <>
      <Field label="Desde">
        <select
          value={from}
          onChange={(e) =>
            onChange(e.target.value, to < e.target.value ? e.target.value : to)
          }
        >
          {dates.map((d) => (
            <option key={d} value={d}>
              {monthLabel(d)}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Hasta">
        <select
          value={to}
          onChange={(e) =>
            onChange(
              from > e.target.value ? e.target.value : from,
              e.target.value
            )
          }
        >
          {dates.map((d) => (
            <option key={d} value={d}>
              {monthLabel(d)}
            </option>
          ))}
        </select>
      </Field>
      <div className="indec-field indec-presets">
        <span>Atajos de período</span>
        <div>
          {[6, 12, 24].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => {
                const last = dates[dates.length - 1];
                onChange(
                  dates.find((d) => d >= shiftMonth(last, -(n - 1))) ??
                    dates[0],
                  last
                );
              }}
            >
              {n} meses
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
export function Metric({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "positive" | "negative";
}) {
  return (
    <article
      className={`indec-metric ${value.includes("$") ? "indec-metric--money" : ""} ${tone ? `indec-metric--${tone}` : ""}`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="indec-empty" role="status">
      <b>No hay observaciones comparables.</b>
      <p>{children}</p>
    </div>
  );
}
type PlotSeries = { label: string; data: (number | null)[]; color?: string };
export function Plot({
  title,
  subtitle,
  labels,
  series,
  mode = "line",
  unit = "",
  horizontal = false,
  tall = false,
}: {
  title: string;
  subtitle: string;
  labels: string[];
  series: PlotSeries[];
  mode?: "line" | "bar" | "doughnut";
  unit?: string;
  horizontal?: boolean;
  tall?: boolean;
}) {
  const { theme } = useTheme();
  const ref = useRef<ChartJS<"line"> | null>(null);
  const text = theme === "light" ? "#536176" : "#9aa8ba";
  const grid =
    theme === "light" ? "rgba(15,23,42,.09)" : "rgba(148,163,184,.10)";
  const lightColors = [
    "#087e92",
    "#557c0f",
    "#7754bd",
    "#a26900",
    "#bd3458",
    "#2868ac",
    "#17835a",
    "#ad5010",
    "#a934af",
    "#607085",
    "#098275",
    "#bd337d",
    "#5358bd",
    "#618213",
    "#a45c21",
  ];
  const colorOf = (color: string) =>
    theme === "light" ? (lightColors[COLORS.indexOf(color)] ?? color) : color;
  const datasets = series.map((s, i) => ({
    label: s.label,
    data: s.data,
    borderColor: colorOf(s.color ?? COLORS[i % COLORS.length]),
    backgroundColor:
      mode === "doughnut"
        ? labels.map((_, n) => colorOf(COLORS[n % COLORS.length]))
        : `${colorOf(s.color ?? COLORS[i % COLORS.length])}${mode === "bar" ? "cc" : "15"}`,
    borderWidth: mode === "doughnut" ? 0 : 2,
    pointRadius: labels.length < 30 ? 2 : 0,
    pointHoverRadius: 5,
    tension: 0.15,
    spanGaps: false,
    borderRadius: 3,
  }));
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "index", intersect: false },
    locale: "es-AR",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: text,
          usePointStyle: true,
          padding: 18,
          font: { family: "Geist", size: 11 },
        },
      },
      tooltip: {
        callbacks: {
          label: (c) =>
            `${c.dataset.label}: ${number(horizontal ? c.parsed.x : c.parsed.y, 2)}${unit ? ` ${unit}` : ""}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: horizontal ? grid : "transparent" },
        ticks: {
          color: text,
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
        title: { display: horizontal && !!unit, text: unit, color: text },
      },
      y: {
        grid: { color: horizontal ? "transparent" : grid },
        ticks: { color: text },
        title: { display: !horizontal && !!unit, text: unit, color: text },
      },
    },
  };
  const hasData = series.some((s) =>
    s.data.some((v) => v != null && (mode !== "doughnut" || v > 0))
  );
  return (
    <section
      className={`indec-panel ${tall ? "indec-panel--tall" : ""}`}
      aria-label={title}
    >
      <div className="indec-panel__head">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {hasData ? (
        <div className={`indec-chart ${tall ? "indec-chart--tall" : ""}`}>
          {mode === "line" && (
            <Line
              ref={ref}
              data={{ labels, datasets }}
              options={options}
              role="img"
              aria-label={`${title}. ${subtitle}. Los valores están disponibles en la tabla de datos.`}
            />
          )}
          {mode === "bar" && (
            <Bar
              data={{ labels, datasets }}
              options={
                {
                  ...options,
                  indexAxis: horizontal ? "y" : "x",
                } as ChartOptions<"bar">
              }
              role="img"
              aria-label={`${title}. Consultá también la tabla de datos.`}
            />
          )}
          {mode === "doughnut" && (
            <Doughnut
              data={{ labels, datasets }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                cutout: "72%",
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: text,
                      usePointStyle: true,
                      font: { size: 10 },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (c) =>
                        `${c.label}: ${number(Number(c.raw), 2)}${unit ? ` ${unit}` : ""}`,
                    },
                  },
                },
              }}
              role="img"
              aria-label={`${title}. Consultá también la tabla de datos.`}
            />
          )}
        </div>
      ) : (
        <Empty>Probá otro período o selección.</Empty>
      )}
    </section>
  );
}
export type Insight = { title: string; text: string };
export function Report({
  title,
  context,
  insights,
  methodology,
  filename,
  provenance,
}: {
  title: string;
  context: string;
  insights: Insight[];
  methodology: ReactNode;
  filename: string;
  provenance: Provenance;
}) {
  const methodologyRef = useRef<HTMLDivElement>(null);
  const report = `${title}\n${context}\n\n${insights.map((x, i) => `${i + 1}. ${x.title}\n${x.text}`).join("\n\n")}\n\nFuente: INDEC. Análisis descriptivo elaborado por MGA Tech Consulting.\n`;
  function saveReport() {
    const notes = Array.from(
      methodologyRef.current?.querySelectorAll("p, a") ?? []
    )
      .map((p) => p.textContent)
      .join("\n\n");
    download(
      `${filename}.txt`,
      `${report}\nMetodología\n${notes}\n\nServicio principal: ${provenance.sourceUrl}\nDescarga de datos: ${provenance.updatedAt}\n`
    );
  }
  return (
    <section className="indec-report" aria-labelledby="indec-report-heading">
      <div className="indec-report__heading">
        <div>
          <span className="signal-eyebrow">Lectura de tu selección</span>
          <h2 id="indec-report-heading">Informe de resultados.</h2>
          <p>{context}</p>
        </div>
        <button type="button" className="indec-button" onClick={saveReport}>
          <FileText size={15} aria-hidden="true" /> Descargar informe
        </button>
      </div>
      <div className="indec-insights">
        {insights.map((insight, i) => (
          <article key={insight.title}>
            <span>0{i + 1}</span>
            <h3>{insight.title}</h3>
            <p>{insight.text}</p>
          </article>
        ))}
      </div>
      <details className="indec-method">
        <summary>Metodología y cómo interpretar los resultados</summary>
        <div ref={methodologyRef}>{methodology}</div>
      </details>
    </section>
  );
}
export function DataTable({
  title = "Datos de la selección",
  headers,
  rows,
  filename,
}: {
  title?: string;
  headers: string[];
  rows: (string | number | null)[][];
  filename: string;
}) {
  const [page, setPage] = useState(0);
  const max = Math.max(0, Math.ceil(rows.length / 20) - 1);
  const current = Math.min(page, max);
  return (
    <details className="indec-table-panel">
      <summary>
        {title}
        <span>{rows.length} filas</span>
      </summary>
      <div className="indec-table-actions">
        <span>Datos numéricos sin formato en la descarga CSV.</span>
        <button
          type="button"
          className="indec-button"
          disabled={!rows.length}
          onClick={() =>
            download(
              `${filename}.csv`,
              toCsv(headers, rows),
              "text/csv;charset=utf-8"
            )
          }
        >
          <Download size={14} aria-hidden="true" /> Descargar CSV
        </button>
      </div>
      <div
        className="indec-table-scroll"
        tabIndex={0}
        role="region"
        aria-label={title}
      >
        <table>
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr>
              {headers.map((h) => (
                <th scope="col" key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(current * 20, current * 20 + 20).map((row, i) => (
              <tr key={i}>
                {row.map((v, j) => (
                  <td key={j}>
                    {typeof v === "number" ? number(v, 2) : (v ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="indec-pagination">
        <button
          type="button"
          className="indec-button"
          disabled={current === 0}
          onClick={() => setPage(current - 1)}
        >
          Anterior
        </button>
        <span>
          Página {current + 1} de {max + 1}
        </span>
        <button
          type="button"
          className="indec-button"
          disabled={current === max}
          onClick={() => setPage(current + 1)}
        >
          Siguiente
        </button>
      </div>
    </details>
  );
}
