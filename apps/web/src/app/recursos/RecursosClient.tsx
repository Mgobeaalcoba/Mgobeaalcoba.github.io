"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, BarChart2, TrendingUp, Bot, Activity, Calendar, HelpCircle, ChevronDown, Share2, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import TaxCalculator from "@/components/recursos/TaxCalculator";
import TokenCalculator from "@/components/recursos/TokenCalculator";
import InvestmentDashboard from "@/components/recursos/InvestmentDashboard";
import ExchangeRates from "@/components/recursos/ExchangeRates";
import EconomicIndicators from "@/components/recursos/EconomicIndicators";
import HolidaysArgentina from "@/components/recursos/HolidaysArgentina";
import FAQRecursos from "@/components/recursos/FAQRecursos";
import MortgageUvaCalculator from "@/components/recursos/MortgageUvaCalculator";
import ROICalculator from "@/components/showcase/ROICalculator";
import ArchVisualizer from "@/components/showcase/ArchVisualizer";
import AgentDashboard from "@/components/showcase/AgentDashboard";
import { events } from "@/lib/gtag";

type TabId =
  | "calculator"
  | "mortgages"
  | "roi"
  | "arch"
  | "tokens"
  | "investments"
  | "agent-dash"
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
        id: "mortgages",
        icon: <Home size={16} />,
        label: { es: "Hipotecarios UVA", en: "UVA Mortgages" },
        wide: true,
      },
      {
        id: "investments",
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
        id: "agent-dash",
        icon: <BarChart2 size={16} />,
        label: { es: "Transparency BI", en: "Agent Dashboard" },
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

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    const categoryForTab = TAB_CATEGORIES.find((cat) =>
      cat.tabs.some((tab) => tab.id === tabId)
    );
    if (categoryForTab) {
      setActiveCategory(categoryForTab.id);
      events.toolSelect(tabId, categoryForTab.id);
    }
  };

  if (!isMounted) return null; // Avoid hydration mismatch by waiting for mount

  return <>
    <section className="signal-tools-hero">
      <span className="signal-eyebrow">MGA / Utility lab</span>
      <div className="signal-tools-hero__grid">
        <h1>{lang === "es" ? <>Herramientas para<br /><em>decidir mejor.</em></> : <>Tools to help you<br /><em>decide better.</em></>}</h1>
        <p>{lang === "es" ? "Calculadoras y laboratorios interactivos para modelar decisiones financieras, de automatización y de arquitectura." : "Interactive calculators and labs for modeling financial, automation and architecture decisions."}</p>
      </div>
    </section>

    <section className="signal-tools-workspace">
      <div className="signal-tool-mobile-dock" aria-label={lang === "es" ? "Explorar herramientas" : "Explore tools"}>
        <div className="signal-tool-mobile-categories">
          {TAB_CATEGORIES.map((group) => (
            <button key={group.id} className={activeCategory === group.id ? "is-active" : ""} onClick={() => { setActiveCategory(group.id); handleTabChange(group.tabs[0].id); }}>
              {group.label[lang]}
            </button>
          ))}
        </div>
        <div className="signal-tool-mobile-items">
          {TAB_CATEGORIES.find((group) => group.id === activeCategory)?.tabs.map((tab) => (
            <button key={tab.id} className={activeTab === tab.id ? "is-active" : ""} onClick={() => handleTabChange(tab.id)}>
              <span>{tab.icon}</span><strong>{tab.label[lang]}</strong>
            </button>
          ))}
        </div>
      </div>
      <div className="signal-tool-mobile-select">
        <span>{currentTabItem?.icon}</span>
        <select value={activeTab} onChange={(event) => handleTabChange(event.target.value as TabId)} aria-label={lang === "es" ? "Seleccionar herramienta" : "Select tool"}>
          {TAB_CATEGORIES.map((group) => <optgroup key={group.id} label={group.label[lang]}>{group.tabs.map((tab) => <option key={tab.id} value={tab.id}>{tab.label[lang]}</option>)}</optgroup>)}
        </select>
        <ChevronDown size={17} />
      </div>

      <aside className="signal-tool-nav" aria-label={lang === "es" ? "Herramientas disponibles" : "Available tools"}>
        <div className="signal-tool-nav__header"><strong>{lang === "es" ? "Laboratorio" : "Laboratory"}</strong><span>{TAB_CATEGORIES.reduce((total, group) => total + group.tabs.length, 0)} tools</span></div>
        {TAB_CATEGORIES.map((group) => <div className="signal-tool-nav__group" key={group.id}><span>{group.label[lang]}</span>{group.tabs.map((tab) => <button key={tab.id} className={activeTab === tab.id ? 'is-active' : ''} onClick={() => handleTabChange(tab.id)}>{tab.icon}<span>{tab.label[lang]}</span></button>)}</div>)}
      </aside>

      <div className="signal-tool-stage">
        <div className="signal-tool-stage__bar"><div><span>{TAB_CATEGORIES.find((group) => group.id === activeCategory)?.label[lang]}</span><strong>{currentTabItem?.label[lang]}</strong></div><span className="signal-tool-status"><i />{lang === "es" ? "Disponible" : "Available"}</span></div>
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className={isWide ? "" : "max-w-2xl"}>
          {activeTab === "calculator" && <TaxCalculator />}
          {activeTab === "mortgages" && <MortgageUvaCalculator />}
          {activeTab === "roi" && <ROICalculator />}
          {activeTab === "arch" && <ArchVisualizer />}
          {activeTab === "agent-dash" && <AgentDashboard />}
          {activeTab === "tokens" && <TokenCalculator />}
          {activeTab === "investments" && <InvestmentDashboard />}
          {activeTab === "rates" && <ExchangeRates />}
          {activeTab === "indicators" && <EconomicIndicators />}
          {activeTab === "holidays" && <HolidaysArgentina />}
          {activeTab === "faq" && <FAQRecursos />}
        </motion.div>
      </div>
    </section>
  </>;
}
