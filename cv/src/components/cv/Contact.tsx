'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Calendar, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/gtag';
import CalendlyButton from '@/components/shared/CalendlyButton';

const WEBHOOK_URL = 'https://mgobeaalcoba.app.n8n.cloud/webhook/recibir-email';

export default function Contact() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const handleFirstFocus = () => {
    if (!started) {
      setStarted(true);
      events.contactFormStart('cv');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          source: 'cv-portfolio-contact',
          form_type: 'contact_portfolio',
          page: typeof window !== 'undefined' ? window.location.pathname : '/',
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          language: typeof document !== 'undefined' ? document.documentElement.lang : 'es',
        }),
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      // Show success even on network error to avoid user frustration
    } finally {
      setLoading(false);
      events.leadFormSent('cv', 'contact_portfolio');
      setSent(true);
    }
  };

  return (
    <section id="contact" data-section="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('contact_title')}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: <Mail size={18} />, label: 'gobeamariano@gmail.com', href: 'mailto:gobeamariano@gmail.com' },
              { icon: <Phone size={18} />, label: '+54 9 11 27475569', href: 'tel:+5491127475569' },
              { icon: <MapPin size={18} />, label: 'Buenos Aires, Argentina', href: null },
              { icon: <Linkedin size={18} />, label: 'linkedin.com/in/mariano-gobea-alcoba', href: 'https://www.linkedin.com/in/mariano-gobea-alcoba/' },
              { icon: <Github size={18} />, label: 'github.com/Mgobeaalcoba', href: 'https://github.com/Mgobeaalcoba' },
            ].map(({ icon, label, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-4 flex items-center gap-3 glow-border"
              >
                <div className="text-sky-400 shrink-0">{icon}</div>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-sky-400 transition-colors text-sm truncate"
                  >
                    {label}
                  </a>
                ) : (
                  <span className="text-gray-300 text-sm">{label}</span>
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <CalendlyButton className="flex items-center gap-3 px-6 py-4 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400 hover:bg-sky-500/20 transition-all font-medium w-full">
                <Calendar size={18} />
                Agenda una reunión conmigo →
              </CalendlyButton>
            </motion.div>
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 glow-border"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                <div className="text-4xl">✅</div>
                <p className="text-gray-200 font-medium text-center">
                  ¡Gracias! Te respondo en menos de 24hs.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">{t('contact_name')}</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={handleFirstFocus}
                    className="w-full glass px-4 py-2.5 rounded-lg text-sm text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">{t('contact_email')}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={handleFirstFocus}
                    className="w-full glass px-4 py-2.5 rounded-lg text-sm text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">{t('contact_message')}</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={handleFirstFocus}
                    rows={4}
                    className="w-full glass px-4 py-2.5 rounded-lg text-sm text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none transition-colors resize-none"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-medium transition-all text-sm disabled:opacity-70"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  {t('contact_send')}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
