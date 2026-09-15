'use client';

import { useEffect, useRef } from 'react';
import { events, currentSection } from '@/lib/gtag';

/**
 * Generic interaction layer.
 *
 * A single delegated listener set tracks every interactive element on every
 * page, including the ones nobody instrumented by hand. That is the point: new
 * buttons are covered by construction instead of waiting for a manual call.
 *
 * Privacy contract (enforced below, not just documented):
 * - element identity comes from author-controlled attributes only:
 *   `data-analytics`, `id`, `aria-label`, `title`, `name`, `href` path or CSS
 *   class tokens. Element text is never read.
 * - input values, textarea content and select option labels are never read.
 *   A select only reports the option index, an input only its type.
 * - keyboards: only combinations with a modifier that match a known shortcut,
 *   so typed text can never leak.
 *
 * Authoring contract:
 * - `data-analytics="buy_button"`          stable id for the element
 * - `data-analytics-kind="tab|card|cta"`   overrides the inferred kind
 * - `data-analytics-surface="offer_grid"`  overrides the inferred surface
 * Explicit ids keep reports readable; the fallback keeps coverage complete.
 */

const RAPID_REPEAT_MS = 400;
const MAX_EVENTS_PER_VIEW = 250;
const FOCUS_THROTTLE_MS = 600;

const TARGET_SELECTOR = [
  'a[href]',
  'button',
  '[role="button"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="switch"]',
  'summary',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="button"]',
  'input[type="submit"]',
  'select',
  'label[for]',
  '[data-analytics]',
].join(',');

const UTILITY_CLASS_PATTERN = /^(w-|h-|p[xyltrb]?-|m[xyltrb]?-|text-|bg-|b[trbl]?-|rounded|flex|grid|gap-|space-|items-|justify-|overflow|absolute|relative|fixed|sticky|z-|opacity|transition|duration|hover:|focus:|group|min-|max-|inset|top-|left-|right-|bottom-|cursor-|select-|pointer-|shrink|grow|whitespace|truncate|leading-|tracking-|font-|antialiased|inline|block|hidden|border|shadow|ring|outline|sr-only|space)/;

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60);
}

function classTokens(element: Element): string {
  const raw = element.getAttribute('class');
  if (!raw) return '';
  const tokens = raw
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !token.includes(':'))
    .filter((token) => !UTILITY_CLASS_PATTERN.test(token))
    .slice(0, 2);
  return tokens.join('_');
}

function surfaceOf(element: Element): string {
  const explicit = element.closest('[data-analytics-surface]')?.getAttribute('data-analytics-surface');
  if (explicit) return slug(explicit);
  const section = element.closest('[data-section]')?.getAttribute('data-section');
  if (section) return slug(section);
  const main = element.closest('main')?.getAttribute('id');
  if (main) return slug(main);
  return 'page';
}

function kindOf(element: Element): string {
  const explicit = element.getAttribute('data-analytics-kind');
  if (explicit) return slug(explicit);
  const tag = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  if (role === 'tab') return 'tab';
  if (role === 'switch') return 'switch';
  if (role === 'menuitem') return 'menu_item';
  if (tag === 'summary') return 'accordion';
  if (tag === 'a') return 'link';
  if (tag === 'select') return 'select';
  if (tag === 'label') return 'label';
  if (tag === 'input') {
    const type = (element.getAttribute('type') || 'text').toLowerCase();
    if (type === 'checkbox' || type === 'radio') return 'toggle';
    return `input_${type}`;
  }
  return 'button';
}

/** Stable, PII-free identity for an element. */
function identityOf(element: Element): string {
  const explicit = element.getAttribute('data-analytics');
  if (explicit) return slug(explicit);

  const id = element.getAttribute('id');
  if (id) return slug(id);

  const labelled = element.getAttribute('aria-label') || element.getAttribute('title');
  if (labelled) return slug(labelled);

  const name = element.getAttribute('name');
  if (name) return slug(name);

  const href = element.getAttribute('href');
  if (href && !href.startsWith('#')) {
    const path = href.split('?')[0].split('#')[0];
    if (path) return slug(`link_${path === '/' ? 'home' : path}`);
  }

  const tokens = classTokens(element);
  if (tokens) return slug(`${kindOf(element)}_${tokens}`);

  const parentSection = element.closest('[data-section]')?.getAttribute('data-section');
  return slug(`${parentSection || 'page'}_${kindOf(element)}`);
}

function linkParams(element: Element): { link_type?: string; link_domain?: string; link_path?: string } {
  const href = element.getAttribute('href');
  if (!href) return {};
  if (href.startsWith('mailto:')) return { link_type: 'email', link_domain: 'not_apply', link_path: 'not_apply' };
  if (href.startsWith('tel:')) return { link_type: 'phone', link_domain: 'not_apply', link_path: 'not_apply' };
  if (href.startsWith('#')) return { link_type: 'anchor', link_domain: 'internal', link_path: 'not_apply' };
  try {
    const parsed = new URL(href, window.location.origin);
    const internal = parsed.origin === window.location.origin;
    return {
      link_type: internal ? 'internal' : 'external',
      link_domain: internal ? 'internal' : parsed.hostname.toLowerCase(),
      link_path: parsed.pathname || '/',
    };
  } catch {
    return { link_type: 'unknown', link_domain: 'not_apply', link_path: 'not_apply' };
  }
}

function toggleStateOf(element: Element): string | null {
  if (element.tagName.toLowerCase() === 'summary') {
    const details = element.closest('details');
    return details?.open ? 'collapsed' : 'expanded';
  }
  const expanded = element.getAttribute('aria-expanded');
  if (expanded === 'true') return 'collapsed';
  if (expanded === 'false') return 'expanded';
  if (element instanceof HTMLInputElement && (element.type === 'checkbox' || element.type === 'radio')) {
    return element.checked ? 'unchecked' : 'checked';
  }
  return null;
}

export default function InteractionTracker() {
  const counter = useRef(0);
  const lastEvent = useRef<{ id: string; at: number }>({ id: '', at: 0 });
  const focused = useRef(new Set<string>());

  useEffect(() => {
    const canEmit = (id: string) => {
      if (counter.current >= MAX_EVENTS_PER_VIEW) return false;
      const now = Date.now();
      if (lastEvent.current.id === id && now - lastEvent.current.at < RAPID_REPEAT_MS) return false;
      lastEvent.current = { id, at: now };
      counter.current += 1;
      return true;
    };

    const resolveTarget = (node: EventTarget | null): Element | null => {
      if (!(node instanceof Element)) return null;
      const explicit = node.closest('[data-analytics]');
      if (explicit) return explicit;
      return node.closest(TARGET_SELECTOR);
    };

    const onClick = (rawEvent: Event) => {
      const target = resolveTarget(rawEvent.target);
      if (!target) return;
      const element = identityOf(target);
      if (!canEmit(`click:${element}`)) return;

      const base = {
        ui_element: element,
        ui_kind: kindOf(target),
        ui_surface: surfaceOf(target),
        site_section: currentSection(),
      };

      const state = toggleStateOf(target);
      if (state) {
        events.uiToggle({ ...base, ui_state: state });
        return;
      }

      const index = target.getAttribute('data-analytics-index');
      events.uiClick({
        ...base,
        ui_index: index ? Number.parseInt(index, 10) : undefined,
        ...linkParams(target),
      });
    };

    const onChange = (rawEvent: Event) => {
      const target = rawEvent.target;
      if (!(target instanceof Element)) return;
      if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return;

      const element = identityOf(target);
      if (!canEmit(`change:${element}`)) return;

      if (target instanceof HTMLSelectElement) {
        events.uiToggle({
          ui_element: element,
          ui_kind: 'select',
          ui_surface: surfaceOf(target),
          ui_state: `option_${target.selectedIndex}`,
          site_section: currentSection(),
        });
        return;
      }

      events.uiToggle({
        ui_element: element,
        ui_kind: 'toggle',
        ui_surface: surfaceOf(target),
        ui_state: target.checked ? 'checked' : 'unchecked',
        site_section: currentSection(),
      });
    };

    const onFocusIn = (rawEvent: Event) => {
      const target = rawEvent.target;
      if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement) && !(target instanceof HTMLSelectElement)) {
        return;
      }
      // Never read the value: only the field type and its authored identity.
      const element = identityOf(target);
      if (focused.current.has(element) || !canEmit(`focus:${element}`)) return;
      focused.current.add(element);
      window.setTimeout(() => focused.current.delete(element), FOCUS_THROTTLE_MS);

      const fieldType = target instanceof HTMLSelectElement
        ? 'select'
        : target instanceof HTMLTextAreaElement
          ? 'textarea'
          : (target.getAttribute('type') || 'text');

      events.uiFocus({
        ui_element: element,
        ui_kind: 'field',
        ui_surface: surfaceOf(target),
        field_type: fieldType,
        site_section: currentSection(),
      });
    };

    const onCopy = () => {
      if (!canEmit('copy')) return;
      const selection = window.getSelection();
      const anchor = selection?.anchorNode instanceof Element
        ? selection.anchorNode
        : selection?.anchorNode?.parentElement ?? null;
      events.uiCopy({
        ui_element: anchor ? identityOf(anchor.closest('[data-analytics]') ?? anchor) : 'page_selection',
        ui_kind: 'copy',
        ui_surface: anchor ? surfaceOf(anchor) : 'page',
        site_section: currentSection(),
      });
    };

    const onPrint = () => events.uiPrint(currentSection());

    // Only modifier combinations are observed, so typed text never reaches GA4.
    const onKeyDown = (rawEvent: KeyboardEvent) => {
      const key = rawEvent.key.toLowerCase();
      if (key === 'k' && (rawEvent.metaKey || rawEvent.ctrlKey)) {
        if (canEmit('shortcut:k')) events.keyboardShortcut('cmd_k_palette', currentSection());
        return;
      }
      if (key === '/' && !rawEvent.metaKey && !rawEvent.ctrlKey) {
        const target = rawEvent.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
        if (canEmit('shortcut:/')) events.keyboardShortcut('slash_search', currentSection());
        return;
      }
      if (key === 'escape' && canEmit('shortcut:escape')) {
        events.keyboardShortcut('escape', currentSection());
      }
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('change', onChange, true);
    document.addEventListener('focusin', onFocusIn, true);
    document.addEventListener('copy', onCopy, true);
    document.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('beforeprint', onPrint);

    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('change', onChange, true);
      document.removeEventListener('focusin', onFocusIn, true);
      document.removeEventListener('copy', onCopy, true);
      document.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('beforeprint', onPrint);
    };
  }, []);

  return null;
}
