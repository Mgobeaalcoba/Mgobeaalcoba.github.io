'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Mail, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendContactForm, type ContactFormData } from '@/services/webhookService';
import { trackLeadFormSent } from '@/lib/gtag';
import type { Contact as ContactData, Automations } from '@/types/content';
import AutomationBadge from '@/components/AutomationBadge';

interface ContactProps {
  data: ContactData;
  automations: Automations;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const initialForm: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  type: '',
  message: '',
};

export default function Contact({ data, automations }: ContactProps) {
  const activeAutomation = (form: ContactFormData) =>
    form.type === 'Cotización de servicios' ? automations.quoteRequest : automations.contactLead;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await sendContactForm(form);
      trackLeadFormSent(form.type || 'general');
      setStatus('success');
      setForm(initialForm);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contacto" ref={ref} className="py-24 bg-black relative overflow-hidden">
      {/* Bottom radial glow */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0CC1C1]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-8 bg-[#0CC1C1]" />
            <span className="section-label">{data.sectionLabel}</span>
            <div className="h-px w-8 bg-[#0CC1C1]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            {data.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto"
          >
            {data.description}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Location */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0CC1C1]/10 border border-[#0CC1C1]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#0CC1C1]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Ubicación</h3>
                  <p className="text-slate-400 text-sm">{data.location.fullAddress}</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">{data.location.accessInfo}</p>
                  <a
                    href={data.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-xs text-[#0CC1C1] hover:underline"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Emails */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0CC1C1]/10 border border-[#0CC1C1]/20 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-[#0CC1C1]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">E-mail</h3>
                  {data.emails.map((email) => (
                    <div key={email.address} className="mb-1">
                      <span className="text-xs text-slate-500">{email.label}: </span>
                      <a
                        href={`mailto:${email.address}`}
                        className="text-sm text-slate-300 hover:text-[#0CC1C1] transition-colors"
                      >
                        {email.address}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0CC1C1]/10 border border-[#0CC1C1]/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-[#0CC1C1]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Teléfonos</h3>
                  {data.phones.map((phone) => (
                    <a
                      key={phone.number}
                      href={`tel:${phone.number.replace(/\s/g, '')}`}
                      className="block text-sm text-slate-300 hover:text-[#0CC1C1] transition-colors"
                    >
                      {phone.number}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Location strategic info */}
            <div className="glass rounded-2xl p-6 border border-[#2D4F8F]/30">
              <h3 className="text-white font-semibold mb-3 text-sm">Ubicación Estratégica</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0CC1C1] rounded-full" />
                  200m del Acceso Oeste
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0CC1C1] rounded-full" />
                  1km del Camino del Buen Ayre
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0CC1C1] rounded-full" />
                  Conexión directa Autopista Panamericana
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg">Formulario de Contacto</h3>
                <AutomationBadge automation={activeAutomation(form)} />
              </div>

              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 size={48} className="text-[#0CC1C1] mb-4" />
                  <h4 className="text-white font-bold text-xl mb-2">¡Mensaje enviado!</h4>
                  <p className="text-slate-400">Nos pondremos en contacto a la brevedad.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2 rounded-full border border-[#0CC1C1]/30 text-[#0CC1C1] text-sm hover:bg-[#0CC1C1]/10 transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-xs mb-1.5 font-medium">Nombre completo *</label>
                      <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Juan García"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#0CC1C1]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs mb-1.5 font-medium">E-mail *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="juan@empresa.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#0CC1C1]/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-xs mb-1.5 font-medium">Teléfono</label>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+54 11 xxxx-xxxx"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#0CC1C1]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs mb-1.5 font-medium">Empresa</label>
                      <input
                        name="company"
                        type="text"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Mi Empresa S.A."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#0CC1C1]/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5 font-medium">Tipo de mensaje *</label>
                    <select
                      name="type"
                      required
                      value={form.type}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0CC1C1]/50 transition-colors appearance-none"
                    >
                      <option value="" disabled className="bg-[#0B1120]">Seleccione el tipo de mensaje</option>
                      {data.formTypes.map((type) => (
                        <option key={type} value={type} className="bg-[#0B1120]">{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5 font-medium">Mensaje *</label>
                    <textarea
                      name="message"
                      required
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describa su consulta o necesidad logística..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#0CC1C1]/50 transition-colors resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      Hubo un error al enviar. Por favor intente nuevamente.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#0CC1C1] text-black font-bold text-sm hover:bg-[#14e8e8] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-accent/30 mt-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
