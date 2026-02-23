import { supabase } from '@/lib/supabase';

export interface TaxBracket {
  limite: number;
  fijo: number;
  pct: number;
}

export interface TaxParams {
  period: string;
  gni: number;
  deduccion_especial: number;
  conyuge: number;
  hijo: number;
  hijo_incapacitado: number;
  aportes_pct: number;
  aportes_base_min: number;
  aportes_base_max: number;
  alquiler_pct: number;
  alquiler_tope: number;
  hipotecario_tope: number;
  medicos_pct: number;
  gn_tope_pct: number;
  educacion_tope: number;
  seguro_vida_tope: number;
  sepelio_tope: number;
  escala: TaxBracket[];
}

export interface TaxScenario {
  labelEs: string;
  labelEn: string;
  salaryLabelEs: string;
  salaryLabelEn: string;
  grossSalary: number;
  conyuge: boolean;
  hijos: number;
  hijosIncap: number;
  alquiler: number;
  alquilerAnual: boolean;
  extraIncome: number;
  includeSac: boolean;
  colorClass: string;
}

export interface TaxTab {
  tabId: string;
  labelEs: string;
  labelEn: string;
  titleEs: string;
  titleEn: string;
  contentEs: string;
  contentEn: string;
  formulaEs: string;
  formulaEn: string;
}

export interface AiModel {
  name: string;
  provider: string;
  inputPer1M: number;
  outputPer1M: number;
  color: string;
}

export async function fetchTaxData(): Promise<{
  params: TaxParams;
  scenarios: TaxScenario[];
  tabs: TaxTab[];
}> {
  const [
    { data: paramsRows, error: e1 },
    { data: brackets, error: e2 },
    { data: scenarios, error: e3 },
    { data: tabs, error: e4 },
  ] = await Promise.all([
    supabase.from('tax_calculator_params').select('*').order('id').limit(1),
    supabase.from('tax_scale_brackets').select('*').order('bracket_order'),
    supabase.from('tax_scenarios').select('*').order('sort_order'),
    supabase.from('tax_tabs').select('*').order('sort_order'),
  ]);
  if (e1 || e2 || e3 || e4) throw e1 ?? e2 ?? e3 ?? e4;

  const p = (paramsRows ?? [])[0];
  const params: TaxParams = {
    period: p.period,
    gni: Number(p.gni),
    deduccion_especial: Number(p.deduccion_especial),
    conyuge: Number(p.conyuge),
    hijo: Number(p.hijo),
    hijo_incapacitado: Number(p.hijo_incapacitado),
    aportes_pct: Number(p.aportes_pct),
    aportes_base_min: Number(p.aportes_base_min),
    aportes_base_max: Number(p.aportes_base_max),
    alquiler_pct: Number(p.alquiler_pct),
    alquiler_tope: Number(p.alquiler_tope),
    hipotecario_tope: Number(p.hipotecario_tope),
    medicos_pct: Number(p.medicos_pct),
    gn_tope_pct: Number(p.gn_tope_pct),
    educacion_tope: Number(p.educacion_tope),
    seguro_vida_tope: Number(p.seguro_vida_tope),
    sepelio_tope: Number(p.sepelio_tope),
    escala: (brackets ?? [])
      .filter((b) => b.params_id === p.id)
      .map((b) => ({ limite: Number(b.limit_amount), fijo: Number(b.fixed_amount), pct: Number(b.pct) })),
  };

  const parsedScenarios: TaxScenario[] = (scenarios ?? []).map((s) => ({
    labelEs: s.label_es,
    labelEn: s.label_en,
    salaryLabelEs: s.salary_label_es,
    salaryLabelEn: s.salary_label_en,
    grossSalary: Number(s.gross_salary),
    conyuge: s.conyuge,
    hijos: s.hijos,
    hijosIncap: s.hijos_incap,
    alquiler: Number(s.alquiler),
    alquilerAnual: s.alquiler_anual,
    extraIncome: Number(s.extra_income),
    includeSac: s.include_sac,
    colorClass: s.color_class,
  }));

  const parsedTabs: TaxTab[] = (tabs ?? []).map((t) => ({
    tabId: t.tab_id,
    labelEs: t.label_es,
    labelEn: t.label_en,
    titleEs: t.title_es,
    titleEn: t.title_en,
    contentEs: t.content_es,
    contentEn: t.content_en,
    formulaEs: t.formula_es,
    formulaEn: t.formula_en,
  }));

  return { params, scenarios: parsedScenarios, tabs: parsedTabs };
}

export async function fetchAiModels(): Promise<AiModel[]> {
  const { data, error } = await supabase.from('ai_models').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []).map((m) => ({
    name: m.name,
    provider: m.provider,
    inputPer1M: Number(m.input_per_1m),
    outputPer1M: Number(m.output_per_1m),
    color: m.color_class,
  }));
}

export async function fetchPlazoFijoRates(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('plazo_fijo_rates')
    .select('period, monthly_rate')
    .order('period');
  if (error) throw error;
  const result: Record<string, number> = {};
  for (const row of data ?? []) {
    result[row.period] = Number(row.monthly_rate);
  }
  return result;
}
