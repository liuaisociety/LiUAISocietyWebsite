// Generates an editable SVG recreation of the homepage background: dark sky + star field.
// Colors mirror src/components/home/ArcScene.tsx (#040D1C bg, #aaddff stars).
// Usage: node design/generate-star-bg.mjs [width] [height] > design/star-background.svg
//   defaults to 1080x1080 (IG square). Try: 1080 1350 (portrait), 1920 1080 (landscape).

const W = Number(process.argv[2]) || 1080;
const H = Number(process.argv[3]) || 1080;

// Same deterministic RNG as the star field in ArcScene.tsx
const rng = (s) => { const x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };

// Scale star count with canvas area so density stays consistent across sizes.
const STAR_COUNT = Math.round(280 * (W * H) / (1080 * 1080));
let stars = "";
for (let i = 0; i < STAR_COUNT; i++) {
  const x = (rng(i * 3) * W).toFixed(1);
  const y = (rng(i * 3 + 1) * H).toFixed(1);
  const r = (0.6 + rng(i * 7) * 1.9).toFixed(2);
  const op = (0.35 + rng(i * 5) * 0.6).toFixed(2);
  stars += `    <circle cx="${x}" cy="${y}" r="${r}" fill="#aaddff" opacity="${op}"/>\n`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <!-- background -->
  <rect width="${W}" height="${H}" fill="#040D1C"/>

  <!-- star field -->
  <g id="stars">
${stars}  </g>
</svg>
`;

process.stdout.write(svg);
