export interface MortgageProjectionPoint {
  month: number;
  installmentArs: number;
  incomeArs: number;
  effortRatio: number;
  remainingUva: number;
  remainingArs: number;
  projectedUva: number;
}

export type UvaDollarSignal = 'borrow' | 'neutral' | 'repay';

export interface UvaDollarStatistics {
  current: number;
  mean: number;
  median: number;
  percentile25: number;
  percentile75: number;
  currentPercentile: number;
  signal: UvaDollarSignal;
}

export function clampNumber(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(Math.max(value, minimum), maximum);
}

export function quantile(values: number[], percentile: number): number {
  const sorted = values
    .filter((value) => Number.isFinite(value))
    .sort((left, right) => left - right);
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];

  const position = clampNumber(percentile, 0, 1) * (sorted.length - 1);
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const weight = position - lowerIndex;
  return sorted[lowerIndex] * (1 - weight) + sorted[upperIndex] * weight;
}

export function calculateUvaDollarStatistics(values: number[]): UvaDollarStatistics | null {
  const validValues = values.filter((value) => Number.isFinite(value) && value > 0);
  if (validValues.length < 2) return null;

  const current = validValues[validValues.length - 1];
  const percentile25 = quantile(validValues, 0.25);
  const median = quantile(validValues, 0.5);
  const percentile75 = quantile(validValues, 0.75);
  const currentPercentile = (
    validValues.filter((value) => value <= current).length / validValues.length
  ) * 100;

  return {
    current,
    mean: validValues.reduce((total, value) => total + value, 0) / validValues.length,
    median,
    percentile25,
    percentile75,
    currentPercentile,
    signal: current <= percentile25 ? 'borrow' : current >= percentile75 ? 'repay' : 'neutral',
  };
}

export function annualEffectiveToMonthlyRate(annualEffectiveRate: number): number {
  const normalizedRate = clampNumber(annualEffectiveRate, 0, 100) / 100;
  return Math.pow(1 + normalizedRate, 1 / 12) - 1;
}

export function frenchInstallment(
  principal: number,
  monthlyRate: number,
  months: number,
): number {
  if (!Number.isFinite(principal) || principal <= 0) return 0;
  const normalizedMonths = Math.max(1, Math.round(months));
  if (!Number.isFinite(monthlyRate) || monthlyRate <= 0) return principal / normalizedMonths;

  const compound = Math.pow(1 + monthlyRate, normalizedMonths);
  return principal * ((monthlyRate * compound) / (compound - 1));
}

export function remainingBalance(
  principal: number,
  installment: number,
  monthlyRate: number,
  paidMonths: number,
): number {
  if (paidMonths <= 0) return principal;
  if (monthlyRate <= 0) return Math.max(0, principal - installment * paidMonths);
  const compound = Math.pow(1 + monthlyRate, paidMonths);
  return Math.max(0, principal * compound - installment * ((compound - 1) / monthlyRate));
}

export function buildMortgageProjection({
  principalUva,
  installmentUva,
  annualEffectiveRate,
  currentUva,
  startingIncome,
  monthlyUvaChange,
  monthlyIncomeChange,
  horizonMonths,
}: {
  principalUva: number;
  installmentUva: number;
  annualEffectiveRate: number;
  currentUva: number;
  startingIncome: number;
  monthlyUvaChange: number;
  monthlyIncomeChange: number;
  horizonMonths: number;
}): MortgageProjectionPoint[] {
  const monthlyRate = annualEffectiveToMonthlyRate(annualEffectiveRate);
  const safeHorizon = Math.max(0, Math.round(horizonMonths));
  const uvaGrowth = clampNumber(monthlyUvaChange, -5, 15) / 100;
  const incomeGrowth = clampNumber(monthlyIncomeChange, -5, 15) / 100;
  const points: MortgageProjectionPoint[] = [];

  for (let month = 0; month <= safeHorizon; month += 1) {
    const projectedUva = currentUva * Math.pow(1 + uvaGrowth, month);
    const installmentArs = installmentUva * projectedUva;
    const incomeArs = startingIncome * Math.pow(1 + incomeGrowth, month);
    const remainingUva = remainingBalance(
      principalUva,
      installmentUva,
      monthlyRate,
      month,
    );

    points.push({
      month,
      installmentArs,
      incomeArs,
      effortRatio: incomeArs > 0 ? (installmentArs / incomeArs) * 100 : 100,
      remainingUva,
      remainingArs: remainingUva * projectedUva,
      projectedUva,
    });
  }

  return points;
}
