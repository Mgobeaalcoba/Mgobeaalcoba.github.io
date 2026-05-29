'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = -200;
    let mouseY = -200;
    let currentX = -200;
    let currentY = -200;
    let rafId: number;

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      clearTimeout(timeoutRef.current);
      glow.style.opacity = '1';

      timeoutRef.current = setTimeout(() => {
        glow.style.opacity = '0';
      }, 2000);
    };

    const onLeave = () => {
      glow.style.opacity = '0';
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      if (glow) {
        glow.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouse);
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouse);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-[9998]"
      style={{
        width: 300,
        height: 300,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(56,189,248,0.10) 0%, rgba(56,189,248,0.04) 40%, transparent 70%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        willChange: 'transform',
      }}
    />
  );
}
