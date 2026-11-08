"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  readStudioChartTheme,
  STUDIO_CHART_FALLBACK,
  type StudioChartTheme,
} from "@/lib/studioChartTheme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const serverSnapshot = JSON.stringify(STUDIO_CHART_FALLBACK);
const getSnapshot = () => JSON.stringify(readStudioChartTheme());

/** Stable server snapshot, then the actual CSS palette; class changes update every canvas consumer. */
export function useStudioChartTheme(): StudioChartTheme {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => serverSnapshot
  );
  return useMemo(() => JSON.parse(snapshot), [snapshot]);
}
