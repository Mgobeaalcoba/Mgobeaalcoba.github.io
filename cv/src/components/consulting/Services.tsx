'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Gift, Bot, Brain, Handshake, Settings, BarChart2, GraduationCap, Users, UserCheck, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/gtag';
import CalendlyButton from '@/components/shared/CalendlyButton';

// ============ SERVICE CARDS (6 types) ============
type Service = {
  id: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  mvpBadge?: boolean;
  title: { es: string; en: string };
  desc: { es: string; en: string };
  items: { es: string[]; en: string[] };
  benefits: { es: string[]; en: string[] };
  successCase: { es: string; en: string };
  cta: { es: string; en: string };
};

const SERVICES: Service[] = [
  {
    id: 'automation',
    icon: Settings,
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    title: { es: 'Automatización de Procesos', en: 'Process Automation' },
    desc: { es: 'Liberamos a su equipo de tareas manuales y repetitivas. Desde la carga de facturas hasta el seguimiento de cobranzas.', en: 'We free your team from manual and repetitive tasks. From invoice loading to collections tracking.' },
    items: { es: ['Carga y procesamiento de facturas desde emails', 'Seguimiento automático de cobranzas por WhatsApp', 'Sincronización entre sistemas (CRM, ERP, Excel)', 'Generación automática de reportes semanales', 'Control de stock y alertas de reposición'], en: ['Invoice loading and processing from emails', 'Automatic WhatsApp collections follow-up', 'System synchronization (CRM, ERP, Excel)', 'Automatic weekly report generation', 'Stock control and replenishment alerts'] },
    benefits: { es: ['Reducción del 70-80% en tiempo de tareas repetitivas', 'Eliminación de errores humanos en data entry', 'Disponibilidad 24/7 sin supervisión', 'ROI visible en 2-3 meses'], en: ['70-80% reduction in repetitive task time', 'Elimination of human errors in data entry', '24/7 availability without supervision', 'Visible ROI in 2-3 months'] },
    successCase: { es: 'Una pyme de servicios redujo de 15 horas semanales a 2 horas el procesamiento de facturas, ahorrando USD 3,600 anuales.', en: 'A services SMB reduced invoice processing from 15 weekly hours to 2 hours, saving USD 3,600 annually.' },
    cta: { es: 'Agendar Consulta Gratuita', en: 'Schedule Free Consultation' },
  },
  {
    id: 'ai',
    icon: Brain,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    mvpBadge: true,
    title: { es: 'Inteligencia Artificial Aplicada', en: 'Applied Artificial Intelligence' },
    desc: { es: 'Potenciamos su comunicación y soporte con IA. Chatbots inteligentes y asistentes que generan contenido automáticamente.', en: 'We enhance your communication and support with AI. Smart chatbots and assistants that generate content automatically.' },
    items: { es: ['Chatbots inteligentes para WhatsApp Business', 'Asistentes virtuales para sitios web', 'Generación automática de contenido de marketing', 'Análisis de sentimiento de reseñas y feedback', 'Respuesta automática y clasificación de emails'], en: ['Smart chatbots for WhatsApp Business', 'Virtual assistants for websites', 'Automatic marketing content generation', 'Review and feedback sentiment analysis', 'Automatic email response and classification'] },
    benefits: { es: ['Atención al cliente 24/7 sin descanso', 'Respuesta instantánea a preguntas frecuentes', 'Captura de leads automatizada', 'Mejora del 40% en satisfacción del cliente'], en: ['24/7 customer service without breaks', 'Instant response to frequently asked questions', 'Automated lead capture', '40% improvement in customer satisfaction'] },
    successCase: { es: 'Una empresa de servicios aumentó su tasa de respuesta de 20% a 85% implementando un chatbot que atiende 200+ consultas mensuales automáticamente.', en: 'A services company increased its response rate from 20% to 85% by implementing a chatbot that handles 200+ monthly queries automatically.' },
    cta: { es: 'Agendar Consulta sobre IA', en: 'Schedule AI Consultation' },
  },
  {
    id: 'bi',
    icon: BarChart2,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    title: { es: 'Business Intelligence & Datos', en: 'Business Intelligence & Data' },
    desc: { es: 'Convertimos sus datos en su activo más valioso. Dashboards interactivos para visibilidad total en tiempo real.', en: 'We turn your data into your most valuable asset. Interactive dashboards for total real-time visibility.' },
    items: { es: ['Dashboard de Ventas y Performance', 'Control de Inventario y Rotación', 'Análisis de Rentabilidad por Producto/Cliente', 'Métricas Financieras y Cash Flow', 'KPIs Operacionales y de Productividad'], en: ['Sales and Performance Dashboard', 'Inventory and Rotation Control', 'Profitability Analysis by Product/Client', 'Financial Metrics and Cash Flow', 'Operational and Productivity KPIs'] },
    benefits: { es: ['Decisiones basadas en datos, no intuición', 'Visibilidad total del negocio en tiempo real', 'Detección temprana de problemas y oportunidades', 'Ahorro de 10+ horas/mes en reportes manuales'], en: ['Data-driven decisions, not intuition', 'Total real-time business visibility', 'Early detection of problems and opportunities', 'Save 10+ hours/month on manual reports'] },
    successCase: { es: 'Una distribuidora identificó productos con margen negativo y optimizó su portfolio, aumentando la rentabilidad un 18% en 3 meses.', en: 'A distributor identified negative-margin products and optimized their portfolio, increasing profitability by 18% in 3 months.' },
    cta: { es: 'Agendar Consulta sobre BI', en: 'Schedule BI Consultation' },
  },
  {
    id: 'mentoring',
    icon: GraduationCap,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    title: { es: 'Mentorías Tech Personalizadas', en: 'Personalized Tech Mentoring' },
    desc: { es: 'Destranque su carrera tech con mentoría personalizada. Sesiones prácticas enfocadas en sus desafíos reales.', en: 'Unblock your tech career with personalized mentoring. Practical sessions focused on your real challenges.' },
    items: { es: ['SQL complejo, arquitectura de pipelines, dashboards', 'Transición junior → senior, entrevistas, negociación salarial', 'Proyectos de portfolio impactantes', 'Decisiones de arquitectura: RAG, LLMs, ML, BI stack', 'Mindset de liderazgo: IC a Tech Lead'], en: ['Complex SQL, pipeline architecture, dashboards', 'Junior → senior transition, interviews, salary negotiation', 'Impactful portfolio projects', 'Architecture decisions: RAG, LLMs, ML, BI stack', 'Leadership mindset: IC to Tech Lead'] },
    benefits: { es: ['6+ años MercadoLibre como referencia real', 'Sesiones prácticas 1-a-1, no teóricas', 'Feedback personalizado y seguimiento continuo', 'Primera sesión sin riesgo: devolvemos si no aporta valor'], en: ['6+ years at MercadoLibre as real reference', 'Practical 1-on-1 sessions, not theoretical', 'Personalized feedback and continuous follow-up', 'First session risk-free: refund if no value'] },
    successCase: { es: 'Juan, Data Analyst con 2 años de experiencia, pasó a Sr Data Engineer en 8 meses. Resultado: 45% aumento salarial + oferta remote internacional.', en: 'Juan, a Data Analyst with 2 years of experience, became a Sr Data Engineer in 8 months. Result: 45% salary increase + international remote offer.' },
    cta: { es: 'Agendar Primera Sesión', en: 'Schedule First Session' },
  },
  {
    id: 'courses',
    icon: Users,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    title: { es: 'Cursos Intensivos para Equipos', en: 'Intensive Team Courses' },
    desc: { es: 'UpSkilling en grupos ultra-reducidos (máx 4 personas). SQL, Analytics, Data Science, GenAI y Automatización.', en: 'UpSkilling in ultra-small groups (max 4 people). SQL, Analytics, Data Science, GenAI and Automation.' },
    items: { es: ['SQL para Analytics — 5 sem / $650', 'Python para Data Analytics — 6 sem / $800', 'Data Science End-to-End — 6 sem / $850', 'GenAI & Automatización Práctica — 5 sem / $700', 'Power BI Avanzado — 4 sem / $600'], en: ['SQL for Analytics — 5 wks / $650', 'Python for Data Analytics — 6 wks / $800', 'Data Science End-to-End — 6 wks / $850', 'GenAI & Practical Automation — 5 wks / $700', 'Advanced Power BI — 4 wks / $600'] },
    benefits: { es: ['Máximo 4 participantes por curso', 'Contenido 100% práctico con proyectos reales', 'Feedback individualizado de un Technical Leader', 'Proyecto final incluido en el precio'], en: ['Maximum 4 participants per course', '100% practical content with real projects', 'Individualized feedback from a Technical Leader', 'Final project included in price'] },
    successCase: { es: 'Un equipo de 3 analytics pasó de queries básicas a window functions avanzadas en 5 semanas. 100% de los proyectos finales fueron aprobados.', en: 'A 3-person analytics team went from basic queries to advanced window functions in 5 weeks. 100% of final projects were approved.' },
    cta: { es: 'Consultar Disponibilidad', en: 'Check Availability' },
  },
  {
    id: 'recruiting',
    icon: UserCheck,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    title: { es: 'Reclutamiento Tech Especializado', en: 'Specialized Tech Recruiting' },
    desc: { es: 'Encontramos y evaluamos talento en Data, GenAI y Automation. Evaluación técnica real por un Technical Leader.', en: 'We find and evaluate talent in Data, GenAI and Automation. Real technical assessment by a Technical Leader.' },
    items: { es: ['Sourcing activo en LinkedIn, GitHub, comunidades tech', 'Evaluación técnica real: no tests genéricos', 'Assessment de cultura y soft skills', 'Presentación de candidatos prefiltered', 'Acompañamiento hasta la incorporación'], en: ['Active sourcing on LinkedIn, GitHub, tech communities', 'Real technical assessment: no generic tests', 'Culture and soft skills assessment', 'Pre-filtered candidate presentation', 'Support through onboarding'] },
    benefits: { es: ['Evaluado por alguien que hizo el trabajo', 'Proceso completo en 3 semanas promedio', 'Garantía de reemplazo de 3 meses', 'Fee solo por éxito o retainer mensual'], en: ['Evaluated by someone who did the work', 'Complete process in 3 weeks average', '3-month replacement guarantee', 'Fee only on success or monthly retainer'] },
    successCase: { es: 'Una startup fintech encontró su Sr Data Engineer ideal en 3 semanas. El candidato sigue en la empresa 18+ meses después.', en: 'A fintech startup found their ideal Sr Data Engineer in 3 weeks. The candidate is still at the company 18+ months later.' },
    cta: { es: 'Buscar Talento Tech', en: 'Find Tech Talent' },
  },
];

// ============ PACKS (3) ============
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
    description: { es: 'Perfecta para conocernos. Automatizamos un proceso simple de su empresa sin costo ni compromiso.', en: 'Perfect for getting to know each other. We automate a simple process in your company at no cost and no commitment.' },
    idealFor: { es: ['1 automatización simple', 'Diagnóstico inicial', 'Implementación en 1-2 semanas', 'Documentación básica'], en: ['1 simple automation', 'Initial diagnosis', 'Implementation in 1-2 weeks', 'Basic documentation'] },
    features: { es: ['1 automatización simple', 'Diagnóstico inicial gratuito', 'Implementación en 1-2 semanas', 'Documentación básica'], en: ['1 simple automation', 'Free initial diagnosis', 'Implementation in 1-2 weeks', 'Basic documentation'] },
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
    description: { es: 'Para empresas que quieren automatizar múltiples procesos y ver un impacto significativo.', en: 'For businesses that want to automate multiple processes and see significant impact.' },
    idealFor: { es: ['Facturación y cobranzas', 'Gestión de inventario', 'Seguimiento de clientes', 'Reportes automáticos'], en: ['Billing and collections', 'Inventory management', 'Customer follow-up', 'Automatic reports'] },
    features: { es: ['Múltiples automatizaciones personalizadas', 'Integraciones con sus sistemas (CRM, ERP, Excel)', 'Soporte técnico prioritario incluido', 'Actualizaciones y mejoras continuas', 'Documentación completa'], en: ['Multiple custom automations', 'Integrations with your systems (CRM, ERP, Excel)', 'Priority technical support included', 'Continuous updates and improvements', 'Complete documentation'] },
    price: { es: 'USD 100/mes', en: 'USD 100/mo' },
    priceNote: { es: 'o proyectos desde USD 600', en: 'or projects from USD 600' },
    timeline: { es: '3 - 4 Semanas de implementación', en: '3 - 4 Weeks of implementation' },
    roi: { es: ['✅ Ahorro promedio: 20-40 horas/mes', '📈 ROI: 300-500% en el primer año', '🎯 Escalable según crece su negocio'], en: ['✅ Average savings: 20-40 hours/month', '📈 ROI: 300-500% in the first year', '🎯 Scalable as your business grows'] },
    accentColor: 'sky',
  },
  {
    id: 'ia-analytics',
    icon: <Brain size={36} className="text-purple-400" />,
    name: { es: 'IA & Analytics', en: 'AI & Analytics' },
    description: { es: 'Transformación digital completa: automatización + inteligencia artificial + visualización de datos.', en: 'Complete digital transformation: automation + artificial intelligence + data visualization.' },
    idealFor: { es: ['Chatbot 24/7 con IA', 'Dashboard de ventas/ops', 'Análisis de sentimiento', 'Predicción de tendencias'], en: ['24/7 AI chatbot', 'Sales/ops dashboard', 'Sentiment analysis', 'Trend prediction'] },
    features: { es: ['✨ Todo del plan Automatización Pro', '🤖 Chatbot con IA para WhatsApp/Web (atención 24/7)', '📊 Dashboard interactivo (ventas, operaciones, finanzas)', '📈 Análisis predictivo y tendencias', '💬 Análisis de sentimiento de clientes', '🎯 Soporte prioritario y consultoría continua'], en: ['✨ Everything from Pro Automation plan', '🤖 AI chatbot for WhatsApp/Web (24/7 support)', '📊 Interactive dashboard (sales, operations, finance)', '📈 Predictive analytics and trends', '💬 Customer sentiment analysis', '🎯 Priority support and ongoing consulting'] },
    price: { es: 'USD 200/mes', en: 'USD 200/mo' },
    priceNote: { es: 'o proyectos desde USD 800', en: 'or projects from USD 800' },
    timeline: { es: '4 - 6 Semanas de implementación completa', en: '4 - 6 Weeks for full implementation' },
    roi: { es: ['✅ Ahorro promedio: 40-60 horas/mes', '📈 ROI: 400-800% anualizado', '🎯 Decisiones basadas en datos en tiempo real', '🚀 Para empresas que quieren transformación digital completa'], en: ['✅ Average savings: 40-60 hours/month', '📈 ROI: 400-800% annualized', '🎯 Real-time data-driven decisions', '🚀 For companies that want full digital transformation'] },
    accentColor: 'purple',
  },
];

const ACCENT_COLORS: Record<string, string> = { green: 'text-green-400', sky: 'text-sky-400', purple: 'text-purple-400' };
const ACCENT_BG: Record<string, string> = { green: 'bg-green-400/10', sky: 'bg-sky-400/10', purple: 'bg-purple-400/10' };
const BADGE_GRADIENT: Record<string, string> = { green: 'from-green-500 to-emerald-500' };

// ============ SERVICE MODAL ============
function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const { lang } = useLanguage();
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
          className="relative glass rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl ${service.bgColor} flex items-center justify-center`}>
              <service.icon size={24} className={service.color} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-100">{service.title[lang]}</h3>
              {service.mvpBadge && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 font-bold px-2 py-0.5 rounded-full">
                  ⚡ MVP en 24-72 hs
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className={`font-semibold text-sm mb-3 ${service.color}`}>
                {lang === 'es' ? '¿Qué incluye?' : 'What does it include?'}
              </h5>
              <ul className="space-y-2">
                {service.items[lang].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <Settings size={12} className={`${service.color} mt-0.5 shrink-0`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm text-green-400 mb-3">
                {lang === 'es' ? 'Beneficios' : 'Benefits'}
              </h5>
              <ul className="space-y-2 mb-4">
                {service.benefits[lang].map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check size={12} className="text-green-400 mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className={`${service.bgColor} rounded-xl p-3`}>
                <p className="text-xs font-semibold text-yellow-400 mb-1">
                  {lang === 'es' ? 'Caso de éxito' : 'Success case'}
                </p>
                <p className="text-xs text-gray-300">{service.successCase[lang]}</p>
              </div>
            </div>
          </div>

          <CalendlyButton className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all text-sm">
            <Calendar size={16} />
            {service.cta[lang]}
          </CalendlyButton>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============ PACK MODAL ============
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
          <div className="flex items-center gap-3 mb-3">{pack.icon}<h3 className="text-xl font-bold text-gray-100">{pack.name[lang]}</h3></div>
          <p className="text-gray-400 text-sm mb-4">{pack.description[lang]}</p>
          <div className="mb-4">
            <p className={`text-3xl font-black ${accent} mb-1`}>{pack.price[lang]}</p>
            <p className={`text-xs ${accent}`}>{pack.priceNote[lang]}</p>
          </div>
          {pack.timeline && <p className="text-xs text-gray-400 mb-4 italic">⏱ {pack.timeline[lang]}</p>}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-200 mb-2">{lang === 'es' ? 'Incluye:' : 'Includes:'}</h4>
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
              <h4 className="text-sm font-semibold text-gray-200 mb-2">{lang === 'es' ? 'Retorno esperado:' : 'Expected ROI:'}</h4>
              <ul className="space-y-1">
                {pack.roi[lang].map((r, i) => <li key={i} className="text-xs text-gray-300">{r}</li>)}
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

// ============ MAIN EXPORT ============
export default function Services() {
  const { lang, t } = useLanguage();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  return (
    <section id="servicios" data-section="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* ---- 6 Service Cards ---- */}
        <div className="text-center mb-10">
          <h2 className="section-title">
            {lang === 'es' ? 'Todos Nuestros Servicios' : 'All Our Services'}
          </h2>
          <p className="text-gray-400">
            {lang === 'es'
              ? 'Soluciones integrales para empresas y profesionales. Haga clic en cada servicio para ver detalles.'
              : 'Comprehensive solutions for businesses and professionals. Click each service for details.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => { setSelectedService(svc); events.serviceView(svc.id); }}
              className="glass rounded-2xl p-7 cursor-pointer hover:scale-[1.02] transition-all duration-200 glow-border"
            >
              <div className={`w-12 h-12 rounded-xl ${svc.bgColor} flex items-center justify-center mb-4`}>
                <svc.icon size={24} className={svc.color} />
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-lg font-bold text-gray-100">{svc.title[lang]}</h3>
                {svc.mvpBadge && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 font-bold px-2 py-0.5 rounded-full">
                    ⚡ MVP en 24-72 hs
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{svc.desc[lang]}</p>
              <span className={`text-xs font-medium ${svc.color}`}>
                {lang === 'es' ? 'Haz clic para conocer más →' : 'Click to learn more →'}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ---- 3 Packs ---- */}
        <div className="text-center mb-10">
          <h2 className="section-title">
            {lang === 'es' ? '¿Le Gustó su Automatización Gratis?' : 'Did You Like Your Free Automation?'}
          </h2>
          <p className="text-gray-400">
            {lang === 'es'
              ? 'Si quedó conforme, podemos escalar con soluciones más avanzadas. Precios flexibles según sus necesidades.'
              : 'If you were satisfied, we can scale with more advanced solutions. Flexible pricing according to your needs.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKS.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              onClick={() => { setSelectedPack(pack); events.serviceView(pack.id); }}
              className={`glass rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-200 hover:scale-[1.02] relative overflow-hidden ${
                pack.highlighted ? 'border-2 border-green-400/50' : 'border border-white/10'
              }`}
            >
              {pack.badge && (
                <div className={`absolute top-0 right-0 bg-gradient-to-l ${BADGE_GRADIENT[pack.accentColor] || 'from-sky-500 to-blue-500'} text-white text-xs font-bold px-4 py-1 rounded-bl-lg`}>
                  {pack.badge[lang]}
                </div>
              )}
              <div className="text-center mb-4 mt-2">{pack.icon}<h3 className="text-xl font-bold mt-2">{pack.name[lang]}</h3></div>
              <p className="text-gray-400 text-sm text-center flex-grow mb-4">{pack.description[lang]}</p>
              <div className={`${ACCENT_BG[pack.accentColor]} rounded-lg p-4 mb-4`}>
                <h5 className={`font-semibold ${ACCENT_COLORS[pack.accentColor]} mb-2 text-sm`}>{lang === 'es' ? 'Incluye:' : 'Includes:'}</h5>
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
                <p className={`text-3xl font-bold ${ACCENT_COLORS[pack.accentColor]} mb-1`}>{pack.price[lang]}</p>
                <p className={`text-xs ${ACCENT_COLORS[pack.accentColor]} mb-3`}>{pack.priceNote[lang]}</p>
                <div className="text-xs text-sky-400 font-medium">{lang === 'es' ? 'Haz clic para conocer más →' : 'Click to learn more →'}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flexibility note */}
        <div className="mt-12 text-center max-w-3xl mx-auto glass rounded-xl p-6">
          <Handshake size={36} className="text-sky-400 mx-auto mb-3" />
          <h4 className="font-bold text-lg mb-2">{lang === 'es' ? 'Precios Flexibles y Adaptados a su Negocio' : 'Flexible Pricing Adapted to Your Business'}</h4>
          <p className="text-gray-400 text-sm mb-4">
            {lang === 'es'
              ? 'Cada empresa es única. Los precios son orientativos y se ajustan según la complejidad del proyecto. Puede optar por pagos mensuales o proyectos únicos.'
              : "Every business is unique. Prices are indicative and adjust based on project complexity. You can choose monthly payments or one-time projects."}
          </p>
          <CalendlyButton className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-6 py-2 rounded-full text-sm transition-all">
            {lang === 'es' ? '📊 Solicitar Cotización Personalizada' : '📊 Request Custom Quote'}
          </CalendlyButton>
        </div>
      </motion.div>

      {selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />}
      {selectedPack && <PackModal pack={selectedPack} onClose={() => setSelectedPack(null)} />}
    </section>
  );
}
