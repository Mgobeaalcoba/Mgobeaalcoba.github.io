'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import ContextBackLink from '@/components/shared/ContextBackLink';
import SlidingTabs from '@/components/ui/SlidingTabs';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const [more, setMore] = useState<string>(AGENTHUB_MORE_TABS[0].id);
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
  const moreTabs = AGENTHUB_MORE_TABS.map((item) => ({ id: item.id, label: item.label[lang] }));
  const status = state === 'idle' ? null : AGENTHUB_STATUS[state][lang];

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
          {liveButton('agenthub_hero')}
          <div className="signal-agenthub__links">
            <button type="button" className="signal-link-button" onClick={openCurrent} data-analytics="agenthub_try_current" data-analytics-surface="agenthub">
              {AGENTHUB_HERO.tryCurrent[lang]}
            </button>
            <a className="signal-link-button" href={AGENTHUB_SIGNUP_URL} target="_blank" rel="noopener noreferrer" data-analytics="agenthub_signup" data-analytics-surface="agenthub">
              {AGENTHUB_HERO.signup[lang]}
            </a>
          </div>
        </div>
        <p className="signal-agenthub__status" role="status" aria-live="polite">
          {status ?? AGENTHUB_HERO.poc[lang]}
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

      <section className="signal-agenthub__flow" aria-label={AGENTHUB_FLOW.title[lang]}>
        <h2>{AGENTHUB_FLOW.title[lang]}</h2>
        <ol>
          {AGENTHUB_FLOW.nodes.map((node) => (
            <li key={node.es}>{node[lang]}</li>
          ))}
        </ol>
      </section>

      <section className="signal-agenthub__story">
        <div className="signal-agenthub__story-head">
          <span className="signal-eyebrow">{AGENTHUB_STEPS_TITLE.eyebrow[lang]}</span>
          <h2>{AGENTHUB_STEPS_TITLE.title[lang]}</h2>
        </div>
        <ol className="signal-timeline">
          {AGENTHUB_STEPS.map((step, index) => (
            <li key={step.tab.es} className="signal-step">
              <span className="signal-step__num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div className="signal-step__card">
                <span className="signal-tag">{step.tab[lang]}</span>
                <h3>{step.title[lang]}</h3>
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
                {step.code ? <pre className="signal-step__code"><code>{step.code}</code></pre> : null}
                <div className="signal-step__try">
                  <span>{AGENTHUB_STEPS_TITLE.tryPrompt[lang]}:</span>
                  <q>{step.prompt[lang]}</q>
                  <button type="button" className="signal-link-button" onClick={tryLive} data-analytics={`agenthub_step_${index + 1}`} data-analytics-surface="agenthub_story">
                    {AGENTHUB_STEPS_TITLE.tryIt[lang]} →
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="signal-agenthub__final" aria-labelledby="agenthub-final">
        <h2 id="agenthub-final">{AGENTHUB_FINAL.title[lang]}</h2>
        <p>{AGENTHUB_FINAL.text[lang]}</p>
        {liveButton('agenthub_final')}
        <p className="signal-agenthub__status" role="status" aria-live="polite">{status}</p>
      </section>

      <section className="signal-agenthub__tabs">
        <SlidingTabs tabs={moreTabs} value={more} onChange={setMore} label={AGENTHUB_HERO.eyebrow[lang]} idPrefix="agenthub" />
        <div
          key={more}
          className="signal-agenthub__panel signal-page-enter"
          role="tabpanel"
          id={`agenthub-panel-${more}`}
          aria-labelledby={`agenthub-${more}`}
        >
          {more === 'build' ? (
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
          ) : (
            <div className="signal-agenthub__faq">
              {AGENTHUB_FAQ.map((item, index) => (
                <details key={item.q.es} data-analytics={`agenthub_faq_${index + 1}`} data-analytics-surface="agenthub_faq">
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
