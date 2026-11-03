import type { Point, TradeRow } from "./types";

export const number = (value: number | null | undefined, digits = 1) =>
  value == null || !Number.isFinite(value)
    ? "—"
    : new Intl.NumberFormat("es-AR", {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
      }).format(value);
export const percent = (value: number | null | undefined) =>
  value == null || !Number.isFinite(value)
    ? "—"
    : `${value > 0 ? "+" : ""}${number(value)}%`;
export const money = (value: number | null | undefined) =>
  value == null || !Number.isFinite(value)
    ? "—"
    : new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(value);
export const monthLabel = (date: string) =>
  /^\d{4}-\d{2}$/.test(date)
    ? new Intl.DateTimeFormat("es-AR", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
        .format(new Date(`${date}-01T12:00:00Z`))
        .replace(".", "")
    : date;
export function shiftMonth(date: string, offset: number): string {
  const [year, month] = date.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1 + offset, 1));
  return d.toISOString().slice(0, 7);
}
export function monthsBetween(from: string, to: string): string[] {
  if (
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(from) ||
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(to) ||
    from > to
  )
    return [];
  const result: string[] = [];
  for (let d = from; d <= to && result.length < 1500; d = shiftMonth(d, 1))
    result.push(d);
  return result;
}
export function valueAt(points: Point[], date: string): number | null {
  const value = points.find((p) => p.date === date)?.value;
  return value != null && Number.isFinite(value) ? value : null;
}
export function change(
  final: number | null,
  initial: number | null
): number | null {
  return final != null &&
    initial != null &&
    initial > 0 &&
    Number.isFinite(final) &&
    Number.isFinite(initial)
    ? (final / initial - 1) * 100
    : null;
}
export function realChange(
  incomeStart: number,
  incomeEnd: number,
  priceStart: number | null,
  priceEnd: number | null
): number | null {
  return incomeStart > 0 &&
    incomeEnd >= 0 &&
    Number.isFinite(incomeStart) &&
    Number.isFinite(incomeEnd) &&
    priceStart != null &&
    priceStart > 0 &&
    priceEnd != null &&
    priceEnd > 0
    ? (incomeEnd / incomeStart / (priceEnd / priceStart) - 1) * 100
    : null;
}
export function indexed(
  points: Point[],
  date: string,
  base: string
): number | null {
  const v = valueAt(points, date),
    b = valueAt(points, base);
  return v != null && b != null && b > 0 ? (v / b) * 100 : null;
}
export function yoy(points: Point[], date: string): number | null {
  return change(valueAt(points, date), valueAt(points, shiftMonth(date, -12)));
}
/** A window is comparable only when every calendar month has a published observation. */
export function completeTotal(
  rows: { date: string; value: number | null }[],
  from: string,
  to: string
): number | null {
  const months = monthsBetween(from, to);
  if (!months.length) return null;
  let total = 0;
  for (const month of months) {
    const values = rows.filter((r) => r.date === month).map((r) => r.value);
    if (!values.length || values.some((v) => v == null || !Number.isFinite(v)))
      return null;
    total += values.reduce<number>((sum, v) => sum + (v ?? 0), 0);
  }
  return total;
}
export function groupTrade(
  rows: TradeRow[],
  dimension: "country" | "category"
) {
  const groups = new Map<
    string,
    { id: string; value: number; suppressed: number; available: number }
  >();
  for (const row of rows) {
    const id = row[dimension];
    const group = groups.get(id) ?? {
      id,
      value: 0,
      suppressed: 0,
      available: 0,
    };
    if (row.value != null) {
      group.value += row.value;
      group.available++;
    }
    group.suppressed += row.suppressed;
    groups.set(id, group);
  }
  return Array.from(groups.values()).sort(
    (a, b) => b.value - a.value || a.id.localeCompare(b.id)
  );
}
export function cumulativeValues(values: (number | null)[]): (number | null)[] {
  const result: (number | null)[] = [];
  let total = 0,
    missing = false;
  for (const value of values) {
    if (value == null) missing = true;
    else total += value;
    result.push(missing ? null : total);
  }
  return result;
}
/** Prevent spreadsheet formulas in downloaded text cells; preserve numerical negative values. */
export function toCsv(
  headers: string[],
  rows: (string | number | null)[][]
): string {
  const escape = (value: string | number | null) => {
    let text = value == null ? "" : String(value);
    if (typeof value === "string" && /^[\s]*[=+@-]/.test(text))
      text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return (
    "\uFEFF" +
    [headers, ...rows].map((row) => row.map(escape).join(";")).join("\r\n")
  );
}
