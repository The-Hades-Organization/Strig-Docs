'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { useTheme } from './useTheme';

// A short recording of the real product, in a light and a dark variant
// (`<name>-light.webm`, `<name>-dark.webm`, `<posterName>-light.webp`, `<posterName>-dark.webp`).
// The video is not fetched until it is on screen, and only the active theme's file is. It plays on
// its own unless the visitor asks for reduced motion, and the button always pauses or resumes it.
export function Clip({ name, posterName, title, label }: { name: string; posterName: string; title: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const theme = useTheme();
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);
  const playingRef = useRef(false);
  playingRef.current = playing;

  useEffect(() => {
    const element = video.current;
    if (!element || !theme) return;
    const play = () => {
      element.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    };
    if (started.current) {
      // The theme changed after the clip had been shown: load the other file and keep the state.
      // Swapping the src already reset the element to paused, so the state we kept decides.
      element.load();
      if (playingRef.current) play();
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const watcher = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      started.current = true;
      watcher.disconnect();
      play();
    });
    watcher.observe(element);
    return () => watcher.disconnect();
  }, [theme]);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    started.current = true;
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
          <Icon name={playing ? 'pause-solid' : 'play-solid'} size={14} />
          <span>{playing ? 'Pause' : 'Play'}</span>
        </button>
      </figcaption>
      <video
        ref={video}
        className="clip-video"
        src={theme ? `${name}-${theme}.webm` : undefined}
        poster={theme ? `${posterName}-${theme}.webp` : undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      />
    </figure>
  );
}
