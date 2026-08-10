import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import sharp from 'sharp';
import { OfflineCompiler } from 'mind-ar/src/image-target/offline-compiler.js';
import { normalizeBaseUrl } from './lib/baseUrl.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DAPP_DIR = path.resolve(SCRIPT_DIR, '..');
const SYMBOL_DIR = path.join(SCRIPT_DIR, 'ar-symbols');
const PUBLIC_AR_DIR = path.join(DAPP_DIR, 'public', 'ar');
const PRINT_DIR = path.join(PUBLIC_AR_DIR, 'print');
const TARGET_DIR = path.join(PUBLIC_AR_DIR, 'targets');
const DRACO_DIR = path.join(PUBLIC_AR_DIR, 'draco');
const THREE_DRACO_DIR = path.join(
   DAPP_DIR,
   'node_modules',
   'three',
   'examples',
   'jsm',
   'libs',
   'draco',
   'gltf'
);

const TARGET_SIZE = 1024;
const PRINT_SIZE = 2048;
const DEFAULT_PRINTED_MEDALLION_DIAMETER_MM = 90;
const MEDALLION_CENTER = TARGET_SIZE / 2;
const MEDALLION_RADIUS = 384;
const MEDALLION_DETAIL_RADIUS = MEDALLION_RADIUS - 18;
const QR_FIELD_FRACTION = 0.36;
const QR_QUIET_MODULES = 4;
const MINIMUM_QR_MODULE_MM = 0.85;
const MINIMUM_ART_ANNULUS_MM = 12;
const QR_DECODE_SIZES = [1024, 512, 384, 256];
const ASYMMETRY_ROTATIONS = [45, 90, 135, 180];
const MINIMUM_ASYMMETRY_PERCENT = 16;
// Procedural dominant forms span roughly 200-270 marker units. Normalizing a
// symbol's longest viewBox edge to 230 keeps its visual extent in that range
// before applying the existing per-profile dominantScale variation.
const DOMINANT_SYMBOL_FOOTPRINT = 230;
// These profiles vary only neutral geometry and texture density; they carry no
// semantic relationship to the artifacts assigned to them.
const ABSTRACT_PROFILES = [
   {
      formKind: 'wedge',
      hatchClusters: 8,
      hatchDensity: 0.9,
      dominantDistance: 62,
      dominantScale: 1.1,
   },
   {
      formKind: 'bar',
      hatchClusters: 10,
      hatchDensity: 1.04,
      dominantDistance: 102,
      dominantScale: 0.88,
   },
   {
      formKind: 'wideArc',
      hatchClusters: 12,
      hatchDensity: 0.92,
      dominantDistance: 142,
      dominantScale: 1.02,
   },
   {
      formKind: 'blob',
      hatchClusters: 9,
      hatchDensity: 1.36,
      dominantDistance: 178,
      dominantScale: 0.92,
   },
   {
      formKind: 'slenderWedge',
      hatchClusters: 13,
      hatchDensity: 1.12,
      dominantDistance: 190,
      dominantScale: 0.84,
   },
   {
      formKind: 'shortArc',
      hatchClusters: 11,
      hatchDensity: 1.42,
      dominantDistance: 158,
      dominantScale: 1.12,
   },
];

const parsePrintedDiameter = () => {
   const configured = process.env.AR_MARKER_DIAMETER_MM?.trim();
   if (!configured) return DEFAULT_PRINTED_MEDALLION_DIAMETER_MM;

   const diameter = Number(configured);
   if (!Number.isFinite(diameter) || diameter <= 0) {
      throw new Error(
         `AR_MARKER_DIAMETER_MM must be a positive number, received "${configured}".`
      );
   }
   return diameter;
};

const PRINTED_MEDALLION_DIAMETER_MM = parsePrintedDiameter();
const PRINT_CANVAS_SIZE_MM =
   (PRINTED_MEDALLION_DIAMETER_MM * TARGET_SIZE) / (MEDALLION_RADIUS * 2);
const PRINT_DENSITY_DPI = Math.round(PRINT_SIZE / (PRINT_CANVAS_SIZE_MM / 25.4));

const artifacts = [
   {
      slug: 'calabash',
      name: 'Calabash',
   },
   {
      slug: 'cowry',
      name: 'Cowry Beads',
   },
   {
      slug: 'drum',
      name: 'Double Sided Drum',
   },
   {
      slug: 'headrest',
      name: 'Headrest',
   },
   {
      slug: 'mask',
      name: 'Luvale Mask',
   },
   {
      slug: 'snuff',
      name: 'Snuff Cup',
   },
];

const escapeXml = (value) =>
   value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');

const randomFromSeed = (initialSeed) => {
   let seed = initialSeed >>> 0;
   return () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
   };
};

const hashSlug = (slug) => {
   let hash = 2166136261;
   for (const character of slug) {
      hash ^= character.codePointAt(0);
      hash = Math.imul(hash, 16777619);
   }
   return hash >>> 0;
};

const fixed = (value) => value.toFixed(1);

const loadArtifactSymbol = async (artifact) => {
   const symbolPath = path.join(SYMBOL_DIR, `${artifact.slug}.svg`);
   let source;
   try {
      source = await fs.readFile(symbolPath, 'utf8');
   } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
   }

   const viewBoxMatch = source.match(/\bviewBox\s*=\s*(["'])(.*?)\1/i);
   const svgMatch = source.match(/^\s*<svg\b[^>]*>([\s\S]*?)<\/svg>\s*$/i);
   if (!viewBoxMatch || !svgMatch) {
      throw new Error(
         `Symbol for ${artifact.slug} must have an outer <svg> with a viewBox.`
      );
   }

   const viewBox = viewBoxMatch[2]
      .trim()
      .split(/[\s,]+/)
      .map(Number);
   if (
      viewBox.length !== 4 ||
      viewBox.some((value) => !Number.isFinite(value)) ||
      viewBox[2] <= 0 ||
      viewBox[3] <= 0
   ) {
      throw new Error(`Symbol for ${artifact.slug} has an invalid viewBox.`);
   }

   return {
      viewBox,
      // The source root's color style is removed with its wrapper, so replace
      // currentColor explicitly to keep the inlined ink visible on the dark disc.
      geometry: svgMatch[1].trim().replaceAll(/currentColor/gi, '#f7f5ed'),
   };
};

const pointOnCircle = (radius, angle) => ({
   x: MEDALLION_CENTER + Math.cos(angle) * radius,
   y: MEDALLION_CENTER + Math.sin(angle) * radius,
});

const annulusDistance = (draw, exponent, innerRadius) =>
   innerRadius +
   Math.pow(draw, exponent) * (MEDALLION_DETAIL_RADIUS - innerRadius);

const constrainToArtAnnulus = (x, y, innerRadius) => {
   const dx = x - MEDALLION_CENTER;
   const dy = y - MEDALLION_CENTER;
   const distance = Math.hypot(dx, dy);
   const constrainedDistance = Math.min(
      MEDALLION_DETAIL_RADIUS,
      Math.max(innerRadius, distance)
   );
   const scale = constrainedDistance / distance;
   return {
      x: MEDALLION_CENTER + dx * scale,
      y: MEDALLION_CENTER + dy * scale,
   };
};

const makeReliefPatches = (random, artInnerRadius) =>
   Array.from({ length: 11 }, (_, index) => {
      const angle = random() * Math.PI * 2;
      const distance = annulusDistance(random(), 0.7, artInnerRadius);
      const x = MEDALLION_CENTER + Math.cos(angle) * distance;
      const y = MEDALLION_CENTER + Math.sin(angle) * distance;
      const width = 38 + random() * 118;
      const height = 22 + random() * 72;
      const rotation = random() * 170 - 85;
      return `<ellipse cx="${fixed(x)}" cy="${fixed(y)}" rx="${fixed(
         width
      )}" ry="${fixed(height)}" transform="rotate(${fixed(rotation)} ${fixed(
         x
      )} ${fixed(y)})" fill="${
         index % 4 === 0 ? '#c34e2c' : '#f7f5ed'
      }" opacity="${index % 4 === 0 ? '0.21' : '0.11'}"/>`;
   }).join('');

const makeHatchField = (random, profile, artInnerRadius) => {
   const hatches = [];
   const dominantAngle = random() * Math.PI;
   const denseSide = random() * Math.PI * 2;

   for (let cluster = 0; cluster < profile.hatchClusters; cluster += 1) {
      const clusterAngle =
         cluster < 4
            ? denseSide + (random() - 0.5) * 1.25
            : random() * Math.PI * 2;
      const distance = annulusDistance(random(), 0.75, artInnerRadius);
      const centerX = MEDALLION_CENTER + Math.cos(clusterAngle) * distance;
      const centerY = MEDALLION_CENTER + Math.sin(clusterAngle) * distance;
      const hatchAngle =
         dominantAngle +
         (cluster % 3) * (0.34 + random() * 0.25) +
         (random() - 0.5) * 0.22;
      const count = Math.round(
         (13 + Math.floor(random() * 16)) * profile.hatchDensity
      );

      for (let index = 0; index < count; index += 1) {
         const spreadX = (random() + random() - 1) * (52 + random() * 54);
         const spreadY = (random() + random() - 1) * (45 + random() * 48);
         const point = constrainToArtAnnulus(
            centerX + spreadX,
            centerY + spreadY,
            artInnerRadius
         );
         const { x, y } = point;
         const length = 22 + random() * 88;
         const angle = hatchAngle + (random() - 0.5) * 0.14;
         const dx = Math.cos(angle) * length * 0.5;
         const dy = Math.sin(angle) * length * 0.5;
         hatches.push(
            `<path d="M ${fixed(x - dx)} ${fixed(y - dy)} L ${fixed(
               x + dx
            )} ${fixed(y + dy)}" stroke="#f7f5ed" stroke-width="${fixed(
               1.6 + random() * 3.2
            )}" stroke-linecap="round" opacity="${fixed(
               0.48 + random() * 0.43
            )}"/>`
         );
      }
   }
   return hatches.join('');
};

const makeMicroMarks = (random, artInnerRadius) => {
   const marks = [];
   const clusters = Array.from(
      { length: 4 + Math.floor(random() * 3) },
      (_, index) => {
         const angle = random() * Math.PI * 2;
         const distance = annulusDistance(random(), 0.8, artInnerRadius);
         return {
            x: MEDALLION_CENTER + Math.cos(angle) * distance,
            y: MEDALLION_CENTER + Math.sin(angle) * distance,
            spread: 24 + random() * (index === 0 ? 58 : 92),
         };
      }
   );

   for (let index = 0; index < 122; index += 1) {
      const clustered = random() < 0.72;
      const cluster =
         clusters[Math.floor(random() * clusters.length)] ?? clusters[0];
      const angle = random() * Math.PI * 2;
      const distance = clustered
         ? Math.sqrt(random()) * cluster.spread
         : annulusDistance(random(), 0.5, artInnerRadius);
      const originX = clustered ? cluster.x : MEDALLION_CENTER;
      const originY = clustered ? cluster.y : MEDALLION_CENTER;
      const point = constrainToArtAnnulus(
         originX + Math.cos(angle) * distance,
         originY + Math.sin(angle) * distance,
         artInnerRadius
      );
      const { x, y } = point;
      const markAngle = random() * Math.PI * 2;
      const length = 5 + random() * 16;
      const dx = Math.cos(markAngle) * length;
      const dy = Math.sin(markAngle) * length;
      const color = index % 11 === 0 ? '#c34e2c' : '#f7f5ed';
      const opacity = fixed(0.58 + random() * 0.38);

      switch (index % 5) {
         case 0:
            marks.push(
               `<circle cx="${fixed(x)}" cy="${fixed(y)}" r="${fixed(
                  1.8 + random() * 4.4
               )}" fill="${color}" opacity="${opacity}"/>`
            );
            break;
         case 1:
            marks.push(
               `<path d="M ${fixed(x - dx * 0.5)} ${fixed(
                  y - dy * 0.5
               )} L ${fixed(x + dx * 0.5)} ${fixed(
                  y + dy * 0.5
               )}" stroke="${color}" stroke-width="${fixed(
                  1.4 + random() * 3
               )}" stroke-linecap="round" opacity="${opacity}"/>`
            );
            break;
         case 2:
            marks.push(
               `<path d="M ${fixed(x - dx * 0.55)} ${fixed(
                  y - dy * 0.55
               )} L ${fixed(x + dy * 0.3)} ${fixed(y - dx * 0.3)} L ${fixed(
                  x + dx * 0.45
               )} ${fixed(
                  y + dy * 0.45
               )}" fill="none" stroke="${color}" stroke-width="${fixed(
                  1.2 + random() * 2.5
               )}" stroke-linecap="round" opacity="${opacity}"/>`
            );
            break;
         case 3:
            marks.push(
               `<circle cx="${fixed(x)}" cy="${fixed(y)}" r="${fixed(
                  3 + random() * 6
               )}" fill="none" stroke="${color}" stroke-width="${fixed(
                  1.2 + random() * 2.4
               )}" opacity="${opacity}"/>`
            );
            break;
         default:
            marks.push(
               `<path d="M ${fixed(x)} ${fixed(y - length * 0.55)} L ${fixed(
                  x + length * 0.48
               )} ${fixed(y + length * 0.4)} L ${fixed(
                  x - length * 0.42
               )} ${fixed(
                  y + length * 0.26
               )} Z" fill="${color}" opacity="${opacity}" transform="rotate(${fixed(
                  (markAngle * 180) / Math.PI
               )} ${fixed(x)} ${fixed(y)})"/>`
            );
      }
   }
   return marks.join('');
};

const describeArc = (radius, startAngle, endAngle) => {
   const start = pointOnCircle(radius, startAngle);
   const end = pointOnCircle(radius, endAngle);
   const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
   return `M ${fixed(start.x)} ${fixed(start.y)} A ${fixed(radius)} ${fixed(
      radius
   )} 0 ${largeArc} 1 ${fixed(end.x)} ${fixed(end.y)}`;
};

const makeBrokenRim = (random) => {
   const pieces = [];
   let angle = -Math.PI + random() * 0.65;
   while (angle < Math.PI - 0.08) {
      const gap = 0.05 + random() * 0.2;
      const sweep = 0.2 + random() * 0.72;
      const start = angle + gap;
      const end = Math.min(Math.PI, start + sweep);
      const radius = 342 + random() * 17;
      pieces.push(
         `<path d="${describeArc(radius, start, end)}" fill="none" stroke="${
            pieces.length % 4 === 0 ? '#c34e2c' : '#f7f5ed'
         }" stroke-width="${fixed(
            4 + random() * 8
         )}" stroke-linecap="round" opacity="${fixed(0.68 + random() * 0.28)}"/>`
      );
      angle = end;
   }

   for (let index = 0; index < 19; index += 1) {
      const notchAngle = random() * Math.PI * 2;
      const inner = pointOnCircle(351 + random() * 13, notchAngle);
      const outer = pointOnCircle(374 + random() * 7, notchAngle + 0.012);
      pieces.push(
         `<path d="M ${fixed(inner.x)} ${fixed(inner.y)} L ${fixed(
            outer.x
         )} ${fixed(outer.y)}" stroke="${
            index % 6 === 0 ? '#c34e2c' : '#f7f5ed'
         }" stroke-width="${fixed(
            2 + random() * 4
         )}" stroke-linecap="round" opacity="${fixed(0.58 + random() * 0.38)}"/>`
      );
   }
   return pieces.join('');
};

const remapDominantDistance = (profileDistance, artInnerRadius) => {
   const annulusWidth = MEDALLION_DETAIL_RADIUS - artInnerRadius;
   return artInnerRadius + annulusWidth * (0.36 + (profileDistance / 190) * 0.18);
};

const makeAbstractComposition = (random, profile, artInnerRadius) => {
   const angle = random() * 300 - 150;
   const direction = random() * Math.PI * 2;
   const distance =
      remapDominantDistance(profile.dominantDistance, artInnerRadius) +
      (random() - 0.5) * 10;
   const x = MEDALLION_CENTER + Math.cos(direction) * distance;
   const y = MEDALLION_CENTER + Math.sin(direction) * distance;
   const scale = profile.dominantScale + (random() - 0.5) * 0.06;
   let form;

   if (profile.formKind === 'wedge') {
      const width = 208 + random() * 62;
      const height = 150 + random() * 54;
      form = `<path d="M ${fixed(-width * 0.58)} ${fixed(
         -height * 0.32
      )} L ${fixed(width * 0.37)} ${fixed(-height * 0.52)} L ${fixed(
         width * 0.56
      )} ${fixed(height * 0.27)} L ${fixed(-width * 0.34)} ${fixed(
         height * 0.54
      )} Z" fill="#f7f5ed" stroke="#c34e2c" stroke-width="11" stroke-linejoin="round"/>`;
   } else if (profile.formKind === 'bar') {
      const width = 226 + random() * 72;
      const height = 82 + random() * 38;
      const corner = 13 + random() * 19;
      form = `<rect x="${fixed(-width / 2)}" y="${fixed(
         -height / 2
      )}" width="${fixed(width)}" height="${fixed(height)}" rx="${fixed(
         corner
      )}" fill="#f7f5ed" stroke="#c34e2c" stroke-width="12"/>`;
   } else if (profile.formKind === 'wideArc' || profile.formKind === 'shortArc') {
      const radius = 91 + random() * 30;
      const startAngle = -1.55 + random() * 0.42;
      const sweep =
         profile.formKind === 'wideArc'
            ? 2.2 + random() * 0.68
            : 1.38 + random() * 0.42;
      const endAngle = startAngle + sweep;
      const startX = Math.cos(startAngle) * radius;
      const startY = Math.sin(startAngle) * radius;
      const endX = Math.cos(endAngle) * radius;
      const endY = Math.sin(endAngle) * radius;
      const arc = `M ${fixed(startX)} ${fixed(startY)} A ${fixed(radius)} ${fixed(
         radius
      )} 0 0 1 ${fixed(endX)} ${fixed(endY)}`;
      const strokeWidth =
         profile.formKind === 'wideArc' ? 66 + random() * 24 : 88 + random() * 22;
      form = `<path d="${arc}" fill="none" stroke="#c34e2c" stroke-width="${fixed(
         strokeWidth + 18
      )}" stroke-linecap="round"/>
      <path d="${arc}" fill="none" stroke="#f7f5ed" stroke-width="${fixed(
         strokeWidth
      )}" stroke-linecap="round"/>`;
   } else if (profile.formKind === 'blob') {
      const pointCount = 7;
      const points = Array.from({ length: pointCount }, (_, index) => {
         const pointAngle =
            (index / pointCount) * Math.PI * 2 + (random() - 0.5) * 0.17;
         const radiusX = 102 + random() * 38;
         const radiusY = 82 + random() * 42;
         return {
            x: Math.cos(pointAngle) * radiusX,
            y: Math.sin(pointAngle) * radiusY,
         };
      });
      const midpoint = (first, second) => ({
         x: (first.x + second.x) / 2,
         y: (first.y + second.y) / 2,
      });
      const firstMidpoint = midpoint(points.at(-1), points[0]);
      const pathSegments = points.map((point, index) => {
         const next = points[(index + 1) % pointCount];
         const nextMidpoint = midpoint(point, next);
         return `Q ${fixed(point.x)} ${fixed(point.y)} ${fixed(
            nextMidpoint.x
         )} ${fixed(nextMidpoint.y)}`;
      });
      form = `<path d="M ${fixed(firstMidpoint.x)} ${fixed(
         firstMidpoint.y
      )} ${pathSegments.join(
         ' '
      )} Z" fill="#f7f5ed" stroke="#c34e2c" stroke-width="11" stroke-linejoin="round"/>`;
   } else {
      const width = 174 + random() * 42;
      const height = 194 + random() * 48;
      form = `<path d="M ${fixed(-width * 0.56)} ${fixed(
         -height * 0.46
      )} L ${fixed(width * 0.38)} ${fixed(-height * 0.34)} L ${fixed(
         width * 0.55
      )} ${fixed(height * 0.43)} L ${fixed(-width * 0.28)} ${fixed(
         height * 0.52
      )} Z" fill="#f7f5ed" stroke="#c34e2c" stroke-width="12" stroke-linejoin="round"/>`;
   }

   return `<g transform="translate(${fixed(x)} ${fixed(y)}) rotate(${fixed(
      angle
   )}) scale(${scale.toFixed(3)})">${form}</g>`;
};

const makeSymbolComposition = (random, profile, symbol, artInnerRadius) => {
   // Consume the old arbitrary-rotation draw so the established deterministic
   // direction, distance, and scale draws retain exactly the same positions.
   random();
   const direction = random() * Math.PI * 2;
   const distance =
      remapDominantDistance(profile.dominantDistance, artInnerRadius) +
      (random() - 0.5) * 10;
   const x = MEDALLION_CENTER + Math.cos(direction) * distance;
   const y = MEDALLION_CENTER + Math.sin(direction) * distance;
   const profileScale = profile.dominantScale + (random() - 0.5) * 0.06;
   const [minX, minY, width, height] = symbol.viewBox;
   const centerX = minX + width / 2;
   const centerY = minY + height / 2;
   const scale =
      (profileScale * DOMINANT_SYMBOL_FOOTPRINT) / Math.max(width, height);

   return `<g transform="translate(${fixed(x)} ${fixed(y)}) scale(${scale.toFixed(
      3
   )}) translate(${fixed(-centerX)} ${fixed(-centerY)})">${symbol.geometry}</g>`;
};

const makeMarkerSvg = (artifact, profileIndex, symbol, qrGeometry) => {
   const seed = hashSlug(artifact.slug);
   const random = randomFromSeed(seed);
   const profile = ABSTRACT_PROFILES[profileIndex];
   const clipId = `medallion-${artifact.slug}`;
   const qrClipId = `qr-matrix-${artifact.slug}`;
   const reliefPatches = makeReliefPatches(random, qrGeometry.fieldCornerRadius);
   const hatchField = makeHatchField(
      random,
      profile,
      qrGeometry.fieldCornerRadius
   );
   const microMarks = makeMicroMarks(random, qrGeometry.fieldCornerRadius);
   const brokenRim = makeBrokenRim(random);
   const dominantComposition = symbol
      ? makeSymbolComposition(
           random,
           profile,
           symbol,
           qrGeometry.fieldCornerRadius
        )
      : makeAbstractComposition(random, profile, qrGeometry.fieldCornerRadius);
   const { modules, finder } = makeQrMatrixElements({
      qr: qrGeometry.qr,
      matrixOrigin: qrGeometry.matrixOrigin,
      cell: qrGeometry.moduleSize,
      darkColor: '#101317',
      lightColor: '#f8f7f2',
      moduleRadiusFraction: 0.58,
   });

   return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${PRINT_CANVAS_SIZE_MM.toFixed(
      2
   )}mm" height="${PRINT_CANVAS_SIZE_MM.toFixed(
      2
   )}mm" viewBox="0 0 ${TARGET_SIZE} ${TARGET_SIZE}">
  <metadata data-printed-medallion-diameter-mm="${PRINTED_MEDALLION_DIAMETER_MM}" data-square-canvas-mm="${PRINT_CANVAS_SIZE_MM.toFixed(
     2
  )}" data-seed="${seed}"/>
  <defs>
    <clipPath id="${clipId}">
      <circle cx="${MEDALLION_CENTER}" cy="${MEDALLION_CENTER}" r="${MEDALLION_RADIUS}"/>
    </clipPath>
    <clipPath id="${qrClipId}">
      <rect x="${qrGeometry.matrixOrigin.toFixed(
         2
      )}" y="${qrGeometry.matrixOrigin.toFixed(
         2
      )}" width="${qrGeometry.qrSide.toFixed(
         2
      )}" height="${qrGeometry.qrSide.toFixed(2)}"/>
    </clipPath>
  </defs>
  <rect width="${TARGET_SIZE}" height="${TARGET_SIZE}" fill="#f8f7f2"/>
  <circle cx="${MEDALLION_CENTER}" cy="${MEDALLION_CENTER}" r="${MEDALLION_RADIUS}" fill="#101317"/>
  <g clip-path="url(#${clipId})">
    ${reliefPatches}
    ${hatchField}
    ${microMarks}
    ${brokenRim}
    ${dominantComposition}
  </g>
  <rect x="${qrGeometry.fieldOrigin.toFixed(
     2
  )}" y="${qrGeometry.fieldOrigin.toFixed(
     2
  )}" width="${qrGeometry.fieldSide.toFixed(
     2
  )}" height="${qrGeometry.fieldSide.toFixed(2)}" fill="#f8f7f2"/>
  <g clip-path="url(#${qrClipId})">${modules}</g>
  ${finder(0, 0)}
  ${finder(qrGeometry.moduleCount - 7, 0)}
  ${finder(0, qrGeometry.moduleCount - 7)}
  <circle cx="${MEDALLION_CENTER}" cy="${MEDALLION_CENTER}" r="${MEDALLION_RADIUS}" fill="none" stroke="#101317" stroke-width="9"/>
</svg>`;
};

const isFinderCell = (row, column, size) =>
   (row < 7 && column < 7) ||
   (row < 7 && column >= size - 7) ||
   (row >= size - 7 && column < 7);

const makeQrGeometry = (url) => {
   const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
   const moduleCount = qr.modules.size;
   const qrSide = QR_FIELD_FRACTION * MEDALLION_RADIUS * 2;
   const moduleSize = qrSide / moduleCount;
   const fieldSide = qrSide + 2 * QR_QUIET_MODULES * moduleSize;
   const fieldOrigin = MEDALLION_CENTER - fieldSide / 2;
   return {
      qr,
      moduleCount,
      qrSide,
      moduleSize,
      fieldSide,
      fieldOrigin,
      matrixOrigin: fieldOrigin + QR_QUIET_MODULES * moduleSize,
      fieldCornerRadius: fieldSide / Math.SQRT2,
   };
};

const makeQrMatrixElements = ({
   qr,
   matrixOrigin,
   cell,
   darkColor,
   lightColor,
   moduleRadiusFraction = 0.39,
   centerClearance = null,
}) => {
   const moduleCount = qr.modules.size;
   const center = (moduleCount - 1) / 2;
   const modules = [];

   for (let row = 0; row < moduleCount; row += 1) {
      for (let column = 0; column < moduleCount; column += 1) {
         if (!qr.modules.get(row, column)) continue;
         if (isFinderCell(row, column, moduleCount)) continue;
         if (
            centerClearance !== null &&
            Math.hypot(row - center, column - center) < centerClearance
         ) {
            continue;
         }

         const cx = matrixOrigin + (column + 0.5) * cell;
         const cy = matrixOrigin + (row + 0.5) * cell;
         modules.push(
            `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(
               cell * moduleRadiusFraction
            ).toFixed(2)}" fill="${darkColor}"/>`
         );
      }
   }

   const finder = (column, row) => {
      const x = matrixOrigin + column * cell;
      const y = matrixOrigin + row * cell;
      const side = cell * 7;
      return `<g>
  <rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${side.toFixed(
     2
  )}" height="${side.toFixed(2)}" rx="${(cell * 1.55).toFixed(
     2
  )}" fill="${darkColor}"/>
  <rect x="${(x + cell).toFixed(2)}" y="${(y + cell).toFixed(2)}" width="${(
     cell * 5
  ).toFixed(2)}" height="${(cell * 5).toFixed(2)}" rx="${(cell * 0.9).toFixed(
     2
  )}" fill="${lightColor}"/>
  <rect x="${(x + cell * 2).toFixed(2)}" y="${(y + cell * 2).toFixed(
     2
  )}" width="${(cell * 3).toFixed(2)}" height="${(cell * 3).toFixed(2)}" rx="${(
     cell * 0.8
  ).toFixed(2)}" fill="${darkColor}"/>
</g>`;
   };

   return { modules: modules.join(''), finder };
};

const makeQrSvg = (artifact, url) => {
   const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
   const moduleCount = qr.modules.size;
   const fieldSize = 860;
   const cell = fieldSize / (moduleCount + 8);
   const fieldOrigin = (1200 - fieldSize) / 2;
   const matrixOrigin = fieldOrigin + cell * 4;
   const centerClearance = 3.4;
   const { modules, finder } = makeQrMatrixElements({
      qr,
      matrixOrigin,
      cell,
      darkColor: '#20140e',
      lightColor: '#fffdf7',
      centerClearance,
   });

   const logoRadius = cell * 3.25;
   return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(artifact.name)} AR QR code</title>
  <description id="description">QR code opening ${escapeXml(url)}</description>
  <rect width="1200" height="1200" fill="#fffdf7"/>
  <circle cx="600" cy="600" r="566" fill="#fffdf7" stroke="#2f1c12" stroke-width="18"/>
  <circle cx="600" cy="600" r="542" fill="none" stroke="#c28335" stroke-width="5" stroke-dasharray="3 15" stroke-linecap="round"/>
  ${modules}
  ${finder(0, 0)}
  ${finder(moduleCount - 7, 0)}
  ${finder(0, moduleCount - 7)}
  <circle cx="600" cy="600" r="${(logoRadius + cell * 0.55).toFixed(
     2
  )}" fill="#fffdf7"/>
  <circle cx="600" cy="600" r="${logoRadius.toFixed(
     2
  )}" fill="#2c1a11" stroke="#c28335" stroke-width="${(cell * 0.3).toFixed(2)}"/>
  <text x="600" y="${(600 + cell * 1.15).toFixed(
     2
  )}" text-anchor="middle" fill="#f4d28f" font-family="Georgia, 'Times New Roman', serif" font-size="${(
     cell * 3.5
  ).toFixed(2)}" font-weight="700">S</text>
  <rect x="378" y="1042" width="444" height="52" rx="26" fill="#fffdf7"/>
  <text x="600" y="1076" text-anchor="middle" fill="#2c1a11" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="3">${escapeXml(
     artifact.name.toUpperCase()
  )} · AR</text>
  <metadata data-url="${escapeXml(url)}" data-error-correction="H"/>
</svg>`;
};

const renderTargetPixels = async (artifact, markerSvg) => {
   const raster = await sharp(Buffer.from(markerSvg))
      .resize(TARGET_SIZE, TARGET_SIZE, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

   if (raster.info.channels !== 4) {
      throw new Error(`Expected RGBA marker data for ${artifact.slug}`);
   }
   return raster;
};

const printedMillimetresPerMarkerUnit =
   PRINTED_MEDALLION_DIAMETER_MM / (MEDALLION_RADIUS * 2);

const verifyQrGeometry = (artifact, qrGeometry) => {
   const moduleSizeMm = qrGeometry.moduleSize * printedMillimetresPerMarkerUnit;
   const annulusMm =
      (MEDALLION_DETAIL_RADIUS - qrGeometry.fieldCornerRadius) *
      printedMillimetresPerMarkerUnit;

   process.stdout.write(
      `  ${artifact.slug} QR geometry: ${moduleSizeMm.toFixed(
         2
      )} mm/module, ${annulusMm.toFixed(2)} mm art annulus at field corner.\n`
   );

   if (moduleSizeMm < MINIMUM_QR_MODULE_MM) {
      throw new Error(
         `${artifact.slug} QR modules are ${moduleSizeMm.toFixed(
            2
         )} mm, below the ${MINIMUM_QR_MODULE_MM.toFixed(2)} mm minimum.`
      );
   }
   if (annulusMm < MINIMUM_ART_ANNULUS_MM) {
      throw new Error(
         `${artifact.slug} art annulus is ${annulusMm.toFixed(
            2
         )} mm at the QR field corner, below the ${MINIMUM_ART_ANNULUS_MM.toFixed(
            2
         )} mm minimum.`
      );
   }

   return { moduleSizeMm, annulusMm };
};

const rasterizeMarker = (markerSvg, size) =>
   sharp(Buffer.from(markerSvg), {
      density: (size * 25.4) / PRINT_CANVAS_SIZE_MM,
   })
      .resize(size, size, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

const verifyQrDecodes = async (artifact, markerSvg, expectedUrl) => {
   const results = [];

   for (const size of QR_DECODE_SIZES) {
      const raster = await rasterizeMarker(markerSvg, size);
      const decoded = jsQR(
         new Uint8ClampedArray(
            raster.data.buffer,
            raster.data.byteOffset,
            raster.data.byteLength
         ),
         raster.info.width,
         raster.info.height,
         { inversionAttempts: 'dontInvert' }
      );
      results.push({
         size,
         decodedPayload: decoded?.data ?? null,
         passed: decoded?.data === expectedUrl,
      });
   }

   const passingSizes = results
      .filter((result) => result.passed)
      .map((result) => result.size);
   const smallestPassingSize = passingSizes.length
      ? Math.min(...passingSizes)
      : null;
   process.stdout.write(
      `  ${artifact.slug} QR decode: ${results
         .map((result) => `${result.size}px ${result.passed ? 'pass' : 'fail'}`)
         .join(', ')}; smallest passing size ${
         smallestPassingSize === null ? 'none' : `${smallestPassingSize}px`
      }.\n`
   );

   const requiredFailure = results.find(
      (result) => result.size >= 512 && !result.passed
   );
   if (requiredFailure) {
      const decodedDetail = requiredFailure.decodedPayload
         ? ` decoded "${requiredFailure.decodedPayload}" instead`
         : ' did not decode';
      throw new Error(
         `${artifact.slug} QR at ${requiredFailure.size}px${decodedDetail}; expected exactly "${expectedUrl}".`
      );
   }

   return { results, smallestPassingSize };
};

const compileTarget = async (artifact, raster) => {
   const compiler = new OfflineCompiler();
   let reportedBucket = -1;
   await compiler.compileImageTargets(
      [
         {
            data: new Uint8ClampedArray(raster.data),
            width: raster.info.width,
            height: raster.info.height,
         },
      ],
      (percent) => {
         const bucket = Math.min(10, Math.floor(percent / 10));
         if (bucket !== reportedBucket) {
            reportedBucket = bucket;
            process.stdout.write(
               `  ${artifact.slug}: compiling target ${bucket * 10}%\n`
            );
         }
      }
   );

   return compiler.exportData();
};

const meanDiscPixelDifference = (
   first,
   second,
   width,
   height,
   rotationDegrees
) => {
   const radians = (rotationDegrees * Math.PI) / 180;
   const cosine = Math.cos(radians);
   const sine = Math.sin(radians);
   const centerX = width / 2;
   const centerY = height / 2;
   const comparisonRadius = MEDALLION_RADIUS - 4;
   const radiusSquared = comparisonRadius * comparisonRadius;
   let totalDifference = 0;
   let comparedChannels = 0;

   for (
      let y = Math.floor(centerY - comparisonRadius);
      y <= Math.ceil(centerY + comparisonRadius);
      y += 1
   ) {
      for (
         let x = Math.floor(centerX - comparisonRadius);
         x <= Math.ceil(centerX + comparisonRadius);
         x += 1
      ) {
         const dx = x + 0.5 - centerX;
         const dy = y + 0.5 - centerY;
         if (dx * dx + dy * dy > radiusSquared) continue;

         const rotatedX = Math.floor(centerX + dx * cosine - dy * sine);
         const rotatedY = Math.floor(centerY + dx * sine + dy * cosine);
         if (
            rotatedX < 0 ||
            rotatedX >= width ||
            rotatedY < 0 ||
            rotatedY >= height
         ) {
            continue;
         }

         const firstOffset = (y * width + x) * 4;
         const secondOffset = (rotatedY * width + rotatedX) * 4;
         for (let channel = 0; channel < 3; channel += 1) {
            totalDifference += Math.abs(
               first[firstOffset + channel] - second[secondOffset + channel]
            );
            comparedChannels += 1;
         }
      }
   }

   return (totalDifference / comparedChannels / 255) * 100;
};

const measureRotationalAsymmetry = (raster) =>
   Object.fromEntries(
      ASYMMETRY_ROTATIONS.map((rotation) => [
         rotation,
         meanDiscPixelDifference(
            raster.data,
            raster.data,
            raster.info.width,
            raster.info.height,
            rotation
         ),
      ])
   );

const verifyAsymmetry = (artifact, measurements) => {
   for (const [rotation, difference] of Object.entries(measurements)) {
      if (difference < MINIMUM_ASYMMETRY_PERCENT) {
         throw new Error(
            `${
               artifact.slug
            } is rotationally ambiguous at ${rotation} degrees: ${difference.toFixed(
               2
            )}% RGB MAD is below the ${MINIMUM_ASYMMETRY_PERCENT}% minimum.`
         );
      }
   }
};

const verifyMindTarget = async (artifact, targetPath) => {
   const encodedTarget = await fs.readFile(targetPath);
   const compiler = new OfflineCompiler();
   const imported = compiler.importData(encodedTarget);
   const target = imported[0];
   if (
      imported.length !== 1 ||
      target?.targetImage?.width !== TARGET_SIZE ||
      target?.targetImage?.height !== TARGET_SIZE ||
      !Array.isArray(target?.matchingData) ||
      target.matchingData.length === 0 ||
      !Array.isArray(target?.trackingData) ||
      target.trackingData.length === 0
   ) {
      throw new Error(`Could not re-import ${artifact.slug}.mind.`);
   }
   process.stdout.write(
      `  ${artifact.slug}: re-imported .mind (${target.matchingData.length} matching scales, ${target.trackingData.length} tracking scales)\n`
   );
};

const reportCrossDesignDifference = (rasters) => {
   const comparisonRotations = [0, 45, 90, 135, 180, 225, 270, 315];
   let closest = null;

   for (let firstIndex = 0; firstIndex < rasters.length; firstIndex += 1) {
      for (
         let secondIndex = firstIndex + 1;
         secondIndex < rasters.length;
         secondIndex += 1
      ) {
         const first = rasters[firstIndex];
         const second = rasters[secondIndex];
         for (const rotation of comparisonRotations) {
            const difference = meanDiscPixelDifference(
               first.raster.data,
               second.raster.data,
               first.raster.info.width,
               first.raster.info.height,
               rotation
            );
            if (!closest || difference < closest.difference) {
               closest = {
                  first: first.artifact.slug,
                  second: second.artifact.slug,
                  rotation,
                  difference,
               };
            }
         }
      }
   }

   if (closest) {
      process.stdout.write(
         `Closest cross-design comparison: ${closest.first}/${
            closest.second
         } at ${closest.rotation} degrees = ${closest.difference.toFixed(
            2
         )}% RGB MAD.\n`
      );
   }
};

const copyDracoDecoders = async () => {
   const decoderFiles = [
      'draco_decoder.wasm',
      'draco_wasm_wrapper.js',
      'draco_decoder.js',
   ];
   await Promise.all(
      decoderFiles.map((filename) =>
         fs.copyFile(
            path.join(THREE_DRACO_DIR, filename),
            path.join(DRACO_DIR, filename)
         )
      )
   );
};

const main = async () => {
   const baseUrl = normalizeBaseUrl();

   await Promise.all(
      [PRINT_DIR, TARGET_DIR, DRACO_DIR].map((directory) =>
         fs.mkdir(directory, { recursive: true })
      )
   );

   process.stdout.write(`Generating AR print assets for ${baseUrl.href}\n`);
   process.stdout.write(
      `Medallion print config: ${PRINTED_MEDALLION_DIAMETER_MM} mm diameter on a ${PRINT_CANVAS_SIZE_MM.toFixed(
         2
      )} mm square canvas (override with AR_MARKER_DIAMETER_MM).\n`
   );
   process.stdout.write(
      `Rotational asymmetry minimum: ${MINIMUM_ASYMMETRY_PERCENT}% RGB MAD over the disc.\n`
   );
   process.stdout.write(
      `QR geometry minimums: ${MINIMUM_QR_MODULE_MM.toFixed(
         2
      )} mm/module and ${MINIMUM_ART_ANNULUS_MM.toFixed(
         2
      )} mm art annulus at the field corner.\n`
   );

   const generatedRasters = [];

   for (const [profileIndex, artifact] of artifacts.entries()) {
      const symbol = await loadArtifactSymbol(artifact);
      const routeUrl = new URL(`ar/${artifact.slug}`, baseUrl).href;
      const qrGeometry = makeQrGeometry(routeUrl);
      const markerSvg = makeMarkerSvg(artifact, profileIndex, symbol, qrGeometry);
      const qrSvg = makeQrSvg(artifact, routeUrl);
      verifyQrGeometry(artifact, qrGeometry);
      await verifyQrDecodes(artifact, markerSvg, routeUrl);
      const raster = await renderTargetPixels(artifact, markerSvg);
      const asymmetry = measureRotationalAsymmetry(raster);
      verifyAsymmetry(artifact, asymmetry);
      process.stdout.write(
         `  ${artifact.slug} asymmetry: ${ASYMMETRY_ROTATIONS.map(
            (rotation) => `${rotation} degrees ${asymmetry[rotation].toFixed(2)}%`
         ).join(', ')}\n`
      );
      generatedRasters.push({ artifact, raster });

      await Promise.all([
         fs.writeFile(
            path.join(PRINT_DIR, `${artifact.slug}-tracking-marker.svg`),
            markerSvg
         ),
         sharp(Buffer.from(markerSvg))
            .resize(PRINT_SIZE, PRINT_SIZE, { fit: 'fill' })
            .withMetadata({ density: PRINT_DENSITY_DPI })
            .png({ compressionLevel: 9 })
            .toFile(path.join(PRINT_DIR, `${artifact.slug}-tracking-marker.png`)),
         fs.writeFile(path.join(PRINT_DIR, `${artifact.slug}-qr.svg`), qrSvg),
      ]);

      const target = await compileTarget(artifact, raster);
      const targetPath = path.join(TARGET_DIR, `${artifact.slug}.mind`);
      await fs.writeFile(targetPath, target);
      await verifyMindTarget(artifact, targetPath);
   }

   reportCrossDesignDifference(generatedRasters);
   await copyDracoDecoders();
   process.stdout.write(
      `Done. Generated ${artifacts.length} marker sets, MindAR targets, and QR codes.\n`
   );
};

await main();
