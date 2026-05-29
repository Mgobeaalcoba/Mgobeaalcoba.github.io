'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface TimelineItem {
  date: string;
  title: string;
  subtitle: string;
  description: string;
  color?: string;
}

interface Timeline3DProps {
  items: TimelineItem[];
  lang: 'es' | 'en';
}

const COLORS = ['#38bdf8', '#818cf8', '#a78bfa', '#c084fc', '#e879f9'];

export default function Timeline3D({ items, lang }: Timeline3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div ref={containerRef} className="relative py-12">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
        <motion.div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(to bottom, #38bdf8, rgba(56,189,248,0.1))',
            transformOrigin: 'top',
          }}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Timeline items */}
      <div className="relative space-y-16">
        {items.map((item, idx) => {
          const isLeft = idx % 2 === 0;
          const color = item.color || COLORS[idx % COLORS.length];
          const isHovered = hoveredIdx === idx;

          return (
            <motion.div
              key={idx}
              className={`flex items-center gap-6 md:gap-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              initial={{ opacity: 0, x: isLeft ? -60 : 60, rotateY: isLeft ? -15 : 15 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0, rotateY: 0 }
                  : { opacity: 0, x: isLeft ? -60 : 60, rotateY: isLeft ? -15 : 15 }
              }
              transition={{
                duration: 0.7,
                delay: idx * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ perspective: 1000 }}
            >
              {/* Content card */}
              <motion.div
                className="w-5/12"
                animate={{
                  scale: isHovered ? 1.03 : 1,
                  z: isHovered ? 30 : 0,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div
                  className="glass rounded-2xl p-5 glow-border cursor-default"
                  style={{
                    borderColor: `${color}30`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${color}20`, color }}
                  >
                    {item.date}
                  </span>
                  <h3 className="text-lg font-bold text-gray-100 mt-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{item.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>

              {/* Center node */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  className="w-5 h-5 rounded-full border-2"
                  style={{
                    borderColor: color,
                    background: isHovered ? color : 'var(--bg)',
                    boxShadow: isHovered ? `0 0 20px ${color}60` : 'none',
                  }}
                  animate={{ scale: isHovered ? 1.4 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                />
                {/* Ring pulse */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: `2px solid ${color}` }}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Spacer for the other side */}
              <div className="w-5/12" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
