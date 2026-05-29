'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  onClick?: () => void;
}

export default function MagneticCard({
  children,
  className = '',
  intensity = 8,
  onClick,
}: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-intensity, intensity]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      <div style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
}
