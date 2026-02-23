'use client';

import { useState, useCallback, useRef } from 'react';
import { Bot, Trophy, AlertTriangle, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import type { AiModel } from '@/lib/queries';

type ModelPricing = AiModel;

type Result = {
  model: ModelPricing;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
};

const INFO_TABS = [
  { id: 'precios', labelEs: 'Precios por Modelo', labelEn: 'Model Pricing' },
  { id: 'tokens', labelEs: '¿Qué es un Token?', labelEn: 'What is a Token?' },
  { id: 'tips', labelEs: 'Tips de Optimización', labelEn: 'Optimization Tips' },
];

export default function TokenCalculator() {
  const { lang } = useLanguage();
  const { aiModels, loading } = useSupabaseData();
  const [text, setText] = useState('');
  const [outputRatio, setOutputRatio] = useState(1);
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState({ chars: 0, words: 0, tokens: 0 });
  const [calculated, setCalculated] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState('precios');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setText((ev.target?.result as string) || '');
    reader.readAsText(file, 'utf-8');
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setText((ev.target?.result as string) || '');
    reader.readAsText(file, 'utf-8');
  }, []);

  const calculate = useCallback(() => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const inputTokens = Math.ceil(chars / 4);
    const outputTokens = Math.ceil(inputTokens * outputRatio);

    setStats({ chars, words, tokens: inputTokens });

    const computed = aiModels.map((model) => {
      const inputCost = (inputTokens / 1_000_000) * model.inputPer1M;
      const outputCost = (outputTokens / 1_000_000) * model.outputPer1M;
      return {
        model,
        inputTokens,
        outputTokens,
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
      };
    }).sort((a, b) => a.totalCost - b.totalCost);

    setResults(computed);
    setCalculated(true);
  }, [text, outputRatio]);

  const fmt = (n: number): string => {
    if (n === 0) return 'USD $0.00';
    // Determine decimal places to show at least 3 significant digits
    const mag = Math.floor(Math.log10(n));
    const decimals = Math.min(Math.max(2 - mag, 2), 8);
    return `USD $${n.toFixed(decimals)}`;
  };

  const minCost = results.length > 0 ? results[0].totalCost : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Bot size={28} className="text-purple-400" />
          <div>
            <h3 className="text-lg font-bold">
              {lang === 'es' ? 'Calculadora de Tokens GenAI' : 'GenAI Token Calculator'}
            </h3>
            <p className="text-sm text-gray-400">
              {lang === 'es'
                ? 'Compare costos en OpenAI, Claude, Gemini y xAI'
                : 'Compare costs across OpenAI, Claude, Gemini and xAI'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-amber-900/30 border border-amber-800/50 rounded-lg p-3">
          <AlertTriangle size={14} className="text-amber-300 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-300">
            {lang === 'es'
              ? 'Estimación basada en ~4 caracteres/token. Todos los precios en USD. El conteo real varía según modelo. Precios a Feb 2026. No incluye caching ni descuentos por volumen.'
              : 'Estimate based on ~4 chars/token. All prices in USD. Real count varies by model. Prices as of Feb 2026. Does not include caching or volume discounts.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h4 className="font-semibold text-gray-200">
            1. {lang === 'es' ? 'Ingrese su texto' : 'Enter your text'}
          </h4>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${isDragging ? 'border-purple-400 bg-purple-500/10' : 'border-white/10 hover:border-purple-400/40'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} className="text-gray-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">{lang === 'es' ? 'Drag & drop de archivo .txt o PDF' : 'Drag & drop .txt or PDF file'}</p>
            <input ref={fileInputRef} type="file" accept=".txt,.md,.csv,.json" className="hidden" onChange={handleFileSelect} />
          </div>
          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-sky-500/50 resize-none"
            placeholder={lang === 'es' ? 'Pegue aquí el texto que desea analizar...' : 'Paste the text you want to analyze here...'}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {lang === 'es' ? 'Ratio de tokens de output' : 'Output token ratio'}
              <span className="ml-2 text-sky-400 font-bold">{outputRatio}x</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.5}
              value={outputRatio}
              onChange={(e) => setOutputRatio(parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'es'
                ? '0.5x = respuesta corta, 3x = respuesta muy larga'
                : '0.5x = short reply, 3x = very long reply'}
            </p>
          </div>

          <button
            onClick={calculate}
            disabled={!text.trim()}
            className="w-full py-3 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Bot size={16} />
            {lang === 'es' ? 'Calcular Costos' : 'Calculate Costs'}
          </button>
        </div>

        {/* Results panel */}
        <div className="glass rounded-2xl p-5">
          <h4 className="font-semibold text-gray-200 mb-4">
            2. {lang === 'es' ? 'Análisis y Costos' : 'Analysis & Costs'}
          </h4>

          {calculated ? (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: lang === 'es' ? 'Caracteres' : 'Characters', value: stats.chars.toLocaleString(), color: 'text-blue-400' },
                  { label: lang === 'es' ? 'Palabras' : 'Words', value: stats.words.toLocaleString(), color: 'text-green-400' },
                  { label: 'Tokens (est.)', value: stats.tokens.toLocaleString(), color: 'text-amber-400' },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Best option */}
              {results.length > 0 && (
                <div className="flex items-center gap-2 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3">
                  <Trophy size={16} className="text-yellow-400" />
                  <span className="text-sm text-yellow-300">
                    {lang === 'es' ? 'Más económico:' : 'Most economical:'}
                  </span>
                  <span className="font-bold text-yellow-200">{results[0].model.name}</span>
                  <span className="text-sm text-yellow-400 ml-auto">{fmt(results[0].totalCost)}</span>
                </div>
              )}

              {/* Results table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-gray-400">{lang === 'es' ? 'Modelo' : 'Model'}</th>
                      <th className="text-right py-2 text-gray-400">{lang === 'es' ? 'Input (USD)' : 'Input (USD)'}</th>
                      <th className="text-right py-2 text-gray-400">{lang === 'es' ? 'Output (USD)' : 'Output (USD)'}</th>
                      <th className="text-right py-2 text-gray-400">{lang === 'es' ? 'Total (USD)' : 'Total (USD)'}</th>
                      <th className="text-right py-2 text-gray-400">vs Min</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className={`border-b border-white/5 ${i === 0 ? 'bg-yellow-900/10' : ''}`}>
                        <td className="py-2">
                          <span className={`font-medium ${r.model.color}`}>{r.model.name}</span>
                          <br />
                          <span className="text-gray-500">{r.model.provider}</span>
                        </td>
                        <td className="text-right py-2 text-gray-300">{fmt(r.inputCost)}</td>
                        <td className="text-right py-2 text-gray-300">{fmt(r.outputCost)}</td>
                        <td className="text-right py-2 font-bold text-gray-100">{fmt(r.totalCost)}</td>
                        <td className="text-right py-2">
                          {i === 0 ? (
                            <span className="text-green-400">BASE</span>
                          ) : (
                            <span className="text-red-400">
                              +{((r.totalCost / minCost - 1) * 100).toFixed(0)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bot size={48} className="mb-3 opacity-30" />
              <p className="text-sm">
                {lang === 'es' ? 'Ingrese texto y calcule para ver los costos' : 'Enter text and calculate to see costs'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Tabs */}
      <div className="glass rounded-2xl p-5">
        <div className="flex gap-2 mb-4 border-b border-white/10 pb-3 flex-wrap">
          {INFO_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveInfoTab(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${activeInfoTab === tab.id ? 'bg-purple-500 text-white' : 'glass text-gray-400 hover:text-white'}`}
            >
              {lang === 'es' ? tab.labelEs : tab.labelEn}
            </button>
          ))}
        </div>

        {activeInfoTab === 'precios' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-gray-400">{lang === 'es' ? 'Modelo' : 'Model'}</th>
                  <th className="text-right py-2 text-gray-400">{lang === 'es' ? 'Input USD / 1M tokens' : 'Input USD / 1M tokens'}</th>
                  <th className="text-right py-2 text-gray-400">{lang === 'es' ? 'Output USD / 1M tokens' : 'Output USD / 1M tokens'}</th>
                </tr>
              </thead>
              <tbody>
                {aiModels.map((m) => (
                  <tr key={m.name} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-1.5"><span className={`font-medium ${m.color}`}>{m.name}</span><br /><span className="text-gray-500">{m.provider}</span></td>
                    <td className="text-right py-1.5 text-gray-300">USD ${m.inputPer1M.toFixed(m.inputPer1M < 1 ? 3 : 2)}</td>
                    <td className="text-right py-1.5 text-gray-300">USD ${m.outputPer1M.toFixed(m.outputPer1M < 1 ? 3 : 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeInfoTab === 'tokens' && (
          <div className="space-y-3 text-sm text-gray-400">
            <p>{lang === 'es' ? 'Un token es la unidad básica de texto que procesan los modelos de IA. Equivale aproximadamente a:' : 'A token is the basic unit of text that AI models process. It roughly equals:'}</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>{lang === 'es' ? '4 caracteres en inglés (palabras cortas = 1 token)' : '4 characters in English (short words = 1 token)'}</li>
              <li>{lang === 'es' ? '3-3.5 caracteres en español/portugués' : '3-3.5 characters in Spanish/Portuguese'}</li>
              <li>{lang === 'es' ? '100 tokens ≈ 75 palabras en inglés' : '100 tokens ≈ 75 words in English'}</li>
              <li>{lang === 'es' ? '1 página A4 ≈ 500-700 tokens' : '1 A4 page ≈ 500-700 tokens'}</li>
            </ul>
            <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3">
              <p className="text-sky-300 text-xs">{lang === 'es' ? '💡 Tip: Los tokens se cobran tanto en el input (tu prompt) como en el output (la respuesta del modelo).' : '💡 Tip: Tokens are charged for both input (your prompt) and output (the model\'s response).'}</p>
            </div>
          </div>
        )}

        {activeInfoTab === 'tips' && (
          <div className="space-y-3">
            {[
              { es: '🎯 Sé específico en tus prompts', en: '🎯 Be specific in your prompts', desc: { es: 'Prompts cortos y precisos ahorran tokens de input significativamente.', en: 'Short, precise prompts save significant input tokens.' } },
              { es: '🔄 Reutiliza contexto con caching', en: '🔄 Reuse context with caching', desc: { es: 'GPT y Claude ofrecen prompt caching para contextos repetidos, reduciendo costos hasta 90%.', en: 'GPT and Claude offer prompt caching for repeated contexts, reducing costs by up to 90%.' } },
              { es: '📦 Elige el modelo correcto', en: '📦 Choose the right model', desc: { es: 'Para tareas simples, usa modelos Flash/Mini. GPT-4o para razonamiento complejo.', en: 'For simple tasks, use Flash/Mini models. GPT-4o for complex reasoning.' } },
              { es: '📋 Limita el output con instrucciones', en: '📋 Limit output with instructions', desc: { es: 'Especifica un límite de palabras o formato conciso en tu prompt.', en: 'Specify a word limit or concise format in your prompt.' } },
            ].map((tip) => (
              <div key={tip.es} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-200">{tip[lang === 'es' ? 'es' : 'en']}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tip.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
