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

const ALLOWED_SOURCES = Object.freeze({
  mortgages: 'https://api.bcra.gob.ar/transparencia/v1.0/Prestamos/Hipotecarios',
  uva: 'https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/31',
  mep: 'https://dolarapi.com/v1/dolares/bolsa',
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
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) throw new Error('UPSTREAM_UNAVAILABLE');
  return response.json();
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
    const [mortgagePayload, uvaPayload, mepPayload] = await Promise.all([
      fetchJson(ALLOWED_SOURCES.mortgages),
      fetchJson(uvaUrl),
      fetchJson(ALLOWED_SOURCES.mep),
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
      },
      uva: latestUva,
      mep: {
        date: asText(mepPayload?.fechaActualizacion, 30) || new Date().toISOString(),
        value: mepValue,
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
