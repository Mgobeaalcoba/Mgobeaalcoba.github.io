'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** Comando de terminal con botón de copiar. */
export default function CopyCommand({ command, label }: { command: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* el navegador puede bloquear el portapapeles: el texto sigue seleccionable */
    }
  }

  return (
    <div className="signal-iar-code">
      {label ? <span className="signal-iar-code__label">{label}</span> : null}
      <code>
        <span aria-hidden="true">$ </span>
        {command}
      </code>
      <button type="button" onClick={copy} aria-label={copied ? 'Copiado' : `Copiar: ${command}`} data-analytics="iar_copy_command">
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span>{copied ? 'Copiado' : 'Copiar'}</span>
      </button>
    </div>
  );
}
