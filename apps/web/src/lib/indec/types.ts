export type Point = { date: string; value: number | null; note?: string };
export type Series = { id: string; name: string; points: Point[] };
export type Provenance = {
  updatedAt: string;
  source: string;
  sourceUrl: string;
  method: "api" | "download";
  note?: string;
};
export type IncomeData = Provenance & { prices: Series[]; wages: Series[] };
export type ActivityData = Provenance & {
  sectors: Series[];
  adjusted: Series;
  original: Series;
};
export type TradeRow = {
  date: string;
  flow: "exports" | "imports";
  country: string;
  category: string;
  value: number | null;
  suppressed: number;
};
export type TradeData = Provenance & {
  rows: TradeRow[];
  countries: Record<string, string>;
  exportCategories: Record<string, string>;
  importCategories: Record<string, string>;
};
export const DASHBOARDS = [
  {
    slug: "poder-adquisitivo",
    number: "01",
    title: "Poder adquisitivo",
    question: "¿Tu ingreso le ganó a los precios?",
    description:
      "Compará ingresos, inflación y salarios. Descubrí cuánto cambió tu capacidad de compra.",
    tag: "IPC + salarios",
    color: "cyan",
  },
  {
    slug: "actividad-argentina",
    number: "02",
    title: "Radar productivo",
    question: "¿Qué sectores están creciendo?",
    description:
      "Explorá la actividad económica, compará sectores y mirá la amplitud del crecimiento.",
    tag: "Actividad · EMAE",
    color: "lime",
  },
  {
    slug: "comercio-exterior",
    number: "03",
    title: "Comercio exterior",
    question: "¿Qué intercambia Argentina con el mundo?",
    description:
      "Analizá socios, productos y concentración de las exportaciones e importaciones.",
    tag: "Exportaciones + importaciones",
    color: "blue",
  },
] as const;
