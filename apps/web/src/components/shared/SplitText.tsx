'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export default function SplitText({
  text,
  className = '',
  as: Tag = 'h2',
  delay = 0,
  stagger = 0.03,
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px' });

  const words = text.split(' ');
  const MotionTag = motion[Tag as keyof typeof motion] as React.ElementType;

  return (
    <MotionTag ref={ref} className={className} style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingRight: '0.25em' }}>
          <motion.span
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            initial={{ y: '100%', opacity: 0.3 }}
            animate={
              isInView
                ? { y: 0, opacity: 1 }
                : { y: '100%', opacity: 0.3 }
            }
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
