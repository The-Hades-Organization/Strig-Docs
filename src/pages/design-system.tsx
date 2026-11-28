import type { CSSProperties } from 'react';
import { ComponentSheet } from '../ds/ComponentSheet';
import { Shell } from '../ds/Shell';
import {
  BREAKPOINT_TOKENS,
  COLOR_TOKENS,
  DURATION_TOKENS,
  LAYER_TOKENS,
  RADIUS_TOKENS,
  SHADOW_TOKENS,
  SPACE_TOKENS,
  TYPE_SIZE_TOKENS,
} from '../ds/tokens-data';
import { source } from '@/lib/source';

const THEMES = ['light', 'dark'] as const;

function ColorSwatches() {
  return (
    <div className="ds-pair">
      {THEMES.map((theme) => (
        <div className="ds-panel" data-theme={theme} key={theme}>
          <p className="ds-panel-name">{theme}</p>
          <div className="ds-swatches">
            {COLOR_TOKENS.map((token) => (
              <div className="ds-swatch" key={token.name}>
                <span className="ds-swatch-chip" style={{ background: `var(${token.name})` }} />
                <code>{token.name}</code>
                <span>{token.role}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function row(label: string, preview: CSSProperties | null, key: string) {
  return (
    <div className="ds-scale-row" key={key}>
      <code>{label}</code>
      {preview ? <span style={preview} /> : null}
    </div>
  );
}

function ScaleTables() {
  return (
    <>
      <h3>Type</h3>
      <div className="ds-scale">
        <div className="ds-scale-row">
          <code>--f-ui</code>
          <span style={{ fontFamily: 'var(--f-ui)', fontSize: 'var(--t-lg)' }}>Strig decides without looking at who is asking.</span>
        </div>
        <div className="ds-scale-row">
          <code>--f-mono</code>
          <span style={{ fontFamily: 'var(--f-mono)' }}>document.edit depends_on document.view</span>
        </div>
        {TYPE_SIZE_TOKENS.map((name) => (
          <div className="ds-scale-row" key={name}>
            <code>{name}</code>
            <span style={{ fontSize: `var(${name})`, lineHeight: 'var(--lh-tight)' }}>Sample line</span>
          </div>
        ))}
      </div>

      <h3>Space</h3>
      <div className="ds-scale">
        {SPACE_TOKENS.map((name) => (
          <div className="ds-scale-row" key={name}>
            <code>{name}</code>
            <span className="ds-space-bar" style={{ width: `var(${name})` }} />
          </div>
        ))}
      </div>

      <h3>Radius</h3>
      <div className="ds-scale">
        {RADIUS_TOKENS.map((name) => (
          <div className="ds-scale-row" key={name}>
            <code>{name}</code>
            <span className="ds-radius-box" style={{ borderRadius: `var(${name})` }} />
          </div>
        ))}
      </div>

      <h3>Shadow</h3>
      <div className="ds-scale">
        {SHADOW_TOKENS.map((name) => (
          <div className="ds-scale-row" key={name}>
            <code>{name}</code>
            <span className="ds-shadow-box" style={{ boxShadow: `var(${name})` }} />
          </div>
        ))}
      </div>

      <h3>Motion</h3>
      <p className="ds-note">Hover a row. The curve is --ease for all three durations.</p>
      <div className="ds-scale">
        {DURATION_TOKENS.map((name) => (
          <div className="ds-scale-row ds-motion" key={name}>
            <code>{name}</code>
            <span className="ds-motion-dot" style={{ transitionDuration: `var(${name})` }} />
          </div>
        ))}
      </div>

      <h3>Layers and breakpoints</h3>
      <div className="ds-scale">
        {LAYER_TOKENS.map((name) => row(name, null, name))}
        {BREAKPOINT_TOKENS.map((name) => row(name, null, name))}
      </div>
    </>
  );
}

export default function DesignSystemPage() {
  const tree = source.getPageTree();
  const current = '/docs/concepts';
  return (
    <Shell>
      <title>Design system · Strig</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="prose" style={{ maxWidth: 'var(--w-wide)' }}>
        <h1>Design system</h1>
        <p className="prose-lead">
          Tokens and every component in every variant, under both themes. Each value on this page is read from the stylesheet, not copied.
        </p>

        <section className="ds-section">
          <h2>Colour</h2>
          <p className="ds-note">Body text needs 4.5:1 and interface elements 3:1. Support is for ornament and charts; support-ink carries text.</p>
          <ColorSwatches />
        </section>

        <section className="ds-section">
          <h2>Scales</h2>
          <ScaleTables />
        </section>

        <section className="ds-section">
          <h2>Components</h2>
          <div className="ds-pair">
            {THEMES.map((theme) => (
              <div className="ds-panel" data-theme={theme} key={theme}>
                <p className="ds-panel-name">{theme}</p>
                <ComponentSheet tree={tree} current={current} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
