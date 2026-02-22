'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Gift, Bot, Brain, Handshake } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/gtag';
import CalendlyButton from '@/components/shared/CalendlyButton';

type Pack = {
  id: string;
  icon: React.ReactNode;
  name: { es: string; en: string };
  description: { es: string; en: string };
  idealFor: { es: string[]; en: string[] };
  features: { es: string[]; en: string[] };
  price: { es: string; en: string };
  priceNote: { es: string; en: string };
  accentColor: string;
  highlighted?: boolean;
  badge?: { es: string; en: string };
  timeline?: { es: string; en: string };
  roi?: { es: string[]; en: string[] };
};

const PACKS: Pack[] = [
  {
    id: 'free',
    icon: <Gift size={36} className="text-green-400" />,
    name: { es: 'Prueba Gratis', en: 'Free Trial' },
    description: {
      es: 'Perfecta para conocernos. Automatizamos un proceso simple de su empresa sin costo ni compromiso.',
      en: 'Perfect for getting to know each other. We automate a simple process in your company at no cost and no commitment.',
    },
    idealFor: {
      es: ['1 automatización simple', 'Diagnóstico inicial', 'Implementación en 1-2 semanas', 'Documentación básica'],
      en: ['1 simple automation', 'Initial diagnosis', 'Implementation in 1-2 weeks', 'Basic documentation'],
    },
    features: {
      es: ['1 automatización simple', 'Diagnóstico inicial gratuito', 'Implementación en 1-2 semanas', 'Documentación básica'],
      en: ['1 simple automation', 'Free initial diagnosis', 'Implementation in 1-2 weeks', 'Basic documentation'],
    },
    price: { es: 'GRATIS', en: 'FREE' },
    priceNote: { es: 'Sin tarjeta • Sin compromiso', en: 'No card • No commitment' },
    accentColor: 'green',
    highlighted: true,
    badge: { es: 'RECOMENDADO', en: 'RECOMMENDED' },
  },
  {
    id: 'auto-pro',
    icon: <Bot size={36} className="text-sky-400" />,
    name: { es: 'Automatización Pro', en: 'Pro Automation' },
    description: {
      es: 'Para empresas que quieren automatizar múltiples procesos y ver un impacto significativo.',
      en: 'For businesses that want to automate multiple processes and see significant impact.',
    },
    idealFor: {
      es: ['Facturación y cobranzas', 'Gestión de inventario', 'Seguimiento de clientes', 'Reportes automáticos'],
      en: ['Billing and collections', 'Inventory management', 'Customer follow-up', 'Automatic reports'],
    },
    features: {
      es: [
        'Múltiples automatizaciones personalizadas',
        'Integraciones con sus sistemas (CRM, ERP, Excel)',
        'Soporte técnico prioritario incluido',
        'Actualizaciones y mejoras continuas',
        'Documentación completa',
      ],
      en: [
        'Multiple custom automations',
        'Integrations with your systems (CRM, ERP, Excel)',
        'Priority technical support included',
        'Continuous updates and improvements',
        'Complete documentation',
      ],
    },
    price: { es: 'USD 100/mes', en: 'USD 100/mo' },
    priceNote: { es: 'o proyectos desde USD 600', en: 'or projects from USD 600' },
    timeline: { es: '3 - 4 Semanas de implementación', en: '3 - 4 Weeks of implementation' },
    roi: {
      es: ['✅ Ahorro promedio: 20-40 horas/mes', '📈 ROI: 300-500% en el primer año', '🎯 Escalable según crece su negocio', '💡 Ideal si ya probó la automatización gratis y quedó conforme'],
      en: ['✅ Average savings: 20-40 hours/month', '📈 ROI: 300-500% in the first year', '🎯 Scalable as your business grows', '💡 Ideal if you already tried the free automation and liked it'],
    },
    accentColor: 'sky',
  },
  {
    id: 'ia-analytics',
    icon: <Brain size={36} className="text-purple-400" />,
    name: { es: 'IA & Analytics', en: 'AI & Analytics' },
    description: {
      es: 'Transformación digital completa: automatización + inteligencia artificial + visualización de datos.',
      en: 'Complete digital transformation: automation + artificial intelligence + data visualization.',
    },
    idealFor: {
      es: ['Chatbot 24/7 con IA', 'Dashboard de ventas/ops', 'Análisis de sentimiento', 'Predicción de tendencias'],
      en: ['24/7 AI chatbot', 'Sales/ops dashboard', 'Sentiment analysis', 'Trend prediction'],
    },
    features: {
      es: [
        '✨ Todo del plan Automatización Pro',
        '🤖 Chatbot con IA para WhatsApp/Web (atención 24/7)',
        '📊 Dashboard interactivo (ventas, operaciones, finanzas)',
        '📈 Análisis predictivo y tendencias',
        '💬 Análisis de sentimiento de clientes',
        '🎯 Soporte prioritario y consultoría continua',
      ],
      en: [
        '✨ Everything from Pro Automation plan',
        '🤖 AI chatbot for WhatsApp/Web (24/7 support)',
        '📊 Interactive dashboard (sales, operations, finance)',
        '📈 Predictive analytics and trends',
        '💬 Customer sentiment analysis',
        '🎯 Priority support and ongoing consulting',
      ],
    },
    price: { es: 'USD 200/mes', en: 'USD 200/mo' },
    priceNote: { es: 'o proyectos desde USD 800', en: 'or projects from USD 800' },
    timeline: { es: '4 - 6 Semanas de implementación completa', en: '4 - 6 Weeks for full implementation' },
    roi: {
      es: ['✅ Ahorro promedio: 40-60 horas/mes', '📈 ROI: 400-800% anualizado', '🎯 Decisiones basadas en datos en tiempo real', '💡 Incremento promedio del 30-40% en eficiencia operativa', '🚀 Para empresas que quieren transformación digital completa'],
      en: ['✅ Average savings: 40-60 hours/month', '📈 ROI: 400-800% annualized', '🎯 Real-time data-driven decisions', '💡 Average 30-40% increase in operational efficiency', '🚀 For companies that want full digital transformation'],
    },
    accentColor: 'purple',
  },
];

const ACCENT_COLORS: Record<string, string> = {
  green: 'text-green-400',
  sky: 'text-sky-400',
  purple: 'text-purple-400',
};

const ACCENT_BG: Record<string, string> = {
  green: 'bg-green-400/10',
  sky: 'bg-sky-400/10',
  purple: 'bg-purple-400/10',
};

const BADGE_GRADIENT: Record<string, string> = {
  green: 'from-green-500 to-emerald-500',
};

function PackModal({ pack, onClose }: { pack: Pack; onClose: () => void }) {
  const { lang } = useLanguage();
  const accent = ACCENT_COLORS[pack.accentColor];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative glass rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={20} />
          </button>

          {pack.badge && (
            <div className={`inline-block bg-gradient-to-r ${BADGE_GRADIENT[pack.accentColor] || 'from-sky-500 to-blue-500'} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}>
              {pack.badge[lang]}
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            {pack.icon}
            <h3 className="text-xl font-bold text-gray-100">{pack.name[lang]}</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">{pack.description[lang]}</p>

          <div className="mb-4">
            <p className={`text-3xl font-black ${accent} mb-1`}>{pack.price[lang]}</p>
            <p className={`text-xs ${accent}`}>{pack.priceNote[lang]}</p>
          </div>

          {pack.timeline && (
            <p className="text-xs text-gray-400 mb-4 italic">⏱ {pack.timeline[lang]}</p>
          )}

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-200 mb-2">
              {lang === 'es' ? 'Incluye:' : 'Includes:'}
            </h4>
            <ul className="space-y-2">
              {pack.features[lang].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check size={14} className="text-green-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {pack.roi && (
            <div className={`${ACCENT_BG[pack.accentColor]} rounded-lg p-3 mb-4`}>
              <h4 className="text-sm font-semibold text-gray-200 mb-2">
                {lang === 'es' ? 'Retorno esperado:' : 'Expected ROI:'}
              </h4>
              <ul className="space-y-1">
                {pack.roi[lang].map((r, i) => (
                  <li key={i} className="text-xs text-gray-300">{r}</li>
                ))}
              </ul>
            </div>
          )}

          <CalendlyButton className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-medium transition-all text-sm">
            {lang === 'es' ? 'Agenda tu diagnóstico gratuito →' : 'Schedule your free diagnosis →'}
          </CalendlyButton>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Services() {
  const { lang, t } = useLanguage();
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  return (
    <section id="servicios" data-section="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('consulting_services_title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKS.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              onClick={() => {
                setSelectedPack(pack);
                events.serviceView(pack.id);
              }}
              className={`glass rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-200 hover:scale-[1.02] relative overflow-hidden ${
                pack.highlighted ? 'border-2 border-green-400/50' : 'border border-white/10'
              }`}
            >
              {pack.badge && (
                <div className={`absolute top-0 right-0 bg-gradient-to-l ${BADGE_GRADIENT[pack.accentColor] || 'from-sky-500 to-blue-500'} text-white text-xs font-bold px-4 py-1 rounded-bl-lg`}>
                  {pack.badge[lang]}
                </div>
              )}

              <div className="text-center mb-4 mt-2">
                {pack.icon}
                <h3 className="text-xl font-bold mt-2">{pack.name[lang]}</h3>
              </div>

              <p className="text-gray-400 text-sm text-center flex-grow mb-4">{pack.description[lang]}</p>

              <div className={`${ACCENT_BG[pack.accentColor]} rounded-lg p-4 mb-4`}>
                <h5 className={`font-semibold ${ACCENT_COLORS[pack.accentColor]} mb-2 text-sm`}>
                  {lang === 'es' ? 'Incluye:' : 'Includes:'}
                </h5>
                <ul className="text-xs text-gray-400 space-y-1">
                  {pack.idealFor[lang].map((item, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check size={10} className={ACCENT_COLORS[pack.accentColor]} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto border-t border-white/10 pt-4 text-center">
                <p className={`text-3xl font-bold ${ACCENT_COLORS[pack.accentColor]} mb-1`}>
                  {pack.price[lang]}
                </p>
                <p className={`text-xs ${ACCENT_COLORS[pack.accentColor]} mb-3`}>{pack.priceNote[lang]}</p>
                <div className="text-xs text-sky-400 font-medium">
                  {lang === 'es' ? 'Haz clic para conocer más →' : 'Click to learn more →'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flexibility note */}
        <div className="mt-12 text-center max-w-3xl mx-auto glass rounded-xl p-6">
          <Handshake size={36} className="text-sky-400 mx-auto mb-3" />
          <h4 className="font-bold text-lg mb-2">
            {lang === 'es' ? 'Precios Flexibles y Adaptados a su Negocio' : 'Flexible Pricing Adapted to Your Business'}
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            {lang === 'es'
              ? 'Cada empresa es única. Los precios son orientativos y se ajustan según la complejidad de su proyecto. Puede optar por pagos mensuales con soporte continuo o proyectos únicos sin recurrencia. ¡Conversemos!'
              : 'Every business is unique. Prices are indicative and adjust based on your project complexity. You can choose monthly payments with ongoing support or one-time projects with no recurring costs. Let\'s talk!'}
          </p>
          <CalendlyButton className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-6 py-2 rounded-full text-sm transition-all">
            {lang === 'es' ? '📊 Solicitar Cotización Personalizada' : '📊 Request Custom Quote'}
          </CalendlyButton>
        </div>
      </motion.div>

      {selectedPack && <PackModal pack={selectedPack} onClose={() => setSelectedPack(null)} />}
    </section>
  );
}
