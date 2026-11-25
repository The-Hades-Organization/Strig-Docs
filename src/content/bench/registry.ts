import { bench as concepts } from './concepts';
import { bench as index } from './index';
import type { PageBench } from './types';

// Bench data per page, keyed by the page's slugs joined with "/". The docs
// home is "index".
const BENCHES: Record<string, PageBench> = {
  index,
  concepts,
};

export function benchFor(slugs: string[]): PageBench | undefined {
  return BENCHES[slugs.length === 0 ? 'index' : slugs.join('/')];
}
