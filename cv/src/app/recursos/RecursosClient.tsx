'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Briefcase, BarChart2, TrendingUp, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TaxCalculator from '@/components/recursos/TaxCalculator';
import SalarySimulator from '@/components/recursos/SalarySimulator';
import InvestmentDashboard from '@/components/recursos/InvestmentDashboard';
import ExchangeRates from '@/components/recursos/ExchangeRates';

type Tab = 'calculator' | 'salary' | 'dashboard' | 'rates';

const TABS: { id: Tab; icon: React.ReactNode; labelKey: string }[] = [
  { id: 'calculator', icon: <Calculator size={16} />, labelKey: 'recursos_tab_calculator' },
  { id: 'salary', icon: <Briefcase size={16} />, labelKey: 'recursos_tab_salary' },
  { id: 'dashboard', icon: <BarChart2 size={16} />, labelKey: 'recursos_tab_dashboard' },
  { id: 'rates', icon: <TrendingUp size={16} />, labelKey: 'recursos_tab_rates' },
];

export default function RecursosClient() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('calculator');

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
            <h1 className="text-4xl font-black gradient-text">{t('recursos_title')}</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl">{t('recursos_subtitle')}</p>
        </motion.div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex gap-2 flex-wrap">
          {TABS.map(({ id, icon, labelKey }) => (
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
              {t(labelKey)}
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
        >
          {activeTab === 'calculator' && (
            <div className="max-w-xl">
              <TaxCalculator />
            </div>
          )}
          {activeTab === 'salary' && (
            <div className="max-w-xl">
              <SalarySimulator />
            </div>
          )}
          {activeTab === 'dashboard' && (
            <div className="max-w-xl">
              <InvestmentDashboard />
            </div>
          )}
          {activeTab === 'rates' && (
            <div className="max-w-xl">
              <ExchangeRates />
            </div>
          )}
        </motion.div>
      </section>
    </>
  );
}
