'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// Fades a block in once, when it first scrolls into view. Without JS or with
// reduced motion the block is simply there (the CSS only hides it while
// data-armed is set).
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'armed' | 'shown'>('idle');

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;
    setState('armed');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState('shown');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className={className} data-reveal={state === 'idle' ? undefined : state}>
      {children}
    </div>
  );
}
