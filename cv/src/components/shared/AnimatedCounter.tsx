'use client';

import { useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  delay?: number;
  ease?: number;
}

export default function AnimatedCounter({
  from = 0,
  to,
  prefix = '',
  decimals = 0,
  delay = 0,
  ease = 80,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(from);
  const motionValue = useMotionValue(from);
  const spring = useSpring(motionValue, { stiffness: ease, damping: 20 });

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      setDisplay(v);
    });
    return unsubscribe;
  }, [spring]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      motionValue.set(to);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [to, delay, motionValue]);

  const formatted = (() => {
    if (decimals === 0 && to > 100) {
      if (display >= 1000) return `${Math.round(display / 1000)}k`;
      return `${Math.round(display)}`;
    }
    return display.toFixed(decimals);
  })();

  return <>{prefix}{formatted}</>;
}
