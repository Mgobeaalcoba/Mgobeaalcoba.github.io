import type { Bilingual } from "@/types/content";

export const STUDIO_SERVICES: {
  title: Bilingual;
  hint: Bilingual;
  body: Bilingual;
  items: Bilingual[];
  href?: string;
}[] = [
  {
    title: { es: "Agentes de IA", en: "AI agents" },
    hint: { es: "Del mensaje a la acción", en: "From message to action" },
    body: {
      es: "Asistentes que entienden tu negocio, consultan información y actúan sobre tus herramientas. Con límites claros y revisión humana donde hace falta.",
      en: "Assistants that understand your business, retrieve information and act across your tools. With clear boundaries and human review where it matters.",
    },
    items: [
      { es: "Atención y operaciones", en: "Support & operations" },
      { es: "Conocimiento interno y RAG", en: "Internal knowledge & RAG" },
      { es: "Integración con CRM y APIs", en: "CRM & API integration" },
    ],
    href: "/servicios/agentes-a-medida/",
  },
  {
    title: { es: "Automatizaciones", en: "Automation" },
    hint: {
      es: "Menos pasos. Mejor operación.",
      en: "Fewer steps. Better operations.",
    },
    body: {
      es: "Conectamos los sistemas que ya usás para que la información circule y las tareas repetitivas dejen de depender de alguien que las recuerde.",
      en: "We connect the systems you already use so information flows and repetitive tasks no longer depend on someone remembering them.",
    },
    items: [
      { es: "Workflows con n8n y Python", en: "n8n & Python workflows" },
      {
        es: "Procesos comerciales y back office",
        en: "Sales & back-office processes",
      },
      {
        es: "Alertas, controles y trazabilidad",
        en: "Alerts, checks & traceability",
      },
    ],
    href: "/servicios/diagnostico-automatizacion/",
  },
  {
    title: { es: "Desarrollo de software", en: "Software development" },
    hint: { es: "De la idea al producto", en: "From idea to product" },
    body: {
      es: "Diseñamos y construimos sitios, aplicaciones e integraciones a medida. Partimos de cómo los van a usar las personas y los llevamos a producción.",
      en: "We design and build websites, applications and custom integrations. We start with how people will use them and take them to production.",
    },
    items: [
      { es: "Sitios y productos web", en: "Websites & web products" },
      {
        es: "Herramientas internas y portales",
        en: "Internal tools & portals",
      },
      { es: "APIs e integraciones", en: "APIs & integrations" },
    ],
  },
  {
    title: { es: "Datos y decisiones", en: "Data & decisions" },
    hint: {
      es: "Información que da claridad",
      en: "Information that brings clarity",
    },
    body: {
      es: "Ordenamos datos dispersos y los convertimos en una base confiable para decidir. Desde el pipeline hasta el tablero que usa tu equipo.",
      en: "We organize scattered data into a reliable foundation for decisions. From the pipeline to the dashboard your team uses.",
    },
    items: [
      { es: "Data Engineering y BI", en: "Data Engineering & BI" },
      { es: "Dashboards y métricas", en: "Dashboards & metrics" },
      {
        es: "Calidad y arquitectura de datos",
        en: "Data quality & architecture",
      },
    ],
    href: "/servicios/auditoria-data-ia/",
  },
];

export const STUDIO_STEPS = [
  {
    title: { es: "Entender", en: "Understand" },
    body: {
      es: "Relevamos el problema, las personas y los sistemas. Definimos qué vale la pena resolver primero.",
      en: "We map the problem, people and systems. We define what is worth solving first.",
    },
  },
  {
    title: { es: "Diseñar", en: "Design" },
    body: {
      es: "Acordamos alcance, entregables y presupuesto. Sabés qué vamos a construir y cómo validarlo.",
      en: "We agree on scope, deliverables and budget. You know what we will build and how to validate it.",
    },
  },
  {
    title: { es: "Construir", en: "Build" },
    body: {
      es: "Trabajamos en iteraciones cortas, con avances que podés probar y decisiones compartidas.",
      en: "We work in short iterations, with progress you can test and decisions we make together.",
    },
  },
  {
    title: { es: "Acompañar", en: "Support" },
    body: {
      es: "Entregamos documentación, capacitamos a tu equipo y acordamos el soporte para la siguiente etapa.",
      en: "We deliver documentation, train your team and agree on support for the next stage.",
    },
  },
];

export const STUDIO_FAQ = [
  {
    question: {
      es: "Tengo un problema, pero no sé qué tecnología necesito.",
      en: "I have a problem, but I don’t know which technology I need.",
    },
    answer: {
      es: "Ese es un buen punto de partida. Contanos qué te está quitando tiempo o qué querés construir. Primero entendemos el contexto; después proponemos si conviene automatización, IA, desarrollo o una combinación.",
      en: "That is a good place to start. Tell us what is taking your time or what you want to build. We understand the context first, then recommend automation, AI, development or a combination.",
    },
  },
  {
    question: {
      es: "¿Cómo se define el presupuesto?",
      en: "How is a project priced?",
    },
    answer: {
      es: "Los proyectos a medida se cotizan por escrito después de relevar el alcance. También podés empezar con un diagnóstico, auditoría o mentoría con precio publicado en Servicios a demanda. El diagnóstico es un servicio pago; su valor aplicable se descuenta si avanzamos con la implementación.",
      en: "Custom projects receive a written quote after we define the scope. You can also start with a diagnostic, audit or mentoring session with published pricing in On-demand services. The diagnostic is a paid service; the applicable fee is credited if we proceed with implementation.",
    },
  },
  {
    question: {
      es: "¿Pueden trabajar con las herramientas que ya usamos?",
      en: "Can you work with the tools we already use?",
    },
    answer: {
      es: "Sí. Revisamos tus sistemas, accesos y APIs antes de proponer cambios. Buscamos integrar lo que ya funciona y acordamos las dependencias, los costos de terceros y las limitaciones desde el inicio.",
      en: "Yes. We review your systems, access and APIs before proposing changes. We aim to integrate what already works and agree on dependencies, third-party costs and limitations upfront.",
    },
  },
  {
    question: {
      es: "¿Qué pasa después de la entrega?",
      en: "What happens after delivery?",
    },
    answer: {
      es: "La entrega incluye la documentación y transferencia acordadas. Definimos con vos quién opera el sistema y qué soporte o mantenimiento necesita. Ese acompañamiento queda detallado en la propuesta.",
      en: "Delivery includes the agreed documentation and knowledge transfer. We define who operates the system and what support or maintenance it needs. That support is detailed in the proposal.",
    },
  },
];
