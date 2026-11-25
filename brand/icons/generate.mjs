// Strig icon set: filled polygons on a 24 grid. Grammar taken from the Corte symbol: wedges that
// narrow to a point (the fangs), straight cuts, mitred corners, no round caps or joins.
const MITER = 3.2;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const norm = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
const left = (d) => [d[1], -d[0]]; // y down: left of travel direction
const f = (n) => +n.toFixed(2);

function offsetPts(pts, widths, closed, side) {
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) {
    const prev = closed ? pts[(i - 1 + n) % n] : pts[i - 1];
    const next = closed ? pts[(i + 1) % n] : pts[i + 1];
    const d1 = prev ? norm(sub(pts[i], prev)) : null;
    const d2 = next ? norm(sub(next, pts[i])) : null;
    const n1 = d1 ? left(d1) : left(d2), n2 = d2 ? left(d2) : left(d1);
    let m = norm([n1[0] + n2[0], n1[1] + n2[1]]);
    if (!isFinite(m[0]) || (n1[0] + n2[0]) ** 2 + (n1[1] + n2[1]) ** 2 < 1e-9) m = n1;
    const cos = m[0] * n1[0] + m[1] * n1[1];
    const k = Math.min(1 / Math.max(cos, 1e-3), MITER);
    const h = ((Array.isArray(widths) ? widths[i] : widths) / 2) * k * side;
    out.push([pts[i][0] + m[0] * h, pts[i][1] + m[1] * h]);
  }
  return out;
}
let GS = 1;
const area = (p) => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + (q[0] * r[1] - r[0] * q[1]); }, 0);
const d = (pts, sign = 1) => { const q = Math.sign(area(pts)) === sign ? pts : [...pts].reverse(); return 'M' + q.map((p) => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z'; };
export const cut = (fn) => { GS = -1; try { return fn(); } finally { GS = 1; } };
// open stroke: widths per vertex; width 0 gives a point
export const line = (pts, w = 2.2) => { const L = offsetPts(pts, w, false, 1), R = offsetPts(pts, w, false, -1).reverse(); return d([...L, ...R], GS); };
// closed ring, sharp corners
export const ring = (pts, w = 2) => d(offsetPts(pts, w, true, 1), 1) + d(offsetPts(pts, w, true, -1), -1);
export const poly = (pts, s = 1) => d(pts, s);
const oct = (cx, cy, r) => Array.from({ length: 8 }, (_, i) => { const a = (Math.PI / 4) * i + Math.PI / 8; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
const diamond = (cx, cy, r) => poly([[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]], GS);
const ex = (cx, cy, s = 3.4, w = 2.2) => line([[cx - s, cy - s], [cx, cy], [cx + s, cy + s]], [0, w, 0]) + line([[cx + s, cy - s], [cx, cy], [cx - s, cy + s]], [0, w, 0]);
const tick = (pts, w = 2.2) => line(pts, [w, w, 0]);
const O = oct(12, 12, 10.2);
const crescent = (() => {
  const c1 = [12, 12], r1 = 10, c2 = [17, 8], r2 = 8.2, N = 120;
  const out = [], inn = [];
  for (let i = 0; i < N; i++) { const t = (2 * Math.PI * i) / N; const p = [c1[0] + r1 * Math.cos(t), c1[1] + r1 * Math.sin(t)];
    if (Math.hypot(p[0] - c2[0], p[1] - c2[1]) > r2) out.push({ t, p }); }
  // rotate so the outside arc is contiguous
  let k = 0; for (let i = 0; i < out.length; i++) if (out[(i + 1) % out.length].t - out[i].t > 0.2) k = (i + 1) % out.length;
  const outer = [...out.slice(k), ...out.slice(0, k)].map((o) => o.p);
  for (let i = 0; i < N; i++) { const t = (2 * Math.PI * i) / N; const p = [c2[0] + r2 * Math.cos(t), c2[1] + r2 * Math.sin(t)];
    if (Math.hypot(p[0] - c1[0], p[1] - c1[1]) < r1) inn.push({ t, p }); }
  let k2 = 0; for (let i = 0; i < inn.length; i++) if (inn[(i + 1) % inn.length].t - inn[i].t > 0.2) k2 = (i + 1) % inn.length;
  let innerPts = [...inn.slice(k2), ...inn.slice(0, k2)].map((o) => o.p);
  const last = outer[outer.length - 1];
  if (Math.hypot(innerPts[0][0] - last[0], innerPts[0][1] - last[1]) > Math.hypot(innerPts[innerPts.length - 1][0] - last[0], innerPts[innerPts.length - 1][1] - last[1])) innerPts = innerPts.reverse();
  return poly([...outer, ...innerPts]);
})();

export const OUTLINE = {
  check: tick([[3.5, 12.5], [9, 18], [20.5, 6]]),
  x: ex(12, 12, 7.5, 2.6),
  search: ring(oct(10.2, 10.2, 7), 2.2) + line([[15.4, 15.4], [18.2, 18.2], [21.5, 21.5]], [2.8, 2.8, 0]),
  copy: ring([[3.5, 9], [15, 9], [15, 20.5], [3.5, 20.5]], 2) + line([[9, 9], [9, 3.5], [20.5, 3.5], [20.5, 15], [15, 15]], 2),
  'chevron-right': line([[7.5, 3.5], [16.5, 12], [7.5, 20.5]], [0, 2.6, 0]),
  'chevron-left': line([[16.5, 3.5], [7.5, 12], [16.5, 20.5]], [0, 2.6, 0]),
  'chevron-down': line([[3.5, 7.5], [12, 16.5], [20.5, 7.5]], [0, 2.6, 0]),
  'arrow-right': line([[2.5, 12], [18, 12]], 2.4) + line([[12.5, 4.5], [21, 12], [12.5, 19.5]], [0, 2.6, 0]),
  menu: line([[3, 6], [21, 6]], [2.6, 0]) + line([[3, 12], [16, 12]], [2.6, 0]) + line([[3, 18], [21, 18]], [2.6, 0]),
  info: ring(O, 2) + line([[12, 10.6], [12, 17.8]], 2.4) + diamond(12, 7.2, 1.5),
  'triangle-alert': ring([[12, 2.8], [22, 20.5], [2, 20.5]], 2) + line([[12, 8.8], [12, 14.2]], [2.6, 0.8]) + diamond(12, 17.4, 1.4),
  'circle-alert': ring(O, 2) + line([[12, 6], [12, 13.2]], [2.6, 0.8]) + diamond(12, 16.6, 1.5),
  'circle-check': ring(O, 2) + tick([[7, 12.2], [10.6, 15.8], [17.2, 8.4]], 2.2),
  'circle-x': ring(O, 2) + ex(12, 12, 3.8, 2.2),
  'circle-minus': ring(O, 2) + line([[6.5, 12], [12, 12], [17.5, 12]], [0, 2.4, 0]),
  minus: line([[3.5, 12], [12, 12], [20.5, 12]], [0, 2.8, 0]),
  sun: ring(oct(12, 12, 4.6), 2.2) + Array.from({ length: 8 }, (_, i) => { const a = (Math.PI / 4) * i; return line([[12 + 7.6 * Math.cos(a), 12 + 7.6 * Math.sin(a)], [12 + 11.6 * Math.cos(a), 12 + 11.6 * Math.sin(a)]], [2.4, 0]); }).join(''),
  moon: crescent,
  'external-link': line([[10, 4], [4, 4], [4, 20], [20, 20], [20, 14]], 2.2) + line([[10.5, 13.5], [18.5, 5.5]], 2.4) + poly([[13, 2.5], [21.5, 2.5], [21.5, 11]]),
  'book-open': line([[12, 6], [2.8, 4], [2.8, 19], [12, 21]], 2) + line([[12, 6], [21.2, 4], [21.2, 19], [12, 21]], 2) + line([[12, 6], [12, 21]], 2),
  play: ring([[6, 3.5], [20.5, 12], [6, 20.5]], 2.2),
  pause: ring([[5.6, 3], [9.6, 3], [9.6, 21], [5.6, 21]], 2.2) + ring([[14.4, 3], [18.4, 3], [18.4, 21], [14.4, 21]], 2.2),
  terminal: line([[3.5, 5.5], [10, 12], [3.5, 18.5]], [0, 2.6, 0]) + line([[12.5, 18.5], [21, 18.5]], 2.4),
  'shield-check': ring([[12, 2.5], [20.5, 5.5], [20.5, 12.5], [12, 21.5], [3.5, 12.5], [3.5, 5.5]], 2) + tick([[8, 11.5], [11, 14.5], [16.2, 8.6]], 2.2),
  'panel-top': ring([[3, 4], [21, 4], [21, 20], [3, 20]], 2) + line([[3, 9.2], [21, 9.2]], 2),
};
// solid variants: a filled body with the glyph cut out (evenodd)
export const SOLID = {
  play: poly([[5, 2.5], [21.5, 12], [5, 21.5]]),
  pause: poly([[5, 2.5], [10, 2.5], [10, 21.5], [5, 21.5]]) + poly([[14, 2.5], [19, 2.5], [19, 21.5], [14, 21.5]]),
  'triangle-alert': poly([[12, 2.2], [23, 21.2], [1, 21.2]]) + cut(() => line([[12, 8.6], [12, 14.2]], [2.6, 0.8]) + diamond(12, 17.6, 1.4)),
  info: poly(oct(12, 12, 11)) + cut(() => line([[12, 10.6], [12, 17.8]], 2.4) + diamond(12, 7.2, 1.5)),
  'circle-alert': poly(oct(12, 12, 11)) + cut(() => line([[12, 6], [12, 13.2]], [2.6, 0.8]) + diamond(12, 16.6, 1.5)),
  'circle-check': poly(oct(12, 12, 11)) + cut(() => tick([[7, 12.2], [10.6, 15.8], [17.2, 8.4]], 2.2)),
  'circle-x': poly(oct(12, 12, 11)) + cut(() => poly([[8.2,6.9],[12,10.7],[15.8,6.9],[17.1,8.2],[13.3,12],[17.1,15.8],[15.8,17.1],[12,13.3],[8.2,17.1],[6.9,15.8],[10.7,12],[6.9,8.2]], -1)),
};
export const GITHUB = 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';
export const ALL = { ...OUTLINE, github: GITHUB, ...Object.fromEntries(Object.entries(SOLID).map(([k, v]) => [k + '-solid', v])) };
export const svgFile = (name, dd) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#996c6c"><path d="${dd}"/></svg>\n`;
