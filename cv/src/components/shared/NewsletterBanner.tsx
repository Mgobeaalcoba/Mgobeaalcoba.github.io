'use client';

import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewsletterBanner() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="glass border-t border-sky-500/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <button
          onClick={() => setClosed(true)}
          className="absolute top-0 right-4 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
              <Mail size={20} className="text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-100">{t('newsletter_title')}</h3>
              <p className="text-sm text-gray-400">{t('newsletter_sub')}</p>
            </div>
          </div>

          {submitted ? (
            <p className="text-sky-400 font-medium">¡Gracias! Te enviaremos el próximo número 🎉</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 flex-1 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter_placeholder')}
                className="flex-1 glass px-4 py-2 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-sky-500 border border-white/10"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                {t('newsletter_btn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
