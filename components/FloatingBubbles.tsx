'use client';

import { useEffect, useRef, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  floatDuration: string;
  floatDelay: string;
}

const COLORS = [
  '#FF69B4', '#9370DB', '#3CB371', '#FFA500',
  '#4682B4', '#DA70D6', '#DAA520', '#20B2AA',
];

const BUBBLE_COUNT = 35;

let nextId = 0;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pickColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createBubble(overrides?: Partial<Bubble>): Bubble {
  const size = randomBetween(4, 28);
  return {
    id: nextId++,
    x: randomBetween(2, 98),
    y: randomBetween(5, 95),
    size,
    opacity: randomBetween(0.5, 0.85),
    color: pickColor(),
    floatDuration: `${randomBetween(12, 25)}s`,
    floatDelay: `${randomBetween(0, 8)}s`,
    ...overrides,
  };
}

export default function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initial: Bubble[] = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      initial.push(createBubble());
    }
    setBubbles(initial);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const children = container.children as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        const elX = parseFloat(el.style.left) / 100 * window.innerWidth + el.offsetWidth / 2;
        const elY = parseFloat(el.style.top) / 100 * window.innerHeight + el.offsetHeight / 2;
        const dx = elX - e.clientX;
        const dy = elY - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100 && dist > 0) {
          const push = (1 - dist / 100) * 15;
          el.style.transform = `translate(${(dx / dist) * push}px, ${(dy / dist) * push}px)`;
        } else {
          el.style.transform = '';
        }
      }
    };

    const onMouseLeave = () => {
      const children = container.children as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < children.length; i++) {
        children[i].style.transform = '';
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [bubbles]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble bubble-float"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.x}%`,
            top: `${b.y}%`,
            opacity: b.opacity,
            '--float-duration': b.floatDuration,
            '--float-delay': b.floatDelay,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 25%, ${b.color}aa 60%, ${b.color}55 100%)`,
            boxShadow: `0 0 ${b.size}px ${b.color}bb, 0 0 ${b.size * 2}px ${b.color}60, inset 0 0 ${b.size * 0.5}px rgba(255,255,255,0.6)`,
            border: `1.5px solid rgba(255,255,255,0.6)`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
