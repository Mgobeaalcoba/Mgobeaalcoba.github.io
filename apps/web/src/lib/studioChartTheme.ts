/** Canvas needs resolved colors; SVG and the rest of the UI use the same CSS tokens directly. */
export type StudioChartTheme = {
  text: string;
  muted: string;
  grid: string;
  surface: string;
  colors: string[];
};
export const STUDIO_CHART_FALLBACK: StudioChartTheme = {
  text: "#e4e9e6",
  muted: "#a4b1b4",
  grid: "#34424d88",
  surface: "#19212b",
  colors: [
    "#7e96f2",
    "#88b2c4",
    "#aacb62",
    "#b9a3db",
    "#d8bb76",
    "#e4a1a4",
    "#8bc6aa",
    "#b5bfc7",
    "#d3a57e",
    "#a8b8cf",
    "#91c7b7",
    "#d3a0be",
    "#b2b3df",
    "#c2c98b",
    "#c7b1a2",
  ],
};
export function readStudioChartTheme(): StudioChartTheme {
  if (typeof document === "undefined") return STUDIO_CHART_FALLBACK;
  const styles = getComputedStyle(document.documentElement);
  const pick = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;
  return {
    text: pick("--signal-text", STUDIO_CHART_FALLBACK.text),
    muted: pick("--signal-muted", STUDIO_CHART_FALLBACK.muted),
    grid: pick("--signal-chart-grid", STUDIO_CHART_FALLBACK.grid),
    surface: pick("--signal-surface", STUDIO_CHART_FALLBACK.surface),
    colors: STUDIO_CHART_FALLBACK.colors.map((color, index) =>
      pick(`--chart-${index + 1}`, color)
    ),
  };
}
