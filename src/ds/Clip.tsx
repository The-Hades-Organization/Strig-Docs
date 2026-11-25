'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { useTheme } from './useTheme';

function playFrom(element: HTMLVideoElement, report: (playing: boolean) => void) {
  element.play().then(
    () => report(true),
    () => report(false),
  );
}

// A short recording of the real product, in a light and a dark variant
// (`<name>-light.webm`, `<name>-dark.webm`, `<posterName>-light.webp`, `<posterName>-dark.webp`).
// The frame keeps its size in every state: while the theme is not known yet it says it is loading,
// and if the file fails it says so and links to `fallbackHref`. The video is not fetched until it is
// on screen, and only the active theme's file is. It plays on its own unless the visitor asks for
// reduced motion; then it starts paused on the poster. The button always pauses or resumes it.
export function Clip({
  name,
  posterName,
  title,
  label,
  fallbackHref,
  fallbackLabel,
}: {
  name: string;
  posterName: string;
  title: string;
  label: string;
  fallbackHref?: string;
  fallbackLabel?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const theme = useTheme();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const started = useRef(false);
  const playingRef = useRef(false);

  // The ref mirrors the state for the theme effect, which must not re-run when playback changes.
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const element = video.current;
    if (!element || !theme) return;
    if (started.current) {
      // The theme changed after the clip had been shown: load the other file and keep the state.
      // Swapping the src already reset the element to paused, so the state we kept decides.
      element.load();
      if (playingRef.current) playFrom(element, setPlaying);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const watcher = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      started.current = true;
      watcher.disconnect();
      playFrom(element, setPlaying);
    });
    watcher.observe(element);
    return () => watcher.disconnect();
  }, [theme]);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    started.current = true;
    if (element.paused) {
      playFrom(element, setPlaying);
    } else {
      element.pause();
      setPlaying(false);
    }
  };

  const ready = theme !== null && !failed;

  return (
    <figure className="clip">
      <figcaption className="clip-bar">
        <span className="clip-title">{title}</span>
        {ready ? (
          <button type="button" className="button clip-toggle" onClick={toggle}>
            <Icon name={playing ? 'pause-solid' : 'play-solid'} size={14} />
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>
        ) : null}
      </figcaption>
      <div className="clip-frame">
        {failed ? (
          <div className="clip-wait" data-state="failed">
            <Icon name="circle-alert" size={20} />
            <p>The recording didn’t load.</p>
            {fallbackHref ? <a href={fallbackHref}>{fallbackLabel ?? fallbackHref}</a> : null}
          </div>
        ) : theme ? (
          <video
            ref={video}
            className="clip-video"
            src={`${name}-${theme}.webm`}
            poster={`${posterName}-${theme}.webp`}
            muted
            loop
            playsInline
            preload="none"
            aria-label={label}
            onError={() => {
              setPlaying(false);
              setFailed(true);
            }}
          />
        ) : (
          <div className="clip-wait" data-state="loading">
            <p className="clip-wait-text">Loading the recording</p>
            <noscript>
              <img src={`${posterName}-light.webp`} alt={label} width={1280} height={760} />
            </noscript>
          </div>
        )}
      </div>
    </figure>
  );
}
