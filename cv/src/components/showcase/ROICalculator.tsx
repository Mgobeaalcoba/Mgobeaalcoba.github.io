"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Zap,
  ArrowRight,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ROIInputs {
  numEmployees: number;
  manualHoursPerWeek: number;
  hourlyCost: number;
  implementationCost: number;
}

const DEFAULT_INPUTS: ROIInputs = {
  numEmployees: 5,
  manualHoursPerWeek: 10,
  hourlyCost: 25,
  implementationCost: 5000,
};

export default function ROICalculator() {
  const { lang } = useLanguage();
  const [inputs, setInputs] = useState<ROIInputs>(DEFAULT_INPUTS);

  const results = useMemo(() => {
    const annualManualCost =
      inputs.numEmployees * inputs.manualHoursPerWeek * 52 * inputs.hourlyCost;
    const efficiencyGain = 0.85; // 85% efficiency gain
    const monthlyAutomatedMaintenance = 200; // Assume some cost for maintenance
    const annualMaintenance = monthlyAutomatedMaintenance * 12;

    const annualSavings = annualManualCost * efficiencyGain - annualMaintenance;
    const monthlySavings = annualSavings / 12;
    const paybackMonths =
      inputs.implementationCost / (monthlySavings > 0 ? monthlySavings : 1);
    const roiPercentage =
      ((annualSavings * 3 - inputs.implementationCost) /
        inputs.implementationCost) *
      100;

    return {
      annualManualCost,
      annualSavings,
      paybackMonths,
      roiPercentage,
      threeYearTotalSavings: annualSavings * 3 - inputs.implementationCost,
    };
  }, [inputs]);

  const chartData = {
    labels:
      lang === "es"
        ? ["Año 1", "Año 2", "Año 3"]
        : ["Year 1", "Year 2", "Year 3"],
    datasets: [
      {
        label:
          lang === "es" ? "Costo Manual Acumulado" : "Accumulated Manual Cost",
        data: [
          results.annualManualCost,
          results.annualManualCost * 2,
          results.annualManualCost * 3,
        ],
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label:
          lang === "es" ? "Costo con Automatización" : "Cost with Automation",
        data: [
          inputs.implementationCost + results.annualManualCost * 0.15,
          inputs.implementationCost + results.annualManualCost * 0.15 * 2,
          inputs.implementationCost + results.annualManualCost * 0.15 * 3,
        ],
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: "#9ca3af", boxWidth: 12, font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#f3f4f6",
        bodyColor: "#d1d5db",
        borderColor: "#374151",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: { color: "#374151", drawBorder: false },
        ticks: {
          color: "#9ca3af",
          callback: (value: any) => `$${value.toLocaleString()}`,
          font: { size: 10 },
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af", font: { size: 10 } },
      },
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center">
            <TrendingUp size={24} className="text-sky-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100 italic tracking-tight">
              {lang === "es"
                ? "Calculadora de ROI de Automatización"
                : "Automation ROI Calculator"}
            </h2>
            <p className="text-sm text-gray-400">
              {lang === "es"
                ? "Descubra cuánto tiempo y dinero puede ahorrar optimizando sus procesos."
                : "Discover how much time and money you can save by optimizing your processes."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              {lang === "es" ? "Variables del Proceso" : "Process Variables"}
            </h3>

            {/* Num Employees */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Users size={14} />{" "}
                  {lang === "es" ? "Personal involucrado" : "Staff involved"}
                </span>
                <span className="text-sky-400 font-mono font-bold">
                  {inputs.numEmployees}
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={inputs.numEmployees}
                onChange={(e) =>
                  setInputs((p) => ({
                    ...p,
                    numEmployees: parseInt(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Manual Hours */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Clock size={14} />{" "}
                  {lang === "es"
                    ? "Horas manuales / semana / persona"
                    : "Manual hours / week / person"}
                </span>
                <span className="text-sky-400 font-mono font-bold">
                  {inputs.manualHoursPerWeek}h
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={inputs.manualHoursPerWeek}
                onChange={(e) =>
                  setInputs((p) => ({
                    ...p,
                    manualHoursPerWeek: parseInt(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Hourly Cost */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <DollarSign size={14} />{" "}
                  {lang === "es" ? "Costo por hora (USD)" : "Hourly cost (USD)"}
                </span>
                <span className="text-sky-400 font-mono font-bold">
                  ${inputs.hourlyCost}
                </span>
              </label>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={inputs.hourlyCost}
                onChange={(e) =>
                  setInputs((p) => ({
                    ...p,
                    hourlyCost: parseInt(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Implementation Cost */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Wrench size={14} />{" "}
                  {lang === "es"
                    ? "Inversión inicial estimada"
                    : "Estimated initial investment"}
                </span>
                <span className="text-sky-400 font-mono font-bold">
                  ${inputs.implementationCost.toLocaleString()}
                </span>
              </label>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={inputs.implementationCost}
                onChange={(e) =>
                  setInputs((p) => ({
                    ...p,
                    implementationCost: parseInt(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          </div>

          {/* Key Insights Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={`savings-${results.annualSavings}`}
              className="glass p-4 rounded-2xl border border-green-500/20 bg-green-500/5 shadow-lg shadow-green-500/5"
            >
              <p className="text-[10px] uppercase tracking-wider text-green-500/70 font-bold mb-1">
                {lang === "es"
                  ? "Ahorro Anual Proyectado"
                  : "Projected Annual Savings"}
              </p>
              <p className="text-xl font-black text-green-400">
                ${Math.round(results.annualSavings).toLocaleString()}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={`payback-${results.paybackMonths}`}
              className="glass p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 shadow-lg shadow-blue-500/5"
            >
              <p className="text-[10px] uppercase tracking-wider text-blue-500/70 font-bold mb-1">
                {lang === "es" ? "Recupero de Inversión" : "Break-even"}
              </p>
              <p className="text-xl font-black text-blue-400">
                {results.paybackMonths < 1
                  ? "< 1"
                  : Math.round(results.paybackMonths)}{" "}
                {lang === "es" ? "meses" : "months"}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Results Graph & Conclusion */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass rounded-2xl p-6 border border-white/10 h-[380px] flex flex-col">
            <h3 className="text-[10px] font-bold text-gray-500 mb-6 uppercase tracking-[0.2em]">
              {lang === "es"
                ? "Análisis de Costos Acumulados"
                : "Accumulated Cost Analysis"}
            </h3>
            <div className="flex-1 min-h-0">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-transparent relative overflow-hidden shadow-2xl shadow-sky-500/10">
            <div className="absolute -top-6 -right-6 opacity-5 rotate-12">
              <CheckCircle2 size={120} className="text-sky-400" />
            </div>
            <h3 className="text-lg font-black text-sky-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-sky-500 rounded-full inline-block" />
              {lang === "es" ? "Resumen Ejecutivo" : "Executive Summary"}
            </h3>
            <div className="space-y-4 text-sm text-gray-300 relative z-10 leading-relaxed">
              <p>
                {lang === "es"
                  ? `Al automatizar este proceso, su organización ahorrará aproximadamente `
                  : `By automating this process, your organization will save approximately `}
                <span className="text-white font-black underline decoration-sky-500/50 underline-offset-4">
                  ${Math.round(results.annualSavings).toLocaleString()}
                </span>
                {lang === "es" ? ` cada año.` : ` every year.`}
              </p>
              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-white/5" />
                <div className="text-[10px] text-gray-500 uppercase font-black">
                  {lang === "es" ? "Proyección ROI" : "ROI Projection"}
                </div>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-400 font-black">
                  <ArrowRight size={16} />
                  <span className="text-lg">
                    ROI 3Y: {Math.round(results.roiPercentage)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic">
                  *{" "}
                  {lang === "es"
                    ? "Incluye mantenimiento y licencias"
                    : "Includes maintenance and licensing"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
