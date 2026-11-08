"use client";

import {
  Bar as CanvasBar,
  Line as CanvasLine,
  Doughnut as CanvasDoughnut,
  type ChartProps,
} from "react-chartjs-2";
import { useStudioChartTheme } from "@/hooks/useStudioChartTheme";
import type { StudioChartTheme } from "@/lib/studioChartTheme";

/** Resolve semantic CSS colors before Chart.js draws them on canvas. Keep data and callbacks intact. */
function resolveColors<T>(value: T, palette: StudioChartTheme): T {
  if (typeof value === "string") {
    const category = value.match(/^var\(--chart-(\d+)(-soft)?\)$/);
    if (category) {
      const color = palette.colors[Number(category[1]) - 1];
      return (color ? `${color}${category[2] ? "26" : ""}` : value) as T;
    }
    const tokens: Record<string, string> = {
      "var(--signal-muted)": palette.muted,
      "var(--signal-text)": palette.text,
      "var(--signal-chart-grid)": palette.grid,
      "var(--signal-surface)": palette.surface,
    };
    return (tokens[value] ?? value) as T;
  }
  if (Array.isArray(value))
    return value.map((entry) => resolveColors(entry, palette)) as T;
  if (
    value &&
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  ) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        resolveColors(entry, palette),
      ])
    ) as T;
  }
  return value;
}

export function Bar({
  data,
  options,
  ...props
}: Omit<ChartProps<"bar">, "type">) {
  const palette = useStudioChartTheme();
  return (
    <CanvasBar
      {...props}
      data={resolveColors(data, palette)}
      options={resolveColors(options, palette)}
    />
  );
}

export function Line({
  data,
  options,
  ...props
}: Omit<ChartProps<"line">, "type">) {
  const palette = useStudioChartTheme();
  return (
    <CanvasLine
      {...props}
      data={resolveColors(data, palette)}
      options={resolveColors(options, palette)}
    />
  );
}

export function Doughnut({
  data,
  options,
  ...props
}: Omit<ChartProps<"doughnut">, "type">) {
  const palette = useStudioChartTheme();
  return (
    <CanvasDoughnut
      {...props}
      data={resolveColors(data, palette)}
      options={resolveColors(options, palette)}
    />
  );
}
