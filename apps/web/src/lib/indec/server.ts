import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { ActivityData, IncomeData, TradeData } from "./types";

type Datasets = {
  income: IncomeData;
  activity: ActivityData;
  trade: TradeData;
};
export function loadIndec<K extends keyof Datasets>(
  name: K
): Datasets[K] | null {
  try {
    const data = JSON.parse(
      readFileSync(
        path.join(process.cwd(), "public/data/indec", `${name}.json`),
        "utf8"
      )
    );
    if (!data.updatedAt || data.source !== "INDEC") return null;
    return data as Datasets[K];
  } catch {
    return null;
  }
}
