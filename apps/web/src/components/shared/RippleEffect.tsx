'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleEffectProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function RippleEffect({ children, className = '', onClick }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      onClick?.();
    },
    [onClick]
  );

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute pointer-events-none rounded-full bg-white/20"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ width: 0, height: 0, opacity: 0.5, x: 0, y: 0 }}
            animate={{
              width: 300,
              height: 300,
              opacity: 0,
              x: -150,
              y: -150,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
