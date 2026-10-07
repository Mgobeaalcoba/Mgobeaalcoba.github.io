'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** Terminal command with a copy button. The button labels follow the page language. */
export default function CopyCommand({ command, label, lang = 'es' }: { command: string; label?: string; lang?: 'es' | 'en' }) {
  const copyLabel = lang === 'es' ? 'Copiar' : 'Copy';
  const copiedLabel = lang === 'es' ? 'Copiado' : 'Copied';
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* the browser may block the clipboard: the text stays selectable */
    }
  }

  return (
    <div className="signal-iar-code">
      {label ? <span className="signal-iar-code__label">{label}</span> : null}
      <code>
        <span aria-hidden="true">$ </span>
        {command}
      </code>
      <button type="button" onClick={copy} aria-label={copied ? copiedLabel : `${copyLabel}: ${command}`} data-analytics="iar_copy_command">
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span>{copied ? copiedLabel : copyLabel}</span>
      </button>
    </div>
  );
}
