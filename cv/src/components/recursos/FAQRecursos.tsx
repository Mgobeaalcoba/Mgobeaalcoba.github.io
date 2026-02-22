'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type FAQ = {
  q: { es: string; en: string };
  a: { es: string; en: string };
};

const FAQS: FAQ[] = [
  {
    q: {
      es: '¿Qué es el impuesto a las ganancias de cuarta categoría?',
      en: 'What is the fourth category income tax?',
    },
    a: {
      es: 'Es el tributo que grava los ingresos personales provenientes del trabajo en relación de dependencia, jubilaciones y pensiones. La calculadora te ayuda a estimar la retención mensual y el sueldo de bolsillo.',
      en: 'It is the tax that applies to personal income from employment, pensions, and retirement. The calculator helps you estimate monthly withholding and take-home pay.',
    },
  },
  {
    q: {
      es: '¿Cómo se calcula la retención de ganancias?',
      en: 'How is income tax withholding calculated?',
    },
    a: {
      es: 'La retención se calcula considerando el salario bruto, deducciones personales y familiares (mínimo no imponible, cónyuge, hijos) y otras deducciones admitidas por la AFIP. Se aplica la escala progresiva del artículo 94 de la Ley.',
      en: 'Withholding is calculated based on gross salary, personal and family deductions (non-taxable minimum, spouse, children) and other AFIP-approved deductions. The progressive scale from Article 94 of the Law is applied.',
    },
  },
  {
    q: {
      es: '¿Qué tipos de dólar existen en Argentina?',
      en: 'What types of USD exchange rates exist in Argentina?',
    },
    a: {
      es: 'En Argentina existen varios tipos de dólar: oficial (BNA), blue (paralelo/informal), MEP o Bolsa (compra a través de bonos), contado con liqui (CCL), tarjeta/turista (oficial + impuestos), y cripto. Consulte las cotizaciones en tiempo real en la sección de cotizaciones.',
      en: 'In Argentina there are several USD types: official (BNA), blue (parallel/informal), MEP or stock market (purchased via bonds), settled with liquidity (CCL), card/tourist (official + taxes), and crypto. Check real-time rates in the exchange rates section.',
    },
  },
  {
    q: {
      es: '¿Cómo afecta la inflación a los ingresos personales?',
      en: 'How does inflation affect personal income?',
    },
    a: {
      es: 'La inflación reduce el poder adquisitivo de los ingresos personales. Si tu salario no sube al ritmo de la inflación, en términos reales estás ganando menos. Los indicadores de inflación mensual e interanual muestran la variación del IPC calculada por INDEC.',
      en: 'Inflation reduces the purchasing power of personal income. If your salary does not keep up with inflation, in real terms you are earning less. Monthly and annual inflation indicators show the CPI variation calculated by INDEC.',
    },
  },
  {
    q: {
      es: '¿Conviene más un Plazo Fijo o invertir en dólares?',
      en: 'Is a Fixed Term Deposit or investing in USD a better option?',
    },
    a: {
      es: 'Depende de la tasa de inflación y de la devaluación del peso. Si la inflación supera la tasa del plazo fijo, el plazo fijo no protege tu capital. Si la devaluación del dólar es menor que la inflación, los dólares tampoco. El dashboard comparador te ayuda a visualizar ambas opciones.',
      en: "It depends on inflation and peso devaluation rates. If inflation exceeds the fixed term rate, fixed terms don't protect your capital. If dollar devaluation is lower than inflation, dollars won't either. The comparison dashboard helps you visualize both options.",
    },
  },
  {
    q: {
      es: '¿Qué es el UVA y para qué sirve?',
      en: 'What is UVA and what is it used for?',
    },
    a: {
      es: 'La Unidad de Valor Adquisitivo (UVA) es un índice creado por el BCRA que se actualiza diariamente según el Coeficiente de Estabilización de Referencia (CER), que refleja la inflación. Se usa para ajustar créditos hipotecarios y algunos depósitos.',
      en: 'The Purchasing Value Unit (UVA) is an index created by the BCRA that is updated daily based on the Reference Stabilization Coefficient (CER), which reflects inflation. It is used to adjust mortgage loans and some deposits.',
    },
  },
];

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <span className="font-medium text-sm text-gray-200 group-hover:text-sky-400 transition-colors pr-4">
          {faq.q[lang]}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
              {faq.a[lang]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQRecursos() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle size={24} className="text-sky-400" />
        <h3 className="text-lg font-bold">
          {lang === 'es'
            ? 'Preguntas frecuentes sobre Ganancias, Dólar e Inflación'
            : 'FAQ: Income Tax, USD Exchange Rates and Inflation'}
        </h3>
      </div>
      {FAQS.map((faq, i) => (
        <FAQItem key={i} faq={faq} index={i} />
      ))}
    </div>
  );
}
