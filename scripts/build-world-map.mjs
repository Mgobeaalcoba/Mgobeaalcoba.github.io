/**
 * One-off tool (not part of the build): generates apps/web/content/world-map.json, the world map used by the PyPI dashboard,
 * as SVG paths in a Natural Earth projection keyed by ISO 3166-1 alpha-2 code. The output is committed, so the site needs no map library
 * and never fetches a map at runtime.
 *
 *   node scripts/build-world-map.mjs
 *
 * Sources: world-atlas 50m (Natural Earth, public domain) and the ISO 3166 numeric-to-alpha-2 table of lukes/ISO-3166-Countries-with-Regional-Codes.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'apps/web/content/world-map.json');
const ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';
const ISO = 'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json';
const WIDTH = 1000;
const TOLERANCE = 0.45; // px: points closer than this to the simplified line are dropped

const get = async (url) => (await fetch(url, { signal: AbortSignal.timeout(60_000) })).json();

/** Natural Earth projection (Šavrič et al.), input in degrees. */
function project([lon, lat]) {
  const l = (lon * Math.PI) / 180;
  const p = (lat * Math.PI) / 180;
  const p2 = p * p;
  const p4 = p2 * p2;
  const x = l * (0.870700 - 0.131979 * p2 - 0.013791 * p4 + 0.003971 * p2 ** 5 - 0.001529 * p2 ** 6);
  const y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)));
  return [x, -y];
}

function decodeArcs(topology) {
  const { scale, translate } = topology.transform;
  return topology.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });
}

function ring(arcs, indexes) {
  const points = [];
  for (const index of indexes) {
    const arc = index < 0 ? [...arcs[~index]].reverse() : arcs[index];
    points.push(...(points.length ? arc.slice(1) : arc));
  }
  return points;
}

/**
 * Rings that cross the antimeridian (Russia's Chukotka, Alaska's Aleutians, Fiji…) jump from +180 to -180 and would be filled as a band across the whole map.
 * Unwrap the longitudes so the ring is continuous, then clip it to [-180, 180] once for each copy (as is and shifted by 360), which gives the two pieces.
 */
function splitAtAntimeridian(points) {
  if (!points.some((point, i) => i && Math.abs(point[0] - points[i - 1][0]) > 180)) return [points];
  const unwrapped = [points[0].slice()];
  for (let i = 1; i < points.length; i += 1) {
    let lon = points[i][0];
    const previous = unwrapped[i - 1][0];
    while (lon - previous > 180) lon -= 360;
    while (lon - previous < -180) lon += 360;
    unwrapped.push([lon, points[i][1]]);
  }
  const clip = (ring, keep, edge) => {
    const out = [];
    for (let i = 0; i < ring.length; i += 1) {
      const a = ring[i];
      const b = ring[(i + 1) % ring.length];
      const aIn = keep(a[0]);
      const bIn = keep(b[0]);
      if (aIn) out.push(a);
      if (aIn !== bIn) out.push([edge, a[1] + ((b[1] - a[1]) * (edge - a[0])) / (b[0] - a[0])]);
    }
    return out;
  };
  const pieces = [];
  for (const shift of [0, 360, -360]) {
    const moved = unwrapped.map(([lon, lat]) => [lon + shift, lat]);
    const piece = clip(clip(moved, (lon) => lon >= -180, -180), (lon) => lon <= 180, 180);
    if (piece.length >= 3) pieces.push(piece);
  }
  return pieces;
}

function simplify(points, tolerance) {
  if (points.length < 4) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let worst = 0;
    let at = -1;
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const length = Math.hypot(bx - ax, by - ay) || 1e-9;
    for (let i = a + 1; i < b; i += 1) {
      const distance = Math.abs((by - ay) * points[i][0] - (bx - ax) * points[i][1] + bx * ay - by * ax) / length;
      if (distance > worst) {
        worst = distance;
        at = i;
      }
    }
    if (worst > tolerance && at > 0) {
      keep[at] = 1;
      stack.push([a, at], [at, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

/** A ring is closed (first point = last point), which breaks the line-distance test: split it at the point farthest from the start and simplify both halves. */
function simplifyRing(points, tolerance) {
  if (points.length < 6) return points;
  let far = 1;
  let best = 0;
  points.forEach((point, index) => {
    const distance = Math.hypot(point[0] - points[0][0], point[1] - points[0][1]);
    if (distance > best) {
      best = distance;
      far = index;
    }
  });
  const left = simplify(points.slice(0, far + 1), tolerance);
  const right = simplify(points.slice(far), tolerance);
  return [...left, ...right.slice(1, -1)];
}

function area(points) {
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

async function main() {
  const [topology, iso] = await Promise.all([get(ATLAS), get(ISO)]);
  const alpha2 = new Map(iso.map((row) => [String(row['country-code']).padStart(3, '0'), row['alpha-2']]));
  const arcs = decodeArcs(topology);
  const rawFeatures = [];
  for (const geometry of topology.objects.countries.geometries) {
    const code = alpha2.get(String(geometry.id).padStart(3, '0'));
    if (!code || code === 'AQ') continue;   // Antarctica only adds a band of ink
    const polygons = geometry.type === 'Polygon' ? [geometry.arcs] : geometry.type === 'MultiPolygon' ? geometry.arcs : [];
    rawFeatures.push({ code, name: geometry.properties?.name ?? code, rings: polygons.flatMap((polygon) => polygon.flatMap((indexes) => splitAtAntimeridian(ring(arcs, indexes)).map((piece) => piece.map(project)))) });
  }
  const all = rawFeatures.flatMap((feature) => feature.rings.flat());
  const minX = Math.min(...all.map((p) => p[0]));
  const maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1]));
  const maxY = Math.max(...all.map((p) => p[1]));
  const scale = WIDTH / (maxX - minX);
  const height = Math.round((maxY - minY) * scale);
  const fit = ([x, y]) => [(x - minX) * scale, (y - minY) * scale];

  const countries = {};
  for (const feature of rawFeatures) {
        const fitted = feature.rings.map((points) => points.map(fit));
    const rings = fitted.map((points) => simplifyRing(points, TOLERANCE)).filter((points) => points.length >= 3 && area(points) >= 0.2);
    // A micro-state (Singapore, Malta, Monaco…) is smaller than a pixel: no path, only its centre, and the page draws a marker there.
    const biggest = (rings.length ? rings : fitted).reduce((best, points) => (area(points) > area(best) ? points : best));
    const cx = biggest.reduce((sum, p) => sum + p[0], 0) / biggest.length;
    const cy = biggest.reduce((sum, p) => sum + p[1], 0) / biggest.length;
    const d = rings.map((points) => `M${points.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}Z`).join('');
    const code = feature.code;
    countries[code] = { d: countries[code] ? countries[code].d + d : d, cx: Math.round(cx * 10) / 10, cy: Math.round(cy * 10) / 10, a: Math.round(rings.reduce((sum, p) => sum + area(p), 0)) };
  }
  await writeFile(OUTPUT, `${JSON.stringify({ width: WIDTH, height, countries })}\n`);
  console.log(`world-map: ${Object.keys(countries).length} countries, ${Math.round(JSON.stringify(countries).length / 1024)} KB, ${WIDTH}x${height}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
