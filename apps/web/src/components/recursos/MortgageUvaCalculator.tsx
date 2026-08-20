'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Calculator,
  Check,
  ChevronDown,
  CircleHelp,
  DollarSign,
  ExternalLink,
  Home,
  Info,
  LineChart,
  RefreshCw,
  Scale,
  Share2,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/gtag';
import {
  annualEffectiveToMonthlyRate,
  buildMortgageProjection,
  calculateUvaDollarStatistics,
  clampNumber,
  frenchInstallment,
  type MortgageProjectionPoint,
  type UvaDollarSignal,
  type UvaDollarStatistics,
} from '@/lib/mortgageCalculations';

type Currency = 'USD' | 'ARS';
type ApplicantProfile = 'salary' | 'account' | 'public' | 'employee' | 'monotributo' | 'any';
type ScenarioMode = 'same' | 'lag' | 'frozen' | 'custom';
type ShareStatus = 'idle' | 'shared' | 'copied' | 'unavailable';
type MarketRange = '1y' | '3y' | '5y' | 'max';

interface MortgageProduct {
  id: string;
  bankCode: number;
  bankName: string;
  updatedAt: string;
  productName: string;
  shortName: string;
  denomination: 'UVA';
  maxLoanAmount: number;
  maxTermMonths: number;
  minimumIncome: number;
  minimumJobMonths: number;
  maximumAge: number;
  paymentIncomeRatio: number;
  loanToValueRatio: number;
  destination: string;
  beneficiary: string;
  earlyCancellationFee: number;
  annualEffectiveRate: number;
  totalFinancialCost: number;
  rateType: string;
  initialPaymentPer100k: number;
  territory: string;
  details: string;
}

interface MortgageSnapshot {
  schemaVersion: number;
  generatedAt: string;
  sourceUpdatedAt: string;
  sources: {
    mortgages: string;
    uva: string;
    mep: string;
    mepHistory?: string;
    mepMethodology?: string;
  };
  uva: { date: string; value: number };
  mep: { date: string; value: number };
  marketContext?: UvaDollarContext;
  products: MortgageProduct[];
}

interface UvaDollarPoint {
  date: string;
  uvaArs: number;
  mepArs: number;
  uvaPerUsd: number;
}

interface UvaDollarContext {
  methodologyVersion: number;
  metric: 'uva-per-usd-mep';
  firstDate: string;
  lastDate: string;
  officialUva: boolean;
  reconstructedMep: boolean;
  points: UvaDollarPoint[];
}

interface ProductResult {
  product: MortgageProduct;
  installmentArs: number;
  installmentUva: number;
  requiredIncome: number;
}

type AnalyticsConfigurationState = Record<string, string | number | boolean>;

const DESTINATIONS = [
  'Vivienda propia, única y permanente',
  'Vivienda adicional o 2da vivienda',
  'Construcción',
  'Refacción o mejora',
] as const;

const TERMS = [5, 10, 15, 20, 25, 30];

const PROFILE_OPTIONS: Array<{
  value: ApplicantProfile;
  es: string;
  en: string;
}> = [
  { value: 'salary', es: 'Acredito sueldo', en: 'Salary deposited' },
  { value: 'account', es: 'Tengo cuenta en el banco', en: 'Bank account holder' },
  { value: 'public', es: 'Empleado público', en: 'Public employee' },
  { value: 'employee', es: 'Relación de dependencia', en: 'Salaried employee' },
  { value: 'monotributo', es: 'Monotributista', en: 'Self-employed taxpayer' },
  { value: 'any', es: 'Mostrar todas las condiciones', en: 'Show every condition' },
];

function finite(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isValidSnapshot(payload: unknown): payload is MortgageSnapshot {
  if (!payload || typeof payload !== 'object') return false;
  const candidate = payload as Partial<MortgageSnapshot>;
  return (
    candidate.schemaVersion === 1
    && Array.isArray(candidate.products)
    && candidate.products.length > 0
    && finite(candidate.uva?.value) > 0
    && finite(candidate.mep?.value) > 0
  );
}

function isValidMarketContext(payload: unknown): payload is UvaDollarContext {
  if (!payload || typeof payload !== 'object') return false;
  const candidate = payload as Partial<UvaDollarContext>;
  if (
    candidate.methodologyVersion !== 1
    || candidate.metric !== 'uva-per-usd-mep'
    || !Array.isArray(candidate.points)
    || candidate.points.length < 365
    || candidate.points.length > 10_000
  ) return false;

  return candidate.points.every((point) => (
    Boolean(point)
    && /^\d{4}-\d{2}-\d{2}$/.test(point.date)
    && !Number.isNaN(Date.parse(`${point.date}T00:00:00Z`))
    && finite(point.uvaArs) > 0
    && finite(point.mepArs) > 0
    && finite(point.uvaPerUsd) >= 0.01
    && finite(point.uvaPerUsd) <= 10
  ));
}

function isShareCancellation(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { name?: unknown; message?: unknown };
  return candidate.name === 'AbortError'
    || (typeof candidate.message === 'string' && candidate.message.toLowerCase().includes('cancel'));
}

function formatArs(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function downPaymentBand(value: number): string {
  if (value < 20) return '05_19';
  if (value < 30) return '20_29';
  if (value < 40) return '30_39';
  if (value < 50) return '40_49';
  return '50_plus';
}

function filterMarketPoints(points: UvaDollarPoint[], range: MarketRange): UvaDollarPoint[] {
  if (points.length === 0 || range === 'max') return points;
  const years = range === '1y' ? 1 : range === '3y' ? 3 : 5;
  const lastDate = new Date(`${points.at(-1)?.date}T00:00:00Z`);
  lastDate.setUTCFullYear(lastDate.getUTCFullYear() - years);
  const cutoff = lastDate.toISOString().slice(0, 10);
  return points.filter((point) => point.date >= cutoff);
}

function formatPercentile(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (value > 0 && value < 1) return '<1';
  if (value > 99 && value < 100) return '>99';
  return formatNumber(value, 0);
}

function formatDate(value: string, lang: 'es' | 'en'): string {
  if (!value || Number.isNaN(Date.parse(value))) return '—';
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

function formatBankName(value: string): string {
  const aliases: Array<[string, string]> = [
    ['BANCO DE LA NACION ARGENTINA', 'Banco Nación'],
    ['BANCO BBVA ARGENTINA', 'BBVA'],
    ['BANCO DE GALICIA', 'Banco Galicia'],
    ['BANCO DE LA CIUDAD DE BUENOS AIRES', 'Banco Ciudad'],
    ['BANCO DE LA PROVINCIA DE CORDOBA', 'Bancor'],
    ['BANCO PROVINCIA DEL NEUQU', 'Banco Provincia del Neuquén'],
    ['BANCO PROVINCIA DE TIERRA DEL FUEGO', 'Banco Tierra del Fuego'],
    ['INDUSTRIAL AND COMMERCIAL BANK OF CHINA', 'ICBC'],
  ];
  const upperValue = value.toLocaleUpperCase('es');
  const alias = aliases.find(([search]) => upperValue.includes(search));
  if (alias) return alias[1];

  const cleaned = value
    .replace(/\bSOCIEDAD AN[ÓO]NIMA UNIPERSONAL\b/gi, '')
    .replace(/\bSOCIEDAD AN[ÓO]NIMA\b/gi, '')
    .replace(/\s+S\.?\s*A\.?\s*U?\.?$/i, '')
    .replace(/[.\s]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('es');

  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toLocaleUpperCase('es')}${word.slice(1)}`)
    .join(' ');
}

function productMatchesProfile(product: MortgageProduct, profile: ApplicantProfile): boolean {
  if (profile === 'any') return true;
  const beneficiary = product.beneficiary.toLocaleLowerCase('es');
  if (beneficiary.includes('todos los beneficiarios')) return true;
  if (profile === 'salary') return beneficiary.includes('acrediten sueldos');
  if (profile === 'account') {
    return beneficiary.includes('cuenta en la entidad') || beneficiary.includes('acrediten sueldos');
  }
  if (profile === 'public') return beneficiary.includes('empleados públicos');
  if (profile === 'employee') return beneficiary.includes('relación de dependencia');
  return beneficiary.includes('monotributistas');
}

function getEffortTone(ratio: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (ratio <= 25) return 'green';
  if (ratio <= 30) return 'yellow';
  if (ratio <= 35) return 'orange';
  return 'red';
}

function EffortChart({ points, lang }: { points: MortgageProjectionPoint[]; lang: 'es' | 'en' }) {
  if (points.length < 2) return null;
  const width = 720;
  const height = 250;
  const padding = { top: 18, right: 18, bottom: 35, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxRatio = Math.max(45, Math.ceil(Math.max(...points.map((point) => point.effortRatio)) / 5) * 5);
  const toX = (month: number) => padding.left + (month / points[points.length - 1].month) * chartWidth;
  const toY = (ratio: number) => padding.top + chartHeight - (Math.min(ratio, maxRatio) / maxRatio) * chartHeight;
  const sampled = points.filter((point, index) => index % 3 === 0 || index === points.length - 1);
  const path = sampled.map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(point.month)} ${toY(point.effortRatio)}`).join(' ');
  const thresholds = [25, 30, 35];
  const yearTicks = Array.from(
    { length: Math.floor(points[points.length - 1].month / 12) + 1 },
    (_, index) => index,
  ).filter((year, index, list) => list.length <= 6 || year % Math.ceil(list.length / 6) === 0 || year === list.length - 1);

  return (
    <div className="mortgage-chart" role="img" aria-label={lang === 'es' ? 'Evolución proyectada de la relación cuota ingreso' : 'Projected payment to income ratio'}>
      <svg viewBox={`0 0 ${width} ${height}`}>
        <rect x={padding.left} y={toY(25)} width={chartWidth} height={toY(0) - toY(25)} className="mortgage-chart__safe" />
        <rect x={padding.left} y={toY(30)} width={chartWidth} height={toY(25) - toY(30)} className="mortgage-chart__watch" />
        <rect x={padding.left} y={toY(35)} width={chartWidth} height={toY(30) - toY(35)} className="mortgage-chart__warning" />
        <rect x={padding.left} y={toY(maxRatio)} width={chartWidth} height={toY(35) - toY(maxRatio)} className="mortgage-chart__risk" />
        {thresholds.map((threshold) => (
          <g key={threshold}>
            <line x1={padding.left} y1={toY(threshold)} x2={width - padding.right} y2={toY(threshold)} className="mortgage-chart__grid" />
            <text x={padding.left - 7} y={toY(threshold)} textAnchor="end" dominantBaseline="middle">{threshold}%</text>
          </g>
        ))}
        <path d={path} className="mortgage-chart__line" />
        {yearTicks.map((year) => (
          <text key={year} x={toX(year * 12)} y={height - 10} textAnchor="middle">
            {year === 0 ? (lang === 'es' ? 'Hoy' : 'Now') : `${year}a`}
          </text>
        ))}
      </svg>
    </div>
  );
}

function UvaDollarChart({
  points,
  statistics,
  lang,
}: {
  points: UvaDollarPoint[];
  statistics: UvaDollarStatistics;
  lang: 'es' | 'en';
}) {
  if (points.length < 2) return null;
  const width = 900;
  const height = 310;
  const padding = { top: 22, right: 44, bottom: 42, left: 52 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const rawMinimum = Math.min(...points.map((point) => point.uvaPerUsd));
  const rawMaximum = Math.max(...points.map((point) => point.uvaPerUsd));
  const rangePadding = Math.max(0.04, (rawMaximum - rawMinimum) * 0.08);
  const minimum = Math.max(0, rawMinimum - rangePadding);
  const maximum = rawMaximum + rangePadding;
  const valueRange = Math.max(0.01, maximum - minimum);
  const toX = (index: number) => padding.left + (index / (points.length - 1)) * chartWidth;
  const toY = (value: number) => padding.top + chartHeight - ((value - minimum) / valueRange) * chartHeight;
  const sampleEvery = Math.max(1, Math.ceil(points.length / 520));
  const sampled = points.filter((_, index) => index % sampleEvery === 0 || index === points.length - 1);
  const sampledPath = sampled.map((point, index) => {
    const sourceIndex = index === sampled.length - 1
      ? points.length - 1
      : Math.min(index * sampleEvery, points.length - 1);
    return `${index === 0 ? 'M' : 'L'} ${toX(sourceIndex)} ${toY(point.uvaPerUsd)}`;
  }).join(' ');
  const dateTicks = [0, Math.floor((points.length - 1) / 2), points.length - 1];
  const formatTickDate = (date: string) => new Intl.DateTimeFormat(
    lang === 'es' ? 'es-AR' : 'en-US',
    { month: 'short', year: 'numeric', timeZone: 'UTC' },
  ).format(new Date(`${date}T00:00:00Z`));

  return (
    <div
      className="mortgage-market-chart"
      role="img"
      aria-label={lang === 'es'
        ? `Evolución histórica de UVA por dólar MEP. Valor actual ${statistics.current.toFixed(2)}, mediana ${statistics.median.toFixed(2)}.`
        : `Historical UVA per MEP dollar. Current value ${statistics.current.toFixed(2)}, median ${statistics.median.toFixed(2)}.`}
    >
      <svg viewBox={`0 0 ${width} ${height}`}>
        <rect x={padding.left} y={padding.top} width={chartWidth} height={Math.max(0, toY(statistics.percentile75) - padding.top)} className="mortgage-market-chart__repay" />
        <rect x={padding.left} y={toY(statistics.percentile75)} width={chartWidth} height={Math.max(0, toY(statistics.percentile25) - toY(statistics.percentile75))} className="mortgage-market-chart__neutral" />
        <rect x={padding.left} y={toY(statistics.percentile25)} width={chartWidth} height={Math.max(0, padding.top + chartHeight - toY(statistics.percentile25))} className="mortgage-market-chart__borrow" />
        {[statistics.percentile25, statistics.median, statistics.percentile75].map((value, index) => (
          <g key={`${value}-${index}`}>
            <line x1={padding.left} y1={toY(value)} x2={width - padding.right} y2={toY(value)} className={index === 1 ? 'mortgage-market-chart__median' : 'mortgage-market-chart__quartile'} />
            <text x={width - padding.right + 7} y={toY(value)} dominantBaseline="middle">{formatNumber(value, 2)}</text>
          </g>
        ))}
        <path d={sampledPath} className="mortgage-market-chart__line" />
        <circle cx={toX(points.length - 1)} cy={toY(statistics.current)} r="4.5" className="mortgage-market-chart__current" />
        {dateTicks.map((index) => (
          <text key={points[index].date} x={toX(index)} y={height - 12} textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}>
            {formatTickDate(points[index].date)}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function MortgageUvaCalculator() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const isDedicatedPage = pathname.startsWith('/recursos/hipotecarios');
  const [snapshot, setSnapshot] = useState<MortgageSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [propertyValue, setPropertyValue] = useState<number | ''>(100_000);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [hasRealEstateCommission, setHasRealEstateCommission] = useState(true);
  const [realEstateCommissionPercent, setRealEstateCommissionPercent] = useState(4);
  const [deedCostsPercent, setDeedCostsPercent] = useState(3);
  const [destination, setDestination] = useState<string>(DESTINATIONS[0]);
  const [profile, setProfile] = useState<ApplicantProfile>('salary');
  const [termYears, setTermYears] = useState(20);
  const [familyIncome, setFamilyIncome] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [showAllBanks, setShowAllBanks] = useState(false);
  const [scenarioMode, setScenarioMode] = useState<ScenarioMode>('same');
  const [monthlyUvaChange, setMonthlyUvaChange] = useState(2);
  const [monthlyIncomeChange, setMonthlyIncomeChange] = useState(2);
  const [horizonYears, setHorizonYears] = useState(5);
  const [marketRange, setMarketRange] = useState<MarketRange>('5y');
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle');
  const [mobileAdditionalDataOpen, setMobileAdditionalDataOpen] = useState(false);
  const hasTrackedToolView = useRef(false);
  const previousConfiguration = useRef<AnalyticsConfigurationState | null>(null);
  const previousScenario = useRef<AnalyticsConfigurationState | null>(null);
  const previousResultState = useRef<'success' | 'empty' | null>(null);
  const dedicatedViewTracked = useRef(false);
  const dedicatedStartTracked = useRef(false);

  useEffect(() => {
    if (!isDedicatedPage || dedicatedViewTracked.current) return;
    dedicatedViewTracked.current = true;
    events.toolView('mortgages', 'direct');
  }, [isDedicatedPage]);

  const trackDedicatedStart = () => {
    if (!isDedicatedPage || dedicatedStartTracked.current) return;
    dedicatedStartTracked.current = true;
    events.toolStart('mortgages');
  };

  const loadSnapshot = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await fetch('/data/mortgage-products.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('SNAPSHOT_UNAVAILABLE');
      const payload: unknown = await response.json();
      if (!isValidSnapshot(payload)) throw new Error('INVALID_SNAPSHOT');
      setSnapshot(payload);
      setExchangeRate(payload.mep.value);
      events.mortgageDataLoad('success', 'retry', payload.products.length);
    } catch {
      setLoadError(true);
      events.mortgageDataLoad('error', 'retry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/data/mortgage-products.json', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('SNAPSHOT_UNAVAILABLE');
        return response.json() as Promise<unknown>;
      })
      .then((payload) => {
        if (!isValidSnapshot(payload)) throw new Error('INVALID_SNAPSHOT');
        if (!cancelled) {
          setSnapshot(payload);
          setExchangeRate(payload.mep.value);
          setLoadError(false);
          events.mortgageDataLoad('success', 'initial', payload.products.length);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
          events.mortgageDataLoad('error', 'initial');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currentUva = snapshot?.uva.value ?? 0;
  const safeExchangeRate = clampNumber(exchangeRate, 1, 100_000);
  const numericPropertyValue = finite(propertyValue);
  const propertyValueArs = currency === 'USD' ? numericPropertyValue * safeExchangeRate : numericPropertyValue;
  const safeDownPayment = clampNumber(downPaymentPercent, 5, 95);
  const financingPercent = 100 - safeDownPayment;
  const loanAmountArs = propertyValueArs * (financingPercent / 100);
  const downPaymentArs = propertyValueArs - loanAmountArs;
  const safeRealEstateCommissionPercent = clampNumber(realEstateCommissionPercent, 0, 10);
  const safeDeedCostsPercent = clampNumber(deedCostsPercent, 0, 15);
  const isPropertyPurchase = destination === DESTINATIONS[0] || destination === DESTINATIONS[1];
  const realEstateCommissionApplies = isPropertyPurchase && hasRealEstateCommission;
  const realEstateCommissionArs = realEstateCommissionApplies
    ? propertyValueArs * (safeRealEstateCommissionPercent / 100)
    : 0;
  const deedCostsArs = propertyValueArs * (safeDeedCostsPercent / 100);
  const totalUpfrontFundsArs = downPaymentArs + realEstateCommissionArs + deedCostsArs;
  const totalUpfrontFundsPercent = safeDownPayment
    + (realEstateCommissionApplies ? safeRealEstateCommissionPercent : 0)
    + safeDeedCostsPercent;
  const loanAmountUva = currentUva > 0 ? loanAmountArs / currentUva : 0;
  const months = termYears * 12;

  const eligibleResults = useMemo<ProductResult[]>(() => {
    if (!snapshot || loanAmountArs <= 0 || currentUva <= 0) return [];

    return snapshot.products
      .filter((product) => (
        product.destination === destination
        && productMatchesProfile(product, profile)
        && product.maxTermMonths >= months
        && product.loanToValueRatio + 0.01 >= financingPercent
        && (product.maxLoanAmount <= 0 || product.maxLoanAmount >= loanAmountArs)
      ))
      .map((product) => {
        const monthlyRate = annualEffectiveToMonthlyRate(product.annualEffectiveRate);
        const installmentArs = frenchInstallment(loanAmountArs, monthlyRate, months);
        const installmentUva = installmentArs / currentUva;
        const ratio = clampNumber(product.paymentIncomeRatio || 25, 10, 50) / 100;
        return {
          product,
          installmentArs,
          installmentUva,
          requiredIncome: Math.max(product.minimumIncome, installmentArs / ratio),
        };
      })
      .sort((left, right) => (
        left.installmentArs - right.installmentArs
        || left.product.totalFinancialCost - right.product.totalFinancialCost
      ));
  }, [snapshot, loanAmountArs, currentUva, destination, profile, months, financingPercent]);

  const bestByBank = useMemo<ProductResult[]>(() => {
    const results = new Map<number, ProductResult>();
    eligibleResults.forEach((result) => {
      if (!results.has(result.product.bankCode)) results.set(result.product.bankCode, result);
    });
    return Array.from(results.values());
  }, [eligibleResults]);

  const selectedResult = bestByBank.find((result) => result.product.id === selectedProductId) ?? bestByBank[0] ?? null;
  const displayedBanks = showAllBanks ? bestByBank : bestByBank.slice(0, 8);
  const validComparisonIds = comparisonIds
    .filter((id) => bestByBank.some((result) => result.product.id === id))
    .slice(0, 3);
  const comparisonResults = validComparisonIds
    .map((id) => bestByBank.find((result) => result.product.id === id))
    .filter((result): result is ProductResult => Boolean(result));

  const baselineIncome = selectedResult
    ? familyIncome > 0 ? familyIncome : selectedResult.requiredIncome
    : 0;
  const effectiveHorizonYears = Math.min(horizonYears, termYears);
  const projection = useMemo(() => {
    if (!selectedResult || currentUva <= 0 || baselineIncome <= 0) return [];
    return buildMortgageProjection({
      principalUva: loanAmountUva,
      installmentUva: selectedResult.installmentUva,
      annualEffectiveRate: selectedResult.product.annualEffectiveRate,
      currentUva,
      startingIncome: baselineIncome,
      monthlyUvaChange,
      monthlyIncomeChange,
      horizonMonths: effectiveHorizonYears * 12,
    });
  }, [selectedResult, currentUva, baselineIncome, loanAmountUva, monthlyUvaChange, monthlyIncomeChange, effectiveHorizonYears]);

  const milestoneMonths = useMemo(() => {
    const lastMonth = effectiveHorizonYears * 12;
    return Array.from(new Set([0, 12, 36, 60, 120, lastMonth]))
      .filter((month) => month <= lastMonth)
      .sort((left, right) => left - right);
  }, [effectiveHorizonYears]);

  const allMarketPoints = useMemo<UvaDollarPoint[]>(() => {
    if (!isValidMarketContext(snapshot?.marketContext)) return [];
    return snapshot.marketContext.points;
  }, [snapshot]);

  const displayedMarketPoints = useMemo<UvaDollarPoint[]>(() => {
    return filterMarketPoints(allMarketPoints, marketRange);
  }, [allMarketPoints, marketRange]);

  const marketStatistics = useMemo(
    () => calculateUvaDollarStatistics(displayedMarketPoints.map((point) => point.uvaPerUsd)),
    [displayedMarketPoints],
  );

  const analyticsConfiguration = useMemo<AnalyticsConfigurationState>(() => ({
    currency,
    property_value: numericPropertyValue,
    exchange_rate: safeExchangeRate,
    down_payment_percent: safeDownPayment,
    commission_enabled: realEstateCommissionApplies,
    commission_percent: safeRealEstateCommissionPercent,
    deed_cost_percent: safeDeedCostsPercent,
    purpose: (['primary_home', 'second_home', 'construction', 'renovation'] as const)[DESTINATIONS.indexOf(destination as typeof DESTINATIONS[number])] ?? 'unknown',
    applicant_profile: profile,
    term_years: termYears,
    family_income: familyIncome,
  }), [
    currency,
    numericPropertyValue,
    safeExchangeRate,
    safeDownPayment,
    realEstateCommissionApplies,
    safeRealEstateCommissionPercent,
    safeDeedCostsPercent,
    destination,
    profile,
    termYears,
    familyIncome,
  ]);

  const analyticsScenario = useMemo<AnalyticsConfigurationState>(() => ({
    scenario_mode: scenarioMode,
    monthly_uva_change: monthlyUvaChange,
    monthly_income_change: monthlyIncomeChange,
    horizon_years: effectiveHorizonYears,
  }), [scenarioMode, monthlyUvaChange, monthlyIncomeChange, effectiveHorizonYears]);

  useEffect(() => {
    if (!snapshot || hasTrackedToolView.current) return;
    hasTrackedToolView.current = true;
    events.mortgageToolView(
      snapshot.products.length,
      bestByBank.length,
      marketStatistics?.signal ?? 'unavailable',
    );
  }, [snapshot, bestByBank.length, marketStatistics?.signal]);

  useEffect(() => {
    if (!snapshot) return;
    const nextState = bestByBank.length > 0 ? 'success' : 'empty';
    if (previousResultState.current === nextState) return;
    previousResultState.current = nextState;
    events.toolResult('mortgages', nextState, nextState === 'success' ? 'compatible_products' : 'no_compatible_products');
  }, [snapshot, bestByBank.length]);

  useEffect(() => {
    if (!snapshot) return;
    const previous = previousConfiguration.current;
    if (!previous) {
      previousConfiguration.current = analyticsConfiguration;
      return;
    }

    const aliases: Record<string, string> = {
      currency: 'currency',
      property_value: 'property_value',
      exchange_rate: 'exchange_rate',
      down_payment_percent: 'down_payment',
      commission_enabled: 'commission_toggle',
      commission_percent: 'commission_rate',
      deed_cost_percent: 'deed_rate',
      purpose: 'purpose',
      applicant_profile: 'profile',
      term_years: 'term',
      family_income: 'income',
    };
    const changedParameters = Object.keys(analyticsConfiguration)
      .filter((key) => analyticsConfiguration[key] !== previous[key])
      .map((key) => aliases[key] ?? key);
    if (changedParameters.length === 0) return;

    const timer = window.setTimeout(() => {
      events.mortgageConfigurationUpdate({
        changed_parameters: Array.from(new Set(changedParameters)).slice(0, 6).join(','),
        changed_parameter_count: changedParameters.length,
        currency,
        property_value_status: numericPropertyValue > 0 ? 'provided' : 'empty',
        exchange_rate_edited: currency === 'USD' && Math.abs(safeExchangeRate - snapshot.mep.value) > 0.01,
        down_payment_band: downPaymentBand(safeDownPayment),
        commission_enabled: realEstateCommissionApplies,
        commission_percent: safeRealEstateCommissionPercent,
        deed_cost_percent: safeDeedCostsPercent,
        purpose: String(analyticsConfiguration.purpose),
        applicant_profile: profile,
        term_years: termYears,
        income_provided: familyIncome > 0,
        compatible_bank_count: bestByBank.length,
        has_result: Boolean(selectedResult),
      });
      previousConfiguration.current = analyticsConfiguration;
    }, 700);

    return () => window.clearTimeout(timer);
  }, [
    snapshot,
    analyticsConfiguration,
    currency,
    numericPropertyValue,
    safeExchangeRate,
    safeDownPayment,
    realEstateCommissionApplies,
    safeRealEstateCommissionPercent,
    safeDeedCostsPercent,
    profile,
    termYears,
    familyIncome,
    bestByBank.length,
    selectedResult,
  ]);

  useEffect(() => {
    if (!snapshot) return;
    const previous = previousScenario.current;
    if (!previous) {
      previousScenario.current = analyticsScenario;
      return;
    }
    if (Object.keys(analyticsScenario).every((key) => analyticsScenario[key] === previous[key])) return;

    const timer = window.setTimeout(() => {
      events.mortgageScenarioUpdate({
        scenario_mode: scenarioMode,
        monthly_uva_change: monthlyUvaChange,
        monthly_income_change: monthlyIncomeChange,
        horizon_years: effectiveHorizonYears,
      });
      previousScenario.current = analyticsScenario;
    }, 500);

    return () => window.clearTimeout(timer);
  }, [
    snapshot,
    analyticsScenario,
    scenarioMode,
    monthlyUvaChange,
    monthlyIncomeChange,
    effectiveHorizonYears,
  ]);

  useEffect(() => {
    if (!snapshot || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const sectionName = (entry.target as HTMLElement).dataset.mortgageSection;
        if (sectionName) events.mortgageSectionView(sectionName);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    document.querySelectorAll<HTMLElement>('[data-mortgage-section]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [snapshot]);

  const referenceFinancedUsd = currency === 'USD'
    ? numericPropertyValue * (financingPercent / 100)
    : (snapshot?.mep.value ?? 0) > 0 ? loanAmountArs / (snapshot?.mep.value ?? 1) : 0;
  const referenceFinancedUva = marketStatistics
    ? referenceFinancedUsd * marketStatistics.current
    : 0;

  const applyScenario = (mode: ScenarioMode) => {
    setScenarioMode(mode);
    if (mode === 'same') setMonthlyIncomeChange(monthlyUvaChange);
    if (mode === 'lag') setMonthlyIncomeChange(Math.max(0, monthlyUvaChange - 1));
    if (mode === 'frozen') setMonthlyIncomeChange(0);
  };

  const changeUvaScenario = (value: number) => {
    const nextValue = clampNumber(value, 0, 8);
    setMonthlyUvaChange(nextValue);
    if (scenarioMode === 'same') setMonthlyIncomeChange(nextValue);
    if (scenarioMode === 'lag') setMonthlyIncomeChange(Math.max(0, nextValue - 1));
  };

  const selectProduct = (id: string, source: 'calculator' | 'ranking') => {
    setSelectedProductId(id);
    const result = bestByBank.find((item) => item.product.id === id);
    events.mortgageBankSelect(
      result ? formatBankName(result.product.bankName) : 'unknown',
      source,
    );
  };

  const toggleComparison = (result: ProductResult) => {
    const id = result.product.id;
    if (validComparisonIds.includes(id)) {
      setComparisonIds(validComparisonIds.filter((item) => item !== id));
      events.mortgageComparisonUpdate(
        'remove',
        formatBankName(result.product.bankName),
        Math.max(0, validComparisonIds.length - 1),
      );
      return;
    }
    if (validComparisonIds.length < 3) {
      setComparisonIds([...validComparisonIds, id]);
      events.mortgageComparisonUpdate(
        'add',
        formatBankName(result.product.bankName),
        validComparisonIds.length + 1,
      );
    }
  };

  const selectMarketRange = (range: MarketRange) => {
    setMarketRange(range);
    const nextStatistics = calculateUvaDollarStatistics(
      filterMarketPoints(allMarketPoints, range).map((point) => point.uvaPerUsd),
    );
    events.mortgageMarketRangeSelect(range, nextStatistics?.signal ?? 'unavailable');
  };

  const t = (es: string, en: string) => lang === 'es' ? es : en;

  const marketSignalContent: Record<UvaDollarSignal, {
    title: string;
    explanation: string;
    disclaimer: string;
  }> = {
    borrow: {
      title: t('Señal histórica: buen momento relativo para endeudarse en UVA', 'Historical signal: relatively favorable time to borrow in UVA'),
      explanation: t('El dólar MEP compra pocas UVA frente al período elegido. Una propiedad valuada en USD se transforma, relativamente, en menos capital UVA.', 'The MEP dollar buys few UVA versus the selected period. A USD-priced property therefore translates into relatively less UVA principal.'),
      disclaimer: t('Antes de tomar deuda evaluá también TEA y CFTEA, cuota/ingreso, estabilidad y evolución de tus ingresos, plazo, anticipo, precio del inmueble y margen para absorber subas de la UVA.', 'Before borrowing, also assess APR and total cost, payment-to-income, income stability and growth, term, down payment, property price and your capacity to absorb UVA increases.'),
    },
    neutral: {
      title: t('Señal histórica: zona intermedia', 'Historical signal: middle range'),
      explanation: t('La relación dólar/UVA está dentro de la franja central del período elegido y no aporta una señal relativa fuerte para endeudarse o cancelar.', 'The dollar/UVA ratio is within the middle band for the selected period and provides no strong relative signal to borrow or repay.'),
      disclaimer: t('La decisión debe apoyarse en la tasa, el esfuerzo cuota/ingreso, el plazo, la liquidez disponible, los costos de la operación y tus objetivos financieros.', 'The decision should rely on the rate, payment-to-income effort, term, available liquidity, transaction costs and your financial goals.'),
    },
    repay: {
      title: t('Señal histórica: buen momento relativo para cancelar deuda UVA', 'Historical signal: relatively favorable time to repay UVA debt'),
      explanation: t('El dólar MEP compra muchas UVA frente al período elegido. Cada USD permite reducir relativamente más saldo expresado en UVA.', 'The MEP dollar buys many UVA versus the selected period. Each USD can reduce relatively more UVA-denominated principal.'),
      disclaimer: t('Antes de cancelar evaluá también comisión de precancelación, plazo restante, condiciones del banco, reserva de liquidez, impuestos y gastos, y el rendimiento alternativo de esos dólares.', 'Before repaying, also assess early repayment fees, remaining term, bank terms, liquidity reserves, taxes and expenses, and the alternative return on those dollars.'),
    },
  };
  const activeMarketSignal = marketStatistics
    ? marketSignalContent[marketStatistics.signal]
    : null;
  const MarketSignalIcon = marketStatistics?.signal === 'borrow'
    ? ArrowDownRight
    : marketStatistics?.signal === 'repay' ? ArrowUpRight : Scale;
  const marketRangeLabel = ({
    '1y': t('último año', 'last year'),
    '3y': t('últimos 3 años', 'last 3 years'),
    '5y': t('últimos 5 años', 'last 5 years'),
    max: t('máximo disponible', 'maximum available'),
  } as Record<MarketRange, string>)[marketRange];
  const marketMedianDifference = marketStatistics && marketStatistics.median > 0
    ? ((marketStatistics.current / marketStatistics.median) - 1) * 100
    : 0;

  const shareMortgageTool = async () => {
    setShareStatus('idle');
    const shareUrl = new URL('/recursos/hipotecarios/', window.location.origin).toString();

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Comparador Hipotecario UVA', url: shareUrl });
        setShareStatus('shared');
        events.mortgageShareResult('shared', 'native_share');
        return;
      } catch (error) {
        if (isShareCancellation(error)) {
          events.mortgageShareResult('cancelled', 'native_share');
          return;
        }
      }
    }

    try {
      if (!navigator.clipboard) throw new Error('CLIPBOARD_UNAVAILABLE');
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('copied');
      events.mortgageShareResult('copied', 'clipboard');
    } catch {
      setShareStatus('unavailable');
      events.mortgageShareResult('unavailable', 'clipboard');
    }
  };

  const toggleMobileAdditionalData = () => {
    const nextState = !mobileAdditionalDataOpen;
    setMobileAdditionalDataOpen(nextState);
    events.mortgageAdditionalDataToggle(nextState ? 'expanded' : 'collapsed');
  };

  const openMobileResult = () => {
    events.mortgageResultNavigation(bestByBank.length);
    document.getElementById('mortgage-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="mortgage-loading glass">
        <RefreshCw className="animate-spin" size={24} />
        <span>{t('Cargando líneas hipotecarias oficiales…', 'Loading official mortgage products…')}</span>
      </div>
    );
  }

  if (loadError || !snapshot) {
    return (
      <div className="mortgage-error glass">
        <AlertTriangle size={24} />
        <div>
          <strong>{t('No pudimos cargar los datos hipotecarios.', 'Mortgage data could not be loaded.')}</strong>
          <p>{t('La calculadora no mostrará resultados parciales o sin fuente.', 'The calculator will not show partial or unsourced results.')}</p>
        </div>
        <button type="button" onClick={() => void loadSnapshot()}>{t('Reintentar', 'Try again')}</button>
      </div>
    );
  }

  return (
    <div className="mortgage-tool" onPointerDownCapture={trackDedicatedStart} onKeyDownCapture={trackDedicatedStart}>
      <header className="mortgage-tool__header">
        <div>
          <span className="mortgage-kicker"><Home size={14} /> MGA / Hipotecarios UVA</span>
          <h2>{t('Compará bancos con tus números.', 'Compare banks using your numbers.')}</h2>
          <p>{t(
            'Calculá la primera cuota, filtrá líneas compatibles y explorá escenarios futuros sin confundir una estimación con un pronóstico.',
            'Estimate the first payment, filter compatible products and explore future scenarios without mistaking an estimate for a forecast.',
          )}</p>
        </div>
        <button
          type="button"
          className="mortgage-share"
          onClick={() => void shareMortgageTool()}
          aria-live="polite"
        >
          {shareStatus === 'shared' || shareStatus === 'copied' ? <Check size={16} /> : <Share2 size={16} />}
          {shareStatus === 'shared' && t('Compartido', 'Shared')}
          {shareStatus === 'copied' && t('Enlace copiado', 'Link copied')}
          {shareStatus === 'unavailable' && t('No se pudo compartir', 'Sharing unavailable')}
          {shareStatus === 'idle' && t('Compartir', 'Share')}
        </button>
      </header>

      <div className="mortgage-source-strip">
        <span><ShieldCheck size={15} /> {t('Datos oficiales BCRA', 'Official BCRA data')}</span>
        <span>UVA <strong>{formatArs(snapshot.uva.value)}</strong> · {formatDate(snapshot.uva.date, lang)}</span>
        <span>MEP <strong>{formatArs(snapshot.mep.value)}</strong></span>
        {marketStatistics && <a href="#uva-dollar-context" onClick={() => events.mortgageSectionNavigation('market_context')}>USD 1 MEP = <strong>{formatNumber(marketStatistics.current, 2)} UVA</strong></a>}
        <span>{snapshot.products.length} {t('líneas UVA', 'UVA products')}</span>
      </div>

      <section className="mortgage-main-grid" data-mortgage-section="calculator">
        <div className="mortgage-panel mortgage-form-panel">
          <div className="mortgage-section-title">
            <span>01</span>
            <div><h3>{t('Tu operación', 'Your transaction')}</h3><p>{t('Importes y condiciones iniciales', 'Starting amounts and conditions')}</p></div>
          </div>

          <div className="mortgage-currency-toggle mortgage-mobile-order-currency" role="group" aria-label={t('Moneda de la propiedad', 'Property currency')}>
            {(['USD', 'ARS'] as Currency[]).map((option) => (
              <button key={option} type="button" className={currency === option ? 'is-active' : ''} onClick={() => setCurrency(option)}>{option}</button>
            ))}
          </div>

          <label className="mortgage-field mortgage-mobile-order-property">
            <span>{t('Valor de la propiedad', 'Property value')}</span>
            <div className="mortgage-input-prefix"><strong>{currency === 'USD' ? 'US$' : '$'}</strong><input type="number" min={1} max={2_000_000_000} step={currency === 'USD' ? 1000 : 100000} value={propertyValue} onChange={(event) => {
              const nextValue = event.target.value;
              setPropertyValue(nextValue === '' ? '' : clampNumber(finite(nextValue), 0, 2_000_000_000));
            }} /></div>
          </label>

          {currency === 'USD' && (
            <label id="mortgage-mobile-exchange-rate" className={`mortgage-field mortgage-mobile-optional mortgage-mobile-order-exchange ${mobileAdditionalDataOpen ? 'is-expanded' : 'is-collapsed'}`}>
              <span>{t('Cotización usada', 'Exchange rate')}</span>
              <div className="mortgage-input-prefix"><strong>$</strong><input type="number" min={1} max={100000} step={1} value={exchangeRate} onChange={(event) => setExchangeRate(clampNumber(finite(event.target.value), 1, 100_000))} /></div>
              <small>{t('MEP de referencia. Podés editarlo para simular la operación.', 'Reference MEP rate. You can edit it for the transaction.')}</small>
            </label>
          )}

          <label className="mortgage-field mortgage-mobile-order-down-payment">
            <span>{t('Anticipo', 'Down payment')} <strong>{formatNumber(safeDownPayment)}%</strong></span>
            <input type="range" min={5} max={90} step={1} value={safeDownPayment} onChange={(event) => setDownPaymentPercent(finite(event.target.value, 25))} />
            <small>{formatArs(downPaymentArs)} · {currency === 'USD' ? formatUsd(downPaymentArs / safeExchangeRate) : `${formatNumber(downPaymentArs / safeExchangeRate)} USD ref.`}</small>
          </label>

          <fieldset id="mortgage-mobile-closing-costs" className={`mortgage-cost-settings mortgage-mobile-optional mortgage-mobile-order-costs ${mobileAdditionalDataOpen ? 'is-expanded' : 'is-collapsed'}`}>
            <legend>{t('Otros fondos al firmar', 'Other funds due at closing')}</legend>

            <div className={`mortgage-cost-control ${realEstateCommissionApplies ? '' : 'is-disabled'}`}>
              <label className="mortgage-cost-toggle">
                <input type="checkbox" checked={realEstateCommissionApplies} disabled={!isPropertyPurchase} onChange={(event) => setHasRealEstateCommission(event.target.checked)} />
                <span aria-hidden="true"><i /></span>
                <b>{t('Comisión inmobiliaria', 'Real estate commission')}</b>
                <small>{isPropertyPurchase ? t('Activala únicamente si corresponde.', 'Enable only when applicable.') : t('No corresponde para este destino.', 'Not applicable to this purpose.')}</small>
              </label>
              <label className="mortgage-percent-input">
                <span className="sr-only">{t('Porcentaje de comisión inmobiliaria', 'Real estate commission percentage')}</span>
                <input type="number" min={0} max={10} step={0.1} disabled={!realEstateCommissionApplies} value={safeRealEstateCommissionPercent} onChange={(event) => setRealEstateCommissionPercent(clampNumber(finite(event.target.value), 0, 10))} />
                <b>%</b>
              </label>
            </div>

            <div className="mortgage-cost-control is-fixed">
              <div className="mortgage-cost-fixed"><Check size={13} aria-hidden="true" /></div>
              <div className="mortgage-cost-copy">
                <b>{t('Escrituración estimada', 'Estimated deed costs')}</b>
                <small>{t('Base editable para honorarios, IVA, inscripción y gastos del título.', 'Editable baseline for fees, VAT, registration and title costs.')}</small>
              </div>
              <label className="mortgage-percent-input">
                <span className="sr-only">{t('Porcentaje estimado de escrituración', 'Estimated deed cost percentage')}</span>
                <input type="number" min={0} max={15} step={0.1} value={safeDeedCostsPercent} onChange={(event) => setDeedCostsPercent(clampNumber(finite(event.target.value), 0, 15))} />
                <b>%</b>
              </label>
            </div>

            <p><Info size={14} /> {t('El 3% es una previsión base, no un arancel. No incluye Impuesto de Sellos: depende de la jurisdicción, el destino y las exenciones vigentes.', 'The 3% is a budgeting baseline, not a fixed fee. Stamp tax is excluded because it depends on jurisdiction, purpose and current exemptions.')}</p>
          </fieldset>

          <label className="mortgage-field mortgage-mobile-order-purpose">
            <span>{t('Destino', 'Purpose')}</span>
            <div className="mortgage-select"><select value={destination} onChange={(event) => setDestination(event.target.value)}>{DESTINATIONS.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown size={16} /></div>
          </label>

          <label className="mortgage-field mortgage-mobile-order-profile">
            <span>{t('Tu condición', 'Your profile')}</span>
            <div className="mortgage-select"><select value={profile} onChange={(event) => setProfile(event.target.value as ApplicantProfile)}>{PROFILE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option[lang]}</option>)}</select><ChevronDown size={16} /></div>
          </label>

          <fieldset className="mortgage-field mortgage-mobile-order-term">
            <legend>{t('Plazo', 'Term')}</legend>
            <div className="mortgage-term-grid">{TERMS.map((term) => <button key={term} type="button" className={termYears === term ? 'is-active' : ''} onClick={() => { setTermYears(term); if (horizonYears > term) setHorizonYears(term); }}>{term}<small>{t('años', 'yrs')}</small></button>)}</div>
          </fieldset>

          <button
            type="button"
            className="mortgage-mobile-details-toggle"
            aria-expanded={mobileAdditionalDataOpen}
            aria-controls={currency === 'USD'
              ? 'mortgage-mobile-exchange-rate mortgage-mobile-closing-costs mortgage-mobile-family-income'
              : 'mortgage-mobile-closing-costs mortgage-mobile-family-income'}
            onClick={toggleMobileAdditionalData}
          >
            <span>
              <strong>{t('Gastos y datos adicionales', 'Costs and additional data')}</strong>
              <small>{t(
                `${currency === 'USD' ? 'MEP de referencia · ' : ''}Comisión ${formatNumber(safeRealEstateCommissionPercent, 1)}% · Escritura ${formatNumber(safeDeedCostsPercent, 1)}% · Ingreso opcional`,
                `${currency === 'USD' ? 'Reference MEP · ' : ''}Commission ${formatNumber(safeRealEstateCommissionPercent, 1)}% · Deed costs ${formatNumber(safeDeedCostsPercent, 1)}% · Optional income`,
              )}</small>
            </span>
            <ChevronDown size={18} aria-hidden="true" />
          </button>

          <label id="mortgage-mobile-family-income" className={`mortgage-field mortgage-mobile-optional mortgage-mobile-order-income ${mobileAdditionalDataOpen ? 'is-expanded' : 'is-collapsed'}`}>
            <span>{t('Ingreso familiar mensual', 'Monthly household income')} <em>{t('opcional', 'optional')}</em></span>
            <div className="mortgage-input-prefix"><strong>$</strong><input type="number" min={0} max={5_000_000_000} step={100000} placeholder={t('Para medir esfuerzo', 'To measure affordability')} value={familyIncome || ''} onChange={(event) => setFamilyIncome(clampNumber(finite(event.target.value), 0, 5_000_000_000))} /></div>
            <small>{t('Este dato se usa solamente en tu navegador y no se guarda.', 'This value is only used in your browser and is not stored.')}</small>
          </label>

          {selectedResult && (
            <section className="mortgage-mobile-result-summary" aria-label={t('Resumen de tu primera cuota', 'First payment summary')}>
              <header>
                <span>{t('Resultado preliminar', 'Preliminary result')}</span>
                <small>{bestByBank.length} {t(bestByBank.length === 1 ? 'banco compatible' : 'bancos compatibles', bestByBank.length === 1 ? 'compatible bank' : 'compatible banks')}</small>
              </header>
              <div>
                <p><small>{t('Primera cuota', 'First payment')}</small><strong>{formatArs(selectedResult.installmentArs)}</strong></p>
                <p><small>{t('Fondos iniciales', 'Upfront funds')}</small><strong>{formatArs(totalUpfrontFundsArs)}</strong></p>
              </div>
              <button type="button" onClick={openMobileResult}>
                {t('Ver cuota y comparar bancos', 'See payment and compare banks')}
                <ChevronDown size={17} aria-hidden="true" />
              </button>
            </section>
          )}
        </div>

        <aside id="mortgage-result" className="mortgage-panel mortgage-result-panel">
          <div className="mortgage-section-title">
            <span>02</span>
            <div><h3>{t('Tu primera cuota', 'Your first payment')}</h3><p>{t('Sistema francés · UVA de hoy', 'French system · current UVA')}</p></div>
          </div>

          {selectedResult ? (
            <>
              <label className="mortgage-field">
                <span>{t('Banco y línea aplicada', 'Selected bank and product')}</span>
                <div className="mortgage-select"><select value={selectedResult.product.id} onChange={(event) => selectProduct(event.target.value, 'calculator')}>{bestByBank.map((result) => <option key={result.product.id} value={result.product.id}>{formatBankName(result.product.bankName)} · {result.product.annualEffectiveRate.toFixed(2)}% TEA</option>)}</select><ChevronDown size={16} /></div>
              </label>

              <div className="mortgage-hero-result">
                <span>{t('Primera cuota estimada', 'Estimated first payment')}</span>
                <strong>{formatArs(selectedResult.installmentArs)}</strong>
                <small>{formatNumber(selectedResult.installmentUva, 2)} UVA por mes</small>
              </div>

              <div className="mortgage-metrics">
                <div><Banknote size={17} /><span>{t('Crédito', 'Loan')}</span><strong>{formatArs(loanAmountArs)}</strong><small>{formatNumber(loanAmountUva)} UVA</small></div>
                <div><Users size={17} /><span>{t('Ingreso requerido', 'Required income')}</span><strong>{formatArs(selectedResult.requiredIncome)}</strong><small>{formatNumber(selectedResult.product.paymentIncomeRatio)}% cuota/ingreso</small></div>
                <div><TrendingUp size={17} /><span>TEA / CFTEA</span><strong>{selectedResult.product.annualEffectiveRate.toFixed(2)}% / {selectedResult.product.totalFinancialCost.toFixed(2)}%</strong><small>{selectedResult.product.rateType}</small></div>
                <div><Scale size={17} /><span>{t('Financiación', 'Financing')}</span><strong>{formatNumber(financingPercent)}%</strong><small>{t('Máximo banco', 'Bank maximum')} {formatNumber(selectedResult.product.loanToValueRatio)}%</small></div>
              </div>

              <section className="mortgage-upfront-costs" aria-label={t('Fondos iniciales estimados', 'Estimated upfront funds')}>
                <header>
                  <div><span>{t('Fondos iniciales estimados', 'Estimated upfront funds')}</span><small>{t('Anticipo y gastos que no cubre el crédito', 'Down payment and costs not covered by the loan')}</small></div>
                  <div><strong>{formatArs(totalUpfrontFundsArs)}</strong><small>{currency === 'USD' ? formatUsd(totalUpfrontFundsArs / safeExchangeRate) : `${formatNumber(totalUpfrontFundsPercent, 1)}% del valor`}</small></div>
                </header>
                <dl>
                  <div><dt>{t('Anticipo', 'Down payment')} · {formatNumber(safeDownPayment)}%</dt><dd>{formatArs(downPaymentArs)}</dd></div>
                  <div><dt>{t('Comisión inmobiliaria', 'Real estate commission')} · {realEstateCommissionApplies ? `${formatNumber(safeRealEstateCommissionPercent, 1)}%` : t('No aplica', 'Not applicable')}</dt><dd>{realEstateCommissionApplies ? formatArs(realEstateCommissionArs) : '—'}</dd></div>
                  <div><dt>{t('Escrituración estimada', 'Estimated deed costs')} · {formatNumber(safeDeedCostsPercent, 1)}%</dt><dd>{formatArs(deedCostsArs)}</dd></div>
                </dl>
                <p><AlertTriangle size={14} /> {t('Reserva adicional: Sellos, tasación, seguros y cargos bancarios pueden sumarse según tu operación.', 'Additional reserve: stamp tax, appraisal, insurance and bank charges may apply to your transaction.')}</p>
                <nav aria-label={t('Fuentes sobre gastos de compraventa', 'Home purchase cost sources')}>
                  <a href="https://www.colegio-escribanos.org.ar/2020/04/24/compraventa/" target="_blank" rel="noopener noreferrer" onClick={() => events.mortgageSourceClick('colegio_escribanos_costs', 'closing_costs')}>{t('Qué paga el comprador', 'Buyer responsibilities')} <ExternalLink size={12} /></a>
                  <a href="https://www.agip.gob.ar/beneficios/64" target="_blank" rel="noopener noreferrer" onClick={() => events.mortgageSourceClick('agip_stamp_tax', 'closing_costs')}>{t('Exención Sellos CABA', 'CABA stamp tax exemption')} <ExternalLink size={12} /></a>
                </nav>
              </section>

              {familyIncome > 0 && (
                <div className={`mortgage-effort-callout is-${getEffortTone((selectedResult.installmentArs / familyIncome) * 100)}`}>
                  <span>{t('Tu esfuerzo inicial', 'Your initial effort')}</span>
                  <strong>{formatNumber((selectedResult.installmentArs / familyIncome) * 100, 1)}%</strong>
                  <small>{t('de tu ingreso familiar declarado', 'of your stated household income')}</small>
                </div>
              )}

              <div className="mortgage-result-note"><Info size={16} /><p>{t('La cuota es financiera y orientativa. Los gastos iniciales se muestran por separado y no modifican el capital solicitado.', 'This is an indicative financial payment. Upfront costs are shown separately and do not change the requested principal.')}</p></div>
            </>
          ) : (
            <div className="mortgage-no-results"><CircleHelp size={28} /><strong>{t('No encontramos una línea compatible.', 'No compatible product found.')}</strong><p>{t('Probá aumentar el anticipo, reducir el plazo solicitado o mostrar todas las condiciones.', 'Try a larger down payment, another term, or show every condition.')}</p></div>
          )}
        </aside>
      </section>

      <section className="mortgage-ranking mortgage-panel" data-mortgage-section="bank_ranking">
        <div className="mortgage-ranking__header">
          <div className="mortgage-section-title"><span>03</span><div><h3>{t('Qué banco te conviene', 'Which bank fits best')}</h3><p>{bestByBank.length} {t('bancos compatibles ordenados por primera cuota', 'compatible banks ranked by first payment')}</p></div></div>
          <div className="mortgage-ranking__legend"><i /> {t('Elegí hasta 3 para comparar', 'Choose up to 3 to compare')}</div>
        </div>

        {bestByBank.length > 0 ? (
          <>
            <div className="mortgage-table-wrap">
              <table className="mortgage-table">
                <thead><tr><th>{t('Comparar', 'Compare')}</th><th>{t('Banco / línea', 'Bank / product')}</th><th>{t('Primera cuota', 'First payment')}</th><th>TEA</th><th>CFTEA</th><th>{t('Financia', 'LTV')}</th><th>{t('Ingreso req.', 'Req. income')}</th><th /></tr></thead>
                <tbody>{displayedBanks.map((result, index) => {
                  const selected = result.product.id === selectedResult?.product.id;
                  const compared = validComparisonIds.includes(result.product.id);
                  return (
                    <tr key={result.product.id} className={selected ? 'is-selected' : ''}>
                      <td><button type="button" className={`mortgage-compare-check ${compared ? 'is-active' : ''}`} disabled={!compared && validComparisonIds.length >= 3} onClick={() => toggleComparison(result)} aria-label={t('Comparar banco', 'Compare bank')}>{compared ? <Check size={14} /> : index + 1}</button></td>
                      <td><strong>{formatBankName(result.product.bankName)}</strong><small>{result.product.shortName || result.product.productName} · {result.product.beneficiary}</small></td>
                      <td><strong>{formatArs(result.installmentArs)}</strong><small>{formatNumber(result.installmentUva, 2)} UVA</small></td>
                      <td>{result.product.annualEffectiveRate.toFixed(2)}%</td>
                      <td>{result.product.totalFinancialCost.toFixed(2)}%</td>
                      <td>{formatNumber(result.product.loanToValueRatio)}%</td>
                      <td>{formatArs(result.requiredIncome)}</td>
                      <td><button type="button" className="mortgage-use-bank" onClick={() => selectProduct(result.product.id, 'ranking')}>{selected ? t('Elegido', 'Selected') : t('Elegir', 'Choose')}</button></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
            {bestByBank.length > 8 && <button type="button" className="mortgage-show-more" onClick={() => { const nextState = !showAllBanks; setShowAllBanks(nextState); events.mortgageBankListToggle(nextState ? 'expanded' : 'collapsed', bestByBank.length); }}>{showAllBanks ? t('Ver menos', 'Show less') : `${t('Ver todos', 'Show all')} (${bestByBank.length})`} <ChevronDown size={15} /></button>}
          </>
        ) : <div className="mortgage-empty-ranking"><AlertTriangle size={20} /> {t('Ningún producto oficial satisface simultáneamente el monto, anticipo, plazo y condición elegidos.', 'No official product matches the chosen amount, down payment, term and profile.')}</div>}
      </section>

      {comparisonResults.length >= 2 && (
        <section className="mortgage-comparison-grid" aria-label={t('Comparación seleccionada', 'Selected comparison')}>
          {comparisonResults.map((result) => (
            <article key={result.product.id} className="mortgage-panel">
              <span>{formatBankName(result.product.bankName)}</span>
              <h4>{formatArs(result.installmentArs)}</h4>
              <p>{result.product.shortName || result.product.productName}</p>
              <dl><div><dt>TEA</dt><dd>{result.product.annualEffectiveRate.toFixed(2)}%</dd></div><div><dt>CFTEA</dt><dd>{result.product.totalFinancialCost.toFixed(2)}%</dd></div><div><dt>{t('Financia', 'LTV')}</dt><dd>{formatNumber(result.product.loanToValueRatio)}%</dd></div><div><dt>{t('Plazo máx.', 'Max term')}</dt><dd>{formatNumber(result.product.maxTermMonths / 12)} {t('años', 'yrs')}</dd></div></dl>
            </article>
          ))}
        </section>
      )}

      {selectedResult && (
        <section className="mortgage-scenarios mortgage-panel" data-mortgage-section="scenarios">
          <div className="mortgage-scenario-intro">
            <div className="mortgage-section-title"><span>04</span><div><h3>{t('Cómo podría evolucionar tu cuota', 'How your payment could evolve')}</h3><p>{t('Escenarios educativos · supuestos editables · no es un pronóstico', 'Educational scenarios · editable assumptions · not a forecast')}</p></div></div>
            <span className="mortgage-not-forecast"><AlertTriangle size={15} /> {t('Escenario, no pronóstico', 'Scenario, not forecast')}</span>
          </div>

          <div className="mortgage-fundamentals">
            {[
              { Icon: Calculator, title: t('Cuota constante en UVA', 'Constant payment in UVA'), description: t('El sistema francés mantiene la cuota financiera aproximadamente constante en UVA.', 'The French system keeps the financial payment roughly constant in UVA.') },
              { Icon: TrendingUp, title: t('Pesos variables', 'Variable ARS amount'), description: t('La cuota en pesos surge de multiplicar la cuota UVA por la UVA de cada período.', 'The ARS payment equals the UVA payment times each period’s UVA value.') },
              { Icon: Users, title: t('Ingreso independiente', 'Independent income'), description: t('Tu salario no está atado a la UVA; por eso se proyecta con un supuesto separado.', 'Income is not linked to UVA, so it uses a separate assumption.') },
              { Icon: Scale, title: t('Importa el esfuerzo', 'Affordability matters'), description: t('La señal de riesgo es la relación cuota/ingreso, no solamente el monto nominal.', 'The risk signal is payment-to-income, not the nominal amount alone.') },
            ].map(({ Icon: FundamentalIcon, title, description }) => {
              return <article key={title}><FundamentalIcon size={18} /><strong>{title}</strong><p>{description}</p></article>;
            })}
          </div>

          <div className="mortgage-scenario-layout">
            <div className="mortgage-scenario-controls">
              <span className="mortgage-control-label">{t('Escenario rápido', 'Quick scenario')}</span>
              <div className="mortgage-scenario-presets">
                {([
                  ['same', t('Mismo ritmo', 'Same pace')],
                  ['lag', t('Rezago salarial', 'Income lag')],
                  ['frozen', t('Ingreso congelado', 'Frozen income')],
                  ['custom', t('Personalizado', 'Custom')],
                ] as Array<[ScenarioMode, string]>).map(([mode, label]) => <button key={mode} type="button" className={scenarioMode === mode ? 'is-active' : ''} onClick={() => applyScenario(mode)}>{label}</button>)}
              </div>

              <label className="mortgage-field">
                <span>{t('Variación UVA supuesta por mes', 'Assumed monthly UVA change')} <strong>{monthlyUvaChange.toFixed(1)}%</strong></span>
                <input type="range" min={0} max={8} step={0.1} value={monthlyUvaChange} onChange={(event) => changeUvaScenario(finite(event.target.value))} />
                <small>{t('Supuesto simplificado sobre UVA; no replica el calendario diario del CER.', 'Simplified UVA assumption; it does not reproduce the daily CER calendar.')}</small>
              </label>

              <label className="mortgage-field">
                <span>{t('Variación del ingreso por mes', 'Monthly income change')} <strong>{monthlyIncomeChange.toFixed(1)}%</strong></span>
                <input type="range" min={0} max={8} step={0.1} value={monthlyIncomeChange} disabled={scenarioMode !== 'custom'} onChange={(event) => setMonthlyIncomeChange(clampNumber(finite(event.target.value), 0, 8))} />
                <small>{scenarioMode === 'custom' ? t('Editable de forma independiente.', 'Independently editable.') : t('Definida por el escenario rápido elegido.', 'Set by the selected quick scenario.')}</small>
              </label>

              <fieldset className="mortgage-field"><legend>{t('Horizonte', 'Horizon')}</legend><div className="mortgage-horizon-grid">{[1, 3, 5, 10].filter((year) => year <= termYears).map((year) => <button key={year} type="button" className={effectiveHorizonYears === year ? 'is-active' : ''} onClick={() => setHorizonYears(year)}>{year} {t(year === 1 ? 'año' : 'años', year === 1 ? 'year' : 'years')}</button>)}</div></fieldset>

              <div className="mortgage-scenario-basis"><Info size={16} /><p>{familyIncome > 0 ? t('El escenario parte del ingreso familiar que ingresaste.', 'The scenario starts from the household income you entered.') : t('Como no ingresaste un ingreso, el escenario parte del mínimo requerido por el banco.', 'Because no income was entered, the scenario starts from the bank’s required minimum.')}</p></div>
            </div>

            <div className="mortgage-scenario-chart">
              <div><LineChart size={18} /><span>{t('Esfuerzo cuota / ingreso', 'Payment / income effort')}</span></div>
              <EffortChart points={projection} lang={lang} />
              <div className="mortgage-risk-legend"><span className="is-green">≤25%</span><span className="is-yellow">25–30%</span><span className="is-orange">30–35%</span><span className="is-red">+35%</span></div>
            </div>
          </div>

          <div className="mortgage-milestones">
            {milestoneMonths.map((month) => {
              const point = projection[month];
              if (!point) return null;
              const tone = getEffortTone(point.effortRatio);
              return (
                <article key={month}>
                  <span>{month === 0 ? t('Hoy', 'Now') : `${t('Año', 'Year')} ${month / 12}`}</span>
                  <strong>{formatArs(point.installmentArs)}</strong>
                  <small>{t('Ingreso', 'Income')}: {formatArs(point.incomeArs)}</small>
                  <b className={`is-${tone}`}>{formatNumber(point.effortRatio, 1)}% {t('del ingreso', 'of income')}</b>
                  <em>{t('Saldo', 'Balance')}: {formatNumber(point.remainingUva)} UVA</em>
                </article>
              );
            })}
          </div>

          <details className="mortgage-methodology" onToggle={(event) => { if (event.currentTarget.open) events.mortgageMethodologyOpen('scenario'); }}>
            <summary>{t('Fundamentos, fórmula y límites del escenario', 'Scenario fundamentals, formula and limits')} <ChevronDown size={16} /></summary>
            <div>
              <p><strong>{t('Qué permanece constante:', 'What remains constant:')}</strong> {t('la cuota financiera en UVA y la TEA informada para la línea elegida.', 'the financial payment in UVA and the selected product’s reported TEA.')}</p>
              <p><strong>{t('Qué se proyecta:', 'What is projected:')}</strong> {t('el valor nominal de la UVA y el ingreso familiar mediante variaciones mensuales compuestas.', 'the nominal UVA value and household income using compounded monthly changes.')}</p>
              <p><strong>{t('Qué no se proyecta:', 'What is not projected:')}</strong> {t('dólar, seguros, impuestos, gastos de escritura, cambios contractuales o decisiones futuras del banco.', 'FX, insurance, taxes, deed costs, contract changes or future bank decisions.')}</p>
              <p><strong>{t('Saldo:', 'Balance:')}</strong> {t('disminuye según la amortización francesa en UVA; su equivalente en pesos puede subir si la UVA aumenta.', 'declines under French amortization in UVA; its ARS equivalent may rise when UVA increases.')}</p>
            </div>
          </details>
        </section>
      )}

      {marketStatistics && activeMarketSignal && (
        <section id="uva-dollar-context" className="mortgage-market mortgage-panel" data-mortgage-section="market_context">
          <div className="mortgage-scenario-intro">
            <div className="mortgage-section-title"><span>05</span><div><h3>{t('El dólar frente a la UVA', 'The dollar versus UVA')}</h3><p>{t('Poder de compra del dólar MEP medido en UVA', 'Purchasing power of the MEP dollar measured in UVA')}</p></div></div>
            <span className="mortgage-not-forecast"><AlertTriangle size={15} /> {t('Contexto, no recomendación', 'Context, not advice')}</span>
          </div>

          <div className={`mortgage-market-signal is-${marketStatistics.signal}`}>
            <MarketSignalIcon size={22} />
            <div>
              <strong>{activeMarketSignal.title}</strong>
              <p>{activeMarketSignal.explanation}</p>
            </div>
            <span>{t('Percentil', 'Percentile')} {formatPercentile(marketStatistics.currentPercentile)}</span>
          </div>

          <div className="mortgage-market-layout">
            <aside className="mortgage-market-summary">
              <span>{t('Valor actual', 'Current value')}</span>
              <div><DollarSign size={22} /><strong>{formatNumber(marketStatistics.current, 2)}</strong><em>UVA / USD MEP</em></div>
              <p>{t('Cada USD 1 convertido al MEP representa hoy esta cantidad de UVA.', 'Each USD 1 converted at the MEP rate represents this amount of UVA today.')}</p>
              <dl>
                <div><dt>{t('Mediana', 'Median')} · {marketRangeLabel}</dt><dd>{formatNumber(marketStatistics.median, 2)}</dd></div>
                <div><dt>{t('Franja central', 'Middle band')} · P25–P75</dt><dd>{formatNumber(marketStatistics.percentile25, 2)}–{formatNumber(marketStatistics.percentile75, 2)}</dd></div>
                <div><dt>{t('Distancia a mediana', 'Distance from median')}</dt><dd>{marketMedianDifference >= 0 ? '+' : ''}{formatNumber(marketMedianDifference, 1)}%</dd></div>
              </dl>
            </aside>

            <div className="mortgage-market-visual">
              <header>
                <div><LineChart size={18} /><span>{t('Evolución histórica', 'Historical evolution')}</span></div>
                <div className="mortgage-market-ranges" role="group" aria-label={t('Período histórico', 'Historical period')}>
                  {([
                    ['1y', t('1 año', '1 year')],
                    ['3y', t('3 años', '3 years')],
                    ['5y', t('5 años', '5 years')],
                    ['max', t('Máx.', 'Max')],
                  ] as Array<[MarketRange, string]>).map(([range, label]) => (
                    <button key={range} type="button" className={marketRange === range ? 'is-active' : ''} onClick={() => selectMarketRange(range)}>{label}</button>
                  ))}
                </div>
              </header>
              <UvaDollarChart points={displayedMarketPoints} statistics={marketStatistics} lang={lang} />
              <div className="mortgage-market-legend">
                <span className="is-repay">{t('Más UVA por USD · favorece cancelar', 'More UVA per USD · favors repayment')}</span>
                <span className="is-neutral">{t('Zona intermedia', 'Middle range')}</span>
                <span className="is-borrow">{t('Menos UVA por USD · favorece endeudarse', 'Fewer UVA per USD · favors borrowing')}</span>
              </div>
            </div>
          </div>

          <div className="mortgage-market-personal">
            <article>
              <span>{t('Aplicado a tu operación', 'Applied to your transaction')}</span>
              <strong>{formatNumber(referenceFinancedUva)} UVA</strong>
              <p>{t(
                `A la cotización MEP de referencia, los ${formatUsd(referenceFinancedUsd)} financiados equivalen a este capital UVA.`,
                `At the reference MEP rate, the financed ${formatUsd(referenceFinancedUsd)} equals this UVA principal.`,
              )}</p>
            </article>
            <article className={`is-${marketStatistics.signal}`}>
              <span>{t('Qué más tenés que evaluar', 'What else to assess')}</span>
              <p>{activeMarketSignal.disclaimer}</p>
            </article>
          </div>

          <div className="mortgage-fundamentals mortgage-market-fundamentals">
            {[
              { Icon: Calculator, title: t('Fórmula', 'Formula'), description: t('Dólar MEP en ARS dividido por UVA en ARS. El resultado se expresa en UVA por USD.', 'MEP dollar in ARS divided by UVA in ARS. The result is UVA per USD.') },
              { Icon: Scale, title: t('Referencia robusta', 'Robust benchmark'), description: t('La señal usa mediana y percentiles 25/75 del período elegido; no copia un promedio fijo.', 'The signal uses the median and 25th/75th percentiles for the chosen period; it does not copy a fixed average.') },
              { Icon: ShieldCheck, title: t('Fuentes separadas', 'Separate sources'), description: t('UVA oficial BCRA. MEP histórico referencial no oficial, identificado y fechado.', 'Official BCRA UVA. Non-official reference MEP history, identified and dated.') },
              { Icon: AlertTriangle, title: t('No es una decisión completa', 'Not a complete decision'), description: t('No incorpora tasa, ingresos, comisiones, impuestos, liquidez ni costo de oportunidad.', 'It excludes interest rate, income, fees, taxes, liquidity and opportunity cost.') },
            ].map(({ Icon: FundamentalIcon, title, description }) => (
              <article key={title}><FundamentalIcon size={18} /><strong>{title}</strong><p>{description}</p></article>
            ))}
          </div>

          <details className="mortgage-methodology mortgage-market-methodology" onToggle={(event) => { if (event.currentTarget.open) events.mortgageMethodologyOpen('market_context'); }}>
            <summary>{t('Fundamentos, fuentes y límites del indicador', 'Indicator fundamentals, sources and limits')} <ChevronDown size={16} /></summary>
            <div>
              <p><strong>{t('Cálculo:', 'Calculation:')}</strong> {t('MEP ARS/USD ÷ UVA ARS/UVA = UVA/USD. Se unen ambos valores por fecha y se usa la última fecha común disponible.', 'MEP ARS/USD ÷ UVA ARS/UVA = UVA/USD. Both values are joined by date, using the latest common available date.')}</p>
              <p><strong>{t('Benchmark:', 'Benchmark:')}</strong> {t('la mediana reduce el efecto de picos extremos. P25 y P75 delimitan la mitad central de observaciones del período seleccionado.', 'the median reduces the effect of extreme spikes. P25 and P75 delimit the middle half of observations in the selected period.')}</p>
              <p><strong>{t('Serie:', 'Series:')}</strong> {t(`disponible desde ${formatDate(snapshot.marketContext?.firstDate ?? '', lang)}. En días sin mercado la fuente histórica puede repetir el último valor informado.`, `available since ${formatDate(snapshot.marketContext?.firstDate ?? '', lang)}. On non-trading days the historical source may repeat the last reported value.`)}</p>
              <p><strong>{t('Alcance:', 'Scope:')}</strong> {t('“Buen momento” significa solamente una posición relativa favorable dentro de esta relación histórica. No anticipa el dólar ni la UVA y no reemplaza una evaluación financiera integral.', '“Favorable time” only means a favorable relative position within this historical relationship. It forecasts neither FX nor UVA and does not replace a full financial assessment.')}</p>
            </div>
          </details>

          <nav className="mortgage-market-sources" aria-label={t('Fuentes del indicador dólar UVA', 'Dollar UVA indicator sources')}>
            <a href="https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/31" target="_blank" rel="noopener noreferrer" onClick={() => events.mortgageSourceClick('bcra_uva', 'market_context')}>BCRA · UVA <ExternalLink size={12} /></a>
            <a href="https://argentinadatos.com/docs/operations/get-cotizaciones-dolares" target="_blank" rel="noopener noreferrer" onClick={() => events.mortgageSourceClick('argentina_datos_mep_history', 'market_context')}>ArgentinaDatos · MEP {t('histórico', 'history')} <ExternalLink size={12} /></a>
            <a href="https://dolarapi.com/docs/argentina/operations/get-dolar-bolsa" target="_blank" rel="noopener noreferrer" onClick={() => events.mortgageSourceClick('dolar_api_mep_current', 'market_context')}>DolarAPI · MEP {t('actual', 'current')} <ExternalLink size={12} /></a>
            <a href="https://www.byma.com.ar/newsroom/byma-presenta-dos-nuevos-ndices-para-el-mercado-argentino" target="_blank" rel="noopener noreferrer" onClick={() => events.mortgageSourceClick('byma_methodology', 'market_context')}>BYMA · {t('referencia metodológica', 'methodology reference')} <ExternalLink size={12} /></a>
          </nav>
        </section>
      )}

      <footer className="mortgage-disclaimer">
        <div><Info size={18} /><p>{t('Herramienta informativa. No constituye asesoramiento financiero ni una oferta crediticia. La aprobación, tasa final, seguros y gastos dependen de la evaluación y documentación de cada entidad.', 'Informational tool. It is not financial advice or a credit offer. Approval, final rate, insurance and costs depend on each bank’s assessment and documentation.')}</p></div>
        <div className="mortgage-source-links">
          <a href={snapshot.sources.mortgages} target="_blank" rel="noopener noreferrer" onClick={() => events.mortgageSourceClick('bcra_mortgage_products', 'mortgage_products')}>BCRA · {t('Hipotecarios', 'Mortgages')} <ExternalLink size={13} /></a>
          <a href="https://www.bcra.gob.ar/regimen-de-transparencia/" target="_blank" rel="noopener noreferrer" onClick={() => events.mortgageSourceClick('bcra_transparency_methodology', 'mortgage_products')}>{t('Metodología', 'Methodology')} <ExternalLink size={13} /></a>
        </div>
      </footer>
    </div>
  );
}
