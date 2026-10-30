'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ContextBackLink from '@/components/shared/ContextBackLink';
import SlidingTabs from '@/components/ui/SlidingTabs';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AGENTHUB_AGENT_ID,
  AGENTHUB_BUILD,
  AGENTHUB_CASE,
  AGENTHUB_FAQ,
  AGENTHUB_HERO,
  AGENTHUB_MOCK,
  AGENTHUB_OBSERVE,
  AGENTHUB_SIGNUP_URL,
  AGENTHUB_STATUS,
  AGENTHUB_TABS,
  AGENTHUB_URL,
} from '@/lib/agenthubCopy';

type WidgetState = 'idle' | 'loading' | 'ready' | 'error';

/** Opens the floating button of the widget, which lives inside a shadow root. */
function openWidget(): boolean {
  const host = document.getElementById(`aaas-widget-${AGENTHUB_AGENT_ID}`);
  const fab = host?.shadowRoot?.querySelector<HTMLButtonElement>('button.fab');
  if (!fab) return false;
  if (fab.getAttribute('aria-expanded') !== 'true') fab.click();
  return true;
}

export default function AgentHubPageClient() {
  const { lang, t } = useLanguage();
  const [tab, setTab] = useState<string>(AGENTHUB_TABS[0].id);
  const [state, setState] = useState<WidgetState>('idle');
  const poll = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(poll.current), []);

  // The widget is loaded only when the visitor asks for it, so the page costs nothing until then.
  const tryLive = useCallback(() => {
    if (openWidget()) return setState('ready');
    setState('loading');
    if (!document.querySelector(`script[data-agent="${AGENTHUB_AGENT_ID}"]`)) {
      const script = document.createElement('script');
      script.src = `${AGENTHUB_URL}/widget/agent.js`;
      script.async = true;
      script.dataset.agent = AGENTHUB_AGENT_ID;
      script.dataset.brand = 'MGA AgentHub';
      script.dataset.brandUrl = 'https://www.mgatc.com/agenthub/?utm_source=widget&utm_medium=referral&utm_campaign=aaas_plugin';
      script.onerror = () => setState('error');
      document.body.appendChild(script);
    }
    let waited = 0;
    window.clearInterval(poll.current);
    poll.current = window.setInterval(() => {
      waited += 250;
      if (openWidget()) {
        window.clearInterval(poll.current);
        setState('ready');
      } else if (waited > 12000) {
        window.clearInterval(poll.current);
        setState('error');
      }
    }, 250);
  }, []);

  const openCurrent = () => window.dispatchEvent(new CustomEvent('open-ai-assistant'));

  const tabs = AGENTHUB_TABS.map((item) => ({ id: item.id, label: item.label[lang] }));

  return (
    <div className="signal-agenthub">
      <header className="signal-services-hero">
        <ContextBackLink href="/" label={t('services_back_home')} />
        <span className="signal-eyebrow">{AGENTHUB_HERO.eyebrow[lang]}</span>
        <h1>
          {AGENTHUB_HERO.title[lang]}
          <br />
          <em>{AGENTHUB_HERO.emphasis[lang]}</em>
        </h1>
        <p>{AGENTHUB_HERO.subtitle[lang]}</p>
        <div className="signal-agenthub__actions">
          <button
            type="button"
            className="signal-button signal-button--primary"
            onClick={tryLive}
            data-analytics="agenthub_try_live"
            data-analytics-surface="agenthub"
          >
            {AGENTHUB_HERO.tryLive[lang]}
          </button>
          <button
            type="button"
            className="signal-button signal-button--secondary"
            onClick={openCurrent}
            data-analytics="agenthub_try_current"
            data-analytics-surface="agenthub"
          >
            {AGENTHUB_HERO.tryCurrent[lang]}
          </button>
          <a
            className="signal-button signal-button--secondary"
            href={AGENTHUB_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="agenthub_signup"
            data-analytics-surface="agenthub"
          >
            {AGENTHUB_HERO.signup[lang]}
          </a>
        </div>
        <p className="signal-agenthub__status" role="status" aria-live="polite">
          {state === 'idle' ? AGENTHUB_HERO.poc[lang] : AGENTHUB_STATUS[state][lang]}
        </p>
      </header>

      <section className="signal-agenthub__mock-wrap" aria-label={AGENTHUB_MOCK.title[lang]}>
        <figure className="signal-mock">
          <div className="signal-mock__bar">
            <span className="signal-mock__dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="signal-mock__title">{AGENTHUB_MOCK.title[lang]}</span>
            <span className="signal-mock__live">{AGENTHUB_MOCK.live[lang]}</span>
          </div>
          <div className="signal-mock__body">
            <ul className="signal-mock__side">
              {AGENTHUB_MOCK.side.map((item, index) => (
                <li key={item.es} className={index === 2 ? 'is-active' : ''}>{item[lang]}</li>
              ))}
            </ul>
            <div className="signal-mock__chat">
              <p className="signal-mock__msg signal-mock__msg--user">{AGENTHUB_MOCK.user[lang]}</p>
              <p className="signal-mock__steps">
                {AGENTHUB_MOCK.steps.map((step) => (
                  <span key={step.es} className="signal-tag signal-tag--ok">{step[lang]}</span>
                ))}
              </p>
              <p className="signal-mock__msg">{AGENTHUB_MOCK.bot[lang]}</p>
            </div>
          </div>
        </figure>
      </section>

      <section className="signal-agenthub__tabs">
        <SlidingTabs tabs={tabs} value={tab} onChange={setTab} label={AGENTHUB_HERO.eyebrow[lang]} idPrefix="agenthub" />
        <div
          key={tab}
          className="signal-agenthub__panel signal-page-enter"
          role="tabpanel"
          id={`agenthub-panel-${tab}`}
          aria-labelledby={`agenthub-${tab}`}
        >
          {tab === 'case' && (
            <>
              <h2>{AGENTHUB_CASE.title[lang]}</h2>
              <ul className="signal-agenthub__list">
                {AGENTHUB_CASE.points.map((point) => (
                  <li key={point.es}>{point[lang]}</li>
                ))}
              </ul>
              <h3>{AGENTHUB_CASE.tryTitle[lang]}</h3>
              <ul className="signal-agenthub__prompts">
                {AGENTHUB_CASE.prompts.map((prompt) => (
                  <li key={prompt.es}>{prompt[lang]}</li>
                ))}
              </ul>
            </>
          )}
          {tab === 'build' && (
            <>
              <h2>{AGENTHUB_BUILD.title[lang]}</h2>
              <div className="signal-agenthub__table" role="table">
                <div role="row" className="signal-agenthub__row signal-agenthub__row--head">
                  <span role="columnheader">{AGENTHUB_BUILD.from[lang]}</span>
                  <span role="columnheader">{AGENTHUB_BUILD.to[lang]}</span>
                </div>
                {AGENTHUB_BUILD.rows.map((row) => (
                  <div role="row" className="signal-agenthub__row" key={row.from.es}>
                    <span role="cell">{row.from[lang]}</span>
                    <span role="cell">{row.to[lang]}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {tab === 'observe' && (
            <>
              <h2>{AGENTHUB_OBSERVE.title[lang]}</h2>
              <ul className="signal-agenthub__list">
                {AGENTHUB_OBSERVE.points.map((point) => (
                  <li key={point.es}>{point[lang]}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="signal-service-faq">
        <div>
          <span className="signal-eyebrow">FAQ</span>
          <h2>{lang === 'es' ? 'Antes de probar' : 'Before you try it'}</h2>
        </div>
        <div>
          {AGENTHUB_FAQ.map((item, index) => (
            <details key={item.q.es} data-analytics={`agenthub_faq_${index + 1}`} data-analytics-surface="agenthub_faq">
              <summary>{item.q[lang]}</summary>
              <p>{item.a[lang]}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
