import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { resolve, dirname, relative } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import {
  geoPath,
  geoOrthographic,
  geoEquirectangular,
  geoGraticule10,
  geoContains,
  geoDistance,
} from "d3-geo";
import { feature } from "topojson-client";
import * as icons from "simple-icons";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "apps/web/public/assets");
const write = async (path, content) => {
  const dest = resolve(out, path);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, content);
};
const svg = (w, h, content) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${content}</svg>`;
const source = new Map();
let inputs = [];
try {
  inputs = JSON.parse(
    await readFile(resolve(root, ".asset-inputs.json"), "utf8"),
  );
} catch {
  /* Raster artwork is committed; regeneration needs the original generation outputs. */
}
for (const item of inputs) {
  if (!item.input) throw new Error(`Missing original image: ${item.id}`);
  const category =
    item.id.startsWith("dm-") || item.id.startsWith("web-")
      ? "courses"
      : [
            "seo",
            "social-media",
            "performance",
            "content-creative",
            "branding",
            "growth-strategy",
          ].includes(item.id)
        ? "services"
        : [
              "college-partnership",
              "franchise-partnership",
              "contact-network",
            ].includes(item.id)
          ? "partnerships"
          : "landscapes";
  const target = `${category}/${item.id}.webp`;
  await mkdir(resolve(out, category), { recursive: true });
  await sharp(item.input)
    .resize(category === "landscapes" ? 1536 : 960, null, {
      withoutEnlargement: true,
    })
    .webp({ quality: 85, effort: 6 })
    .toFile(resolve(out, target));
  source.set(target, {
    source: "Original OpenAI built-in image generation for this project",
    purpose:
      category === "courses"
        ? "Course card and course detail artwork"
        : category === "services"
          ? "Service card artwork"
          : category === "partnerships"
            ? "Conceptual partnership/contact illustration"
            : "Hero, mission, or CTA background",
    promptId: item.id,
  });
}
if (inputs.length)
  await writeFile(
    resolve(root, "docs/assets/generation-prompts.json"),
    JSON.stringify(
      inputs.map(({ input, ...item }) => item),
      null,
      2,
    ) + "\n",
  );

const mark =
  '<path d="M1 34 16 14l9 12-6 8H1Z M19 12l8-11 27 33H38L19 12Z M33 9l6-8 18 23-6 8L33 9Z M21 34l7-9 7 9H21Z" fill="#ff6b2c"/>';
await write("brand/mountain-mark.svg", svg(58, 36, mark));
for (const [name, color] of [
  ["dark", "#f5f5f5"],
  ["light", "#17120f"],
])
  await write(
    `brand/wordmark-${name}.svg`,
    svg(
      300,
      54,
      `<g transform="translate(2 9)">${mark}</g><text x="74" y="36" font-family="Arial,sans-serif" font-weight="800" font-size="28" letter-spacing="-1" fill="${color}">MOUND<tspan fill="#ff6b2c">WEB</tspan></text>`,
    ),
  );
const appIcon = svg(
  512,
  512,
  `<rect width="512" height="512" rx="112" fill="#070707"/><g transform="translate(74 142) scale(6.3)">${mark}</g>`,
);
await write("brand/app-icon.svg", appIcon);
await sharp(Buffer.from(appIcon))
  .resize(192)
  .png()
  .toFile(resolve(out, "brand/icon-192.png"));
await sharp(Buffer.from(appIcon))
  .png()
  .toFile(resolve(out, "brand/icon-512.png"));
await sharp(Buffer.from(appIcon))
  .resize(180)
  .png()
  .toFile(resolve(root, "apps/web/public/apple-touch-icon.png"));
await writeFile(
  resolve(root, "apps/web/public/icon.svg"),
  svg(
    64,
    64,
    `<rect width="64" height="64" rx="14" fill="#070707"/><g transform="translate(4 13)">${mark}</g>`,
  ),
);
const iconPng = await sharp(Buffer.from(appIcon)).resize(32).png().toBuffer();
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader[6] = 32;
icoHeader[7] = 32;
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(iconPng.length, 14);
icoHeader.writeUInt32LE(22, 18);
await writeFile(
  resolve(root, "apps/web/public/favicon.ico"),
  Buffer.concat([icoHeader, iconPng]),
);

const gradients =
  '<defs><radialGradient id="glow"><stop stop-color="#ffdfae"/><stop offset=".18" stop-color="#ff9546"/><stop offset=".48" stop-color="#ff6b2c" stop-opacity=".35"/><stop offset="1" stop-color="#ff6b2c" stop-opacity="0"/></radialGradient></defs>';
await write(
  "textures/particle-soft.svg",
  svg(
    128,
    128,
    gradients + '<circle cx="64" cy="64" r="64" fill="url(#glow)"/>',
  ),
);
await write(
  "textures/light-flare.svg",
  svg(
    512,
    128,
    gradients +
      '<ellipse cx="256" cy="64" rx="255" ry="18" fill="url(#glow)"/><circle cx="256" cy="64" r="64" fill="url(#glow)"/>',
  ),
);
await write(
  "textures/atmosphere.svg",
  svg(
    512,
    512,
    '<defs><radialGradient id="a"><stop offset=".65" stop-color="#ff6b2c" stop-opacity="0"/><stop offset=".76" stop-color="#ff6b2c" stop-opacity=".12"/><stop offset=".8" stop-color="#ffb15c" stop-opacity=".8"/><stop offset=".85" stop-color="#ff6b2c" stop-opacity=".2"/><stop offset="1" stop-color="#ff6b2c" stop-opacity="0"/></radialGradient></defs><circle cx="256" cy="256" r="256" fill="url(#a)"/>',
  ),
);
await write(
  "textures/explosion-ring.svg",
  svg(
    256,
    256,
    '<defs><radialGradient id="e"><stop offset=".4" stop-color="#ff6b2c" stop-opacity="0"/><stop offset=".67" stop-color="#ff9546" stop-opacity=".1"/><stop offset=".71" stop-color="#ffdfae" stop-opacity=".95"/><stop offset=".76" stop-color="#ff6b2c" stop-opacity=".3"/><stop offset="1" stop-color="#ff6b2c" stop-opacity="0"/></radialGradient></defs><circle cx="128" cy="128" r="128" fill="url(#e)"/>',
  ),
);
await write(
  "graphics/mountain-ridgeline.svg",
  svg(
    1600,
    480,
    '<defs><linearGradient id="m" x2="0" y2="1"><stop stop-color="#ff6b2c" stop-opacity=".2"/><stop offset="1" stop-color="#ff6b2c" stop-opacity="0"/></linearGradient></defs><path d="M0 400 170 260 290 320 490 130 610 210 800 20 1000 245 1120 140 1350 340 1450 290 1600 400V480H0Z" fill="url(#m)" stroke="#ff6b2c" stroke-width="2"/><g stroke="#ff6b2c" stroke-opacity=".4" fill="none"><path d="M490 130 540 300 800 20 780 320 1120 140 1180 350 1600 400 M170 260 210 420 610 210 530 450 1000 245 900 440 1350 340 1400 440"/></g>',
  ),
);
let net = "";
const nodes = [];
let seed = 41;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
for (let i = 0; i < 65; i++) nodes.push([rand() * 1600, rand() * 550]);
for (let i = 0; i < nodes.length; i++) {
  const [x, y] = nodes[i];
  for (let j = i + 1; j < nodes.length; j++) {
    const [a, b] = nodes[j];
    if (Math.hypot(a - x, b - y) < 180)
      net += `<path d="M${x.toFixed(1)} ${y.toFixed(1)}L${a.toFixed(1)} ${b.toFixed(1)}" stroke="#ff6b2c" stroke-opacity=".18"/>`;
  }
  net += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 7 === 0 ? 3 : 1.3}" fill="#ff9e55" opacity=".7"/>`;
}
await write("graphics/connection-network.svg", svg(1600, 550, net));
await write(
  "graphics/orbit-paths.svg",
  svg(
    640,
    640,
    '<g fill="none" stroke="#ff6b2c" stroke-opacity=".65"><ellipse cx="320" cy="320" rx="305" ry="83" transform="rotate(-22 320 320)"/><ellipse cx="320" cy="320" rx="294" ry="110" transform="rotate(24 320 320)"/><ellipse cx="320" cy="320" rx="285" ry="126" transform="rotate(-48 320 320)"/></g>',
  ),
);

const atlas = JSON.parse(
  await readFile(
    resolve(root, "node_modules/world-atlas/land-110m.json"),
    "utf8",
  ),
);
const land = feature(atlas, atlas.objects.land);
const projection = geoOrthographic()
  .rotate([-22, -16])
  .translate([320, 320])
  .scale(220)
  .clipAngle(90);
const path = geoPath(projection);
const landPath = path(land);
const gridPath = path(geoGraticule10());
let dots = "";
for (let lon = -180; lon <= 180; lon += 5) {
  for (let lat = -75; lat <= 80; lat += 5) {
    if (
      geoContains(land, [lon, lat]) &&
      geoDistance([lon, lat], [22, 16]) < Math.PI / 2
    ) {
      const p = projection([lon, lat]);
      dots += `<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="1.15" fill="#ffb064" opacity=".85"/>`;
    }
  }
}
const globe = `<defs><radialGradient id="s"><stop stop-color="#1e0b03"/><stop offset=".83" stop-color="#140903"/><stop offset="1" stop-color="#6e2b09"/></radialGradient><filter id="b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter></defs><circle cx="320" cy="320" r="221" stroke="#ff6b2c" stroke-width="6" fill="none" filter="url(#b)" opacity=".8"/><circle cx="320" cy="320" r="220" fill="url(#s)" stroke="#ff9846" stroke-width="2"/><path d="${gridPath}" stroke="#ff6b2c" stroke-width=".6" stroke-opacity=".3" fill="none"/><path d="${landPath}" fill="#ff6b2c12" stroke="#ff8e3b" stroke-width="1"/>${dots}`;
await write("graphics/globe-poster.svg", svg(640, 640, globe));
const eq = geoEquirectangular()
  .translate([1024, 512])
  .scale(2048 / (2 * Math.PI));
const eqPath = geoPath(eq);
const eqLand = eqPath(land);
for (const [name, bg, fill, stroke] of [
  ["earth-surface", "#090603", "#ff6b2c22", "#ff8e3b"],
  ["earth-land-mask", "#000", "#fff", "#fff"],
]) {
  const content = svg(
    2048,
    1024,
    `<rect width="2048" height="1024" fill="${bg}"/><path d="${eqLand}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>${name === "earth-surface" ? `<path d="${eqPath(geoGraticule10())}" fill="none" stroke="#ff6b2c" stroke-opacity=".15"/>` : ""}`,
  );
  await sharp(Buffer.from(content))
    .png()
    .toFile(resolve(out, `textures/${name}.png`));
  source.set(`textures/${name}.png`, {
    source:
      "Natural Earth public-domain land geometry via world-atlas 2.0.2; original styling",
    purpose:
      "2:1 equirectangular texture for the Part 04 sphere; no political borders",
  });
}
source.set("graphics/globe-poster.svg", {
  source:
    "Natural Earth public-domain land geometry via world-atlas 2.0.2; original d3-geo rendering",
  purpose:
    "Static globe fallback; projected geography, graticule, and land nodes",
});

for (const [id, si, color] of [
  ["google", "siGoogle", "#f5f5f5"],
  ["meta", "siMeta", "#719bf5"],
  ["youtube", "siYoutube", "#ff5b46"],
  ["instagram", "siInstagram", "#f0ad9a"],
  ["analytics", "siGoogleanalytics", "#ff913c"],
]) {
  await write(
    `platforms/${id}.svg`,
    svg(24, 24, `<path d="${icons[si].path}" fill="${color}"/>`),
  );
  source.set(`platforms/${id}.svg`, {
    source: `Simple Icons ${icons[si].title}; CC0 artwork, trademarks remain with owners`,
    purpose: "Illustrative marketing channel icon, never a partner endorsement",
  });
}
await write(
  "platforms/linkedin.svg",
  svg(
    36,
    36,
    '<text x="2" y="28" font-family="Arial,sans-serif" font-weight="700" font-size="32" fill="#f5f5f5">in</text>',
  ),
);
source.set("platforms/linkedin.svg", {
  source: "Original typographic channel label, not an official logo asset",
  purpose: "LinkedIn channel label; no affiliation implied",
});

for (const [name, shapes] of [
  [
    "strategists",
    '<circle cx="140" cy="120" r="65"/><circle cx="140" cy="120" r="42"/><circle cx="140" cy="120" r="19"/><path d="m140 120 64-70m-64 70 20-3m-20 3 3-20" stroke-width="3"/>',
  ],
  [
    "educators",
    '<path d="m140 80-80 32 80 32 80-32-80-32Zm-50 49v40q50 38 100 0v-40m30-17v64"/><circle cx="220" cy="181" r="5"/>',
  ],
  [
    "creators",
    '<path d="m90 172 20-76 43-25 40 42-25 43-78 16Zm0 0 48-48m-28-28 58 60"/><circle cx="140" cy="122" r="8"/><path d="m153 71 17-17 40 41-17 18"/>',
  ],
]) {
  await write(
    `graphics/${name}.svg`,
    svg(
      280,
      250,
      `<defs><radialGradient id="r"><stop stop-color="#ff6b2c" stop-opacity=".18"/><stop offset="1" stop-color="#ff6b2c" stop-opacity="0"/></radialGradient></defs><rect width="280" height="250" fill="#0c0a08"/><circle cx="140" cy="130" r="130" fill="url(#r)"/><g stroke="#ff8841" stroke-width="1.6" fill="none">${shapes}</g><g fill="#ff8841" opacity=".5"><circle cx="39" cy="75" r="2"/><circle cx="240" cy="57" r="1.5"/><circle cx="220" cy="208" r="2"/></g>`,
    ),
  );
}

async function walk(dir) {
  const list = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const p = resolve(dir, item.name);
    if (item.isDirectory()) list.push(...(await walk(p)));
    else if (!item.name.endsWith(".json")) list.push(p);
  }
  return list;
}
let previous = [];
try {
  previous = JSON.parse(await readFile(resolve(out, "manifest.json"), "utf8"));
} catch {}
const manifest = [];
for (const file of (await walk(out)).sort()) {
  const name = relative(out, file);
  const bytes = await readFile(file);
  const meta = await sharp(bytes).metadata();
  manifest.push({
    path: `/assets/${name}`,
    width: meta.width,
    height: meta.height,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    ...(source.get(name) ??
      previous.find((x) => x.path === `/assets/${name}`) ?? {
        source:
          "Original MOUNDWEB vector artwork, authored in scripts/prepare-assets.mjs",
        purpose: name.startsWith("brand/")
          ? "Brand identity"
          : name.startsWith("textures/")
            ? "Supporting shader/particle texture for Parts 03–04"
            : "Reusable decorative graphic",
      }),
    path: `/assets/${name}`,
    width: meta.width,
    height: meta.height,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}
await write("manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `Prepared ${manifest.length} assets; ${(manifest.reduce((a, x) => a + x.bytes, 0) / 1024 / 1024).toFixed(2)} MiB total.`,
);
