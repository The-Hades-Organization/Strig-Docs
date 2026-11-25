import { LINKS } from './links';
import { Mark, Wordmark } from './Mark';
import { ThemeToggle } from './ThemeToggle';

// The landing's header: the brand, three quiet links and one outlined button that jumps to Install.
export function LandingHeader({ installHref = '#install' }: { installHref?: string }) {
  return (
    <header className="landing-header">
      <a className="landing-brand" href="/" aria-label="Strig, home">
        <Mark size={28} />
        <Wordmark height={16} />
      </a>
      <nav className="landing-nav" aria-label="Main">
        <a href={LINKS.docs}>Docs</a>
        <a href={LINKS.playground}>Playground</a>
        <a href={LINKS.github}>GitHub</a>
        <a className="button" href={installHref}>
          Install
        </a>
      </nav>
      <ThemeToggle />
    </header>
  );
}
