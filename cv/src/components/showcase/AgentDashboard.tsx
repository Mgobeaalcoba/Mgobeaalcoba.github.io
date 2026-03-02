"use client";

import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { events } from "@/lib/gtag";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  MessageSquare,
  Target,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  MOCK_DASHBOARD_DATA,
  getAggregatedKpis,
  DashboardSession,
  formatSupabaseData,
} from "@/data/MockDashboardData";
import { supabase } from "@/lib/supabase";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const kpiVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function AgentDashboard() {
  const { lang } = useLanguage();
  const [timeFilter, setTimeFilter] = useState<"7d" | "30d" | "all">("all");
  const [realData, setRealData] = useState<DashboardSession[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("assistant_logs")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching logs from Supabase:", error);
      } else if (data) {
        setRealData(formatSupabaseData(data));
      }
    };

    fetchData();
  }, []);

  const combinedData = useMemo(() => {
    return [...realData].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [realData]);

  const filteredData = useMemo(() => {
    if (timeFilter === "all") return combinedData;
    const now = new Date();
    const days = timeFilter === "7d" ? 7 : 30;
    const cutoff = new Date(now.setDate(now.getDate() - days)).getTime();
    return combinedData.filter(
      (s) => new Date(s.timestamp).getTime() >= cutoff
    );
  }, [timeFilter, combinedData]);

  const kpis = useMemo(() => getAggregatedKpis(filteredData), [filteredData]);

  const trafficData = useMemo(() => {
    const dailyMap = new Map();
    filteredData.forEach((s) => {
      const day = s.timestamp.split("T")[0];
      dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
    });

    const labels = Array.from(dailyMap.keys()).sort();
    const data = labels.map((l) => dailyMap.get(l));

    return {
      labels,
      datasets: [
        {
          label: lang === "es" ? "Sesiones" : "Sessions",
          data,
          fill: true,
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56, 189, 248, 0.1)",
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#38bdf8",
        },
      ],
    };
  }, [filteredData, lang]);

  const intentData = useMemo(() => {
    const counts = { consultancy: 0, ai_tech: 0, career: 0, general: 0 };
    filteredData.forEach((s) => counts[s.intent]++);

    return {
      labels:
        lang === "es"
          ? ["Consultoría", "GenAI Tech", "Carrera", "General"]
          : ["Consulting", "GenAI Tech", "Career", "General"],
      datasets: [
        {
          data: [
            counts.consultancy,
            counts.ai_tech,
            counts.career,
            counts.general,
          ],
          backgroundColor: [
            "rgba(56, 189, 248, 0.7)",
            "rgba(129, 140, 248, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(100, 116, 139, 0.7)",
          ],
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
        },
      ],
    };
  }, [filteredData, lang]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 12,
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#64748b", font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 10 } },
      },
    },
  };

  return (
    <div className="space-y-8 p-1">
      {/* Introduction */}
      <div className="glass p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheck size={24} className="text-sky-400" />
          {lang === "es"
            ? "Transparency BI: Monitoreo de IA en Tiempo Real"
            : "Transparency BI: Real-Time AI Monitoring"}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
          {lang === "es"
            ? "Este dashboard muestra el rendimiento real de nuestro asistente inteligente. A diferencia de un chat convencional, nuestras soluciones están conectadas a una capa de observabilidad que permite medir conversiones, sentimientos e impacto en el ahorro de tiempo operativo de forma granular."
            : "This dashboard displays the actual performance of our intelligent assistant. Unlike conventional chats, our solutions are connected to an observability layer that measures conversions, sentiment, and operational time-saving impact in a granular way."}
        </p>
      </div>

      {/* Filters & KPI Grid */}
      <div className="space-y-4">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {(["7d", "30d", "all"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setTimeFilter(filter);
                events.agentDashboardFilterUsed(filter);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeFilter === filter
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: lang === "es" ? "Sesiones Totales" : "Total Sessions",
              value: kpis.totalSessions,
              icon: Users,
              color: "text-blue-400",
            },
            {
              label: lang === "es" ? "Leads Generados" : "Leads Generated",
              value: kpis.totalLeads,
              icon: Target,
              color: "text-emerald-400",
            },
            {
              label: lang === "es" ? "Tasa de Conv." : "Conv. Rate",
              value: `${kpis.conversionRate}%`,
              icon: ArrowUpRight,
              color: "text-indigo-400",
            },
            {
              label: lang === "es" ? "Horas Ahorradas" : "Hours Saved",
              value: kpis.hoursSaved,
              icon: Clock,
              color: "text-amber-400",
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={kpiVariants}
              className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden group"
            >
              <div
                className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity ${kpi.color}`}
              >
                <kpi.icon size={80} />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-white/5 ${kpi.color}`}>
                  <kpi.icon size={18} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  {kpi.label}
                </span>
              </div>
              <div className="text-2xl font-black text-white">{kpi.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white/5 flex flex-col min-h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2">
              <BarChart3 size={16} className="text-sky-400" />
              {lang === "es" ? "Tendencia de Tráfico" : "Traffic Trend"}
            </h3>
            <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-1 rounded-full border border-sky-500/20">
              Live Data
            </span>
          </div>
          <div className="flex-1">
            <Line data={trafficData} options={chartOptions} />
          </div>
        </div>

        {/* Intent Pie Chart */}
        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col min-h-[350px]">
          <h3 className="text-sm font-bold text-gray-400 mb-8 flex items-center gap-2">
            <PieChartIcon size={16} className="text-indigo-400" />
            {lang === "es"
              ? "Distribución de Consultas"
              : "Consultation Distribution"}
          </h3>
          <div className="flex-1 relative flex items-center justify-center">
            <Pie
              data={intentData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: { color: "#94a3b8", font: { size: 10 } },
                  },
                },
                scales: { x: { display: false }, y: { display: false } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">
              Impacto en Disponibilidad
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              El asistente virtual ha gestionado el{" "}
              <strong>100% de las consultas de primera línea</strong> sin
              intervención humana, filtrando prospectos y resolviendo dudas
              técnicas 24/7.
            </p>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 flex items-start gap-4">
          <div className="p-3 bg-sky-500/20 rounded-xl text-sky-400">
            <MessageSquare size={24} />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">
              Ahorro Mensual Proyectado
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Basado en el volumen actual, el ahorro operativo se estima en
              aproximadamente <strong>{kpis.hoursSaved} horas mensuales</strong>{" "}
              de trabajo administrativo y soporte técnico.
            </p>
          </div>
        </div>
      </div>

      {/* Commercial CTA Section */}
      <div className="glass p-8 rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-transparent flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-sky-500/5">
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl font-black text-white leading-tight">
            {lang === "es"
              ? "¿Buscas este nivel de transparencia para tu negocio?"
              : "Looking for this level of transparency for your business?"}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {lang === "es"
              ? "Implementamos asistentes de IA que no solo hablan, sino que trackean KPI's de negocio en tiempo real. Integramos tus flujos de n8n con Dashboards personalizados para que siempre sepas el ROI de tu inversión en tecnología."
              : "We implement AI assistants that don't just talk, they track business KPIs in real-time. We integrate your n8n flows with custom dashboards so you always know the ROI of your tech investment."}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-ai-assistant"));
                events.agentDashboardCtaClicked("dashboard_inquiry");
              }}
              className="btn-premium-primary"
            >
              {lang === "es"
                ? "Consultar por Dashboards"
                : "Inquire about Dashboards"}
            </button>
          </div>
        </div>
        <div className="w-full md:w-48 aspect-square glass rounded-2xl flex items-center justify-center border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-sky-500/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
          <Target size={64} className="text-sky-500 relative z-10" />
        </div>
      </div>
    </div>
  );
}
