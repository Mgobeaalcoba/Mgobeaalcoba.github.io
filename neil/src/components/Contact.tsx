'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Phone, Mail, MapPin, Store, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ContentRepository from '@/services/contentService';
import AutomationBadge from './AutomationBadge';
import { sendContactForm, sendQuoteRequest } from '@/services/webhookService';
import { trackLeadFormSent, trackContactAttempted, trackQuoteRequested, trackWhatsAppClick, trackCtaClick } from '@/lib/gtag';

const contact = ContentRepository.getContact();
const automations = ContentRepository.getAutomations();

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const { lang, t } = useLanguage();
  const [selectedType, setSelectedType] = useState('consulta');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', country: '', vehicle: '', product: '', message: '', type: 'consulta',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    trackContactAttempted(selectedType);

    const data = { ...form, type: selectedType, lang };
    const isQuote = selectedType === 'cotizacion';

    const ok = isQuote
      ? await sendQuoteRequest(data)
      : await sendContactForm(data);

    if (ok) {
      setStatus('success');
      trackLeadFormSent(selectedType, lang);
      if (isQuote) trackQuoteRequested(form.product, lang);
      setForm({ name: '', email: '', phone: '', country: '', vehicle: '', product: '', message: '', type: 'consulta' });
    } else {
      setStatus('error');
    }
  };

  const currentAutomation = selectedType === 'cotizacion'
    ? automations.quoteRequest
    : automations.contactLead;

  return (
    <section id="contacto" className="py-20 lg:py-28 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-accent text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t.contact.sectionLabel}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">{t.contact.title}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.contact.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8">
              {/* Form type + AutomationBadge */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-300 font-semibold">{t.contact.fields.type}</p>
                <AutomationBadge automation={currentAutomation} />
              </div>

              {/* Type selector */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {t.contact.formTypes.map(ft => (
                  <button
                    key={ft.id}
                    onClick={() => { setSelectedType(ft.id); setStatus('idle'); }}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                      selectedType === ft.id
                        ? 'bg-cyan-accent text-navy-950'
                        : 'bg-white/5 text-slate-400 border border-white/10 hover:border-cyan-accent/30'
                    }`}
                  >
                    {ft.label}
                  </button>
                ))}
              </div>

              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <CheckCircle className="text-cyan-accent" size={48} />
                  <p className="text-white font-semibold text-lg text-center">{t.contact.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1 block">{t.contact.fields.name}</label>
                      <input
                        name="name" required value={form.name} onChange={handleChange}
                        placeholder={t.contact.placeholders.name}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-accent/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1 block">{t.contact.fields.email}</label>
                      <input
                        name="email" type="email" required value={form.email} onChange={handleChange}
                        placeholder={t.contact.placeholders.email}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-accent/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1 block">{t.contact.fields.phone}</label>
                      <input
                        name="phone" value={form.phone} onChange={handleChange}
                        placeholder={t.contact.placeholders.phone}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-accent/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1 block">{t.contact.fields.country}</label>
                      <input
                        name="country" value={form.country} onChange={handleChange}
                        placeholder={t.contact.placeholders.country}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-accent/40 transition-colors"
                      />
                    </div>
                  </div>

                  {selectedType === 'cotizacion' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 text-xs font-medium mb-1 block">{t.contact.fields.vehicle}</label>
                        <input
                          name="vehicle" value={form.vehicle} onChange={handleChange}
                          placeholder={t.contact.placeholders.vehicle}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-accent/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs font-medium mb-1 block">{t.contact.fields.product}</label>
                        <input
                          name="product" value={form.product} onChange={handleChange}
                          placeholder={t.contact.placeholders.product}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-accent/40 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1 block">{t.contact.fields.message}</label>
                    <textarea
                      name="message" required value={form.message} onChange={handleChange}
                      placeholder={t.contact.placeholders.message}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-accent/40 transition-colors resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      {t.contact.error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 rounded-xl bg-cyan-accent text-navy-950 font-bold flex items-center justify-center gap-2 hover:bg-cyan-light transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    {status === 'sending' ? t.contact.sending : t.contact.cta}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Info panel — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* WhatsApp buttons */}
            <a
              href={contact.whatsapp.sales}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackWhatsAppClick('sales'); trackCtaClick('whatsapp_sales'); }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all group"
            >
              <MessageCircle className="text-green-400 flex-shrink-0" size={24} />
              <div>
                <p className="text-white font-semibold">{t.contact.whatsappSales}</p>
                <p className="text-slate-400 text-sm">{contact.phones[0]}</p>
              </div>
            </a>

            <a
              href={contact.whatsapp.support}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackWhatsAppClick('support'); trackCtaClick('whatsapp_support'); }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all"
            >
              <MessageCircle className="text-green-400 flex-shrink-0" size={24} />
              <div>
                <p className="text-white font-semibold">{t.contact.whatsappSupport}</p>
                <p className="text-slate-400 text-sm">{contact.phones[1]}</p>
              </div>
            </a>

            {/* Online store */}
            <a
              href={contact.store}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick('contact_store')}
              className="flex items-center gap-4 p-5 rounded-2xl bg-orange-neil/10 border border-orange-neil/30 hover:bg-orange-neil/20 transition-all"
            >
              <Store className="text-orange-neil flex-shrink-0" size={24} />
              <div>
                <p className="text-white font-semibold">{t.contact.storeLink}</p>
                <p className="text-slate-400 text-sm">neil.com.ar/tienda</p>
              </div>
            </a>

            {/* Contact info */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-cyan-accent flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-white text-sm font-semibold">{t.contact.addressTitle}</p>
                  <p className="text-slate-400 text-sm">{contact.location.fullAddress}</p>
                  <p className="text-slate-500 text-xs mt-1">{t.contact.schedule}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="text-cyan-accent flex-shrink-0 mt-0.5" size={18} />
                <div>
                  {contact.phones.map(p => (
                    <p key={p} className="text-slate-300 text-sm">{p}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="text-cyan-accent flex-shrink-0 mt-0.5" size={18} />
                <div>
                  {contact.emails.map(e => (
                    <a key={e} href={`mailto:${e}`} className="block text-slate-300 text-sm hover:text-cyan-accent transition-colors">{e}</a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
