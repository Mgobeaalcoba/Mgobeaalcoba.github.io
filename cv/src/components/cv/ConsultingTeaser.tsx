'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ConsultingTeaser() {
  const { lang } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
    >
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-white/10">
          {lang === 'es' ? 'Consultoría para Empresas' : 'Business Consulting'}
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          {lang === 'es'
            ? 'Aplico mi experiencia en datos y tecnología para ayudar a pymes a optimizar operaciones, reducir costos y crecer. Descubra cómo la automatización, la IA y el Business Intelligence pueden transformar su negocio.'
            : 'I apply my expertise in data and technology to help SMBs optimize operations, reduce costs, and grow. Discover how automation, AI, and Business Intelligence can transform your business.'}
        </p>
        <Link
          href="/consulting/"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02]"
        >
          <Briefcase size={18} />
          {lang === 'es' ? 'Conocer mis Servicios' : 'Learn About My Services'}
        </Link>
      </div>
    </motion.section>
  );
}
