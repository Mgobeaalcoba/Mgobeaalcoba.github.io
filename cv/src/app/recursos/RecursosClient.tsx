"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  BarChart2,
  TrendingUp,
  Wrench,
  Bot,
  Activity,
  Calendar,
  HelpCircle,
  ChevronDown,
  LayoutGrid,
  Share2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import TaxCalculator from "@/components/recursos/TaxCalculator";
import TokenCalculator from "@/components/recursos/TokenCalculator";
import InvestmentDashboard from "@/components/recursos/InvestmentDashboard";
import ExchangeRates from "@/components/recursos/ExchangeRates";
import EconomicIndicators from "@/components/recursos/EconomicIndicators";
import HolidaysArgentina from "@/components/recursos/HolidaysArgentina";
import FAQRecursos from "@/components/recursos/FAQRecursos";
import ROICalculator from "@/components/showcase/ROICalculator";
import ArchVisualizer from "@/components/showcase/ArchVisualizer";

type TabId =
  | "calculator"
  | "roi"
  | "arch"
  | "tokens"
  | "dashboard"
  | "rates"
  | "indicators"
  | "holidays"
  | "faq";

type CategoryId = "finance" | "tech" | "general";

interface TabItem {
  id: TabId;
  icon: React.ReactNode;
  label: { es: string; en: string };
  wide?: boolean;
}

interface TabCategory {
  id: CategoryId;
  label: { es: string; en: string };
  tabs: TabItem[];
}

const TAB_CATEGORIES: TabCategory[] = [
  {
    id: "finance",
    label: { es: "Financieros", en: "Finance" },
    tabs: [
      {
        id: "calculator",
        icon: <Calculator size={16} />,
        label: { es: "Ganancias", en: "Income Tax" },
        wide: true,
      },
      {
        id: "dashboard",
        icon: <BarChart2 size={16} />,
        label: { es: "Inversiones", en: "Investment Dashboard" },
        wide: true,
      },
      {
        id: "rates",
        icon: <TrendingUp size={16} />,
        label: { es: "Cotizaciones", en: "Exchange Rates" },
        wide: true,
      },
      {
        id: "indicators",
        icon: <Activity size={16} />,
        label: { es: "Indicadores", en: "Economic Indicators" },
        wide: true,
      },
    ],
  },
  {
    id: "tech",
    label: { es: "Tech & Automatización", en: "Tech & Automation" },
    tabs: [
      {
        id: "arch",
        icon: <Share2 size={16} />,
        label: { es: "Visualizador Ark", en: "Arch Visualizer" },
        wide: true,
      },
      {
        id: "roi",
        icon: <TrendingUp size={16} />,
        label: { es: "ROI Automatización", en: "Automation ROI" },
        wide: true,
      },
      {
        id: "tokens",
        icon: <Bot size={16} />,
        label: { es: "Tokens GenAI", en: "GenAI Tokens" },
        wide: true,
      },
    ],
  },
  {
    id: "general",
    label: { es: "Generales", en: "General" },
    tabs: [
      {
        id: "holidays",
        icon: <Calendar size={16} />,
        label: { es: "Feriados", en: "Holidays" },
      },
      {
        id: "faq",
        icon: <HelpCircle size={16} />,
        label: { es: "FAQ", en: "FAQ" },
      },
    ],
  },
];

// Helper to get all tab IDs
const ALL_TAB_IDS = TAB_CATEGORIES.flatMap((cat) =>
  cat.tabs.map((tab) => tab.id)
);

export default function RecursosClient() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("calculator");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("finance");
  const [isMounted, setIsMounted] = useState(false);

  // Sync hash on mount and when tab changes
  useEffect(() => {
    setIsMounted(true);
    const hash = window.location.hash.substring(1) as TabId;
    if (ALL_TAB_IDS.includes(hash)) {
      setActiveTab(hash);
      const categoryForTab = TAB_CATEGORIES.find((cat) =>
        cat.tabs.some((tab) => tab.id === hash)
      );
      if (categoryForTab) {
        setActiveCategory(categoryForTab.id);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      history.replaceState(null, "", `#${activeTab}`);
    }
  }, [activeTab, isMounted]);

  const currentTabItem = TAB_CATEGORIES.flatMap((cat) => cat.tabs).find(
    (tab) => tab.id === activeTab
  );
  const isWide = currentTabItem?.wide || false;

  const handleCategoryChange = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    const category = TAB_CATEGORIES.find((cat) => cat.id === categoryId);
    if (category && category.tabs.length > 0) {
      setActiveTab(category.tabs[0].id);
    }
  };

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    const categoryForTab = TAB_CATEGORIES.find((cat) =>
      cat.tabs.some((tab) => tab.id === tabId)
    );
    if (categoryForTab) {
      setActiveCategory(categoryForTab.id);
    }
  };

  if (!isMounted) return null; // Avoid hydration mismatch by waiting for mount

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Wrench size={28} className="text-sky-400" />
            <h1 className="text-4xl font-black gradient-text">
              {lang === "es" ? "Recursos Útiles" : "Useful Resources"}
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl">
            {lang === "es"
              ? "Herramientas financieras y calculadoras especializadas para Argentina"
              : "Financial tools and specialized calculators for Argentina"}
          </p>
        </motion.div>
      </section>

      {/* Quick nav */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
        {/* Mobile: styled select dropdown for categories */}
        <div className="relative sm:hidden mb-2">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none">
            <LayoutGrid size={16} />
          </div>
          <select
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value as CategoryId)}
            className="w-full appearance-none glass border border-sky-500/40 rounded-xl pl-9 pr-10 py-3 text-sm font-medium text-gray-200 bg-transparent focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {TAB_CATEGORIES.map(({ id, label }) => (
              <option key={id} value={id} className="bg-gray-900 text-gray-200">
                {label[lang]}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Mobile: styled select dropdown for tabs within active category */}
        <div className="relative sm:hidden">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none">
            {currentTabItem?.icon}
          </div>
          <select
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value as TabId)}
            className="w-full appearance-none glass border border-sky-500/40 rounded-xl pl-9 pr-10 py-3 text-sm font-medium text-gray-200 bg-transparent focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {TAB_CATEGORIES.find((cat) => cat.id === activeCategory)?.tabs.map(
              ({ id, label }) => (
                <option
                  key={id}
                  value={id}
                  className="bg-gray-900 text-gray-200"
                >
                  {label[lang]}
                </option>
              )
            )}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Desktop: category buttons */}
        <div className="hidden sm:flex gap-2 flex-wrap mb-4">
          {TAB_CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleCategoryChange(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === id
                  ? "bg-sky-500 text-white"
                  : "glass text-gray-400 hover:text-sky-400 border border-white/10"
              }`}
            >
              <LayoutGrid size={16} />
              {label[lang]}
            </button>
          ))}
        </div>

        {/* Desktop: tab buttons for active category */}
        <div className="hidden sm:flex gap-2 flex-wrap">
          {TAB_CATEGORIES.find((cat) => cat.id === activeCategory)?.tabs.map(
            ({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-sky-500 text-white"
                    : "glass text-gray-400 hover:text-sky-400 border border-white/10"
                }`}
              >
                {icon}
                {label[lang]}
              </button>
            )
          )}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={isWide ? "" : "max-w-2xl"}
        >
          {activeTab === "calculator" && <TaxCalculator />}
          {activeTab === "roi" && <ROICalculator />}
          {activeTab === "arch" && <ArchVisualizer />}
          {activeTab === "tokens" && <TokenCalculator />}
          {activeTab === "dashboard" && <InvestmentDashboard />}
          {activeTab === "rates" && <ExchangeRates />}
          {activeTab === "indicators" && <EconomicIndicators />}
          {activeTab === "holidays" && <HolidaysArgentina />}
          {activeTab === "faq" && <FAQRecursos />}
        </motion.div>
      </section>
    </>
  );
}
