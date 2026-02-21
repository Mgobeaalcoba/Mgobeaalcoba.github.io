'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Heart, Star, type LucideProps } from 'lucide-react';
import type { Values as ValuesData } from '@/types/content';

interface ValuesProps {
  data: ValuesData;
}

type LucideIcon = React.FC<LucideProps>;
const iconMap: Record<string, LucideIcon> = {
  Zap: Zap as LucideIcon,
  Heart: Heart as LucideIcon,
  Star: Star as LucideIcon,
};

export default function Values({ data }: ValuesProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-[#0B1120] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2D4F8F]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
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

        <div className="grid md:grid-cols-3 gap-6">
          {data.items.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Star;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="relative glass rounded-2xl p-8 text-center hover:border-[#0CC1C1]/40 hover:shadow-xl hover:shadow-cyan-accent/10 transition-all duration-300 group"
              >
                {/* Number bg */}
                <div className="absolute top-6 right-6 text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                  {item.number}
                </div>

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0CC1C1]/20 to-[#2D4F8F]/20 border border-[#0CC1C1]/20 flex items-center justify-center mx-auto mb-6 group-hover:border-[#0CC1C1]/50 transition-colors">
                    <Icon size={24} className="text-[#0CC1C1]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
