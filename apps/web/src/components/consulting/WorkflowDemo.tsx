"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Inbox,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EXAMPLES = {
  es: [
    {
      label: "Atención",
      input: "¿Tienen disponibilidad para una instalación el viernes?",
      middle:
        "Consulta la agenda y prepara una respuesta con el contexto del cliente.",
      result: "Tu equipo confirma la propuesta antes de enviarla.",
      tags: ["Mensaje", "Agente + agenda", "Revisión humana"],
    },
    {
      label: "Ventas",
      input: "Llega una consulta desde el formulario de tu sitio.",
      middle:
        "Valida los datos, registra el contacto en el CRM y asigna un responsable.",
      result: "La oportunidad queda registrada con una tarea de seguimiento.",
      tags: ["Formulario", "Workflow + CRM", "Seguimiento"],
    },
    {
      label: "Reportes",
      input: "Se actualizan las ventas en tus distintas fuentes.",
      middle: "Consolida la información y verifica la calidad de los datos.",
      result:
        "Tu equipo recibe un resumen con los desvíos que necesita revisar.",
      tags: ["Datos", "Pipeline + controles", "Decisión"],
    },
  ],
  en: [
    {
      label: "Support",
      input: "Do you have availability for an installation on Friday?",
      middle:
        "Checks the schedule and drafts a reply using the customer’s context.",
      result: "Your team approves the proposal before it is sent.",
      tags: ["Message", "Agent + schedule", "Human review"],
    },
    {
      label: "Sales",
      input: "A new inquiry arrives through your website form.",
      middle: "Validates the data, creates a CRM contact and assigns an owner.",
      result: "The opportunity is recorded with a follow-up task.",
      tags: ["Form", "Workflow + CRM", "Follow-up"],
    },
    {
      label: "Reports",
      input: "Sales data is updated across your sources.",
      middle: "Consolidates information and checks data quality.",
      result: "Your team receives a summary of deviations to review.",
      tags: ["Data", "Pipeline + checks", "Decision"],
    },
  ],
};

export default function WorkflowDemo() {
  const { lang } = useLanguage();
  const [selected, setSelected] = useState(0);
  const example = EXAMPLES[lang][selected];
  return (
    <div className="mga-demo">
      <div className="mga-demo__top">
        <span className="mga-kicker">
          {lang === "es" ? "Una idea en movimiento" : "An idea in motion"}
        </span>
        <span>
          {lang === "es"
            ? "Ejemplo ilustrativo · sin conexión a sistemas"
            : "Illustrative example · no connected systems"}
        </span>
      </div>
      <div
        className="mga-demo__controls"
        role="group"
        aria-label={
          lang === "es"
            ? "Elegir ejemplo de automatización"
            : "Choose an automation example"
        }
      >
        {EXAMPLES[lang].map((item, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mga-demo__flow" aria-live="polite" aria-atomic="true">
        {[
          { icon: Inbox, text: example.input },
          { icon: Sparkles, text: example.middle },
          { icon: SlidersHorizontal, text: example.result },
        ].map((step, index) => (
          <div
            className={`mga-demo__step mga-demo__step--${index}`}
            key={index}
          >
            <div>
              <step.icon size={20} />
              <span>0{index + 1}</span>
              {index === 2 ? <Check size={15} /> : <ArrowRight size={17} />}
            </div>
            <span>{example.tags[index]}</span>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
