'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

type CaseStudy = {
  id: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  result: { es: string; en: string };
  tags: string[];
  icon: string;
  bgGradient: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'automation-ventas',
    title: { es: 'Automatización de Ventas', en: 'Sales Automation' },
    description: { es: 'E-commerce con altas tasas de abandono de carrito y seguimiento de clientes manual. Implementamos flujos automatizados de recupero de carrito vía WhatsApp + email.', en: 'E-commerce with high cart abandonment rates and manual customer follow-up. We implemented automated cart recovery flows via WhatsApp + email.' },
    result: { es: '40% más conversiones, 25% mayor ticket promedio, 60% menos carritos abandonados', en: '40% more conversions, 25% higher average ticket, 60% fewer abandoned carts' },
    tags: ['Automatización', 'WhatsApp', 'E-commerce'],
    icon: '🛒',
    bgGradient: 'from-sky-500/20 to-blue-500/20',
  },
  {
    id: 'automation-rrhh',
    title: { es: 'Automatización de RRHH', en: 'HR Automation' },
    description: { es: 'Empresa de 50 empleados con procesos de onboarding completamente manuales y gestión de licencias vía email. Automatizamos el ciclo completo de incorporación y reembolsos.', en: 'Company of 50 employees with completely manual onboarding processes and leave management via email. We automated the complete incorporation and reimbursement cycle.' },
    result: { es: 'Onboarding de 8hs a 2hs, reembolsos de 3hs a 15min semanales', en: 'Onboarding from 8h to 2h, reimbursements from 3h to 15min weekly' },
    tags: ['RRHH', 'Onboarding', 'Automatización'],
    icon: '👥',
    bgGradient: 'from-indigo-500/20 to-purple-500/20',
  },
  {
    id: 'automation-ops',
    title: { es: 'Automatización Operativa', en: 'Operations Automation' },
    description: { es: 'PyME de servicios con facturación 100% manual y gestión de consultas de clientes por múltiples canales sin centralización. Implementamos hub único y automatización de facturación.', en: 'Services SMB with 100% manual billing and client query management across multiple channels without centralization. We implemented a single hub and billing automation.' },
    result: { es: 'Facturación de 12hs a 1hs semanal, 70% consultas resueltas en menos de 2hs', en: 'Billing from 12h to 1h weekly, 70% queries resolved in less than 2h' },
    tags: ['Operaciones', 'Facturación', 'CRM'],
    icon: '⚙️',
    bgGradient: 'from-cyan-500/20 to-teal-500/20',
  },
  {
    id: 'chatbot-ia',
    title: { es: 'Chatbot IA WhatsApp', en: 'AI WhatsApp Chatbot' },
    description: { es: 'E-commerce con equipo de soporte saturado respondiendo las mismas preguntas repetidamente. Implementamos chatbot con IA entrenado con el catálogo y FAQs del negocio.', en: 'E-commerce with saturated support team answering the same questions repeatedly. We implemented AI chatbot trained with the business catalog and FAQs.' },
    result: { es: '80% de preguntas automáticas, 30% aumento satisfacción cliente, 24/7 sin costo extra', en: '80% automatic responses, 30% customer satisfaction increase, 24/7 at no extra cost' },
    tags: ['IA', 'Chatbot', 'WhatsApp'],
    icon: '🤖',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'dashboard-ventas',
    title: { es: 'Dashboard de Ventas en Tiempo Real', en: 'Real-Time Sales Dashboard' },
    description: { es: 'Distribuidora con 120 empleados tomando decisiones basadas en reportes Excel semanales. Creamos dashboard conectado a su sistema de facturación actualizado cada hora.', en: 'Distributor with 120 employees making decisions based on weekly Excel reports. We created a dashboard connected to their billing system updated every hour.' },
    result: { es: 'ROI del 400% en el primer año, 18% aumento en rentabilidad, 3 meses para el break-even', en: '400% ROI in the first year, 18% increase in profitability, 3 months to break-even' },
    tags: ['BI', 'Dashboard', 'Ventas'],
    icon: '📊',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    id: 'automation-marketing',
    title: { es: 'Automatización de Marketing', en: 'Marketing Automation' },
    description: { es: 'Agencia con campañas manuales y seguimiento de leads sin proceso. Implementamos funnel automatizado con segmentación, nurturing y calificación de leads con IA.', en: 'Agency with manual campaigns and lead tracking without process. We implemented automated funnel with segmentation, nurturing and AI-powered lead qualification.' },
    result: { es: '60% más leads calificados, 35% más conversiones, 80% menos leads perdidos', en: '60% more qualified leads, 35% more conversions, 80% fewer lost leads' },
    tags: ['Marketing', 'Automatización', 'IA'],
    icon: '📣',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
  },
];

export default function CaseStudies() {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="examples" ref={ref} data-section="case-studies" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="section-title">
            {lang === 'es' ? 'Ejemplos de Implementaciones Reales' : 'Real Implementation Examples'}
          </h2>
          <p className="text-gray-400">
            {lang === 'es'
              ? 'Casos de éxito con métricas concretas de automatización, IA y BI'
              : 'Success cases with concrete metrics from automation, AI and BI projects'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASE_STUDIES.map((cs, i) => (
            <motion.div
              key={cs.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className={`glass rounded-2xl overflow-hidden glow-border group`}
            >
              <div className={`bg-gradient-to-br ${cs.bgGradient} p-6 text-center`}>
                <span className="text-5xl">{cs.icon}</span>
              </div>
              <div className="p-5">
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {cs.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-gray-100 mb-2">{cs.title[lang]}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{cs.description[lang]}</p>
                <div className="flex items-start gap-2 text-xs text-green-400 font-medium bg-green-500/10 rounded-xl p-3">
                  <span>📈</span>
                  {cs.result[lang]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
