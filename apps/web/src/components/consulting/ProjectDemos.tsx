"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Truck,
  Package,
  MapPin,
  Check,
  Database,
  Workflow,
  ChartNoAxesCombined,
  GraduationCap,
  Code2,
  CheckCheck,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function DemoChoices({
  labels,
  value,
  onChange,
  label,
}: {
  labels: string[];
  value: number;
  onChange: (index: number) => void;
  label: string;
}) {
  return (
    <div className="mga-project-demo__choices" role="group" aria-label={label}>
      {labels.map((text, index) => (
        <button
          key={text}
          type="button"
          aria-pressed={value === index}
          onClick={() => onChange(index)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export default function ProjectDemos() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [logistics, setLogistics] = useState(0);
  const [racing, setRacing] = useState(0);
  const [learning, setLearning] = useState(0);
  const logisticsSteps = es
    ? ["Recepción", "En ruta", "Entrega"]
    : ["Intake", "In transit", "Delivery"];
  const logisticsCopy = es
    ? [
        "Organizar el ingreso, la documentación y la preparación de cada envío.",
        "Conectar los puntos del recorrido con una operación clara.",
        "Completar la entrega y conservar la trazabilidad del proceso.",
      ]
    : [
        "Organize intake, documents and preparation for each shipment.",
        "Connect the route’s stages through a clear operation.",
        "Complete delivery and keep the process traceable.",
      ];
  const racingLabels = ["Comercial", "Sponsors", "Locademia"];
  const racingCopy = es
    ? [
        [
          "Ventas · Socios · Productos",
          "Modelo comercial",
          "Gestión y segmentación",
        ],
        [
          "Video · Redes · Marcas",
          "Exposición y media value",
          "Informes por sponsor",
        ],
        ["Tienda online · Retail", "Producto y canal", "Margen por SKU"],
      ]
    : [
        [
          "Sales · Members · Products",
          "Commercial model",
          "Management & segmentation",
        ],
        [
          "Video · Social · Brands",
          "Exposure & media value",
          "Sponsor reports",
        ],
        ["Online store · Retail", "Product & channel", "SKU margins"],
      ];
  const learningLabels = es
    ? ["Fundamentos", "Proyecto", "Evaluación"]
    : ["Foundations", "Project", "Assessment"];
  const learningCopy = es
    ? [
        [
          "Entender antes de ejecutar.",
          "Un concepto, un ejercicio guiado y una pregunta para conectar con el problema.",
        ],
        [
          "Aprender construyendo.",
          "Aplicar lo aprendido a un proyecto y explicar las decisiones tomadas.",
        ],
        [
          "Hacer visible el aprendizaje.",
          "Revisar el trabajo con criterios claros y una devolución concreta.",
        ],
      ]
    : [
        [
          "Understand before executing.",
          "A concept, a guided exercise and a question connecting to the problem.",
        ],
        [
          "Learn by building.",
          "Apply the learning in a project and explain the decisions made.",
        ],
        [
          "Make learning visible.",
          "Review the work with clear criteria and concrete feedback.",
        ],
      ];
  return (
    <div className="mga-project-demos">
      <article className="mga-project-demo mga-project-demo--logistics">
        <div className="mga-project-demo__visual">
          <div className="mga-project-demo__header">
            <span className="mga-project-demo__logo">
              <Image
                src="/logos/elportugues.png"
                alt="El Portugués"
                width={125}
                height={20}
              />
            </span>
            <small>{es ? "Flujo ilustrativo" : "Illustrative flow"}</small>
          </div>
          <DemoChoices
            labels={logisticsSteps}
            value={logistics}
            onChange={setLogistics}
            label={
              es ? "Explorar el flujo logístico" : "Explore the logistics flow"
            }
          />
          <div className="mga-logistics-route" aria-hidden="true">
            <span className={logistics === 0 ? "is-current" : "is-done"}>
              <Package size={23} />
            </span>
            <i className={logistics > 0 ? "is-done" : ""} />
            <span
              className={
                logistics === 1 ? "is-current" : logistics > 1 ? "is-done" : ""
              }
            >
              <Truck size={25} />
            </span>
            <i className={logistics > 1 ? "is-done" : ""} />
            <span className={logistics === 2 ? "is-current" : ""}>
              {logistics === 2 ? <Check size={24} /> : <MapPin size={23} />}
            </span>
          </div>
          <div
            className="mga-project-demo__statement"
            role="status"
            aria-live="polite"
          >
            <span className="mga-kicker">
              0{logistics + 1} / {logisticsSteps[logistics]}
            </span>
            <p>{logisticsCopy[logistics]}</p>
          </div>
        </div>
        <a
          className="mga-project-demo__caption"
          href="https://www.mgatc.com/elportugues-site/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>
            <h3>El Portugués S.A.</h3>
            <p>
              {es
                ? "Presencia digital para una operación logística."
                : "Digital presence for a logistics operation."}
            </p>
            <span>{es ? "Visitar el sitio" : "Visit the site"}</span>
          </div>
          <ArrowUpRight size={23} />
        </a>
      </article>
      <article className="mga-project-demo mga-project-demo--racing">
        <div className="mga-project-demo__visual">
          <div className="mga-project-demo__header">
            <strong>RACING CLUB</strong>
            <small>{es ? "Modelo conceptual" : "Concept model"}</small>
          </div>
          <DemoChoices
            labels={es ? racingLabels : ["Commercial", "Sponsors", "Locademia"]}
            value={racing}
            onChange={setRacing}
            label={
              es ? "Explorar frentes de Racing" : "Explore Racing workstreams"
            }
          />
          <div className="mga-racing-model" role="status" aria-live="polite">
            {[Database, Workflow, ChartNoAxesCombined].map((Icon, index) => (
              <div key={index}>
                <Icon size={18} />
                <span>{racingCopy[racing][index]}</span>
                {index < 2 && <span aria-hidden="true">↓</span>}
              </div>
            ))}
          </div>
        </div>
        <Link className="mga-project-demo__caption" href="/trabajos/racing/">
          <div>
            <h3>Racing Club / Data & GenAI</h3>
            <p>
              {es
                ? "Una arquitectura para conectar tres desafíos comerciales."
                : "One architecture connecting three business challenges."}
            </p>
            <span>{es ? "Explorar el caso" : "Explore the case"}</span>
          </div>
          <ArrowUpRight size={23} />
        </Link>
      </article>
      <article className="mga-project-demo mga-project-demo--learning">
        <div className="mga-project-demo__visual">
          <div className="mga-project-demo__header">
            <span className="mga-project-demo__academy">
              <Image
                src="/logos/unicorn-academy-mark.svg"
                alt=""
                width={26}
                height={26}
              />
              Unicorn Academy
            </span>
            <small>{es ? "En curso" : "In progress"}</small>
          </div>
          <DemoChoices
            labels={learningLabels}
            value={learning}
            onChange={setLearning}
            label={
              es
                ? "Explorar un recorrido de aprendizaje ilustrativo"
                : "Explore an illustrative learning journey"
            }
          />
          <div
            className="mga-learning-example"
            role="status"
            aria-live="polite"
          >
            <span className="mga-learning-example__icon">
              {learning === 0 ? (
                <GraduationCap size={30} />
              ) : learning === 1 ? (
                <Code2 size={30} />
              ) : (
                <CheckCheck size={30} />
              )}
            </span>
            <h4>{learningCopy[learning][0]}</h4>
            <p>{learningCopy[learning][1]}</p>
          </div>
          <span className="mga-project-demo__note">
            {es
              ? "Ejemplo ilustrativo de diseño curricular"
              : "Illustrative curriculum-design example"}
          </span>
        </div>
        <Link
          className="mga-project-demo__caption"
          href="/trabajos/unicorn-academy/"
        >
          <div>
            <h3>Unicorn Academy</h3>
            <p>
              {es
                ? "Diseño curricular y dirección académica en datos e IA."
                : "Curriculum design and academic direction in data and AI."}
            </p>
            <span>
              {es ? "Conocer la colaboración" : "Explore the collaboration"}
            </span>
          </div>
          <ArrowUpRight size={23} />
        </Link>
      </article>
    </div>
  );
}
