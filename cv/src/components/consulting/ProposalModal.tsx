'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, MessageCircle, Mail, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/gtag';

const WEBHOOK_URL = 'https://mgobeaalcoba.app.n8n.cloud/webhook/recibir-email';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INDUSTRIES = {
  es: [
    'Seleccionar industria...',
    'Comercio / Retail',
    'Gastronomía / Hotelería',
    'Salud / Medicina',
    'Construcción / Inmobiliaria',
    'Logística / Transporte',
    'Servicios Profesionales',
    'Manufactura / Industria',
    'Educación',
    'Tecnología',
    'Otro',
  ],
  en: [
    'Select industry...',
    'Commerce / Retail',
    'Gastronomy / Hospitality',
    'Health / Medicine',
    'Construction / Real Estate',
    'Logistics / Transport',
    'Professional Services',
    'Manufacturing / Industry',
    'Education',
    'Technology',
    'Other',
  ],
};

export default function ProposalModal({ isOpen, onClose }: ProposalModalProps) {
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    problem: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.industry || !form.problem || loading) return;

    setLoading(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          company: form.company || '',
          industry: form.industry,
          problem: form.problem,
          source: 'cv-site-proposal',
          page: typeof window !== 'undefined' ? window.location.pathname : '/consulting',
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          language: lang,
        }),
        signal: AbortSignal.timeout(10000),
      });
      events.leadFormSent('consulting');
    } catch {
      // Graceful handling: proceed to success state even on network error
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: '', email: '', company: '', industry: '', problem: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative glass rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <div className="mb-5">
                  <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    🎁 {lang === 'es' ? 'OFERTA EXCLUSIVA' : 'EXCLUSIVE OFFER'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-100">
                    {lang === 'es' ? 'Solicitar Mi Automatización Gratis' : 'Request My Free Automation'}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {lang === 'es'
                      ? 'Sin tarjeta de crédito • Sin compromiso • Respuesta en 24 hs'
                      : 'No credit card • No commitment • Response within 24 hrs'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        {lang === 'es' ? 'Nombre *' : 'Name *'}
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={lang === 'es' ? 'Juan García' : 'John Smith'}
                        className="w-full glass px-3 py-2 rounded-xl text-gray-200 border border-white/10 focus:border-green-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Email *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="juan@empresa.com"
                        className="w-full glass px-3 py-2 rounded-xl text-gray-200 border border-white/10 focus:border-green-500 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      {lang === 'es' ? 'Empresa (opcional)' : 'Company (optional)'}
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder={lang === 'es' ? 'Mi Empresa S.A.' : 'My Company Inc.'}
                      className="w-full glass px-3 py-2 rounded-xl text-gray-200 border border-white/10 focus:border-green-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      {lang === 'es' ? 'Industria *' : 'Industry *'}
                    </label>
                    <select
                      required
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                      className="w-full glass px-3 py-2 rounded-xl text-gray-200 border border-white/10 focus:border-green-500 focus:outline-none text-sm bg-gray-800"
                    >
                      {INDUSTRIES[lang].map((opt, i) => (
                        <option key={i} value={i === 0 ? '' : opt} disabled={i === 0}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      {lang === 'es' ? 'Proceso o problema a automatizar *' : 'Process or problem to automate *'}
                    </label>
                    <textarea
                      required
                      value={form.problem}
                      onChange={(e) => setForm({ ...form, problem: e.target.value })}
                      rows={4}
                      placeholder={
                        lang === 'es'
                          ? 'Ej: Llevamos el control de inventario manualmente en Excel y tardamos 3 horas por semana...'
                          : 'Eg: We manage inventory manually in Excel and it takes 3 hours per week...'
                      }
                      className="w-full glass px-3 py-2 rounded-xl text-gray-200 border border-white/10 focus:border-green-500 focus:outline-none text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {loading
                      ? (lang === 'es' ? 'Enviando...' : 'Sending...')
                      : (lang === 'es' ? 'Solicitar Automatización Gratis' : 'Request Free Automation')}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  {lang === 'es' ? '¡Solicitud enviada!' : 'Request sent!'}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {lang === 'es'
                    ? 'Mariano revisará tu propuesta y se pondrá en contacto dentro de las próximas 24 horas.'
                    : 'Mariano will review your proposal and get in touch within the next 24 hours.'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://wa.me/5491127475569?text=Hola%20Mariano!%20Acabo%20de%20enviar%20mi%20solicitud%20de%20automatizaci%C3%B3n%20gratis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition-all text-sm"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                  <a
                    href="mailto:gobeamariano@gmail.com"
                    className="flex items-center justify-center gap-2 glass border border-white/20 text-gray-300 hover:text-white font-semibold py-3 rounded-xl transition-all text-sm"
                  >
                    <Mail size={16} />
                    Email
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
