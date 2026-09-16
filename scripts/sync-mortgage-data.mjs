import { createHash } from 'node:crypto';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIR, '..');
const OUTPUT_PATH = path.join(
  REPOSITORY_ROOT,
  'apps/web/public/data/mortgage-products.json',
);

const MEP_HISTORY_START = '2018-10-29';
const BCRA_PAGE_SIZE = 3000;

const ALLOWED_SOURCES = Object.freeze({
  mortgages: 'https://api.bcra.gob.ar/transparencia/v1.0/Prestamos/Hipotecarios',
  uva: 'https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/31',
  mep: 'https://dolarapi.com/v1/dolares/bolsa',
  mepHistory: 'https://api.argentinadatos.com/v1/cotizaciones/dolares',
  mepMethodology: 'https://www.byma.com.ar/newsroom/byma-presenta-dos-nuevos-ndices-para-el-mercado-argentino',
});

function asFiniteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asText(value, maxLength = 600) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

async function fetchJson(url) {
  if (!Object.values(ALLOWED_SOURCES).some((source) => url.startsWith(source))) {
    throw new Error('SOURCE_NOT_ALLOWED');
  }

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) throw new Error('UPSTREAM_UNAVAILABLE');
  return response.json();
}

async function fetchUvaHistory(from, to) {
  const entries = [];

  for (let offset = 0; offset < 15_000; offset += BCRA_PAGE_SIZE) {
    const url = `${ALLOWED_SOURCES.uva}?desde=${from}&hasta=${to}&limit=${BCRA_PAGE_SIZE}&offset=${offset}`;
    const payload = await fetchJson(url);
    const page = Array.isArray(payload?.results?.[0]?.detalle)
      ? payload.results[0].detalle
      : [];

    entries.push(...page);
    if (page.length < BCRA_PAGE_SIZE) break;
  }

  return entries;
}

function normalizeProduct(product) {
  const stableKey = [
    product.codigoEntidad,
    product.nombreCompleto,
    product.nombreCorto,
    product.destinoFondos,
    product.beneficiario,
    product.tasaEfectivaAnualMaxima,
    product.costoFinancieroEfectivoTotalMaximo,
    product.plazoMaximoOtorgable,
    product.relacionMontoTasacion,
  ].join('|');

  return {
    id: createHash('sha256').update(stableKey).digest('hex').slice(0, 20),
    bankCode: asFiniteNumber(product.codigoEntidad),
    bankName: asText(product.descripcionEntidad, 120),
    updatedAt: asText(product.fechaInformacion, 10),
    productName: asText(product.nombreCompleto, 160),
    shortName: asText(product.nombreCorto, 100),
    denomination: 'UVA',
    maxLoanAmount: asFiniteNumber(product.montoMaximoOtorgable),
    maxTermMonths: asFiniteNumber(product.plazoMaximoOtorgable),
    minimumIncome: asFiniteNumber(product.ingresoMinimoMensual),
    minimumJobMonths: asFiniteNumber(product.antiguedadLaboralMinimaMeses),
    maximumAge: asFiniteNumber(product.edadMaximaSolicitada),
    paymentIncomeRatio: asFiniteNumber(product.relacionCuotaIngreso, 25),
    loanToValueRatio: asFiniteNumber(product.relacionMontoTasacion),
    destination: asText(product.destinoFondos, 120),
    beneficiary: asText(product.beneficiario, 140),
    earlyCancellationFee: asFiniteNumber(product.cargoMaximoCancelacionAnticipada),
    annualEffectiveRate: asFiniteNumber(product.tasaEfectivaAnualMaxima),
    totalFinancialCost: asFiniteNumber(product.costoFinancieroEfectivoTotalMaximo),
    rateType: asText(product.tipoTasa, 30),
    initialPaymentPer100k: asFiniteNumber(product.cuotaInicial),
    territory: asText(product.territorioValidez, 160),
    details: asText(product.masInformacion, 900),
  };
}

async function hasFallback() {
  try {
    await access(OUTPUT_PATH);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const today = new Date();
  const from = new Date(today);
  from.setUTCDate(from.getUTCDate() - 14);
  const uvaUrl = `${ALLOWED_SOURCES.uva}?desde=${isoDate(from)}&hasta=${isoDate(today)}&limit=30`;

  try {
    const [mortgagePayload, uvaPayload, mepPayload, mepHistoryPayload, uvaHistoryPayload] = await Promise.all([
      fetchJson(ALLOWED_SOURCES.mortgages),
      fetchJson(uvaUrl),
      fetchJson(ALLOWED_SOURCES.mep),
      fetchJson(ALLOWED_SOURCES.mepHistory),
      fetchUvaHistory(MEP_HISTORY_START, isoDate(today)),
    ]);

    if (!Array.isArray(mortgagePayload?.results)) throw new Error('INVALID_MORTGAGE_PAYLOAD');

    const products = mortgagePayload.results
      .filter((product) => asText(product?.denominacion, 20).toUpperCase().includes('UVA'))
      .map(normalizeProduct)
      .filter((product) => (
        product.bankName
        && product.destination
        && product.annualEffectiveRate > 0
        && product.maxTermMonths > 0
        && product.loanToValueRatio > 0
      ))
      .sort((left, right) => (
        left.bankName.localeCompare(right.bankName, 'es')
        || left.annualEffectiveRate - right.annualEffectiveRate
      ));

    const uvaValues = Array.isArray(uvaPayload?.results?.[0]?.detalle)
      ? uvaPayload.results[0].detalle
      : [];
    const latestUva = uvaValues
      .map((entry) => ({ date: asText(entry?.fecha, 10), value: asFiniteNumber(entry?.valor) }))
      .filter((entry) => entry.date && entry.value > 0)
      .sort((left, right) => left.date.localeCompare(right.date))
      .at(-1);

    const mepValue = asFiniteNumber(mepPayload?.venta);
    if (products.length === 0 || !latestUva || mepValue <= 0) throw new Error('INVALID_NORMALIZED_DATA');

    const uvaByDate = new Map(
      uvaHistoryPayload
        .map((entry) => [asText(entry?.fecha, 10), asFiniteNumber(entry?.valor)])
        .filter(([date, value]) => date && value > 0),
    );
    const mepByDate = new Map(
      (Array.isArray(mepHistoryPayload) ? mepHistoryPayload : [])
        .filter((entry) => asText(entry?.casa, 20).toLowerCase() === 'bolsa')
        .map((entry) => [
          asText(entry?.fecha, 10),
          asFiniteNumber(entry?.venta) || asFiniteNumber(entry?.compra),
        ])
        .filter(([date, value]) => date && value > 0),
    );

    const currentMepDate = asText(mepPayload?.fechaActualizacion, 30).slice(0, 10);
    if (currentMepDate) mepByDate.set(currentMepDate, mepValue);
    uvaByDate.set(latestUva.date, latestUva.value);

    const uvaDollarPoints = Array.from(mepByDate.entries())
      .map(([date, mepArs]) => {
        const uvaArs = uvaByDate.get(date) ?? 0;
        const uvaPerUsd = uvaArs > 0 ? mepArs / uvaArs : 0;
        return {
          date,
          uvaArs: Number(uvaArs.toFixed(2)),
          mepArs: Number(mepArs.toFixed(2)),
          uvaPerUsd: Number(uvaPerUsd.toFixed(6)),
        };
      })
      .filter((point) => point.date && point.uvaArs > 0 && point.mepArs > 0 && point.uvaPerUsd >= 0.01 && point.uvaPerUsd <= 10)
      .sort((left, right) => left.date.localeCompare(right.date));

    if (uvaDollarPoints.length < 365) throw new Error('INVALID_MARKET_CONTEXT');

    const payload = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      sourceUpdatedAt: products.reduce(
        (latest, product) => product.updatedAt > latest ? product.updatedAt : latest,
        '',
      ),
      sources: {
        mortgages: ALLOWED_SOURCES.mortgages,
        uva: ALLOWED_SOURCES.uva,
        mep: ALLOWED_SOURCES.mep,
        mepHistory: ALLOWED_SOURCES.mepHistory,
        mepMethodology: ALLOWED_SOURCES.mepMethodology,
      },
      uva: latestUva,
      mep: {
        date: asText(mepPayload?.fechaActualizacion, 30) || new Date().toISOString(),
        value: mepValue,
      },
      marketContext: {
        methodologyVersion: 1,
        metric: 'uva-per-usd-mep',
        firstDate: uvaDollarPoints[0].date,
        lastDate: uvaDollarPoints.at(-1).date,
        officialUva: true,
        reconstructedMep: true,
        points: uvaDollarPoints,
      },
      products,
    };

    await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    console.log(`Mortgage snapshot updated: ${products.length} UVA products.`);
  } catch {
    if (await hasFallback()) {
      console.warn('Mortgage sources unavailable; keeping the last valid snapshot.');
      return;
    }
    console.error('Mortgage snapshot could not be created and no fallback exists.');
    process.exitCode = 1;
  }
}

await main();
