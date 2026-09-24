'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Clock, Play } from 'lucide-react';
import ContextBackLink from '@/components/shared/ContextBackLink';
import { openContactModal } from '@/components/shared/ContactModal';
import { useLanguage } from '@/contexts/LanguageContext';

export const HENRY_MASTERCLASS_ID = 'VRezpIcvG4U';

const CONTENT = {
  es: {
    back: 'Volver a trabajos',
    eyebrow: 'Henry / Diseño curricular',
    title: <>De herramientas a <em>habilidades.</em></>,
    lead: 'Rediseñamos la carrera de AI Automation de Henry para que el egresado no solo sepa construir el flujo que vio en clase, sino hacerse cargo de una automatización de la que depende otra persona.',
    facts: [
      ['15', 'semanas, antes 7'],
      ['20', 'clases en vivo + proyecto final'],
      ['~145 h', 'de carga total'],
      ['4', 'módulos'],
    ],
    asideLabel: 'Rol de MGA',
    asideTitle: 'Expert a cargo del pensum: perfil de egreso, estructura, prácticas, evaluación y métricas de éxito.',
    asideItems: ['Primera cohorte: septiembre de 2026', 'Metodología de aula invertida y aprendizaje basado en proyectos', 'Masterclass abierta sobre el rol de AI Automation'],
    problemEyebrow: 'El punto de partida',
    problemTitle: 'Saber usar la herramienta no alcanza.',
    problemBody: 'El programa original enseñaba a construir automatizaciones que funcionan. El mercado pide algo más: decidir dónde corren, protegerlas, probarlas antes de entregarlas, documentarlas para que otro las opere y saber cuánto cuesta sostenerlas.',
    before: 'Antes',
    beforeItems: ['Temario organizado por herramienta', 'Prácticas centradas en el camino feliz', 'Uso de IA sin un marco explícito', '7 semanas, sin una instancia integradora final'],
    after: 'Después',
    afterItems: ['Temario organizado por habilidad, con herramientas intercambiables', 'Volumen real, datos sucios y un criterio de éxito medible en cada práctica', 'Un contrato de uso de IA explícito para cada módulo', 'Proyecto final por sprints con defensa ante panel'],
    skillsEyebrow: 'Perfil de egreso',
    skillsTitle: 'Siete habilidades en lugar de una lista de herramientas.',
    skills: ['Diagnóstico de procesos y caso de negocio', 'Diseño y manipulación de datos', 'Integración de sistemas', 'Construcción de flujos con IA', 'Trabajo asistido por IA sobre automatizaciones', 'Confiabilidad y seguridad', 'Entrega profesional'],
    modulesEyebrow: 'Estructura',
    modulesTitle: 'Cuatro módulos, un recorrido de oficio.',
    modules: [
      ['M1', 'Fundamentos de automatización y AI', 'El proceso, los datos y la herramienta', '6 clases · 3 semanas'],
      ['M2', 'IA aplicada a automatizaciones', 'Modelos de lenguaje con salida estructurada, costo estimado y agentes', '6 clases · 4 semanas'],
      ['M3', 'Producción, escala y entrega', 'Arquitectura, seguridad, pruebas, operación y costo', '8 clases · 5 semanas · nuevo'],
      ['M4', 'Proyecto final integrador', 'Un caso completo bajo sprints, con defensa ante panel', '3 sprints · nuevo'],
    ],
    contractEyebrow: 'Contrato de uso de IA',
    contractTitle: 'No se prohíbe la IA: se explicita qué se espera en cada tramo.',
    contractLead: 'Los estudiantes van a usar IA desde el primer día. En lugar de ignorarlo, cada módulo arranca con un acuerdo pedagógico sobre para qué se usa y por qué.',
    contract: [
      ['M1', 'Buscador y explicador', 'El diagnóstico lo hace el estudiante: es el criterio que después le van a pagar.'],
      ['M2', 'Objeto de estudio y copiloto de prompting', 'Entender tokens, temperatura y formato solo se aprende peleándose con el prompt.'],
      ['M3', 'Copiloto de construcción, con revisión humana', 'Se evalúa si sabe leer lo que produjo el modelo y justificar la arquitectura.'],
      ['M4', 'Sin restricción, declarando qué delegó', 'La defensa evalúa criterio, no abstinencia.'],
    ],
    videoEyebrow: 'Masterclass en Henry',
    videoTitle: 'Cómo convertirte en el referente de IA de tu empresa.',
    videoBody: 'Junto a Milagros Savino, Business Lead de Henry, recorrimos qué hace un perfil de AI Automation en el día a día y cómo llegar a él desde el rol que ya tenés.',
    videoCta: 'Ver la masterclass',
    finalEyebrow: '¿Tenés un programa para rediseñar?',
    finalTitle: 'Diseñemos formación que produzca capacidad real.',
    finalCta: 'Hablemos',
  },
  en: {
    back: 'Back to work',
    eyebrow: 'Henry / Curriculum design',
    title: <>From tools to <em>skills.</em></>,
    lead: 'We redesigned Henry’s AI Automation career so graduates can do more than rebuild the flow they saw in class: they can own an automation that someone else depends on.',
    facts: [
      ['15', 'weeks, up from 7'],
      ['20', 'live classes + capstone'],
      ['~145 h', 'total workload'],
      ['4', 'modules'],
    ],
    asideLabel: 'MGA’s role',
    asideTitle: 'Expert in charge of the syllabus: graduate profile, structure, practice, assessment and success metrics.',
    asideItems: ['First cohort: September 2026', 'Flipped classroom and project-based learning', 'Open masterclass on the AI Automation role'],
    problemEyebrow: 'Starting point',
    problemTitle: 'Knowing the tool is not enough.',
    problemBody: 'The original programme taught how to build automations that work. The market asks for more: deciding where they run, securing them, testing them before handoff, documenting them so someone else can operate them and knowing what they cost to sustain.',
    before: 'Before',
    beforeItems: ['Syllabus organised by tool', 'Practice focused on the happy path', 'AI use without an explicit framework', '7 weeks, with no integrating final stage'],
    after: 'After',
    afterItems: ['Syllabus organised by skill, with interchangeable tools', 'Real volume, dirty data and a measurable success criterion in every exercise', 'An explicit AI use agreement for each module', 'Sprint-based capstone defended before a panel'],
    skillsEyebrow: 'Graduate profile',
    skillsTitle: 'Seven skills instead of a list of tools.',
    skills: ['Process diagnosis and business case', 'Data design and manipulation', 'Systems integration', 'Building AI-powered flows', 'AI-assisted work on automations', 'Reliability and security', 'Professional delivery'],
    modulesEyebrow: 'Structure',
    modulesTitle: 'Four modules, one professional path.',
    modules: [
      ['M1', 'Automation and AI fundamentals', 'The process, the data and the tool', '6 classes · 3 weeks'],
      ['M2', 'AI applied to automations', 'Language models with structured output, estimated cost and agents', '6 classes · 4 weeks'],
      ['M3', 'Production, scale and delivery', 'Architecture, security, testing, operations and cost', '8 classes · 5 weeks · new'],
      ['M4', 'Integrating capstone', 'One complete case in sprints, defended before a panel', '3 sprints · new'],
    ],
    contractEyebrow: 'AI use agreement',
    contractTitle: 'AI is not banned: each stage states what is expected.',
    contractLead: 'Students will use AI from day one. Instead of ignoring it, every module opens with a teaching agreement on what it is used for and why.',
    contract: [
      ['M1', 'Search and explainer', 'Students do the diagnosis themselves: it is the judgement they will be paid for.'],
      ['M2', 'Object of study and prompting copilot', 'Tokens, temperature and format are only learned by wrestling with the prompt.'],
      ['M3', 'Building copilot, with human review', 'What is assessed is reading the model’s output and justifying the architecture.'],
      ['M4', 'Unrestricted, declaring what was delegated', 'The defence assesses judgement, not abstinence.'],
    ],
    videoEyebrow: 'Masterclass at Henry',
    videoTitle: 'How to become your company’s AI lead.',
    videoBody: 'Together with Milagros Savino, Business Lead at Henry, we walked through what an AI Automation profile does day to day and how to get there from the role you already have.',
    videoCta: 'Watch the masterclass',
    finalEyebrow: 'Have a programme to redesign?',
    finalTitle: 'Let’s design training that builds real capability.',
    finalCta: 'Let’s talk',
  },
};

export default function HenryCaseStudy() {
  const { lang } = useLanguage();
  const c = CONTENT[lang];

  return (
    <div className="signal-work" style={{ '--work-accent': '#ffff01', '--work-brand-bg': '#000000' } as CSSProperties}>
      <section className="signal-work-hero">
        <div>
          <ContextBackLink href="/#proyectos-clientes" label={c.back} />
          <div className="signal-work-hero__brand signal-work-hero__brand--henry"><img src="/logos/henry.svg" alt="Henry" /></div>
          <span className="signal-eyebrow">{c.eyebrow}</span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
          <dl className="signal-work-facts">
            {c.facts.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}
          </dl>
        </div>
        <aside>
          <span>{c.asideLabel}</span>
          <h2>{c.asideTitle}</h2>
          {c.asideItems.map((item) => <p key={item}><Check size={16} />{item}</p>)}
        </aside>
      </section>

      <section className="signal-work-section signal-work-split">
        <div>
          <span className="signal-eyebrow">{c.problemEyebrow}</span>
          <h2>{c.problemTitle}</h2>
          <p>{c.problemBody}</p>
        </div>
        <div className="signal-work-compare">
          <article><h3>{c.before}</h3><ul>{c.beforeItems.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="is-after"><h3>{c.after}</h3><ul>{c.afterItems.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></article>
        </div>
      </section>

      <section className="signal-work-section">
        <span className="signal-eyebrow">{c.skillsEyebrow}</span>
        <h2>{c.skillsTitle}</h2>
        <ol className="signal-work-skills">
          {c.skills.map((skill, index) => <li key={skill}><span>{String(index + 1).padStart(2, '0')}</span>{skill}</li>)}
        </ol>
      </section>

      <section className="signal-work-section">
        <span className="signal-eyebrow">{c.modulesEyebrow}</span>
        <h2>{c.modulesTitle}</h2>
        <div className="signal-work-modules">
          {c.modules.map(([code, name, focus, meta]) => (
            <article key={code}><span>{code}</span><h3>{name}</h3><p>{focus}</p><small>{meta}</small></article>
          ))}
        </div>
      </section>

      <section className="signal-work-section">
        <span className="signal-eyebrow">{c.contractEyebrow}</span>
        <h2>{c.contractTitle}</h2>
        <p className="signal-work-lead">{c.contractLead}</p>
        <div className="signal-work-contract">
          {c.contract.map(([code, use, why]) => (
            <div key={code}><span>{code}</span><strong>{use}</strong><p>{why}</p></div>
          ))}
        </div>
      </section>

      <section className="signal-work-section">
        <Link className="signal-work-video" href={`/blog/videos/?v=${HENRY_MASTERCLASS_ID}`}>
          <div className="signal-work-video__thumb">
            <img src={`https://img.youtube.com/vi/${HENRY_MASTERCLASS_ID}/maxresdefault.jpg`} alt="" />
            <span><Play size={22} fill="currentColor" /></span>
            <small><Clock size={11} />41:42</small>
          </div>
          <div>
            <span className="signal-eyebrow">{c.videoEyebrow}</span>
            <h2>{c.videoTitle}</h2>
            <p>{c.videoBody}</p>
            <strong>{c.videoCta}<ArrowRight size={16} /></strong>
          </div>
        </Link>
      </section>

      <section className="signal-offer-final">
        <span>{c.finalEyebrow}</span>
        <h2>{c.finalTitle}</h2>
        <button type="button" className="signal-offer-button" onClick={() => openContactModal('work_henry')}>{c.finalCta}<ArrowRight size={16} /></button>
      </section>
    </div>
  );
}
