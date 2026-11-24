import {
  ArrowRight,
  BookOpen,
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CodeXml,
  Copy,
  ExternalLink,
  Info,
  Layers,
  Menu,
  Minus,
  Package,
  Pause,
  Play,
  Route,
  Scale,
  Search,
  ShieldCheck,
  Terminal,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react';

const ICONS = {
  check: Check,
  x: X,
  dash: Minus,
  bang: CircleAlert,
  search: Search,
  copy: Copy,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  menu: Menu,
  info: Info,
  warn: TriangleAlert,
  break: Ban,
  'arrow-right': ArrowRight,
  'external-link': ExternalLink,
  book: BookOpen,
  play: Play,
  pause: Pause,
  terminal: Terminal,
  shield: ShieldCheck,
  code: CodeXml,
  package: Package,
  route: Route,
  layers: Layers,
  scale: Scale,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

// Lucide (ISC), grid 24, stroke 2; 1.75 only at 16px and below. Colour is inherited.
export function Icon({ name, size = 18, label }: { name: IconName; size?: number; label?: string }) {
  const Glyph = ICONS[name];
  const decorative = label === undefined;
  return (
    <Glyph
      className="icon"
      size={size}
      strokeWidth={size <= 16 ? 1.75 : 2}
      role={decorative ? undefined : 'img'}
      aria-label={label}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    />
  );
}
