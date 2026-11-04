// The island map: the page drawn as a dot lattice of static HTML (the sea), with a
// few islands snapped to it that hydrate in directive order, and one Jetstream
// island that stays live over a wire to the server. Server-rendered markup and CSS
// only (see "island map" in landing-style.ts), so it costs no client JS.
//
// Placement is in lattice cells: `c` counts columns from the horizontal centre,
// `r` rows from the top, `rb` rows up from the bottom edge. The CSS snaps every
// edge between dots, so islands and the sea always share one grid.

export type Island = {
  name: string;
  directive: string;
  c: number;
  w: number;
  h: number;
  r?: number;
  rb?: number;
  /** Hydration delay in seconds. */
  t: number;
  live?: boolean;
  /** Hide below the 1000px breakpoint. */
  wide?: boolean;
  /** Column below the 1000px breakpoint, when the island stays. */
  cm?: number;
};

export function IslandEl({ i }: { i: Island }) {
  const pos = i.rb != null ? `--rb:${i.rb}` : `--r:${i.r ?? 0}`;
  return (
    <div
      class={`isl${i.rb != null ? " is-b" : ""}${i.live ? " is-live" : ""}${i.wide ? " is-wide" : ""}`}
      style={`--c:${i.c};--cm:${i.cm ?? i.c};--w:${i.w};--h:${i.h};${pos};--t:${i.t}s`}
    >
      <span class="isl__lit" />
      <span class="isl__frame" />
      <span class="isl__tag">
        <span class="isl__n">&lt;{i.name}</span> <b>{i.directive}</b> <span class="isl__n">/&gt;</span>
      </span>
      {i.live ? (
        <span class="isl__wire">
          <i class="pk pk--out" />
          <i class="pk pk--in" />
          <span class="isl__ep">/__nowaki/live</span>
        </span>
      ) : null}
    </div>
  );
}

const HERO: Island[] = [
  { name: "Search", directive: "client:load", c: -25, r: 3, w: 9, h: 2, t: 0.9, wide: true },
  { name: "Comments", directive: "client:visible", c: -18, rb: 6, w: 10, h: 4, t: 1.8, wide: true },
  { name: "Likes", directive: "live", c: 11, cm: -4, rb: 5, w: 6, h: 3, t: 2.7, live: true },
];

export default function IslandMap({ keyLabels }: { keyLabels: readonly string[] }) {
  return (
    <div class="map" aria-hidden="true">
      <div class="map__sea" />
      {HERO.map((i) => (
        <IslandEl i={i} />
      ))}
      <ul class="map__key">
        <li>
          <i class="mk mk--sea" />
          {keyLabels[0]}
        </li>
        <li>
          <i class="mk mk--isl" />
          {keyLabels[1]}
        </li>
        <li>
          <i class="mk mk--live" />
          {keyLabels[2]}
        </li>
        <li class="map__note">{keyLabels[3]}</li>
      </ul>
    </div>
  );
}
