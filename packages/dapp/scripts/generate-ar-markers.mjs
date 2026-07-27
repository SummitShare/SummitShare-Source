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

const artifacts = [
   {
      slug: 'calabash',
      name: 'Calabash',
      accession: 'SS-WH-05',
      description: 'Engraved gourd with a hand-knitted fibre carrying nest',
      association: 'Mukwae Nalolo · Barotse Kingdom, Zambia',
      reference: 'SMVK 1996935 · SummitShare digital twin',
      seed: 17,
   },
   {
      slug: 'cowry',
      name: 'Cowry Beads',
      accession: 'SS-WH-02',
      description:
         'Leather belt with cowry shells · a record of long-distance trade',
      association: 'Mwape · Luangwa Valley, Zambia',
      reference: 'SMVK 1600518 · SummitShare digital twin',
      seed: 29,
   },
   {
      slug: 'drum',
      name: 'Double Sided Drum',
      accession: 'SS-WH-01',
      description: 'Royal wood, fibre and python-skin drum',
      association: 'Mwenya Mukulu · Mbala / Mpulungu, Zambia',
      reference: 'SMVK 1996946 · SummitShare digital twin',
      seed: 43,
   },
   {
      slug: 'headrest',
      name: 'Headrest',
      accession: 'SS-WH-04',
      description: 'Carved from a single block of engraved, treated wood',
      association: 'Julia Chikamoneka · Northern Zambia',
      reference: 'SMVK 1261202 · SummitShare digital twin',
      seed: 61,
   },
   {
      slug: 'mask',
      name: 'Luvale Mask',
      accession: 'SS-WH-06',
      description: 'Mwanapewo mask · Makishi masquerade tradition',
      association: 'Loongo · Mumbwa, Zambia',
      reference: 'SMVK 2042752 · SummitShare digital twin',
      seed: 73,
   },
   {
      slug: 'snuff',
      name: 'Snuff Cup',
      accession: 'SS-WH-03',
      description: 'Engraved, oil-treated wood with three openings',
      association: 'Lueji Wa Nkonde · North-Western Zambia',
      reference: 'SMVK 1304494 · SummitShare digital twin',
      seed: 89,
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

const makeFeatureField = (seed) => {
   const random = randomFromSeed(seed);
   const features = [];

   for (let index = 0; index < 34; index += 1) {
      const x = 102 + random() * 820;
      const y = 105 + random() * 810;
      const radius = 2 + random() * 6;
      const variant = index % 3;
      if (variant === 0) {
         features.push(
            `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(
               1
            )}" r="${radius.toFixed(
               1
            )}" fill="none" stroke="#512f1d" stroke-width="${(
               1.3 +
               random() * 1.8
            ).toFixed(1)}"/>`
         );
      } else if (variant === 1) {
         const angle = random() * Math.PI * 2;
         const length = 10 + random() * 24;
         features.push(
            `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} l ${(
               Math.cos(angle) * length
            ).toFixed(1)} ${(Math.sin(angle) * length).toFixed(1)} l ${(
               Math.cos(angle + 2.2) *
               length *
               0.55
            ).toFixed(1)} ${(Math.sin(angle + 2.2) * length * 0.55).toFixed(
               1
            )}" fill="none" stroke="#6c4025" stroke-width="${(
               1.2 +
               random() * 1.5
            ).toFixed(1)}"/>`
         );
      } else {
         const width = 5 + random() * 11;
         const height = 5 + random() * 13;
         features.push(
            `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(
               1
            )}" height="${height.toFixed(
               1
            )}" fill="#8d5d36" transform="rotate(${Math.round(
               random() * 70 - 35
            )} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
         );
      }
   }

   return features.join('');
};

const makeSideCode = (seed) => {
   const random = randomFromSeed(seed * 11);
   return Array.from({ length: 21 }, (_, index) => {
      const width = 2 + Math.floor(random() * 7);
      const y = 674 + index * 9;
      const length = 22 + Math.floor(random() * 52);
      return `<rect x="${
         890 - length
      }" y="${y}" width="${length}" height="${width}" fill="#2e1c13"/>`;
   }).join('');
};

const makeMarkerSvg = (artifact) => {
   const titleSize = artifact.name.length > 17 ? 57 : 70;
   const safeName = escapeXml(artifact.name);
   const safeDescription = escapeXml(artifact.description);
   const safeAssociation = escapeXml(artifact.association);
   const safeReference = escapeXml(artifact.reference);
   const safeAccession = escapeXml(artifact.accession);

   return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${TARGET_SIZE}" height="${TARGET_SIZE}" viewBox="0 0 1024 1024" role="img" aria-labelledby="title description">
  <title id="title">${safeName} tracking marker</title>
  <description id="description">Museum label and MindAR image target for the ${safeName} vitrine.</description>
  <rect width="1024" height="1024" fill="#fffdf7"/>
  <rect x="62" y="62" width="900" height="900" rx="8" fill="#efe4c9"/>
  <g opacity="0.23">${makeFeatureField(artifact.seed)}</g>
  <path d="M 90 90 H 934 V 934 H 90 Z" fill="none" stroke="#26170f" stroke-width="7"/>
  <path d="M 107 111 H 910 V 906 H 121 V 136" fill="none" stroke="#9e6a34" stroke-width="2.5"/>
  <path d="M 90 222 H 934" stroke="#26170f" stroke-width="3"/>
  <path d="M 90 642 H 934" stroke="#26170f" stroke-width="3"/>

  <g transform="translate(126 122)">
    <circle cx="44" cy="42" r="37" fill="#321e13"/>
    <path d="M 18 47 C 28 17, 56 12, 71 35 C 56 32, 44 45, 48 67 C 32 67, 22 60, 18 47 Z" fill="#d7a24c"/>
    <circle cx="59" cy="25" r="7" fill="#efe4c9"/>
    <path d="M 8 79 L 86 8" stroke="#321e13" stroke-width="5"/>
  </g>

  <text x="235" y="142" fill="#362116" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="5">SUMMITSHARE</text>
  <text x="235" y="177" fill="#76502f" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" letter-spacing="3.4">WOMEN OF HISTORY · DIGITAL COLLECTION</text>
  <text x="872" y="148" text-anchor="end" fill="#362116" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="2">${safeAccession}</text>

  <g transform="translate(132 279)">
    <text x="0" y="0" fill="#7b512f" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="4">ARTIFACT</text>
    <text x="0" y="92" fill="#23150e" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" font-weight="700">${safeName}</text>
    <path d="M 0 132 H 610" stroke="#a76d35" stroke-width="5"/>
    <path d="M 0 147 H 421" stroke="#26170f" stroke-width="2"/>
    <text x="0" y="198" fill="#3e2b20" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500">${safeDescription}</text>
    <text x="0" y="260" fill="#7b512f" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="3.5">ASSOCIATED HISTORY</text>
    <text x="0" y="300" fill="#23150e" font-family="Georgia, 'Times New Roman', serif" font-size="27" font-weight="700">${safeAssociation}</text>
  </g>

  <g transform="translate(132 700)">
    <text x="0" y="0" fill="#7b512f" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="3.5">COLLECTION REFERENCE</text>
    <text x="0" y="43" fill="#271910" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700">${safeReference}</text>
    <text x="0" y="96" fill="#4e3628" font-family="Arial, Helvetica, sans-serif" font-size="17">TRACKING LABEL · KEEP FLAT · DO NOT COVER</text>
    <path d="M 0 126 H 518" stroke="#26170f" stroke-width="2"/>
    <g transform="translate(0 154)">
      <circle cx="9" cy="9" r="9" fill="#26170f"/>
      <circle cx="43" cy="9" r="6" fill="#a76d35"/>
      <rect x="68" y="1" width="58" height="16" fill="#26170f"/>
      <path d="M 148 17 L 165 0 L 183 17 Z" fill="#a76d35"/>
      <rect x="203" y="0" width="12" height="18" fill="#26170f" transform="rotate(19 209 9)"/>
    </g>
  </g>

  <g>${makeSideCode(artifact.seed)}</g>
  <g transform="translate(842 268)">
    <path d="M 0 0 L 72 24 L 43 92 L 8 54 Z" fill="none" stroke="#26170f" stroke-width="4"/>
    <circle cx="9" cy="11" r="8" fill="#a76d35"/>
    <circle cx="61" cy="35" r="5" fill="#26170f"/>
    <path d="M 19 72 L 61 14" stroke="#7c4e2b" stroke-width="3"/>
  </g>
  <text x="934" y="892" transform="rotate(-90 934 892)" fill="#513323" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="2.5">${
     artifact.seed
  } · ${safeAccession} · IMAGE TARGET</text>
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

const compileTarget = async (artifact, markerSvg) => {
   const { data, info } = await sharp(Buffer.from(markerSvg))
      .resize(TARGET_SIZE, TARGET_SIZE, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

   if (info.channels !== 4) {
      throw new Error(`Expected RGBA marker data for ${artifact.slug}`);
   }

   const compiler = new OfflineCompiler();
   let reportedBucket = -1;
   await compiler.compileImageTargets(
      [
         {
            data: new Uint8ClampedArray(data),
            width: info.width,
            height: info.height,
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

   for (const artifact of artifacts) {
      const markerSvg = makeMarkerSvg(artifact);
      const routeUrl = new URL(`ar/${artifact.slug}`, baseUrl).href;
      const qrSvg = makeQrSvg(artifact, routeUrl);

      await Promise.all([
         fs.writeFile(
            path.join(PRINT_DIR, `${artifact.slug}-tracking-marker.svg`),
            markerSvg
         ),
         sharp(Buffer.from(markerSvg))
            .resize(PRINT_SIZE, PRINT_SIZE, { fit: 'fill' })
            .png({ compressionLevel: 9 })
            .toFile(path.join(PRINT_DIR, `${artifact.slug}-tracking-marker.png`)),
         fs.writeFile(path.join(PRINT_DIR, `${artifact.slug}-qr.svg`), qrSvg),
      ]);

      const target = await compileTarget(artifact, markerSvg);
      await fs.writeFile(path.join(TARGET_DIR, `${artifact.slug}.mind`), target);
   }

   await copyDracoDecoders();
   process.stdout.write(
      `Done. Generated ${artifacts.length} marker sets, MindAR targets, and QR codes.\n`
   );
};

await main();
