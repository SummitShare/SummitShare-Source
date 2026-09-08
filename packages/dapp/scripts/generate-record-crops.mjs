#!/usr/bin/env node
/**
 * Regenerates the portrait mural variants the record gallery serves to phones.
 *
 * Derived, not authored: the output is the source mural with a cropped viewBox
 * and nothing else changed, so it never needs design input and never drifts
 * from the artwork. Re-run it whenever a `graphics-N.svg` is replaced.
 *
 *   pnpm --filter dapp generate:record-crops
 *   pnpm --filter dapp generate:record-crops --check   # CI-safe, writes nothing
 *
 * See scripts/lib/recordCrops.mjs for why the window is square.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cropMuralSvg, portraitVariant } from './lib/recordCrops.mjs';

const RECORD_DIR = path.resolve(
   path.dirname(fileURLToPath(import.meta.url)),
   '../public/record'
);
const MURALS = ['graphics-1.svg', 'graphics-2.svg', 'graphics-3.svg'];
const checkOnly = process.argv.includes('--check');

let stale = 0;
for (const mural of MURALS) {
   const source = await readFile(path.join(RECORD_DIR, mural), 'utf8');
   const cropped = cropMuralSvg(source);
   const target = path.join(RECORD_DIR, portraitVariant(mural));

   if (checkOnly) {
      const current = await readFile(target, 'utf8').catch(() => null);
      if (current === cropped) {
         console.log(`ok      ${portraitVariant(mural)}`);
      } else {
         console.error(`STALE   ${portraitVariant(mural)}`);
         stale += 1;
      }
      continue;
   }

   await writeFile(target, cropped);
   console.log(`wrote   ${portraitVariant(mural)}`);
}

if (stale > 0) {
   console.error(
      `\n${stale} portrait mural(s) out of date. Run: pnpm --filter dapp generate:record-crops`
   );
   process.exit(1);
}
