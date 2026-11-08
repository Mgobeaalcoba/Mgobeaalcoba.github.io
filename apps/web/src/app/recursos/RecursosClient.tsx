"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, BarChart2, TrendingUp, Bot, Activity, Calendar, HelpCircle, Share2, Home, Globe2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import TaxCalculator from "@/components/recursos/TaxCalculator";
import TokenCalculator from "@/components/recursos/TokenCalculator";
import InvestmentDashboard from "@/components/recursos/InvestmentDashboard";
import ExchangeRates from "@/components/recursos/ExchangeRates";
import EconomicIndicators from "@/components/recursos/EconomicIndicators";
import HolidaysArgentina from "@/components/recursos/HolidaysArgentina";
import StudioPageIntro from "@/components/shared/StudioPageIntro";
import FAQRecursos from "@/components/recursos/FAQRecursos";
import MortgageUvaCalculator from "@/components/recursos/MortgageUvaCalculator";
import ROICalculator from "@/components/showcase/ROICalculator";
import ArchVisualizer from "@/components/showcase/ArchVisualizer";
import AgentDashboard from "@/components/showcase/AgentDashboard";
import { events } from "@/lib/gtag";
import { DASHBOARDS } from "@/lib/indec/types";

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
  | "argentina-en-datos"
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
      {
        id: "argentina-en-datos",
        icon: <Globe2 size={16} />,
        label: { es: "Argentina en datos", en: "Argentina in data" },
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
  const viewSource = useRef<'initial' | 'tab' | 'direct'>('initial');
  const startedTools = useRef(new Set<TabId>());
  const dataAnchor = useRef(false);

  // Sync hash on mount and when tab changes
  useEffect(() => {
    setIsMounted(true);
    const hash = window.location.hash.substring(1) as TabId;
    if (window.location.hash === '#argentina-en-datos') dataAnchor.current = true;
    if (ALL_TAB_IDS.includes(hash)) {
      viewSource.current = 'direct';
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
      if (dataAnchor.current) {
        dataAnchor.current = false;
        requestAnimationFrame(() => document.getElementById('argentina-en-datos')?.scrollIntoView());
      }
      history.replaceState(null, "", `#${activeTab}`);
      events.toolView(activeTab, viewSource.current);
      viewSource.current = 'tab';
    }
  }, [activeTab, isMounted]);

  const currentTabItem = TAB_CATEGORIES.flatMap((cat) => cat.tabs).find(
    (tab) => tab.id === activeTab
  );
  const isWide = currentTabItem?.wide || false;

  const handleTabChange = (tabId: TabId) => {
    if (tabId === activeTab) return;
    viewSource.current = 'tab';
    setActiveTab(tabId);
    const categoryForTab = TAB_CATEGORIES.find((cat) =>
      cat.tabs.some((tab) => tab.id === tabId)
    );
    if (categoryForTab) {
      setActiveCategory(categoryForTab.id);
      events.toolSelect(tabId, categoryForTab.id);
    }
  };

  const handleToolInteraction = () => {
    if (startedTools.current.has(activeTab)) return;
    startedTools.current.add(activeTab);
    events.toolStart(activeTab);
  };

  if (!isMounted) return null; // Avoid hydration mismatch by waiting for mount

  return <>
    <StudioPageIntro
      eyebrow={lang === 'es' ? 'MGA / Herramientas abiertas' : 'MGA / Open tools'}
      title={lang === 'es' ? <>Explorá, probá.<br /><em>Decidí con datos.</em></> : <>Explore. Experiment.<br /><em>Decide with data.</em></>}
      description={lang === 'es' ? 'Un espacio para poner números a una idea, comparar escenarios y entender cómo funcionan las cosas. Elegí una herramienta y empezá a explorar.' : 'A place to put numbers behind an idea, compare scenarios and understand how things work. Choose a tool and start exploring.'}
      aside={<div className="mga-page-count"><strong>{ALL_TAB_IDS.length}</strong><span>{lang === 'es' ? 'herramientas y laboratorios para usar' : 'tools and labs to use'}</span><a href="#herramientas" className="mga-text-link">{lang === 'es' ? 'Elegir una herramienta' : 'Choose a tool'}<Share2 size={15} /></a></div>}
    />
    <div className="mga-container mga-tool-spotlights">
      <Link href={lang === 'es' ? '/recursos/ia-router/' : '/en/recursos/ia-router/'} data-analytics="recursos_ia_router_link"><b>ia-router</b><span>{lang === 'es' ? 'Ruteá tus suscripciones de IA con métricas objetivas.' : 'Route your AI subscriptions with objective metrics.'}</span><span aria-hidden="true">↗</span></Link>
      <Link href={lang === 'es' ? '/recursos/pypi-stats/' : '/en/recursos/pypi-stats/'} data-analytics="recursos_pypi_stats_link"><b>PyPI</b><span>{lang === 'es' ? 'Descargas y evolución de nuestros paquetes abiertos.' : 'Downloads and trends for our open-source packages.'}</span><span aria-hidden="true">↗</span></Link>
    </div>

    <section className="signal-tools-workspace">
      <nav id="herramientas" className="mga-tool-picker" aria-label={lang === 'es' ? 'Elegir herramienta' : 'Choose a tool'}>
        <div className="mga-tool-picker__categories" role="group" aria-label={lang === 'es' ? 'Categorías de herramientas' : 'Tool categories'}>
          {TAB_CATEGORIES.map(group => <button key={group.id} type="button" aria-pressed={activeCategory === group.id} onClick={() => handleTabChange(group.tabs[0].id)}>{group.label[lang]}</button>)}
        </div>
        <div className="mga-tool-picker__items" role="group" aria-label={lang === 'es' ? 'Herramientas de la categoría' : 'Tools in this category'}>
          {TAB_CATEGORIES.find(group => group.id === activeCategory)?.tabs.map(tab => <button type="button" key={tab.id} aria-pressed={activeTab === tab.id} onClick={() => handleTabChange(tab.id)}>{tab.icon}<span>{tab.label[lang]}</span></button>)}
        </div>
      </nav>

      <div className="signal-tool-stage">
        <div className="signal-tool-stage__bar"><div><span>{TAB_CATEGORIES.find((group) => group.id === activeCategory)?.label[lang]}</span><strong>{currentTabItem?.label[lang]}</strong></div><span className="signal-tool-status"><i />{lang === "es" ? "Disponible" : "Available"}</span></div>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className={isWide ? "" : "max-w-2xl"}
          onPointerDownCapture={handleToolInteraction}
          onKeyDownCapture={handleToolInteraction}
        >
          {activeTab === "argentina-en-datos" && <section className="signal-argentina-lab signal-argentina-lab--panel" id="argentina-en-datos" aria-labelledby="argentina-data-title">
            <div className="signal-argentina-lab__head"><div><span className="signal-eyebrow">MGA / Data & Analytics</span><h2 id="argentina-data-title">{lang === 'es' ? 'Argentina, con datos.' : 'Argentina, through data.'}</h2></div><p>{lang === 'es' ? 'Tres dashboards independientes con datos del INDEC. Explorá, compará y descargá un informe de tu selección.' : 'Three independent INDEC dashboards in Spanish. Explore, compare and download a report for your selection.'}</p></div>
            <div className="signal-argentina-lab__cards">{DASHBOARDS.map(d => <Link key={d.slug} href={`/recursos/${d.slug}/`} className="signal-argentina-card" data-analytics={`recursos_indec_${d.slug.replaceAll('-', '_')}`}><span className="signal-argentina-card__meta"><b>LAB {d.number}</b>{d.tag}</span><h3>{d.title}</h3><p>{d.description}</p><span>{lang === 'es' ? 'Explorar dashboard' : 'Explore dashboard'}<i aria-hidden="true">↗</i></span></Link>)}</div>
          </section>}
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
