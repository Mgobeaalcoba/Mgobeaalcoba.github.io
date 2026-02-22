'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const INTRO_WORDS = [
  'Data & Analytics',
  'GenAI',
  'Automations',
  'Technical Leadership',
  'Python',
  'Cloud Computing',
  'Business Intelligence',
  'Software Engineering',
];

const INTRO_TOTAL_MS = 12000;
const TYPE_DELAY = 50;
const DELETE_DELAY = 28;
const HOLD_DELAY = 800;

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [displayText, setDisplayText] = useState('');
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  const exit = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setVisible(false);
    setTimeout(onComplete, 400);
  }, [onComplete]);

  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, ms));

    async function animate() {
      for (let wi = 0; wi < INTRO_WORDS.length; wi++) {
        if (cancelled || doneRef.current) break;
        const word = INTRO_WORDS[wi];

        // Type
        for (let i = 0; i <= word.length; i++) {
          if (cancelled || doneRef.current) return;
          setDisplayText(word.slice(0, i));
          await sleep(TYPE_DELAY);
        }

        await sleep(HOLD_DELAY);

        // Delete (skip for last word)
        if (wi < INTRO_WORDS.length - 1) {
          for (let i = word.length; i >= 0; i--) {
            if (cancelled || doneRef.current) return;
            setDisplayText(word.slice(0, i));
            await sleep(DELETE_DELAY);
          }
        }
      }
      // Auto exit after all words
      if (!cancelled && !doneRef.current) exit();
    }

    animate();

    // Progress bar
    const startTime = Date.now();
    const tick = setInterval(() => {
      if (doneRef.current) { clearInterval(tick); return; }
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / INTRO_TOTAL_MS) * 100, 100);
      setProgress(pct);
      if (elapsed >= INTRO_TOTAL_MS) {
        clearInterval(tick);
        exit();
      }
    }, 100);

    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, [exit]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{
        background: '#0a0e1a',
        transition: 'opacity 0.4s ease',
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Typing text */}
      <div className="relative text-center mb-10 px-8">
        <h1
          className="font-mono font-bold tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#e2e8f0',
            minHeight: '1.2em',
          }}
        >
          {displayText}
          <span
            style={{
              display: 'inline-block',
              width: '0.08em',
              height: '1em',
              background: '#38bdf8',
              marginLeft: '4px',
              verticalAlign: 'middle',
              animation: 'blink 1s step-end infinite',
            }}
          />
        </h1>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '280px',
          height: '3px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '99px',
          overflow: 'hidden',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
            borderRadius: '99px',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Enter button */}
      <button
        onClick={exit}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#38bdf8',
          fontSize: '1rem',
          fontFamily: 'monospace',
          cursor: 'pointer',
          letterSpacing: '0.05em',
          opacity: 0.8,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.opacity = '1'; }}
        onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.opacity = '0.8'; }}
      >
        Ingresar →
      </button>
    </div>
  );
}
