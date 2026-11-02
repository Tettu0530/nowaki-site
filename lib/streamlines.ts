// Static wind-tunnel streamlines: horizontal flow bending around an elliptical
// obstacle. Server-rendered SVG path data, so it costs no client JS.

export type Flow = {
  w: number;
  h: number;
  lines: number;
  /** Obstacle centre and radii. */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  step?: number;
};

export function streamlines({ w, h, lines, cx, cy, rx, ry, step = 12 }: Flow): string[] {
  const out: string[] = [];
  for (let i = 0; i < lines; i++) {
    const y0 = ((i + 0.5) / lines) * h;
    const dyc = y0 - cy;
    const side = dyc === 0 ? 1 : Math.sign(dyc);
    // Lines near the obstacle's axis deflect by about its half-height; far lines barely move.
    const reach = Math.exp(-Math.abs(dyc) / (ry * 1.7));
    const lift = (ry * 1.08 - Math.min(Math.abs(dyc), ry) * 0.55) * reach;
    let d = "";
    for (let x = -step; x <= w + step; x += step) {
      const t = (x - cx) / rx;
      const bump = Math.exp(-t * t * 1.15);
      const y = y0 + side * lift * bump;
      d += `${d ? "L" : "M"}${Math.round(x)} ${Math.round(y)}`;
    }
    out.push(d);
  }
  return out;
}
