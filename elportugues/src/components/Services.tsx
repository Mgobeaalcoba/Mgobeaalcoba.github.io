'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Truck, Warehouse, Shield, CheckCircle2 } from 'lucide-react';
import { trackServiceView } from '@/lib/gtag';
import type { Services as ServicesData } from '@/services/contentService';
import type { TransportCategory, WarehouseCategory } from '@/types/content';

interface ServicesProps {
  data: ServicesData;
  transport: TransportCategory;
  warehouse: WarehouseCategory;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Services({ data, transport, warehouse }: ServicesProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="servicios" ref={ref} className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0CC1C1]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-8 bg-[#0CC1C1]" />
            <span className="section-label">{data.sectionLabel}</span>
            <div className="h-px w-8 bg-[#0CC1C1]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 max-w-2xl mx-auto leading-tight"
          >
            {data.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            {data.description}
          </motion.p>
        </div>

        {/* Transport Services Grid */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xl font-bold text-[#0CC1C1] mb-8 flex items-center gap-3"
          >
            <Truck size={20} />
            {transport.title}
          </motion.h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {transport.services.map((service) => (
              <motion.div
                key={service.number}
                variants={cardVariants}
                className="glass rounded-xl p-6 hover:border-[#0CC1C1]/40 hover:shadow-lg hover:shadow-cyan-accent/10 transition-all duration-300 cursor-default group"
                onMouseEnter={() => trackServiceView(service.title)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#0CC1C1]/20 to-[#2D4F8F]/20 border border-[#0CC1C1]/20 flex items-center justify-center group-hover:border-[#0CC1C1]/50 transition-colors">
                    <span className="text-[#0CC1C1] text-sm font-bold">{service.number}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 group-hover:text-[#0CC1C1] transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Warehouse Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="rounded-2xl overflow-hidden border border-[#0CC1C1]/20 bg-gradient-to-br from-[#0B1120] to-black"
        >
          <div className="grid lg:grid-cols-2">
            <div className="p-10">
              <div className="flex items-center gap-3 mb-4">
                <Warehouse size={20} className="text-[#0CC1C1]" />
                <h3 className="text-xl font-bold text-[#0CC1C1]">{warehouse.title}</h3>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-black gradient-text">{warehouse.highlight}</div>
                <div className="text-slate-400 text-sm">{warehouse.highlightLabel}</div>
              </div>
              <p className="text-slate-300 mb-8 leading-relaxed">{warehouse.description}</p>

              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Tipos de almacenaje</h4>
                <div className="flex flex-col gap-2">
                  {warehouse.types.map((type, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0CC1C1] flex-shrink-0" />
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 glass rounded-xl p-4">
                <Shield size={20} className="text-[#0CC1C1] flex-shrink-0" />
                <span className="text-sm text-slate-300">{warehouse.security}</span>
              </div>
            </div>

            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={warehouse.images[0]}
                alt="Depósito El Portugués"
                className="w-full h-64 lg:h-full object-cover opacity-40"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0B1120]/90" />
              <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Principales Servicios</h4>
                <div className="flex flex-col gap-2">
                  {warehouse.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle2 size={14} className="text-[#0CC1C1] flex-shrink-0 mt-0.5" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-4">{data.coverage.title}</h3>
          <p className="text-slate-400 max-w-2xl mx-auto mb-6">{data.coverage.description}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {data.coverage.regions.map((region) => (
              <span
                key={region}
                className="px-4 py-2 rounded-full glass text-sm text-[#0CC1C1] border border-[#0CC1C1]/20"
              >
                {region}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
