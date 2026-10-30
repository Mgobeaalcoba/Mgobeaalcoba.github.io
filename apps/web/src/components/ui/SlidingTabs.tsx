'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface SlidingTab {
  id: string;
  label: string;
}

interface SlidingTabsProps {
  tabs: readonly SlidingTab[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  idPrefix?: string;
}

/** Tabs whose marker slides to the selected tab instead of jumping. Keyboard: arrows, Home and End. */
export default function SlidingTabs({ tabs, value, onChange, label, idPrefix = 'tab' }: SlidingTabsProps) {
  const list = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const el = list.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (el) setBar({ left: el.offsetLeft, width: el.offsetWidth });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, value, tabs]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = tabs.findIndex((tab) => tab.id === value);
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    onChange(tabs[next].id);
    list.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div ref={list} role="tablist" aria-label={label} className="signal-sliding-tabs" onKeyDown={onKeyDown}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`${idPrefix}-${tab.id}`}
          type="button"
          role="tab"
          aria-selected={tab.id === value}
          aria-controls={`${idPrefix}-panel-${tab.id}`}
          tabIndex={tab.id === value ? 0 : -1}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
      <span
        className="signal-sliding-tabs__bar"
        aria-hidden="true"
        style={bar ? { transform: `translateX(${bar.left}px)`, width: bar.width } : { opacity: 0 }}
      />
    </div>
  );
}
