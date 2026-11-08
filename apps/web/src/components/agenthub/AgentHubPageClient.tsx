"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, BookOpen, Wrench, ArrowDown } from "lucide-react";
import StudioPageIntro from "@/components/shared/StudioPageIntro";
import SlidingTabs from "@/components/ui/SlidingTabs";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AGENTHUB_AGENT_ID,
  AGENTHUB_BUILD,
  AGENTHUB_FAQ,
  AGENTHUB_FINAL,
  AGENTHUB_FLOW,
  AGENTHUB_HERO,
  AGENTHUB_MOCK,
  AGENTHUB_MORE_TABS,
  AGENTHUB_SIGNUP_URL,
  AGENTHUB_STATUS,
  AGENTHUB_STEPS,
  AGENTHUB_STEPS_TITLE,
  AGENTHUB_URL,
} from "@/lib/agenthubCopy";

type WidgetState = "idle" | "loading" | "ready" | "error";

/** Opens the floating button of the widget, which lives inside a shadow root. */
function openWidget(): boolean {
  const host = document.getElementById(`aaas-widget-${AGENTHUB_AGENT_ID}`);
  const fab = host?.shadowRoot?.querySelector<HTMLButtonElement>("button.fab");
  if (!fab) return false;
  if (fab.getAttribute("aria-expanded") !== "true") fab.click();
  return true;
}

export default function AgentHubPageClient() {
  const { lang } = useLanguage();
  const [more, setMore] = useState<string>(AGENTHUB_MORE_TABS[0].id);
  const [state, setState] = useState<WidgetState>("idle");
  const poll = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(poll.current), []);

  // The widget is loaded only when the visitor asks for it, so the page costs nothing until then.
  const tryLive = useCallback(() => {
    if (openWidget()) return setState("ready");
    setState("loading");
    if (!document.querySelector(`script[data-agent="${AGENTHUB_AGENT_ID}"]`)) {
      const script = document.createElement("script");
      script.src = `${AGENTHUB_URL}/widget/agent.js`;
      script.async = true;
      script.dataset.agent = AGENTHUB_AGENT_ID;
      script.dataset.brand = "MGA AgentHub";
      script.dataset.brandUrl =
        "https://www.mgatc.com/agenthub/?utm_source=widget&utm_medium=referral&utm_campaign=aaas_plugin";
      script.onerror = () => setState("error");
      document.body.appendChild(script);
    }
    let waited = 0;
    window.clearInterval(poll.current);
    poll.current = window.setInterval(() => {
      waited += 250;
      if (openWidget()) {
        window.clearInterval(poll.current);
        setState("ready");
      } else if (waited > 12000) {
        window.clearInterval(poll.current);
        setState("error");
      }
    }, 250);
  }, []);

  const openCurrent = () =>
    window.dispatchEvent(new CustomEvent("open-ai-assistant"));
  const moreTabs = AGENTHUB_MORE_TABS.map((item) => ({
    id: item.id,
    label: item.label[lang],
  }));
  const status = state === "idle" ? null : AGENTHUB_STATUS[state][lang];

  const liveButton = (surface: string) => (
    <button
      type="button"
      className="signal-cta-live"
      onClick={tryLive}
      data-analytics="agenthub_try_live"
      data-analytics-surface={surface}
    >
      <Sparkles aria-hidden="true" size={26} />
      <span>
        <strong>{AGENTHUB_HERO.cta[lang]}</strong>
        <small>{AGENTHUB_HERO.ctaSub[lang]}</small>
      </span>
    </button>
  );

  const productPreview = (
    <figure className="mga-agent-preview">
      <figcaption className="mga-agent-preview__caption">
        <span className="mga-kicker">
          AgentHub / {lang === "es" ? "En acción" : "In action"}
        </span>
        <h2>{AGENTHUB_MOCK.title[lang]}</h2>
        <span>{AGENTHUB_MOCK.label[lang]}</span>
      </figcaption>
      <div className="mga-agent-preview__question">
        <small>01 / {lang === "es" ? "Tu consulta" : "Your question"}</small>
        <p>{AGENTHUB_MOCK.user[lang]}</p>
      </div>
      <div className="mga-agent-preview__connection">
        <ArrowDown size={16} aria-hidden="true" />
        <span>
          02 / {lang === "es" ? "El agente conecta" : "The agent connects"}
        </span>
        <div>
          <span>
            <BookOpen size={14} />
            {AGENTHUB_MOCK.context[lang]}
          </span>
          <span>
            <Wrench size={14} />
            {AGENTHUB_MOCK.tools[lang]}
          </span>
        </div>
      </div>
      <div className="mga-agent-preview__answer">
        <small>03 / MGA</small>
        <p>{AGENTHUB_MOCK.bot[lang]}</p>
      </div>
    </figure>
  );

  return (
    <div className="signal-agenthub">
      <StudioPageIntro
        className="mga-agenthub-intro"
        eyebrow={AGENTHUB_HERO.eyebrow[lang]}
        title={
          <>
            {AGENTHUB_HERO.title[lang]}
            <br />
            <em>{AGENTHUB_HERO.emphasis[lang]}</em>
          </>
        }
        description={AGENTHUB_HERO.subtitle[lang]}
        aside={productPreview}
      >
        {liveButton("agenthub_hero")}
        <button
          type="button"
          className="mga-text-link"
          onClick={openCurrent}
          data-analytics="agenthub_try_current"
          data-analytics-surface="agenthub"
        >
          {AGENTHUB_HERO.tryCurrent[lang]}
        </button>
        <a
          className="mga-text-link"
          href={AGENTHUB_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="agenthub_signup"
          data-analytics-surface="agenthub"
        >
          {AGENTHUB_HERO.signup[lang]} ↗
        </a>
        <p className="signal-agenthub__status" role="status" aria-live="polite">
          {status ?? AGENTHUB_HERO.poc[lang]}
        </p>
      </StudioPageIntro>
      <nav
        className="mga-section-nav mga-container"
        aria-label={lang === "es" ? "En esta página" : "On this page"}
      >
        <a href="#agenthub-flujo">
          {lang === "es" ? "Cómo funciona" : "How it works"}
        </a>
        <a href="#agenthub-recorrido">
          {lang === "es" ? "Explorar el agente" : "Explore the agent"}
        </a>
        <a href="#agenthub-detalles">
          {lang === "es" ? "Detalles y preguntas" : "Details & questions"}
        </a>
      </nav>

      <section
        id="agenthub-flujo"
        className="signal-agenthub__flow"
        aria-label={AGENTHUB_FLOW.title[lang]}
      >
        <h2>{AGENTHUB_FLOW.title[lang]}</h2>
        <ol>
          {AGENTHUB_FLOW.nodes.map((node) => (
            <li key={node.es}>{node[lang]}</li>
          ))}
        </ol>
      </section>

      <section id="agenthub-recorrido" className="signal-agenthub__story">
        <div className="signal-agenthub__story-head">
          <span className="signal-eyebrow">
            {AGENTHUB_STEPS_TITLE.eyebrow[lang]}
          </span>
          <h2>{AGENTHUB_STEPS_TITLE.title[lang]}</h2>
        </div>
        <ol className="signal-timeline">
          {AGENTHUB_STEPS.map((step, index) => (
            <li key={step.tab.es} className="mga-agent-step">
              <details open={index === 0}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title[lang]}</h3>
                  <span aria-hidden="true">+</span>
                </summary>
                <div className="signal-step__card">
                  <span className="signal-tag">{step.tab[lang]}</span>
                  <p className="signal-step__story">{step.story[lang]}</p>
                  <dl className="signal-step__config">
                    {step.config.map((row) => (
                      <div key={row.label.es}>
                        <dt>{row.label[lang]}</dt>
                        <dd>{row.value[lang]}</dd>
                      </div>
                    ))}
                  </dl>
                  {step.chips ? (
                    <ul className="signal-step__chips">
                      {step.chips.map((chip) => (
                        <li key={chip.es}>{chip[lang]}</li>
                      ))}
                    </ul>
                  ) : null}
                  {step.code ? (
                    <pre className="signal-step__code">
                      <code>{step.code}</code>
                    </pre>
                  ) : null}
                  <div className="signal-step__try">
                    <span>{AGENTHUB_STEPS_TITLE.tryPrompt[lang]}:</span>
                    <q>{step.prompt[lang]}</q>
                    <button
                      type="button"
                      className="signal-link-button"
                      onClick={tryLive}
                      data-analytics={`agenthub_step_${index + 1}`}
                      data-analytics-surface="agenthub_story"
                    >
                      {AGENTHUB_STEPS_TITLE.tryIt[lang]} →
                    </button>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="signal-agenthub__final"
        aria-labelledby="agenthub-final"
      >
        <h2 id="agenthub-final">{AGENTHUB_FINAL.title[lang]}</h2>
        <p>{AGENTHUB_FINAL.text[lang]}</p>
        {liveButton("agenthub_final")}
        <p className="signal-agenthub__status" role="status" aria-live="polite">
          {status}
        </p>
      </section>

      <section id="agenthub-detalles" className="signal-agenthub__tabs">
        <SlidingTabs
          tabs={moreTabs}
          value={more}
          onChange={setMore}
          label={AGENTHUB_HERO.eyebrow[lang]}
          idPrefix="agenthub"
        />
        <div
          key={more}
          className="signal-agenthub__panel signal-page-enter"
          role="tabpanel"
          id={`agenthub-panel-${more}`}
          aria-labelledby={`agenthub-${more}`}
        >
          {more === "build" ? (
            <>
              <h2>{AGENTHUB_BUILD.title[lang]}</h2>
              <div className="signal-agenthub__table" role="table">
                <div
                  role="row"
                  className="signal-agenthub__row signal-agenthub__row--head"
                >
                  <span role="columnheader">{AGENTHUB_BUILD.from[lang]}</span>
                  <span role="columnheader">{AGENTHUB_BUILD.to[lang]}</span>
                </div>
                {AGENTHUB_BUILD.rows.map((row) => (
                  <div
                    role="row"
                    className="signal-agenthub__row"
                    key={row.from.es}
                  >
                    <span role="cell">{row.from[lang]}</span>
                    <span role="cell">{row.to[lang]}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="signal-agenthub__faq">
              {AGENTHUB_FAQ.map((item, index) => (
                <details
                  key={item.q.es}
                  data-analytics={`agenthub_faq_${index + 1}`}
                  data-analytics-surface="agenthub_faq"
                >
                  <summary>{item.q[lang]}</summary>
                  <p>{item.a[lang]}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
