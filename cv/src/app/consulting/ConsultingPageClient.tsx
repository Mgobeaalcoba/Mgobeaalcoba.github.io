'use client';

import { ArrowRight, ChartNoAxesCombined, Check, DatabaseZap, GraduationCap, Workflow } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import ClientPortfolio from '@/components/consulting/ClientPortfolio';
import { openContactModal } from '@/components/shared/ContactModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/gtag';
import { getCareerExperienceLabel } from '@/lib/experience';
import OfferGrid from '@/components/commerce/OfferGrid';

const CONTENT = {
  es: {
    eyebrow: 'Automatización · IA aplicada · Data',
    title: <>Convertimos operaciones manuales en <em>sistemas medibles.</em></>,
    lead: 'Diseñamos automatizaciones, agentes y dashboards para PyMEs que necesitan operar mejor sin construir un equipo técnico desde cero.',
    primary: 'Solicitar diagnóstico',
    secondary: 'Ver casos reales',
    risk: 'Diagnóstico desde USD 99. Se descuenta si avanzamos con la implementación.',
    proof: [
      ['−80%', 'Reducción potencial de costos operativos'],
      ['×3', 'ROI promedio objetivo por implementación'],
      ['2 sem', 'Para poner el primer flujo en producción'],
    ],
    trust: [
      [getCareerExperienceLabel('es'), 'Liderando Data & Analytics en Mercado Libre'],
      ['15+ proyectos', 'Implementaciones y productos entregados'],
      ['Docencia tech', 'Henry, UADE y formación de equipos'],
    ],
    problemEyebrow: 'Dónde generamos impacto',
    problemTitle: 'La tecnología importa cuando cambia cómo funciona el negocio.',
    problemLead: 'Partimos del cuello de botella operativo y diseñamos la solución mínima que produce un resultado verificable.',
    problems: [
      ['01', 'Operación manual', 'Procesos que dependen de copiar, perseguir, recordar y corregir. Los convertimos en flujos auditables que trabajan solos.'],
      ['02', 'Decisiones sin datos', 'Unificamos señales dispersas en métricas claras, tableros accionables y alertas que llegan antes del problema.'],
      ['03', 'Atención sin escala', 'Agentes y asistentes que resuelven, clasifican y derivan sin perder contexto ni control humano.'],
    ],
    capabilitiesEyebrow: 'Capacidades',
    capabilitiesTitle: 'Tres sistemas. Un mismo objetivo: ejecutar mejor.',
    capabilitiesLead: 'Cada proyecto combina producto, automatización y transferencia para que la solución siga creando valor después de la entrega.',
    capabilities: [
      { icon: Workflow, title: 'Automatización & agentes', body: 'Eliminamos trabajo repetitivo y conectamos equipos, herramientas y decisiones.', items: ['Workflows con n8n y APIs', 'Agentes, RAG y asistentes', 'Integraciones y alertas operativas'] },
      { icon: ChartNoAxesCombined, title: 'Data, BI & decisiones', body: 'Convertimos datos fragmentados en un sistema confiable para gestionar el negocio.', items: ['Dashboards ejecutivos', 'Pipelines y modelos de datos', 'Métricas, forecasting y calidad'] },
      { icon: GraduationCap, title: 'Talento & transferencia', body: 'Desarrollamos la capacidad técnica que el equipo necesita para sostener el cambio.', items: ['Mentorías 1:1', 'Cursos intensivos para equipos', 'Evaluación y recruiting técnico'] },
    ],
    casesEyebrow: 'Prueba, no promesas',
    casesTitle: 'Casos construidos alrededor de un resultado.',
    casesLead: 'Seleccionamos el menor sistema capaz de mover una métrica importante y lo llevamos a producción.',
    cases: [
      { type: 'Automatización', name: 'Operación comercial', body: 'Recuperación automatizada de oportunidades y seguimiento omnicanal sin carga manual.', result: '+40%', label: 'conversión en el flujo intervenido', href: '#contacto' },
      { type: 'IA aplicada', name: 'Atención inteligente', body: 'Asistente con contexto de negocio para responder, clasificar intención y derivar consultas.', result: '24/7', label: 'disponibilidad con escalamiento humano', href: '#contacto' },
      { type: 'Business Intelligence', name: 'Rentabilidad visible', body: 'Modelo de datos y tablero ejecutivo para detectar desvíos y entender margen por operación.', result: '3 meses', label: 'para recuperar la inversión objetivo', href: '/recursos/#roi' },
    ],
    processEyebrow: 'Cómo trabajamos',
    processTitle: 'De una fricción concreta a un sistema operando.',
    processLead: 'Sin proyectos eternos ni entregables decorativos. Cada etapa termina con una decisión o un resultado observable.',
    steps: [
      ['01', 'Diagnóstico', 'Mapeamos proceso, datos, riesgo y métrica objetivo. El resultado es una oportunidad priorizada.'],
      ['02', 'Diseño', 'Definimos el MVP, la arquitectura y el plan de adopción antes de construir.'],
      ['03', 'Implementación', 'Ponemos el flujo en producción, medimos y corregimos con usuarios reales.'],
      ['04', 'Transferencia', 'Documentamos, capacitamos y dejamos métricas para que el sistema evolucione.'],
    ],
    ctaEyebrow: 'El primer paso es pequeño',
    ctaTitle: 'Traé un proceso que hoy te quite tiempo. Diseñamos cómo devolverlo.',
    ctaBody: 'Elegí un servicio con alcance y precio definidos o contame un desafío que requiera una solución a medida.',
    ctaButton: 'Contar un caso a medida',
  },
  en: {
    eyebrow: 'Automation · Applied AI · Data',
    title: <>We turn manual operations into <em>measurable systems.</em></>,
    lead: 'We design automations, agents and dashboards for SMEs that need to operate better without building a technical team from scratch.',
    primary: 'Request a diagnosis', secondary: 'View real cases',
    risk: 'Diagnosis from USD 99. Deducted if we move forward with implementation.',
    proof: [['−80%', 'Potential operational cost reduction'], ['×3', 'Target average ROI per implementation'], ['2 wks', 'To put the first workflow in production']],
    trust: [[getCareerExperienceLabel('en'), 'Leading Data & Analytics at Mercado Libre'], ['15+ projects', 'Implementations and products delivered'], ['Tech teaching', 'Henry, UADE and team enablement']],
    problemEyebrow: 'Where we create impact', problemTitle: 'Technology matters when it changes how the business works.', problemLead: 'We start from the operational bottleneck and design the smallest solution that creates a verifiable result.',
    problems: [['01', 'Manual operations', 'Processes that depend on copying, chasing, remembering and correcting become auditable workflows that run on their own.'], ['02', 'Decisions without data', 'We unify scattered signals into clear metrics, actionable dashboards and alerts that arrive before the problem.'], ['03', 'Support that cannot scale', 'Agents and assistants that solve, classify and route without losing context or human control.']],
    capabilitiesEyebrow: 'Capabilities', capabilitiesTitle: 'Three systems. One goal: execute better.', capabilitiesLead: 'Every project combines product, automation and knowledge transfer so the solution keeps creating value after delivery.',
    capabilities: [
      { icon: Workflow, title: 'Automation & agents', body: 'We remove repetitive work and connect teams, tools and decisions.', items: ['n8n and API workflows', 'Agents, RAG and assistants', 'Integrations and operational alerts'] },
      { icon: ChartNoAxesCombined, title: 'Data, BI & decisions', body: 'We turn fragmented data into a trusted system for running the business.', items: ['Executive dashboards', 'Data pipelines and models', 'Metrics, forecasting and quality'] },
      { icon: GraduationCap, title: 'Talent & enablement', body: 'We build the technical capability your team needs to sustain change.', items: ['1:1 mentoring', 'Intensive team courses', 'Technical evaluation and recruiting'] },
    ],
    casesEyebrow: 'Proof, not promises', casesTitle: 'Cases built around an outcome.', casesLead: 'We select the smallest system capable of moving an important metric and take it to production.',
    cases: [
      { type: 'Automation', name: 'Commercial operations', body: 'Automated opportunity recovery and omnichannel follow-up without manual entry.', result: '+40%', label: 'conversion in the improved workflow', href: '#contacto' },
      { type: 'Applied AI', name: 'Intelligent support', body: 'Business-aware assistant that responds, classifies intent and routes conversations.', result: '24/7', label: 'availability with human escalation', href: '#contacto' },
      { type: 'Business Intelligence', name: 'Visible profitability', body: 'Data model and executive dashboard to detect deviations and understand margin per operation.', result: '3 months', label: 'target payback period', href: '/recursos/#roi' },
    ],
    processEyebrow: 'How we work', processTitle: 'From a concrete friction to a working system.', processLead: 'No endless projects or decorative deliverables. Each stage ends with a decision or an observable outcome.',
    steps: [['01', 'Diagnosis', 'We map the process, data, risk and target metric. The outcome is a prioritized opportunity.'], ['02', 'Design', 'We define the MVP, architecture and adoption plan before building.'], ['03', 'Implementation', 'We put the workflow in production, measure it and improve it with real users.'], ['04', 'Transfer', 'We document, train and leave metrics in place so the system can evolve.']],
    ctaEyebrow: 'The first step is small', ctaTitle: 'Bring us a process that takes your time. We will design how to give it back.', ctaBody: 'Choose a fixed-scope service or tell us about a challenge that needs a custom solution.', ctaButton: 'Discuss a custom case',
  },
};

export default function ConsultingPageClient() {
  const { lang } = useLanguage();
  const c = CONTENT[lang];

  const contact = (source: string) => {
    events.contactClick(source);
    openContactModal(source, lang === 'es' ? 'Quiero conversar sobre un proceso que podemos automatizar.' : 'I want to discuss a process we could automate.');
  };

  return (
    <main id="main-content" className="signal-home min-h-screen">
      <ScrollTracker site_section="consulting" />
      <Navbar />

      <section className="signal-hero" aria-labelledby="signal-hero-title">
        <div className="signal-hero__orb" />
        <div className="signal-hero__inner">
          <div>
            <span className="signal-eyebrow">{c.eyebrow}</span>
            <h1 id="signal-hero-title">{c.title}</h1>
            <p className="signal-hero__lead">{c.lead}</p>
            <div className="signal-hero__actions">
              <button className="signal-button signal-button--primary" onClick={() => contact('signal_hero')}>
                {c.primary}<ArrowRight size={18} />
              </button>
              <a className="signal-button signal-button--secondary" href="#casos">{c.secondary}</a>
            </div>
            <p className="signal-risk-note"><span><Check size={15} /></span>{c.risk}</p>
          </div>
          <div className="signal-hero__proof" aria-label={lang === 'es' ? 'Indicadores clave' : 'Key indicators'}>
            {c.proof.map(([value, label]) => <div className="signal-proof-row" key={value}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="signal-trust-strip" aria-label={lang === 'es' ? 'Experiencia y respaldo' : 'Experience and proof'}>
        <div className="signal-trust-strip__inner">
          <div className="signal-trust-item signal-trust-item--intro"><strong>MGA / Signal</strong><span>{lang === 'es' ? 'Experiencia que se convierte en ejecución.' : 'Experience converted into execution.'}</span></div>
          {c.trust.map(([title, body]) => <div className="signal-trust-item" key={title}><strong>{title}</strong><span>{body}</span></div>)}
        </div>
      </section>

      <section className="signal-section" aria-labelledby="impact-title">
        <div className="signal-section__heading">
          <div><span className="signal-eyebrow">{c.problemEyebrow}</span><h2 id="impact-title">{c.problemTitle}</h2></div>
          <p>{c.problemLead}</p>
        </div>
        <div className="signal-problem-grid">
          {c.problems.map(([index, title, body]) => <article className="signal-card" key={index}><span className="signal-card__index">{index}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section id="soluciones" className="signal-section" aria-labelledby="capabilities-title">
        <div className="signal-section__heading">
          <div><span className="signal-eyebrow">{c.capabilitiesEyebrow}</span><h2 id="capabilities-title">{c.capabilitiesTitle}</h2></div>
          <p>{c.capabilitiesLead}</p>
        </div>
        <div className="signal-capabilities-grid">
          {c.capabilities.map((item) => {
            const openCapabilityContact = () => contact(`capability_${item.title}`);

            return (
              <article
                className="signal-card signal-capability"
                key={item.title}
                role="button"
                tabIndex={0}
                aria-label={`${lang === 'es' ? 'Explorar solución' : 'Explore solution'}: ${item.title}`}
                onClick={openCapabilityContact}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openCapabilityContact();
                  }
                }}
              >
                <div className="signal-capability__icon"><item.icon size={23} /></div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <ul>{item.items.map((value) => <li key={value}>{value}</li>)}</ul>
                <span className="signal-card__link" aria-hidden="true">
                  {lang === 'es' ? 'Explorar solución' : 'Explore solution'}<ArrowRight size={15} />
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <section id="casos" className="signal-section" aria-labelledby="cases-title">
        <div className="signal-section__heading">
          <div><span className="signal-eyebrow">{c.casesEyebrow}</span><h2 id="cases-title">{c.casesTitle}</h2></div>
          <p>{c.casesLead}</p>
        </div>
        <div className="signal-case-grid">
          {c.cases.map((item, index) => <a className="signal-card signal-case" href={item.href} key={item.name}><div className="signal-case__visual"><div className={`signal-case-graphic signal-case-graphic--${index + 1}`}><DatabaseZap size={38} /><span>{item.result}</span></div></div><div className="signal-case__body"><div className="signal-case__meta"><span>{item.type}</span><span>0{index + 1}</span></div><h3>{item.name}</h3><p>{item.body}</p><div className="signal-case__result"><strong>{item.result}</strong><span>{item.label}</span></div></div></a>)}
        </div>
      </section>

      <ClientPortfolio />

      <OfferGrid />

      <section className="signal-section signal-process" aria-labelledby="process-title">
        <div className="signal-process__intro"><span className="signal-eyebrow">{c.processEyebrow}</span><h2 id="process-title">{c.processTitle}</h2><p>{c.processLead}</p></div>
        <div className="signal-steps">{c.steps.map(([number, title, body]) => <article className="signal-step" key={number}><span className="signal-step__number">{number}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
      </section>

      <section id="contacto" className="signal-section signal-final-cta" aria-labelledby="contact-title">
        <div className="signal-final-cta__panel"><span className="signal-eyebrow">{c.ctaEyebrow}</span><h2 id="contact-title">{c.ctaTitle}</h2><p>{c.ctaBody}</p><button className="signal-button signal-button--primary" onClick={() => contact('signal_final_cta')}>{c.ctaButton}<ArrowRight size={18} /></button></div>
      </section>

      <Footer />
    </main>
  );
}
