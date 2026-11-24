'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';

// A short recording of the real product. It plays on its own unless the visitor
// asks for reduced motion, and the button always pauses or resumes it.
export function Clip({ src, poster, title, label }: { src: string; poster: string; title: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) return;
    element.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      element.play().then(() => setPlaying(true), () => setPlaying(false));
    } else {
      element.pause();
      setPlaying(false);
    }
  };

  return (
    <figure className="clip">
      <figcaption className="clip-bar">
        <span className="clip-title">{title}</span>
        <button type="button" className="clip-toggle" onClick={toggle} aria-pressed={playing}>
          <Icon name={playing ? 'pause' : 'play'} size={14} />
          <span>{playing ? 'Pause' : 'Play'}</span>
        </button>
      </figcaption>
      <video ref={video} className="clip-video" src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} />
    </figure>
  );
}
