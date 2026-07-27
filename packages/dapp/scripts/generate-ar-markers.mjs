import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import sharp from 'sharp';
import { OfflineCompiler } from 'mind-ar/src/image-target/offline-compiler.js';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DAPP_DIR = path.resolve(SCRIPT_DIR, '..');
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
const DEFAULT_BASE_URL = 'http://localhost:3000';
const DEFAULT_PRINTED_MEDALLION_DIAMETER_MM = 90;
const MEDALLION_CENTER = TARGET_SIZE / 2;
const MEDALLION_RADIUS = 384;
const MEDALLION_DETAIL_RADIUS = MEDALLION_RADIUS - 18;
const ASYMMETRY_ROTATIONS = [45, 90, 135, 180];
const MINIMUM_ASYMMETRY_PERCENT = 16;

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

const pointOnCircle = (radius, angle) => ({
   x: MEDALLION_CENTER + Math.cos(angle) * radius,
   y: MEDALLION_CENTER + Math.sin(angle) * radius,
});

const makeReliefPatches = (random) =>
   Array.from({ length: 11 }, (_, index) => {
      const angle = random() * Math.PI * 2;
      const distance =
         (0.16 + Math.pow(random(), 0.7) * 0.72) * MEDALLION_DETAIL_RADIUS;
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

const makeHatchField = (random) => {
   const hatches = [];
   const dominantAngle = random() * Math.PI;
   const denseSide = random() * Math.PI * 2;

   for (let cluster = 0; cluster < 10; cluster += 1) {
      const clusterAngle =
         cluster < 4
            ? denseSide + (random() - 0.5) * 1.25
            : random() * Math.PI * 2;
      const distance =
         (0.12 + Math.pow(random(), 0.75) * 0.72) * MEDALLION_DETAIL_RADIUS;
      const centerX = MEDALLION_CENTER + Math.cos(clusterAngle) * distance;
      const centerY = MEDALLION_CENTER + Math.sin(clusterAngle) * distance;
      const hatchAngle =
         dominantAngle +
         (cluster % 3) * (0.34 + random() * 0.25) +
         (random() - 0.5) * 0.22;
      const count = 13 + Math.floor(random() * 16);

      for (let index = 0; index < count; index += 1) {
         const spreadX = (random() + random() - 1) * (52 + random() * 54);
         const spreadY = (random() + random() - 1) * (45 + random() * 48);
         const x = centerX + spreadX;
         const y = centerY + spreadY;
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

const makeMicroMarks = (random) => {
   const marks = [];
   for (let index = 0; index < 122; index += 1) {
      const angle = random() * Math.PI * 2;
      const distance = Math.sqrt(random()) * (MEDALLION_DETAIL_RADIUS - 20);
      const x = MEDALLION_CENTER + Math.cos(angle) * distance;
      const y = MEDALLION_CENTER + Math.sin(angle) * distance;
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

const EMBLEMS = [
   `<path d="M -35 -116 C -57 -89 -53 -54 -72 -26 C -111 28 -83 104 -18 126 C 47 149 112 100 98 34 C 91 2 62 -15 56 -48 C 51 -78 14 -103 -35 -116 Z" fill="#f7f5ed" stroke="#c34e2c" stroke-width="10"/>
    <path d="M -38 -88 C -7 -65 -2 -37 -18 -10 C -39 26 -24 73 18 98 M 30 -67 C 8 -33 18 5 51 29 M -61 35 C -24 23 17 42 43 75" fill="none" stroke="#101317" stroke-width="8" stroke-linecap="round"/>
    <path d="M -52 -119 C -39 -142 -6 -148 13 -132 C 3 -121 -13 -109 -29 -99" fill="none" stroke="#f7f5ed" stroke-width="9" stroke-linecap="round"/>
    <circle cx="66" cy="-51" r="13" fill="#101317"/>`,
   `<path d="M -119 16 C -91 -74 -4 -121 78 -82 C 128 -58 131 11 94 61 C 53 116 -54 128 -105 75 C -125 54 -130 37 -119 16 Z" fill="#f7f5ed" stroke="#c34e2c" stroke-width="10"/>
    <path d="M -70 23 C -32 -14 26 -31 73 -9 C 38 4 18 31 8 72 C -19 47 -43 34 -70 23 Z" fill="#101317"/>
    <path d="M -44 12 L -27 35 M -15 -4 L 3 23 M 20 -13 L 34 13 M 50 -15 L 60 2" stroke="#c34e2c" stroke-width="7" stroke-linecap="round"/>
    <path d="M -96 -21 C -75 -65 -32 -88 12 -90" fill="none" stroke="#101317" stroke-width="7" stroke-linecap="round"/>
    <circle cx="-78" cy="75" r="12" fill="#101317"/>`,
   `<path d="M -86 -102 L 67 -80 L 99 82 L -68 110 Z" fill="#f7f5ed" stroke="#c34e2c" stroke-width="10"/>
    <path d="M -86 -102 C -46 -127 31 -116 67 -80 M -68 110 C -19 132 60 118 99 82" fill="none" stroke="#101317" stroke-width="11" stroke-linecap="round"/>
    <path d="M -67 -68 L 79 48 M -72 -23 L 88 89 M -45 -91 L 86 7 M -61 67 L 51 113" stroke="#101317" stroke-width="6" stroke-linecap="round"/>
    <path d="M 91 -76 L 127 -123 M 111 -117 L 135 -102" stroke="#f7f5ed" stroke-width="10" stroke-linecap="round"/>
    <circle cx="-86" cy="30" r="13" fill="#c34e2c"/>`,
   `<path d="M -121 -51 C -68 -88 23 -96 112 -66 L 86 -22 C 32 -37 -31 -24 -88 2 Z" fill="#f7f5ed" stroke="#c34e2c" stroke-width="10"/>
    <path d="M -70 -1 L -43 90 L -6 91 L 14 -27 M 60 -30 L 72 62" fill="none" stroke="#f7f5ed" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M -62 94 C -14 111 44 99 86 67" fill="none" stroke="#c34e2c" stroke-width="12" stroke-linecap="round"/>
    <path d="M -70 17 L -28 6 M 27 -17 L 57 -8" stroke="#101317" stroke-width="8" stroke-linecap="round"/>
    <circle cx="98" cy="-50" r="11" fill="#101317"/>`,
   `<path d="M -58 -125 C -99 -89 -112 -26 -92 48 C -71 121 13 141 72 91 C 116 54 110 -32 73 -88 C 42 -135 -14 -151 -58 -125 Z" fill="#f7f5ed" stroke="#c34e2c" stroke-width="10"/>
    <path d="M -74 -80 L -112 -105 M -70 -49 L -123 -56 M 61 -95 L 89 -121" stroke="#f7f5ed" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="-38" cy="-29" rx="24" ry="14" fill="#101317" transform="rotate(-17 -38 -29)"/>
    <path d="M 18 -45 L 57 -26 L 26 -8 Z" fill="#101317"/>
    <path d="M -4 -23 C -19 19 -10 41 18 47 M -38 75 C -6 58 30 64 51 85" fill="none" stroke="#101317" stroke-width="9" stroke-linecap="round"/>
    <circle cx="72" cy="29" r="12" fill="#c34e2c"/>`,
   `<path d="M -90 -71 C -46 -105 37 -101 75 -55 L 65 88 C 17 119 -49 113 -82 72 Z" fill="#f7f5ed" stroke="#c34e2c" stroke-width="10"/>
    <path d="M 72 -43 C 130 -50 134 29 93 56 C 83 63 75 66 66 65" fill="none" stroke="#f7f5ed" stroke-width="18" stroke-linecap="round"/>
    <ellipse cx="-44" cy="-67" rx="24" ry="13" fill="#101317" transform="rotate(-9 -44 -67)"/>
    <ellipse cx="7" cy="-76" rx="20" ry="12" fill="#101317" transform="rotate(13 7 -76)"/>
    <ellipse cx="49" cy="-56" rx="16" ry="10" fill="#101317" transform="rotate(-22 49 -56)"/>
    <path d="M -62 -18 C -18 3 8 31 31 78 M -28 -42 C -2 -24 25 -8 54 -3" fill="none" stroke="#101317" stroke-width="8" stroke-linecap="round"/>
    <circle cx="-75" cy="60" r="11" fill="#c34e2c"/>`,
];

const makeEmblem = (variant, random) => {
   const angle = random() * 32 - 16;
   const direction = random() * Math.PI * 2;
   const distance = 72 + random() * 42;
   const x = MEDALLION_CENTER + Math.cos(direction) * distance;
   const y = MEDALLION_CENTER + Math.sin(direction) * distance;
   const scale = 0.88 + random() * 0.16;
   return `<g transform="translate(${fixed(x)} ${fixed(y)}) rotate(${fixed(
      angle
   )}) scale(${scale.toFixed(3)})">${EMBLEMS[variant]}</g>`;
};

const makeMarkerSvg = (artifact, emblemVariant) => {
   const seed = hashSlug(artifact.slug);
   const random = randomFromSeed(seed);
   const clipId = `medallion-${artifact.slug}`;
   const reliefPatches = makeReliefPatches(random);
   const hatchField = makeHatchField(random);
   const microMarks = makeMicroMarks(random);
   const brokenRim = makeBrokenRim(random);
   const emblem = makeEmblem(emblemVariant, random);

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
  </defs>
  <rect width="${TARGET_SIZE}" height="${TARGET_SIZE}" fill="#f8f7f2"/>
  <circle cx="${MEDALLION_CENTER}" cy="${MEDALLION_CENTER}" r="${MEDALLION_RADIUS}" fill="#101317"/>
  <g clip-path="url(#${clipId})">
    ${reliefPatches}
    ${hatchField}
    ${microMarks}
    ${brokenRim}
    ${emblem}
  </g>
  <circle cx="${MEDALLION_CENTER}" cy="${MEDALLION_CENTER}" r="${MEDALLION_RADIUS}" fill="none" stroke="#101317" stroke-width="9"/>
</svg>`;
};

const isFinderCell = (row, column, size) =>
   (row < 7 && column < 7) ||
   (row < 7 && column >= size - 7) ||
   (row >= size - 7 && column < 7);

const makeQrSvg = (artifact, url) => {
   const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
   const moduleCount = qr.modules.size;
   const fieldSize = 860;
   const cell = fieldSize / (moduleCount + 8);
   const fieldOrigin = (1200 - fieldSize) / 2;
   const matrixOrigin = fieldOrigin + cell * 4;
   const center = (moduleCount - 1) / 2;
   const centerClearance = 3.4;
   const modules = [];

   for (let row = 0; row < moduleCount; row += 1) {
      for (let column = 0; column < moduleCount; column += 1) {
         if (!qr.modules.get(row, column)) continue;
         if (isFinderCell(row, column, moduleCount)) continue;
         if (Math.hypot(row - center, column - center) < centerClearance) {
            continue;
         }

         const cx = matrixOrigin + (column + 0.5) * cell;
         const cy = matrixOrigin + (row + 0.5) * cell;
         modules.push(
            `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(
               cell * 0.39
            ).toFixed(2)}" fill="#20140e"/>`
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
  )}" fill="#20140e"/>
  <rect x="${(x + cell).toFixed(2)}" y="${(y + cell).toFixed(2)}" width="${(
     cell * 5
  ).toFixed(2)}" height="${(cell * 5).toFixed(2)}" rx="${(cell * 0.9).toFixed(
     2
  )}" fill="#fffdf7"/>
  <rect x="${(x + cell * 2).toFixed(2)}" y="${(y + cell * 2).toFixed(
     2
  )}" width="${(cell * 3).toFixed(2)}" height="${(cell * 3).toFixed(2)}" rx="${(
     cell * 0.8
  ).toFixed(2)}" fill="#20140e"/>
</g>`;
   };

   const logoRadius = cell * 3.25;
   return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(artifact.name)} AR QR code</title>
  <description id="description">QR code opening ${escapeXml(url)}</description>
  <rect width="1200" height="1200" fill="#fffdf7"/>
  <circle cx="600" cy="600" r="566" fill="#fffdf7" stroke="#2f1c12" stroke-width="18"/>
  <circle cx="600" cy="600" r="542" fill="none" stroke="#c28335" stroke-width="5" stroke-dasharray="3 15" stroke-linecap="round"/>
  ${modules.join('')}
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

const normalizeBaseUrl = () => {
   const configured = process.env.AR_BASE_URL?.trim() || DEFAULT_BASE_URL;
   const url = new URL(configured);
   url.hash = '';
   url.search = '';
   if (!url.pathname.endsWith('/')) {
      url.pathname = `${url.pathname}/`;
   }
   return url;
};

const main = async () => {
   await Promise.all(
      [PRINT_DIR, TARGET_DIR, DRACO_DIR].map((directory) =>
         fs.mkdir(directory, { recursive: true })
      )
   );

   const baseUrl = normalizeBaseUrl();
   process.stdout.write(`Generating AR print assets for ${baseUrl.href}\n`);
   process.stdout.write(
      `Medallion print config: ${PRINTED_MEDALLION_DIAMETER_MM} mm diameter on a ${PRINT_CANVAS_SIZE_MM.toFixed(
         2
      )} mm square canvas (override with AR_MARKER_DIAMETER_MM).\n`
   );
   process.stdout.write(
      `Rotational asymmetry minimum: ${MINIMUM_ASYMMETRY_PERCENT}% RGB MAD over the disc.\n`
   );

   const generatedRasters = [];

   for (const [artifactIndex, artifact] of artifacts.entries()) {
      const markerSvg = makeMarkerSvg(artifact, artifactIndex);
      const routeUrl = new URL(`ar/${artifact.slug}`, baseUrl).href;
      const qrSvg = makeQrSvg(artifact, routeUrl);
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
