'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Briefcase, BarChart2, TrendingUp, Wrench, Bot, Activity, Calendar, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TaxCalculator from '@/components/recursos/TaxCalculator';
import TokenCalculator from '@/components/recursos/TokenCalculator';
import SalarySimulator from '@/components/recursos/SalarySimulator';
import InvestmentDashboard from '@/components/recursos/InvestmentDashboard';
import ExchangeRates from '@/components/recursos/ExchangeRates';
import EconomicIndicators from '@/components/recursos/EconomicIndicators';
import HolidaysArgentina from '@/components/recursos/HolidaysArgentina';
import FAQRecursos from '@/components/recursos/FAQRecursos';

type Tab = 'calculator' | 'tokens' | 'salary' | 'dashboard' | 'rates' | 'indicators' | 'holidays' | 'faq';

const TABS: { id: Tab; icon: React.ReactNode; label: { es: string; en: string } }[] = [
  { id: 'calculator', icon: <Calculator size={16} />, label: { es: 'Calculadora Ganancias', en: 'Income Tax' } },
  { id: 'tokens', icon: <Bot size={16} />, label: { es: 'Tokens GenAI', en: 'GenAI Tokens' } },
  { id: 'salary', icon: <Briefcase size={16} />, label: { es: 'Simulador Sueldo', en: 'Salary Simulator' } },
  { id: 'dashboard', icon: <BarChart2 size={16} />, label: { es: 'Dashboard Inversiones', en: 'Investment Dashboard' } },
  { id: 'rates', icon: <TrendingUp size={16} />, label: { es: 'Cotizaciones', en: 'Exchange Rates' } },
  { id: 'indicators', icon: <Activity size={16} />, label: { es: 'Indicadores', en: 'Indicators' } },
  { id: 'holidays', icon: <Calendar size={16} />, label: { es: 'Feriados', en: 'Holidays' } },
  { id: 'faq', icon: <HelpCircle size={16} />, label: { es: 'FAQ', en: 'FAQ' } },
];

const WIDE_TABS = new Set<Tab>(['calculator', 'tokens', 'dashboard', 'indicators']);

export default function RecursosClient() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('calculator');

  const isWide = WIDE_TABS.has(activeTab);

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
              {lang === 'es' ? 'Recursos Útiles' : 'Useful Resources'}
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl">
            {lang === 'es'
              ? 'Herramientas financieras y calculadoras especializadas para Argentina'
              : 'Financial tools and specialized calculators for Argentina'}
          </p>
        </motion.div>
      </section>

      {/* Quick nav */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
        <div className="flex gap-2 flex-wrap">
          {TABS.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-sky-500 text-white'
                  : 'glass text-gray-400 hover:text-sky-400 border border-white/10'
              }`}
            >
              {icon}
              {label[lang]}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={isWide ? '' : 'max-w-2xl'}
        >
          {activeTab === 'calculator' && <TaxCalculator />}
          {activeTab === 'tokens' && <TokenCalculator />}
          {activeTab === 'salary' && <SalarySimulator />}
          {activeTab === 'dashboard' && <InvestmentDashboard />}
          {activeTab === 'rates' && <ExchangeRates />}
          {activeTab === 'indicators' && <EconomicIndicators />}
          {activeTab === 'holidays' && <HolidaysArgentina />}
          {activeTab === 'faq' && <FAQRecursos />}
        </motion.div>
      </section>
    </>
  );
}
