'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ContentRepository from '@/services/contentService';

const brand = ContentRepository.getBrand();
const contact = ContentRepository.getContact();

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-950 border-t border-white/5 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src={brand.logo}
              alt="Neil Climatizadores"
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-slate-500 text-sm leading-relaxed">{t.footer.tagline}</p>
            <div className="flex items-center gap-3 mt-4">
              <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all">
                <Facebook size={16} />
              </a>
              <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all">
                <Instagram size={16} />
              </a>
              <a href={contact.social.youtube} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Products nav */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">{t.nav.products}</p>
            <ul className="space-y-2">
              {['Climatizadores', 'Aire Acondicionado', 'Calderas', 'Energía & Solar', 'Accesorios'].map(item => (
                <li key={item}>
                  <a href="#productos" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">{t.nav.about}</p>
            <ul className="space-y-2">
              <li><a href={t.footer.linkPrivacy} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{t.footer.linkPrivacy}</a></li>
              <li><a href={t.footer.linkTerms} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{t.footer.linkTerms}</a></li>
              <li><a href={t.footer.linkDealers} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{t.footer.linkDealers}</a></li>
              <li><a href={t.footer.linkSupport} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{t.footer.linkSupport}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">{t.footer.contactTitle}</p>
            <div className="space-y-2">
              {contact.emails.map(email => (
                <a key={email} href={`mailto:${email}`} className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">{email}</a>
              ))}
              {contact.phones.map(phone => (
                <p key={phone} className="text-slate-500 text-sm">{phone}</p>
              ))}
              <p className="text-slate-600 text-xs mt-2">{contact.location.fullAddress}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">{t.footer.copyright}</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-pulse" />
            <span className="text-slate-600 text-xs">Patente AR-031005B1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
